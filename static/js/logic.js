//url for last 7 days: all earthquakes 
var queryUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// earthquake marker based on size and color: higher mag are darker--

function markerSize(magnitude){
    return magnitude * 4;
}

function markerColor(magnitude){
    if (magnitude > 4){
        return 'red'
    } else if (magnitude > 3){
        return 'orange'
    } else if (magnitude > 2){
        return 'yellow'
    } else {
        return 'green'
    }
}

//get request and return json data

d3.json(queryUrl, function(data){
    var earthquakes= L.geoJSON(data.features, {
       onEachFeature: addPopup,
       pointToLayer: addMarker
    });

    createMap(earthquakes);
});

function addMarker (feature, location){
    var options= {
        stroke: false, 
        color: markerColor(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        radius: markerSize(feature.properties.mag)
    }
    return L.circleMarker(location, options);
}

//define functions with description for each popup
function addPopup(feature, layer){
    return layer.bindPopup(`<h3> ${feature.properties.place} </h3><hr><h4>Magnitude: ${feature.properties.mag} </h4><p> ${Date(feature.properties.time)}</p>`);
}

function createMap(earthquakes){
    //street maps and dark maps etc
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",{
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: "pk.eyJ1IjoiYXN0ZXZlbmUiLCJhIjoiY2s5enJiaHFoMGV6aTNucWljc3IwbmRwOCJ9.QQgaP-8zXJriWttHWziS-g"
    });

    var darkmap= L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",{
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: "pk.eyJ1IjoiYXN0ZXZlbmUiLCJhIjoiY2s5enJiaHFoMGV6aTNucWljc3IwbmRwOCJ9.QQgaP-8zXJriWttHWziS-g"
    });

    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    var overlayMaps= {
        Earthquakes: earthquakes
    };

    var myMap= L.map("map",{
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });
 

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}


