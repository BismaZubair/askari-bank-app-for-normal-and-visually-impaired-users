let cnicVisible = false;
let accountVisible = false;
let mobileVisible = false;
let emailVisible = false;
let cardVisible = false;
let expiryVisible = false;
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
// ACCOUNT INFO JS - WITH VI MODE & COPY FEATURES
// ================================================
let voiceEnabled = true;
let welcomeDone = false;
let viModeActive = false;

// Get user data from localStorage
function getUserData() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
        return {
            fullName: user.fullName || "Not Available",
            dob: user.dateOfBirth || "Not Available",
            gender: user.gender || "Not Available",
            cnic: user.cnic || "Not Available",
            nationality: user.nationality || "Pakistani",
            accountNumber: user.accountNumber || "Not Available",
            accountType: user.accountType || "Current Account",
            iban: user.iban || "Not Available",
            branchCode: user.branchCode || "Not Available",
            branchName: user.branchName || "Not Available",
            openingDate: user.openingDate || "Not Available",
            mobile: user.mobile || "Not Available",
            email: user.email || "Not Available",
            address: user.address || "Not Available",
            cardNumber: user.cardNumber || "Not Available",
            cardType: user.cardType || "Not Available",
            expiryDate: user.expiryDate || "Not Available",
            totalBalance: user.balance || 0,
            monthlyExpense: user.monthlyExpense || 0
        };
    }
    return {};
}

const sensitiveData = getUserData();

function getField(key) {
    return sensitiveData?.[key] || "Not Available";
}

function setCaption(text) {
    const el = document.getElementById("captionText");
    if (el) el.textContent = text;
}

function speak(text, onEnd) {
    if (!voiceEnabled) {
        if (onEnd) onEnd();
        return;
    }
    setCaption(text);
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.88;
    msg.pitch = 1;
    msg.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === "en-US") || voices[0];
    if (preferred) msg.voice = preferred;
    if (onEnd) msg.onend = onEnd;
    window.speechSynthesis.speak(msg);
}

// Toggle functions for sensitive data
function initToggles() {

    // ================= CNIC =================
    const toggleCnic = document.getElementById("toggleCnic");
    const cnicEl = document.getElementById("cnic");
    let cnicVisible = false;

    if (toggleCnic && cnicEl) {
        toggleCnic.addEventListener("click", () => {
            cnicVisible = !cnicVisible;

            const cnicValue = getField("cnic");

            cnicEl.textContent = cnicVisible
                ? cnicValue
                : mask(cnicValue, "cnic");

            toggleCnic.innerHTML = cnicVisible
                ? '<i class="fas fa-eye"></i>'
                : '<i class="fas fa-eye-slash"></i>';

            speak(
                cnicVisible
                    ? "CNIC number shown. It is " + cnicValue
                    : "CNIC number hidden"
            );
        });
    }

    // ================= ACCOUNT =================
    const toggleAccount = document.getElementById("toggleAccount");
    const accountEl = document.getElementById("accountNumber");
    let accountVisible = false;

    if (toggleAccount && accountEl) {
        toggleAccount.addEventListener("click", () => {
            accountVisible = !accountVisible;

            const accountValue = getField("accountNumber");

            accountEl.textContent = accountVisible
                ? accountValue
                : mask(accountValue, "accountNumber");

            toggleAccount.innerHTML = accountVisible
                ? '<i class="fas fa-eye"></i>'
                : '<i class="fas fa-eye-slash"></i>';

            speak(
                accountVisible
                    ? "Account number shown. It is " + accountValue
                    : "Account number hidden"
            );
        });
    }

    // ================= MOBILE =================
    const toggleMobile = document.getElementById("toggleMobile");
    const mobileEl = document.getElementById("mobile");
    let mobileVisible = false;

    if (toggleMobile && mobileEl) {
        toggleMobile.addEventListener("click", () => {
            mobileVisible = !mobileVisible;

            const mobileValue = getField("mobile");

            mobileEl.textContent = mobileVisible
                ? mobileValue
                : mask(mobileValue, "mobile");

            toggleMobile.innerHTML = mobileVisible
                ? '<i class="fas fa-eye"></i>'
                : '<i class="fas fa-eye-slash"></i>';

            speak(
                mobileVisible
                    ? "Mobile number shown. It is " + mobileValue
                    : "Mobile number hidden"
            );
        });
    }

    // ================= EMAIL =================
    const toggleEmail = document.getElementById("toggleEmail");
    const emailEl = document.getElementById("email");
    let emailVisible = false;

    if (toggleEmail && emailEl) {
        toggleEmail.addEventListener("click", () => {
            emailVisible = !emailVisible;

            const emailValue = getField("email");

            emailEl.textContent = emailVisible
                ? emailValue
                : mask(emailValue, "email");

            toggleEmail.innerHTML = emailVisible
                ? '<i class="fas fa-eye"></i>'
                : '<i class="fas fa-eye-slash"></i>';

            speak(
                emailVisible
                    ? "Email address shown. It is " + emailValue
                    : "Email address hidden"
            );
        });
    }

    // ================= CARD =================
    const toggleCard = document.getElementById("toggleCard");
    const cardEl = document.getElementById("cardNumber");
    let cardVisible = false;

    if (toggleCard && cardEl) {
        toggleCard.addEventListener("click", () => {
            cardVisible = !cardVisible;

            const cardValue = getField("cardNumber");

            cardEl.textContent = cardVisible
                ? cardValue
                : mask(cardValue, "cardNumber");

            toggleCard.innerHTML = cardVisible
                ? '<i class="fas fa-eye"></i>'
                : '<i class="fas fa-eye-slash"></i>';

            speak(
                cardVisible
                    ? "Card number shown. It is " + cardValue
                    : "Card number hidden"
            );
        });
    }

    // ================= EXPIRY =================
    const toggleExpiry = document.getElementById("toggleExpiry");
    const expiryEl = document.getElementById("expiryDate");
    let expiryVisible = false;

    if (toggleExpiry && expiryEl) {
        toggleExpiry.addEventListener("click", () => {
            expiryVisible = !expiryVisible;

            const expiryValue = getField("expiryDate");

            expiryEl.textContent = expiryVisible
                ? expiryValue
                : mask(expiryValue, "expiryDate");

            toggleExpiry.innerHTML = expiryVisible
                ? '<i class="fas fa-eye"></i>'
                : '<i class="fas fa-eye-slash"></i>';

            speak(
                expiryVisible
                    ? "Expiry date shown. It is " + expiryValue
                    : "Expiry date hidden"
            );
        });
    }
}

// Copy to clipboard functionality
function initCopyButtons() {
    const copyBtns = document.querySelectorAll(".copy-btn");
    copyBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const targetId = btn.getAttribute("data-copy");
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                const textToCopy = targetEl.textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    speak("Copied to clipboard: " + textToCopy);
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                }).catch(() => {
                    speak("Failed to copy. Please try again.");
                });
            }
        });
    });
}

// Triple tap on any tappable element to hear its label
function initTripleTap() {
    const items = document.querySelectorAll(".tappable, .stat-card, .info-row, .copy-btn, .eye-toggle-small");
    items.forEach(item => {
        let itemTaps = 0;
        let itemTimer = null;
        item.addEventListener("click", (e) => {
            if (!welcomeDone && !viModeActive) return;
            
            itemTaps++;
            if (itemTimer) clearTimeout(itemTimer);
            
            itemTimer = setTimeout(() => {
                const count = itemTaps;
                itemTaps = 0;
                
                if (count >= 3) {
                    const label = item.getAttribute("data-label") || 
                                 item.querySelector(".info-label")?.textContent ||
                                 item.querySelector(".stat-label")?.textContent ||
                                 "this item";
                    items.forEach(i => i.classList.remove("triple-tap-focus"));
                    item.classList.add("triple-tap-focus");
                    setTimeout(() => item.classList.remove("triple-tap-focus"), 2000);
                    speak(label + ". Tap once to select or copy.");
                } else if (count === 2) {
                    const label = item.getAttribute("data-label") || 
                                 item.querySelector(".info-label")?.textContent ||
                                 item.querySelector(".stat-label")?.textContent ||
                                 "this item";
                    speak(label);
                }
            }, 600);
        });
    });
}

// Visually Impaired Mode
function initVIMode() {
    const viBtn = document.getElementById("viModeBtn");
    if (!viBtn) return;
    
    viBtn.addEventListener("click", () => {
        viModeActive = !viModeActive;
        viBtn.classList.toggle("active", viModeActive);
        
        if (viModeActive) {
            speak("Visually impaired mode activated. Tap on any field to hear its content. Triple tap to hear the field name again. Eye buttons can be used to reveal hidden information.");
            // Highlight all tappable areas
            document.querySelectorAll(".info-row, .stat-card").forEach(el => {
                el.style.borderLeft = "3px solid var(--accent)";
            });
        } else {
            speak("Visually impaired mode deactivated.");
            document.querySelectorAll(".info-row, .stat-card").forEach(el => {
                el.style.borderLeft = "none";
            });
        }
    });
}

// Tap to speak on info rows when VI mode is active
function initTapToSpeak() {
    const infoRows = document.querySelectorAll(".info-row, .stat-card");
    infoRows.forEach(row => {
        row.addEventListener("click", (e) => {
            if (viModeActive && !e.target.closest(".copy-btn") && !e.target.closest(".eye-toggle-small")) {
                const label = row.querySelector(".info-label")?.textContent || 
                             row.querySelector(".stat-label")?.textContent;
                const value = row.querySelector(".info-value")?.textContent ||
                             row.querySelector(".stat-value")?.textContent;
                if (label && value) {
                    speak(label + ": " + value);
                }
            }
        });
    });
}
// Update balance displays on page load
function updateBalanceDisplays() {
    const totalBalanceEl = document.getElementById("totalBalance");
    const monthlyExpenseEl = document.getElementById("monthlyExpense");
    
    if (totalBalanceEl && sensitiveData.totalBalance) {
        totalBalanceEl.textContent = `PKR ${sensitiveData.totalBalance.toLocaleString()}`;
    }
    if (monthlyExpenseEl && sensitiveData.monthlyExpense) {
        monthlyExpenseEl.textContent = `PKR ${sensitiveData.monthlyExpense.toLocaleString()}`;
    }
}
// Update all account information fields from localStorage
function updateAllAccountInfo() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;
    
    // Personal Information
    if(document.getElementById("fullName")) document.getElementById("fullName").textContent = user.fullName || "Not Available";
    if(document.getElementById("dob")) document.getElementById("dob").textContent = user.dateOfBirth || "Not Available";
    if(document.getElementById("gender")) document.getElementById("gender").textContent = user.gender || "Not Available";
    if(document.getElementById("nationality")) document.getElementById("nationality").textContent = user.nationality || "Pakistani";
    
    // Store actual values for toggles
    window.actualCnic = user.cnic || "Not Available";
    window.actualAccountNumber = user.accountNumber || "Not Available";
    window.actualMobile = user.mobile || "Not Available";
    window.actualEmail = user.email || "Not Available";
    window.actualCardNumber = user.cardNumber || "Not Available";
    window.actualExpiry = user.expiryDate || "Not Available";
    
    // Account Details
    if(document.getElementById("accountType")) document.getElementById("accountType").textContent = user.accountType || "Not Available";
    if(document.getElementById("iban")) document.getElementById("iban").textContent = user.iban || "Not Available";
    if(document.getElementById("branchCode")) document.getElementById("branchCode").textContent = user.branchCode || "Not Available";
    if(document.getElementById("branchName")) document.getElementById("branchName").textContent = user.branchName || "Not Available";
    if(document.getElementById("openingDate")) document.getElementById("openingDate").textContent = user.openingDate || "Not Available";
    
    // Contact Information
    if(document.getElementById("address")) document.getElementById("address").textContent = user.address || "Not Available";
    
    // Card Information
    if(document.getElementById("cardType")) document.getElementById("cardType").textContent = user.cardType || "Not Available";
}
async function runWelcome() {
    if (!voiceEnabled) return;
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const userName = user?.fullName?.split(" ")[0] || "";
    await speak("Account Information page. Welcome " + userName + ". Here you can view your personal information, account details, contact information, and card details. Sensitive information like CNIC and account number are hidden for security. Use the eye buttons to reveal them. Tap the copy button next to any field to copy its content to clipboard. Triple tap on any field to hear its name. Double tap the back button to return to profile.");
    welcomeDone = true;
}

function initWelcomeTrigger() {
    let triggered = false;
    const handler = () => {
        if (triggered || !voiceEnabled) return;
        triggered = true;
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) runWelcome();
        else window.speechSynthesis.onvoiceschanged = () => runWelcome();
    };
    document.addEventListener("click", handler);
    document.addEventListener("touchstart", handler);
}

function initBackBtn() {
    const btn = document.getElementById("backBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
        if (voiceEnabled) {
            speak("Going back to profile.").then(() => {
                window.location.href = "myProfile.html";
            });
        } else {
            window.location.href = "myProfile.html";
        }
    });
}

function initAssistToggle() {
    const toggle = document.getElementById("assistToggle");
    const subText = document.querySelector(".assist-sub");
    if (!toggle) return;
    
    toggle.addEventListener("change", () => {
        voiceEnabled = toggle.checked;
        if (voiceEnabled) {
            if (subText) subText.textContent = "Voice Assistant is On";
            setCaption("Voice assistant enabled.");
            speak("Voice assistant enabled.");
        } else {
            if (subText) subText.textContent = "Voice Assistant is Off";
            window.speechSynthesis.cancel();
            setCaption("Voice assistant is off");
        }
    });
}
function mask(value, type) {
    if (!value) return "";

    switch (type) {
        case "cnic":
            return "*****-*******-*";
        case "accountNumber":
            return "****-****-****-" + value.slice(-4);
        case "mobile":
            return "+92 *** *** ****";
        case "email":
            return value.replace(/(.{1}).+(@.+)/, "$1****$2");
        case "cardNumber":
            return "****-****-****-" + value.slice(-4);
        case "expiryDate":
            return "**/**";
        default:
            return value;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    updateBalanceDisplays();
    updateAllAccountInfo();
    initAssistToggle();
    initBackBtn();
    initToggles();
    initCopyButtons();
    initTripleTap();
    initVIMode();
    initTapToSpeak();
    initWelcomeTrigger();
    window.speechSynthesis.getVoices();
});