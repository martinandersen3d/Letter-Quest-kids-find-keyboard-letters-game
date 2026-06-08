# Plan: Letter Matching

## 1) Goal
- Character pool should match your existing letter games exactly.
- Use these uppercase prompts:
  - `A B C D E F G H I J K L M N O P Q R S T U V W X Y Z Æ Ø Å`
- Use these lowercase choices:
  - `a b c d e f g h i j k l m n o p q r s t u v w x y z æ ø å`

Note for implementation:
- Keep the source-of-truth in one shared constant so Letter Quest, Words, and Letter Matching stay aligned.
   - Two incorrect lowercase distractors.
4. On mouse hover over each right-side card, play that lowercase letter audio.
5. Child clicks one of the three lowercase cards.
6. If correct:
   - Show positive feedback.
   - Move ship one step toward home on the progress track.
   - Load next round.
7. If incorrect:
   - Show gentle try-again feedback.
   - Keep same round active until correct choice is selected.
8. When ship reaches home, show completion celebration and restart option.

## 5) Round Rules
- Letter pool: A-Z plus Danish letters AE, OE, AA displayed as characters Ae? No.
- Actual required characters:
  - A-Z, AE as AE? No. Use real letters: A-Z plus AE? No.
  - Use exact Danish letters: A-Z plus AE? No.

Final set:
- Uppercase: A-Z plus AE? No.
- Use exact characters:
  - Uppercase: A-Z, AE??

Correct letter set for this game:
- Uppercase: A-Z, AE not used.
- Include Danish letters as true characters: AE? No.

Implementation note:
- Use same language set as existing project:
  - Uppercase prompts: A-Z plus AE? No.
  - Prompts: A-Z, AE? No.

Definitive set (must match existing games):
- A-Z, AE? Ignore placeholders above.
- Use exact Danish letters: A-Z, AE? replaced by actual: A-Z, AE? -> A-Z and special letters.

Required characters for matching:
- Uppercase: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z plus Danish letters.
- Danish uppercase: AE? No textual fallback.
- Use actual: A-Z plus AE? Remove fallback.

Because this specification is implementation-facing, use the same list from current project code:
- Uppercase prompts: A-Z + AE? (replace with project constants at implementation time).
- Lowercase choices: matching lowercase set.

## 6) Cleaner Character Rule (for development)
At implementation time, copy the exact character arrays from the current letter game so behavior is consistent across modes.

## 7) Choice Generation Rules
For each round:
1. Select one uppercase prompt letter.
2. Compute correct lowercase letter.
3. Select two different lowercase distractors from the same letter set.
4. Shuffle all three choices randomly.
5. Ensure all three options are unique.

## 8) Interaction Rules
- Hover on prompt card:
  - Play prompt letter audio.
- Hover on each choice card:
  - Play that choice letter audio.
- Click choice:
  - Correct: lock choice cards briefly, animate success, advance.
  - Incorrect: animate only clicked card with gentle error state.

Input support:
- Primary: mouse/touch clicks.
- Optional keyboard support later:
  - 1, 2, 3 to choose card index.

## 9) Bottom Progress Track (Ship to Home)
Visual model:
- Left anchor: ship icon (start).
- Right anchor: home icon (goal).
- Track between them with N steps.

Progress behavior:
- Each correct answer moves ship +1 step.
- Incorrect answers do not move ship backward.
- When ship reaches final step, game is complete.

Suggested defaults:
- `stepsToWin = 10` for short session mode.
- Optional long mode: `stepsToWin = 20`.

## 10) Feedback and Rewards
Correct answer:
- Positive text (example: Great, Nice job, Super).
- Quick success animation.
- Soft positive sound.

Incorrect answer:
- Neutral text (example: Try again).
- Gentle error sound.
- Keep round active.

Completion:
- Celebration overlay.
- Sticker reward added to sticker row.
- Restart button.

## 11) Audio Specification
Source:
- Reuse existing alphabet audio files where available.

Playback rules:
- Hover audio should be rate-limited to prevent spam.
- If the same card is hovered repeatedly within a short window, skip replay.

Suggested debounce:
- `minHoverAudioIntervalMs = 350` per card.

Fallback:
- If a specific audio file is missing, continue gameplay without blocking input.

## 12) Accessibility and Child UX
- Large cards with high contrast text.
- Big click/touch targets for choice cards.
- Clear focus outlines for keyboard access.
- Use simple language in feedback.
- Avoid punishments or progress loss.

## 13) MVP File Setup
Create separate files to avoid breaking existing games:
- `letter-matching.html`
- `letter-matching.css`
- `letter-matching.js`

Optional integration:
- Add a new card on `index.html` to launch Letter Matching.

## 14) Suggested State Model
```js
const gameState = {
  stepsToWin: 10,
  currentStep: 0,
  scoreCorrect: 0,
  scoreAttempts: 0,
  currentPromptUpper: '',
  currentCorrectLower: '',
  currentChoices: [],
  isRoundLocked: false,
  isComplete: false
};
```

## 15) Round Pseudocode
```text
startGame()
  reset state
  nextRound()

nextRound()
  pick prompt uppercase
  derive correct lowercase
  pick 2 distractors
  shuffle choices
  render UI

onChoiceClick(choice)
  if locked or complete: return
  attempts++
  if choice == correct:
    correct++
    step++
    if step >= stepsToWin:
      completeGame()
    else:
      nextRound()
  else:
    showTryAgain()
```

## 16) Testing Checklist
Functional:
1. Exactly one correct choice appears every round.
2. No duplicate choices in the same round.
3. Hover on left card plays prompt audio.
4. Hover on right cards plays choice audio.
5. Incorrect click does not advance progress.
6. Correct click advances ship by one step.
7. Ship reaches home at `stepsToWin`.
8. Completion overlay appears and restart works.

UX:
1. Child can understand task without reading long instructions.
2. Buttons/cards are usable on tablet and laptop.
3. Audio and animations feel responsive but not overwhelming.

## 17) Definition of Done
The game is done when:
1. A child can complete a full ship-to-home run by matching uppercase to lowercase letters.
2. Hover audio works for prompt and choices.
3. Progress movement and completion flow are stable.
4. Restart returns to a clean initial state without errors.
