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
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        streetViewControl: false,
        draggableCursor: 'default'
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    googleMap = map;

   
    
    map.addListener('tilesloaded', SetOverlay());
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

function SetOverlay() {

    if (!googleMap)
        return;
    var bounds = googleMap.getBounds();

    var srcImage = '';

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
    
    img.id = 'overlayMapImage';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';

    img.onload = function () {

        googleMap.setOptions({ draggable: true, zoomControl: true, scrollwheel: true, disableDoubleClickZoom: false });
        $('#overlayMapImageLoading').hide();
    }

    var divLoading = document.createElement('div');
    divLoading.style.position = 'absolute';
    divLoading.style.verticalAlign = 'middle';
    divLoading.style.textAlign = 'center';
    divLoading.style.width = '100%';
    divLoading.style.height = '100%';

    var dummySpan = document.createElement('span');
    dummySpan.style.display = 'inline-block';
    dummySpan.style.height = '100%';
    dummySpan.style.verticalAlign = 'middle';
    divLoading.appendChild(dummySpan);

    var imgLoading = document.createElement('img');

    imgLoading.id = 'overlayMapImageLoading';
    imgLoading.style.alt = 'Loading...';
    imgLoading.style.display = 'inline-block';
    imgLoading.style.verticalAlign = 'middle';


    imgLoading.src = '/img/loading1.gif';
    divLoading.appendChild(imgLoading);
    
    div.appendChild(img);
    div.appendChild(divLoading);
    this.div_ = div;

    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
};

USGSOverlay.prototype.draw = function () {

    if (!googleMap)
        return;

    $('#overlayMapImage').attr('src', '');

    googleMap.setOptions({ draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true });
    $('#overlayMapImageLoading').show();

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
    $('#overlayMapImage').attr('src', imageUrl);
};



function GetImageUrl(bounds, width, height) {

    var url = mapServiceUrl;

    var pYear = $("#accident_year").val();
    var pNumv = $("#num_of_vehicles").val();
    var pVehType = $("#vehicle_type").val();
    //var pVehTypes = $("#vehicle_type").val() || [];
    var viewparams = "";

    if (pYear || pNumv || pVehType) {
        viewparams = "&viewparams=";

        if (pYear) {
            viewparams += 'pYear:' + pYear + ';';
        }

        if (pNumv) {
            viewparams += 'pNumv:' + pNumv + ';';
        }

        /*if (pVehTypes.length > 0) {
            var sTypes = pVehTypes.join("|");
            viewparams += 'pVehTypes:' + '\'' + sTypes + '\'';
        }*/

        if (pVehType) {
            //viewparams += 'pVehType:' + '\'' + pVehType + '\'' + ';';
            viewparams += 'pVehType:' + pVehType + ';';
        }

    }

    url += "&service=WMS";           //WMS service
    url += "&version=1.1.0";         //WMS version 
    url += "&request=GetMap";        //WMS operation

    url += "&layers="+window.overlayLayer;

    
    url += "&format=image/png";      //image format
    url += "&TRANSPARENT=TRUE";      //only draw areas where we have data
    url += "&srs=EPSG:4326";         //projection WGS84

    var zoom = googleMap.getZoom(); //min 10; max 21;

    if (overlayLayer === 'WS_PostGIS:LondonAccidentsView') {
        var cellSize = GetCellSize(zoom);

        if (cellSize > 0) {

            url += "&env=cell_size:" + GetCellSize(zoom);
        } else {
            url += "&styles=AccidentPointStyle"; //use default style
        }
    }

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

function GetCellSize(zoom) {
    var cellSize;

    if (zoom < 10)
        return 50;

    if (zoom > 21)
        return 1;

    switch (zoom) {
        case 10:
            cellSize = 70;
            break;
        case 11:
            cellSize = 65;
            break;
        case 12:
            cellSize = 60;
            break;
        case 13:
            cellSize = 55;
            break;
        case 14:
            cellSize = 50;
            break;
        case 15:
            cellSize = 45;
            break;
        case 16:
            cellSize = 40;
            break;
        case 17:
            cellSize = 0;
            break;
        case 18:
            cellSize = 0;
            break;
        case 19:
            cellSize =0;
            break;
        case 20:
            cellSize = 0;
            break;
        case 21:
            cellSize = 0;
            break;
        default:
        cellSize = 0;
    }

    return cellSize;
   
};
/* clustering examples
http://stackoverflow.com/questions/25267146/google-maps-javascript-api-v3-data-layer-markerclusterer
http://jsfiddle.net/doktormolle/myuua77p/
http://jsfiddle.net/gL3L7zso/3/
*/

/*
Задача: на основе карты высот строить градиент высоты между двумя точками
*/