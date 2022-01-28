var ground, groundImg, invisibleGround;
var trex,trexRunning,trexDead;
var nuvemImg;
var obst1, obst2, obst3, obst4, obst5, obst6;
var pontuacao = 0;
var grupoObstaculos, grupoNuvens;
var JOGAR = 1; var ENCERRAR = 0; var estadoDeJogo = JOGAR;
var gameOver; var restart; var gameOverImg; var restartImg;
var somSalto, somMorte, somPontos;

function preload(){
  trexRunning = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImg = loadImage("ground2.png");
  nuvemImg = loadImage("cloud.png");
  obst1 = loadImage("obstacle1.png");
  obst2 = loadImage("obstacle2.png");
  obst3 = loadImage("obstacle3.png");
  obst4 = loadImage("obstacle4.png");
  obst5 = loadImage("obstacle5.png");
  obst6 = loadImage("obstacle6.png");
  trexDead = loadAnimation("trex_collided.png");
  gameOverImg = loadImage("gameOver4.jpeg");
  restartImg = loadImage("restart.png");
  somSalto = loadSound("jump.mp3");
  somMorte = loadSound("die.mp3");
  somPontos = loadSound("checkpoint.mp3");
}

function setup(){
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trexRunning);
  trex.addAnimation("dead", trexDead);
  trex.scale = 0.5;

  ground = createSprite(width/2,height-20,width,20);
  ground.addImage(groundImg);

  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;  
 // var x = Math.round(random(1,10));
 //console.log(x);
  
  grupoObstaculos = new Group();
  grupoNuvens = new Group();

 //trex.debug = true;
 trex.setCollider("circle", 0,0,40); // x, y e raio colisor
 //trex.setCollider("rectangle", 0,0,200,50);

 gameOver = createSprite(width/2,height/2);
 gameOver.addImage(gameOverImg);
 gameOver.visible = false;
 gameOver.scale = 0.5;
 restart = createSprite(width/2,height/2+50);
 restart.addImage(restartImg);
 restart.scale = 0.5;
 restart.visible = false;

}


function draw(){
  //console.count("o draw é chamado");
  //console.time();
  background("white");
  text("Pontuação: " + Math.round(pontuacao),width/2-50,height-400);
  if(estadoDeJogo == JOGAR){
    pontuacao = pontuacao + frameRate()/60;

    if (Math.round(pontuacao)>0 && Math.round(pontuacao)%200 === 0){
      somPontos.play();
    }
   
    ground.velocityX = -(6+pontuacao/100);

    if(ground.x<0){
      ground.x = ground.width/2;
    }
    
    if(keyDown("space") && trex.y > height-60 || touches.length>0 && trex.y>height-60){
      trex.velocityY = -12;   
      somSalto.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.8;
    
    createClouds();
    createObstacles();

    if(grupoObstaculos.isTouching(trex)){
      estadoDeJogo = ENCERRAR;
      somMorte.play();
      //somSalto.play();
      //trex.velocityY = -10;
    }

  }
  
  else if(estadoDeJogo == ENCERRAR){
    ground.velocityX = 0;
    trex.velocityY = 0;
    grupoObstaculos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);
    
    trex.changeAnimation("dead");

    grupoObstaculos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);

    gameOver.visible = true;
    restart.visible = true;

    if(mousePressedOver(restart) || touches.length>0){
      reset();
      touches = [];
    }
  }

  trex.collide(invisibleGround);
  
  drawSprites();
  //console.timeEnd();
}

function createClouds (){
  if(frameCount%60 === 0){
    var nuvem = createSprite(width,100,40,10);
    nuvem.velocityX = -3;
    nuvem.addImage(nuvemImg);
    nuvem.scale = 0.5;
    nuvem.y = Math.round(random(height-100,height-350));
    nuvem.depth = trex.depth;
    trex.depth++;
    nuvem.lifetime = 600; //distância/velocidade = 200;
    grupoNuvens.add(nuvem);
  }

}
function createObstacles(){
  if(frameCount%60===0){
    var obstaculo = createSprite(width,height-35,10,40);
    obstaculo.velocityX = -(6+pontuacao/100);
    var rand = Math.round(random(1,6));
    switch (rand) {
      case 1: obstaculo.addImage(obst1);
        break;
      case 2: obstaculo.addImage(obst2);
        break;
      case 3: obstaculo.addImage(obst3);
        break;
      case 4: obstaculo.addImage(obst4);
        break;
      case 5: obstaculo.addImage(obst5);
        break;
      case 6: obstaculo.addImage(obst6);
        break;
      default:
        break;
    }
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 600;
    grupoObstaculos.add(obstaculo);
  }
}

function reset(){
 estadoDeJogo = JOGAR;
 pontuacao = 0;
 grupoObstaculos.destroyEach();
 grupoNuvens.destroyEach();
 gameOver.visible = false;
 restart.visible = false;
 trex.changeAnimation("running");
}