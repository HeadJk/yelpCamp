const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });
const { cloudinary } = require('../cloudinary');

module.exports.showAllCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({}).populate({
        path:'reviews'
    })
    res.render('campgrounds/index', { campgrounds });
}

module.exports.showCreateCampground = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground);
    req.flash('success', 'Successfully added campground!')
    res.redirect(`/campgrounds/${newCampground.id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate: {
            path:'author'
        }
    }).populate('author');
    console.log(campground);
    if(!campground){
        req.flash('error', 'Campground does not exist')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}

module.exports.showUserCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({author: req.user._id}).populate({
        path:'reviews'
    });
    res.render('campgrounds/owned', { campgrounds });
}

module.exports.showEditCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    campground.images.push(...req.files.map(f => ({url: f.path, filename: f.filename})));
    await campground.save();
    console.log(campground.images);
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}
