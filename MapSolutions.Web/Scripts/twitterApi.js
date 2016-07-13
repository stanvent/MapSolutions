jQuery.support.cors = true;

var googleMap;
var googleInfoWindow;
var searchRadius;
var searchCircle;
var searchMarker;

$(document).ready(function () {

    
    google.maps.event.addDomListener(window, 'load', initialize);

   
});

function initialize() {

    var latlng = new google.maps.LatLng(39.6395, -99.2179);

    var mapOptions = {
        center: latlng,
        scrollWheel: false,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        streetViewControl: false,
        draggableCursor: 'crosshair'
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    googleMap = map;
    map.addListener('click', function (event) {
        GetTweets(event.latLng.lat(), event.latLng.lng());
    });
};

function GetTweets(lat, lng) {

    if (searchCircle)
        searchCircle.setMap(null);

    if (searchMarker)
        searchMarker.setMap(null);

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

    searchMarker = new google.maps.Marker({
        
        draggable: false,
        animation: google.maps.Animation.BOUNCE,
        position: { lat: lat, lng: lng }
    });

    searchMarker.setMap(googleMap);
    searchCircle.setMap(googleMap);

    animateCircle(searchCircle);


    searchRadius = parseInt($('#radiusSlider')[0].value);
    var searchPattern = $('#searchPattern')[0].value + '';
    //var rad = $("#radiusSlider").slider('getValue');
    var reqParams = { Lat: lat, Lng: lng, Radius: searchRadius, SearchPattern: searchPattern };

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

    var container = $('#tweet-container');

    $('#twitter-ticker').slideDown('slow');
    $("#tweet-container").empty();

    if (answer && answer.length > 0) {

        $.each(answer, function() {

            var str = '	<div class="tweet">\
						<div class="avatar"><a href="http://twitter.com/' + this.UserScreenName + '" target="_blank"><img src="' + this.ProfileImageUrl + '" /></a></div>\
						<div class="user"><a href="http://twitter.com/' + this.UserScreenName + '" target="_blank">' + this.UserName + '</a></div>\
						<div class="time">' + relativeTime(this.CreatedAt) + '</div>\
						<div class="txt">' + formatTwitString(this.TweetBody) + '</div>\
						</div>';

            container.append(str);

        });
        scrollTweets(answer.length);
    } else {
        
        var str = ' <div class="tweet"><div class="txt"> Tweets not found </div></div>';
        container.append(str);
    }
}

function formatTwitString(str){
    str=' '+str;
    str = str.replace(/((ftp|https?):\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?)/gm,'<a href="$1" target="_blank">$1</a>');
    str = str.replace(/([^\w])\@([\w\-]+)/gm,'$1@<a href="http://twitter.com/$2" target="_blank">$2</a>');
    str = str.replace(/([^\w])\#([\w\-]+)/gm,'$1<a href="http://twitter.com/search?q=%23$2" target="_blank">#$2</a>');
    return str;
}

function relativeTime(pastTime) {
    var tweetDate = new Date(pastTime);
    var origStamp = Date.parse(pastTime);
    var curDate = new Date();
    var currentStamp = curDate.getTime();
		
    var difference = parseInt((currentStamp - origStamp)/1000);

    if(difference < 0) return false;

    if(difference <= 5)				return "Just now";
    if(difference <= 20)			return "Seconds ago";
    if(difference <= 60)			return "A minute ago";
    if(difference < 3600)			return parseInt(difference/60)+" minutes ago";
    if(difference <= 1.5*3600) 		return "One hour ago";
    if(difference < 23.5*3600)		return Math.round(difference/3600)+" hours ago";
    if (difference <= 1.5 * 24 * 3600) return "One day ago";

    return tweetDate.getFullYear() + '-' + ('0' + (tweetDate.getMonth() + 1)).slice(-2) + '-' + ('0' + tweetDate.getDate()).slice(-2);

}

function scrollTweets(tweetsCount) {

    var $tweetList = $('#tweet-container');
    var interval = tweetsCount * 1200;
    $tweetList.scrollTo("max", interval,
    {
        axis: 'y',
        interrupt: true

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
