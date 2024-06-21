<?php
header('Content-Type: application/json');
require 'connection.php';
$conn = get_connection();

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$name = isset($_POST['name']) ? $_POST['name'] : '';
$menu = isset($_POST['menu']) ? $_POST['menu'] : '';

$radius = isset($_POST['radius']) ? $_POST['radius'] : 0;
$lat = isset($_POST['lat']) ? $_POST['lat'] : 0;
$lng = isset($_POST['lng']) ? $_POST['lng'] : 0;

$query = "SELECT r.*, ST_Distance_Sphere(point(r.longitude, r.latitude), point($lng, $lat)) as distance
          FROM restaurant r
          LEFT JOIN menu_resto mr ON r.id = mr.idResto
          LEFT JOIN menu m ON m.id = mr.idMenu
          WHERE 1=1";
if ($name != '') {
    $query .= " AND r.name LIKE '%$name%'";
}
if ($menu != '') {
    $query .= " AND m.name LIKE '%$menu%'";
}
if ($radius > 0) {
    $query .= " AND ST_Distance_Sphere(point(r.longitude, r.latitude), point($lng, $lat)) <= ($radius * 1000)";
}
$query .= " GROUP BY r.id";
$result = $conn->query($query);
$restaurants = array();
while ($row = $result->fetch_assoc()) {
    $restaurants[] = $row;
}

echo json_encode($restaurants);
$conn->close();