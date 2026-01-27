// Initialize variables
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var playerImage = new Image();
var playerImageOriginal = new Image();
var goodItemImage = new Image();
var badItemImage = new Image();
var surpriseItemImage = new Image();
var medicalItemImage = new Image();
var heartImage = new Image();
var gameOverImage = new Image();
var menuOverlayImage = new Image();
var gameOverPileImage = new Image();
var surpriseItemCounter = 0;
var restartButton = document.createElement("button");
var watchButton = document.createElement("button");
var controlToggleButton = document.createElement("button");
var startButton = document.createElement("button");
var playerWidth = 70;
var playerHeight = 100;
var goodItemWidth = 40;
var goodItemHeight = 40;
var badItemWidth = 80;
var badItemHeight = 80;
var surpriseItemWidth = 30;
var surpriseItemHeight = 50;
var medicalItemWidth = 50;
var medicalItemHeight = 50;
var heartWidth = 30;
var heartHeight = 30;
var playerX = canvas.width / 2 - playerWidth / 2;
var playerY = canvas.height - playerHeight;
var goodItems = [];
var badItems = [];
var surpriseItems = [];
var medicalItems = [];
var maxItems = 8;
var itemSpeed = 2;
var maxFallSpeed = 25;
var fallAcceleration = 0.004;
var spawnCounter = 1;
var score = 0;
var hearts = 3;
var isGameOver = false;
var isPlayerImmune = false;
var immuneDuration = 10;
var immunityTimer = 0;
var gameStarted = false;
var audioInitialized = false;

// Tilt control variables
var tiltEnabled = false;
var tiltCalibrated = false;
var tiltCenterGamma = 0;
var tiltSensitivity = 3.5;
var tiltSmoothing = 0.15;
var targetPlayerX = playerX;
var maxTiltAngle = 30;

// Audio variables
var backgroundMusic = new Audio("assets/game_music.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.1;
var immuneMusic = new Audio("assets/immune_music.mp3");
immuneMusic.loop = false;
immuneMusic.volume = 0.3;
var goodItemSound = new Audio("assets/point_sound.mp3");
var badItemSound = new Audio("assets/damage_sound.mp3");
badItemSound.volume = 0.7;
var lowScoreSound = new Audio("assets/low_score_gameover.mp3");
lowScoreSound.volume = 0.7;
var highScoreSound = new Audio("assets/high_score_gameover.mp3");
highScoreSound.volume = 0.7;

// Preload audio to avoid delays
function preloadAudio() {
  var audioFiles = [backgroundMusic, immuneMusic, goodItemSound, badItemSound, lowScoreSound, highScoreSound];
  audioFiles.forEach(function(audio) {
    audio.load();
  });
}

// Initialize audio after user interaction
function initializeAudio() {
  if (!audioInitialized) {
    // Play and immediately pause each sound to unlock audio
    var audioFiles = [backgroundMusic, immuneMusic, goodItemSound, badItemSound, lowScoreSound, highScoreSound];
    audioFiles.forEach(function(audio) {
      var playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(function() {
          audio.pause();
          audio.currentTime = 0;
        }).catch(function(error) {
          console.log("Audio initialization error:", error);
        });
      }
    });
    audioInitialized = true;
  }
}

// Safe audio play function with promise handling
function safePlayAudio(audio) {
  if (audioInitialized) {
    var playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(function(error) {
        console.log("Audio play error:", error);
      });
    }
  }
}

// Style start button
startButton.innerText = "🎮 TAP TO START 🎮";
startButton.style.position = "absolute";
startButton.style.left = "50%";
startButton.style.top = "50%";
startButton.style.transform = "translate(-50%, -50%)";
startButton.style.width = "200px";
startButton.style.height = "60px";
startButton.style.backgroundColor = "orange";
startButton.style.color = "black";
startButton.style.border = "3px solid black";
startButton.style.borderRadius = "10px";
startButton.style.fontSize = "18px";
startButton.style.fontWeight = "bold";
startButton.style.zIndex = "9999";
startButton.style.cursor = "pointer";
document.body.appendChild(startButton);

// Style buttons
restartButton.innerText = "Try Again?";
restartButton.style.position = "absolute";
restartButton.style.left = "50%";
restartButton.style.top = "70%";
restartButton.style.transform = "translate(-50%, -50%)";
restartButton.style.width = "100px";
restartButton.style.height = "40px";
restartButton.style.backgroundColor = "orange";
restartButton.style.color = "black";
restartButton.style.border = "none";
restartButton.style.borderRadius = "5px";
restartButton.style.zIndex = "9999";

watchButton.innerText = "BHB Links";
watchButton.style.position = "absolute";
watchButton.style.left = "50%";
watchButton.style.top = "80%";
watchButton.style.transform = "translate(-50%, -50%)";
watchButton.style.width = "100px";
watchButton.style.height = "40px";
watchButton.style.backgroundColor = "orange";
watchButton.style.color = "black";
watchButton.style.border = "none";
watchButton.style.borderRadius = "5px";
watchButton.style.zIndex = "9999";

// Control toggle button
controlToggleButton.innerText = "🎮 Touch";
controlToggleButton.style.position = "absolute";
controlToggleButton.style.right = "10px";
controlToggleButton.style.bottom = "10px";
controlToggleButton.style.width = "90px";
controlToggleButton.style.height = "40px";
controlToggleButton.style.backgroundColor = "rgba(255, 165, 0, 0.8)";
controlToggleButton.style.color = "black";
controlToggleButton.style.border = "2px solid black";
controlToggleButton.style.borderRadius = "5px";
controlToggleButton.style.zIndex = "9999";
controlToggleButton.style.fontWeight = "bold";
controlToggleButton.style.fontSize = "14px";
controlToggleButton.style.display = "none"; // Hidden until game starts

// Load images
gameOverPileImage.src = "assets/game_over_pile.png";
playerImage.src = "assets/player.png";
playerImageOriginal.src = "assets/player_original.png";
goodItemImage.src = "assets/good_item.png";
badItemImage.src = "assets/bad_item.png";
surpriseItemImage.src = "assets/surprise_item.png";
medicalItemImage.src = "assets/medical_item.png";
heartImage.src = "assets/heart.png";
gameOverImage.src = "assets/game_over.png";
menuOverlayImage.src = "assets/menu_shader.png";

// Preload audio files
preloadAudio();

// Start game function
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    initializeAudio();
    startButton.style.display = "none";
    controlToggleButton.style.display = "block";
    document.body.appendChild(controlToggleButton);
    
    // Start background music after a short delay
    setTimeout(function() {
      safePlayAudio(backgroundMusic);
    }, 500);
    
    // Start the game loop
    resetItems();
    update();
  }
}

// Start button listener
startButton.addEventListener("click", startGame);

// Request device orientation permission (required for iOS 13+)
function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(function(permissionState) {
        if (permissionState === 'granted') {
          enableTiltControls();
        } else {
          alert('Tilt permission denied. Using touch controls.');
        }
      })
      .catch(function(error) {
        console.error('Error requesting orientation permission:', error);
        alert('Could not enable tilt controls. Using touch controls.');
      });
  } else {
    enableTiltControls();
  }
}

// Enable tilt controls
function enableTiltControls() {
  tiltEnabled = true;
  tiltCalibrated = false;
  controlToggleButton.innerText = "📱 Tilt";
  controlToggleButton.style.backgroundColor = "rgba(144, 238, 144, 0.8)";
  
  window.addEventListener('deviceorientation', handleTilt);
  
  setTimeout(function() {
    if (!tiltCalibrated) {
      tiltCenterGamma = 0;
      tiltCalibrated = true;
    }
  }, 500);
}

// Disable tilt controls
function disableTiltControls() {
  tiltEnabled = false;
  controlToggleButton.innerText = "🎮 Touch";
  controlToggleButton.style.backgroundColor = "rgba(255, 165, 0, 0.8)";
  window.removeEventListener('deviceorientation', handleTilt);
}

// Handle tilt input
function handleTilt(event) {
  if (!tiltEnabled || isGameOver || !gameStarted) return;
  
  var gamma = event.gamma;
  
  if (!tiltCalibrated) {
    tiltCenterGamma = gamma;
    tiltCalibrated = true;
  }
  
  var relativeTilt = gamma - tiltCenterGamma;
  relativeTilt = Math.max(-maxTiltAngle, Math.min(maxTiltAngle, relativeTilt));
  
  var tiltRatio = relativeTilt / maxTiltAngle;
  targetPlayerX = (canvas.width / 2) + (tiltRatio * (canvas.width / 2) * tiltSensitivity);
  
  targetPlayerX = Math.max(0, Math.min(canvas.width - playerWidth, targetPlayerX));
}

// Update player position with smoothing
function updatePlayerPosition() {
  if (tiltEnabled && !isGameOver && gameStarted) {
    playerX += (targetPlayerX - playerX) * tiltSmoothing;
  }
}

// Toggle between touch and tilt controls
controlToggleButton.addEventListener("click", function() {
  if (!tiltEnabled) {
    requestOrientationPermission();
  } else {
    disableTiltControls();
  }
});

// Handle player-item collision
function checkCollision() {
  for (var i = 0; i < goodItems.length; i++) {
    var goodItem = goodItems[i];
    if (
      playerX < goodItem.x + goodItemWidth &&
      playerX + playerWidth > goodItem.x &&
      playerY < goodItem.y + goodItemHeight &&
      playerY + playerHeight > goodItem.y
    ) {
      score += 10 * itemSpeed;
      safePlayAudio(goodItemSound);
      goodItems.splice(i, 1);
    }
  }

  for (var i = 0; i < badItems.length; i++) {
    var badItem = badItems[i];
    if (
      playerX < badItem.x + badItemWidth &&
      playerX + playerWidth > badItem.x &&
      playerY < badItem.y + badItemHeight &&
      playerY + playerHeight > badItem.y
    ) {
      if (!isPlayerImmune) {
        hearts--;
        score -= 50;
        safePlayAudio(badItemSound);
        maxItems += 1;
      }
      badItems.splice(i, 1);
    }
  }

  for (var i = 0; i < medicalItems.length; i++) {
    var medicalItem = medicalItems[i];
    if (
      playerX < medicalItem.x + medicalItemWidth &&
      playerX + playerWidth > medicalItem.x &&
      playerY < medicalItem.y + medicalItemHeight &&
      playerY + playerHeight > medicalItem.y
    ) {
      if (hearts < 3) {
        hearts = 3;
        score += 100;
        safePlayAudio(goodItemSound);
        maxItems += 1;
        medicalItems.splice(i, 1);
      }
    }
  }

  for (var i = 0; i < surpriseItems.length; i++) {
    var surpriseItem = surpriseItems[i];
    if (
      playerX < surpriseItem.x + surpriseItemWidth &&
      playerX + playerWidth > surpriseItem.x &&
      playerY < surpriseItem.y + surpriseItemHeight &&
      playerY + playerHeight > surpriseItem.y
    ) {
      maxItems += 1;
      score += 100;
      safePlayAudio(immuneMusic);
      isPlayerImmune = true;
      immunityTimer = immuneDuration;
      surpriseItems.splice(i, 1);
      if (isPlayerImmune == true) {
        playerImage.src = "assets/player.png";
      } else {
        playerImage.src = "assets/player_original.png";
      }
      surpriseItemCounter++;
    }
  }
}

// Reset item position and speed
function resetItems() {
  if (goodItems.length + badItems.length + surpriseItems.length < maxItems) {
    var randomNum = Math.random();
    if (randomNum < 0.85) {
      var goodItem = {
        x: Math.random() * (canvas.width - goodItemWidth),
        y: -goodItemHeight,
        speed: itemSpeed
      };
      goodItems.push(goodItem);
    } else if (randomNum < 0.985) {
      var badItem = {
        x: Math.random() * (canvas.width - badItemWidth),
        y: -badItemHeight,
        speed: itemSpeed
      };
      badItems.push(badItem);
    } else if (randomNum < 0.995) {
      var surpriseItem = {
        x: Math.random() * (canvas.width - surpriseItemWidth),
        y: -surpriseItemHeight,
        speed: itemSpeed
      };
      surpriseItems.push(surpriseItem);
    } else if (randomNum < 1.0) {
      var medicalItem = {
        x: Math.random() * (canvas.width - medicalItemWidth),
        y: -medicalItemHeight,
        speed: itemSpeed
      };
      medicalItems.push(medicalItem);
    }
  }
}

// Update game objects and render
function update() {
  if (!gameStarted) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayerPosition();

  if (isPlayerImmune) {
    ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
  } else {
    ctx.drawImage(
      playerImageOriginal,
      playerX,
      playerY,
      playerWidth,
      playerHeight
    );
  }

  for (var i = 0; i < goodItems.length; i++) {
    var goodItem = goodItems[i];
    ctx.drawImage(
      goodItemImage,
      goodItem.x,
      goodItem.y,
      goodItemWidth,
      goodItemHeight
    );
    goodItem.y += goodItem.speed;
    if (goodItem.y > canvas.height) {
      goodItems.splice(i, 1);
    }
  }

  for (var i = 0; i < badItems.length; i++) {
    var badItem = badItems[i];
    ctx.drawImage(
      badItemImage,
      badItem.x,
      badItem.y,
      badItemWidth,
      badItemHeight
    );
    badItem.y += badItem.speed;
    if (badItem.y > canvas.height) {
      badItems.splice(i, 1);
    }
  }

  for (var i = 0; i < surpriseItems.length; i++) {
    var surpriseItem = surpriseItems[i];
    ctx.drawImage(
      surpriseItemImage,
      surpriseItem.x,
      surpriseItem.y,
      surpriseItemWidth,
      surpriseItemHeight
    );
    surpriseItem.y += surpriseItem.speed;
    if (surpriseItem.y > canvas.height) {
      surpriseItems.splice(i, 1);
    }
  }

  for (var i = 0; i < medicalItems.length; i++) {
    var medicalItem = medicalItems[i];
    ctx.drawImage(
      medicalItemImage,
      medicalItem.x,
      medicalItem.y,
      medicalItemWidth,
      medicalItemHeight
    );
    medicalItem.y += medicalItem.speed;
    if (medicalItem.y > canvas.height) {
      medicalItems.splice(i, 1);
    }
  }

  checkCollision();

  ctx.font = "24px Arial";
  ctx.fillStyle = "orange";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeText("Score: " + Math.floor(score), 10, 30);
  ctx.fillText("Score: " + Math.floor(score), 10, 30);
  if(score <= 0) {
    score = 0; 
  }

  ctx.font = "24px Arial";
  ctx.fillStyle = "yellow";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeText("SpeedX: " + Math.floor(itemSpeed), 180, 30);
  ctx.fillText("SpeedX: " + Math.floor(itemSpeed), 180, 30);

  for (var i = 0; i < hearts; i++) {
    var heartX = canvas.width - (i + 1) * (heartWidth + 10);
    var heartY = 10;
    ctx.drawImage(heartImage, heartX, heartY, heartWidth, heartHeight);
  }

  if (isPlayerImmune) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText("Immunity: " + Math.floor(immunityTimer) + "s", 10, 60);
    ctx.fillText("Immunity: " + Math.floor(immunityTimer) + "s", 10, 60);
  }

  ctx.font = "16px Arial";
  ctx.fillStyle = tiltEnabled ? "lightgreen" : "orange";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  var controlText = tiltEnabled ? "📱 TILT MODE" : "🎮 TOUCH MODE";
  ctx.strokeText(controlText, 10, canvas.height - 20);
  ctx.fillText(controlText, 10, canvas.height - 20);

  if (hearts <= 0) {
    isGameOver = true;
    backgroundMusic.pause();
    ctx.drawImage(
      gameOverImage,
      canvas.width / 2 - 150,
      canvas.height / 2 - 150,
      300,
      300
    );
    if (score < 1000) {
      safePlayAudio(lowScoreSound);
    } else {
      safePlayAudio(highScoreSound);
    }
    document.body.appendChild(restartButton);
    document.body.appendChild(watchButton);
    ctx.drawImage(
      gameOverPileImage,
      -70,
      320,
      600,
      600
    );
    return;
  }

  if (isPlayerImmune) {
    immunityTimer -= 1 / 60;
    if (immunityTimer <= 0) {
      isPlayerImmune = false;
      immuneMusic.pause();
      immuneMusic.currentTime = 0;
      playerImage.src = "assets/player_original.png";
    }
  }

  itemSpeed += fallAcceleration;
  if (itemSpeed > maxFallSpeed) {
    itemSpeed = maxFallSpeed;
  }

  spawnCounter++;
  if (spawnCounter % 10 === 0) {
    resetItems();
  }

  requestAnimationFrame(update);
}

// restart button listener
restartButton.addEventListener("click", function () {
  window.location.reload();
});

// Add click event listener to URL button
watchButton.addEventListener("click", function() {
  window.location.href = ("https://bombpop.link/bigheadbillions");
});

// Handle touch movement
canvas.addEventListener("touchmove", function (event) {
  if (!tiltEnabled && !isGameOver && gameStarted) {
    var rect = canvas.getBoundingClientRect();
    playerX = event.touches[0].clientX - rect.left - playerWidth / 2;
    targetPlayerX = playerX;
  }
});

function adjustCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", adjustCanvasSize);
adjustCanvasSize();
