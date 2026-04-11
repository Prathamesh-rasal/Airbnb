
// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     center: [73, 16], // starting position [lng, lat]. Note that lat must be set between -90 and 90
//     zoom: 9 // starting zoom
// });


// Default center (India approx)
const map = L.map('map').setView([16, 73], 9);

// OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Marker
L.marker([28.644800,77.216721])
    .addTo(map)
    .bindPopup("Listing Location")
    .openPopup();