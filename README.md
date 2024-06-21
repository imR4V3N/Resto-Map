# **RestoMap**

## Introduction

School project consisting of adding a restaurant to a point by clicking on a map.

## Process

**Back Office :**

- Click on a part of the map, retrieve the coordinates of the part of the map (longitude and latitude) and display a form to add id, name, image
- Save the data in a MySql database
- Click on a restaurant already added and enter restaurant menu

**Front Office :**

* Multi-criteria search :
  * Restaurant name
  * Restaurant menu
  * Restaurant within a defined radius of my location which will be defined by a right click of the mouse

For database configuration go to ***src/service/connection.php***

```
function get_connection(){
    $host = 'localhost';
    $db = 'sig';
    $user = 'root';
    $pass = '';
    $conn = new mysqli($host, $user, $pass, $db);
    return $conn;
}
```

For the database sql script go to ***src/assets/sql/script.sql***
