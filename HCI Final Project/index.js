// ============================================
// FIX FOR file:// PROTOCOL - DIRECT USER STORAGE
// ============================================
// ============================================
// FIX FOR file:// PROTOCOL - COMPLETE USER DATA
// ============================================
(function initLocalUsers() {
    // Complete user data with all details
    const defaultUsers = [
        {
            id: 1,
            username: "bisma123",
            password: "bisma123",
            fullName: "Bisma Zubair",
            cnic: "42101-1234567-8",
            accountNumber: "3001-2345-6789",
            balance: 175000,
            monthlyExpense: 45800,
            dateOfBirth: "12 May 1992",
            gender: "Female",
            nationality: "Pakistani",
            accountType: "Current Account",
            iban: "PK36 ASKB 1234 5678 9012 3456",
            branchCode: "0042",
            branchName: "DHA Phase 2, Karachi",
            openingDate: "15 March 2018",
            mobile: "+92 300 1234567",
            email: "bisma.zubair@askaribank.com",
            address: "House #45, Street 12, DHA Phase 2, Karachi",
            cardNumber: "4532-1234-5678-9012",
            cardType: "Gold Debit Card",
            expiryDate: "08/2027",
            beneficiaries: [
                { id: 1, name: "Ayesha Khan", cnic: "42101-7654321-0", bank: "Meezan Bank", accountNumber: "MEZN-1234-5678-9012", nickname: "Ayesha" },
                { id: 2, name: "Bilal Ahmed", cnic: "42101-9876543-2", bank: "Sadapay", accountNumber: "SADA-9876-5432-1098", nickname: "Bilal" },
                { id: 3, name: "Zara Tariq", cnic: "42101-5556667-9", bank: "Easypaisa", accountNumber: "EASY-4567-8901-2345", nickname: "Zara" }
            ]
        },
        {
            id: 2,
            username: "aleeza456",
            password: "aleeza456",
            fullName: "Aleeza Asif",
            cnic: "42201-9876543-2",
            accountNumber: "5002-3456-7890-1234",
            balance: 250000,
            monthlyExpense: 72500,
            dateOfBirth: "25 November 1990",
            gender: "Male",
            nationality: "Pakistani",
            accountType: "Platinum Account",
            iban: "PK36 ASKB 9876 5432 1098 7654",
            branchCode: "0089",
            branchName: "Gulberg, Lahore",
            openingDate: "22 July 2016",
            mobile: "+92 321 9876543",
            email: "aleeza.asif@askaribank.com",
            address: "Apt 7B, Park View Towers, Gulberg, Lahore",
            cardNumber: "5467-8901-2345-6789",
            cardType: "Platinum Credit Card",
            expiryDate: "12/2028",
            beneficiaries: [
                { id: 1, name: "Hamza Ali", cnic: "42201-1234567-8", bank: "Meezan Bank", accountNumber: "MEZN-8765-4321-0987", nickname: "Hamza" },
                { id: 2, name: "Fatima Zafar", cnic: "42201-5556667-9", bank: "Sadapay", accountNumber: "SADA-3456-7890-1234", nickname: "Fatima" },
                { id: 3, name: "Omar Riaz", cnic: "42201-2223334-5", bank: "Easypaisa", accountNumber: "EASY-6789-0123-4567", nickname: "Omar" }
            ]
        }
    ];
    
    // Store users in localStorage
 const savedUsers = localStorage.getItem("jsonUsers");

    if (!savedUsers) {
        localStorage.setItem("jsonUsers", JSON.stringify(defaultUsers));
        window.jsonUsers = defaultUsers;
        console.log("✅ Default users saved to localStorage");
    } else {
        window.jsonUsers = JSON.parse(savedUsers);
        console.log("✅ Existing users loaded from localStorage");
    }

    console.log(
        "Users:",
        window.jsonUsers.map(u => u.username)
    );
})();
// ═══════════════════════════════════════════
//  ASKARI BANK — index.js
//  Features:
//   • Magical glowing canvas waves (top + bottom)
//   • Sparkling particles along wave paths
//   • Login validation against users.txt
//   • Double-tap → VI login voice flow
//   • VI button → same voice guided flow
//   • AssistPay voice system
//   • Show/hide password toggle
//   • Registration modal popup
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
//  MAGICAL WAVE CANVAS SYSTEM
// ═══════════════════════════════════════════

(function initMagicalWaves() {
    const canvas = document.getElementById("waveCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W, H;
    let time = 0;
    let sparkles = [];

    // ── Resize ──
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // ── Wave path math ──
    // Returns array of {x, y} points for a wave band
    function getWavePath(band, t, flip) {
        const points = [];
        const steps  = 120;
        for (let i = 0; i <= steps; i++) {
            const x = (i / steps) * W;
            const nx = x / W; // normalised 0→1

            // Layer multiple sine frequencies for organic look
            let y =  Math.sin(nx * Math.PI * 3.2 + t * band.speed)             * band.amp
                   + Math.sin(nx * Math.PI * 5.1 + t * band.speed * 1.4 + 1.2) * band.amp * 0.5
                   + Math.sin(nx * Math.PI * 7.7 + t * band.speed * 0.7 + 2.4) * band.amp * 0.25;

            const baseY = flip
                ? band.baseY             // top zone: measured from top
                : H - band.baseY;        // bottom zone: measured from bottom

            points.push({ x, y: flip ? baseY + y : baseY - y });
        }
        return points;
    }

    // ── Wave band configs ──
    // Bottom waves
    const bottomBands = [
        { baseY: 90,  amp: 55, speed: 0.95, colorA: "rgba(0,200,255,0.55)", colorB: "rgba(0,100,200,0.0)",  glowColor: "#00c8ff", lineW: 2.2 },
        { baseY: 110, amp: 28, speed: 0.45, colorA: "rgba(0,180,255,0.35)", colorB: "rgba(0,80,180,0.0)",   glowColor: "#00b4ff", lineW: 1.4 },
        { baseY: 70,  amp: 34, speed: 0.72, colorA: "rgba(80,220,255,0.70)", colorB: "rgba(0,120,220,0.0)", glowColor: "#50dcff", lineW: 2.8 },
        { baseY: 130, amp: 40, speed: 0.66, colorA: "rgba(0,140,230,0.20)", colorB: "rgba(0,60,140,0.0)",   glowColor: "#008ce6", lineW: 1.0 },
    ];

    // Top waves (same shapes, flipped)
    const topBands = [
        { baseY: 90,  amp: 55, speed: 0.95, colorA: "rgba(0,200,255,0.50)", colorB: "rgba(0,100,200,0.0)",  glowColor: "#00c8ff", lineW: 2.2 },
        { baseY: 110, amp: 28, speed: 0.45, colorA: "rgba(0,180,255,0.30)", colorB: "rgba(0,80,180,0.0)",   glowColor: "#00b4ff", lineW: 1.4 },
        { baseY: 70,  amp: 34, speed: 0.72, colorA: "rgba(80,220,255,0.65)", colorB: "rgba(0,120,220,0.0)", glowColor: "#50dcff", lineW: 2.8 },
        { baseY: 130, amp: 40, speed: 0.66, colorA: "rgba(0,140,230,0.18)", colorB: "rgba(0,60,140,0.0)",   glowColor: "#008ce6", lineW: 1.0 },
    ];

    // ── Draw a single glowing wave line ──
    function drawWaveLine(points, band) {
        // Outer soft glow
        ctx.save();
        ctx.shadowBlur  = 22;
        ctx.shadowColor = band.glowColor;
        ctx.strokeStyle = band.colorA;
        ctx.lineWidth   = band.lineW + 4;
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

        // Bright core line
        ctx.save();
        ctx.shadowBlur  = 14;
        ctx.shadowColor = band.glowColor;
        ctx.strokeStyle = band.colorA;
        ctx.lineWidth   = band.lineW;
        ctx.globalAlpha = 1;
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

    // ── Draw fade fill beneath a wave ──
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
        if (flip) {
            ctx.lineTo(W, 0);
            ctx.lineTo(0, 0);
        } else {
            ctx.lineTo(W, H);
            ctx.lineTo(0, H);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // ── Sparkle system ──
    function spawnSparkle(x, y, color) {
        sparkles.push({
            x, y,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            radius: Math.random() * 2.4 + 0.6,
            life: 1.0,
            decay: Math.random() * 0.025 + 0.012,
            color
        });
    }

    function spawnSparklesOnWave(points, band, flip) {
        // Spawn 2-4 sparkles per frame spread across the wave
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
            const idx = Math.floor(Math.random() * points.length);
            const p   = points[idx];
            // Offset slightly off the line
            const offsetY = (Math.random() - 0.5) * 10;
            spawnSparkle(p.x, p.y + offsetY, band.glowColor);
        }
    }

    function drawSparkles() {
        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];
            s.x += s.vx;
            s.y += s.vy;
            s.life -= s.decay;

            if (s.life <= 0) {
                sparkles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = s.life;
            ctx.shadowBlur  = 10;
            ctx.shadowColor = s.color;

            // Star cross sparkle
            ctx.strokeStyle = s.color;
            ctx.lineWidth   = s.radius * 0.6;
            ctx.beginPath();
            ctx.moveTo(s.x - s.radius * 2, s.y);
            ctx.lineTo(s.x + s.radius * 2, s.y);
            ctx.moveTo(s.x, s.y - s.radius * 2);
            ctx.lineTo(s.x, s.y + s.radius * 2);
            // Diagonal arms (smaller)
            ctx.moveTo(s.x - s.radius, s.y - s.radius);
            ctx.lineTo(s.x + s.radius, s.y + s.radius);
            ctx.moveTo(s.x + s.radius, s.y - s.radius);
            ctx.lineTo(s.x - s.radius, s.y + s.radius);
            ctx.stroke();

            // Bright centre dot
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    // ── Background static star field ──
    const stars = [];
    for (let i = 0; i < 80; i++) {
        stars.push({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.2 + 0.3,
            blink: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + 0.005
        });
    }

    function drawStars(t) {
        for (const s of stars) {
            const alpha = 0.3 + 0.5 * Math.abs(Math.sin(s.blink + t * s.speed));
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle   = "#ffffff";
            ctx.shadowBlur  = 4;
            ctx.shadowColor = "#88ddff";
            ctx.beginPath();
            ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // ── Main render loop ──
    function render() {
        ctx.clearRect(0, 0, W, H);

        // Draw subtle twinkling stars all over
        drawStars(time);

        // ── BOTTOM WAVES ──
        bottomBands.forEach((band, idx) => {
            const pts = getWavePath(band, time + idx * 1.1, false);
            drawWaveFill(pts, false);
            drawWaveLine(pts, band);
            // Only brightest bands spawn sparkles
            if (band.lineW >= 2 && Math.random() < 0.6) {
                spawnSparklesOnWave(pts, band, false);
            }
        });

        // ── TOP WAVES ──
        topBands.forEach((band, idx) => {
            const pts = getWavePath(band, time + idx * 0.9 + 3.5, true);
            drawWaveFill(pts, true);
            drawWaveLine(pts, band);
            if (band.lineW >= 2 && Math.random() < 0.6) {
                spawnSparklesOnWave(pts, band, true);
            }
        });

        // ── SPARKLES ──
        drawSparkles();

        // Cap sparkle count to avoid memory bloat
        if (sparkles.length > 400) sparkles.splice(0, 100);

        time += 0.025;
        requestAnimationFrame(render);
    }

    render();
})();


// ═══════════════════════════════════════════
//  VOICE SYSTEM
// ═══════════════════════════════════════════
let voiceEnabled = true;

function speak(text, callback) {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.88;
    msg.pitch = 1;
    msg.volume = 1;

    const captionText = document.getElementById("captionText");
    if (captionText) captionText.textContent = text;

    const voices = speechSynthesis.getVoices();
    msg.voice = voices.find(v => v.lang === "en-US") || voices[0];

    if (callback) msg.onend = callback;
    speechSynthesis.speak(msg);
}

function initVoice() {
    speak("Welcome to Askari Digital Banking. Please enter your username and password to login.");
    setTimeout(() => {
        speak("If you are visually impaired, double tap anywhere on the screen or press the Voice Login button for guided voice access.");
    }, 4000);
}

// ─────────────────────────────────────────
//  REGISTRATION MODAL FUNCTIONS
// ─────────────────────────────────────────
let currentModal = null;

function showRegistrationModal() {
    const modal = document.getElementById("registerModal");

    if (!modal) return;

    modal.classList.add("active");
    currentModal = modal;

    const registrationError =
        document.getElementById("registrationError");

    if (registrationError) {
        registrationError.textContent = "";
        registrationError.classList.remove("show");
    }

    setTimeout(() => {
        document.getElementById("regFullName")?.focus();
    }, 200);

    speak(
        "Registration form opened. Please enter your details to create your Askari Bank account."
    );
}

function closeRegistrationModal() {
    if (currentModal) {
        currentModal.classList.remove("active");
        currentModal = null;
    }

    const form = document.getElementById("registrationForm");

    if (form) {
        form.reset();
    }
}

function showRegistrationError(message) {
    const error = document.getElementById("registrationError");

    if (!error) return;

    error.textContent = message;
    error.classList.add("show");

    speak(message);
}


function createNewAccount() {

    const fullName =
        document.getElementById("regFullName").value.trim();

    const username =
        document.getElementById("regUsername").value.trim();

    const cnic =
        document.getElementById("regCnic").value.trim();

    const mobile =
        document.getElementById("regMobile").value.trim();

    const email =
        document.getElementById("regEmail").value.trim();

    const accountType =
        document.getElementById("regAccountType").value;

    const password =
        document.getElementById("regPassword").value;

    const confirmPassword =
        document.getElementById("regConfirmPassword").value;


    // Basic validation
    if (
        !fullName ||
        !username ||
        !cnic ||
        !mobile ||
        !email ||
        !accountType ||
        !password ||
        !confirmPassword
    ) {
        showRegistrationError("Please fill in all fields.");
        return false;
    }


    // Password check
    if (password !== confirmPassword) {
        showRegistrationError("Passwords do not match.");
        return false;
    }


    // Password length
    if (password.length < 6) {
        showRegistrationError(
            "Password must contain at least 6 characters."
        );
        return false;
    }


    // Get existing users
    const users =
        JSON.parse(localStorage.getItem("jsonUsers")) || [];


    // Check duplicate username
    const usernameExists = users.some(
        user =>
            user.username.toLowerCase() === username.toLowerCase()
    );

    if (usernameExists) {
        showRegistrationError(
            "This username already exists. Please choose another username."
        );
        return false;
    }


    // Generate demo account number
    const accountNumber =
        "300" + Date.now().toString().slice(-9);


    // Create new user
    const newUser = {

        id: Date.now(),

        username: username,

        password: password,

        fullName: fullName,

        cnic: cnic,

        accountNumber: accountNumber,

        balance: 0,

        monthlyExpense: 0,

        dateOfBirth: "Not provided",

        gender: "Not provided",

        nationality: "Pakistani",

        accountType: accountType,

        iban: "PK36 ASKB " +
              accountNumber.replace(/-/g, ""),

        branchCode: "0042",

        branchName: "Askari Bank",

        openingDate:
            new Date().toLocaleDateString("en-GB"),

        mobile: mobile,

        email: email,

        address: "Not provided",

        cardNumber: "Not assigned",

        cardType: "Debit Card",

        expiryDate: "Not assigned",

        beneficiaries: []

    };


    // Add new user
    users.push(newUser);


    // Save ALL users
    localStorage.setItem(
        "jsonUsers",
        JSON.stringify(users)
    );


    // Update current session variable
    window.jsonUsers = users;


    console.log("✅ New account created:", newUser);


    // Close registration modal
    closeRegistrationModal();


    // Put credentials into login form
    const usernameInput =
        document.getElementById("usernameInput");

    const passwordInput =
        document.getElementById("passwordInput");

    if (usernameInput) {
        usernameInput.value = username;
    }

    if (passwordInput) {
        passwordInput.value = password;
    }


    speak(
        "Your Askari Bank account has been created successfully. Your username is " +
        username +
        ". You can now login."
    );


    return true;
}
// ─────────────────────────────────────────
//  DOUBLE-TAP DETECTION
// ─────────────────────────────────────────
let lastTap = 0;
let tapTimeout = null;

document.addEventListener("touchstart", (e) => {
    const now = Date.now();
    const gap = now - lastTap;
    const tag = e.target.tagName.toLowerCase();
    if (["input", "button", "a", "label"].includes(tag)) {
        lastTap = 0;
        return;
    }
    if (gap < 400 && gap > 0) {
        clearTimeout(tapTimeout);
        handleVIAccess();
        lastTap = 0;
    } else {
        lastTap = now;
        tapTimeout = setTimeout(() => { lastTap = 0; }, 450);
    }
}, { passive: true });

document.addEventListener("dblclick", (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (["input", "button", "a", "label"].includes(tag)) return;
    handleVIAccess();
});

// ─────────────────────────────────────────
//  VI ACCESS HANDLER
// ─────────────────────────────────────────
function handleVIAccess() {
    speak("Visually impaired mode activated. Starting guided voice login. You will now be taken to the voice login page.", () => {
        window.location.href = "login.html";
    });
    setTimeout(() => {
        window.location.href = "login.html";
    }, 3500);
}

// ─────────────────────────────────────────
//  LOGIN VALIDATION
// ─────────────────────────────────────────
function validateLogin(username, password) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("jsonUsers")) || [];
    
    console.log("Validating login for:", username);
    console.log("Available users:", users.map(u => u.username));
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        console.log("✅ User found:", user.fullName);
        // Store complete user data
        localStorage.setItem("loggedInUser", JSON.stringify(user));
    }
    
    return user;
}

function showError(msg) {
    const el = document.getElementById("errorMsg");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    speak(msg);
}

function clearError() {
    const el = document.getElementById("errorMsg");
    if (el) el.classList.remove("show");
}

// ─────────────────────────────────────────
//  MAIN DOM READY
// ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

    const loginBtn      = document.getElementById("loginBtn");
    const registerBtn   = document.getElementById("registerBtn");
    const viBtn         = document.getElementById("viBtn");
    const assistToggle  = document.getElementById("assistToggle");
    const eyeToggle     = document.getElementById("eyeToggle");
    const eyeIcon       = document.getElementById("eyeIcon");
    const passwordInput = document.getElementById("passwordInput");
    const usernameInput = document.getElementById("usernameInput");
    const forgotLink    = document.getElementById("forgotLink");
    const doubleTapHint = document.getElementById("doubleTapHint");
    const closeModalBtn = document.getElementById("closeModalBtn");


    // ── Voice init ──
    speechSynthesis.onvoiceschanged = initVoice;
    setTimeout(initVoice, 600);

    // ── AssistPay toggle ──
    if (assistToggle) {
        assistToggle.addEventListener("change", () => {
            voiceEnabled = assistToggle.checked;
            if (voiceEnabled) {
                speak("AssistPay voice assistant is now on.");
            } else {
                window.speechSynthesis.cancel();
                const captionText = document.getElementById("captionText");
                if (captionText) captionText.textContent = "Voice assistant is off.";
            }
        });
    }

    // ── Show/hide password ──
    if (eyeToggle && passwordInput) {
        eyeToggle.addEventListener("click", () => {
            const isHidden = passwordInput.type === "password";
            passwordInput.type = isHidden ? "text" : "password";
            eyeIcon.className = isHidden ? "fas fa-eye" : "fas fa-eye-slash";
            speak(isHidden ? "Password shown" : "Password hidden");
        });
    }

    // ── Input focus voice hints ──
    if (usernameInput) {
        usernameInput.addEventListener("focus", () => speak("Username field. Please type your username."));
    }
    if (passwordInput) {
        passwordInput.addEventListener("focus", () => speak("Password field. Please type your password."));
    }

    // ── REGISTER button - Show modal ──
    if (registerBtn) {
        registerBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showRegistrationModal();
        });
    }

    // ── Close modal handlers ──
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            closeRegistrationModal();
        });
    }
    
    // ── REGISTRATION FORM SUBMIT ──
const registrationForm = document.getElementById("registrationForm");
const cancelRegistrationBtn = document.getElementById("cancelRegistrationBtn");

if (registrationForm) {
    registrationForm.addEventListener("submit", (e) => {
        e.preventDefault();

        createNewAccount();
    });
}

// ── CANCEL REGISTRATION ──
if (cancelRegistrationBtn) {
    cancelRegistrationBtn.addEventListener("click", () => {
        closeRegistrationModal();
    });
}


    
    // Close modal when clicking outside
    const modalOverlay = document.getElementById("registerModal");
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                closeRegistrationModal();
            }
        });
    }

    // ── LOGIN button ──
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            clearError();
            const username = usernameInput ? usernameInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value.trim() : "";

            if (!username) {
                showError("Please enter your username.");
                usernameInput && usernameInput.focus();
                return;
            }
            if (!password) {
                showError("Please enter your password.");
                passwordInput && passwordInput.focus();
                return;
            }

            const user = validateLogin(username, password);
            if (!user) {
                showError("Incorrect username or password. Please try again.");
                return;
            }

            // Store the complete user data before redirecting
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            console.log("✅ User stored:", user.fullName);

            speak("Login successful! Welcome, " + user.fullName + ". Redirecting to your dashboard.", () => {
                window.location.href = "home.html";
            });
            setTimeout(() => { window.location.href = "home.html"; }, 2200);
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") loginBtn.click();
        });
    }

    // ── VI BUTTON ──
    if (viBtn) {
        viBtn.addEventListener("click", () => handleVIAccess());
    }

    // ── Double-tap hint click ──
    if (doubleTapHint) {
        doubleTapHint.addEventListener("click", () => {
            speak("Double tap anywhere on the screen to activate voice login for visually impaired users.");
        });
    }

    // ── Forgot password ──
    if (forgotLink) {
        forgotLink.addEventListener("click", (e) => {
            e.preventDefault();
            speak("Forgot password feature. Please contact Askari Bank helpline or visit your nearest branch.");
        });
    }

    // ── Triple-tap to speak element label ──
    let tripleTapCount = 0;
    let tripleTapTimer = null;
    let tripleTapTarget = null;

    document.addEventListener("touchstart", (e) => {
        if (tripleTapTarget !== e.target) {
            tripleTapCount = 0;
            tripleTapTarget = e.target;
        }
        tripleTapCount++;
        clearTimeout(tripleTapTimer);
        tripleTapTimer = setTimeout(() => {
            if (tripleTapCount >= 3) {
                const label = e.target.getAttribute("aria-label")
                           || e.target.textContent.trim().slice(0, 60);
                if (label) speak(label);
            }
            tripleTapCount = 0;
        }, 500);
    }, { passive: true });

});

// ═══════════════════════════════════════════
//  JSON DATA INTEGRATION (ADDED - NO CHANGES ABOVE)
// ═══════════════════════════════════════════




// Override login behavior WITHOUT removing original


