# 🎮 DOM-BERMAN

A retro arcade-style Bomberman game built with vanilla JavaScript, HTML, and CSS. Navigate the grid, destroy obstacles, defeat enemies, and survive the time limit!

## 🎯 Gameplay

**Core Mechanics:**

- Navigate a grid-based map with destructible and indestructible obstacles
- Place bombs to destroy wooden blocks and enemies
- Collect points for each kill and destroyed block
- Stay alive for 2 minutes to win the level
- Start with 3 lives—lose them all and it's game over

**Scoring:**

- Enemy defeated: **50 points**
- Wooden block destroyed: **10 points**

---

## 🎮 Controls

| Action       | Keyboard         |
| ------------ | ---------------- |
| Move Up      | `W` or `↑ Arrow` |
| Move Down    | `S` or `↓ Arrow` |
| Move Left    | `A` or `← Arrow` |
| Move Right   | `D` or `→ Arrow` |
| Place Bomb   | `Space`          |
| Pause Game   | `P`              |
| Restart Game | `R`              |
| End Game     | `G`              |

---

## 🚀 Installation

### Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools needed—vanilla JavaScript

## 📁 Project Structure

```
make-your-game/
├── index.html              # Main HTML entry point
├── assets/
│   ├── fonts/             # Game fonts and background
│   └── sprites/           # Character and entity sprites
├── src/
│   ├── main.js           # Game initialization
│   ├── entities/         # Game entities
│   │   ├── player.js     # Player controller
│   │   ├── enemies.js    # Enemy AI and behavior
│   │   ├── bombs.js      # Bomb mechanics
│   │   └── fires.js      # Fire/explosion system
│   ├── game/
│   │   ├── engine.js     # Main game loop
│   │   ├── state.js      # Game state management
│   │   ├── config.js     # Game configuration & constants
│   │   ├── hud.js        # HUD/UI updates
│   │   └── utils.js      # Utility functions
│   ├── input/
│   │   └── input.js      # Keyboard input handling
│   └── world/
│       └── map.js        # Map and grid management
└── styles/
    ├── main.css          # Main game styles
    ├── menu.css          # Pause menu styles
    └── entities.css      # Entity sprite styles
```

---

## ⚙️ Configuration

All game parameters can be adjusted in [src/game/config.js](src/game/config.js):

| Parameter             | Default  | Description                             |
| --------------------- | -------- | --------------------------------------- |
| `PLAYER_SPEED`        | 150 px/s | Player movement speed                   |
| `CELL_SIZE`           | 50 px    | Grid cell size                          |
| `DEFAULT_TIMER`       | 125 s    | Time limit per level (2:05)             |
| `ENEMIES_SCORE`       | 50       | Points for defeating an enemy           |
| `WOOD_SCORE`          | 10       | Points for destroying a block           |
| `BOMB_TIME`           | 2 s      | Bomb timer before explosion             |
| `IMMUNITY_TIME`       | 1.5 s    | Player invincibility duration after hit |
| `FRAME_PROG_DURATION` | 6        | Animation frame progression speed       |

---

## 🎮 Game Mechanics

### Player

- Moves across the grid avoiding obstacles and enemies
- Can place up to 4 bombs simultaneously
- Gets 1.5 seconds of immunity after taking damage
- Loses a life when hit by enemies or fire
- Can destroy wooden blocks to create escape routes

### Enemies

- 4 enemies spawn randomly (not in player start zone)
- Use pathfinding AI to navigate the map
- Move at constant speed
- Deal 1 damage to the player on contact
- Can be eliminated by bomb explosions

### Bombs

- Maximum 4 bombs can be placed
- Explode after 2 seconds
- Create a cross-shaped fire pattern
- Destroy wooden blocks and enemies
- Can chain-react with other bombs

### Map

- **Walls (indestructible):** Form the map boundary and scattered pattern
- **Wooden blocks (destructible):** Cover most of the playable area
- **Grass (empty):** Safe to traverse
- Fixed at 13×15 grid with 50px cells

## 🎨 Styling

The game uses a retro arcade aesthetic:

- **Font:** Press Start 2P (8-bit style)
- **Color Scheme:** Neon green (#39ff14), bright yellow (#ffff00), dark backgrounds
- **Effects:** Text shadows, glowing borders, sprite-based animations

---

**Enjoy the game! 🎮**