// ═══════════════════════════════════════════
//  MAGICAL WAVE CANVAS SYSTEM (SAME AS INDEX)
// ═══════════════════════════════════════════
(function initMagicalWaves() {
    const canvas = document.getElementById("waveCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H;
    let time = 0;
    let sparkles = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    function getWavePath(band, t, flip) {
        const points = [];
        const steps = 120;
        for (let i = 0; i <= steps; i++) {
            const x = (i / steps) * W;
            const nx = x / W;
            let y = Math.sin(nx * Math.PI * 3.2 + t * band.speed) * band.amp
                + Math.sin(nx * Math.PI * 5.1 + t * band.speed * 1.4 + 1.2) * band.amp * 0.5
                + Math.sin(nx * Math.PI * 7.7 + t * band.speed * 0.7 + 2.4) * band.amp * 0.25;
            const baseY = flip ? band.baseY : H - band.baseY;
            points.push({ x, y: flip ? baseY + y : baseY - y });
        }
        return points;
    }

    const bottomBands = [
        { baseY: 90, amp: 55, speed: 0.95, colorA: "rgba(0,200,255,0.55)", glowColor: "#00c8ff", lineW: 2.2 },
        { baseY: 110, amp: 28, speed: 0.45, colorA: "rgba(0,180,255,0.35)", glowColor: "#00b4ff", lineW: 1.4 },
        { baseY: 70, amp: 34, speed: 0.72, colorA: "rgba(80,220,255,0.70)", glowColor: "#50dcff", lineW: 2.8 },
        { baseY: 130, amp: 40, speed: 0.66, colorA: "rgba(0,140,230,0.20)", glowColor: "#008ce6", lineW: 1.0 }
    ];
    const topBands = [
        { baseY: 90, amp: 55, speed: 0.95, colorA: "rgba(0,200,255,0.50)", glowColor: "#00c8ff", lineW: 2.2 },
        { baseY: 110, amp: 28, speed: 0.45, colorA: "rgba(0,180,255,0.30)", glowColor: "#00b4ff", lineW: 1.4 },
        { baseY: 70, amp: 34, speed: 0.72, colorA: "rgba(80,220,255,0.65)", glowColor: "#50dcff", lineW: 2.8 },
        { baseY: 130, amp: 40, speed: 0.66, colorA: "rgba(0,140,230,0.18)", glowColor: "#008ce6", lineW: 1.0 }
    ];

    function drawWaveLine(points, band) {
        ctx.save();
        ctx.shadowBlur = 22;
        ctx.shadowColor = band.glowColor;
        ctx.strokeStyle = band.colorA;
        ctx.lineWidth = band.lineW + 4;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const mx = (prev.x + curr.x) / 2;
            const my = (prev.y + curr.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
        }
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.shadowBlur = 14;
        ctx.shadowColor = band.glowColor;
        ctx.strokeStyle = band.colorA;
        ctx.lineWidth = band.lineW;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const mx = (prev.x + curr.x) / 2;
            const my = (prev.y + curr.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
        }
        ctx.stroke();
        ctx.restore();
    }

    function drawWaveFill(points, flip) {
        ctx.save();
        ctx.globalAlpha = 0.12;
        const grad = ctx.createLinearGradient(0, flip ? 0 : H, 0, flip ? H * 0.35 : H * 0.65);
        grad.addColorStop(0, "rgba(0,180,255,0.55)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const mx = (prev.x + curr.x) / 2;
            const my = (prev.y + curr.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
        }
        if (flip) { ctx.lineTo(W, 0); ctx.lineTo(0, 0); }
        else { ctx.lineTo(W, H); ctx.lineTo(0, H); }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function spawnSparkle(x, y, color) {
        sparkles.push({ x, y, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2, radius: Math.random() * 2.4 + 0.6, life: 1.0, decay: Math.random() * 0.025 + 0.012, color });
    }
    function spawnSparklesOnWave(points, band) {
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
            const idx = Math.floor(Math.random() * points.length);
            const p = points[idx];
            spawnSparkle(p.x, p.y + (Math.random() - 0.5) * 10, band.glowColor);
        }
    }
    function drawSparkles() {
        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];
            s.x += s.vx; s.y += s.vy; s.life -= s.decay;
            if (s.life <= 0) { sparkles.splice(i, 1); continue; }
            ctx.save(); ctx.globalAlpha = s.life; ctx.shadowBlur = 10; ctx.shadowColor = s.color;
            ctx.strokeStyle = s.color; ctx.lineWidth = s.radius * 0.6;
            ctx.beginPath(); ctx.moveTo(s.x - s.radius * 2, s.y); ctx.lineTo(s.x + s.radius * 2, s.y);
            ctx.moveTo(s.x, s.y - s.radius * 2); ctx.lineTo(s.x, s.y + s.radius * 2);
            ctx.moveTo(s.x - s.radius, s.y - s.radius); ctx.lineTo(s.x + s.radius, s.y + s.radius);
            ctx.moveTo(s.x + s.radius, s.y - s.radius); ctx.lineTo(s.x - s.radius, s.y + s.radius);
            ctx.stroke();
            ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 6;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.radius * 0.4, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        }
    }

    const stars = [];
    for (let i = 0; i < 80; i++) stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.3, blink: Math.random() * Math.PI * 2, speed: Math.random() * 0.02 + 0.005 });
    function drawStars(t) {
        for (const s of stars) {
            const alpha = 0.3 + 0.5 * Math.abs(Math.sin(s.blink + t * s.speed));
            ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 4; ctx.shadowColor = "#88ddff";
            ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
    }

    function render() {
        ctx.clearRect(0, 0, W, H);
        drawStars(time);
        bottomBands.forEach((band, idx) => {
            const pts = getWavePath(band, time + idx * 1.1, false);
            drawWaveFill(pts, false);
            drawWaveLine(pts, band);
            if (band.lineW >= 2 && Math.random() < 0.6) spawnSparklesOnWave(pts, band);
        });
        topBands.forEach((band, idx) => {
            const pts = getWavePath(band, time + idx * 0.9 + 3.5, true);
            drawWaveFill(pts, true);
            drawWaveLine(pts, band);
            if (band.lineW >= 2 && Math.random() < 0.6) spawnSparklesOnWave(pts, band);
        });
        drawSparkles();
        if (sparkles.length > 400) sparkles.splice(0, 100);
        time += 0.025;
        requestAnimationFrame(render);
    }
    render();
})();

// ================================================
// FUNDS TRANSFER 2 JS - PRESERVED FUNCTIONALITY
// ================================================
function setCaption(text) {
    const el = document.getElementById("captionText");
    if (el) el.textContent = text;
}

function speak(text, onEnd) {
    setCaption(text);
    window.speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.88;
    msg.pitch = 1;
    msg.volume = 1;

    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === "en-US") || voices[0];
    if (preferred) msg.voice = preferred;
    if (onEnd) msg.onend = onEnd;

    speechSynthesis.speak(msg);
}

function loadBeneficiary() {
    const raw = sessionStorage.getItem("selectedBeneficiary");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}

function populateBeneficiary(bene) {
    if (!bene) return;

    const nameEl = document.getElementById("beneName");
    const accEl = document.getElementById("beneAcc");
    const bankEl = document.getElementById("beneBank");
    const avatarEl = document.getElementById("beneAvatar");

    if (nameEl) nameEl.textContent = bene.name || "—";
    if (accEl) accEl.textContent = bene.acc || "xxxx-xxxxxxxxx-xxx";
    if (bankEl) bankEl.textContent = bene.bank || "—";
    if (avatarEl && bene.avatarBg) avatarEl.style.background = bene.avatarBg;
}

let welcomeSpoken = false;

function announceWelcome(bene) {
    if (welcomeSpoken) return;
    welcomeSpoken = true;

    const name = bene ? bene.name : "Unknown";
    const bank = bene ? bene.bank : "";
    const acc = bene ? bene.acc : "";

    const msg = "Beneficiary selected: " + name + " from " + bank + ". " +
        "Account number " + acc + ". " +
        "Triple tap anywhere on the screen to confirm and proceed. " +
        "Double tap anywhere to go back to the previous page.";

    speak(msg);
}

function initWelcomeTrigger(bene) {
    const trigger = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            announceWelcome(bene);
        } else {
            speechSynthesis.onvoiceschanged = () => announceWelcome(bene);
        }
    };
    document.addEventListener("touchstart", trigger, { once: true });
    document.addEventListener("click", trigger, { once: true });
}

function initScreenTapGesture() {
    let tapCount = 0;
    let tapTimer = null;
    const container = document.querySelector(".app-container");

    container.addEventListener("click", (e) => {
        if (e.target.closest(".bottom-btn") || e.target.closest(".back-btn")) return;

        tapCount++;
        if (tapTimer) clearTimeout(tapTimer);

        tapTimer = setTimeout(() => {
            if (tapCount >= 3) {
                const bene = loadBeneficiary();
                const name = bene ? bene.name : "beneficiary";
                const card = document.getElementById("beneCard");
                if (card) card.classList.add("confirmed");

                speak(name + " confirmed. Proceeding to the next step.", () => {
                    window.location.href = "fundsTransfer3.html";
                });
                setTimeout(() => {
                    window.location.href = "fundsTransfer3.html";
                }, 2200);

            } else if (tapCount === 2) {
                speak("Going back to beneficiary selection.", () => {
                    window.location.href = "fundsTransfer.html";
                });
                setTimeout(() => {
                    window.location.href = "fundsTransfer.html";
                }, 1800);

            } else {
                speak("Triple tap to confirm and proceed. Double tap to go back.");
            }

            tapCount = 0;
        }, 600);
    });
}

function initBackBtn() {
    const btn = document.getElementById("backBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
        speak("Going back.");
        setTimeout(() => {
            window.location.href = "fundsTransfer.html";
        }, 800);
    });
}

function initBackActionBtn() {
    const btn = document.getElementById("backActionBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
        speak("Going back to beneficiary selection.");
        setTimeout(() => {
            window.location.href = "fundsTransfer.html";
        }, 1000);
    });
}

function initNextBtn() {
    const btn = document.getElementById("nextBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
        const bene = loadBeneficiary();
        const name = bene ? bene.name : "beneficiary";
        const card = document.getElementById("beneCard");
        if (card) card.classList.add("confirmed");
        
        speak(name + " confirmed. Proceeding.", () => {
            window.location.href = "fundsTransfer3.html";
        });
        setTimeout(() => {
            window.location.href = "fundsTransfer3.html";
        }, 1800);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const bene = loadBeneficiary();
    populateBeneficiary(bene);
    initBackBtn();
    initBackActionBtn();
    initNextBtn();
    initScreenTapGesture();
    initWelcomeTrigger(bene);
});