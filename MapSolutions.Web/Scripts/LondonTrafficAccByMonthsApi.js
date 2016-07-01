
jQuery.support.cors = true;

var apiUrl = '/api/LTAApi/GetAccidentsByMonths';
var olMap;

var heatMapLayer;
var loadingPopup;

$(document).ready(function () {

    var london = ol.proj.transform([-0.12755, 51.507222], 'EPSG:4326', 'EPSG:3857');
    var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
              source: new ol.source.OSM({
                  wrapX: false
              })
          })
        ],
        controls: ol.control.defaults({
            attributionOptions: /** type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        target: 'map-canvas',
        view: new ol.View({
            //projection: 'EPSG:4326',
            center: london,
            zoom: 10
        })
    });

    olMap = map;


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

    loadingPopup = new ol.Overlay({
        element: divLoading,
        stopEvent: false
});

    map.addOverlay(loadingPopup);

    $('.ol-overlay-container').each(function (i, obj) {
        obj.style.width = '100%';
        obj.style.height = '100%';
    });

    LoadAccidentsJSON();

    $("#accident_year").change(function () { LoadAccidentsJSON(); });

   /*
    map.on('singleclick', function (evt) {
        alert('Pixel: ' + evt.pixel + ';  Coord: ' + evt.coordinate);
        
    });
    */

});


function LoadAccidentsJSON() {

    var pYear = $("#accident_year").val();
    var pMonth = $("#monthSlider").val();

    if (pYear === '')
        return;

    var reqParams = { accYear: pYear, accMonth: pMonth };

    
    var coord = olMap.getCoordinateFromPixel([0,0]);
    loadingPopup.setPosition(coord);

    SetLoadingIndicator(false);

    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: JSON.stringify(reqParams),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            var features = new ol.format.GeoJSON().readFeatures(data, {
                featureProjection: 'EPSG:3857'
            });

            var vectorSource = new ol.source.Vector({
                features: features
            });

            if (heatMapLayer) {

                heatMapLayer.setSource(vectorSource);
                
            } else {
                heatMapLayer = new ol.layer.Heatmap({
                    source: vectorSource,
                    blur: 12,
                    radius: 10
                });

                olMap.addLayer(heatMapLayer);
            }
            SetLoadingIndicator(false);
        },
        error: function (x, y, z) {
            SetLoadingIndicator(false);
            alert(x + "\n" + y + "\n" + z);
            
        }
    });
   
    
};

function SetLoadingIndicator(isOn) {

    if (isOn) {
        $('#overlayMapImageLoading').fadeIn(2000);
    } else {
        $('#overlayMapImageLoading').fadeOut(2000);
    }

    olMap.getInteractions().forEach(function (obj, ff) {
        obj.setActive(!isOn);
    });
};