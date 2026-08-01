// Each entry: letter = first char of word (uppercase), emoji, word, audio filename
const DANISH_ENTRIES = [
    { letter: "K", emoji: "🐄", word: "Ko",     audio: "ko.ogg" },
    { letter: "B", emoji: "🐝", word: "Bi",     audio: "bi.ogg" },
    { letter: "I", emoji: "❄️", word: "Is",     audio: "is.ogg" },
    { letter: "Å", emoji: "🌊", word: "Å",      audio: "å.ogg" },
    { letter: "S", emoji: "💧", word: "Sø",     audio: "sø.ogg" },
    { letter: "R", emoji: "🌳", word: "Ry",     audio: "ry.ogg" },
    { letter: "B", emoji: "🏠", word: "Bo",     audio: "bo.ogg" },
    { letter: "E", emoji: "🌳", word: "Eg",     audio: "eg.ogg" },
    { letter: "T", emoji: "☕️", word: "Te",     audio: "te.ogg" },
    { letter: "M", emoji: "🐜", word: "My",     audio: "my.ogg" },
    { letter: "S", emoji: "☀️", word: "Sol",    audio: "sol.ogg" },
    { letter: "S", emoji: "☁️", word: "Sky",    audio: "sky.ogg" },
    { letter: "H", emoji: "🌊", word: "Hav",    audio: "hav.ogg" },
    { letter: "M", emoji: "🐭", word: "Mus",    audio: "mus.ogg" },
    { letter: "K", emoji: "🐱", word: "Kat",    audio: "kat.ogg" },
    { letter: "H", emoji: "🐶", word: "Hund",   audio: "hund.ogg" },
    { letter: "U", emoji: "🐺", word: "Ulv",    audio: "ulv.ogg" },
    { letter: "F", emoji: "🐦", word: "Fugl",   audio: "fugl.ogg" },
    { letter: "Æ", emoji: "🥚", word: "Æg",     audio: "æg.ogg" },
    { letter: "F", emoji: "🐸", word: "Frø",    audio: "frø.ogg" },
    { letter: "G", emoji: "🐷", word: "Gris",   audio: "gris.ogg" },
    { letter: "L", emoji: "🐑", word: "Lam",    audio: "lam.ogg" },
    { letter: "G", emoji: "🐐", word: "Ged",    audio: "ged.ogg" },
    { letter: "R", emoji: "🦊", word: "Ræv",    audio: "ræv.ogg" },
    { letter: "B", emoji: "🐻", word: "Bjørn",  audio: "bjørn.ogg" },
    { letter: "E", emoji: "🫎", word: "Elg",    audio: "elg.ogg" },
    { letter: "S", emoji: "🦭", word: "Sæl",    audio: "sæl.ogg" },
    { letter: "H", emoji: "🦈", word: "Haj",    audio: "haj.ogg" },
    { letter: "F", emoji: "🐟", word: "Fisk",   audio: "fisk.ogg" },
    { letter: "D", emoji: "🕊️", word: "Due",    audio: "due.ogg" },
    { letter: "A", emoji: "🐒", word: "Abe",    audio: "abe.ogg" },
    { letter: "M", emoji: "🌙", word: "Måne",   audio: "måne.ogg" },
    { letter: "Ø", emoji: "🏝️", word: "Ø",      audio: "ø.ogg" },
    { letter: "A", emoji: "🌳", word: "Ask",    audio: "ask.ogg" },
    { letter: "P", emoji: "🌿", word: "Pil",    audio: "pil.ogg" },
    { letter: "S", emoji: "🌾", word: "Siv",    audio: "siv.ogg" },
    { letter: "M", emoji: "🌫️", word: "Mose",   audio: "mose.ogg" },
    { letter: "K", emoji: "🌿", word: "Krat",   audio: "krat.ogg" },
    { letter: "E", emoji: "🌻", word: "Eng",    audio: "eng.ogg" },
    { letter: "B", emoji: "⛰️", word: "Bak",    audio: "bak.ogg" },
    { letter: "M", emoji: "🍎", word: "Mad",    audio: "mad.ogg" },
    { letter: "Ø", emoji: "🍺", word: "Øl",     audio: "øl.ogg" },
    { letter: "V", emoji: "🍷", word: "Vin",    audio: "vin.ogg" },
    { letter: "O", emoji: "🧀", word: "Ost",    audio: "ost.ogg" },
    { letter: "B", emoji: "🍓", word: "Bær",    audio: "bær.ogg" },
    { letter: "S", emoji: "🍬", word: "Sød",    audio: "sød.ogg" },
    { letter: "S", emoji: "🍋", word: "Sur",    audio: "sur.ogg" },
    { letter: "S", emoji: "🧂", word: "Salt",   audio: "salt.ogg" },
    { letter: "R", emoji: "🍚", word: "Ris",    audio: "ris.ogg" },
    { letter: "Æ", emoji: "🫛", word: "Ært",    audio: "ært.ogg" },
    { letter: "K", emoji: "🥬", word: "Kål",    audio: "kål.ogg" },
    { letter: "L", emoji: "🧅", word: "Løg",    audio: "løg.ogg" },
    { letter: "M", emoji: "🌾", word: "Mel",    audio: "mel.ogg" },
    { letter: "S", emoji: "🥤", word: "Saft",   audio: "saft.ogg" },
    { letter: "V", emoji: "💧", word: "Vand",   audio: "vand.ogg" },
    { letter: "M", emoji: "🥛", word: "Mælk",   audio: "mælk.ogg" },
    { letter: "K", emoji: "🥩", word: "Kød",    audio: "kød.ogg" },
    { letter: "F", emoji: "🧈", word: "Fed",    audio: "fed.ogg" },
    { letter: "R", emoji: "🍞", word: "Rug",    audio: "rug.ogg" },
    { letter: "G", emoji: "🍞", word: "Gær",    audio: "gær.ogg" },
    { letter: "S", emoji: "🍯", word: "Sir",    audio: "sir.ogg" },
    { letter: "B", emoji: "🫘", word: "Bøn",    audio: "bøn.ogg" },
    { letter: "K", emoji: "🍲", word: "Kar",    audio: "kar.ogg" },
    { letter: "M", emoji: "🥣", word: "Mos",    audio: "mos.ogg" },
    { letter: "G", emoji: "🥣", word: "Grød",   audio: "grød.ogg" },
    { letter: "S", emoji: "🐟", word: "Sild",   audio: "sild.ogg" },
    { letter: "L", emoji: "🍣", word: "Laks",   audio: "laks.ogg" },
    { letter: "A", emoji: "🦆", word: "And",    audio: "and.ogg" },
    { letter: "G", emoji: "🪿", word: "Gås",    audio: "gås.ogg" },
    { letter: "C", emoji: "🍫", word: "Chok",   audio: "chok.ogg" },
    { letter: "K", emoji: "🍪", word: "Kiks",   audio: "kiks.ogg" },
    { letter: "K", emoji: "🍰", word: "Kage",   audio: "kage.ogg" },
    { letter: "B", emoji: "🥯", word: "Bolle",  audio: "bolle.ogg" },
    { letter: "S", emoji: "🧈", word: "Smør",   audio: "smør.ogg" },
    { letter: "O", emoji: "🫗", word: "Olie",   audio: "olie.ogg" },
    { letter: "B", emoji: "🚗", word: "Bil",    audio: "bil.ogg" },
    { letter: "T", emoji: "🚂", word: "Tog",    audio: "tog.ogg" },
    { letter: "H", emoji: "🏠", word: "Hus",    audio: "hus.ogg" },
    { letter: "D", emoji: "🚪", word: "Dør",    audio: "dør.ogg" },
    { letter: "M", emoji: "🧱", word: "Mur",    audio: "mur.ogg" },
    { letter: "G", emoji: "🍷", word: "Glas",   audio: "glas.ogg" },
    { letter: "K", emoji: "☕", word: "Kop",    audio: "kop.ogg" },
    { letter: "S", emoji: "🥄", word: "Ske",    audio: "ske.ogg" },
    { letter: "K", emoji: "🔪", word: "Kniv",   audio: "kniv.ogg" },
    { letter: "U", emoji: "⌚", word: "Ur",     audio: "ur.ogg" },
    { letter: "B", emoji: "📖", word: "Bog",    audio: "bog.ogg" },
    { letter: "S", emoji: "🪑", word: "Stol",   audio: "stol.ogg" },
    { letter: "S", emoji: "🛏️", word: "Seng",   audio: "seng.ogg" },
    { letter: "D", emoji: "🛌", word: "Dyne",   audio: "dyne.ogg" },
    { letter: "P", emoji: "🛌", word: "Pude",   audio: "pude.ogg" },
    { letter: "K", emoji: "🪮", word: "Kam",    audio: "kam.ogg" },
    { letter: "S", emoji: "🧼", word: "Sæbe",   audio: "sæbe.ogg" },
    { letter: "T", emoji: "🦷", word: "Tand",   audio: "tand.ogg" },
    { letter: "S", emoji: "👞", word: "Sko",    audio: "sko.ogg" },
    { letter: "H", emoji: "🧶", word: "Hue",    audio: "hue.ogg" },
    { letter: "N", emoji: "🕸️", word: "Net",    audio: "net.ogg" },
    { letter: "S", emoji: "🧵", word: "Snor",   audio: "snor.ogg" },
    { letter: "N", emoji: "🪡", word: "Nål",    audio: "nål.ogg" },
    { letter: "L", emoji: "🧴", word: "Lim",    audio: "lim.ogg" },
    { letter: "B", emoji: "✏️", word: "Bly",    audio: "bly.ogg" },
    { letter: "P", emoji: "🖊️", word: "Pen",    audio: "pen.ogg" },
    { letter: "A", emoji: "📄", word: "Ark",    audio: "ark.ogg" },
    { letter: "T", emoji: "💼", word: "Task",   audio: "task.ogg" },
    { letter: "B", emoji: "⚽", word: "Bold",   audio: "bold.ogg" },
    { letter: "S", emoji: "🎲", word: "Spil",   audio: "spil.ogg" },
    { letter: "D", emoji: "🪆", word: "Duk",    audio: "duk.ogg" },
    { letter: "B", emoji: "⛵", word: "Båd",    audio: "båd.ogg" },
    { letter: "S", emoji: "🚢", word: "Skib",   audio: "skib.ogg" },
    { letter: "F", emoji: "✈️", word: "Fly",    audio: "fly.ogg" },
    { letter: "G", emoji: "🪵", word: "Gulv",   audio: "gulv.ogg" },
    { letter: "L", emoji: "🏠", word: "Loft",   audio: "loft.ogg" },
    { letter: "M", emoji: "👩", word: "Mor",    audio: "mor.ogg" },
    { letter: "F", emoji: "👨", word: "Far",    audio: "far.ogg" },
    { letter: "B", emoji: "👶", word: "Barn",   audio: "barn.ogg" },
    { letter: "D", emoji: "👦", word: "Dreng",  audio: "dreng.ogg" },
    { letter: "P", emoji: "👧", word: "Pige",   audio: "pige.ogg" },
    { letter: "M", emoji: "👨", word: "Mand",   audio: "mand.ogg" },
    { letter: "K", emoji: "👩", word: "Kone",   audio: "kone.ogg" },
    { letter: "V", emoji: "🤝", word: "Ven",    audio: "ven.ogg" },
    { letter: "N", emoji: "🏷️", word: "Navn",   audio: "navn.ogg" },
    { letter: "F", emoji: "🦶", word: "Fod",    audio: "fod.ogg" },
    { letter: "H", emoji: "✋", word: "Hånd",   audio: "hånd.ogg" },
    { letter: "A", emoji: "💪", word: "Arm",    audio: "arm.ogg" },
    { letter: "B", emoji: "🦵", word: "Ben",    audio: "ben.ogg" },
    { letter: "K", emoji: "🦵", word: "Knæ",    audio: "knæ.ogg" },
    { letter: "M", emoji: "👄", word: "Mund",   audio: "mund.ogg" },
    { letter: "N", emoji: "👃", word: "Næse",   audio: "næse.ogg" },
    { letter: "Ø", emoji: "👀", word: "Øje",    audio: "øje.ogg" },
    { letter: "Ø", emoji: "👂", word: "Øre",    audio: "øre.ogg" },
    { letter: "H", emoji: "💇", word: "Hår",    audio: "hår.ogg" },
    { letter: "R", emoji: "🧍", word: "Ryg",    audio: "ryg.ogg" },
    { letter: "M", emoji: "🫄", word: "Mave",   audio: "mave.ogg" },
    { letter: "B", emoji: "🩸", word: "Blod",   audio: "blod.ogg" },
    { letter: "H", emoji: "🖐️", word: "Hud",    audio: "hud.ogg" },
    { letter: "K", emoji: "😊", word: "Kind",   audio: "kind.ogg" },
    { letter: "H", emoji: "🧣", word: "Hals",   audio: "hals.ogg" },
    { letter: "B", emoji: "👕", word: "Bryst",  audio: "bryst.ogg" },
    { letter: "N", emoji: "💅", word: "Negl",   audio: "negl.ogg" },
    { letter: "T", emoji: "🦶", word: "Tå",     audio: "tå.ogg" },
    { letter: "S", emoji: "👀", word: "Se",     audio: "se.ogg" },
    { letter: "G", emoji: "🚶", word: "Gå",     audio: "gå.ogg" },
    { letter: "L", emoji: "🏃", word: "Løb",    audio: "løb.ogg" },
    { letter: "H", emoji: "🦘", word: "Hop",    audio: "hop.ogg" },
    { letter: "S", emoji: "🎤", word: "Syng",   audio: "syng.ogg" },
    { letter: "D", emoji: "💃", word: "Dans",   audio: "dans.ogg" },
    { letter: "S", emoji: "😴", word: "Sov",    audio: "sov.ogg" },
    { letter: "S", emoji: "🍴", word: "Spis",   audio: "spis.ogg" },
    { letter: "D", emoji: "🥛", word: "Drik",   audio: "drik.ogg" },
    { letter: "L", emoji: "📖", word: "Læs",    audio: "læs.ogg" },
    { letter: "S", emoji: "✍️", word: "Skriv",  audio: "skriv.ogg" },
    { letter: "T", emoji: "🎨", word: "Tegn",   audio: "tegn.ogg" },
    { letter: "M", emoji: "🖌️", word: "Mal",    audio: "mal.ogg" },
    { letter: "K", emoji: "🛍️", word: "Køb",    audio: "køb.ogg" },
    { letter: "S", emoji: "💰", word: "Sælg",   audio: "sælg.ogg" },
    { letter: "G", emoji: "🎁", word: "Giv",    audio: "giv.ogg" },
    { letter: "K", emoji: "🏃", word: "Kom",    audio: "kom.ogg" },
    { letter: "F", emoji: "✈️", word: "Flyv",   audio: "flyv.ogg" },
    { letter: "S", emoji: "🏊", word: "Svøm",   audio: "svøm.ogg" },
    { letter: "K", emoji: "🚗", word: "Kør",    audio: "kør.ogg" },
    { letter: "L", emoji: "🧸", word: "Leg",    audio: "leg.ogg" },
    { letter: "V", emoji: "🏆", word: "Vind",   audio: "vind.ogg" },
    { letter: "T", emoji: "📉", word: "Tab",    audio: "tab.ogg" },
    { letter: "S", emoji: "😊", word: "Smil",   audio: "smil.ogg" },
    { letter: "G", emoji: "😢", word: "Græd",   audio: "græd.ogg" },
    { letter: "G", emoji: "😂", word: "Grin",   audio: "grin.ogg" },
    { letter: "S", emoji: "😱", word: "Skrig",  audio: "skrig.ogg" },
    { letter: "H", emoji: "👂", word: "Hør",    audio: "hør.ogg" },
    { letter: "G", emoji: "😊", word: "Glad",   audio: "glad.ogg" },
    { letter: "J", emoji: "✅", word: "Ja",     audio: "ja.ogg" },
    { letter: "N", emoji: "❌", word: "Nej",    audio: "nej.ogg" },
    { letter: "G", emoji: "👍", word: "God",    audio: "god.ogg" },
    { letter: "O", emoji: "😈", word: "Ond",    audio: "ond.ogg" },
    { letter: "S", emoji: "🐘", word: "Stor",   audio: "stor.ogg" },
    { letter: "L", emoji: "🐭", word: "Lille",  audio: "lille.ogg" },
    { letter: "N", emoji: "✨", word: "Ny",     audio: "ny.ogg" },
    { letter: "G", emoji: "👴", word: "Gammel", audio: "gammel.ogg" },
    { letter: "R", emoji: "🟥", word: "Rød",    audio: "rød.ogg" },
    { letter: "B", emoji: "🟦", word: "Blå",    audio: "blå.ogg" },
    { letter: "G", emoji: "🟨", word: "Gul",    audio: "gul.ogg" },
    { letter: "G", emoji: "🟩", word: "Grøn",   audio: "grøn.ogg" },
    { letter: "S", emoji: "⬛", word: "Sort",   audio: "sort.ogg" },
    { letter: "H", emoji: "⬜", word: "Hvid",   audio: "hvid.ogg" },
];

class GuessEmojiGame {
    constructor() {
        this.entries = DANISH_ENTRIES;
        this.stepsToWin = 10;
        this.currentStep = 0;
        this.correctCount = 0;
        this.attemptCount = 0;
        this.currentEntry = null;
        this.currentChoices = [];
        this.isRoundLocked = false;
        this.isComplete = false;

        this.letterBtn     = document.getElementById("letterBtn");
        this.emojiChoicesEl = document.getElementById("emojiChoices");
        this.feedbackEl    = document.getElementById("feedback");
        this.correctCountEl = document.getElementById("correctCount");
        this.attemptCountEl = document.getElementById("attemptCount");
        this.shipEl        = document.getElementById("ship");
        this.stepCountEl   = document.getElementById("stepCount");
        this.stepGoalEl    = document.getElementById("stepGoal");
        this.stickersEl    = document.getElementById("stickers");
        this.restartBtn    = document.getElementById("restartBtn");
        this.audioPlayer   = document.getElementById("audioPlayer");
        this.trackEl       = document.getElementById("track");

        this.init();
    }

    init() {
        this.stepGoalEl.textContent = String(this.stepsToWin);

        this.letterBtn.addEventListener("click", () => {
            if (this.currentEntry) {
                this.playLetterAudio(this.currentEntry.letter.toLowerCase());
            }
        });

        this.restartBtn.addEventListener("click", () => this.restart());
        this.restart();
    }

    restart() {
        this.currentStep    = 0;
        this.correctCount   = 0;
        this.attemptCount   = 0;
        this.isRoundLocked  = false;
        this.isComplete     = false;

        this.stickersEl.innerHTML = "";
        this.setFeedback("", "");
        this.updateScore();
        this.updateShipPosition();
        this.nextRound();
    }

    nextRound() {
        if (this.isComplete) return;

        this.isRoundLocked = false;
        this.currentEntry  = this.pickRandom(this.entries);

        const distractors = this.pickDistractors(this.currentEntry, 2);
        this.currentChoices = this.shuffle([this.currentEntry, ...distractors]);

        this.renderRound();

        // Pronounce the letter automatically when the round loads
        this.playLetterAudio(this.currentEntry.letter.toLowerCase());
    }

    renderRound() {
        // Letter button: big uppercase + smaller lowercase
        this.letterBtn.innerHTML = `
            <span class="letter-upper" aria-hidden="true">${this.currentEntry.letter.toUpperCase()}</span>
            <span class="letter-lower" aria-hidden="true">${this.currentEntry.letter.toLowerCase()}</span>
        `;
        this.letterBtn.setAttribute(
            "aria-label",
            `Bogstavet ${this.currentEntry.letter.toUpperCase()} – tryk for at høre det`
        );

        // Emoji choice buttons
        this.emojiChoicesEl.innerHTML = "";
        this.currentChoices.forEach((entry) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "emoji-card";
            btn.setAttribute("aria-label", `${entry.word} – starter med ${entry.letter}`);
            btn.innerHTML = `
                <span aria-hidden="true">${entry.emoji}</span>
                <span class="emoji-label">${entry.word}</span>
            `;

            btn.addEventListener("click", () => {
                this.playWordAudio(entry.audio);
                this.handleChoice(entry, btn);
            });

            this.emojiChoicesEl.appendChild(btn);
        });
    }

    handleChoice(entry, buttonEl) {
        if (this.isRoundLocked || this.isComplete) return;

        this.attemptCount += 1;

        if (entry.letter === this.currentEntry.letter) {
            this.isRoundLocked = true;
            this.correctCount += 1;
            this.currentStep  += 1;

            buttonEl.classList.add("correct");
            this.setFeedback("Godt klaret! 🎉", "ok");
            this.updateScore();
            this.updateShipPosition();

            if (this.currentStep >= this.stepsToWin) {
                this.completeGame();
                return;
            }

            setTimeout(() => this.nextRound(), 3000);
        } else {
            buttonEl.classList.add("wrong");
            this.setFeedback("Prøv igen!", "error");
            this.updateScore();
            this.playErrorSound();
            setTimeout(() => buttonEl.classList.remove("wrong"), 350);
        }
    }

    updateScore() {
        this.correctCountEl.textContent = String(this.correctCount);
        this.attemptCountEl.textContent = String(this.attemptCount);
        this.stepCountEl.textContent    = String(this.currentStep);
    }

    updateShipPosition() {
        const startPx = 48;
        const endPx   = Math.max(startPx + 1, this.trackEl.clientWidth - 94);
        const progress = this.stepsToWin === 0 ? 0 : this.currentStep / this.stepsToWin;
        const shipX   = startPx + (endPx - startPx) * Math.min(1, Math.max(0, progress));
        this.shipEl.style.left = `${shipX}px`;
    }

    completeGame() {
        this.isComplete    = true;
        this.isRoundLocked = true;
        this.setFeedback("Hjemme! Du klarede det! 🏆", "ok");
        this.addSticker();
        this.celebrate();
    }

    addSticker() {
        const options = ["⭐", "🎉", "🏆", "🌈", "🚀", "🦄"];
        const el = document.createElement("span");
        el.className   = "sticker";
        el.textContent = this.pickRandom(options);
        this.stickersEl.appendChild(el);
    }

    celebrate() {
        for (let i = 0; i < 3; i += 1) {
            setTimeout(() => {
                const sparkle = document.createElement("span");
                sparkle.className   = "sticker";
                sparkle.textContent = i % 2 === 0 ? "✨" : "🎊";
                this.stickersEl.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 1300);
            }, i * 40);
        }
    }

    setFeedback(text, type) {
        this.feedbackEl.textContent = text;
        this.feedbackEl.className   = type ? `feedback ${type}` : "feedback";
    }

    playLetterAudio(letter) {
        this.audioPlayer.src         = `./audio-alphabet/${letter}.ogg`;
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play().catch(() => {
            // Continue even if audio file is missing.
        });
    }

    playWordAudio(audioFile) {
        this.audioPlayer.src         = `./audio-word/${audioFile}`;
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play().catch(() => {
            // Continue even if audio file is missing.
        });
    }

    playErrorSound() {
        const ctx  = new AudioContext();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 210;
        osc.type            = "sine";
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.22);
    }

    pickDistractors(correct, count) {
        const candidates = this.entries.filter((e) => e.letter !== correct.letter);
        const picked = [];
        const pool   = [...candidates];

        while (picked.length < count && pool.length > 0) {
            const idx = Math.floor(Math.random() * pool.length);
            picked.push(pool[idx]);
            pool.splice(idx, 1);
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

const game = new GuessEmojiGame();

window.addEventListener("resize", () => {
    game.updateShipPosition();
});
