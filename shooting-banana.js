const LETTERS = "abcdefghijklmnopqrstuvwxyzæøå".split("");
const LETTER_COUNT = 5;
const LETTER_RADIUS = 30; // px, collision radius

class ShootingBananaGame {
    constructor() {
        this.letters    = [];
        this.targetChar = "";
        this.projectile = null;
        this.isLocked   = false;
        this.correct    = 0;
        this.total      = 0;
        this.animId     = null;

        this.gameArea   = document.getElementById("gameArea");
        this.targetEl   = document.getElementById("targetLetter");
        this.feedbackEl = document.getElementById("feedback");
        this.scoreEl    = document.getElementById("score");
        this.shootBtn   = document.getElementById("shootBtn");
        this.hearBtn    = document.getElementById("hearBtn");
        this.audio      = document.getElementById("audioPlayer");

        this.shootBtn.addEventListener("click",   () => this.shoot());
        this.hearBtn.addEventListener("click",    () => this.playAudio(this.targetChar));
        document.addEventListener("keydown", (e) => {
            if (e.code === "Space") { e.preventDefault(); this.shoot(); }
        });

        this.nextRound();
        this.loop();
    }

    /* ── Round management ── */

    nextRound() {
        this.clearLetters();
        this.clearProjectile();
        this.isLocked = false;
        this.shootBtn.disabled = false;

        const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
        this.targetChar = shuffled[0];
        const chars = shuffled.slice(0, LETTER_COUNT);

        const area = this.gameArea.getBoundingClientRect();
        const w = area.width;
        const h = area.height;

        chars.forEach((char, i) => {
            const el = document.createElement("div");
            el.className = "letter-bubble";
            el.textContent = char;
            this.gameArea.appendChild(el);

            // Spread letters in upper 65% of game area to stay clear of shooter
            const x = LETTER_RADIUS + 10 + Math.random() * (w - (LETTER_RADIUS + 10) * 2);
            const y = LETTER_RADIUS + 10 + Math.random() * (h * 0.65 - LETTER_RADIUS);

            const speed = 0.6 + Math.random() * 0.8;
            const angle = Math.random() * Math.PI * 2;

            this.letters.push({
                char,
                isTarget: char === this.targetChar,
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                el,
            });

            el.style.left = x + "px";
            el.style.top  = y + "px";
        });

        this.targetEl.textContent = this.targetChar;
        this.setFeedback("");
        setTimeout(() => this.playAudio(this.targetChar), 120);
    }

    clearLetters() {
        this.letters.forEach(l => l.el.remove());
        this.letters = [];
    }

    clearProjectile() {
        if (this.projectile) {
            this.projectile.el.remove();
            this.projectile = null;
        }
    }

    /* ── Shooting ── */

    shoot() {
        if (this.isLocked || this.projectile) return;

        const area = this.gameArea.getBoundingClientRect();
        const x = area.width / 2;
        const y = area.height - 55; // just above shooter emoji

        const el = document.createElement("div");
        el.className = "banana-projectile";
        el.textContent = "🍌";
        this.gameArea.appendChild(el);

        this.projectile = { x, y, el };
        this.updateProjectile();
    }

    updateProjectile() {
        const { el, x, y } = this.projectile;
        el.style.left = x + "px";
        el.style.top  = y + "px";
    }

    /* ── Game loop ── */

    loop() {
        this.tick();
        this.animId = requestAnimationFrame(() => this.loop());
    }

    tick() {
        const area = this.gameArea.getBoundingClientRect();
        const w = area.width;
        const h = area.height;

        // Move letters
        if (!this.isLocked) {
            this.letters.forEach(l => {
                l.x += l.vx;
                l.y += l.vy;

                // Bounce off walls (keep in upper 70% away from shooter)
                if (l.x < LETTER_RADIUS)          { l.x = LETTER_RADIUS;      l.vx = Math.abs(l.vx); }
                if (l.x > w - LETTER_RADIUS)       { l.x = w - LETTER_RADIUS;  l.vx = -Math.abs(l.vx); }
                if (l.y < LETTER_RADIUS)           { l.y = LETTER_RADIUS;      l.vy = Math.abs(l.vy); }
                if (l.y > h * 0.72 - LETTER_RADIUS){ l.y = h * 0.72 - LETTER_RADIUS; l.vy = -Math.abs(l.vy); }

                l.el.style.left = l.x + "px";
                l.el.style.top  = l.y + "px";
            });
        }

        // Move projectile upward
        if (this.projectile) {
            this.projectile.y -= 9;
            this.updateProjectile();

            // Check collision with each letter
            const hit = this.letters.find(l => {
                const dx = Math.abs(l.x - this.projectile.x);
                const dy = Math.abs(l.y - this.projectile.y);
                return dx < LETTER_RADIUS + 14 && dy < LETTER_RADIUS + 14;
            });

            if (hit) {
                this.clearProjectile();
                hit.isTarget ? this.handleCorrect(hit) : this.handleWrong(hit);
            } else if (this.projectile.y < -40) {
                // Missed everything
                this.clearProjectile();
                this.setFeedback("Forbi! Prøv igen 🍌");
            }
        }
    }

    /* ── Hit handlers ── */

    handleCorrect(item) {
        this.isLocked = true;
        this.shootBtn.disabled = true;
        this.correct++;
        this.total++;
        this.updateScore();

        item.el.classList.add("hit-correct");
        this.setFeedback("✅ Godt klaret!");
        this.playAudio(item.char);

        setTimeout(() => this.nextRound(), 1600);
    }

    handleWrong(item) {
        this.total++;
        this.updateScore();

        item.el.classList.add("hit-wrong");
        this.setFeedback("❌ Forkert! Find " + this.targetChar);
        this.playAudio(item.char);

        setTimeout(() => {
            item.el.classList.remove("hit-wrong");
            this.setFeedback("");
        }, 900);
    }

    /* ── Helpers ── */

    setFeedback(msg) {
        this.feedbackEl.textContent = msg;
    }

    updateScore() {
        this.scoreEl.textContent = `${this.correct} / ${this.total}`;
    }

    playAudio(char) {
        this.audio.src = `audio-alphabet/${char}.ogg`;
        this.audio.play().catch(() => {});
    }
}

window.addEventListener("load", () => new ShootingBananaGame());
