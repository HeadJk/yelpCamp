if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Requiring Packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const MongoDBStore = require('connect-mongo')(session);

// Requiring Local Files
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const User = require('./models/user');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// const dbUrl = 'mongodb://localhost:27017/yelp-camp';

// Defining Routes
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

// Starting Database
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// Connecting Database and Logging Status
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Starting App
const app = express();

// View Engine Set-Up
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Using Express Methods
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}));

const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e);
})

// Configuring Cookies
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

// Using Packages
app.use(methodOverride('_method'));
app.use(morgan('common'));
app.use(flash());
app.use(mongoSanitize({
    replaceWith: '_'
}))
app.use(helmet());

// Configuring content Security
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://kit.fontawesome.com",
];
const styleSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
    "https://kit.fontawesome.com",
    "https://ka-f.fontawesome.com",
];
const fontSrcUrls = [
    "https://ka-f.fontawesome.com",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dmbtzn3we/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


// Passport Auth Initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Middleware
app.use((req, res, next) => {
    console.log(req.query);
    res.locals.origUrl = req.originalUrl;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// App Routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// Home Route
app.get('/', catchAsync(async (req, res) => {
    res.render('home');
}))

// Page Not Found Error
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Render Error Page
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No! Something went wrong!'
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
// Start Up Server
app.listen(port, () => {
    console.log(`SERVING ON PORT ${port}`);
})