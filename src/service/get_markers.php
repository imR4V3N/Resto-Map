<?php
require 'connection.php';
$conn = get_connection();

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$query = "SELECT * FROM restaurant";
$result = $conn->query($query);
$restaurants = array();
while ($row = $result->fetch_assoc()) {
    $restaurants[] = $row;
}
$conn->close();
header('Content-Type: application/json');
echo json_encode($restaurants, JSON_PRETTY_PRINT);
