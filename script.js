/* ─── ESTADO ─── */
let currentScreen = 1;
let petalIntervals = {};
let heartIntervals = {};
let envelopeOpen = false;
let lilyAnimated = false;

/* ─── INICIO ─── */
window.onload = function () {
    updateCounter();
    setInterval(updateCounter, 60000);
    startAmbient(1);
    console.log('%c¡Feliz Día Mamá María! 💜', 'color:#9B4D96;font-size:22px;font-weight:bold;');
};

/* ─── COUNTER ─── */
function updateCounter() {
    const start = new Date(2007, 4, 4); // 4 de mayo 2007
    const now   = new Date();

    let years  = now.getFullYear() - start.getFullYear();
    let months = now.getMonth()    - start.getMonth();
    let days   = now.getDate()     - start.getDate();

    if (days < 0) {
        months--;
        const prev = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prev.getDate();
    }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));

    animateNumber('cYears',  years);
    animateNumber('cMonths', months);
    animateNumber('cDays',   days);
    document.getElementById('cTotal').textContent =
        totalDays.toLocaleString('es') + ' días de amor juntos 💜';
}

function animateNumber(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;
    const step = Math.ceil(Math.abs(target - current) / 30);
    let val = current;
    const iv = setInterval(() => {
        val += step;
        if (val >= target) { val = target; clearInterval(iv); }
        el.textContent = val;
    }, 30);
}

/* ─── NAVIGATION ─── */
function goToScreen(n) {
    const prev = document.getElementById('screen' + currentScreen);
    const next = document.getElementById('screen' + n);
    if (!next) return;

    prev.classList.remove('active');
    stopAmbient(currentScreen);

    setTimeout(() => {
        next.classList.add('active');
        startAmbient(n);
        currentScreen = n;

        if (n === 3 && !lilyAnimated) {
            setTimeout(animateLilies, 300);
            lilyAnimated = true;
        }
    }, 120);
}

function goToScreen2() {
    launchConfetti();
    setTimeout(() => goToScreen(2), 200);
}

function goToScreen3() {
    goToScreen(3);
}

/* ─── AMBIENT ─── */
function startAmbient(n) {
    const pid = 'petals' + n;
    const hid = 'hearts' + n;
    if (!petalIntervals[n]) {
        petalIntervals[n] = setInterval(() => {
            if (Math.random() > 0.35) createPetal(pid);
        }, 520);
    }
    if (!heartIntervals[n]) {
        heartIntervals[n] = setInterval(() => {
            if (Math.random() > 0.52) createHeart(hid);
        }, 850);
    }
}
function stopAmbient(n) {
    clearInterval(petalIntervals[n]);
    clearInterval(heartIntervals[n]);
    delete petalIntervals[n];
    delete heartIntervals[n];
}

/* ─── PETALS ─── */
function createPetal(containerId) {
    const c = document.getElementById(containerId);
    if (!c) return;
    const el = document.createElement('div');
    el.classList.add('petal');
    el.textContent = ['🌷','🌸','💮','🌺'][Math.floor(Math.random() * 4)];
    el.style.left = Math.random() * 100 + 'vw';
    const dur = Math.random() * 8 + 8;
    el.style.animationDuration = dur + 's';
    el.style.fontSize = (Math.random() * 1.2 + 1.3) + 'rem';
    el.style.opacity  = (Math.random() * 0.5 + 0.5).toFixed(2);
    c.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 500);
}

/* ─── HEARTS (mejorado) ─── */
function createHeart(containerId) {
    const c = document.getElementById(containerId);
    if (!c) return;
    const el = document.createElement('div');
    el.classList.add('heart-particle');
    const hearts = ['💜','💗','💕','❤️','🩷','💖'];
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    const sizes = [1, 1.4, 1.8, 2.2, 2.6];
    el.style.fontSize = sizes[Math.floor(Math.random() * sizes.length)] + 'rem';
    el.style.left = (Math.random() * 95) + 'vw';
    const dur = Math.random() * 6 + 7;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay    = (Math.random() * 2) + 's';
    c.appendChild(el);
    setTimeout(() => el.remove(), (dur + 3) * 1000);
}

/* ─── CONFETTI ─── */
const canvas = document.getElementById('confettiCanvas');
const ctx    = canvas.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function launchConfetti() {
    confettiPieces = [];
    const colors = ['#C89FD4','#9B4D96','#F0B8D8','#FFD6E7','#B8D0FF','#FFF0A0','#A8F0C8','#D4AAFF'];
    for (let i = 0; i < 200; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height * 0.5,
            w: Math.random() * 13 + 6,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 5,
            vy: Math.random() * 4 + 2,
            rot: Math.random() * Math.PI * 2,
            rotV: (Math.random() - 0.5) * 0.16,
            alpha: 1,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        });
    }
    confettiRunning = true;
    animateConfetti();
}

function animateConfetti() {
    if (!confettiRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of confettiPieces) {
        p.x += p.vx; p.y += p.vy;
        p.rot += p.rotV; p.vy += 0.06;
        if (p.y < canvas.height + 20) alive = true;
        if (p.y > canvas.height - 80) { p.alpha -= 0.022; if (p.alpha < 0) p.alpha = 0; }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
    }
    if (alive) { requestAnimationFrame(animateConfetti); }
    else { confettiRunning = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

/* ─── ENVELOPE / CARTA ─── */
function openEnvelope() {
    if (envelopeOpen) return;
    envelopeOpen = true;
    document.getElementById('envelopeFlap').classList.add('open');
    document.getElementById('envelopeHint').style.display = 'none';

    setTimeout(() => {
        document.getElementById('letter').classList.add('open');
    }, 500);

    // Mostrar el botón "Continuar" al fondo de la carta después de que aparezca
    setTimeout(() => {
        const btn = document.getElementById('letterBtn');
        if (btn) btn.style.display = 'flex';
    }, 1800);
}

/* ─── LILY ANIMATION ─── */
function animateLilies() {
    // Orden de aparición: del centro hacia afuera, con delay escalonado
    const order = ['lily2', 'lily1', 'lily3', 'lily4', 'lily5', 'lily6', 'lily7'];
    const delays = [0, 280, 280, 500, 500, 700, 700];

    order.forEach((id, i) => {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.classList.add('bloomed');
        }, delays[i]);
    });

    // Mariposas después de que florezcan
    setTimeout(() => {
        document.getElementById('bf1').classList.add('visible');
        document.getElementById('bf2').classList.add('visible');
    }, 1600);

    // Mensaje final
    setTimeout(() => {
        const msg = document.getElementById('lilyMessage');
        if (msg) msg.classList.add('visible');
    }, 2200);
}
