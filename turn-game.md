# Turn Game - Learnings and Business Rules

## Purpose
A child-friendly memory card game (vendespil) focused on early letter recognition with audio support and reward-driven feedback.

## Core Gameplay Rules
- Grid layout is 4 columns x 3 rows (12 cards total).
- Each round contains 6 matching pairs.
- Pair composition per round:
  - 4 letter pairs.
  - 2 emoji pairs.
- Player flips two cards.
- If cards match:
  - Both cards stay open and are marked matched.
  - Matched pair flashes for visual feedback.
- If cards do not match:
  - Wait 1100 ms before flipping both back.

## Letter Selection Rules
- Alphabet pool includes lowercase Danish letters:
  - `abcdefghijklmnopqrstuvwxyzæøå`
- Vowel guarantee rule:
  - At least one of the 4 letter pairs must be a vowel from:
  - `a, e, i, o, u, y, æ, ø, å`
- Weighted letter priority rule:
  - `a`, `e`, `i`, `o`, `ø` have +40% weight.
  - `m`, `s` have +20% weight.
  - `p`, `l`, `f`, `t` have +10% weight.
  - Other letters use base weight.
  - Effective weights are base `1.0` + boost (for example `a` = `1.4`, `m` = `1.2`).
- Selection is unique for the 4 letters in a round.

## Audio Rules
- Card reveal plays audio only for letter cards.
- Emoji cards never trigger alphabet audio.
- Audio file mapping:
  - `./audio-alphabet/<letter>.ogg`
- Win popup includes a 4-square letter feedback row:
  - Displays the exact 4 letters used in that round.
  - Hover/focus/click on each square replays the corresponding letter audio.

## Win and Celebration Rules
- Win condition:
  - All 6 pairs matched.
- End-of-game timing:
  - Wait 900 ms after final match.
  - Fade in win popup over 400 ms.
- Popup includes:
  - Title: "Mega flot!"
  - Animated trophy (pokal).
  - Random monkey GIF from `./img/monkey1.gif` to `./img/monkey12.gif`.
  - 4-letter feedback row.
  - Large round red `Start` button.
- Start button behavior:
  - Auto-focused when popup appears.
  - Space/Enter can start new game immediately.
- Confetti:
  - Animated confetti launches when popup opens.

## Monkey GIF Rotation Rule
- Recently shown monkey image is blocked for the next 3 rounds.
- If needed, fallback pool uses all images (safety behavior), then history continues.

## UI and Interaction Rules
- Main title `VendeSpil` is non-selectable.
- Card hover effect is enabled for non-matched cards.
- Matched cards are disabled and not clickable.

## Implementation Learnings
- Keep game rules explicit in code constants/pools for easy balancing.
- Use weighted selection for pedagogical prioritization without hard-locking variety.
- Child UX benefits from layered feedback:
  - visual (flash, hover, confetti),
  - audio (letter replay),
  - reward popup (trophy + image).
- Delay and animation timing materially affect clarity and satisfaction for kids.
- Preventing immediate GIF repetition improves perceived variety and delight.
- Auto-focus on popup primary action improves keyboard usability and flow.
