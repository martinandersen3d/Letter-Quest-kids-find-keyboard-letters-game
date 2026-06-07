class LetterMarioQuest {
    constructor() {
        this.DANISH_LETTERS = [
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Æ", "Ø", "Å"
        ];

        this.viewportEl = document.getElementById("gameViewport");
        this.worldEl = document.getElementById("world");
        this.playerEl = document.getElementById("player");
        this.collectedEl = document.getElementById("collectedCount");
        this.totalEl = document.getElementById("totalCount");
        this.nextLetterEl = document.getElementById("nextLetter");
        this.statusTextEl = document.getElementById("statusText");
        this.restartBtn = document.getElementById("restartBtn");
        this.toggleCaseBtn = document.getElementById("toggleCaseBtn");
        this.audioPlayer = document.getElementById("audioPlayer");
        this.pickupPreviewEl = document.getElementById("pickupPreview");

        this.caseMode = "lower";

        this.keys = {
            left: false,
            right: false
        };

        this.world = {
            width: 7200,
            height: 0,
            groundY: 0,
            gravity: 2400,
            friction: 0.84,
            maxSpeed: 288,
            accel: 2200,
            jumpForce: 860,
            cameraX: 0
        };

        this.player = {
            x: 90,
            y: 0,
            width: 48,
            height: 58,
            vx: 0,
            vy: 0,
            grounded: false
        };

        this.fences = [];
        this.pickups = [];
        this.pickupEls = new Map();
        this.collectedCount = 0;
        this.isFinished = false;
        this.lastFrame = 0;

        this.bindEvents();
        this.setupLevel();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    bindEvents() {
        window.addEventListener("resize", () => this.setupViewportMetrics());

        document.addEventListener("keydown", (event) => {
            const target = event.target;
            const isInteractiveTarget = target instanceof HTMLElement &&
                (target.tagName === "BUTTON" || target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT");

            if (isInteractiveTarget) {
                return;
            }

            const key = event.key.toLowerCase();

            if (key === "arrowleft" || key === "a") {
                this.keys.left = true;
                event.preventDefault();
            }
            if (key === "arrowright" || key === "d") {
                this.keys.right = true;
                event.preventDefault();
            }
            if (event.code === "Space") {
                if (this.player.grounded && !this.isFinished) {
                    this.player.vy = -this.world.jumpForce;
                    this.player.grounded = false;
                }
                event.preventDefault();
            }

            if (this.isFinished && (event.code === "Space" || event.code === "Enter")) {
                this.restart();
                event.preventDefault();
            }
        });

        document.addEventListener("keyup", (event) => {
            const key = event.key.toLowerCase();
            if (key === "arrowleft" || key === "a") {
                this.keys.left = false;
            }
            if (key === "arrowright" || key === "d") {
                this.keys.right = false;
            }
        });

        this.restartBtn.addEventListener("click", () => this.restart());
        this.toggleCaseBtn.addEventListener("click", () => this.toggleCaseMode());
    }

    setupLevel() {
        this.clearLevelElements();
        this.setupViewportMetrics();

        this.player.x = 90;
        this.player.y = this.world.groundY - this.player.height;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.grounded = true;

        this.isFinished = false;
        this.collectedCount = 0;
        this.totalEl.textContent = String(this.DANISH_LETTERS.length);
        this.collectedEl.textContent = "0";
        this.statusTextEl.textContent = "Collect all Danish letters and jump over fences.";

        this.createFences();
        this.createPickups();
        this.updateNextLetterLabel();
        this.removeWinOverlay();
    }

    setupViewportMetrics() {
        const viewportRect = this.viewportEl.getBoundingClientRect();
        this.world.height = this.viewportEl.clientHeight;
        this.world.groundY = this.world.height - 74;
        this.worldEl.style.width = `${this.world.width}px`;
        this.viewportWidth = viewportRect.width;
    }

    clearLevelElements() {
        this.fences.forEach((fence) => {
            if (fence.el && fence.el.parentElement) {
                fence.el.remove();
            }
        });

        this.pickupEls.forEach((element) => {
            if (element.parentElement) {
                element.remove();
            }
        });

        this.fences = [];
        this.pickups = [];
        this.pickupEls.clear();
    }

    createFences() {
        const fenceLayout = [
            { x: 510, width: 40, height: 80 },
            { x: 1020, width: 40, height: 80 },
            { x: 1760, width: 42, height: 96 },
            { x: 2580, width: 44, height: 92 },
            { x: 3520, width: 50, height: 105 },
            { x: 4360, width: 52, height: 115 },
            { x: 5280, width: 46, height: 95 },
            { x: 6140, width: 55, height: 120 }
        ];

        this.fences = fenceLayout.map((entry) => {
            const el = document.createElement("div");
            el.className = "fence";
            el.style.width = `${entry.width}px`;
            el.style.height = `${entry.height}px`;
            const y = this.world.groundY - entry.height;
            el.style.transform = `translate(${entry.x}px, ${y}px)`;
            this.worldEl.appendChild(el);

            return {
                x: entry.x,
                y,
                width: entry.width,
                height: entry.height,
                el
            };
        });
    }

    createPickups() {
        const shuffled = [...this.DANISH_LETTERS].sort(() => Math.random() - 0.5);

        this.pickups = shuffled.map((letter, index) => {
            const pickupSize = 84;
            const baseX = 240 + index * 230;
            let x = baseX + (index % 2 === 0 ? 14 : -14);

            for (const fence of this.fences) {
                if (Math.abs(x - fence.x) < 60) {
                    x = fence.x + 70;
                }
            }

            const tier = index % 3;
            const baseY = this.world.groundY - pickupSize - 16;
            const y = tier === 0 ? baseY : tier === 1 ? baseY - 70 : baseY - 130;

            const pickup = {
                id: index,
                label: letter,
                audioLabel: letter.toLowerCase(),
                x,
                y,
                width: pickupSize,
                height: pickupSize,
                collected: false
            };

            const el = document.createElement("div");
            el.className = "pickup";
            el.textContent = this.formatLetter(letter);
            el.style.left = `${pickup.x}px`;
            el.style.top = `${pickup.y}px`;
            this.worldEl.appendChild(el);
            this.pickupEls.set(pickup.id, el);

            return pickup;
        });
    }

    gameLoop(time) {
        if (!this.lastFrame) {
            this.lastFrame = time;
        }

        const dt = Math.min((time - this.lastFrame) / 1000, 0.033);
        this.lastFrame = time;

        if (!this.isFinished) {
            this.updatePhysics(dt);
            this.checkPickupCollisions();
            this.updateCamera();
        }

        this.render();
        requestAnimationFrame((nextTime) => this.gameLoop(nextTime));
    }

    updatePhysics(dt) {
        const prevX = this.player.x;
        const prevY = this.player.y;

        if (this.keys.left && !this.keys.right) {
            this.player.vx -= this.world.accel * dt;
        } else if (this.keys.right && !this.keys.left) {
            this.player.vx += this.world.accel * dt;
        } else {
            this.player.vx *= this.world.friction;
            if (Math.abs(this.player.vx) < 2) {
                this.player.vx = 0;
            }
        }

        if (this.player.vx > this.world.maxSpeed) {
            this.player.vx = this.world.maxSpeed;
        }
        if (this.player.vx < -this.world.maxSpeed) {
            this.player.vx = -this.world.maxSpeed;
        }

        this.player.vy += this.world.gravity * dt;

        this.player.x += this.player.vx * dt;
        this.resolveFenceCollisionsX(prevX);

        this.player.y += this.player.vy * dt;
        this.player.grounded = false;

        if (this.player.y + this.player.height >= this.world.groundY) {
            this.player.y = this.world.groundY - this.player.height;
            this.player.vy = 0;
            this.player.grounded = true;
        }

        this.resolveFenceCollisionsY(prevY);

        if (this.player.x < 0) {
            this.player.x = 0;
            this.player.vx = 0;
        }

        const maxX = this.world.width - this.player.width;
        if (this.player.x > maxX) {
            this.player.x = maxX;
            this.player.vx = 0;
        }
    }

    resolveFenceCollisionsX(prevX) {
        for (const fence of this.fences) {
            if (!this.overlaps(this.player, fence)) {
                continue;
            }

            const wasLeftOfFence = prevX + this.player.width <= fence.x;
            const wasRightOfFence = prevX >= fence.x + fence.width;

            if (wasLeftOfFence) {
                this.player.x = fence.x - this.player.width;
                this.player.vx = 0;
            } else if (wasRightOfFence) {
                this.player.x = fence.x + fence.width;
                this.player.vx = 0;
            }
        }
    }

    resolveFenceCollisionsY(prevY) {
        for (const fence of this.fences) {
            if (!this.overlaps(this.player, fence)) {
                continue;
            }

            const wasAboveFence = prevY + this.player.height <= fence.y;
            const wasBelowFence = prevY >= fence.y + fence.height;

            if (wasAboveFence) {
                this.player.y = fence.y - this.player.height;
                this.player.vy = 0;
                this.player.grounded = true;
            } else if (wasBelowFence) {
                this.player.y = fence.y + fence.height;
                this.player.vy = 60;
            }
        }
    }

    checkPickupCollisions() {
        const playerBox = {
            x: this.player.x + 5,
            y: this.player.y + 5,
            width: this.player.width - 10,
            height: this.player.height - 10
        };

        for (const pickup of this.pickups) {
            if (pickup.collected) {
                continue;
            }

            if (!this.overlaps(playerBox, pickup)) {
                continue;
            }

            pickup.collected = true;
            this.collectedCount += 1;
            this.collectedEl.textContent = String(this.collectedCount);
            this.statusTextEl.textContent = `Nice! You picked ${pickup.label}. Keep going.`;
            this.showPickupPreview(pickup.label);
            this.playLetterAudio(pickup.audioLabel);

            const pickupEl = this.pickupEls.get(pickup.id);
            if (pickupEl) {
                pickupEl.classList.add("collected");
                setTimeout(() => pickupEl.remove(), 220);
            }

            this.updateNextLetterLabel();

            if (this.collectedCount >= this.DANISH_LETTERS.length) {
                this.winGame();
            }
        }
    }

    updateNextLetterLabel() {
        const next = this.pickups.find((pickup) => !pickup.collected);
        this.nextLetterEl.textContent = next ? this.formatLetter(next.label) : "Done";
    }

    updateCamera() {
        const target = this.player.x - this.viewportWidth * 0.4;
        const maxCamera = this.world.width - this.viewportWidth;
        this.world.cameraX = Math.max(0, Math.min(target, maxCamera));
    }

    render() {
        this.playerEl.style.left = `${this.player.x}px`;
        this.playerEl.style.top = `${this.player.y}px`;

        if (!this.isFinished && Math.abs(this.player.vx) > 80 && this.player.grounded) {
            this.playerEl.classList.add("running");
        } else {
            this.playerEl.classList.remove("running");
        }

        this.worldEl.style.transform = `translateX(${-this.world.cameraX}px)`;
    }

    overlaps(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    playLetterAudio(letter) {
        this.audioPlayer.src = `./audio-alphabet/${letter}.ogg`;
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play().catch(() => {
            this.statusTextEl.textContent = "Letter picked. Audio not available for this letter file.";
        });
    }

    showPickupPreview(letter) {
        if (!this.pickupPreviewEl) {
            return;
        }

        this.pickupPreviewEl.textContent = this.formatLetter(letter);
        this.pickupPreviewEl.classList.add("visible");

        if (this.pickupPreviewTimeout) {
            clearTimeout(this.pickupPreviewTimeout);
        }

        this.pickupPreviewTimeout = setTimeout(() => {
            this.pickupPreviewEl.classList.remove("visible");
        }, 2500);
    }

    winGame() {
        this.isFinished = true;
        this.player.vx = 0;
        this.player.vy = 0;
        this.statusTextEl.textContent = "Great job! You collected all Danish letters.";

        const overlay = document.createElement("div");
        overlay.className = "win-overlay";
        overlay.id = "winOverlay";

        overlay.innerHTML = [
            '<div class="win-card">',
            "<h2>You Win!</h2>",
            "<p>You collected all 29 Danish letters.</p>",
            '<button type="button" id="playAgainBtn">Play Again</button>',
            "</div>"
        ].join("");

        this.viewportEl.appendChild(overlay);

        const playAgainBtn = document.getElementById("playAgainBtn");
        if (playAgainBtn) {
            playAgainBtn.addEventListener("click", () => this.restart());
            playAgainBtn.focus();
        }
    }

    removeWinOverlay() {
        const existing = document.getElementById("winOverlay");
        if (existing) {
            existing.remove();
        }
    }

    restart() {
        this.lastFrame = 0;
        this.setupLevel();
    }

    toggleCaseMode() {
        this.caseMode = this.caseMode === "lower" ? "upper" : "lower";

        if (this.toggleCaseBtn) {
            this.toggleCaseBtn.textContent = this.caseMode === "lower"
                ? "Switch to UPPERCASE"
                : "Switch to lowercase";
        }

        this.refreshPickupLetterDisplay();
        this.updateNextLetterLabel();
    }

    refreshPickupLetterDisplay() {
        for (const pickup of this.pickups) {
            if (pickup.collected) {
                continue;
            }

            const pickupEl = this.pickupEls.get(pickup.id);
            if (pickupEl) {
                pickupEl.textContent = this.formatLetter(pickup.label);
            }
        }
    }

    formatLetter(letter) {
        return this.caseMode === "lower" ? letter.toLowerCase() : letter.toUpperCase();
    }
}

const game = new LetterMarioQuest();
