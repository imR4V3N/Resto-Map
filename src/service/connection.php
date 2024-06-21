<?php
function get_connection(){
    $host = 'localhost';
    $db = 'sig';
    $user = 'root';
    $pass = '';
    $conn = new mysqli($host, $user, $pass, $db);
    return $conn;
}
