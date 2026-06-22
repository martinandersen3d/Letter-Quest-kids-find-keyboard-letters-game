class LetterTrainGame {
    constructor() {
        this.words = [];
        this.currentWordIndex = 0;
        this.currentEntry = null;
        this.currentChars = [];

        this.solvedCount = 0;
        this.attemptCount = 0;
        this.roundTokenIdSeed = 0;

        this.tokensById = new Map();
        this.placementsByTokenId = new Map();
        this.followingTokenId = null;
        this.hoveredDropSlot = null;
        this.draggingTokenId = null;
        this.lastPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        this.hoverAudioByKey = new Map();
        this.minHoverAudioIntervalMs = 300;
        this.blockHoverAudioUntil = 0;

        this.audioPlayer = document.getElementById("audioPlayer");
        this.emojiDisplay = document.getElementById("emojiDisplay");
        this.targetWord = document.getElementById("targetWord");
        this.letterBank = document.getElementById("letterBank");
        this.feedback = document.getElementById("feedback");
        this.instructionText = document.getElementById("instructionText");
        this.solvedCountEl = document.getElementById("solvedCount");
        this.attemptCountEl = document.getElementById("attemptCount");
        this.playWordBtn = document.getElementById("playWordBtn");
        this.nextWordBtn = document.getElementById("nextWordBtn");
        this.arena = document.getElementById("arena");

        this.loadWords();
        this.attachGlobalEvents();
        this.startRound();
    }

    loadWords() {
        this.words = getWordData();
        this.shuffle(this.words);
    }

    attachGlobalEvents() {
        this.playWordBtn.addEventListener("click", () => {
            if (!this.currentEntry) {
                return;
            }
            this.playWordAudio(this.currentEntry.a);
        });

        this.nextWordBtn.addEventListener("click", () => {
            this.advanceWord();
            this.startRound();
        });

        this.targetWord.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        this.arena.addEventListener("dragover", (event) => {
            event.preventDefault();

            const slot = this.getSlotFromPoint(event.clientX, event.clientY);
            this.setHoveredDropSlot(slot);
        });

        this.arena.addEventListener("drop", (event) => {
            event.preventDefault();
            this.setHoveredDropSlot(null);
            const tokenId = event.dataTransfer.getData("text/plain") || this.draggingTokenId;
            this.draggingTokenId = null;
            if (!tokenId) {
                return;
            }

            const slot = this.getSlotFromPoint(event.clientX, event.clientY);
            if (!slot) {
                this.setFeedback("Drop the letter on a matching spot.", "error");
                return;
            }

            const slotIndex = Number(slot.dataset.index);
            if (Number.isNaN(slotIndex)) {
                return;
            }

            this.tryPlaceToken(tokenId, slotIndex);
        });

        document.addEventListener("mousemove", (event) => {
            this.lastPointer = { x: event.clientX, y: event.clientY };
            this.updateFollowingTokenPosition();
        });

        document.addEventListener("click", (event) => {
            if (!this.followingTokenId) {
                return;
            }

            const clickedSlot = event.target.closest(".word-slot");
            const clickedToken = event.target.closest(".letter-token");

            if (clickedSlot || clickedToken) {
                return;
            }

            this.cancelFollowMode();
        });

        window.addEventListener("resize", () => this.layoutUnplacedTokens());

        document.addEventListener("dragend", () => {
            this.setHoveredDropSlot(null);
            this.draggingTokenId = null;
        });
    }

    startRound() {
        if (!this.words.length) {
            this.setFeedback("No words found.", "error");
            return;
        }

        this.currentEntry = this.words[this.currentWordIndex];
        this.currentChars = Array.from(this.currentEntry.w.toLowerCase());

        this.tokensById.clear();
        this.placementsByTokenId.clear();
        this.followingTokenId = null;
        this.roundTokenIdSeed += 1;

        this.emojiDisplay.textContent = this.currentEntry.e;
        this.targetWord.innerHTML = "";
        this.letterBank.innerHTML = "";

        this.renderSlots();
        this.renderTokens();
        this.layoutUnplacedTokens();

        this.instructionText.textContent = "Listen, then match each lowercase letter to the same lowercase spot.";
        this.setFeedback("", "");

        setTimeout(() => {
            this.playWordAudio(this.currentEntry.a);
        }, 250);
    }

    renderSlots() {
        this.currentChars.forEach((letter, index) => {
            const slot = document.createElement("div");
            slot.className = "word-slot";
            slot.dataset.index = String(index);
            slot.dataset.expected = letter;

            const ghost = document.createElement("span");
            ghost.className = "ghost-letter";
            ghost.textContent = letter;
            slot.appendChild(ghost);

            slot.addEventListener("dragover", (event) => {
                event.preventDefault();
            });

            slot.addEventListener("dragleave", (event) => {
                event.preventDefault();
            });

            slot.addEventListener("drop", (event) => {
                event.preventDefault();
            });

            slot.addEventListener("click", (event) => {
                event.stopPropagation();
                if (!this.followingTokenId) {
                    return;
                }
                this.tryPlaceToken(this.followingTokenId, index);
            });

            this.targetWord.appendChild(slot);
        });
    }

    renderTokens() {
        this.currentChars.forEach((letter, index) => {
            const tokenId = `r${this.roundTokenIdSeed}-t${index}`;
            const token = document.createElement("button");

            token.type = "button";
            token.className = "letter-token";
            token.textContent = letter;
            token.dataset.tokenId = tokenId;
            token.dataset.letter = letter;
            token.draggable = true;
            token.setAttribute("aria-label", `Letter ${letter}`);

            token.addEventListener("mouseenter", () => {
                this.playLetterAudio(letter, `hover-${tokenId}`);
            });

            token.addEventListener("dragstart", (event) => {
                if (this.isTokenPlaced(tokenId)) {
                    event.preventDefault();
                    return;
                }

                event.dataTransfer.setData("text/plain", tokenId);
                event.dataTransfer.effectAllowed = "move";
                this.draggingTokenId = tokenId;
                token.classList.remove("following");
                this.followingTokenId = null;
            });

            token.addEventListener("click", (event) => {
                event.stopPropagation();

                if (this.isTokenPlaced(tokenId)) {
                    return;
                }

                if (this.followingTokenId === tokenId) {
                    this.cancelFollowMode();
                    return;
                }

                this.followingTokenId = tokenId;
                token.classList.add("following");
                this.updateFollowingTokenPosition();
                this.setFeedback("Now click the matching spot in the word.", "");
            });

            this.tokensById.set(tokenId, token);
            this.letterBank.appendChild(token);
        });
    }

    layoutUnplacedTokens() {
        const arenaRect = this.arena.getBoundingClientRect();
        const centerX = arenaRect.width / 2;
        const centerY = arenaRect.height * 0.62;
        const radiusX = Math.min(arenaRect.width * 0.42, 360);
        const radiusY = Math.min(arenaRect.height * 0.24, 145);

        const freeTokenIds = Array.from(this.tokensById.keys()).filter((tokenId) => !this.isTokenPlaced(tokenId));
        const total = freeTokenIds.length || 1;

        freeTokenIds.forEach((tokenId, idx) => {
            if (this.followingTokenId === tokenId) {
                return;
            }

            const token = this.tokensById.get(tokenId);
            const angle = (idx / total) * (Math.PI * 2);
            const x = centerX + Math.cos(angle) * radiusX;
            const y = centerY + Math.sin(angle) * radiusY;

            token.style.left = `${x}px`;
            token.style.top = `${y}px`;
            token.style.transform = "translate(-50%, -50%)";

            token.dataset.anchorLeft = token.style.left;
            token.dataset.anchorTop = token.style.top;
            token.dataset.anchorTransform = token.style.transform;
        });
    }

    updateFollowingTokenPosition() {
        if (!this.followingTokenId) {
            return;
        }

        const token = this.tokensById.get(this.followingTokenId);
        if (!token) {
            this.followingTokenId = null;
            return;
        }

        token.style.left = `${this.lastPointer.x}px`;
        token.style.top = `${this.lastPointer.y}px`;
    }

    tryPlaceToken(tokenId, slotIndex) {
        const token = this.tokensById.get(tokenId);
        const slot = this.targetWord.querySelector(`.word-slot[data-index="${slotIndex}"]`);

        if (!token || !slot) {
            return;
        }

        if (slot.querySelector(".letter-token")) {
            this.setFeedback("That spot is already filled.", "error");
            this.bumpSlot(slot);
            return;
        }

        const expected = slot.dataset.expected;
        const picked = token.dataset.letter;

        this.attemptCount += 1;
        this.updateScore();

        if (picked !== expected) {
            this.setFeedback("Try another spot.", "error");
            this.playErrorSound();
            this.bumpSlot(slot);
            this.cancelFollowMode();
            return;
        }

        this.placementsByTokenId.set(tokenId, slotIndex);
        slot.classList.add("done");

        token.classList.remove("following");
        token.classList.add("placed");
        token.draggable = false;
        token.style.left = "";
        token.style.top = "";
        token.style.transform = "";
        slot.appendChild(token);

        this.followingTokenId = null;
        this.playLetterAudio(expected, `placed-${tokenId}`);
        this.setFeedback("Great match!", "ok");

        if (this.placementsByTokenId.size === this.currentChars.length) {
            this.onWordSolved();
            return;
        }
    }

    onWordSolved() {
        this.solvedCount += 1;
        this.updateScore();
        this.setFeedback("Word complete!", "ok");

        // Let the final placed letter sound finish before replaying the full word.
        this.blockHoverAudioUntil = Date.now() + 3000;
        if (this.currentEntry && this.currentEntry.a) {
            setTimeout(() => {
                this.playWordAudio(this.currentEntry.a);
            }, 2000);
        }

        setTimeout(() => {
            this.advanceWord();
            this.startRound();
        }, 5000);
    }

    isTokenPlaced(tokenId) {
        return this.placementsByTokenId.has(tokenId);
    }

    cancelFollowMode() {
        if (!this.followingTokenId) {
            return;
        }

        const token = this.tokensById.get(this.followingTokenId);
        if (token) {
            token.classList.remove("following");
            token.style.left = token.dataset.anchorLeft || token.style.left;
            token.style.top = token.dataset.anchorTop || token.style.top;
            token.style.transform = token.dataset.anchorTransform || "translate(-50%, -50%)";
        }

        this.followingTokenId = null;
    }

    bumpSlot(slot) {
        slot.classList.add("error");
        setTimeout(() => slot.classList.remove("error"), 360);
    }

    setHoveredDropSlot(slot) {
        if (this.hoveredDropSlot && this.hoveredDropSlot !== slot) {
            this.hoveredDropSlot.classList.remove("ready");
        }

        this.hoveredDropSlot = slot;

        if (this.hoveredDropSlot) {
            this.hoveredDropSlot.classList.add("ready");
        }
    }

    getSlotFromPoint(clientX, clientY) {
        const elements = document.elementsFromPoint(clientX, clientY);
        for (const element of elements) {
            if (typeof element.closest === "function") {
                const slot = element.closest(".word-slot");
                if (slot) {
                    return slot;
                }
            }
        }
        return null;
    }

    setFeedback(message, type) {
        this.feedback.textContent = message;
        this.feedback.className = type ? `feedback ${type}` : "feedback";
    }

    updateScore() {
        this.solvedCountEl.textContent = String(this.solvedCount);
        this.attemptCountEl.textContent = String(this.attemptCount);
    }

    advanceWord() {
        this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
    }

    playWordAudio(filename) {
        this.audioPlayer.src = `./audio-word/${filename}`;
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play().catch(() => {
            // Keep the game running even if audio is unavailable.
        });
    }

    playLetterAudio(letter, key) {
        if (key.startsWith("hover-") && Date.now() < this.blockHoverAudioUntil) {
            return;
        }

        const now = Date.now();
        const lastPlayed = this.hoverAudioByKey.get(key) || 0;

        if (now - lastPlayed < this.minHoverAudioIntervalMs) {
            return;
        }

        this.hoverAudioByKey.set(key, now);

        this.audioPlayer.src = `./audio-alphabet/${letter}.ogg`;
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play().catch(() => {
            // Keep the game running even if audio is unavailable.
        });
    }

    playErrorSound() {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 200;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.26, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.26);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.26);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

const game = new LetterTrainGame();

function getWordData() {
    return [
        {"w":"Ko","a":"ko.ogg","e":"🐄"},
        {"w":"Bi","a":"bi.ogg","e":"🐝"},
        {"w":"Is","a":"is.ogg","e":"❄️"},
        {"w":"Sø","a":"sø.ogg","e":"💧"},
        {"w":"Ry","a":"ry.ogg","e":"🌳"},
        {"w":"Bo","a":"bo.ogg","e":"🏠"},
        {"w":"Te","a":"te.ogg","e":"☕️"},
        {"w":"My","a":"my.ogg","e":"🐜"},
        {"w":"Sol","a":"sol.ogg","e":"☀️"},
        {"w":"Sky","a":"sky.ogg","e":"☁️"},
        {"w":"Hav","a":"hav.ogg","e":"🌊"},
        {"w":"Mus","a":"mus.ogg","e":"🐭"},
        {"w":"Kat","a":"kat.ogg","e":"🐱"},
        {"w":"Hund","a":"hund.ogg","e":"🐶"},
        {"w":"Fugl","a":"fugl.ogg","e":"🐦"},
        {"w":"Frø","a":"frø.ogg","e":"🐸"},
        {"w":"Gris","a":"gris.ogg","e":"🐷"},
        {"w":"Ræv","a":"ræv.ogg","e":"🦊"},
        {"w":"Sæl","a":"sæl.ogg","e":"🦭"},
        {"w":"Haj","a":"haj.ogg","e":"🦈"},
        {"w":"Fisk","a":"fisk.ogg","e":"🐟"},
        {"w":"Due","a":"due.ogg","e":"🕊️"},
        {"w":"Abe","a":"abe.ogg","e":"🐒"},
        {"w":"Måne","a":"måne.ogg","e":"🌙"},
        {"w":"Mad","a":"mad.ogg","e":"🍎"},
        {"w":"Øl","a":"øl.ogg","e":"🍺"},
        {"w":"Vin","a":"vin.ogg","e":"🍷"},
        {"w":"Ost","a":"ost.ogg","e":"🧀"},
        {"w":"Bær","a":"bær.ogg","e":"🍓"},
        {"w":"Salt","a":"salt.ogg","e":"🧂"},
        {"w":"Ris","a":"ris.ogg","e":"🍚"},
        {"w":"Ært","a":"ært.ogg","e":"🫛"},
        {"w":"Kål","a":"kål.ogg","e":"🥬"},
        {"w":"Løg","a":"løg.ogg","e":"🧅"},
        {"w":"Vand","a":"vand.ogg","e":"💧"},
        {"w":"Mælk","a":"mælk.ogg","e":"🥛"},
        {"w":"Kød","a":"kød.ogg","e":"🥩"},
        {"w":"Rug","a":"rug.ogg","e":"🍞"},
        {"w":"Sild","a":"sild.ogg","e":"🐟"},
        {"w":"Laks","a":"laks.ogg","e":"🍣"},
        {"w":"And","a":"and.ogg","e":"🦆"},
        {"w":"Gås","a":"gås.ogg","e":"🪿"},
        {"w":"Kiks","a":"kiks.ogg","e":"🍪"},
        {"w":"Kage","a":"kage.ogg","e":"🍰"},
        {"w":"Bil","a":"bil.ogg","e":"🚗"},
        {"w":"Tog","a":"tog.ogg","e":"🚂"},
        {"w":"Hus","a":"hus.ogg","e":"🏠"},
        {"w":"Dør","a":"dør.ogg","e":"🚪"},
        {"w":"Kop","a":"kop.ogg","e":"☕"},
        {"w":"Ske","a":"ske.ogg","e":"🥄"},
        {"w":"Kniv","a":"kniv.ogg","e":"🔪"},
        {"w":"Bog","a":"bog.ogg","e":"📖"},
        {"w":"Stol","a":"stol.ogg","e":"🪑"},
        {"w":"Seng","a":"seng.ogg","e":"🛏️"},
        {"w":"Sko","a":"sko.ogg","e":"👞"},
        {"w":"Mor","a":"mor.ogg","e":"👩"},
        {"w":"Far","a":"far.ogg","e":"👨"},
        {"w":"Barn","a":"barn.ogg","e":"👶"},
        {"w":"Pige","a":"pige.ogg","e":"👧"},
        {"w":"Dreng","a":"dreng.ogg","e":"👦"},
        {"w":"Fod","a":"fod.ogg","e":"🦶"},
        {"w":"Hånd","a":"hånd.ogg","e":"✋"},
        {"w":"Arm","a":"arm.ogg","e":"💪"},
        {"w":"Ben","a":"ben.ogg","e":"🦵"},
        {"w":"Mund","a":"mund.ogg","e":"👄"},
        {"w":"Næse","a":"næse.ogg","e":"👃"},
        {"w":"Øje","a":"øje.ogg","e":"👀"},
        {"w":"Øre","a":"øre.ogg","e":"👂"},
        {"w":"Læs","a":"læs.ogg","e":"📖"},
        {"w":"Skriv","a":"skriv.ogg","e":"✍️"},
        {"w":"Tegn","a":"tegn.ogg","e":"🎨"},
        {"w":"Køb","a":"køb.ogg","e":"🛍️"},
        {"w":"Leg","a":"leg.ogg","e":"🧸"},
        {"w":"Smil","a":"smil.ogg","e":"😊"},
        {"w":"Grin","a":"grin.ogg","e":"😂"},
        {"w":"Glad","a":"glad.ogg","e":"😊"},
        {"w":"Stor","a":"stor.ogg","e":"🐘"},
        {"w":"Lille","a":"lille.ogg","e":"🐭"},
        {"w":"Rød","a":"rød.ogg","e":"🟥"},
        {"w":"Blå","a":"blå.ogg","e":"🟦"},
        {"w":"Grøn","a":"grøn.ogg","e":"🟩"},
        {"w":"Sort","a":"sort.ogg","e":"⬛"},
        {"w":"Hvid","a":"hvid.ogg","e":"⬜"}
    ];
}