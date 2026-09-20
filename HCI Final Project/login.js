// ═══════════════════════════════════════════
//  ASKARI BANK - REAL FACE RECOGNITION
//  Using face-api.js CDN (No models folder needed!)
// ═══════════════════════════════════════════

const BACKEND_URL = 'http://localhost:3001';

let step1Done = false;
let step2Done = false;
let currentStream = null;
let videoElement = null;
let canvasElement = null;
let faceMatcher = null;
let modelsLoaded = false;

// ============================================
// VOICE SYSTEM
// ============================================
function speak(text, callback) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.9;
    msg.pitch = 1;
    msg.volume = 1;
    const voices = speechSynthesis.getVoices();
    msg.voice = voices.find(v => v.lang === "en-US") || voices[0];
    if (callback) msg.onend = callback;
    speechSynthesis.speak(msg);
    const voiceText = document.getElementById("voiceText");
    if (voiceText) voiceText.innerHTML = "🔊 " + text;
}

function showOverlay(text) {
    const overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.classList.remove("hidden");
        document.getElementById("overlayText").innerText = text;
    }
}

function hideOverlay() {
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.classList.add("hidden");
}

// ============================================
// LOAD FACE MODELS (Using CDN - No local models needed!)
// ============================================
async function loadFaceModels() {
    const statusDiv = document.getElementById("faceStatus");
    if (statusDiv) {
        statusDiv.innerHTML = "📥 Loading face recognition...";
    }
    
    try {
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        
        modelsLoaded = true;
        console.log("✅ Models loaded from CDN");
        
        if (statusDiv) {
            statusDiv.innerHTML = "✅ Models ready! Loading faces...";
            statusDiv.style.color = "#00ff00";
        }
        
        await loadStoredFaces();
        return true;
    } catch (error) {
        console.error("Model load error:", error);
        if (statusDiv) {
            statusDiv.innerHTML = "❌ Loading failed. Check internet connection.";
            statusDiv.style.color = "#ff4444";
        }
        return false;
    }
}

// ============================================
// LOAD STORED FACES FROM BACKEND
// ============================================
async function loadStoredFaces() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/registered-users`);
        const data = await res.json();
        
        if (!data.users || data.users.length === 0) {
            console.log("No registered users");
            const statusDiv = document.getElementById("faceStatus");
            if (statusDiv) {
                statusDiv.innerHTML = "⚠️ No faces found! Add photos to stored-faces folder.";
                statusDiv.style.color = "#ffaa00";
            }
            return;
        }
        
        const labeledDescriptors = [];
        
        for (const userId of data.users) {
            const facesRes = await fetch(`${BACKEND_URL}/api/get-user-faces/${userId}`);
            const facesData = await facesRes.json();
            
            for (const imageFile of facesData.images) {
                try {
                    const img = new Image();
                    img.src = `${BACKEND_URL}/stored-faces/${imageFile}`;
                    await new Promise((resolve) => { img.onload = resolve; });
                    
                    const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceDescriptor();
                    
                    if (detection) {
                        labeledDescriptors.push(
                            new faceapi.LabeledFaceDescriptors(userId, [detection.descriptor])
                        );
                        console.log(`✅ Loaded: ${userId} (${imageFile})`);
                    } else {
                        console.log(`❌ No face detected in: ${imageFile}`);
                    }
                } catch (err) {
                    console.error(`Error loading ${imageFile}:`, err);
                }
            }
        }
        
        if (labeledDescriptors.length > 0) {
            faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
            console.log(`✅ Face matcher ready with ${labeledDescriptors.length} face(s)`);
            const statusDiv = document.getElementById("faceStatus");
            if (statusDiv) {
                statusDiv.innerHTML = "✅ Ready! Click Verify Face";
                statusDiv.style.color = "#00ff00";
            }
        }
    } catch (error) {
        console.error("Error loading stored faces:", error);
    }
}

// ============================================
// CAMERA FUNCTIONS
// ============================================
function createCameraInterface() {
    const step2Content = document.querySelector("#step2 .content");
    if (!step2Content) return;
    if (document.getElementById("cameraInterface")) return;
    
    const cameraDiv = document.createElement("div");
    cameraDiv.id = "cameraInterface";
    cameraDiv.style.cssText = `
        margin-top: 15px;
        text-align: center;
        display: none;
    `;
    
    cameraDiv.innerHTML = `
        <video id="faceVideo" autoplay playsinline style="width: 100%; max-width: 300px; border-radius: 10px; border: 2px solid #00c8ff;"></video>
        <canvas id="faceCanvas" style="display: none;"></canvas>
        <div style="margin-top: 10px;">
            <button id="verifyFaceBtn" style="background: linear-gradient(135deg, #00c8ff, #0080aa); padding: 8px 20px; border-radius: 20px; border: none; color: white; cursor: pointer;">🔍 Verify Face</button>
            <button id="retryFaceBtn" style="margin-top: 10px; background: rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 20px; border: none; color: white; display: none; cursor: pointer;">🔄 Retry</button>
        </div>
        <div id="faceStatus" style="margin-top: 10px; font-size: 12px; color: #00c8ff;"></div>
    `;
    
    step2Content.appendChild(cameraDiv);
    videoElement = document.getElementById("faceVideo");
    canvasElement = document.getElementById("faceCanvas");
    
    document.getElementById("verifyFaceBtn").onclick = captureAndVerifyFace;
    document.getElementById("retryFaceBtn").onclick = retryFaceCapture;
}

async function startFaceCamera() {
    try {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        currentStream = stream;
        
        if (videoElement) {
            videoElement.srcObject = stream;
            const statusDiv = document.getElementById("faceStatus");
            if (statusDiv) {
                if (!modelsLoaded) {
                    statusDiv.innerHTML = "⏳ Loading models... Please wait";
                } else if (!faceMatcher) {
                    statusDiv.innerHTML = "⚠️ Loading faces... Please wait";
                } else {
                    statusDiv.innerHTML = "🎥 Camera ready. Click Verify Face";
                    statusDiv.style.color = "#00ff00";
                }
            }
        }
    } catch (err) {
        speak("Unable to access camera.");
        const statusDiv = document.getElementById("faceStatus");
        if (statusDiv) {
            statusDiv.innerHTML = "❌ Camera access denied";
            statusDiv.style.color = "#ff4444";
        }
    }
}

function stopFaceCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    if (videoElement) videoElement.srcObject = null;
}

function retryFaceCapture() {
    if (videoElement && videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        startFaceCamera();
    }
}

// ============================================
// MAIN: CAPTURE AND VERIFY FACE
// ============================================
async function captureAndVerifyFace() {
    if (!videoElement || !canvasElement) return;
    
    const statusDiv = document.getElementById("faceStatus");
    const verifyBtn = document.getElementById("verifyFaceBtn");
    const retryBtn = document.getElementById("retryFaceBtn");
    
    if (!modelsLoaded) {
        statusDiv.innerHTML = "❌ Models still loading. Please wait...";
        return;
    }
    
    if (!faceMatcher) {
        statusDiv.innerHTML = "❌ No registered faces found. Add photos to stored-faces folder.";
        return;
    }
    
    statusDiv.innerHTML = "🔍 Detecting face...";
    verifyBtn.disabled = true;
    
    const context = canvasElement.getContext("2d");
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    try {
        const detection = await faceapi.detectSingleFace(canvasElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();
        
        if (!detection) {
            statusDiv.innerHTML = "❌ No face detected! Look at camera.";
            statusDiv.style.color = "#ff4444";
            verifyBtn.disabled = false;
            retryBtn.style.display = "inline-block";
            speak("No face detected. Please look directly at camera.");
            return;
        }
        
        statusDiv.innerHTML = "🔍 Matching with database...";
        
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        
        if (bestMatch.label !== 'unknown' && bestMatch.distance < 0.4) {
            statusDiv.innerHTML = `✅ Welcome ${bestMatch.label}!`;
            statusDiv.style.color = "#00ff00";
            
            localStorage.setItem("loggedInUser", JSON.stringify({
                username: bestMatch.label,
                fullName: bestMatch.label
            }));
            
            setTimeout(() => {
                step2Done = true;
                document.getElementById("step2").classList.add("completed");
                stopFaceCamera();
                document.getElementById("cameraInterface").style.display = "none";
                speak(`Welcome ${bestMatch.label}! Face verified. You can now login.`, () => {
                    checkAll();
                });
            }, 1500);
        } else {
            statusDiv.innerHTML = "❌ NOT REGISTERED - Your face is not in our database";
            statusDiv.style.color = "#ff4444";
            verifyBtn.disabled = false;
            retryBtn.style.display = "inline-block";
            speak("Sorry, your face is not registered with Askari Bank.");
        }
        
    } catch (error) {
        console.error("Face detection error:", error);
        statusDiv.innerHTML = "❌ Face detection failed. Please try again.";
        verifyBtn.disabled = false;
        retryBtn.style.display = "inline-block";
    }
}

// ============================================
// CHECK ALL STEPS (SIRF EK BAAR)
// ============================================
function checkAll() {
    if (step1Done && step2Done) {
        const loginBtn = document.getElementById("finalLogin");
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.style.opacity = "1";
            loginBtn.style.cursor = "pointer";
            speak("All authentication steps completed. You may now click the Login button.");
        }
        return true;
    }
    return false;
}

// ============================================
// STEP 1: FINGERPRINT
// ============================================
function startFingerprint() {
    if (step1Done) {
        speak("Fingerprint already completed. Please proceed to face recognition.");
        return;
    }
    
    speak("Step 1. Fingerprint Recognition. Please place your finger on the scanner.", () => {
        showOverlay("Scanning Fingerprint...");
        setTimeout(() => {
            hideOverlay();
            step1Done = true;
            document.getElementById("step1").classList.add("completed");
            speak("Fingerprint verified! Step 1 completed. Please proceed to step 2: Face Recognition.", () => {
                document.getElementById("step2").scrollIntoView({ behavior: 'smooth', block: 'center' });
                const cameraInterface = document.getElementById("cameraInterface");
                if (cameraInterface) {
                    cameraInterface.style.display = "block";
                    startFaceCamera();
                }
            });
        }, 2000);
    });
}

// ============================================
// STEP 2: FACE RECOGNITION
// ============================================
function startFace() {
    if (!step1Done) {
        speak("Please complete fingerprint first.");
        return;
    }
    
    if (step2Done) {
        speak("Face already verified. Click Login.");
        return;
    }
    
    speak("Step 2. Face Recognition. Look at camera and click Verify Face.");
    
    createCameraInterface();
    const cameraInterface = document.getElementById("cameraInterface");
    if (cameraInterface) {
        cameraInterface.style.display = "block";
        startFaceCamera();
    }
}

// ============================================
// BACK BUTTON
// ============================================
function goBack() {
    speak("Going back to main menu.");
    stopFaceCamera();
    setTimeout(() => {
        window.location.href = "index.html";
    }, 800);
}

// ============================================
// FINAL LOGIN
// ============================================
document.getElementById("finalLogin").onclick = () => {
    if (step1Done && step2Done) {
        speak("Authentication complete. Logging you in. Please wait.");
        stopFaceCamera();
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1500);
    } else {
        speak("Please complete both authentication steps before logging in.");
    }
};

// ============================================
// INITIALIZE
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    console.log('Voice Login Page Loaded');
    createCameraInterface();
    loadFaceModels(); // Call this to load models!
    
    setTimeout(() => {
        speak("Welcome to Askari Bank Voice Banking. Please complete fingerprint and face recognition to login.");
    }, 1000);
});

// Voice initialization
speechSynthesis.onvoiceschanged = () => {
    console.log("Voice ready");
};