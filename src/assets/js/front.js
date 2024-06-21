var carte;
var currentRestoId;
var searchPosition;
var markersArray = [];

var icon = {
    url: './assets/image/resto.png', 
    scaledSize: new google.maps.Size(25, 25), 
    origin: new google.maps.Point(0, 0), 
    anchor: new google.maps.Point(16, 32) 
};

var iconSearch = {
    url: './assets/image/search.png', 
    scaledSize : new google.maps.Size(25, 25), 
    origin : new google.maps.Point(0, 0), 
    anchor : new google.maps.Point(16,32)
}

var iconPosition = {
    url: './assets/image/position.png', 
    scaledSize : new google.maps.Size(25, 25), 
    origin : new google.maps.Point(0, 0), 
    anchor : new google.maps.Point(16,32)
}

function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(-18.986021, 47.532735),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    carte = new google.maps.Map(document.getElementById("carteId"), mapOptions);
    google.maps.event.addListener(carte, 'rightclick', function(event) {
        setSearchPosition(event.latLng);
    });
    loadMarkers();
}

function removeMarkerByName(markerName) {
    const markerIndex = markersArray.findIndex(marker => marker.title === markerName);
    if (markerIndex > -1) {
        markersArray[markerIndex].setMap(null);
        markersArray.splice(markerIndex, 1);
    } else {
        console.log("Marqueur non trouvé avec le nom:", markerName);
    }
}

function setSearchPosition(latLng) {
    removeMarkerByName('Search Position');
    searchPosition = latLng;
    document.getElementById('search-location').value = latLng.lat() + ', ' + latLng.lng();

    var mapMarker = new google.maps.Marker({
        position: latLng,
        map: carte,
        title: 'Search Position',
        icon: iconPosition 
    });
    markersArray.push(mapMarker);

    var contentString = '<div id="content">' +
        '<h1>Ma Position</h1>' +
        '</div>';
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    mapMarker.addListener('click', function() {
        infowindow.open(carte, mapMarker);
    });
}

function clearMarkers() {
    for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }
    markersArray = [];
}

function removeMarkersExceptName(exceptName) {
    let keptMarkers = [];
    for (let i = 0; i < markersArray.length; i++) {
        if (markersArray[i].title !== exceptName) {
            markersArray[i].setMap(null);
        } else {
            keptMarkers.push(markersArray[i]);
        }
    }
    markersArray = keptMarkers;
}

function loadMarkers() {
    $.get('./service/get_markers.php', function(data) {
        console.log('Data received from ./service/get_markers.php:', data);
        try {
            var markers = data;
            console.log('Data parsed:', markers);

            if (!Array.isArray(markers)) {
                throw new Error('Parsed data is not an array');
            }

            clearMarkers(); 

            markers.forEach(function(marker) {
                var position = new google.maps.LatLng(marker.latitude, marker.longitude);
                var mapMarker = new google.maps.Marker({
                    position: position,
                    map: carte,
                    title: marker.name,
                    icon: icon
                });
                markersArray.push(mapMarker);

                var contentString = '<div id="content">'+
                    '<h1>'+ marker.name +'</h1>'+
                    '<img src="' + marker.image + '" alt="' + marker.name + '" style="width:100px;height:100px;"/>'+
                    '</div>';
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                mapMarker.addListener('click', function() {
                    infowindow.open(carte, mapMarker);
                });
            });
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            console.error('Data received:', data);
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Failed to load markers:', textStatus, errorThrown);
    });
}

function searchRestaurants() {
    var name = $('#search-name').val();
    var menu = $('#search-menu').val();
    var radius = $('#search-radius').val();
    var latLng = searchPosition ? searchPosition : { lat: 0, lng: 0 };

    $.post('./service/search_restaurants.php', {
        name: name,
        menu: menu,
        radius: radius,
        lat: latLng.lat,
        lng: latLng.lng
    }, function(data) {
        console.log('Data received from ./service/search_restaurants.php:', data);
        try {
            var markers = data;
            console.log('Search data:', markers);

            if (!Array.isArray(markers)) {
                throw new Error('Parsed data is not an array');
            }

            removeMarkersExceptName('Search Position');

            markers.forEach(function(marker) {
                var position = new google.maps.LatLng(marker.latitude, marker.longitude);
                var mapMarker = new google.maps.Marker({
                    position: position,
                    map: carte,
                    title: marker.name,
                    icon: iconSearch
                });
                markersArray.push(mapMarker);

                var contentString = '<div id="content">'+
                    '<h1>'+ marker.name +'</h1>'+
                    '<img src="' + marker.image + '" alt="' + marker.name + '" style="width:100px;height:100px;"/>'+
                    '</div>';
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                mapMarker.addListener('click', function() {
                    infowindow.open(carte, mapMarker);
                });
            });
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            console.error('Data received:', data);
        }
    });
}

$(document).ready(function() {
    $('#search-button').click(function(e) {
        e.preventDefault();
        searchRestaurants();
    });
});

google.maps.event.addDomListener(window, 'load', initialize);