jQuery.support.cors = true;

var googleMap;
var googleInfoWindow;
var searchRadius;
var searchCircle;

$(document).ready(function () {

    
    google.maps.event.addDomListener(window, 'load', initialize);

   
});

function initialize() {

    var latlng = new google.maps.LatLng(39.6395, -99.2179);

    var mapOptions = {
        center: latlng,
        scrollWheel: false,
        zoom: 5
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    googleMap = map;
    map.addListener('click', function (event) {
        GetTweets(event.latLng.lat(), event.latLng.lng());
        //alert('Lat: ' + event.latLng.lat() + '; Long: ' + event.latLng.lng() + '; Zoom: ' + map.getZoom());
    });
};

function GetTweets(lat, lng) {


    searchRadius = parseInt($('#radiusSlider')[0].value);
    
    //var rad = $("#radiusSlider").slider('getValue');
    var reqParams = { Lat: lat, Lng: lng, Radius: searchRadius };

    var strLatLng = JSON.stringify(reqParams);
    $.ajax({
        url: '/api/TwitterApi/GetTweets',
        type: 'POST',
        data: strLatLng,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            GetTweetsResponse(data, lat, lng);
        },
        error: function(x, y, z) {
            alert(x + "\n" + y + "\n" + z);
        }
    });
}

function GetTweetsResponse(answer, lat, lng) {

    if (searchCircle)
        searchCircle.setMap(null);

    var center = new google.maps.LatLng(lat, lng);

     searchCircle = new google.maps.Circle({
        center: center,
        radius: 0,
        strokeColor: "#E16D65",
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: "#E16D65",
        fillOpacity: 0.3,
        clickable: false
    });
     searchCircle.setMap(googleMap);
     animateCircle(searchCircle);

    
    /*if (googleInfoWindow)
        googleInfoWindow.close();

    var contentString = "<marquee id=\"tweetsList\" scrollamount=\"3\" behavior=\"scroll\" direction=\"up\"> </marquee>";

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    var myLatLng = new google.maps.LatLng({ lat: lat, lng: lng });
    infowindow.setPosition(myLatLng);
    googleInfoWindow = infowindow;
    infowindow.open(googleMap);
    */
    $("#tweetList").html($("#tweetTemplate").render(answer));
    scrollTweets();
  
}

function scrollTweets() {
    var $tweetList = $('#tweetList');//we'll re use it a lot, so better save it to a var.
    $tweetList.serialScroll({
        items: 'div',
        duration: 2000,
        force: true,
        axis: 'y',
        easing: 'linear',
        lazy: true,// NOTE: it's set to true, meaning you can add/remove/reorder items and the changes are taken into account.
        interval: 1, // yeah! I now added auto-scrolling
        step: 2 // scroll 2 news each time
    });
   
}

function animateCircle(circle) {
    
    var intId = window.setInterval(function () {
        var radius = circle.getRadius();
        circle.setRadius(radius + 100);
        if (radius >= searchRadius*1000)
        {
            window.clearInterval(intId);
        }
    }, 5);
}
