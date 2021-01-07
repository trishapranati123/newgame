var ground, groundimg;
var player, playerimg;
var clouds, cloudsimg;
var invisibleground;
var enemies, enemyimg;
var obstaclesGroup, cloudsGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score = 5;
var count = 0;
var coincount = 0;
var instruct;
function preload() {
  bg = loadImage("images/valley.jpg");
  groundimg = loadImage("images/rope5.png");

  boyrunning = loadAnimation(
    "images/boy1.png",
    "images/boy2.png",
    "images/boy3.png",
    "images/boy4.png",
    "images/boy5.png",
    "images/boy6.png",
    "images/boy7.png"
    
  );
  //playerimg = loadAnimation("images/player1.png", "images/player2.png");
  obstacleImg = loadImage("images/land_monster_t.png");
  //obstacleImg = loadImage("images/fire_snipped_transparent.png");
  cloudsimg = loadImage("images/cloud.png");
  player_deadimg = loadAnimation("images/player_dead.png");
  player_deadimg.scale = 0.2;
  gameoverimg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
  bulletimg = loadImage("images/bullet1.png");
  enemyimg = loadAnimation("images/enemy1.png", "images/enemy2.png");
  //enemyimg = loadAnimation("images/most_c.png");
  enemy_dieimg = loadAnimation("images/enemy1.png");
  playerheadimg = loadImage("images/player-head.png");
  coinimg = loadImage("images/coins.png");
  textimg = loadImage("images/text.png");
}

function setup() {
  //createCanvas(1000, 400);
  createCanvas(1600, 600);
  ground = createSprite(600, 390, 1200, 10);
  ground.addImage("ground", groundimg);
  ground.x = ground.width / 2;
  //ground.visible = false;

  player = createSprite(50, 335, 10, 10);
  // player = createSprite(100, 380, 10, 10);
  player.addAnimation("boy", boyrunning);
  player.addAnimation("player_dead", player_deadimg);
  player.scale = 0.5;

  invisibleground = createSprite(600, 385, 1200, 10);
  invisibleground.visible = false;

  gameOver = createSprite(620, 150);
  gameOver.addImage("gameover", gameoverimg);
  gameOver.scale = 0.5;

  restart = createSprite(1100, 40);
  restart.addImage("restart", restartImg);
  restart.scale = 0.15;

  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  bulletGroup = new Group();
  enemyGroup = new Group();
  coinGroup = new Group();

  playerhead = createSprite(50, 50, 10, 10);
  playerhead.addImage("playerhead", playerheadimg);
  playerhead.scale = 0.2;

  coin = createSprite(200, 50, 10, 10);
  coin.addImage("coin", coinimg);
  coin.scale = 0.5;

  instruct = createSprite(600, 170);
  instruct.addImage("instruct", textimg);
  instruct.lifetime = 200;
}

function draw() {
  background(bg);
  drawSprites();

  console.log(frameCount);
  fill("black");
  textSize(35);
  textFont("monospace");
  text(" x ", 70, 60);
  text(score, 120, 60);

  textSize(35);
  text("SCORE:" + Math.round(count), 320, 60);
  text(coincount, 250, 60);
  text(" x ", 200, 60);
  if (gameState === PLAY) {
    ground.velocityX = -7;
    count = count + 0.1;
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (keyDown("UP_ARROW") && player.y > 329) {
      player.velocityY = -20;
    }

    if (keyWentDown("space")) {
      bullet = createSprite(player.x, player.y);
      bullet.addImage("bullet", bulletimg);
      bullet.velocityX = 4;
      bulletGroup.add(bullet);
    }

    player.velocityY = player.velocityY + 1;
    spawnPipes();
    spawnClouds();
    spawnEnemies();
    spawnCoins();
    if (obstaclesGroup.isTouching(player)) {
      score = score - 1;
      count = count - 5;
      gameState = END;
    }
    if (enemyGroup.isTouching(player)) {
      score = score - 1;
      count = count - 5;
      gameState = END;
    }

    if (bulletGroup.isTouching(enemyGroup)) {
      enemyGroup.destroyEach();
      bulletGroup.destroyEach();
    }
    for (var j = 0; j < coinGroup.length; j++) {
      if (coinGroup.isTouching(player)) {
        coinGroup.get(j).destroy();
        coincount = coincount + 1;
      }
    }
  } else if (gameState === END) {
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    enemyGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    enemyGroup.destroyEach();
    coinGroup.setVelocityXEach(0);
    coinGroup.setLifetimeEach(-1);
    player.velocityY = 0;
    player.changeAnimation("player_dead", player_deadimg);
    gameOver.visible = true;
    restart.visible = true;
  }

  if (gameState === END && score > 0) {
    reset();
  }
  if (score === 0) {
    gameState === END;
  }
  if (mousePressedOver(restart)) {
    reset();
    count = 0;
    score = 5;
    coincount = 0;
    coinGroup.destroyEach();
    instruct = createSprite(600, 170);
    instruct.addImage("instruct", textimg);
    instruct.lifetime = 150;
  }
  player.collide(invisibleground);
  console.log(player.y);
}
function spawnPipes() {
  if (frameCount % 90 === 0) {
    //pipes = createSprite(1200, 320, 10, 10);
    pipes = createSprite(1200, 320, 10, 10);
    // pipes = createSprite(1200, 500, 10, 10);
    pipes.addImage("pipes", obstacleImg);
    pipes.velocityX = -5;
    pipes.scale = 0.5;
    pipes.lifetime = 240;
    obstaclesGroup.add(pipes);
  }
}
function spawnClouds() {
  if (frameCount % 100 === 0) {
    clouds = createSprite(1200, random(50, 150), 10, 10);
    clouds.addImage("clouds", cloudsimg);
    clouds.velocityX = -3;
    clouds.scale = 2;
    clouds.lifetime = 420;
    cloudsGroup.add(clouds);
  }
}
function spawnEnemies() {
  if (frameCount % 300 === 0) {
    enemies = createSprite(1200, 330, 10, 20);
    //enemies = createSprite(1200, 510, 10, 20);
    enemies.addAnimation("enemy", enemyimg);
    enemies.scale = 0.15;
    enemies.velocityX = -6;
    enemies.lifetime = 200;
    enemyGroup.add(enemies);
  }
}
function reset() {
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  enemyGroup.destroyEach();
  coinGroup.destroyEach();
  gameOver.visible = false;
  restart.visible = false;

  player.changeAnimation("player", playerimg);
}

function spawnCoins() {
  if (frameCount % 200 === 0) {
    for (var i = 0; i < 5; i++) {
      coin = createSprite(1200 + i * 20, 200, 10, 10);
      coin.addImage("coin", coinimg);
      coin.scale = 0.5;
      coin.velocityX = -4;
      coin.lifetime = 1000;
      coinGroup.add(coin);
    }
  }
}
