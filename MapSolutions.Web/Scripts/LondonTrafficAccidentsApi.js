jQuery.support.cors = true;
var markerClusterer = new MarkerClusterer();
var googleMap;
var apiUrl = '/api/LTAApi/GetAccidentsGeoJson';

var overlay;
USGSOverlay.prototype = new google.maps.OverlayView();

$(document).ready(function () {

    google.maps.event.addDomListener(window, 'load', initialize);
    
    $("#accident_year").change(function () { overlay.draw(); });
    $("#vehicle_type").change(function () { overlay.draw(); });
    
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

    //map.addListener('tilesloaded', SetOverlay(true));
    //map.addListener('tilesloaded', ShowAccidentsLayer(true));
    
    map.addListener('tilesloaded', SetOverlay(true));
    map.addListener('dragend', function () { overlay.draw(); });
    
    //ShowAccidentsLayer();

   /* 
    markerClusterer.setMap(map);
    google.maps.event.addListener(map.data, 'addfeature', function (e) {
        if (e.feature.getGeometry().getType() === 'Point') {
            var marker = new google.maps.Marker({
                position: e.feature.getGeometry().get(),
                title: e.feature.getProperty('name'),
                map: map
            });
            
           
            
            markerClusterer.addMarker(marker);
     */       
            /*bounds.extend(e.feature.getGeometry().get());
            map.fitBounds(bounds);
            map.setCenter(e.feature.getGeometry().get());*/
       /* }
    });
    
    var reqParams = { accidentYear: 2006, numberOfVehicles: 1, vehicleTypes: [] };

    var strparams = JSON.stringify(reqParams);

    $.ajax({
        url: apiUrl,
        type: 'POST',
        //data: strparams,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            
            layer = map.data.addGeoJson(data);
            map.data.setMap(null);
        },
        error: function (x, y, z) {
            alert(x + "\n" + y + "\n" + z);
        }
    });

    */
   
  
};

function SetOverlay(doClear) {

    if (!googleMap)
        return;
    var bounds = googleMap.getBounds();

    var srcImage = 'https://developers.google.com/maps/documentation/' + 'javascript/examples/full/images/talkeetna.png';

    overlay = new USGSOverlay(bounds, srcImage, googleMap);
};

function USGSOverlay(bounds, image, map) {

    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;

    this.div_ = null;

    this.setMap(map);
}

USGSOverlay.prototype.onAdd = function () {

    var div = document.createElement('div');
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';

    
    var img = document.createElement('img');
    
    img.id = 'overlayMapImageHeatmap';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';
    div.appendChild(img);

    this.div_ = div;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
};

USGSOverlay.prototype.draw = function () {

    if (!googleMap)
        return;

    this.bounds_ = googleMap.getBounds();

    if (!this.bounds_)
        return;

    var overlayProjection = this.getProjection();

    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
    //div.style.opacity = 0.5;

    var imageUrl = GetImageUrl(this.bounds_, div.clientWidth, div.clientHeight);
    $('#overlayMapImageHeatmap').attr('src', imageUrl);
};

/*function SetImageData(b64data) {

    $("#overlayMapImageHeatmap").attr("src", "data:image/png;base64," + b64data);
};
*/

function GetImageUrl(bounds, width, height) {

    var url = "http://winserver:8080/geoserver/WS_PostGIS/wms?";

    var pYear = $("#accident_year").val();
    var pNumv = $("#num_of_vehicles").val();
    var pVehTypes = $("#vehicle_type").val() || [];
    var viewparams = "";

    if (pYear || pNumv || pVehTypes.length > 0) {
        viewparams = "&viewparams=";

        if (pYear) {
            viewparams += 'pYear:' + pYear + ';';
        }

        if (pNumv) {
            viewparams += 'pNumv:' + pNumv + ';';
        }

        if (pVehTypes.length > 0) {
            //var sTypes = pVehTypes.join("\\\\, ");
            //viewparams += 'pVehTypes:' + escape(sTypes);
            var sTypes = pVehTypes.join("|");
            viewparams += 'pVehTypes:' + '\'' + sTypes + '\'';
        }

    }

    url += "&service=WMS";           //WMS service
    url += "&version=1.1.0";         //WMS version 
    url += "&request=GetMap";        //WMS operation

    url += "&layers=WS_PostGIS:LondonAccidentsHeatmap";

    url += "&styles=";               //use default style
    url += "&format=image/png";      //image format
    url += "&TRANSPARENT=TRUE";      //only draw areas where we have data
    url += "&srs=EPSG:4326";         //projection WGS84

    if (viewparams !== "") {
               url += viewparams;
           }

    var northEast = bounds.getNorthEast();
    var southWest = bounds.getSouthWest();

    var bbox = southWest.lng() + "," + southWest.lat() + "," + northEast.lng() + "," + northEast.lat();

    url += "&bbox=" + bbox;          //set bounding box for tile

    url += "&width=" + width;             //tile size used by google
    url += "&height=" + height;
    url += "&tiled=false";

    return url;
};

function SetOverlay1(doClear) {
    
    if (!googleMap)
        return;

    if (doClear) {
        googleMap.overlayMapTypes.clear();
    }

    var mapDiv = googleMap.getDiv();
    var w = mapDiv.clientWidth;
    var h = mapDiv.clientHeight;
    googleMap.overlayMapTypes.push(new CoordMapType1(new google.maps.Size(w, h)));
    /*googleMap.overlayMapTypes.insertAt(
      0, new CoordMapType(new google.maps.Size(w, h)));
      */
};


function CoordMapType(tileSize) {
    this.tileSize = tileSize;
    this.opacity = 0.85;
    this.isPng = true;
}

function CoordMapType1(tileSize) {
    this.tileSize = tileSize;
    this.opacity = 0.85;
    this.isPng = true;
}

CoordMapType1.prototype.getTile = function (coord, zoom, ownerDocument) {
    var div = ownerDocument.createElement('div');
    div.innerHTML = coord;
    div.style.width = this.tileSize.width + 'px';
    div.style.height = this.tileSize.height + 'px';
    div.style.fontSize = '10';
    div.style.fillColor = '#CCCCCC';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px';
    div.style.borderColor = '#AAAAAA';
    return div;
};

CoordMapType.prototype.getTile = function (coord, zoom) {
   
    var projection = googleMap.getProjection();
    var zpow = Math.pow(2, zoom);

    var mapDiv = googleMap.getDiv();

    var twidth = this.tileSize.width;
    var theight = this.tileSize.height;
    /*
    var ul = new google.maps.Point(coord.x * twidth / zpow, (coord.y + 1) * theight / zpow);
    var lr = new google.maps.Point((coord.x + 1) * twidth / zpow, (coord.y) * theight / zpow);
    var ulw = projection.fromPointToLatLng(ul);
    var lrw = projection.fromPointToLatLng(lr);
    var bbox = ulw.lng() + "," + ulw.lat() + "," + lrw.lng() + "," + lrw.lat();
    */

    var bounds = googleMap.getBounds();

    var northEast = bounds.getNorthEast();
    var southWest = bounds.getSouthWest();

    var ul = new google.maps.Point(southWest.lng(), northEast.lat());
    var lr = new google.maps.Point(northEast.lng(), southWest.lat());

    var bbox = southWest.lng() + "," + southWest.lat() + "," + northEast.lng() + "," + northEast.lat();

    var pYear = $("#accident_year").val();
    var pNumv = $("#num_of_vehicles").val();
    var pVehTypes = $("#vehicle_type").val() || [];
    var viewparams = "";

    if (pYear || pNumv || pVehTypes.length > 0) {
        viewparams = "&viewparams=";

        if (pYear) {
            viewparams += 'pYear:' + pYear + ';';
        }

        if (pNumv) {
            viewparams += 'pNumv:' + pNumv + ';';
        }

        if (pVehTypes.length > 0) {
            //var sTypes = pVehTypes.join("\\\\, ");
            //viewparams += 'pVehTypes:' + escape(sTypes);
            var sTypes = pVehTypes.join("|");
            viewparams += 'pVehTypes:' + '\'' + sTypes + '\'';
        }

    }

    var url = "http://winserver:8080/geoserver/WS_PostGIS/wms?";

    url += "&service=WMS";           //WMS service
    url += "&version=1.1.0";         //WMS version 
    url += "&request=GetMap";        //WMS operation

    url += "&layers=WS_PostGIS:us_cities";

    url += "&styles=";               //use default style
    url += "&format=image/png";      //image format
    url += "&TRANSPARENT=TRUE";      //only draw areas where we have data
    url += "&srs=EPSG:4326";         //projection WGS84

    /*if (viewparams !== "") {
               url += viewparams;
           }*/

    url += "&bbox=" + bbox;          //set bounding box for tile

    url += "&width=" + twidth;             //tile size used by google
    url += "&height=" + theight;
    url += "&tiled=false";

    return url;
};

function ShowAccidentsLayer(doClear) {

    //http://localhost:8080/geoserver/WS_PostGIS/wms?service=WMS&version=1.1.0&request=GetMap&layers=WS_PostGIS:lnd_accidents&styles=&bbox=-6.04925870895386,49.9970092773438,1.79242122173309,57.4177131652832&width=768&height=726&srs=EPSG:4326&format=image%2Fpng

    if (!googleMap)
        return;


    if (doClear) {
        googleMap.overlayMapTypes.clear();
    }

    var mapDiv = googleMap.getDiv();
    var w = mapDiv.clientWidth;
    var h = mapDiv.clientHeight;

    var censusLayer =
     new google.maps.ImageMapType(
     {
         getTileUrl:
        function (coord, zoom) {
            // Compose URL for overlay tile

            var projection = googleMap.getProjection();
            var zpow = Math.pow(2, zoom);
            /*var s = Math.pow(2, zoom);
            var twidth = 256;
            var theight = 256;
            */
            //latlng bounds of the 4 corners of the google tile
            //Note the coord passed in represents the top left hand (NW) corner of the tile.

            /*
            var ul = new google.maps.Point(coord.x * this.tileSize.width / zpow, (coord.y + 1) * this.tileSize.height / zpow);
            var lr = new google.maps.Point((coord.x + 1) * this.tileSize.width / zpow, (coord.y) * this.tileSize.height / zpow);
            var ulw = projection.fromPointToLatLng(ul);
            var lrw = projection.fromPointToLatLng(lr);
            */

            var bounds = googleMap.getBounds();

            var northEast = bounds.getNorthEast();
            var southWest = bounds.getSouthWest();

            var ul = new google.maps.Point(southWest.lng(), northEast.lat());
            var lr = new google.maps.Point(northEast.lng(), southWest.lat());

            var bbox = southWest.lng() + "," + southWest.lat() + "," + northEast.lng() + "," + northEast.lat();
            /*
            var ulw = projection.fromPointToLatLng(ul);
            var lrw = projection.fromPointToLatLng(lr);
           
            var bbox = ulw.lng() + "," + ulw.lat() + "," + lrw.lng() + "," + lrw.lat();            */            /*
            var gBl = googleMap.getProjection().fromPointToLatLng(
              new google.maps.Point(coord.x * twidth / s, (coord.y + 1) * theight / s)); // bottom left / SW
            var gTr = googleMap.getProjection().fromPointToLatLng(
              new google.maps.Point((coord.x + 1) * twidth / s, coord.y * theight / s)); // top right / NE
              */
            // Bounding box coords for tile in WMS pre-1.3 format (x,y)
            //var bbox = gBl.lng() + "," + gBl.lat() + "," + gTr.lng() + "," + gTr.lat();

            //base WMS URL
            //var baseURL = "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi?";            //var url = "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi?";
            //var url = "http://winserver:8080/geoserver/sf/wms?";

            var url = "http://winserver:8080/geoserver/WS_PostGIS/wms?";

            

            var pYear = $("#accident_year").val();
            var pNumv = $("#num_of_vehicles").val();
            var pVehTypes = $("#vehicle_type").val() || [];
            var viewparams = "";

            if (pYear || pNumv || pVehTypes.length > 0) {
                viewparams = "&viewparams=";

                if (pYear) {
                    viewparams += 'pYear:' + pYear + ';';
                }

                if (pNumv) {
                    viewparams += 'pNumv:' + pNumv + ';';
                }

                if (pVehTypes.length > 0) {
                    //var sTypes = pVehTypes.join("\\\\, ");
                    //viewparams += 'pVehTypes:' + escape(sTypes);
                    var sTypes = pVehTypes.join("|");
                    viewparams += 'pVehTypes:' + '\'' + sTypes + '\'';
                }

            }

            url += "&service=WMS";           //WMS service
            url += "&version=1.1.0";         //WMS version 
            url += "&request=GetMap";        //WMS operation

            //url += "&layers=WS_PostGIS:LondonAccidentsView"; //WMS layers to draw
            //var layers = "nexrad-n0r-wmst";            //url += "&layers=nexrad-n0r-wmst";

            //url += "&layers=WS_PostGIS:LondonAccidentsHeatmap"; 
            //url += "&layers=sf:bugsites";
            url += "&layers=WS_PostGIS:us_cities";
            /*if (viewparams !== "") {
                url += viewparams;
            }*/

            url += "&styles=";               //use default style
            url += "&format=image/png";      //image format
            url += "&TRANSPARENT=TRUE";      //only draw areas where we have data
            url += "&srs=EPSG:4326";         //projection WGS84
            
            
            url += "&bbox=" + bbox;          //set bounding box for tile

            /*
            var mapDiv = googleMap.getDiv();
            var w = mapDiv.clientWidth;
            var h = mapDiv.clientHeight;
            url += "&width=" + w;             //tile size used by google
            url += "&height=" + h;
            */

            url += "&width=" + this.tileSize.width;             //tile size used by google
            url += "&height=" + this.tileSize.height;

            //url += "&tiled=false";

            return url;                 //return WMS URL for the tile  
        }, //getTileURL

         tileSize: new google.maps.Size(w, h),
         opacity: 0.85,
         isPng: true
     });

    // add WMS layer to map
    // google maps will end up calling the getTileURL for each tile in the map view
    googleMap.overlayMapTypes.push(censusLayer);
    
};

/*function ShowLayer2() {
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
    pointLayer.loadGeoJson('/api/LTAApi/GetAccidentsGeoJson');
    pointLayer.setMap(googleMap);
};*/
/* clustering examples
http://stackoverflow.com/questions/25267146/google-maps-javascript-api-v3-data-layer-markerclusterer
http://jsfiddle.net/doktormolle/myuua77p/
http://jsfiddle.net/gL3L7zso/3/
*/

/*
Задача: на основе карты высот строить градиент высоты между двумя точками
*/