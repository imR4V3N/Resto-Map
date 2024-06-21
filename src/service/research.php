<?php
    include 'connexion.php';
    try {
        $pdo = connectToDatabase();

        if (!$pdo) {
            echo "Database not found!";
            exit;
        }

        $search_resto = $_GET['search_resto'];
        $search_menu = $_GET['search_menu'];
        $search_rang = $_GET['search_rang'];

        $sql = "SELECT * FROM resto";
        $conditions = [];

        if (!empty($search_resto)) {
            $conditions[] = "name ILIKE :search_resto";
        }

        if (!empty($search_menu)) {
            $sql .= " JOIN menu ON resto.id_resto = menu.id_resto";
            $conditions[] = "menu.name ILIKE :search_menu";
        }

        if (!empty($search_rang)) {
            $userLat = -18.986021;
            $userLng = 47.532735;
            $distanceFormula = "6371 * acos(cos(radians(:userLat)) * cos(radians(latitude)) * cos(radians(longitude) - radians(:userLng)) + sin(radians(:userLat)) * sin(radians(latitude)))";
            $conditions[] = "($distanceFormula) <= :search_rang";
        }

        if (count($conditions) > 0) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }

        $statement = $pdo->prepare($sql);

        if (!empty($search_resto)) {
            $statement->bindValue(':search_resto', '%' . $search_resto . '%');
        }

        if (!empty($search_menu)) {
            $statement->bindValue(':search_menu', '%' . $search_menu . '%');
        }

        if (!empty($search_rang)) {
            $statement->bindValue(':userLat', $userLat);
            $statement->bindValue(':userLng', $userLng);
            $statement->bindValue(':search_rang', $search_rang);
        }

        $statement->execute();
        $restaurants = $statement->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($restaurants);
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
?>
