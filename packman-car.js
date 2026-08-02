const COLS = 5;
const ROWS = 5;
const LETTERS = "abcdefghijklmnopqrstuvwxyzæøå".split("");

class PackmanCarGame {
    constructor() {
        this.tractor    = { col: 2, row: 2 };
        this.items      = [];
        this.targetChar = "";
        this.isLocked   = false;

        this.playAreaEl     = document.getElementById("playArea");
        this.targetLetterEl = document.getElementById("targetLetter");
        this.feedbackEl     = document.getElementById("feedback");
        this.audioPlayer    = document.getElementById("audioPlayer");

        this.bindControls();
        this.nextRound();
    }

    bindControls() {
        document.getElementById("btnUp").addEventListener("click",    () => this.move(0, -1));
        document.getElementById("btnDown").addEventListener("click",   () => this.move(0,  1));
        document.getElementById("btnLeft").addEventListener("click",   () => this.move(-1, 0));
        document.getElementById("btnRight").addEventListener("click",  () => this.move( 1, 0));

        document.addEventListener("keydown", (e) => {
            const map = {
                ArrowUp:    [0, -1],
                ArrowDown:  [0,  1],
                ArrowLeft:  [-1, 0],
                ArrowRight: [ 1, 0],
            };
            if (map[e.key]) {
                e.preventDefault();
                this.move(...map[e.key]);
            }
        });
    }

    nextRound() {
        this.isLocked   = false;
        this.targetChar = this.pickRandom(LETTERS);
        this.tractor    = { col: Math.floor(COLS / 2), row: Math.floor(ROWS / 2) };

        const distractor   = this.pickRandom(LETTERS.filter(l => l !== this.targetChar));
        const [posA, posB] = this.pickPositions(2, [this.tractor]);

        this.items = [
            { col: posA.col, row: posA.row, char: this.targetChar, isCorrect: true,  state: "alive" },
            { col: posB.col, row: posB.row, char: distractor,      isCorrect: false, state: "alive" },
        ];

        this.targetLetterEl.textContent = this.targetChar;
        this.setFeedback("");
        this.render();
        // Small delay so the render is visible before audio fires
        setTimeout(() => this.playAudio(this.targetChar), 120);
    }

    move(dc, dr) {
        if (this.isLocked) return;

        const nc = this.tractor.col + dc;
        const nr = this.tractor.row + dr;
        if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) return;

        this.tractor = { col: nc, row: nr };

        const hit = this.items.find(
            item => item.state === "alive" && item.col === nc && item.row === nr
        );

        if (hit) {
            hit.isCorrect ? this.handleCorrect(hit) : this.handleWrong(hit);
        } else {
            this.render();
        }
    }

    handleCorrect(item) {
        this.isLocked = true;
        item.state = "dead";
        this.setFeedback("Godt klaret! 🎉");
        this.playAudio(item.char);
        this.render();
        setTimeout(() => this.nextRound(), 1800);
    }

    handleWrong(item) {
        item.state = "exploding";
        this.setFeedback("Ups! Prøv igen!");
        this.playErrorSound();
        this.render();

        setTimeout(() => {
            const [newPos] = this.pickPositions(1, [
                this.tractor,
                ...this.items.filter(i => i !== item),
            ]);
            item.col   = newPos.col;
            item.row   = newPos.row;
            item.state = "alive";
            this.setFeedback("");
            this.render();
        }, 900);
    }

    render() {
        this.playAreaEl.innerHTML = "";

        // Build a flat 5×5 grid of cell divs
        const cells = [];
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = document.createElement("div");
                cell.className = "grid-cell";
                cells.push({ el: cell, col, row });
                this.playAreaEl.appendChild(cell);
            }
        }

        const cellAt = (col, row) => cells.find(c => c.col === col && c.row === row)?.el;

        // Place letter items
        for (const item of this.items) {
            const cell = cellAt(item.col, item.row);
            if (!cell) continue;
            const span = document.createElement("span");

            if (item.state === "exploding") {
                span.className   = "item-explosion";
                span.textContent = Math.random() > 0.5 ? "💥" : "🔥";
            } else if (item.state === "alive") {
                span.className   = "item-letter";
                span.textContent = item.char;
            }

            cell.appendChild(span);
        }

        // Place tractor
        const tractorCell = cellAt(this.tractor.col, this.tractor.row);
        if (tractorCell) {
            const span = document.createElement("span");
            span.className   = "item-tractor";
            span.textContent = "🚜";
            tractorCell.appendChild(span);
        }
    }

    setFeedback(msg) {
        this.feedbackEl.textContent = msg;
    }

    pickPositions(count, avoid) {
        const taken = new Set(avoid.map(p => `${p.col},${p.row}`));
        const result = [];
        while (result.length < count) {
            const col = Math.floor(Math.random() * COLS);
            const row = Math.floor(Math.random() * ROWS);
            const key = `${col},${row}`;
            if (!taken.has(key)) {
                taken.add(key);
                result.push({ col, row });
            }
        }
        return result;
    }

    pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    playAudio(letter) {
        this.audioPlayer.src         = `./audio-alphabet/${letter}.ogg`;
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play().catch(() => {});
    }

    playErrorSound() {
        try {
            const ctx  = new AudioContext();
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type            = "sawtooth";
            osc.frequency.value = 180;
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) {}
    }
}

new PackmanCarGame();
