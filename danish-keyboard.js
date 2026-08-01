class DanishKeyboard {
    constructor() {
        this.audioPlayer = document.getElementById("audioPlayer");
        this.display     = document.getElementById("display");
        this.keyboard    = document.getElementById("keyboard");
        this.caseToggle  = document.getElementById("caseToggle");

        this.isUppercase = false;

        // Map physical keyboard keys to on-screen buttons
        this.keyMap = new Map();
        // Letter buttons for case toggling
        this.letterBtns = [];

        this.init();
    }

    init() {
        // Wire up all on-screen keys
        this.keyboard.querySelectorAll(".key--letter, .key--number").forEach((btn) => {
            const char  = btn.dataset.char;
            const audio = btn.dataset.audio;

            this.keyMap.set(char.toUpperCase(), btn);

            if (btn.classList.contains("key--letter")) {
                this.letterBtns.push(btn);
            }

            btn.addEventListener("click", () => {
                const displayed = btn.classList.contains("key--letter")
                    ? (this.isUppercase ? char.toUpperCase() : char.toLowerCase())
                    : char;
                this.activate(displayed, audio, btn);
            });
        });

        // Case toggle button
        this.caseToggle.addEventListener("click", () => {
            this.isUppercase = !this.isUppercase;
            this.caseToggle.classList.toggle("active", this.isUppercase);
            this.caseToggle.setAttribute("aria-pressed", String(this.isUppercase));
            this.caseToggle.textContent = this.isUppercase ? "⇩ Små bogstaver" : "⇧ Store bogstaver";
            this.letterBtns.forEach((btn) => {
                const base = btn.dataset.char;
                btn.textContent = this.isUppercase ? base.toUpperCase() : base.toLowerCase();
            });
        });

        // Physical keyboard support
        document.addEventListener("keydown", (e) => {
            if (e.key === "CapsLock") {
                this.caseToggle.click();
                return;
            }
            const key = e.key.toUpperCase();
            const btn = this.keyMap.get(key);
            if (btn && !e.repeat) {
                btn.click();
            }
        });
    }

    activate(char, audioFile, btn) {
        // Show character in display
        this.display.textContent = char;
        this.display.classList.remove("pop");
        // Force reflow so animation restarts
        void this.display.offsetWidth;
        this.display.classList.add("pop");

        // Flash key
        btn.classList.add("pressed");
        setTimeout(() => btn.classList.remove("pressed"), 220);

        // Play audio
        this.playAudio(audioFile);
    }

    playAudio(audioFile) {
        this.audioPlayer.src         = `./audio-${audioFile}`;
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play().catch(() => {
            // Silently continue if audio is missing.
        });
    }
}

new DanishKeyboard();
