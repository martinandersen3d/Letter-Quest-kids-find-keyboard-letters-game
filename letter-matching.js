class LetterMatchingGame {
    constructor() {
        this.uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ".split("");
        this.lowercaseLetters = "abcdefghijklmnopqrstuvwxyzæøå".split("");

        this.stepsToWin = 10;
        this.currentStep = 0;
        this.correctCount = 0;
        this.attemptCount = 0;
        this.currentPromptUpper = "";
        this.currentCorrectLower = "";
        this.currentChoices = [];
        this.isRoundLocked = false;
        this.isComplete = false;

        this.minHoverAudioIntervalMs = 350;
        this.hoverAudioByKey = new Map();

        this.promptCard = document.getElementById("promptCard");
        this.choicesEl = document.getElementById("choices");
        this.feedbackEl = document.getElementById("feedback");
        this.correctCountEl = document.getElementById("correctCount");
        this.attemptCountEl = document.getElementById("attemptCount");
        this.shipEl = document.getElementById("ship");
        this.stepCountEl = document.getElementById("stepCount");
        this.stepGoalEl = document.getElementById("stepGoal");
        this.stickersEl = document.getElementById("stickers");
        this.restartBtn = document.getElementById("restartBtn");
        this.audioPlayer = document.getElementById("audioPlayer");
        this.trackEl = document.getElementById("track");

        this.init();
    }

    init() {
        this.stepGoalEl.textContent = String(this.stepsToWin);

        this.promptCard.addEventListener("mouseenter", () => {
            if (!this.currentPromptUpper) {
                return;
            }
            this.playLetterAudio(this.currentPromptUpper.toLowerCase(), "prompt");
        });

        this.restartBtn.addEventListener("click", () => this.restart());
        this.restart();
    }

    restart() {
        this.currentStep = 0;
        this.correctCount = 0;
        this.attemptCount = 0;
        this.isRoundLocked = false;
        this.isComplete = false;
        this.hoverAudioByKey.clear();

        this.stickersEl.innerHTML = "";
        this.setFeedback("", "");
        this.updateScore();
        this.updateShipPosition();
        this.nextRound();
    }

    nextRound() {
        if (this.isComplete) {
            return;
        }

        this.isRoundLocked = false;
        this.currentPromptUpper = this.pickRandom(this.uppercaseLetters);
        this.currentCorrectLower = this.currentPromptUpper.toLowerCase();

        const distractors = this.pickDistractors(this.currentCorrectLower, 2);
        this.currentChoices = this.shuffle([this.currentCorrectLower, ...distractors]);

        this.renderRound();
    }

    renderRound() {
        this.promptCard.textContent = this.currentPromptUpper;
        this.choicesEl.innerHTML = "";

        this.currentChoices.forEach((choice) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "choice-card";
            btn.textContent = choice;
            btn.setAttribute("aria-label", `Choose lowercase ${choice}`);

            btn.addEventListener("mouseenter", () => {
                this.playLetterAudio(choice, `choice-${choice}`);
            });

            btn.addEventListener("click", () => {
                this.handleChoiceClick(choice, btn);
            });

            this.choicesEl.appendChild(btn);
        });
    }

    handleChoiceClick(choice, buttonEl) {
        if (this.isRoundLocked || this.isComplete) {
            return;
        }

        this.attemptCount += 1;

        if (choice === this.currentCorrectLower) {
            this.isRoundLocked = true;
            this.correctCount += 1;
            this.currentStep += 1;

            buttonEl.classList.add("correct");
            this.setFeedback("Great match!", "ok");
            this.updateScore();
            this.updateShipPosition();
            this.playLetterAudio(choice, "success");

            if (this.currentStep >= this.stepsToWin) {
                this.completeGame();
                return;
            }

            setTimeout(() => {
                this.nextRound();
            }, 500);
        } else {
            buttonEl.classList.add("wrong");
            this.setFeedback("Try again", "error");
            this.updateScore();
            this.playErrorSound();
            setTimeout(() => {
                buttonEl.classList.remove("wrong");
            }, 350);
        }
    }

    updateScore() {
        this.correctCountEl.textContent = String(this.correctCount);
        this.attemptCountEl.textContent = String(this.attemptCount);
        this.stepCountEl.textContent = String(this.currentStep);
    }

    updateShipPosition() {
        const startPx = 48;
        const endPx = Math.max(startPx + 1, this.trackEl.clientWidth - 94);
        const progress = this.stepsToWin === 0 ? 0 : this.currentStep / this.stepsToWin;
        const shipX = startPx + (endPx - startPx) * Math.min(1, Math.max(0, progress));
        this.shipEl.style.left = `${shipX}px`;
    }

    completeGame() {
        this.isComplete = true;
        this.isRoundLocked = true;

        this.setFeedback("Home reached! You did it!", "ok");
        this.addSticker();
        this.celebrate();
    }

    addSticker() {
        const options = ["⭐", "🎉", "🏆", "🌈", "🚀", "🦄"];
        const el = document.createElement("span");
        el.className = "sticker";
        el.textContent = this.pickRandom(options);
        this.stickersEl.appendChild(el);
    }

    celebrate() {
        for (let i = 0; i < 3; i += 1) {
            setTimeout(() => {
                const sparkle = document.createElement("span");
                sparkle.className = "sticker";
                sparkle.textContent = i % 2 === 0 ? "✨" : "🎊";
                this.stickersEl.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 1300);
            }, i * 40);
        }
    }

    setFeedback(text, type) {
        this.feedbackEl.textContent = text;
        this.feedbackEl.className = type ? `feedback ${type}` : "feedback";
    }

    playLetterAudio(letter, key) {
        const now = Date.now();
        const lastPlayedAt = this.hoverAudioByKey.get(key) || 0;

        if (now - lastPlayedAt < this.minHoverAudioIntervalMs) {
            return;
        }

        this.hoverAudioByKey.set(key, now);

        this.audioPlayer.src = `./audio-alphabet/${letter}.ogg`;
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play().catch(() => {
            // Continue game even when some audio files are missing.
        });
    }

    playErrorSound() {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 210;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.22);
    }

    pickDistractors(correctLower, count) {
        const candidates = this.lowercaseLetters.filter((letter) => letter !== correctLower);
        const picked = [];

        while (picked.length < count && candidates.length > 0) {
            const idx = Math.floor(Math.random() * candidates.length);
            picked.push(candidates[idx]);
            candidates.splice(idx, 1);
        }

        return picked;
    }

    pickRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    shuffle(array) {
        const items = [...array];
        for (let i = items.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        return items;
    }
}

const game = new LetterMatchingGame();

window.addEventListener("resize", () => {
    game.updateShipPosition();
});
