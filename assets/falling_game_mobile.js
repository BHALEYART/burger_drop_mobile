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

// Fixed canvas dimensions for vertical format
var GAME_WIDTH = 450;
var GAME_HEIGHT = 800;

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
// Screen margins for boundaries
var SCREEN_MARGIN_LEFT = 10;
var SCREEN_MARGIN_RIGHT = 10;
var SCREEN_MARGIN_BOTTOM = 20;

var playerX = GAME_WIDTH / 2 - playerWidth / 2;
var playerY = GAME_HEIGHT - playerHeight - SCREEN_MARGIN_BOTTOM;
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

// Device detection
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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
startButton.innerText = isMobile ? "🎮 TAP TO START 🎮" : "🎮 CLICK TO START 🎮";
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
restartButton.style.width = "120px";
restartButton.style.height = "45px";
restartButton.style.backgroundColor = "orange";
restartButton.style.color = "black";
restartButton.style.border = "none";
restartButton.style.borderRadius = "5px";
restartButton.style.zIndex = "9999";
restartButton.style.cursor = "pointer";
restartButton.style.fontSize = "16px";

watchButton.innerText = "BHB Links";
watchButton.style.position = "absolute";
watchButton.style.left = "50%";
watchButton.style.top = "80%";
watchButton.style.transform = "translate(-50%, -50%)";
watchButton.style.width = "120px";
watchButton.style.height = "45px";
watchButton.style.backgroundColor = "orange";
watchButton.style.color = "black";
watchButton.style.border = "none";
watchButton.style.borderRadius = "5px";
watchButton.style.zIndex = "9999";
watchButton.style.cursor = "pointer";
watchButton.style.fontSize = "16px";

// Control toggle button (only on mobile)
if (isMobile) {
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
  controlToggleButton.style.display = "none";
}

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

// Set fixed canvas size
function setCanvasSize() {
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  
  // Center canvas on screen with CSS
  canvas.style.maxWidth = "100%";
  canvas.style.maxHeight = "100vh";
  canvas.style.width = GAME_WIDTH + "px";
  canvas.style.height = GAME_HEIGHT + "px";
  
  // On mobile, scale to fit screen while maintaining aspect ratio
  if (isMobile) {
    var scale = Math.min(
      window.innerWidth / GAME_WIDTH,
      window.innerHeight / GAME_HEIGHT
    );
    canvas.style.width = (GAME_WIDTH * scale) + "px";
    canvas.style.height = (GAME_HEIGHT * scale) + "px";
  }
}

// Start game function
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    initializeAudio();
    startButton.style.display = "none";
    
    if (isMobile) {
      controlToggleButton.style.display = "block";
      document.body.appendChild(controlToggleButton);
    }
    
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
  targetPlayerX = (GAME_WIDTH / 2) + (tiltRatio * (GAME_WIDTH / 2) * tiltSensitivity);
  
  // Constrain to screen boundaries with margins
  targetPlayerX = Math.max(SCREEN_MARGIN_LEFT, Math.min(GAME_WIDTH - playerWidth - SCREEN_MARGIN_RIGHT, targetPlayerX));
}

// Update player position with smoothing
function updatePlayerPosition() {
  if (tiltEnabled && !isGameOver && gameStarted) {
    playerX += (targetPlayerX - playerX) * tiltSmoothing;
    // Ensure constraints are enforced even during smoothing
    playerX = Math.max(SCREEN_MARGIN_LEFT, Math.min(GAME_WIDTH - playerWidth - SCREEN_MARGIN_RIGHT, playerX));
  }
}

// Toggle between touch and tilt controls
if (isMobile) {
  controlToggleButton.addEventListener("click", function() {
    if (!tiltEnabled) {
      requestOrientationPermission();
    } else {
      disableTiltControls();
    }
  });
}

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
    var spawnableWidth = GAME_WIDTH - SCREEN_MARGIN_LEFT - SCREEN_MARGIN_RIGHT;
    
    if (randomNum < 0.85) {
      var goodItem = {
        x: SCREEN_MARGIN_LEFT + Math.random() * (spawnableWidth - goodItemWidth),
        y: -goodItemHeight,
        speed: itemSpeed
      };
      goodItems.push(goodItem);
    } else if (randomNum < 0.985) {
      var badItem = {
        x: SCREEN_MARGIN_LEFT + Math.random() * (spawnableWidth - badItemWidth),
        y: -badItemHeight,
        speed: itemSpeed
      };
      badItems.push(badItem);
    } else if (randomNum < 0.995) {
      var surpriseItem = {
        x: SCREEN_MARGIN_LEFT + Math.random() * (spawnableWidth - surpriseItemWidth),
        y: -surpriseItemHeight,
        speed: itemSpeed
      };
      surpriseItems.push(surpriseItem);
    } else if (randomNum < 1.0) {
      var medicalItem = {
        x: SCREEN_MARGIN_LEFT + Math.random() * (spawnableWidth - medicalItemWidth),
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
  
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

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
    if (goodItem.y > GAME_HEIGHT) {
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
    if (badItem.y > GAME_HEIGHT) {
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
    if (surpriseItem.y > GAME_HEIGHT) {
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
    if (medicalItem.y > GAME_HEIGHT) {
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
    var heartX = GAME_WIDTH - (i + 1) * (heartWidth + 10);
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

  // Show control mode indicator only on mobile
  if (isMobile) {
    ctx.font = "16px Arial";
    ctx.fillStyle = tiltEnabled ? "lightgreen" : "orange";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    var controlText = tiltEnabled ? "📱 TILT MODE" : "🎮 TOUCH MODE";
    ctx.strokeText(controlText, 10, GAME_HEIGHT - 20);
    ctx.fillText(controlText, 10, GAME_HEIGHT - 20);
  } else {
    ctx.font = "16px Arial";
    ctx.fillStyle = "lightblue";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText("🖱️ MOUSE MODE", 10, GAME_HEIGHT - 20);
    ctx.fillText("🖱️ MOUSE MODE", 10, GAME_HEIGHT - 20);
  }

  if (hearts <= 0) {
    isGameOver = true;
    backgroundMusic.pause();
    ctx.drawImage(
      gameOverImage,
      GAME_WIDTH / 2 - 150,
      GAME_HEIGHT / 2 - 150,
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
      GAME_HEIGHT - 480,
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

// Handle mouse movement (PC)
canvas.addEventListener("mousemove", function(event) {
  if (!isMobile && !isGameOver && gameStarted) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = GAME_WIDTH / rect.width;
    var mouseX = (event.clientX - rect.left) * scaleX;
    playerX = mouseX - playerWidth / 2;
    // Constrain to screen boundaries with margins
    playerX = Math.max(SCREEN_MARGIN_LEFT, Math.min(GAME_WIDTH - playerWidth - SCREEN_MARGIN_RIGHT, playerX));
  }
});

// Handle touch movement (Mobile)
canvas.addEventListener("touchmove", function (event) {
  if (!tiltEnabled && !isGameOver && gameStarted) {
    event.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var scaleX = GAME_WIDTH / rect.width;
    var touchX = (event.touches[0].clientX - rect.left) * scaleX;
    playerX = touchX - playerWidth / 2;
    // Constrain to screen boundaries with margins
    playerX = Math.max(SCREEN_MARGIN_LEFT, Math.min(GAME_WIDTH - playerWidth - SCREEN_MARGIN_RIGHT, playerX));
    targetPlayerX = playerX;
  }
}, { passive: false });

// Initialize canvas size
setCanvasSize();

// Handle window resize for mobile
window.addEventListener("resize", function() {
  setCanvasSize();
});
