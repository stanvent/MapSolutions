jQuery.support.cors = true;

var googleMap;
$(document).ready(function () {


    google.maps.event.addDomListener(window, 'load', initialize);

    /*
    $("#btnShowLayer1").click(function() { ShowLayer1() });

    $("#btnShowLayer2").click(function() { ShowLayer2() });
    */

    
});

function initialize() {

    var latlng = new google.maps.LatLng(51.5179843, -0.1833154);

    var mapOptions = {
        center: latlng,
        scrollWheel: false,
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    googleMap = map;
   

};



function ShowLayer1() {

    //http://localhost:8080/geoserver/WS_PostGIS/wms?service=WMS&version=1.1.0&request=GetMap&layers=WS_PostGIS:lnd_accidents&styles=&bbox=-6.04925870895386,49.9970092773438,1.79242122173309,57.4177131652832&width=768&height=726&srs=EPSG:4326&format=image%2Fpng

    var censusLayer =
     new google.maps.ImageMapType(
     {
         getTileUrl:
        function (coord, zoom) {
            // Compose URL for overlay tile

            var s = Math.pow(2, zoom);
            var twidth = 256;
            var theight = 256;

            //latlng bounds of the 4 corners of the google tile
            //Note the coord passed in represents the top left hand (NW) corner of the tile.
            var gBl = googleMap.getProjection().fromPointToLatLng(
              new google.maps.Point(coord.x * twidth / s, (coord.y + 1) * theight / s)); // bottom left / SW
            var gTr = googleMap.getProjection().fromPointToLatLng(
              new google.maps.Point((coord.x + 1) * twidth / s, coord.y * theight / s)); // top right / NE

            // Bounding box coords for tile in WMS pre-1.3 format (x,y)
            var bbox = gBl.lng() + "," + gBl.lat() + "," + gTr.lng() + "," + gTr.lat();

            //base WMS URL
            var url = "http://winserver:8080/geoserver/WS_PostGIS/wms?";

            url += "&service=WMS";           //WMS service
            url += "&version=1.1.0";         //WMS version 
            url += "&request=GetMap";        //WMS operation
            url += "&layers=WS_PostGIS:lnd_accidents"; //WMS layers to draw
            url += "&styles=";               //use default style
            url += "&format=image/png";      //image format
            url += "&TRANSPARENT=TRUE";      //only draw areas where we have data
            url += "&srs=EPSG:4326";         //projection WGS84
            url += "&bbox=" + bbox;          //set bounding box for tile
            url += "&width=256";             //tile size used by google
            url += "&height=256";
            //url += "&tiled=true";

            return url;                 //return WMS URL for the tile  
        }, //getTileURL

         tileSize: new google.maps.Size(256, 256),
         opacity: 0.85,
         isPng: true
     });

    // add WMS layer to map
    // google maps will end up calling the getTileURL for each tile in the map view
    googleMap.overlayMapTypes.push(censusLayer);
    /*
    var lineLayer = new google.maps.Data();
    lineLayer.setStyle({
        strokeColor: 'red',
        strokeWeight: 5
    });
    lineLayer.loadGeoJson('/api/GeoLayersApi/GetLineLayer');
    lineLayer.setMap(googleMap);
    */
};

function ShowLayer2() {
    var pointLayer = new google.maps.Data();
    pointLayer.setStyle({
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'red',
            fillOpacity: .2,
            strokeColor: 'white',
            strokeWeight: .5,
            scale: 10
        }
    });
    pointLayer.loadGeoJson('/api/GeoLayersApi/GetPointLayer');
    pointLayer.setMap(googleMap);
};
/* clustering examples
http://stackoverflow.com/questions/25267146/google-maps-javascript-api-v3-data-layer-markerclusterer
http://jsfiddle.net/doktormolle/myuua77p/
http://jsfiddle.net/gL3L7zso/3/
*/

/*
Задача: на основе карты высот строить градиент высоты между двумя точками
*/