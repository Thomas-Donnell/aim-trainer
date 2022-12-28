<?php
    include_once 'connect.php';

    $name = $_POST['uid'];
    $score = $_POST['val'];

    $insert = "INSERT INTO place (user, score) VALUES ('$name','$score');";
    mysqli_query($conn,$insert);

    $sql = "SELECT * FROM place ORDER BY score DESC;";
    $result = mysqli_query($conn,$sql);

    $data = array();

    while ($row = mysqli_fetch_assoc($result)){
        $data[] = $row;
    }
    

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);

?>