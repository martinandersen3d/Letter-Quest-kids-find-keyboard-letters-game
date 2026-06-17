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

class TurnGame {
    constructor() {
        this.letterPool = "abcdefghijklmnopqrstuvwxyzæøå".split("");
        this.boardEl = document.getElementById("board");
        this.statusText = document.getElementById("statusText");
        this.restartButton = document.getElementById("restartButton");
        this.winOverlay = document.getElementById("winOverlay");
        this.winStartButton = document.getElementById("winStartButton");
        this.confettiLayer = document.getElementById("confettiLayer");
        this.audioPlayer = document.getElementById("audioPlayer");

        this.firstCard = null;
        this.secondCard = null;
        this.isResolving = false;
        this.matchesFound = 0;
        this.confettiTimeout = null;

        this.init();
    }

    init() {
        this.restartButton.addEventListener("click", () => this.startNewGame());
        this.winStartButton.addEventListener("click", () => this.startNewGame());
        this.startNewGame();
    }

    startNewGame() {
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
        const pickedLetters = this.pickUnique(this.letterPool, 4);
        const pickedEmojis = this.pickUnique(KID_FRIENDLY_EMOJIS, 2);
        const symbols = [...pickedLetters, ...pickedEmojis];

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
            this.markMatched(this.firstCard);
            this.markMatched(this.secondCard);
            this.matchesFound += 1;
            this.setStatus(`Flot! Du fandt parret '${symbolA}'.`);
            this.resetTurn();
            this.checkWin();
            return;
        }

        this.setStatus("Ikke et par, prov igen.");
        setTimeout(() => {
            this.flipBack(this.firstCard);
            this.flipBack(this.secondCard);
            this.resetTurn();
        }, 800);
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
            this.showWinPopup();
        }
    }

    setStatus(message) {
        if (this.statusText) {
            this.statusText.textContent = message;
        }
    }

    showWinPopup() {
        this.winOverlay.classList.add("show");
        this.winOverlay.setAttribute("aria-hidden", "false");
        this.winStartButton.focus();
        this.launchConfetti();
    }

    hideWinPopup() {
        this.winOverlay.classList.remove("show");
        this.winOverlay.setAttribute("aria-hidden", "true");
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

        this.audioPlayer.src = `./audio-alphabet/${symbol}.ogg`;
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play().catch((error) => {
            console.log("Audio playback failed:", error);
        });
    }
}

new TurnGame();
