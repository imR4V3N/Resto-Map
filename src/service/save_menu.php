<?php
require 'connection.php';
$conn = get_connection();

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$restaurant_id = $_POST['restaurant_id'];
$menu_name = $_POST['menu_name'];
$query = "SELECT id FROM menu WHERE name = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $menu_name);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $menu = $result->fetch_assoc();
    $menu_id = $menu['id'];
} else {
    $query = "INSERT INTO menu (name) VALUES (?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $menu_name);
    if ($stmt->execute()) {
        $menu_id = $stmt->insert_id;
    } else {
        die("Error in saving menu: " . $conn->error);
    }
}
$query = "INSERT INTO menu_resto (idResto, idMenu) VALUES (?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ii", $restaurant_id, $menu_id);
if ($stmt->execute()) {
    echo "Menu successfully added.";
} else {
    echo "Error in saving menu: " . $conn->error;
}
$conn->close();
?>