const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var circles = [];
var randomX;
var randomY;
const FPS = 60;
var counter = 3;
var deaths = 0;
var score = 0;
var submitted = false;
var active = true;
var audio = new Audio('sound/clickSound.wav');
class Circle {
    constructor(x,y,radius,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.size = 10;
    }
    getY(){
        return this.y;
    }
    getX(){
        return this.x;
    }
    timed(){
        if(this.size < 50){
            ctx.clearRect(this.x - this.radius, this.y - this.radius, 100,100);
            this.draw(ctx);
            this.size += .32;
            ctx.globalAlpha = .5;
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.size,0,Math.PI * 2,false);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }else{
            deaths++;
            if(deaths >= 3){
                circles.splice(0);
                ctx.clearRect(0,0,canvas.width,canvas.height);
                clearInterval(timer);
                var x = document.getElementById("endScreen");
                x.style.display = "flex";
                document.getElementById('output').innerHTML = score;
                document.getElementById('score').value = score;
                deaths = 0;                 
            }
            this.remove();

        }
    }
    draw(ctx){
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    remove(){
        circles.splice(circles.indexOf(this),1);
        ctx.clearRect(this.x - this.radius, this.y - this.radius, 100,100);
    }

    clickCircle(xMouse, yMouse){
        const distance = Math.sqrt(Math.pow((xMouse - this.x),2) + Math.pow((yMouse - this.y),2));
        if(distance < this.radius){
            audio.play();
            this.remove();
            score++;
            return true;
        }else{
            return false;
        }
    }
}
function animate(){
    for(let i = 0; i < circles.length; i++){
        circles[i].timed();
    }
    setTimeout(() => {
        requestAnimationFrame(animate);
    },1000/FPS);
}
function drawCircle(){
    random();
    for(let i = 0; i < circles.length; i++){
        const distance = Math.sqrt(Math.pow((circles[i].getX() - randomX),2) + Math.pow((circles[i].getY() - randomY),2));
        if(distance < 120){
            random();
            i = -1;
            continue;
        }
    }
    newCircle = new Circle(randomX,randomY,50,'#89cff0')
    circles.push(newCircle);
    newCircle.draw(ctx);
    
}

function random(){
    randomX = Math.floor(Math.random() * (canvas.width-60 - 60 + 1)) + 60;
    randomY = Math.floor(Math.random() * (canvas.height-60 - 60 + 1)) + 60;
}

function countDown(){
    if(counter >= 1){
        document.getElementById('startScreen').innerHTML = counter--;
    }else{
        clearInterval(count);
        document.getElementById("startScreen").style.display = 'none';
        timer = setInterval(drawCircle,(100/Math.pow(score + 1,1/5) + 380));
        counter = 3;
    }
}

function firstStart(){
    if(active){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.getElementById("startScreen").style.display = 'block'
        countDown();
        count = setInterval(countDown, 1000);
        active = false;
        submitted = false;
    }
}

function start(){
    score = 0;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.getElementById('message').innerHTML = ""
    document.getElementById('user').style.border = "0"
    document.getElementById("startScreen").style.display = 'block'
    document.getElementById("endScreen").style.display = 'none';
    countDown();
    count = setInterval(countDown, 1000);
    submitted = false;
}

canvas.addEventListener('click', (event)=>{
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for(let i =0; i < circles.length; i++){
        console.log(circles[i].clickCircle(x,y));
    }
    
});
document.getElementById('submitBtn').onclick = function(){
    var name = document.getElementById('user').value;
    var img = document.createElement("img");
    var ajax = new XMLHttpRequest();
    var method = "POST";
    var url = "database/request.php";
    var i = 1;
    name = name.replace(/  +/g, ' ').trim()
    if( name == "" && !submitted){
        document.getElementById('message').innerHTML = "Invalid Name"
        document.getElementById('message').style.color = "red"
        document.getElementById('user').style.border = "2pt solid red"
    }
    else if(!submitted){
        ajax.open(method,url,true);
        ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        ajax.send("uid="+name+"&val="+score+"");
        document.getElementById('user').value = "";
        ajax.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200){
                document.getElementById('message').innerHTML = "Submitted"
                document.getElementById('message').style.color = "#00FF00"
                document.getElementById('user').style.border = "2pt solid #00FF00"
                var data = JSON.parse(this.response);
                console.log(data);
                document.getElementById('tbody').innerHTML = "";
                data.forEach(element => {
                    const dataElement = document.createElement('tr');
                    if(i <= 3){
                        img.src = "images/Medals/medal"+i+".png";
                        dataElement.innerHTML = "<td> <img src='images/Medals/medal" + i +".png' class='imageTop3'> </td><td class='nickName'>" + element.user + "</td> <td class='points'>" + element.score + "</td>";
                    }else{
                        dataElement.innerHTML = "<td class='rank'>" +i+"</td><td class='nickName'>" + element.user + "</td> <td class='points'>" + element.score + "</td>";
                    }
                    document.getElementById('tbody').appendChild(dataElement);
                    i++;
                });
                
            }
        }
        submitted = true;
    }
};
const textbox = document.getElementById("user");
textbox.addEventListener("keypress", function onEvent(event) {
    if (event.key === "Enter") {
        document.getElementById("submitBtn").click();
    }
});
document.getElementById('playAgain').onclick = function(){
    start();
};
document.getElementById('startScreen').onclick = function(){
    firstStart();
};
canvas.addEventListener('click', ()=>{
    firstStart();
});



animate();


