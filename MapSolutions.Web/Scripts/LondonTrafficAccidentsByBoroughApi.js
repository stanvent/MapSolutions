jQuery.support.cors = true;
var markerClusterer = new MarkerClusterer();
var googleMap;
var apiUrl = '/api/LTAApi/GetAccidentsByBorough';


$(document).ready(function () {

    google.maps.event.addDomListener(window, 'load', initialize);

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

    LoadAccidents();

    map.data.addListener('mouseover', function (event) {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {
            fillOpacity: 0.9,
            strokeColor: 'black',
            strokeWeight: 2
        });

        var strInfo = ' <span style:padding = 5px> Borough name: ' + event.feature.getProperty('name') + '; </span> ';
        strInfo += ' <span> Accidents count: ' + event.feature.getProperty('acc_count') + '; </span> ';
        $('#boroughInfo').html(strInfo);
    });

    map.data.addListener('mouseout', function (event) {
        map.data.revertStyle();
        $('#boroughInfo').html('');
    });


    $("#accident_year").change(function() {
            LoadAccidents();
        }
    );
    $("#vehicle_type").change(function () {
        LoadAccidents();
    });


    var divInfo = document.createElement('div');
    divInfo.id = 'boroughInfo';
    divInfo.style.borderStyle = 'none';
    divInfo.style.borderWidth = '0px';
    divInfo.style.position = 'absolute';
    divInfo.style.backgroundColor = '#ff6666';
    //divInfo.style.backgroundColor = 'rgba(255, 0, 0, 0.8);';
    divInfo.style.fontSize = '16px';
    //divInfo.style.padding = '10px';
   
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(divInfo);


    var divLoading = document.createElement('div');
    divLoading.style.position = 'absolute';
    divLoading.style.verticalAlign = 'middle';
    divLoading.style.textAlign = 'center';
    divLoading.style.width = '100%';
    divLoading.style.height = '100%';
    divLoading.style.pointerEvents = 'none';

    var dummySpan = document.createElement('span');
    dummySpan.style.display = 'inline-block';
    dummySpan.style.height = '100%';
    dummySpan.style.verticalAlign = 'middle';
    dummySpan.style.pointerEvents = 'none';
    divLoading.appendChild(dummySpan);

    var imgLoading = document.createElement('img');

    imgLoading.id = 'overlayMapImageLoading';
    imgLoading.style.alt = 'Loading...';
    imgLoading.style.display = 'inline-block';
    imgLoading.style.verticalAlign = 'middle';


    imgLoading.src = '/img/loading1.gif';
    divLoading.appendChild(imgLoading);
   

    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(divLoading);
    $('#overlayMapImageLoading').show();
   
};


function LoadAccidents() {

    googleMap.data.forEach(function (feature) {
        googleMap.data.remove(feature);
    });
   

    googleMap.setOptions({ draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true });
    $('#overlayMapImageLoading').show();

    var pYear = $("#accident_year").val();
    var pNumv = $("#num_of_vehicles").val();
    var pVehType = $("#vehicle_type").val();

    var reqParams = { accYear: pYear, numVehicles: pNumv, vehicleType: pVehType };

    var strparams = JSON.stringify(reqParams);

    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: strparams,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if(data != '')
                AddLayer(data);

            googleMap.setOptions({ draggable: true, zoomControl: true, scrollwheel: true, disableDoubleClickZoom: false });
            $('#overlayMapImageLoading').hide();
        },
        error: function (x, y, z) {
            alert(x + "\n" + y + "\n" + z);
        }
    });
};

function AddLayer(data) {


    var geojson = JSON.parse(data);
    googleMap.data.addGeoJson(geojson);

    var minMaxValues = GetMaxAccidentsValue(googleMap.data);

    var minValue = minMaxValues[0];
    var maxValue = minMaxValues[1];
    var delta = maxValue - minValue;
    if (delta === 0)
        delta = 1;
    
    //65280 -green
    //16711680 - red
    googleMap.data.setStyle(function (feature) {
        
        var val = parseInt(feature.getProperty('acc_count'));
        var valPercent = (val - minValue) * 100 / delta;

        var color = getGreenToRed(valPercent);

        return /** @type {google.maps.Data.StyleOptions} */({
            fillColor: color,
            fillOpacity : 0.6,
            strokeColor: 'black',
            strokeWeight: 1,
            strokeOpacity: 0.5
        });
    });

    
    googleMap.data.setMap(googleMap);

};

function GetMaxAccidentsValue(data) {

    var maxVal = 0;
    var minVal = 10000000;
    data.forEach(function(feature) {
        var val = feature.getProperty('acc_count');
        if (val < minVal)
            minVal = val;

        if (val > maxVal)
            maxVal = val;
    });

    return [minVal, maxVal];
};

function getGreenToRed(percent) {
    g = percent < 50 ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
    r = percent > 50 ? 255 : Math.floor((percent * 2) * 255 / 100);
    return 'rgb(' + r + ',' + g + ',0)';
}
