'use strict';

const LETTERS    = 'abcdefghijklmnopqrstuvwxyzæøå'.split('');
const WORLD_W    = 14000;
const STEP       = 6;     // terrain sample spacing in px
const WHEEL_BASE = 50;
const WHEEL_R    = 13;
const GRAVITY    = 0.52;
const GAS_FORCE  = 0.46;
const BRAKEFORCE = 0.28;
const MAX_SPEED  = 9;
const FRIC_GND   = 0.912;
const FRIC_AIR   = 0.997;

class HillClimbGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx    = this.canvas.getContext('2d');
        this.audio  = document.getElementById('audioPlayer');

        this.keys      = { left: false, right: false };
        this.popups    = [];
        this.collected = 0;
        this.done      = false;
        this.camX      = 0;

        this.sizeCanvas();
        window.addEventListener('resize', () => this.sizeCanvas());

        this.terrain = this.genTerrain();
        this.letters = this.genLetters();

        this.car = { x: 200, y: 0, vx: 0, vy: 0, angle: 0, onGround: false };
        this.car.y = this.ty(this.car.x) - WHEEL_R;

        this.bindControls();
        this.canvas.addEventListener('click',     (e) => this.handleRestartClick(e));
        this.canvas.addEventListener('touchend',  (e) => this.handleRestartClick(e), { passive: false });
        requestAnimationFrame(() => this.loop());
    }

    /* ── Canvas sizing ── */
    sizeCanvas() {
        const ctrl = document.querySelector('.controls');
        const ctrlH = ctrl ? ctrl.offsetHeight : 110;
        this.W = this.canvas.width  = window.innerWidth;
        this.H = this.canvas.height = Math.max(120, window.innerHeight - ctrlH);
    }

    /* ── Terrain ── */
    genTerrain() {
        const n   = Math.ceil(WORLD_W / STEP) + 4;
        const H   = this.H;
        const pts = new Float32Array(n);

        for (let i = 0; i < n; i++) {
            const wx = i * STEP;
            // Flat starting zone so the car doesn't fall immediately
            if (wx < 200) { pts[i] = H * 0.62; continue; }
            pts[i] = H * 0.62
                + Math.sin(wx * 0.0018)       * H * 0.16
                + Math.sin(wx * 0.0044 + 1.2) * H * 0.08
                + Math.sin(wx * 0.011  + 0.7) * H * 0.04
                + Math.sin(wx * 0.026  + 2.1) * H * 0.02;
        }
        return pts;
    }

    // Interpolated terrain y at world-x
    ty(wx) {
        if (wx <= 0) return this.terrain[0];
        const f = wx / STEP;
        const i = Math.floor(f);
        if (i >= this.terrain.length - 1) return this.terrain[this.terrain.length - 1];
        return this.terrain[i] + (this.terrain[i + 1] - this.terrain[i]) * (f - i);
    }

    // Terrain slope angle at world-x
    slope(wx) {
        return Math.atan2(this.ty(wx + 5) - this.ty(wx - 5), 10);
    }

    /* ── Letters ── */
    genLetters() {
        return LETTERS.map((char, i) => ({
            char,
            wx: 360 + i * 430 + (Math.random() * 80 - 40),
            active: true,
        }));
    }

    /* ── Controls ── */
    bindControls() {
        [['btnLeft', 'left'], ['btnRight', 'right']].forEach(([id, key]) => {
            const btn = document.getElementById(id);
            const on  = (e) => { if (e.cancelable) e.preventDefault(); this.keys[key] = true;  btn.classList.add('pressed'); };
            const off = (e) => { if (e.cancelable) e.preventDefault(); this.keys[key] = false; btn.classList.remove('pressed'); };
            btn.addEventListener('touchstart',  on,  { passive: false });
            btn.addEventListener('touchend',    off, { passive: false });
            btn.addEventListener('touchcancel', off, { passive: false });
            btn.addEventListener('mousedown',   on);
            btn.addEventListener('mouseup',     off);
            btn.addEventListener('mouseleave',  off);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'd') this.keys.right = true;
            if (e.key === 'ArrowLeft'  || e.key === 'a') this.keys.left  = true;
        });
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'd') this.keys.right = false;
            if (e.key === 'ArrowLeft'  || e.key === 'a') this.keys.left  = false;
        });
    }

    /* ── Physics ── */
    update() {
        const c  = this.car;
        const sl = this.slope(c.x);

        if (this.keys.right && c.onGround) {
            c.vx += Math.cos(sl) * GAS_FORCE;
            c.vy += Math.sin(sl) * GAS_FORCE;
        }
        if (this.keys.left) {
            c.vx -= BRAKEFORCE;
        }

        c.vy += GRAVITY;
        c.x  += c.vx;
        c.y  += c.vy;
        c.x   = Math.max(60, Math.min(WORLD_W - 200, c.x));

        const floor = this.ty(c.x) - WHEEL_R;
        if (c.y >= floor) {
            c.y        = floor;
            c.vy       = Math.abs(c.vy) < 0.6 ? 0 : c.vy * -0.07;
            c.onGround = true;
            c.vx      *= FRIC_GND;
        } else {
            c.onGround = false;
            c.vx      *= FRIC_AIR;
        }

        c.vx    = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, c.vx));
        c.angle += (this.slope(c.x) - c.angle) * 0.22;

        this.camX = Math.max(0, c.x - this.W * 0.36);

        // Letter pickup
        if (!this.done) {
            for (const l of this.letters) {
                if (!l.active) continue;
                const ly = this.ty(l.wx) - 50;
                if (Math.abs(c.x - l.wx) < 48 && Math.abs(c.y - ly) < 58) {
                    l.active = false;
                    this.collected++;
                    this.popups.push({ char: l.char, wx: l.wx, wy: ly, alpha: 1 });
                    this.playAudio(l.char);
                    if (this.collected === LETTERS.length) this.done = true;
                }
            }
        }

        for (const p of this.popups) { p.wy -= 1.5; p.alpha -= 0.014; }
        this.popups = this.popups.filter(p => p.alpha > 0);
    }

    /* ── Render ── */
    draw() {
        const { ctx, W, H } = this;

        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#3d88cc');
        sky.addColorStop(1, '#9fd4f0');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        this.drawClouds();

        ctx.save();
        ctx.translate(-this.camX, 0);
        this.drawTerrain();
        this.drawLetters();
        this.drawCar();
        this.drawPopups();
        ctx.restore();

        this.drawHUD();
        if (this.done) this.drawDone();
    }

    drawClouds() {
        const { ctx, W } = this;
        const px = this.camX * 0.15;

        ctx.fillStyle = 'rgba(255,255,255,0.84)';
        [[120, 55, 1], [350, 38, 0.8], [610, 72, 1.15], [880, 42, 0.9]].forEach(([cx, cy, s]) => {
            const sx = ((cx - px % W + W * 3)) % (W + 280) - 40;
            const r  = 28 * s;
            ctx.beginPath();
            ctx.arc(sx,            cy,      r,        0, Math.PI * 2);
            ctx.arc(sx + r * 1.1,  cy - 10, r * 0.8,  0, Math.PI * 2);
            ctx.arc(sx + r * 2.0,  cy,      r * 0.85, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawTerrain() {
        const { ctx, W, H, terrain } = this;
        const si = Math.max(0, Math.floor(this.camX / STEP) - 2);
        const ei = Math.min(terrain.length - 1, si + Math.ceil(W / STEP) + 6);

        ctx.beginPath();
        ctx.moveTo(si * STEP, H + 20);
        for (let i = si; i <= ei; i++) ctx.lineTo(i * STEP, terrain[i]);
        ctx.lineTo(ei * STEP, H + 20);
        ctx.closePath();

        const g = ctx.createLinearGradient(0, H * 0.45, 0, H);
        g.addColorStop(0,    '#68bc5c');
        g.addColorStop(0.12, '#4c9640');
        g.addColorStop(1,    '#28581c');
        ctx.fillStyle = g;
        ctx.fill();

        // Grass highlight line
        ctx.beginPath();
        for (let i = si; i <= ei; i++) {
            i === si ? ctx.moveTo(i * STEP, terrain[i]) : ctx.lineTo(i * STEP, terrain[i]);
        }
        ctx.strokeStyle = '#8dd96e';
        ctx.lineWidth   = 5;
        ctx.lineJoin    = 'round';
        ctx.stroke();
    }

    drawLetters() {
        const { ctx } = this;
        const now = performance.now();

        for (const l of this.letters) {
            if (!l.active) continue;
            if (l.wx < this.camX - 80 || l.wx > this.camX + this.W + 80) continue;

            const gy  = this.ty(l.wx);
            const bob = Math.sin(now * 0.002 + l.wx * 0.01) * 5;
            const ly  = gy - 50 + bob;

            // Ground shadow
            ctx.beginPath();
            ctx.ellipse(l.wx, gy - 3, 17, 5, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,0,0,0.18)';
            ctx.fill();

            // White bubble
            ctx.shadowColor = 'rgba(0,0,0,0.12)';
            ctx.shadowBlur  = 8;
            ctx.beginPath();
            ctx.arc(l.wx, ly, 26, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.shadowBlur  = 0;
            ctx.strokeStyle = '#3d82c4';
            ctx.lineWidth   = 3;
            ctx.stroke();

            ctx.fillStyle    = '#1a3a6b';
            ctx.font         = 'bold 24px "Arial Rounded MT Bold", Arial';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(l.char, l.wx, ly);
        }
    }

    drawCar() {
        const { ctx } = this;
        const c  = this.car;
        const wb = WHEEL_BASE;
        const wr = WHEEL_R;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.angle);

        // Lower body
        ctx.fillStyle = '#e84040';
        ctx.beginPath();
        ctx.roundRect(-wb / 2 - 5, -wr - 20, wb + 10, 18, 4);
        ctx.fill();

        // Cabin
        ctx.beginPath();
        ctx.roundRect(-wb / 2 + 3, -wr - 38, wb - 2, 20, [8, 8, 0, 0]);
        ctx.fill();

        ctx.strokeStyle = '#b83030';
        ctx.lineWidth   = 2;
        ctx.beginPath();
        ctx.roundRect(-wb / 2 - 5, -wr - 20, wb + 10, 18, 4);
        ctx.stroke();

        // Windshield
        ctx.fillStyle = 'rgba(140,215,255,0.72)';
        ctx.beginPath();
        ctx.roundRect(-wb / 2 + 7, -wr - 36, wb - 10, 14, 4);
        ctx.fill();

        // Axle bar
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.roundRect(-wb / 2 - 6, -wr - 3, wb + 12, 6, 3);
        ctx.fill();

        // Wheels
        for (const wx of [-wb / 2, wb / 2]) {
            ctx.beginPath();
            ctx.arc(wx, 0, wr, 0, Math.PI * 2);
            ctx.fillStyle = '#1c1c1c';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(wx, 0, wr * 0.56, 0, Math.PI * 2);
            ctx.fillStyle = '#aaa';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(wx, 0, wr * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = '#555';
            ctx.fill();
        }

        ctx.restore();
    }

    drawPopups() {
        const { ctx } = this;
        for (const p of this.popups) {
            ctx.save();
            ctx.globalAlpha  = p.alpha;
            ctx.font         = 'bold 52px "Arial Rounded MT Bold", Arial';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeStyle  = 'rgba(0,0,0,0.45)';
            ctx.lineWidth    = 6;
            ctx.strokeText(p.char, p.wx, p.wy);
            ctx.fillStyle = '#ffe135';
            ctx.fillText(p.char, p.wx, p.wy);
            ctx.restore();
        }
    }

    drawHUD() {
        const { ctx } = this;
        ctx.fillStyle = 'rgba(0,0,0,0.42)';
        ctx.beginPath();
        ctx.roundRect(10, 10, 188, 42, 11);
        ctx.fill();
        ctx.fillStyle    = '#fff';
        ctx.font         = 'bold 16px Arial';
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`📚 ${this.collected} / ${LETTERS.length} bogstaver`, 20, 31);
    }

    drawDone() {
        const { ctx, W, H } = this;
        ctx.fillStyle = 'rgba(0,0,0,0.52)';
        ctx.fillRect(0, 0, W, H);

        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.font         = 'bold 50px Arial';
        ctx.strokeStyle  = '#000';
        ctx.lineWidth    = 6;
        ctx.strokeText('🎉 Tillykke! 🎉', W / 2, H / 2 - 60);
        ctx.fillStyle = '#ffe135';
        ctx.fillText('🎉 Tillykke! 🎉', W / 2, H / 2 - 60);

        ctx.font      = 'bold 24px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('Alle bogstaver er samlet!', W / 2, H / 2 - 8);

        // Restart button
        const bw = Math.min(260, W * 0.6);
        const bh = 58;
        const bx = W / 2 - bw / 2;
        const by = H / 2 + 30;
        this._restartBtn = { x: bx, y: by, w: bw, h: bh };

        ctx.fillStyle = '#ffe135';
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 14);
        ctx.fill();

        ctx.font         = 'bold 22px "Arial Rounded MT Bold", Arial';
        ctx.fillStyle    = '#1a3a00';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔄 Spil igen', W / 2, by + bh / 2);
    }

    handleRestartClick(e) {
        if (!this.done || !this._restartBtn) return;
        const btn = this._restartBtn;
        let cx, cy;
        if (e.changedTouches) {
            const rect = this.canvas.getBoundingClientRect();
            cx = e.changedTouches[0].clientX - rect.left;
            cy = e.changedTouches[0].clientY - rect.top;
        } else {
            const rect = this.canvas.getBoundingClientRect();
            cx = e.clientX - rect.left;
            cy = e.clientY - rect.top;
        }
        if (cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
            this.restart();
        }
    }

    restart() {
        this.collected  = 0;
        this.done       = false;
        this.popups     = [];
        this._restartBtn = null;
        this.terrain    = this.genTerrain();
        this.letters    = this.genLetters();
        this.car        = { x: 200, y: 0, vx: 0, vy: 0, angle: 0, onGround: false };
        this.car.y      = this.ty(this.car.x) - WHEEL_R;
        this.camX       = 0;
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    playAudio(char) {
        this.audio.src = `audio-alphabet/${char}.ogg`;
        this.audio.play().catch(() => {});
    }
}

window.addEventListener('load', () => new HillClimbGame());
