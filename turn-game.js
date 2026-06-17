const KID_FRIENDLY_EMOJIS = [
    "😀", "😄", "😁", "😊", "🤩", "😎", "🥳", "😺", "😸", "😻",
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐯", "🦁",
    "🦖", "🦕", "🐉", "🐲", "🦈", "🐊", "🦅", "🕷️", "🐺", "🦬",
    "🦋", "🐢", "🐙", "🐠", "🦀", "🐬", "🐳", "🦍", "🦏", "🦂",
    "🌈", "⭐", "🌟", "☀️", "🌙", "⚡", "🔥", "❄️", "🛡️", "⚔️",
    "🌻", "🍎", "🍓", "🍉", "🍌", "🍇", "🍒", "🍍", "🍕", "🍪",
    "🍩", "🍦", "🎂", "🍿", "⚽", "🏀", "🏈", "⚾", "🎯", "🥊",
    "🎮", "🕹️", "🚗", "🏎️", "🏍️", "🚂", "🚀", "🛸", "🤖", "🧲"
];

const MONKEY_GIFS = [
    "./img/monkey1.gif",
    "./img/monkey2.gif",
    "./img/monkey3.gif",
    "./img/monkey4.gif",
    "./img/monkey5.gif",
    "./img/monkey6.gif",
    "./img/monkey7.gif",
    "./img/monkey8.gif",
    "./img/monkey9.gif",
    "./img/monkey10.gif",
    "./img/monkey11.gif",
    "./img/monkey12.gif"
];

class TurnGame {
    constructor() {
        this.letterPool = "abcdefghijklmnopqrstuvwxyzæøå".split("");
        this.vowelPool = ["a", "e", "i", "o", "u", "y", "æ", "ø", "å"];
        this.letterWeightBoost = {
            a: 0.4,
            e: 0.4,
            i: 0.4,
            o: 0.4,
            ø: 0.4,
            m: 0.2,
            s: 0.2,
            p: 0.1,
            l: 0.1,
            f: 0.1,
            t: 0.1
        };
        this.boardEl = document.getElementById("board");
        this.statusText = document.getElementById("statusText");
        this.restartButton = document.getElementById("restartButton");
        this.winOverlay = document.getElementById("winOverlay");
        this.winStartButton = document.getElementById("winStartButton");
        this.winMonkeyImage = document.getElementById("winMonkeyImage");
        this.letterFeedbackRow = document.getElementById("letterFeedbackRow");
        this.confettiLayer = document.getElementById("confettiLayer");
        this.audioPlayer = document.getElementById("audioPlayer");

        this.firstCard = null;
        this.secondCard = null;
        this.isResolving = false;
        this.matchesFound = 0;
        this.confettiTimeout = null;
        this.winPopupTimeout = null;
        this.roundLetters = [];
        this.recentMonkeyGifs = [];
        this.feedbackAutoplayTimers = [];
        this.feedbackAutoplayStopped = false;
        this.flipAnimationDurationMs = 520;
        this.audioDelayMs = 300;
        this.audioPlayTimeout = null;

        this.init();
    }

    init() {
        this.restartButton.addEventListener("click", () => this.startNewGame());
        this.winStartButton.addEventListener("click", () => this.startNewGame());
        this.startNewGame();
    }

    startNewGame() {
        if (this.winPopupTimeout) {
            clearTimeout(this.winPopupTimeout);
            this.winPopupTimeout = null;
        }
        this.stopFeedbackAutoplay();
        this.hideWinPopup();
        this.firstCard = null;
        this.secondCard = null;
        this.isResolving = false;
        this.matchesFound = 0;
        this.setStatus("Tryk pa to kort og find et par.");

        const deck = this.createDeck();
        this.renderDeck(deck);
    }

    createDeck() {
        const vowelLetter = this.pickUnique(this.vowelPool, 1)[0];
        const remainingLetterPool = this.letterPool.filter((letter) => letter !== vowelLetter);
        const otherLetters = this.pickWeightedUniqueWithVowelLimit(
            remainingLetterPool,
            3,
            1,
            2
        );
        const pickedLetters = this.shuffle([vowelLetter, ...otherLetters]);
        const pickedEmojis = this.pickUnique(KID_FRIENDLY_EMOJIS, 2);
        const symbols = [...pickedLetters, ...pickedEmojis];
        this.roundLetters = [...pickedLetters];

        const pairDeck = [...symbols, ...symbols].map((symbol, index) => ({
            id: `${index}-${symbol}`,
            symbol,
            isEmoji: pickedEmojis.includes(symbol),
            matched: false
        }));

        return this.shuffle(pairDeck);
    }

    pickUnique(pool, count) {
        const picked = [];

        while (picked.length < count) {
            const value = pool[Math.floor(Math.random() * pool.length)];
            if (!picked.includes(value)) {
                picked.push(value);
            }
        }

        return picked;
    }

    pickWeightedUnique(pool, count) {
        const picked = [];
        const available = [...pool];

        while (picked.length < count && available.length > 0) {
            const totalWeight = available.reduce(
                (sum, letter) => sum + this.getLetterWeight(letter),
                0
            );

            let randomWeight = Math.random() * totalWeight;
            let selectedIndex = 0;

            for (let i = 0; i < available.length; i += 1) {
                randomWeight -= this.getLetterWeight(available[i]);
                if (randomWeight <= 0) {
                    selectedIndex = i;
                    break;
                }
            }

            const [selected] = available.splice(selectedIndex, 1);
            picked.push(selected);
        }

        return picked;
    }

    pickWeightedUniqueWithVowelLimit(pool, count, startingVowelCount, maxVowels) {
        const picked = [];
        const available = [...pool];
        let currentVowelCount = startingVowelCount;

        while (picked.length < count && available.length > 0) {
            const validCandidates = available.filter((letter) => {
                if (!this.vowelPool.includes(letter)) {
                    return true;
                }
                return currentVowelCount < maxVowels;
            });

            if (validCandidates.length === 0) {
                break;
            }

            const totalWeight = validCandidates.reduce(
                (sum, letter) => sum + this.getLetterWeight(letter),
                0
            );

            let randomWeight = Math.random() * totalWeight;
            let selected = validCandidates[0];

            for (let i = 0; i < validCandidates.length; i += 1) {
                randomWeight -= this.getLetterWeight(validCandidates[i]);
                if (randomWeight <= 0) {
                    selected = validCandidates[i];
                    break;
                }
            }

            picked.push(selected);
            const selectedIndex = available.indexOf(selected);
            if (selectedIndex >= 0) {
                available.splice(selectedIndex, 1);
            }

            if (this.vowelPool.includes(selected)) {
                currentVowelCount += 1;
            }
        }

        return picked;
    }

    getLetterWeight(letter) {
        const baseWeight = 1;
        const boost = this.letterWeightBoost[letter] || 0;
        return baseWeight + boost;
    }

    shuffle(items) {
        const array = [...items];
        for (let i = array.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    renderDeck(deck) {
        this.boardEl.innerHTML = "";

        deck.forEach((cardData) => {
            const cardButton = document.createElement("button");
            cardButton.type = "button";
            cardButton.className = "card-btn";
            cardButton.setAttribute("aria-label", "Flip card");
            cardButton.dataset.symbol = cardData.symbol;
            cardButton.dataset.isEmoji = cardData.isEmoji ? "true" : "false";
            cardButton.dataset.matched = cardData.matched ? "true" : "false";

            const card = document.createElement("span");
            card.className = "card";

            if (cardData.matched) {
                card.classList.add("matched", "flipped");
                cardButton.disabled = true;
                cardButton.setAttribute("aria-label", "Decorative tile");
            }

            const frontFace = document.createElement("span");
            frontFace.className = "face front";
            const frontInner = document.createElement("span");
            frontInner.className = "face-inner";
            frontFace.appendChild(frontInner);

            const backFace = document.createElement("span");
            backFace.className = "face back";
            const backInner = document.createElement("span");
            backInner.className = "face-inner";

            const center = document.createElement("span");
            center.className = "card-center";
            center.textContent = cardData.symbol;

            backInner.appendChild(center);
            backFace.appendChild(backInner);

            card.appendChild(frontFace);
            card.appendChild(backFace);
            cardButton.appendChild(card);

            if (!cardData.matched) {
                cardButton.addEventListener("click", () => this.handleCardClick(cardButton));
            }

            this.boardEl.appendChild(cardButton);
        });
    }

    handleCardClick(cardButton) {
        if (this.isResolving) {
            return;
        }

        if (cardButton.dataset.matched === "true") {
            return;
        }

        const card = cardButton.querySelector(".card");
        if (!card || card.classList.contains("flipped")) {
            return;
        }

        card.classList.add("flipped");
        cardButton.setAttribute("aria-label", "Card is showing letter");
        this.playLetterAudio(cardButton.dataset.symbol, cardButton.dataset.isEmoji === "true");

        if (!this.firstCard) {
            this.firstCard = cardButton;
            this.setStatus("Find det samme kort en gang til.");
            return;
        }

        this.secondCard = cardButton;
        this.isResolving = true;
        this.checkMatch();
    }

    checkMatch() {
        if (!this.firstCard || !this.secondCard) {
            this.resetTurn();
            return;
        }

        const symbolA = this.firstCard.dataset.symbol;
        const symbolB = this.secondCard.dataset.symbol;

        if (symbolA === symbolB) {
            const firstMatchedCard = this.firstCard;
            const secondMatchedCard = this.secondCard;

            this.markMatched(firstMatchedCard);
            this.markMatched(secondMatchedCard);
            this.matchesFound += 1;
            this.setStatus(`Flot! Du fandt parret '${symbolA}'.`);

            // Wait until both cards have visually completed the flip, then flash together.
            setTimeout(() => {
                this.flashMatchedPair(firstMatchedCard, secondMatchedCard);
            }, this.flipAnimationDurationMs);

            this.resetTurn();
            this.checkWin();
            return;
        }

        this.setStatus("Ikke et par, prov igen.");
        setTimeout(() => {
            this.flipBack(this.firstCard);
            this.flipBack(this.secondCard);
            this.resetTurn();
        }, 1100);
    }

    markMatched(cardButton) {
        const card = cardButton.querySelector(".card");
        if (card) {
            card.classList.add("matched");
        }
        cardButton.dataset.matched = "true";
        cardButton.disabled = true;
        cardButton.setAttribute("aria-label", "Matched letter card");
    }

    flashMatchedPair(firstCardButton, secondCardButton) {
        const cards = [firstCardButton, secondCardButton]
            .map((button) => button?.querySelector(".card"))
            .filter(Boolean);

        cards.forEach((card) => {
            card.classList.remove("pair-flash");
        });

        // Force one reflow before adding class back so both animations restart in sync.
        if (cards.length > 0) {
            void cards[0].offsetWidth;
        }

        cards.forEach((card) => {
            card.classList.add("pair-flash");

            setTimeout(() => {
                card.classList.remove("pair-flash");
            }, 900);
        });
    }

    flipBack(cardButton) {
        const card = cardButton.querySelector(".card");
        if (!card) {
            return;
        }
        card.classList.remove("flipped");
        cardButton.setAttribute("aria-label", "Flip card");
    }

    resetTurn() {
        this.firstCard = null;
        this.secondCard = null;
        this.isResolving = false;
    }

    checkWin() {
        if (this.matchesFound >= 6) {
            this.setStatus("Mega flot! Alle par fundet. Tryk Nyt spil.");
            this.winPopupTimeout = setTimeout(() => {
                this.winPopupTimeout = null;
                this.showWinPopup();
            }, 900);
        }
    }

    setStatus(message) {
        if (this.statusText) {
            this.statusText.textContent = message;
        }
    }

    showWinPopup() {
        this.setRandomMonkeyGif();
        this.renderLetterFeedbackRow();
        this.winOverlay.classList.add("show");
        this.winOverlay.setAttribute("aria-hidden", "false");
        this.winStartButton.focus();
        this.launchConfetti();
        this.startFeedbackAutoplay();
    }

    renderLetterFeedbackRow() {
        if (!this.letterFeedbackRow) {
            return;
        }

        this.letterFeedbackRow.innerHTML = "";

        this.roundLetters.forEach((letter) => {
            const letterButton = document.createElement("button");
            letterButton.type = "button";
            letterButton.className = "feedback-letter-btn";
            letterButton.textContent = letter;
            letterButton.dataset.letter = letter;
            letterButton.setAttribute("aria-label", `Play letter ${letter}`);

            letterButton.addEventListener("mouseenter", () => {
                this.stopFeedbackAutoplay();
                this.playLetterAudio(letter, false);
            });

            letterButton.addEventListener("focus", () => {
                this.playLetterAudio(letter, false);
            });

            letterButton.addEventListener("click", () => {
                this.playLetterAudio(letter, false);
            });

            this.letterFeedbackRow.appendChild(letterButton);
        });
    }

    startFeedbackAutoplay() {
        this.stopFeedbackAutoplay();
        this.feedbackAutoplayStopped = false;

        if (!this.letterFeedbackRow) {
            return;
        }

        const buttons = Array.from(this.letterFeedbackRow.querySelectorAll(".feedback-letter-btn"));
        if (buttons.length === 0) {
            return;
        }

        const runStep = (index) => {
            if (this.feedbackAutoplayStopped || index >= buttons.length) {
                return;
            }

            const button = buttons[index];
            const letter = button.dataset.letter;
            this.flashFeedbackLetter(button);
            this.playLetterAudio(letter, false);

            const nextTimer = setTimeout(() => {
                runStep(index + 1);
            }, 2000);
            this.feedbackAutoplayTimers.push(nextTimer);
        };

        const startTimer = setTimeout(() => {
            runStep(0);
        }, 2000);
        this.feedbackAutoplayTimers.push(startTimer);
    }

    stopFeedbackAutoplay() {
        this.feedbackAutoplayStopped = true;
        this.feedbackAutoplayTimers.forEach((timerId) => clearTimeout(timerId));
        this.feedbackAutoplayTimers = [];

        if (!this.letterFeedbackRow) {
            return;
        }

        const flashingButtons = this.letterFeedbackRow.querySelectorAll(".feedback-letter-btn.auto-flash");
        flashingButtons.forEach((button) => button.classList.remove("auto-flash"));
    }

    flashFeedbackLetter(button) {
        button.classList.remove("auto-flash");
        void button.offsetWidth;
        button.classList.add("auto-flash");

        const cleanupTimer = setTimeout(() => {
            button.classList.remove("auto-flash");
        }, 620);
        this.feedbackAutoplayTimers.push(cleanupTimer);
    }

    setRandomMonkeyGif() {
        if (!this.winMonkeyImage) {
            return;
        }

        const availableGifs = MONKEY_GIFS.filter(
            (gifPath) => !this.recentMonkeyGifs.includes(gifPath)
        );

        const sourcePool = availableGifs.length > 0 ? availableGifs : MONKEY_GIFS;
        const randomIndex = Math.floor(Math.random() * sourcePool.length);
        const selectedGif = sourcePool[randomIndex];

        this.winMonkeyImage.src = selectedGif;

        this.recentMonkeyGifs.push(selectedGif);
        if (this.recentMonkeyGifs.length > 3) {
            this.recentMonkeyGifs.shift();
        }
    }

    hideWinPopup() {
        this.winOverlay.classList.remove("show");
        this.winOverlay.setAttribute("aria-hidden", "true");
        this.stopFeedbackAutoplay();
        this.clearConfetti();
    }

    launchConfetti() {
        this.clearConfetti();

        const colors = ["#ff5d73", "#ffd447", "#45cf8a", "#4ca7ff", "#ff9f40", "#be7bff"];
        const pieces = 140;

        for (let i = 0; i < pieces; i += 1) {
            const piece = document.createElement("span");
            piece.className = "confetti";
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDuration = `${3 + Math.random() * 2.2}s`;
            piece.style.animationDelay = `${Math.random() * 0.4}s`;
            piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 180}px`);
            this.confettiLayer.appendChild(piece);
        }

        this.confettiTimeout = setTimeout(() => {
            this.clearConfetti();
        }, 6500);
    }

    clearConfetti() {
        if (this.confettiTimeout) {
            clearTimeout(this.confettiTimeout);
            this.confettiTimeout = null;
        }
        this.confettiLayer.innerHTML = "";
    }

    playLetterAudio(symbol, isEmoji) {
        if (!symbol || isEmoji || !this.letterPool.includes(symbol)) {
            return;
        }

        if (this.audioPlayTimeout) {
            clearTimeout(this.audioPlayTimeout);
            this.audioPlayTimeout = null;
        }

        this.audioPlayTimeout = setTimeout(() => {
            this.audioPlayTimeout = null;
            this.audioPlayer.src = `./audio-alphabet/${symbol}.ogg`;
            this.audioPlayer.currentTime = 0;
            this.audioPlayer.play().catch((error) => {
                console.log("Audio playback failed:", error);
            });
        }, this.audioDelayMs);
    }
}

new TurnGame();
