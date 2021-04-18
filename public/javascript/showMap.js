mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10',
center: campground.geometry.coordinates,
zoom: 4 // starting zoom
});

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<p class="m-0 mt-2"><strong>${campground.title}</strong><br>${campground.location}</p>`
    )
)
.addTo(map)

window.addEventListener('load', (event) => {
    map.resize();
});