class LetterQuest {
    constructor() {
        this.letters = 'abcdefghijklmnopqrstuvwxyzæøå'.split('');
        this.numbers = '0123456789'.split('');
        this.allCharacters = [...this.letters, ...this.numbers];
        this.vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'æ', 'ø', 'å'];
        
        this.currentCharacter = null;
        this.caseMode = 'both'; // 'both' | 'upper' | 'lower'
        this.successCount = 0;
        this.totalAttempts = 0;
        this.streakCount = 0;
        
        this.audioPlayer = document.getElementById('audioPlayer');
        this.letterDisplay = document.getElementById('letterDisplay');
        this.feedback = document.getElementById('feedback');
        this.successCountEl = document.getElementById('successCount');
        this.totalCountEl = document.getElementById('totalCount');
        this.toggleCaseBtn = document.getElementById('toggleCase');
        this.progressFill = document.getElementById('progressFill');
        this.stickersEl = document.getElementById('stickers');
        
        this.init();
    }
    
    init() {
        this.toggleCaseBtn.addEventListener('click', () => this.toggleCase());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.nextCharacter();
    }
    
    nextCharacter() {
        const randomIndex = Math.floor(Math.random() * this.allCharacters.length);
        this.currentCharacter = this.allCharacters[randomIndex];
        this.displayCharacter();
        this.clearFeedback();
    }
    
    displayCharacter() {
        this.letterDisplay.className = 'letter-display';

        if (this.vowels.includes(this.currentCharacter.toLowerCase())) {
            this.letterDisplay.classList.add('vowel');
        } else if (this.letters.includes(this.currentCharacter.toLowerCase())) {
            this.letterDisplay.classList.add('consonant');
        } else {
            this.letterDisplay.classList.add('number');
        }

        if (this.caseMode === 'both' && this.numbers.includes(this.currentCharacter)) {
            this.letterDisplay.textContent = this.currentCharacter;
        } else if (this.caseMode === 'both') {
            this.letterDisplay.classList.add('both');
            this.letterDisplay.innerHTML =
                `<span>${this.currentCharacter.toUpperCase()}</span>` +
                `<span>${this.currentCharacter.toLowerCase()}</span>`;
        } else {
            const displayChar = this.caseMode === 'upper'
                ? this.currentCharacter.toUpperCase()
                : this.currentCharacter.toLowerCase();
            this.letterDisplay.textContent = displayChar;
        }
    }
    
    handleKeyPress(event) {
        const pressedKey = event.key.toLowerCase();
        
        if (pressedKey === this.currentCharacter.toLowerCase()) {
            this.handleSuccess();
        } else if (pressedKey.length === 1) {
            this.handleError();
        }
    }
    
    handleSuccess() {
        this.successCount++;
        this.totalAttempts++;
        this.streakCount++;
        
        this.updateScore();
        this.showFeedback('Great! 🌟', 'success');
        this.playAudio(this.currentCharacter.toLowerCase());
        this.updateProgress();
        
        if (this.streakCount % 5 === 0) {
            this.addSticker();
            this.celebrate();
        }
        
        setTimeout(() => {
            this.nextCharacter();
        }, 2000);
    }
    
    handleError() {
        this.totalAttempts++;
        this.updateScore();
        this.showFeedback('Try again 🔄', 'error');
        this.playErrorSound();
    }
    
    showFeedback(message, type) {
        this.feedback.textContent = message;
        this.feedback.className = `feedback ${type}`;
    }
    
    clearFeedback() {
        setTimeout(() => {
            this.feedback.textContent = '';
            this.feedback.className = 'feedback';
        }, 500);
    }
    
    playAudio(character) {
        const audioFile = `./audio-alphabet/${character}.ogg`;
        this.audioPlayer.src = audioFile;
        this.audioPlayer.play().catch(err => {
            console.log('Audio playback failed:', err);
        });
    }
    
    playErrorSound() {
        const errorBeep = new AudioContext();
        const oscillator = errorBeep.createOscillator();
        const gainNode = errorBeep.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(errorBeep.destination);
        
        oscillator.frequency.value = 200;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, errorBeep.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, errorBeep.currentTime + 0.3);
        
        oscillator.start(errorBeep.currentTime);
        oscillator.stop(errorBeep.currentTime + 0.3);
    }
    
    updateScore() {
        this.successCountEl.textContent = this.successCount;
        this.totalCountEl.textContent = this.totalAttempts;
    }
    
    updateProgress() {
        const progressPercent = (this.streakCount % 5) * 20;
        this.progressFill.style.width = `${progressPercent}%`;
    }
    
    addSticker() {
        const stickers = ['⭐', '🎉', '🏆', '🎨', '🌈', '🦄', '🎪', '🎯'];
        const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
        
        const stickerEl = document.createElement('span');
        stickerEl.className = 'sticker';
        stickerEl.textContent = randomSticker;
        this.stickersEl.appendChild(stickerEl);
        
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
    
    toggleCase() {
        const cycle = { both: 'upper', upper: 'lower', lower: 'both' };
        this.caseMode = cycle[this.caseMode];

        const nextLabel = {
            both:  'Switch to Uppercase only',
            upper: 'Switch to Lowercase only',
            lower: 'Switch to Uppercase & Lowercase'
        };
        this.toggleCaseBtn.textContent = nextLabel[this.caseMode];
        this.displayCharacter();
    }
}

const game = new LetterQuest();
