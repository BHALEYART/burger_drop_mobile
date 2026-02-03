# 🍔 Burger Drop V6.6 Beta

A fast-paced arcade game where you catch falling burgers while avoiding trash! Play on mobile with tilt/drag controls or on PC with your mouse.

![Game Version](https://img.shields.io/badge/version-1.0-orange)
![Platform](https://img.shields.io/badge/platform-Mobile%20%7C%20PC-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎮 Play Now

**Live Demo:** (https://bhaleyart.github.io/burger_drop_mobile/)

---

## 📖 About

Burger Drop is an arcade-style catching game built with HTML5 Canvas and JavaScript. Test your reflexes as items fall faster and faster - catch the burgers to score points, avoid the trash to survive!

### Features

- 🍔 **Catch burgers** to earn points
- 🗑️ **Avoid trash** to keep your health
- ⚡ **Power-ups** for temporary immunity
- 💊 **Health packs** to restore hearts
- 📱 **Mobile support** with tilt and drag controls
- 🖱️ **PC support** with smooth mouse tracking
- 🔊 **Dynamic audio** with background music and sound effects
- 📈 **Progressive difficulty** - speed increases over time

---

## 🕹️ How to Play

### Controls

#### Mobile (Default: Tilt)
- **Tilt** your phone left/right to move the character
- Tap the **toggle button** (bottom-right) to switch to drag mode
- In **drag mode**, slide your finger on the screen

#### PC
- Move your **mouse** left/right to control the character
- Character follows your cursor automatically

### Gameplay

**Objective:** Catch as many burgers as possible while avoiding trash!

**Items:**
- 🍔 **Burgers (Green)** - Catch these! +10 points × speed multiplier
- 🗑️ **Trash (Red)** - Avoid these! -50 points and lose 1 heart
- ⚡ **Lightning (Purple)** - 10 seconds of immunity! +100 points
- 💊 **Medical Kit (White)** - Restores all hearts! +100 points

**Lives:** You have 3 hearts. Lose all hearts = Game Over

**Speed:** Items fall faster as you play - stay alert!

🤖 BOSS FIGHT SYSTEM - Complete Guide
Boss Fight Overview
Boss countdown starts when player reaches MAX speed (24) or Developer Mode is activated!
10-second countdown before boss arrives!
Boss: 🤖 Robot emoji (80×80px)
Health: 5 bolts ⚡⚡⚡⚡⚡
Position: 100px from top (~380px above player)
Movement: Flies left-right across screen
Boss Attacks

Red laser beams shoot downward
Beams every 1.5 seconds
Must dodge while fighting!

Gun Power-Up 🔫

Spawns during boss fight (5%)
Click/tap boss to shoot
Each gun = 1 shot
Boss loses 1 health per hit
Earn 500 points per hit!

Items During Boss
✅ Burgers (80%)
✅ Clock (15%)
✅ Gun (5%)
❌ All other power-ups disabled
❌ No bombs
Boss Defeat

5 hits to defeat
5,000 bonus points!
Normal gameplay resumes

Developer Mode
Red button top-right: Toggle boss countdown anytime for testing!
---

## 🎯 Scoring System

| Action | Points |
|--------|--------|
| Catch Burger | +10 × current speed |
| Hit by Trash | -50 |
| Collect Lightning | +100 |
| Collect Medical Kit | +100 |
| Game Over < 1000 pts | Low score sound |
| Game Over ≥ 1000 pts | High score sound |

**Tip:** The faster the items fall, the more points you earn per burger!

---

## 🚀 Installation

### Play Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BHALEYART/burger_drop_mobile.git
   cd burger_drop_mobile
   ```

2. **Open in browser:**
   - Simply open `index.html` in your web browser
   - No build process required!

### Deploy to GitHub Pages

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to Pages section
   - Select `main` branch as source
   - Save and wait for deployment

3. **Access your game:**
   - `https://[your-username].github.io/burger_drop_mobile/`

---

## 🗂️ Project Structure

```
burger_drop_mobile/
├── index.html                 # Main HTML file
├── preloader.js              # Asset preloading system
├── assets/
│   ├── falling_game_mobile.js   # Main game logic
│   ├── play_background.jpg      # Game background
│   ├── player.png              # Player sprite (immune)
│   ├── player_original.png     # Player sprite (normal)
│   ├── good_item.png           # Burger sprite
│   ├── bad_item.png            # Trash sprite
│   ├── surprise_item.png       # Lightning power-up
│   ├── medical_item.png        # Health pack sprite
│   ├── heart.png               # Heart/life icon
│   ├── game_over.png           # Game over graphic
│   ├── game_over_pile.png      # Game over decoration
│   ├── menu_shader.png         # UI overlay
│   ├── game_music.mp3          # Background music
│   ├── point_sound.mp3         # Catch sound effect
│   ├── damage_sound.mp3        # Hit sound effect
│   ├── immune_music.mp3        # Immunity sound
│   ├── low_score_gameover.mp3  # Low score ending
│   └── high_score_gameover.mp3 # High score ending
└── README.md                  # This file
```

---

## 🛠️ Technical Details

### Technologies Used

- **HTML5 Canvas** - Rendering and graphics
- **JavaScript (ES5)** - Game logic and controls
- **Device Orientation API** - Tilt controls
- **Web Audio API** - Sound effects and music
- **CSS3** - Styling and layout

### Browser Compatibility

| Browser | Mobile | Desktop | Tilt Support |
|---------|--------|---------|--------------|
| Chrome | ✅ | ✅ | ✅ |
| Safari | ✅ | ✅ | ✅ (with permission) |
| Firefox | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |

**Note:** iOS 13+ requires user permission for device orientation access.

### Canvas Specifications

- **Resolution:** 450px × 800px (9:16 aspect ratio)
- **Format:** Vertical/Portrait orientation
- **Scaling:** Responsive scaling on mobile devices
- **Frame Rate:** 60 FPS (via requestAnimationFrame)

### Game Mechanics

```javascript
// Core Parameters
Canvas: 450 × 800 pixels
Player Size: 70 × 106 pixels
Max Items: 8 simultaneous
Initial Speed: 2 pixels/frame
Max Speed: 25 pixels/frame
Acceleration: 0.004 per frame
Immunity Duration: 10 seconds
Screen Margins: 10px (sides), 50px (bottom)
```

---

## 🎨 Customization Guide

### Adjust Difficulty

Edit `assets/falling_game_mobile.js`:

```javascript
// Make game easier
var maxItems = 6;           // Fewer items (default: 8)
var itemSpeed = 1.5;        // Slower start (default: 2)
var maxFallSpeed = 20;      // Lower max speed (default: 25)
var fallAcceleration = 0.003; // Slower acceleration (default: 0.004)

// Make game harder
var maxItems = 10;          // More items
var itemSpeed = 3;          // Faster start
var maxFallSpeed = 30;      // Higher max speed
var fallAcceleration = 0.005; // Faster acceleration
```

### Adjust Control Sensitivity

```javascript
// Tilt Controls
var tiltSensitivity = 3.5;  // Higher = more sensitive (2.0 - 5.0)
var tiltSmoothing = 0.15;   // Lower = smoother (0.1 - 0.3)
var maxTiltAngle = 30;      // Degrees (20 - 45)

// Screen Boundaries
var SCREEN_MARGIN_LEFT = 10;   // Left boundary (pixels)
var SCREEN_MARGIN_RIGHT = 10;  // Right boundary (pixels)
var SCREEN_MARGIN_BOTTOM = 50; // Bottom spacing (pixels)
```

### Modify Spawn Rates

```javascript
// Item spawn probabilities (must total ≤ 1.0)
if (randomNum < 0.85) {      // 85% - Burgers
if (randomNum < 0.985) {     // 13.5% - Trash
if (randomNum < 0.995) {     // 1% - Lightning
if (randomNum < 1.0) {       // 0.5% - Medical Kit
```

### Change Colors

```javascript
// Title
ctx.fillStyle = "#FFD700";   // Gold (default)
ctx.fillStyle = "#FF6347";   // Tomato red
ctx.fillStyle = "#00CED1";   // Dark turquoise

// Score
ctx.fillStyle = "orange";    // Default
ctx.fillStyle = "#32CD32";   // Lime green
ctx.fillStyle = "#FF1493";   // Deep pink
```

---

## 🎵 Audio System

### Audio Files

The game uses multiple audio tracks:
- Background music loops during gameplay
- Sound effects for catching items
- Special music during immunity
- Different game over sounds based on score

### Audio Initialization

Modern browsers block autoplay audio. The game handles this by:
1. Showing a "TAP TO START" button
2. Initializing audio after user interaction
3. Using promise-based playback for reliability

### Volume Control

Adjust volumes in `falling_game_mobile.js`:

```javascript
backgroundMusic.volume = 0.1;  // 10% (default)
immuneMusic.volume = 0.3;      // 30% (default)
badItemSound.volume = 0.7;     // 70% (default)
lowScoreSound.volume = 0.7;    // 70% (default)
highScoreSound.volume = 0.7;   // 70% (default)
```

---

## 📱 Mobile Optimization

### Tilt Controls

The game automatically requests device orientation permission on mobile:

**iOS 13+:**
- Permission prompt appears when enabling tilt
- User must grant access for tilt to work
- Falls back to drag controls if denied

**Android:**
- Tilt works immediately
- No permission prompt required

### Touch Response

- Touch events use `preventDefault()` to prevent scrolling
- Scaling calculations ensure accurate touch tracking
- Smooth interpolation for responsive movement

### Performance

- Canvas size fixed at 450×800 for consistent performance
- Asset preloading prevents lag during gameplay
- RequestAnimationFrame for smooth 60 FPS

---

## 🐛 Troubleshooting

### Common Issues

**Audio not playing:**
- Make sure you clicked/tapped the start button
- Check device volume and silent mode
- Try refreshing the page

**Tilt not working (iOS):**
- Grant permission when prompted
- Toggle tilt off and on to recalibrate
- Try in Safari (best iOS support)

**Character going off screen:**
- This shouldn't happen - if it does, refresh the page
- Screen margins prevent off-screen movement

**Items spawning at edges:**
- Items should spawn within boundaries
- Check that SCREEN_MARGIN values are set correctly

**Game running slow:**
- Close other browser tabs
- Disable browser extensions
- Try a different browser

### Debug Mode

Add this to view debug information:

```javascript
// In update() function, add:
ctx.fillStyle = "white";
ctx.font = "12px Arial";
ctx.fillText("FPS: " + Math.round(1000/16), 10, 200);
ctx.fillText("Items: " + (goodItems.length + badItems.length), 10, 220);
ctx.fillText("PlayerX: " + Math.round(playerX), 10, 240);
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check if the bug has already been reported
2. Include your browser/device information
3. Describe steps to reproduce the issue
4. Include screenshots if applicable

### Suggesting Features

1. Open an issue with the "enhancement" label
2. Describe the feature and its benefits
3. Explain how it would work

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 BHaleyArt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Author

**BHaleyArt**

- GitHub: [@BHALEYART](https://github.com/BHALEYART)
- Website: https://youtube.com/@bhaleyart

---

## 🙏 Acknowledgments

- Built with HTML5 Canvas API
- Uses Device Orientation API for tilt controls
- Audio handling with Web Audio API
- Inspired by classic arcade catching games

---

## 📊 Changelog

### Version 1.0 (Current)
- ✨ Initial release
- 🎮 Mobile support with tilt and drag controls
- 🖱️ PC support with mouse controls
- 🔊 Full audio system with music and sound effects
- 🎯 Progressive difficulty scaling
- ⚡ Power-ups and health packs
- 📱 iOS permission handling
- 🎨 Professional UI with title and instructions
- 🏆 High score celebration sound

---

## 🗺️ Roadmap

Potential future features:

- [ ] High score leaderboard (localStorage)
- [ ] Multiple difficulty levels
- [ ] Character skins/customization
- [ ] More power-up types
- [ ] Combo multipliers
- [ ] Sound volume controls in-game
- [ ] Fullscreen mode
- [ ] Online leaderboard
- [ ] Social media sharing
- [ ] More item types and animations
- [ ] Achievement system
- [ ] Tutorial mode

---

## 💬 Support

Having trouble? Here's where to get help:

- 📖 Check the [Troubleshooting](#-troubleshooting) section
- 🐛 [Open an issue](https://github.com/BHALEYART/burger_drop_mobile/issues)
- 💬 Contact via [BHB Links](https://bombpop.link/bigheadbillions)

---

## ⭐ Show Your Support

If you enjoyed this game, please consider:
- ⭐ Starring the repository
- 🐛 Reporting any bugs you find
- 💡 Suggesting new features
- 🔗 Sharing with friends

---

## 📸 Screenshots

*Add screenshots of your game here when deployed*

---

**Made with ❤️ by BHaleyArt**

*Catch those burgers!* 🍔
