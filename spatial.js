d3.csv('CDPH_Environmental_Complaints_Clean.csv').then(function(data) {
    //const L = require('leaflet');

    var complaintCounts = {};
    data.forEach(function(d) {
        var lat = parseFloat(d['LATITUDE']);
        var lon = parseFloat(d['LONGITUDE']);
        var key = lat.toFixed(2) + ',' + lon.toFixed(2);
        if (complaintCounts[key] === undefined) {
            complaintCounts[key] = 0;
        }
        complaintCounts[key]++;
    });

    // Create an array of objects, each object representing a location and its corresponding complaint count
    var values = [];
    for (var location in complaintCounts) {
        var coords = location.split(',');
        values.push({
            'latitude': parseFloat(coords[0]),
            'longitude': parseFloat(coords[1]),
            'count': complaintCounts[location]
        });
    }


    

    // Load the GeoJSON data for the map of Chicago
    d3.json('chicago.geojson').then(function(geoData) {
        // Create a map using Leaflet.js
        var map = L.map('map').setView([41.8781, -87.6298], 10.3);  // Set the view to Chicago
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        // Add the GeoJSON data to the map
        L.geoJSON(geoData).addTo(map);

        // Create a heatmap layer
        var heatmapLayer = L.heatLayer([], { radius: 10 }).addTo(map);

        // Add data to the heatmap layer
        values.forEach(function(d) {
            // Add a point to the heatmap layer for each complaint
            for (var i = 0; i < d.count; i++) {
                // Check if latitude and longitude are valid numbers
                if (!isNaN(d.latitude) && !isNaN(d.longitude)) {
                    heatmapLayer.addLatLng([d.latitude, d.longitude]);
                } else {
                    console.error('Invalid coordinates:', d.latitude, d.longitude);
                }
            }
        });

        

    }).catch(console.error);
}).catch(console.error);