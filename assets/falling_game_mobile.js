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
var musicMuteButton = document.createElement("button");
var sfxMuteButton = document.createElement("button");

// Fixed canvas dimensions for vertical format
var GAME_WIDTH = 450;
var GAME_HEIGHT = 800;

var playerWidth = 70;
var playerHeight = 106;
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
var SCREEN_MARGIN_BOTTOM = 50;

var playerX = GAME_WIDTH / 2 - playerWidth / 2;
var playerY = GAME_HEIGHT - playerHeight - SCREEN_MARGIN_BOTTOM;
var goodItems = [];
var badItems = [];
var surpriseItems = [];
var medicalItems = [];
var shieldItems = [];  // New shield item array
var clockItems = [];   // New clock item array
var nukeItems = [];    // New nuke item array
var maxItems = 8;
var itemSpeed = 2;
var maxFallSpeed = 24;  // Changed from 25 to 24
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
var musicMuted = false;
var sfxMuted = false;
var damageFlash = 0;  // New variable for damage flash effect
var damageFlashDecay = 0.05;  // How fast the flash fades

// New power-up variables
var shieldActive = false;
var shieldDuration = 10;
var shieldTimer = 0;
var shieldItemWidth = 40;
var shieldItemHeight = 40;
var clockItemWidth = 40;
var clockItemHeight = 40;
var nukeItemWidth = 40;
var nukeItemHeight = 40;

// Device detection
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Tilt control variables
var tiltEnabled = isMobile; // Default to tilt on mobile
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
    // Check if this is background music or SFX
    var isMusic = (audio === backgroundMusic || audio === immuneMusic);
    var isMuted = isMusic ? musicMuted : sfxMuted;
    
    if (!isMuted) {
      var playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(function(error) {
          console.log("Audio play error:", error);
        });
      }
    }
  }
}

// Style start button
startButton.innerText = isMobile ? "🎮 TAP TO START 🎮" : "🍔 Start 🍔";
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

// Create start menu title
var startTitle = document.createElement("div");
startTitle.innerText = "BURGER DROP";
startTitle.style.position = "absolute";
startTitle.style.left = "50%";
startTitle.style.top = "35%";
startTitle.style.transform = "translate(-50%, -50%)";
startTitle.style.fontSize = "48px";
startTitle.style.fontWeight = "bold";
startTitle.style.color = "#FFD700";
startTitle.style.textShadow = "4px 4px 0px black";
startTitle.style.fontFamily = "Arial, sans-serif";
startTitle.style.zIndex = "9999";
startTitle.style.textAlign = "center";
document.body.appendChild(startTitle);
document.body.appendChild(startButton);

// Style buttons
restartButton.innerText = "Try Again?";
restartButton.style.position = "absolute";
restartButton.style.left = "50%";
restartButton.style.top = "60%";  // Raised from 70% to 60%
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
watchButton.style.top = "70%";  // Raised from 80% to 70%
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

// Music mute button
musicMuteButton.innerText = "🎵";
musicMuteButton.style.position = "absolute";
musicMuteButton.style.left = "10px";
musicMuteButton.style.top = "10px";
musicMuteButton.style.width = "45px";
musicMuteButton.style.height = "45px";
musicMuteButton.style.backgroundColor = "rgba(255, 215, 0, 0.8)";
musicMuteButton.style.color = "black";
musicMuteButton.style.border = "2px solid black";
musicMuteButton.style.borderRadius = "50%";
musicMuteButton.style.zIndex = "9999";
musicMuteButton.style.cursor = "pointer";
musicMuteButton.style.fontSize = "20px";
musicMuteButton.style.display = "none";
musicMuteButton.title = "Toggle Music";

// SFX mute button
sfxMuteButton.innerText = "🔊";
sfxMuteButton.style.position = "absolute";
sfxMuteButton.style.left = "10px";
sfxMuteButton.style.top = "65px";
sfxMuteButton.style.width = "45px";
sfxMuteButton.style.height = "45px";
sfxMuteButton.style.backgroundColor = "rgba(255, 215, 0, 0.8)";
sfxMuteButton.style.color = "black";
sfxMuteButton.style.border = "2px solid black";
sfxMuteButton.style.borderRadius = "50%";
sfxMuteButton.style.zIndex = "9999";
sfxMuteButton.style.cursor = "pointer";
sfxMuteButton.style.fontSize = "20px";
sfxMuteButton.style.display = "none";
sfxMuteButton.title = "Toggle Sound Effects";

// Control toggle button (only on mobile)
if (isMobile) {
  controlToggleButton.innerText = "📱 Tilt";
  controlToggleButton.style.position = "absolute";
  controlToggleButton.style.right = "10px";
  controlToggleButton.style.bottom = "10px";
  controlToggleButton.style.width = "90px";
  controlToggleButton.style.height = "40px";
  controlToggleButton.style.backgroundColor = "rgba(144, 238, 144, 0.8)";
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

// Image loading counter
var imagesLoaded = 0;
var totalImages = 10;
var allImagesLoaded = false;

// Function to check if all images are loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    allImagesLoaded = true;
    console.log('All images loaded successfully');
  }
}

// Add load event listeners to all images
gameOverPileImage.onload = imageLoaded;
playerImage.onload = imageLoaded;
playerImageOriginal.onload = imageLoaded;
goodItemImage.onload = imageLoaded;
badItemImage.onload = imageLoaded;
surpriseItemImage.onload = imageLoaded;
medicalItemImage.onload = imageLoaded;
heartImage.onload = imageLoaded;
gameOverImage.onload = imageLoaded;
menuOverlayImage.onload = imageLoaded;

// Preload audio files
preloadAudio();

// Set fixed canvas size
function setCanvasSize() {
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  
  // Enable image smoothing for crisp rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
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
    startTitle.style.display = "none";  // Hide title when game starts
    
    // Show mute buttons
    musicMuteButton.style.display = "block";
    sfxMuteButton.style.display = "block";
    document.body.appendChild(musicMuteButton);
    document.body.appendChild(sfxMuteButton);
    
    if (isMobile) {
      controlToggleButton.style.display = "block";
      document.body.appendChild(controlToggleButton);
      // Enable tilt controls by default on mobile
      if (tiltEnabled) {
        requestOrientationPermission();
      }
    }
    
    // Start background music after a short delay
    setTimeout(function() {
      if (!musicMuted) {
        safePlayAudio(backgroundMusic);
      }
    }, 500);
    
    // Start the game loop
    resetItems();
    update();
  }
}

// Start button listener
startButton.addEventListener("click", startGame);

// Music mute button listener
musicMuteButton.addEventListener("click", function() {
  musicMuted = !musicMuted;
  if (musicMuted) {
    musicMuteButton.innerText = "🎵";
    musicMuteButton.style.textDecoration = "line-through";
    musicMuteButton.style.backgroundColor = "rgba(169, 169, 169, 0.8)";
    backgroundMusic.pause();
    immuneMusic.pause();
  } else {
    musicMuteButton.innerText = "🎵";
    musicMuteButton.style.textDecoration = "none";
    musicMuteButton.style.backgroundColor = "rgba(255, 215, 0, 0.8)";
    if (gameStarted && !isGameOver) {
      safePlayAudio(backgroundMusic);
    }
  }
});

// SFX mute button listener
sfxMuteButton.addEventListener("click", function() {
  sfxMuted = !sfxMuted;
  if (sfxMuted) {
    sfxMuteButton.innerText = "🔇";
    sfxMuteButton.style.backgroundColor = "rgba(169, 169, 169, 0.8)";
  } else {
    sfxMuteButton.innerText = "🔊";
    sfxMuteButton.style.backgroundColor = "rgba(255, 215, 0, 0.8)";
  }
});

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
  controlToggleButton.innerText = "👆 Drag";
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
  // Hitbox margins - make hitboxes 4 pixels smaller on each side (8 total per dimension)
  var hitboxMargin = 4;
  
  for (var i = 0; i < goodItems.length; i++) {
    var goodItem = goodItems[i];
    if (
      playerX + hitboxMargin < goodItem.x + goodItemWidth - hitboxMargin &&
      playerX + playerWidth - hitboxMargin > goodItem.x + hitboxMargin &&
      playerY + hitboxMargin < goodItem.y + goodItemHeight - hitboxMargin &&
      playerY + playerHeight - hitboxMargin > goodItem.y + hitboxMargin
    ) {
      // Increased points at MAX speed
      var pointMultiplier = itemSpeed >= maxFallSpeed ? 25 : 10;
      var points = pointMultiplier * itemSpeed;
      
      // Triple points if passed through shield
      if (goodItem.shieldTripled) {
        points *= 3;
      }
      
      score += points;
      safePlayAudio(goodItemSound);
      goodItems.splice(i, 1);
    }
  }

  for (var i = 0; i < badItems.length; i++) {
    var badItem = badItems[i];
    if (
      playerX + hitboxMargin < badItem.x + badItemWidth - hitboxMargin &&
      playerX + playerWidth - hitboxMargin > badItem.x + hitboxMargin &&
      playerY + hitboxMargin < badItem.y + badItemHeight - hitboxMargin &&
      playerY + playerHeight - hitboxMargin > badItem.y + hitboxMargin
    ) {
      if (!isPlayerImmune) {
        hearts--;
        score -= 50;
        safePlayAudio(badItemSound);
        maxItems += 1;
        damageFlash = 1.0;  // Trigger full damage flash
      }
      badItems.splice(i, 1);
    }
  }

  for (var i = 0; i < medicalItems.length; i++) {
    var medicalItem = medicalItems[i];
    if (
      playerX + hitboxMargin < medicalItem.x + medicalItemWidth - hitboxMargin &&
      playerX + playerWidth - hitboxMargin > medicalItem.x + hitboxMargin &&
      playerY + hitboxMargin < medicalItem.y + medicalItemHeight - hitboxMargin &&
      playerY + playerHeight - hitboxMargin > medicalItem.y + hitboxMargin
    ) {
      if (hearts < 3) {
        hearts = 3;
        score += 100;
        maxItems += 1;
        medicalItems.splice(i, 1);
      }
    }
  }

  for (var i = 0; i < surpriseItems.length; i++) {
    var surpriseItem = surpriseItems[i];
    if (
      playerX + hitboxMargin < surpriseItem.x + surpriseItemWidth - hitboxMargin &&
      playerX + playerWidth - hitboxMargin > surpriseItem.x + hitboxMargin &&
      playerY + hitboxMargin < surpriseItem.y + surpriseItemHeight - hitboxMargin &&
      playerY + playerHeight - hitboxMargin > surpriseItem.y + hitboxMargin
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
  
  // Shield item collision
  for (var i = 0; i < shieldItems.length; i++) {
    var shieldItem = shieldItems[i];
    if (
      playerX + hitboxMargin < shieldItem.x + shieldItemWidth - hitboxMargin &&
      playerX + playerWidth - hitboxMargin > shieldItem.x + hitboxMargin &&
      playerY + hitboxMargin < shieldItem.y + shieldItemHeight - hitboxMargin &&
      playerY + playerHeight - hitboxMargin > shieldItem.y + hitboxMargin
    ) {
      shieldActive = true;
      shieldTimer = shieldDuration;
      score += 100;
      safePlayAudio(goodItemSound);
      shieldItems.splice(i, 1);
    }
  }
  
  // Clock item collision
  for (var i = 0; i < clockItems.length; i++) {
    var clockItem = clockItems[i];
    if (
      playerX + hitboxMargin < clockItem.x + clockItemWidth - hitboxMargin &&
      playerX + playerWidth - hitboxMargin > clockItem.x + hitboxMargin &&
      playerY + hitboxMargin < clockItem.y + clockItemHeight - hitboxMargin &&
      playerY + playerHeight - hitboxMargin > clockItem.y + hitboxMargin
    ) {
      itemSpeed = 14;  // Slow down to speed 14
      score += 100;
      safePlayAudio(goodItemSound);
      clockItems.splice(i, 1);
    }
  }
  
  // Nuke item collision
  for (var i = 0; i < nukeItems.length; i++) {
    var nukeItem = nukeItems[i];
    if (
      playerX + hitboxMargin < nukeItem.x + nukeItemWidth - hitboxMargin &&
      playerX + playerWidth - hitboxMargin > nukeItem.x + hitboxMargin &&
      playerY + hitboxMargin < nukeItem.y + nukeItemHeight - hitboxMargin &&
      playerY + playerHeight - hitboxMargin > nukeItem.y + hitboxMargin
    ) {
      // Clear all items and award double points for burgers
      for (var j = 0; j < goodItems.length; j++) {
        var pointMultiplier = itemSpeed >= maxFallSpeed ? 25 : 10;
        score += (pointMultiplier * itemSpeed) * 2;  // Double points
      }
      // Clear all arrays
      goodItems = [];
      badItems = [];
      surpriseItems = [];
      medicalItems = [];
      shieldItems = [];
      clockItems = [];
      // Reset speed to 10
      itemSpeed = 10;
      score += 200;  // Bonus for using nuke
      safePlayAudio(goodItemSound);
      nukeItems.splice(i, 1);
    }
  }
}

// Reset item position and speed
function resetItems() {
  if (goodItems.length + badItems.length + surpriseItems.length + shieldItems.length + clockItems.length + nukeItems.length < maxItems) {
    var randomNum = Math.random();
    var spawnableWidth = GAME_WIDTH - SCREEN_MARGIN_LEFT - SCREEN_MARGIN_RIGHT;
    
    // Base spawn rates - adjusted based on speed
    var burgerChance = 0.85;       // 85% burgers
    var trashChance = 0.975;       // 12.5% trash
    var currentChance = trashChance;
    
    // Speed-based item availability
    var canSpawnImmunity = itemSpeed < 20;           // Immunity disappears at speed 20+
    var canSpawnShield = itemSpeed >= 10;            // Shield appears at speed 10+
    var canSpawnClock = itemSpeed >= 18;             // Clock appears at speed 18+
    var canSpawnNuke = itemSpeed >= 20;              // Nuke appears at speed 20+
    
    // Immunity (1.0%) - only before speed 20
    if (canSpawnImmunity) {
      currentChance += 0.01;  // 0.975 + 0.01 = 0.985
      var immunityChance = currentChance;
    }
    
    // Shield (1.0%) - only at speed 10+
    if (canSpawnShield) {
      currentChance += 0.01;  // Add 0.01
      var shieldChance = currentChance;
    }
    
    // Medical (0.35%) - always available
    currentChance += 0.0035;
    var medicalChance = currentChance;
    
    // Clock (0.35%) - only at speed 18+
    if (canSpawnClock) {
      currentChance += 0.0035;
      var clockChance = currentChance;
    }
    
    // Nuke (0.15%) - only at speed 20+
    if (canSpawnNuke) {
      currentChance += 0.0015;
      var nukeChance = currentChance;
    }
    
    // Spawn items based on calculated chances
    if (randomNum < burgerChance) {
      var goodItem = {
        x: SCREEN_MARGIN_LEFT + Math.random() * (spawnableWidth - goodItemWidth),
        y: -goodItemHeight,
        speed: itemSpeed
      };
      goodItems.push(goodItem);
    } else if (randomNum < trashChance) {
      var badItem = {
        x: SCREEN_MARGIN_LEFT + Math.random() * (spawnableWidth - badItemWidth),
        y: -badItemHeight,
        speed: itemSpeed
      };
      badItems.push(badItem);
    } else if (canSpawnImmunity && randomNum < immunityChance) {
      var surpriseItem = {
        x: SCREEN_MARGIN_LEFT + Math.random() * (spawnableWidth - surpriseItemWidth),
        y: -surpriseItemHeight,
        speed: itemSpeed
      };
      surpriseItems.push(surpriseItem);
    } else if (canSpawnShield && randomNum < shieldChance) {
      var shieldItem = {
        x: SCREEN_MARGIN_LEFT + Math.random() * (spawnableWidth - shieldItemWidth),
        y: -shieldItemHeight,
        speed: itemSpeed
      };
      shieldItems.push(shieldItem);
    } else if (randomNum < medicalChance) {
      var medicalItem = {
        x: SCREEN_MARGIN_LEFT + Math.random() * (spawnableWidth - medicalItemWidth),
        y: -medicalItemHeight,
        speed: itemSpeed
      };
      medicalItems.push(medicalItem);
    } else if (canSpawnClock && randomNum < clockChance) {
      var clockItem = {
        x: SCREEN_MARGIN_LEFT + Math.random() * (spawnableWidth - clockItemWidth),
        y: -clockItemHeight,
        speed: itemSpeed
      };
      clockItems.push(clockItem);
    } else if (canSpawnNuke && randomNum < nukeChance) {
      var nukeItem = {
        x: SCREEN_MARGIN_LEFT + Math.random() * (spawnableWidth - nukeItemWidth),
        y: -nukeItemHeight,
        speed: itemSpeed
      };
      nukeItems.push(nukeItem);
    }
  }
}

// Update game objects and render
function update() {
  if (!gameStarted || !allImagesLoaded) return;
  
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  updatePlayerPosition();
  
  // Draw title at top - Updated font
  ctx.font = "bold 42px 'Arial Black', Arial, sans-serif";
  ctx.fillStyle = "#FFD700";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  ctx.textAlign = "center";
  ctx.strokeText("BURGER DROP", GAME_WIDTH / 2, 50);
  ctx.fillText("BURGER DROP", GAME_WIDTH / 2, 50);
  
  // Draw platform support text - Updated font
  ctx.font = "bold 16px Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeText("Mobile & PC Supported", GAME_WIDTH / 2, 75);
  ctx.fillText("Mobile & PC Supported", GAME_WIDTH / 2, 75);
  
  // Draw instructions - Updated font
  ctx.font = "bold 18px Arial";
  ctx.fillStyle = "lightblue";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  if (isMobile) {
    ctx.strokeText("Tilt or Drag to Move", GAME_WIDTH / 2, 100);
    ctx.fillText("Tilt or Drag to Move", GAME_WIDTH / 2, 100);
    ctx.strokeText("Catch Burgers! Avoid Trash!", GAME_WIDTH / 2, 120);
    ctx.fillText("Catch Burgers! Avoid Trash!", GAME_WIDTH / 2, 120);
  } else {
    ctx.strokeText("Move Mouse to Control", GAME_WIDTH / 2, 100);
    ctx.fillText("Move Mouse to Control", GAME_WIDTH / 2, 100);
    ctx.strokeText("Catch Burgers! Avoid Trash!", GAME_WIDTH / 2, 120);
    ctx.fillText("Catch Burgers! Avoid Trash!", GAME_WIDTH / 2, 120);
  }
  
  // Reset text alignment for other text
  ctx.textAlign = "left";

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

  // Draw shield items (blue placeholder squares)
  for (var i = 0; i < shieldItems.length; i++) {
    var shieldItem = shieldItems[i];
    ctx.fillStyle = "blue";
    ctx.fillRect(shieldItem.x, shieldItem.y, shieldItemWidth, shieldItemHeight);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(shieldItem.x, shieldItem.y, shieldItemWidth, shieldItemHeight);
    shieldItem.y += shieldItem.speed;
    if (shieldItem.y > GAME_HEIGHT) {
      shieldItems.splice(i, 1);
    }
  }

  // Draw clock items (cyan placeholder squares)
  for (var i = 0; i < clockItems.length; i++) {
    var clockItem = clockItems[i];
    ctx.fillStyle = "cyan";
    ctx.fillRect(clockItem.x, clockItem.y, clockItemWidth, clockItemHeight);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(clockItem.x, clockItem.y, clockItemWidth, clockItemHeight);
    clockItem.y += clockItem.speed;
    if (clockItem.y > GAME_HEIGHT) {
      clockItems.splice(i, 1);
    }
  }

  // Draw nuke items (orange/red placeholder squares)
  for (var i = 0; i < nukeItems.length; i++) {
    var nukeItem = nukeItems[i];
    ctx.fillStyle = "#FF4500";  // Orange-red
    ctx.fillRect(nukeItem.x, nukeItem.y, nukeItemWidth, nukeItemHeight);
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.strokeRect(nukeItem.x, nukeItem.y, nukeItemWidth, nukeItemHeight);
    nukeItem.y += nukeItem.speed;
    if (nukeItem.y > GAME_HEIGHT) {
      nukeItems.splice(i, 1);
    }
  }

  // Draw shield line effect (40 pixels above player)
  if (shieldActive) {
    var shieldY = playerY - 40;
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 4;
    ctx.shadowColor = "cyan";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, shieldY);
    ctx.lineTo(GAME_WIDTH, shieldY);
    ctx.stroke();
    ctx.shadowBlur = 0;  // Reset shadow
    
    // Check for items passing through shield
    for (var i = badItems.length - 1; i >= 0; i--) {
      var badItem = badItems[i];
      if (badItem.y + badItemHeight >= shieldY && badItem.y <= shieldY + 4) {
        badItems.splice(i, 1);  // Destroy bad item silently
      }
    }
    
    // Triple burger points when passing through shield
    for (var i = 0; i < goodItems.length; i++) {
      var goodItem = goodItems[i];
      if (goodItem.y + goodItemHeight >= shieldY && goodItem.y <= shieldY + 4 && !goodItem.shieldTripled) {
        goodItem.shieldTripled = true;  // Mark as tripled
      }
    }
  }

  checkCollision();

  // Draw score with trophy emoji - Updated font style
  ctx.font = "bold 28px 'Arial Black', Arial, sans-serif";
  ctx.fillStyle = "orange";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.strokeText("🏆 " + Math.floor(score), 10, 150);
  ctx.fillText("🏆 " + Math.floor(score), 10, 150);
  if(score <= 0) {
    score = 0; 
  }

  // Draw Speed with lightning emoji - Updated font style and MAX indicator
  ctx.font = "bold 28px 'Arial Black', Arial, sans-serif";
  ctx.fillStyle = "yellow";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  var speedText = itemSpeed >= maxFallSpeed ? "⚡ MAX" : "⚡ " + Math.floor(itemSpeed);
  ctx.strokeText(speedText, 220, 150);
  ctx.fillText(speedText, 220, 150);

  // Draw hearts (stacked vertically on right side)
  for (var i = 0; i < hearts; i++) {
    var heartX = GAME_WIDTH - heartWidth - 10;  // Right side with 10px margin
    var heartY = 10 + (i * (heartHeight + 10));  // Stack vertically with 10px spacing
    ctx.drawImage(heartImage, heartX, heartY, heartWidth, heartHeight);
  }

  if (isPlayerImmune) {
    ctx.font = "bold 26px 'Arial Black', Arial, sans-serif";
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeText("IMMUNITY: " + Math.floor(immunityTimer) + "s", 10, 180);
    ctx.fillText("IMMUNITY: " + Math.floor(immunityTimer) + "s", 10, 180);
  }
  
  // Draw shield timer
  if (shieldActive) {
    ctx.font = "bold 26px 'Arial Black', Arial, sans-serif";
    ctx.fillStyle = "cyan";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeText("SHIELD: " + Math.floor(shieldTimer) + "s", 10, 210);
    ctx.fillText("SHIELD: " + Math.floor(shieldTimer) + "s", 10, 210);
  }

  // Show control mode indicator only on mobile
  if (isMobile) {
    ctx.font = "16px Arial";
    ctx.fillStyle = tiltEnabled ? "lightgreen" : "orange";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    var controlText = tiltEnabled ? "📱 TILT MODE" : "👆 DRAG MODE";
    ctx.strokeText(controlText, 10, GAME_HEIGHT - 40);
    ctx.fillText(controlText, 10, GAME_HEIGHT - 40);
  } else {
    ctx.font = "16px Arial";
    ctx.fillStyle = "lightblue";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText("🖱️ MOUSE MODE", 10, GAME_HEIGHT - 40);
    ctx.fillText("🖱️ MOUSE MODE", 10, GAME_HEIGHT - 40);
  }
  
  // Draw credits at bottom center
  ctx.font = "14px Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.textAlign = "center";
  ctx.strokeText("Created by BHaleyArt", GAME_WIDTH / 2, GAME_HEIGHT - 10);
  ctx.fillText("Created by BHaleyArt", GAME_WIDTH / 2, GAME_HEIGHT - 10);
  ctx.textAlign = "left";
  
  // Draw damage flash effect (red screen overlay)
  if (damageFlash > 0) {
    ctx.fillStyle = "rgba(255, 0, 0, " + (damageFlash * 0.4) + ")";  // Red with transparency
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    damageFlash -= damageFlashDecay;  // Fade out
    if (damageFlash < 0) damageFlash = 0;
  }

  if (hearts <= 0) {
    isGameOver = true;
    if (!musicMuted) {
      backgroundMusic.pause();
    }
    ctx.drawImage(
      gameOverImage,
      GAME_WIDTH / 2 - 150,
      GAME_HEIGHT / 2 - 200,  // Raised from -150 to -200
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
      GAME_HEIGHT - 530,  // Raised from -480 to -530
      600,
      600
    );
    return;
  }

  // Update immunity timer
  if (isPlayerImmune) {
    immunityTimer -= 1 / 60;
    if (immunityTimer <= 0) {
      isPlayerImmune = false;
      if (!musicMuted) {
        immuneMusic.pause();
        immuneMusic.currentTime = 0;
      }
      playerImage.src = "assets/player_original.png";
    }
  }
  
  // Update shield timer
  if (shieldActive) {
    shieldTimer -= 1 / 60;
    if (shieldTimer <= 0) {
      shieldActive = false;
    }
  }

  // Increase speed with reduced acceleration after speed 10
  var currentAcceleration = itemSpeed >= 10 ? fallAcceleration * 0.5 : fallAcceleration;
  itemSpeed += currentAcceleration;
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
