<?php
    include_once 'database/connect.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AimTrainer</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <canvas id="canvas1"></canvas>
    <div id="startScreen">
        CLICK TO PLAY
    </div>
    <div id="endScreen">
        <span id="score">Your Score: <span id="output"></span></span> <br>
        <form onkeypress="return event.keyCode != 13" id="submit">
            <div id = "message"></div>
            <div id = "formControl">
                <input type="text" name="uid" placeholder="NAME" id="user">
            
                <button type="button" id="submitBtn">
                Submit Score
                </button>
            </div>
            
        </form>
    
        <div id="playAgain">
            PLAY AGAIN
        </div>
        <div id="leaderboard">
            <table id="table">
                <thead>
                    <tr>
                        <th class="rank"></th>
                        <th class="nickName">Nickname</th>
                        <th class="points">Points</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <?php
                        $i = 1;
                        $sql = "SELECT * FROM place ORDER BY score DESC;";
                        $result = mysqli_query($conn,$sql);
                        $resultCheck = mysqli_num_rows($result);

                        if($resultCheck > 0){
                            while ($row = mysqli_fetch_assoc($result)){
                                if($i <= 3){
                                    echo "<tr> <td> <img src='images/Medals/medal$i.png' class='imageTop3'> </td> <td class='nickName'> {$row['user']} </td> <td class='points'> {$row['score']} </td> </tr>";
                                }else{
                                    echo "<tr> <td class='rank'>$i</td><td class='nickName'> {$row['user']} </td> <td class='points'> {$row['score']} </td> </tr>";
                                }
                                $i++;
                            }
                        }
                        
                    ?>
                </tbody>
            </table>
        </div>
    </div>
    <script src="script.js"></script>
</body>

</html>