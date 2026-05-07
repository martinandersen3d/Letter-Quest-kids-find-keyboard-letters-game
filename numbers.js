class WordsQuest {
    constructor() {
        this.words = [];
        this.currentWordIndex = 0;
        this.currentLetterIndex = 0;
        this.successCount = 0;
        this.totalAttempts = 0;
        this.streakCount = 0;

        this.audioPlayer = document.getElementById('audioPlayer');
        this.emojiDisplay = document.getElementById('emojiDisplay');
        this.wordDisplay  = document.getElementById('wordDisplay');
        this.feedback     = document.getElementById('feedback');
        this.successCountEl = document.getElementById('successCount');
        this.totalCountEl   = document.getElementById('totalCount');
        this.progressFill   = document.getElementById('progressFill');
        this.stickersEl     = document.getElementById('stickers');

        this.loadWords();
    }

    loadWords() {
        this.words = getWordData();
        this.shuffleWords();
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.showWord();
    }

    shuffleWords() {
        for (let i = this.words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
        }
    }

    showWord() {
        const entry = this.words[this.currentWordIndex];
        this.currentLetterIndex = 0;

        this.emojiDisplay.textContent = entry.e;

        this.wordDisplay.innerHTML = '';
        for (let i = 0; i < entry.w.length; i++) {
            const ch = entry.w[i];
            const tile = document.createElement('div');
            tile.className = 'letter-tile' + (i === 0 ? ' active' : '');
            tile.dataset.index = i;

            const upper = document.createElement('div');
            upper.className = 'letter-upper';
            upper.textContent = ch.toUpperCase();

            const lower = document.createElement('div');
            lower.className = 'letter-lower';
            lower.textContent = ch.toLowerCase();

            tile.appendChild(upper);
            tile.appendChild(lower);
            this.wordDisplay.appendChild(tile);
        }

        this.playWordAudio(entry.a);
        this.clearFeedback();
    }

    playWordAudio(filename) {
        this.audioPlayer.src = `./audio-numbers/${filename}`;
        this.audioPlayer.play().catch(err => console.log('Audio playback failed:', err));
    }

    playLetterAudio(character) {
        this.audioPlayer.src = `./audio-numbers/${character.toLowerCase()}.ogg`;
        this.audioPlayer.play().catch(err => console.log('Audio playback failed:', err));
    }

    handleKeyPress(event) {
        if (event.repeat) return;
        const pressed = event.key.toLowerCase();
        if (pressed.length !== 1) return;

        const entry = this.words[this.currentWordIndex];
        const expected = entry.w[this.currentLetterIndex].toLowerCase();

        if (pressed === expected) {
            this.handleSuccess();
        } else {
            this.handleError();
        }
    }

    handleSuccess() {
        const entry = this.words[this.currentWordIndex];
        const letter = entry.w[this.currentLetterIndex];

        this.playLetterAudio(letter);
        this.totalAttempts++;
        this.successCount++;
        this.streakCount++;
        this.updateScore();
        this.showFeedback('🌟', 'success');
        this.updateProgress();

        const tiles = this.wordDisplay.querySelectorAll('.letter-tile');
        const idx = this.currentLetterIndex;

        tiles[idx].classList.add('flash');
        setTimeout(() => tiles[idx].classList.remove('flash'), 500);

        setTimeout(() => {
            tiles[idx].classList.remove('active');
            tiles[idx].classList.add('done');

            this.currentLetterIndex++;

            if (this.currentLetterIndex >= entry.w.length) {
                this.addSticker();
                if (this.streakCount % 5 === 0) {
                    this.celebrate();
                }
                setTimeout(() => {
                    this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
                    this.showWord();
                }, 1250);
            } else {
                tiles[this.currentLetterIndex].classList.add('active');
            }
        }, 600);
    }

    handleError() {
        this.totalAttempts++;
        this.updateScore();
        this.showFeedback('🔄', 'error');
        this.playErrorSound();
    }

    showFeedback(message, type) {
        this.feedback.textContent = message;
        this.feedback.className = `feedback ${type}`;
    }

    clearFeedback() {
        this.feedback.textContent = '';
        this.feedback.className = 'feedback';
    }

    playErrorSound() {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 200;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    }

    updateScore() {
        this.successCountEl.textContent = this.successCount;
        this.totalCountEl.textContent   = this.totalAttempts;
    }

    updateProgress() {
        const progressPercent = (this.streakCount % 5) * 20;
        this.progressFill.style.width = `${progressPercent}%`;
    }

    addSticker() {
        const stickers = ['⭐', '🎉', '🏆', '🎨', '🌈', '🦄', '🎪', '🎯'];
        const el = document.createElement('span');
        el.className = 'sticker';
        el.textContent = stickers[Math.floor(Math.random() * stickers.length)];
        this.stickersEl.appendChild(el);
        this.progressFill.style.width = '0%';
    }

    celebrate() {
        const celebrationDiv = document.createElement('div');
        celebrationDiv.className = 'celebration';
        document.body.appendChild(celebrationDiv);

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
                celebrationDiv.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }

        setTimeout(() => celebrationDiv.remove(), 4000);
    }
}

const game = new WordsQuest();

function getWordData() {
    return [
        {"w":"0", "a":"0.ogg", "e":""},
        {"w":"1", "a":"1.ogg", "e":""},
        {"w":"2", "a":"2.ogg", "e":""},
        {"w":"3", "a":"3.ogg", "e":""},
        {"w":"4", "a":"4.ogg", "e":""},
        {"w":"5", "a":"5.ogg", "e":""},
        {"w":"6", "a":"6.ogg", "e":""},
        {"w":"7", "a":"7.ogg", "e":""},
        {"w":"8", "a":"8.ogg", "e":""},
        {"w":"9", "a":"9.ogg", "e":""},
        {"w":"10", "a":"10.ogg", "e":""},
        {"w":"11", "a":"11.ogg", "e":""},
        {"w":"12", "a":"12.ogg", "e":""},
        {"w":"13", "a":"13.ogg", "e":""},
        {"w":"14", "a":"14.ogg", "e":""},
        {"w":"15", "a":"15.ogg", "e":""},
        {"w":"16", "a":"16.ogg", "e":""},
        {"w":"17", "a":"17.ogg", "e":""},
        {"w":"18", "a":"18.ogg", "e":""},
        {"w":"19", "a":"19.ogg", "e":""},
        {"w":"20", "a":"20.ogg", "e":""},
        {"w":"21", "a":"21.ogg", "e":""},
        {"w":"22", "a":"22.ogg", "e":""},
        {"w":"23", "a":"23.ogg", "e":""},
        {"w":"24", "a":"24.ogg", "e":""},
        {"w":"25", "a":"25.ogg", "e":""},
        {"w":"26", "a":"26.ogg", "e":""},
        {"w":"27", "a":"27.ogg", "e":""},
        {"w":"28", "a":"28.ogg", "e":""},
        {"w":"29", "a":"29.ogg", "e":""},
        {"w":"30", "a":"30.ogg", "e":""},
        {"w":"31", "a":"31.ogg", "e":""},
        {"w":"32", "a":"32.ogg", "e":""},
        {"w":"33", "a":"33.ogg", "e":""},
        {"w":"34", "a":"34.ogg", "e":""},
        {"w":"35", "a":"35.ogg", "e":""},
        {"w":"36", "a":"36.ogg", "e":""},
        {"w":"37", "a":"37.ogg", "e":""},
        {"w":"38", "a":"38.ogg", "e":""},
        {"w":"39", "a":"39.ogg", "e":""},
        {"w":"40", "a":"40.ogg", "e":""},
        {"w":"41", "a":"41.ogg", "e":""},
        {"w":"42", "a":"42.ogg", "e":""},
        {"w":"43", "a":"43.ogg", "e":""},
        {"w":"44", "a":"44.ogg", "e":""},
        {"w":"45", "a":"45.ogg", "e":""},
        {"w":"46", "a":"46.ogg", "e":""},
        {"w":"47", "a":"47.ogg", "e":""},
        {"w":"48", "a":"48.ogg", "e":""},
        {"w":"49", "a":"49.ogg", "e":""},
        {"w":"50", "a":"50.ogg", "e":""},
        {"w":"51", "a":"51.ogg", "e":""},
        {"w":"52", "a":"52.ogg", "e":""},
        {"w":"53", "a":"53.ogg", "e":""},
        {"w":"54", "a":"54.ogg", "e":""},
        {"w":"55", "a":"55.ogg", "e":""},
        {"w":"56", "a":"56.ogg", "e":""},
        {"w":"57", "a":"57.ogg", "e":""},
        {"w":"58", "a":"58.ogg", "e":""},
        {"w":"59", "a":"59.ogg", "e":""},
        {"w":"60", "a":"60.ogg", "e":""},
        {"w":"61", "a":"61.ogg", "e":""},
        {"w":"62", "a":"62.ogg", "e":""},
        {"w":"63", "a":"63.ogg", "e":""},
        {"w":"64", "a":"64.ogg", "e":""},
        {"w":"65", "a":"65.ogg", "e":""},
        {"w":"66", "a":"66.ogg", "e":""},
        {"w":"67", "a":"67.ogg", "e":""},
        {"w":"68", "a":"68.ogg", "e":""},
        {"w":"69", "a":"69.ogg", "e":""},
        {"w":"70", "a":"70.ogg", "e":""},
        {"w":"71", "a":"71.ogg", "e":""},
        {"w":"72", "a":"72.ogg", "e":""},
        {"w":"73", "a":"73.ogg", "e":""},
        {"w":"74", "a":"74.ogg", "e":""},
        {"w":"75", "a":"75.ogg", "e":""},
        {"w":"76", "a":"76.ogg", "e":""},
        {"w":"77", "a":"77.ogg", "e":""},
        {"w":"78", "a":"78.ogg", "e":""},
        {"w":"79", "a":"79.ogg", "e":""},
        {"w":"80", "a":"80.ogg", "e":""},
        {"w":"81", "a":"81.ogg", "e":""},
        {"w":"82", "a":"82.ogg", "e":""},
        {"w":"83", "a":"83.ogg", "e":""},
        {"w":"84", "a":"84.ogg", "e":""},
        {"w":"85", "a":"85.ogg", "e":""},
        {"w":"86", "a":"86.ogg", "e":""},
        {"w":"87", "a":"87.ogg", "e":""},
        {"w":"88", "a":"88.ogg", "e":""},
        {"w":"89", "a":"89.ogg", "e":""},
        {"w":"90", "a":"90.ogg", "e":""},
        {"w":"91", "a":"91.ogg", "e":""},
        {"w":"92", "a":"92.ogg", "e":""},
        {"w":"93", "a":"93.ogg", "e":""},
        {"w":"94", "a":"94.ogg", "e":""},
        {"w":"95", "a":"95.ogg", "e":""},
        {"w":"96", "a":"96.ogg", "e":""},
        {"w":"97", "a":"97.ogg", "e":""},
        {"w":"98", "a":"98.ogg", "e":""},
        {"w":"99", "a":"99.ogg", "e":""}
    ];
}

