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

function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(-18.986021, 47.532735),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    carte = new google.maps.Map(document.getElementById("carteId"), mapOptions);
    google.maps.event.addListener(carte, 'click', function(event) {
        afficherCoordonnees(event.latLng);
    });
    loadMarkers();
}

function afficherCoordonnees(latLng) {
    document.getElementById('latitude').value = latLng.lat();
    document.getElementById('longitude').value = latLng.lng();
    document.getElementById('form-container').style.display = 'block';
}

function clearMarkers() {
    for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }
    markersArray = [];
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
                    '<button onclick="showMenuForm('+ marker.id +')">Add menu</button>'+
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

function showMenuForm(restoId) {
    currentRestoId = restoId;
    document.getElementById('menu-form-container').style.display = 'block';
}

$(document).ready(function() {
    $('#restaurant-form').submit(function(e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            type: 'POST',
            url: './service/save_restaurant.php',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                alert(response);
                document.getElementById('form-container').style.display = 'none';
                loadMarkers();
            }
        });
    });

    $('#menu-form').submit(function(e) {
        e.preventDefault();
        var formData = $(this).serialize() + '&restaurant_id=' + currentRestoId;
        $.ajax({
            type: 'POST',
            url: './service/save_menu.php',
            data: formData,
            success: function(response) {
                alert(response);
                document.getElementById('menu-form-container').style.display = 'none';
                loadMarkers();
            }
        });
    });
});

google.maps.event.addDomListener(window, 'load', initialize);