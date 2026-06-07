# Plan: Mario-Inspired Danish Letter Quest

## 1) Goal
Build a child-friendly 2D side-view game where the player:
- Runs left and right
- Jumps with `Space`
- Collects Danish letters: `A-Z` plus `Æ`, `Ø`, `Å`
- Sometimes must jump over fence obstacles

The experience should feel playful and simple, inspired by classic Mario movement, but focused on letter learning.

## 2) MVP Scope (First Playable)
1. One level with side-scrolling background
2. Character can move left/right and jump
3. Ground collision and gravity
4. Collectible letters spawn in level
5. Fences act as obstacles that block movement unless jumped over
6. Score/count of collected letters shown on screen
7. Win condition: collect all letters in level
8. Reset/restart button

## 3) Recommended File Setup
Use a separate page first to avoid breaking existing games:
- `letter-mario.html`
- `letter-mario.css`
- `letter-mario.js`

Optional later integration:
- Add navigation link from `index.html` to new game mode

## 4) Game Design Rules

### Controls
- `ArrowLeft` / `A`: run left
- `ArrowRight` / `D`: run right
- `Space`: jump

### Movement Feel (Mario-like basics)
- Horizontal acceleration when moving
- Friction/deceleration when no key pressed
- Gravity always applied in air
- Jump only when grounded (no double jump in MVP)

### World Objects
- **Player**: rectangle/sprite with position, velocity, size
- **Ground platforms**: static collision surfaces
- **Fence**: short vertical obstacle on ground, collidable
- **Letter pickup**: floating collectible with character label

### Letter Set
Use this exact set in lowercase:
`a b c d e f g h i j k l m n o p q r s t u v w x y z æ ø å`

## 5) Level Plan (MVP)
Single linear level (left to right):
1. Safe starting area (no obstacle)
2. First easy letters at low height
3. First fence obstacle (small)
4. Mid-area with mixed letters and one larger fence
5. Final area with remaining letters

Placement principles:
- Early letters reachable without hard jumps
- Fence appears every 1-3 letter groups
- Do not place letter inside fence collision

## 6) Technical Implementation Plan

### Step A: Rendering Foundation
1. Build a fixed-size game container (`position: relative; overflow: hidden`)
2. Add layers: background, world, HUD
3. Render player, fences, and letters as absolutely positioned elements

### Step B: Core Loop
1. Create `requestAnimationFrame` loop
2. Compute `deltaTime`
3. Update physics then resolve collisions
4. Render updated positions to DOM/CSS transforms

### Step C: Player Physics
1. Add state: `x, y, vx, vy, width, height, isGrounded`
2. Apply input to `vx`
3. Apply gravity to `vy`
4. Update position
5. Ground/platform collision resolution
6. Fence side/top collision resolution

### Step D: Jumping
1. On `Space` press and `isGrounded === true`, set `vy = -jumpForce`
2. Play jump sound (optional MVP+)
3. Prevent repeat jump until grounded again

### Step E: Letter Pickup System
1. Store pickups in array with `id, letter, x, y, collected`
2. On player overlap, mark collected
3. Play letter audio for collected letter
4. Update HUD progress: `collected / total`
5. Show tiny visual pop animation on pickup

### Step F: Fence Obstacles
1. Store fences with `x, y, width, height`
2. Horizontal collision stops player movement
3. Player can pass if jump arc clears top edge

### Step G: Camera/Scrolling
1. Keep player near screen center while world scrolls
2. Clamp camera at level start/end

### Step H: Win/Restart
1. If all letters collected, show win overlay
2. Include `Play Again` button
3. Reset state and regenerate pickups

## 7) Data Structures (Suggested)
```js
const DANISH_LETTERS = [
	'a','b','c','d','e','f','g','h','i','j','k','l','m',
	'n','o','p','q','r','s','t','u','v','w','x','y','z','æ','ø','å'
];

const gameState = {
	running: true,
	collectedCount: 0,
	totalLetters: 29,
	levelWidth: 4000,
	cameraX: 0,
	player: { x: 80, y: 0, vx: 0, vy: 0, width: 48, height: 64, isGrounded: false },
	fences: [],
	pickups: []
};
```

## 8) Child-Friendly UX Plan
1. Large readable letters on pickups
2. Clear color coding for uncollected vs collected
3. Positive feedback sound/animation on success
4. Gentle failure handling: if player hits fence, just stop movement (no punishment)
5. Big restart button and simple text labels

## 9) Audio Plan
1. Reuse existing alphabet audio folder where possible
2. Add Danish-specific files for `æ`, `ø`, `å` if missing
3. Trigger letter sound immediately on pickup
4. Optional: short celebration sound on level complete

## 10) Testing Checklist
Functional checks:
1. Player cannot fall through ground
2. Jump only works when grounded
3. Player cannot walk through fence
4. Player can jump over fence
5. Every letter can be collected
6. `Æ`, `Ø`, `Å` render and play audio correctly
7. Win state appears at `29/29`
8. Restart resets all letters and player position

Playability checks:
1. Child can complete level without precision timing frustration
2. Text and controls are understandable without instructions
3. Performance is smooth on typical laptop browser

## 11) Delivery Milestones
1. **Milestone 1:** Movement + jump + ground physics
2. **Milestone 2:** Fences + collision
3. **Milestone 3:** Letter pickups + audio + HUD
4. **Milestone 4:** Win screen + restart + balancing
5. **Milestone 5:** Polish visuals and child usability pass
6. Random Theme worlds (forest, beach, castle), using emoji's

## 13) Definition of Done
The game is done when:
1. A child can run, jump, collect all 29 Danish letters, and finish a level
2. Fences create simple jump challenges
3. Audio feedback works for all letters including `Æ`, `Ø`, `Å`
4. The loop from start to win to restart is stable without errors
