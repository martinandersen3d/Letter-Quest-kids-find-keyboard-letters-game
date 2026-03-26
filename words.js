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
        this.audioPlayer.src = `./audio-word/${filename}`;
        this.audioPlayer.play().catch(err => console.log('Audio playback failed:', err));
    }

    playLetterAudio(character) {
        this.audioPlayer.src = `./audio-alphabet/${character.toLowerCase()}.ogg`;
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
        tiles[this.currentLetterIndex].classList.remove('active');
        tiles[this.currentLetterIndex].classList.add('done');

        this.currentLetterIndex++;

        if (this.currentLetterIndex >= entry.w.length) {
            this.addSticker();
            if (this.streakCount % 5 === 0) {
                this.celebrate();
            }
            setTimeout(() => {
                this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
                this.showWord();
            }, 1000);
        } else {
            tiles[this.currentLetterIndex].classList.add('active');
        }
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
        {"w":"Ko","a":"ko.ogg","e":"🐄"},
        {"w":"Bi","a":"bi.ogg","e":"🐝"},
        {"w":"Is","a":"is.ogg","e":"❄️"},
        {"w":"Å","a":"å.ogg","e":"🌊"},
        {"w":"Sø","a":"sø.ogg","e":"💧"},
        {"w":"Ry","a":"ry.ogg","e":"🌳"},
        {"w":"Bo","a":"bo.ogg","e":"🏠"},
        {"w":"Eg","a":"eg.ogg","e":"🌳"},
        {"w":"Te","a":"te.ogg","e":"☕️"},
        {"w":"My","a":"my.ogg","e":"🐜"},
        {"w":"Sol","a":"sol.ogg","e":"☀️"},
        {"w":"Sky","a":"sky.ogg","e":"☁️"},
        {"w":"Hav","a":"hav.ogg","e":"🌊"},
        {"w":"Mus","a":"mus.ogg","e":"🐭"},
        {"w":"Kat","a":"kat.ogg","e":"🐱"},
        {"w":"Hund","a":"hund.ogg","e":"🐶"},
        {"w":"Ulv","a":"ulv.ogg","e":"🐺"},
        {"w":"Fugl","a":"fugl.ogg","e":"🐦"},
        {"w":"Æg","a":"æg.ogg","e":"🥚"},
        {"w":"Frø","a":"frø.ogg","e":"🐸"},
        {"w":"Gris","a":"gris.ogg","e":"🐷"},
        {"w":"Lam","a":"lam.ogg","e":"🐑"},
        {"w":"Ged","a":"ged.ogg","e":"🐐"},
        {"w":"Ræv","a":"ræv.ogg","e":"🦊"},
        {"w":"Bjørn","a":"bjørn.ogg","e":"🐻"},
        {"w":"Elg","a":"elg.ogg","e":"🫎"},
        {"w":"Sæl","a":"sæl.ogg","e":"🦭"},
        {"w":"Haj","a":"haj.ogg","e":"🦈"},
        {"w":"Fisk","a":"fisk.ogg","e":"🐟"},
        {"w":"Due","a":"due.ogg","e":"🕊️"},
        {"w":"Abe","a":"abe.ogg","e":"🐒"},
        {"w":"Måne","a":"måne.ogg","e":"🌙"},
        {"w":"Ø","a":"ø.ogg","e":"🏝️"},
        {"w":"Ask","a":"ask.ogg","e":"🌳"},
        {"w":"Pil","a":"pil.ogg","e":"🌿"},
        {"w":"Siv","a":"siv.ogg","e":"🌾"},
        {"w":"Mose","a":"mose.ogg","e":"🌫️"},
        {"w":"Krat","a":"krat.ogg","e":"🌿"},
        {"w":"Eng","a":"eng.ogg","e":"🌻"},
        {"w":"Bak","a":"bak.ogg","e":"⛰️"},
        {"w":"Mad","a":"mad.ogg","e":"🍎"},
        {"w":"Øl","a":"øl.ogg","e":"🍺"},
        {"w":"Vin","a":"vin.ogg","e":"🍷"},
        {"w":"Ost","a":"ost.ogg","e":"🧀"},
        {"w":"Bær","a":"bær.ogg","e":"🍓"},
        {"w":"Sød","a":"sød.ogg","e":"🍬"},
        {"w":"Sur","a":"sur.ogg","e":"🍋"},
        {"w":"Salt","a":"salt.ogg","e":"🧂"},
        {"w":"Ris","a":"ris.ogg","e":"🍚"},
        {"w":"Ært","a":"ært.ogg","e":"🫛"},
        {"w":"Kål","a":"kål.ogg","e":"🥬"},
        {"w":"Løg","a":"løg.ogg","e":"🧅"},
        {"w":"Mel","a":"mel.ogg","e":"🌾"},
        {"w":"Saft","a":"saft.ogg","e":"🥤"},
        {"w":"Vand","a":"vand.ogg","e":"💧"},
        {"w":"Mælk","a":"mælk.ogg","e":"🥛"},
        {"w":"Kød","a":"kød.ogg","e":"🥩"},
        {"w":"Fed","a":"fed.ogg","e":"🧈"},
        {"w":"Rug","a":"rug.ogg","e":"🍞"},
        {"w":"Gær","a":"gær.ogg","e":"🍞"},
        {"w":"Sir","a":"sir.ogg","e":"🍯"},
        {"w":"Bøn","a":"bøn.ogg","e":"🫘"},
        {"w":"Bud","a":"bud.ogg","e":"🍮"},
        {"w":"Kar","a":"kar.ogg","e":"🍲"},
        {"w":"Mos","a":"mos.ogg","e":"🥣"},
        {"w":"Grød","a":"grød.ogg","e":"🥣"},
        {"w":"Sild","a":"sild.ogg","e":"🐟"},
        {"w":"Laks","a":"laks.ogg","e":"🍣"},
        {"w":"And","a":"and.ogg","e":"🦆"},
        {"w":"Gås","a":"gås.ogg","e":"🪿"},
        {"w":"Chok","a":"chok.ogg","e":"🍫"},
        {"w":"Kiks","a":"kiks.ogg","e":"🍪"},
        {"w":"Kage","a":"kage.ogg","e":"🍰"},
        {"w":"Bolle","a":"bolle.ogg","e":"🥯"},
        {"w":"Smør","a":"smør.ogg","e":"🧈"},
        {"w":"Olie","a":"olie.ogg","e":"🫗"},
        {"w":"Bil","a":"bil.ogg","e":"🚗"},
        {"w":"Tog","a":"tog.ogg","e":"🚂"},
        {"w":"Hus","a":"hus.ogg","e":"🏠"},
        {"w":"Dør","a":"dør.ogg","e":"🚪"},
        {"w":"Mur","a":"mur.ogg","e":"🧱"},
        {"w":"Glas","a":"glas.ogg","e":"🍷"},
        {"w":"Kop","a":"kop.ogg","e":"☕"},
        {"w":"Ske","a":"ske.ogg","e":"🥄"},
        {"w":"Kniv","a":"kniv.ogg","e":"🔪"},
        {"w":"Ur","a":"ur.ogg","e":"⌚"},
        {"w":"Bog","a":"bog.ogg","e":"📖"},
        {"w":"Stol","a":"stol.ogg","e":"🪑"},
        {"w":"Seng","a":"seng.ogg","e":"🛏️"},
        {"w":"Dyne","a":"dyne.ogg","e":"🛌"},
        {"w":"Pude","a":"pude.ogg","e":"🛌"},
        {"w":"Kam","a":"kam.ogg","e":"🪮"},
        {"w":"Sæbe","a":"sæbe.ogg","e":"🧼"},
        {"w":"Tand","a":"tand.ogg","e":"🦷"},
        {"w":"Sko","a":"sko.ogg","e":"👞"},
        {"w":"Hue","a":"hue.ogg","e":"🧶"},
        {"w":"Net","a":"net.ogg","e":"🕸️"},
        {"w":"Snor","a":"snor.ogg","e":"🧵"},
        {"w":"Nål","a":"nål.ogg","e":"🪡"},
        {"w":"Lim","a":"lim.ogg","e":"🧴"},
        {"w":"Bly","a":"bly.ogg","e":"✏️"},
        {"w":"Pen","a":"pen.ogg","e":"🖊️"},
        {"w":"Ark","a":"ark.ogg","e":"📄"},
        {"w":"Task","a":"task.ogg","e":"💼"},
        {"w":"Bold","a":"bold.ogg","e":"⚽"},
        {"w":"Spil","a":"spil.ogg","e":"🎲"},
        {"w":"Duk","a":"duk.ogg","e":"🪆"},
        {"w":"Båd","a":"båd.ogg","e":"⛵"},
        {"w":"Skib","a":"skib.ogg","e":"🚢"},
        {"w":"Fly","a":"fly.ogg","e":"✈️"},
        {"w":"Gulv","a":"gulv.ogg","e":"🪵"},
        {"w":"Mor","a":"mor.ogg","e":"👩"},
        {"w":"Far","a":"far.ogg","e":"👨"},
        {"w":"Barn","a":"barn.ogg","e":"👶"},
        {"w":"Dreng","a":"dreng.ogg","e":"👦"},
        {"w":"Pige","a":"pige.ogg","e":"👧"},
        {"w":"Mand","a":"mand.ogg","e":"👨"},
        {"w":"Kone","a":"kone.ogg","e":"👩"},
        {"w":"Ven","a":"ven.ogg","e":"🤝"},
        {"w":"Navn","a":"navn.ogg","e":"🏷️"},
        {"w":"Fod","a":"fod.ogg","e":"🦶"},
        {"w":"Hånd","a":"hånd.ogg","e":"✋"},
        {"w":"Arm","a":"arm.ogg","e":"💪"},
        {"w":"Ben","a":"ben.ogg","e":"🦵"},
        {"w":"Knæ","a":"knæ.ogg","e":"🦵"},
        {"w":"Mund","a":"mund.ogg","e":"👄"},
        {"w":"Næse","a":"næse.ogg","e":"👃"},
        {"w":"Øje","a":"øje.ogg","e":"👀"},
        {"w":"Øre","a":"øre.ogg","e":"👂"},
        {"w":"Hår","a":"hår.ogg","e":"💇"},
        {"w":"Ryg","a":"ryg.ogg","e":"🧍"},
        {"w":"Mave","a":"mave.ogg","e":"🫄"},
        {"w":"Blod","a":"blod.ogg","e":"🩸"},
        {"w":"Hud","a":"hud.ogg","e":"🖐️"},
        {"w":"Kind","a":"kind.ogg","e":"😊"},
        {"w":"Hals","a":"hals.ogg","e":"🧣"},
        {"w":"Bryst","a":"bryst.ogg","e":"👕"},
        {"w":"Fing","a":"fing.ogg","e":"🖐️"},
        {"w":"Negl","a":"negl.ogg","e":"💅"},
        {"w":"Tå","a":"tå.ogg","e":"🦶"},
        {"w":"Se","a":"se.ogg","e":"👀"},
        {"w":"Gå","a":"gå.ogg","e":"🚶"},
        {"w":"Løb","a":"løb.ogg","e":"🏃"},
        {"w":"Hop","a":"hop.ogg","e":"🦘"},
        {"w":"Syng","a":"syng.ogg","e":"🎤"},
        {"w":"Dans","a":"dans.ogg","e":"💃"},
        {"w":"Sov","a":"sov.ogg","e":"😴"},
        {"w":"Spis","a":"spis.ogg","e":"🍴"},
        {"w":"Drik","a":"drik.ogg","e":"🥛"},
        {"w":"Læs","a":"læs.ogg","e":"📖"},
        {"w":"Skriv","a":"skriv.ogg","e":"✍️"},
        {"w":"Tegn","a":"tegn.ogg","e":"🎨"},
        {"w":"Mal","a":"mal.ogg","e":"🖌️"},
        {"w":"Køb","a":"køb.ogg","e":"🛍️"},
        {"w":"Sælg","a":"sælg.ogg","e":"💰"},
        {"w":"Giv","a":"giv.ogg","e":"🎁"},
        {"w":"Kom","a":"kom.ogg","e":"🏃"},
        {"w":"Flyv","a":"flyv.ogg","e":"✈️"},
        {"w":"Svøm","a":"svøm.ogg","e":"🏊"},
        {"w":"Kør","a":"kør.ogg","e":"🚗"},
        {"w":"Leg","a":"leg.ogg","e":"🧸"},
        {"w":"Vind","a":"vind.ogg","e":"🏆"},
        {"w":"Tab","a":"tab.ogg","e":"📉"},
        {"w":"Smil","a":"smil.ogg","e":"😊"},
        {"w":"Græd","a":"græd.ogg","e":"😢"},
        {"w":"Grin","a":"grin.ogg","e":"😂"},
        {"w":"Skrig","a":"skrig.ogg","e":"😱"},
        {"w":"Glad","a":"glad.ogg","e":"😊"},
        {"w":"Ja","a":"ja.ogg","e":"✅"},
        {"w":"Nej","a":"nej.ogg","e":"❌"},
        {"w":"God","a":"god.ogg","e":"👍"},
        {"w":"Ond","a":"ond.ogg","e":"😈"},
        {"w":"Stor","a":"stor.ogg","e":"🐘"},
        {"w":"Lille","a":"lille.ogg","e":"🐭"},
        {"w":"Ny","a":"ny.ogg","e":"✨"},
        {"w":"Gammel","a":"gammel.ogg","e":"👴"},
        {"w":"Rød","a":"rød.ogg","e":"🟥"},
        {"w":"Blå","a":"blå.ogg","e":"🟦"},
        {"w":"Gul","a":"gul.ogg","e":"🟨"},
        {"w":"Grøn","a":"grøn.ogg","e":"🟩"},
        {"w":"Sort","a":"sort.ogg","e":"⬛"},
        {"w":"Hvid","a":"hvid.ogg","e":"⬜"}
    ];
}

