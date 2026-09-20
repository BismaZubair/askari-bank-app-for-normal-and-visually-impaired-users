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
// FUNDS TRANSFER 3 JS - WITH KEYBOARD INPUT & BALANCE DEDUCTION
// ================================================
let enteredAmount = null;
let welcomeDone = false;
let tapCount = 0;
let tapTimer = null;
let isListening = false;
let recognition = null;
let currentInputMethod = "voice"; // "voice" or "keyboard"

function setCaption(text) {
    const el = document.getElementById("captionText");
    if (el) el.textContent = text;
}

function speak(text) {
    return new Promise((resolve) => {
        setCaption(text);
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = 0.88;
        msg.pitch = 1;
        msg.volume = 1;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.lang === "en-US") || voices[0];
        if (preferred) msg.voice = preferred;
        msg.onend = () => resolve();
        msg.onerror = () => resolve();
        window.speechSynthesis.speak(msg);
    });
}

function loadBeneficiary() {
    try { return JSON.parse(sessionStorage.getItem("selectedBeneficiary")) || {}; }
    catch { return {}; }
}

function loadUserBalance() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user && user.balance !== undefined) {
        const balanceElement = document.getElementById("fromBalance");
        const availableElement = document.getElementById("availableBalance");
        const fromAccountElement = document.getElementById("fromAccountNumber");
        
        const formattedBalance = `PKR ${user.balance.toLocaleString()}`;
        
        if (balanceElement) balanceElement.textContent = formattedBalance;
        if (availableElement) availableElement.textContent = `Available Balance: ${formattedBalance}`;
        if (fromAccountElement && user.accountNumber) fromAccountElement.textContent = user.accountNumber;
        
        return user.balance;
    }
    return 62740.33;
}

function updateBalanceDisplay() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user && user.balance !== undefined) {
        const balanceElement = document.getElementById("fromBalance");
        const availableElement = document.getElementById("availableBalance");
        const formattedBalance = `PKR ${user.balance.toLocaleString()}`;
        if (balanceElement) balanceElement.textContent = formattedBalance;
        if (availableElement) availableElement.textContent = `Available Balance: ${formattedBalance}`;
    }
}

function populateTo() {
    const bene = loadBeneficiary();
    const safe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || "—"; };
    safe("toName", bene.name);
    safe("toBank", bene.bank);
    safe("toAcc", bene.acc || "xxxx-xxxxxxxxx-xxx");
    const avatarEl = document.getElementById("toAvatar");
    if (avatarEl && bene.avatarBg) avatarEl.style.background = bene.avatarBg;
}

function setAmountDisplay(value) {
    const displayEl = document.getElementById("amountDisplay");
    const card = document.getElementById("amountCard");
    if (value && !isNaN(value) && Number(value) > 0) {
        enteredAmount = Number(value);
        if (displayEl) { 
            displayEl.textContent = enteredAmount.toLocaleString("en-PK"); 
            displayEl.classList.remove("placeholder"); 
        }
        if (card) card.classList.add("has-value");
    } else {
        enteredAmount = null;
        if (displayEl) { displayEl.textContent = "—"; displayEl.classList.add("placeholder"); }
        if (card) card.classList.remove("has-value");
    }
}

// Keyboard Input Handlers
function initKeyboardInput() {
    const amountInput = document.getElementById("amountInput");
    const setAmountBtn = document.getElementById("setAmountBtn");
    const quickAmountBtns = document.querySelectorAll(".quick-amount");
    
    if (setAmountBtn) {
        setAmountBtn.addEventListener("click", () => {
            const value = parseInt(amountInput.value);
            if (value && !isNaN(value) && value > 0) {
                const currentBalance = loadUserBalance();
                if (value > currentBalance) {
                    speak("Insufficient balance. Your available balance is " + currentBalance.toLocaleString() + " rupees. Please enter a smaller amount.");
                    amountInput.value = "";
                    return;
                }
                setAmountDisplay(value);
                speak("Amount set to " + value.toLocaleString() + " rupees.");
                amountInput.value = "";
            } else {
                speak("Please enter a valid amount.");
            }
        });
    }
    
    if (quickAmountBtns.length) {
        quickAmountBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const amount = parseInt(btn.getAttribute("data-amount"));
                const currentBalance = loadUserBalance();
                if (amount > currentBalance) {
                    speak("Insufficient balance. Your available balance is " + currentBalance.toLocaleString() + " rupees.");
                    return;
                }
                setAmountDisplay(amount);
                speak("Amount set to " + amount.toLocaleString() + " rupees.");
            });
        });
    }
    
    if (amountInput) {
        amountInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                setAmountBtn.click();
            }
        });
    }
}

// Input Method Toggle
function initInputMethodToggle() {
    const voiceMethodBtn = document.getElementById("voiceMethodBtn");
    const keyboardMethodBtn = document.getElementById("keyboardMethodBtn");
    const micBtn = document.getElementById("micBtn");
    const keyboardSection = document.getElementById("keyboardSection");
    
    if (voiceMethodBtn && keyboardMethodBtn) {
        voiceMethodBtn.addEventListener("click", () => {
            currentInputMethod = "voice";
            voiceMethodBtn.classList.add("active");
            keyboardMethodBtn.classList.remove("active");
            micBtn.style.display = "flex";
            keyboardSection.style.display = "none";
            speak("Voice input mode selected. Tap the microphone button and say the amount.");
        });
        
        keyboardMethodBtn.addEventListener("click", () => {
            currentInputMethod = "keyboard";
            keyboardMethodBtn.classList.add("active");
            voiceMethodBtn.classList.remove("active");
            micBtn.style.display = "none";
            keyboardSection.style.display = "block";
            speak("Keyboard input mode selected. Enter the amount using the number pad or quick amount buttons.");
        });
    }
}

function wordsToNumber(text) {
    const m = text.replace(/,/g, "").match(/\d+/);
    if (m) return parseInt(m[0], 10);
    const ones = {zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19};
    const tens = {twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
    const scale = {hundred:100,thousand:1000,lakh:100000,lac:100000,million:1000000};
    const words = text.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/);
    let total = 0, cur = 0;
    words.forEach(w => {
        if (ones[w] !== undefined) cur += ones[w];
        else if (tens[w] !== undefined) cur += tens[w];
        else if (w === "hundred") cur = (cur || 1) * 100;
        else if (scale[w]) { total += (cur || 1) * scale[w]; cur = 0; }
    });
    total += cur;
    return total > 0 ? total : NaN;
}

function numberToReadable(n) {
    if (n >= 100000) return (n / 100000 % 1 === 0 ? n / 100000 : (n / 100000).toFixed(1)) + " lakh";
    if (n >= 1000) return (n / 1000 % 1 === 0 ? n / 1000 : (n / 1000).toFixed(1)) + " thousand";
    return n.toString();
}

function setMicUI(listening) {
    const btn = document.getElementById("micBtn");
    const icon = document.getElementById("micIcon");
    const label = document.getElementById("micLabel");
    if (!btn) return;
    if (listening) {
        btn.classList.add("listening");
        if (icon) icon.className = "fas fa-stop-circle";
        if (label) label.textContent = "Listening… tap to stop";
    } else {
        btn.classList.remove("listening");
        if (icon) icon.className = "fas fa-microphone";
        if (label) label.textContent = "Tap to speak amount";
    }
}

function startRecognition() {
    if (!recognition || isListening) return;
    setCaption("Listening… say the amount");
    setMicUI(true);
    isListening = true;
    try { recognition.start(); }
    catch (e) { console.warn("rec start:", e); isListening = false; setMicUI(false); }
}

function initSpeechRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        const btn = document.getElementById("micBtn");
        if (btn) { 
            btn.disabled = true; 
            document.getElementById("micLabel").textContent = "Voice not supported - use keyboard"; 
        }
        return;
    }
    recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim();
        const parsed = wordsToNumber(transcript);
        if (!isNaN(parsed) && parsed > 0) {
            const currentBalance = loadUserBalance();
            if (parsed > currentBalance) {
                speak("Insufficient balance. Your available balance is " + currentBalance.toLocaleString() + " rupees. Please say a smaller amount.");
                return;
            }
            setAmountDisplay(parsed);
            recognition._lastTranscript = transcript;
            recognition._lastParsed = parsed;
        } else {
            recognition._lastTranscript = transcript;
            recognition._lastParsed = NaN;
        }
    };

    recognition.onend = () => {
        isListening = false;
        setMicUI(false);
        const parsed = recognition._lastParsed;
        const transcript = recognition._lastTranscript || "";
        recognition._lastParsed = undefined;
        recognition._lastTranscript = undefined;
        if (parsed && !isNaN(parsed) && parsed > 0) {
            const readable = numberToReadable(parsed);
            speak("You said " + readable + " rupees. Amount set to P K R " + parsed.toLocaleString("en-PK") + ". Triple tap anywhere to confirm and proceed. Double tap anywhere to go back.");
        } else if (transcript) {
            speak("Sorry, I did not catch a valid amount. You said: " + transcript + ". Please try again. For example say: five thousand, or ten thousand.");
        }
    };

    recognition.onerror = (e) => {
        isListening = false;
        setMicUI(false);
        recognition._lastParsed = undefined;
        recognition._lastTranscript = undefined;
        if (e.error === "no-speech") speak("No speech detected. Tap the microphone and try again, or switch to keyboard input mode.");
        else if (e.error === "not-allowed") speak("Microphone permission denied. Please switch to keyboard input mode using the toggle button.");
        else speak("Voice input error. Please try again or switch to keyboard input mode.");
    };
}

function initMicButton() {
    const btn = document.getElementById("micBtn");
    if (!btn || !recognition) return;
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isListening) { recognition.stop(); return; }
        window.speechSynthesis.cancel();
        setCaption("Preparing microphone…");
        setTimeout(startRecognition, 500);
    });
}

async function runWelcome() {
    const bene = loadBeneficiary();
    const name = bene.name || "selected beneficiary";
    const bank = bene.bank || "";
    await speak("Funds Transfer amount page. You are sending from your Current account to " + name + " at " + bank + ". You can use voice input by tapping the microphone button, or switch to keyboard input using the toggle buttons. Enter the amount you want to send. After setting the amount, triple tap anywhere to confirm and proceed. Double tap to go back.");
    welcomeDone = true;
}

function initWelcomeTrigger() {
    const handler = (e) => {
        if (e.target && e.target.closest && (e.target.closest(".mic-btn") || e.target.closest(".method-btn"))) return;
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) runWelcome();
        else window.speechSynthesis.onvoiceschanged = () => runWelcome();
    };
    document.addEventListener("click", handler, { once: true });
    document.addEventListener("touchstart", handler, { once: true, passive: true });
}

// Process actual transaction with balance deduction
function processTransaction() {
    if (!enteredAmount || enteredAmount <= 0) {
        speak("No amount entered yet. Please enter the amount first.");
        return false;
    }
    
    const bene = loadBeneficiary();
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    
    if (!user) {
        speak("User not found. Please log in again.");
        return false;
    }
    
    const currentBalance = user.balance || 0;
    
    if (enteredAmount > currentBalance) {
        speak("Insufficient balance. Your available balance is " + currentBalance.toLocaleString() + " rupees. Please enter a smaller amount.");
        return false;
    }
    
    // Deduct amount from balance
    const newBalance = currentBalance - enteredAmount;
    user.balance = newBalance;
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    
    // Update displayed balance
    updateBalanceDisplay();
    
    // Store transaction details
    const transaction = {
        to: bene.name,
        amount: enteredAmount,
        date: new Date().toLocaleString(),
        reference: "TRF" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        status: "Success"
    };
    
    // Get existing transactions or create new array
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.unshift(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    
    // Update session storage for confirmation page
    bene.amount = enteredAmount;
    bene.newBalance = newBalance;
    bene.reference = transaction.reference;
    sessionStorage.setItem("selectedBeneficiary", JSON.stringify(bene));
    
    return true;
}

async function handleConfirm() {
    if (!enteredAmount || enteredAmount <= 0) {
        speak("No amount entered yet. Please enter the amount using voice or keyboard input.");
        return;
    }
    
    const currentBalance = loadUserBalance();
    if (enteredAmount > currentBalance) {
        speak("Insufficient balance. Your available balance is " + currentBalance.toLocaleString() + " rupees. Please enter a smaller amount.");
        return;
    }
    
    const bene = loadBeneficiary();
    const amountReadable = numberToReadable(enteredAmount);
    
    await speak("You are about to send " + amountReadable + " rupees to " + (bene.name || "beneficiary") + ". Please confirm.");
    
    // Second confirmation after speaking
    setTimeout(async () => {
        const success = processTransaction();
        if (success) {
            const newBalance = loadUserBalance();
            await speak("Transaction successful! " + amountReadable + " rupees has been sent to " + (bene.name || "beneficiary") + ". Your new balance is " + newBalance.toLocaleString() + " rupees. Redirecting to home page.");
            setTimeout(() => {
                window.location.href = "home.html";
            }, 3500);
        }
    }, 2000);
}

function handleGoBack() {
    speak("Going back to the previous page.").then(() => { window.location.href = "fundsTransfer2.html"; });
}

function handleSingleTap() {
    if (enteredAmount) {
        speak("Current amount is P K R " + numberToReadable(enteredAmount) + ". Triple tap to confirm and send. Double tap to go back. Use the toggle buttons to switch input methods.");
    } else {
        speak("Please enter the amount. You can use voice input by tapping the microphone, or switch to keyboard input using the toggle buttons. Triple tap to confirm. Double tap to go back.");
    }
}

function initScreenTapGesture() {
    const container = document.querySelector(".app-container");
    container.addEventListener("click", (e) => {
        if (!welcomeDone) return;
        if (e.target.closest(".mic-btn") || e.target.closest(".next-btn") || e.target.closest(".back-btn") || e.target.closest(".view-limits-btn") || e.target.closest(".method-btn") || e.target.closest(".quick-amount") || e.target.closest(".set-amount-btn")) return;
        tapCount++;
        if (tapTimer) clearTimeout(tapTimer);
        tapTimer = setTimeout(() => {
            const count = tapCount;
            tapCount = 0;
            if (count >= 3) handleConfirm();
            else if (count === 2) handleGoBack();
            else handleSingleTap();
        }, 600);
    });
}

function initViewLimits() {
    const btn = document.getElementById("viewLimitsBtn");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        speak("Your daily payment limit is P K R 5 lakh. Per transaction limit is P K R 1 lakh. Minimum transaction amount is P K R 100.");
    });
}

function initBackBtn() {
    const btn = document.getElementById("backBtn");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        speak("Going back.").then(() => { window.location.href = "fundsTransfer2.html"; });
    });
}

function initNextBtn() {
    const btn = document.getElementById("nextBtn");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!enteredAmount || enteredAmount <= 0) {
            speak("Please enter the amount first using voice or keyboard input.");
            return;
        }
        handleConfirm();
    });
}

function initPurposeCard() {
    const card = document.getElementById("purposeCard");
    if (card) {
        card.addEventListener("click", (e) => {
            e.stopPropagation();
            speak("Purpose is set to Other. You can change this in future updates.");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    populateTo();
    loadUserBalance();
    initSpeechRecognition();
    initMicButton();
    initKeyboardInput();
    initInputMethodToggle();
    initBackBtn();
    initNextBtn();
    initViewLimits();
    initPurposeCard();
    initScreenTapGesture();
    initWelcomeTrigger();
    window.speechSynthesis.getVoices();
});