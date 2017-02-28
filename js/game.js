// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d"); //indicamos las funciones que queremos usar de canvas (las que esten "dentro" de 2d)
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//esto hace debajo de <body>:
//<canvas id="micanvas" width="512" height="480">IOEHDFSIIHPAF</canvas>

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
//var livesHero = 3;

var princess = {};
//var princessesCaught = 0;

var stones = [];
var monsters = [];

var numStones = 1;
var numMonsters = 1;


//Save state
var livesHero = localStorage.getItem("livesHero");
if (livesHero == undefined){
	livesHero = 3;
}
localStorage.setItem("livesHero", livesHero);


var princessesCaught = localStorage.getItem("princessesCaught");
if (princessesCaught == undefined){
	princessesCaught = 0;
}
localStorage.setItem("princessesCaught", princessesCaught);

var numStones = localStorage.getItem("numStones");
if (numStones == undefined){
	numStones = 1;
}
localStorage.setItem("numStones", numStones);

var numMonsters = localStorage.getItem("numMonsters");
if (numMonsters == undefined){
	numMonsters = 1;
}
localStorage.setItem("numMonsters", numMonsters);



// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	//512w*480h
	//los arboles de alrededor miden 32*32
	//media princesa se mete en el bosque, la princesa mide 32*32
	princess.x = Math.random() * (455 - 28) + 28;
	princess.y = Math.random() * (415 - 32) + 32;

	stones = [];
	monsters = [];
	insertStones();
	insertMonsters();
};

var theyAreTouching = function (elem1, elem2){
	return (elem1.x <= (elem2.x + 30)
		&& elem2.x <= (elem1.x + 30)
		&& elem1.y <= (elem2.y + 30)
		&& elem2.y <= (elem1.y + 30))
};


var insertStones = function (){
	var stone = {};
	for (var i = 0; i < numStones; i++){
		stone.x = Math.random() * (455 - 28) + 28;
	  stone.y = Math.random() * (415 - 32) + 32;
		while ((theyAreTouching(stone, hero) || touchingAnyOtherStone(stone) || theyAreTouching(stone, princess))){
			stone.x = Math.random() * (455 - 28) + 28;
		  stone.y = Math.random() * (415 - 32) + 32;
		}
		stones.push(stone);
		stone = {};
	}
};

var touchingAnyStone = function (elem){
	for (var i = 0; i < numStones; i++){
		if (theyAreTouching(elem, stones[i])){
			return true;
		}
	}
	return false;
};

var touchingAnyOtherStone = function (elem){
	for (var i = 0; i < stones.length; i++){
		if (theyAreTouching(elem, stones[i])){
			return true;
		}
	}
	return false;
};


var insertMonsters = function (){
	var monster = {};
	for (var i = 0; i < numMonsters; i++){
		monster.x = Math.random() * (455 - 28) + 28;
	  monster.y = Math.random() * (415 - 32) + 32;
		while ((theyAreTouching(monster, hero) || touchingAnyStone(monster) || touchingAnyOtherMonster(monster) || theyAreTouching(monster, princess))){
			monster.x = Math.random() * (455 - 28) + 28;
		  monster.y = Math.random() * (415 - 32) + 32;
		}
		monsters.push(monster);
		monster = {};
	}
};


var touchingAnyOtherMonster = function (elem){
	for (var i = 0; i < monsters.length; i++){
		if (theyAreTouching(elem, monsters[i])){
			return true;
		}
	}
	return false;
};


var initializeVars = function (){
	livesHero = 3;
	localStorage.setItem("livesHero", livesHero);
	numStones = 1;
	localStorage.setItem("numStones", numStones);
	numMonsters = 1;
	localStorage.setItem("numMonsters", numMonsters);
};


// Update game objects
var update = function (modifier) {

	var heroX = hero.x;
	var heroY = hero.y;

	if (38 in keysDown) { // Player holding up
		var old_heroY = hero.y;
		hero.y -= hero.speed * modifier;
		if (hero.y < 32 || hero.y > 415){
			hero.y = old_heroY;
		}
	}
	if (40 in keysDown) { // Player holding down
		var old_heroY = hero.y;
		hero.y += hero.speed * modifier;
		if (hero.y < 32 || hero.y > 415){
			hero.y = old_heroY;
		}
	}
	if (37 in keysDown) { // Player holding left
		var old_heroX = hero.x;
		hero.x -= hero.speed * modifier;
		if (hero.x < 28 || hero.x > 455){
			hero.x = old_heroX;
		}
	}
	if (39 in keysDown) { // Player holding right
		var old_heroX = hero.x;
		hero.x += hero.speed * modifier;
		if (hero.x < 28 || hero.x > 455){
			hero.x = old_heroX;
		}
	}

	if (
		touchingAnyStone(hero)
	){
		hero.x = heroX;
		hero.y = heroY;
	}

	// Are the princess and the hero touching?
	if (
		theyAreTouching(princess, hero)
	) {
		++princessesCaught;
		localStorage.setItem("princessesCaught", princessesCaught);
		if (princessesCaught == 10){
			princessesCaught = 0;
			localStorage.setItem("princessesCaught", princessesCaught);
			if (numStones < 10){
				numStones += 1;
				localStorage.setItem("numStones", numStones);
				numMonsters += 1;
				localStorage.setItem("numMonsters", numMonsters);
			}
			else{
				initializeVars();
			}
		}
		reset();
	}

	// Are the monster and the hero touching?
	for (var i = 0; i < numMonsters; i++){
		if (
			theyAreTouching(monsters[i], hero)
		) {
			if (livesHero == 0){
				princessesCaught = 0;
				localStorage.setItem("princessesCaught", princessesCaught);
				initializeVars();
				reset();
			}
			else{
				--livesHero;
				localStorage.setItem("livesHero", livesHero);
				reset();
			}
		}
	}

};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady) {
		for (var i = 0; i < numStones; i++){
			ctx.drawImage(stoneImage, stones[i].x, stones[i].y);
		}
	}

	if (monsterReady) {
		for (var i = 0; i < numMonsters; i++){
			ctx.drawImage(monsterImage, monsters[i].x, monsters[i].y);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Lives: " + livesHero, 32, 64);
};

document.getElementById("menuBall1").onclick = function (){
	initializeVars();
	princessesCaught = 0;
	localStorage.setItem("princessesCaught", princessesCaught);
	main();
}

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
