const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendPath = 'C:\\Users\\M4 Tech\\Downloads\\HCI Final Project\\HCI Final Project';
app.use(express.static(frontendPath));
app.use('/stored-faces', express.static(path.join(__dirname, 'stored-faces')));

const uploadDir = path.join(__dirname, 'temp-uploads');
const storedFacesDir = path.join(__dirname, 'stored-faces');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(storedFacesDir)) fs.mkdirSync(storedFacesDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage: storage });

// Load stored faces
let storedFaces = [];

function loadStoredFaces() {
    try {
        const files = fs.readdirSync(storedFacesDir);
        storedFaces = files.filter(f => 
            f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
        ).map(file => ({
            userId: path.parse(file).name.split('-')[0].split('_')[0],
            file: file,
            path: path.join(storedFacesDir, file)
        }));
        
        console.log('\n📸 REGISTERED FACES:');
        storedFaces.forEach(face => console.log(`   👤 ${face.userId} - ${face.file}`));
        return storedFaces;
    } catch (error) {
        return [];
    }
}

loadStoredFaces();

async function compareFaces(imagePath1, imagePath2) {
    try {
        const img1 = await loadImage(imagePath1);
        const img2 = await loadImage(imagePath2);
        
        const canvas1 = createCanvas(100, 100);
        const canvas2 = createCanvas(100, 100);
        const ctx1 = canvas1.getContext('2d');
        const ctx2 = canvas2.getContext('2d');
        
        ctx1.drawImage(img1, 0, 0, 100, 100);
        ctx2.drawImage(img2, 0, 0, 100, 100);
        
        const data1 = ctx1.getImageData(0, 0, 100, 100).data;
        const data2 = ctx2.getImageData(0, 0, 100, 100).data;
        
        let totalDiff = 0;
        let pixels = 0;
        
        for (let i = 0; i < data1.length; i += 4) {
            const rDiff = Math.abs(data1[i] - data2[i]);
            const gDiff = Math.abs(data1[i+1] - data2[i+1]);
            const bDiff = Math.abs(data1[i+2] - data2[i+2]);
            totalDiff += (rDiff + gDiff + bDiff) / 3;
            pixels++;
        }
        
        const avgDiff = totalDiff / pixels;
        return Math.max(0, Math.min(100, 100 - (avgDiff / 255 * 100)));
    } catch (error) {
        return 0;
    }
}

// ULTRA STRICT - 95% THRESHOLD
app.post('/api/verify-face-simple', upload.single('image'), async (req, res) => {
    console.log('\n🔍 FACE VERIFICATION (95% Threshold)');
    
    try {
        if (!req.file) {
            return res.json({ success: false, matched: false });
        }
        
        if (storedFaces.length === 0) {
            await fs.remove(req.file.path).catch(() => {});
            return res.json({ success: false, matched: false });
        }
        
        const uploadedPath = req.file.path;
        let bestMatch = null;
        let bestScore = 0;
        
        for (const face of storedFaces) {
            const score = await compareFaces(uploadedPath, face.path);
            console.log(`   ${face.userId}: ${score.toFixed(2)}%`);
            
            // ULTRA STRICT - 95%
            if (score > bestScore && score >= 95) {
                bestScore = score;
                bestMatch = face;
            }
        }
        
        await fs.remove(uploadedPath).catch(() => {});
        
        if (bestMatch) {
            console.log(`✅ MATCH: ${bestMatch.userId} (${bestScore.toFixed(2)}%)\n`);
            res.json({ success: true, matched: true, userId: bestMatch.userId });
        } else {
            console.log(`❌ NO MATCH (Best: ${bestScore.toFixed(2)}%)\n`);
            res.json({ success: false, matched: false });
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, matched: false });
    }
});

app.get('/api/registered-users', (req, res) => {
    const users = [...new Set(storedFaces.map(f => f.userId))];
    res.json({ success: true, users: users });
});

app.get('/api/get-user-faces/:userId', (req, res) => {
    const { userId } = req.params;
    const userImages = storedFaces.filter(f => f.userId === userId).map(f => f.file);
    res.json({ success: true, images: userImages });
});

app.get('/api/test', (req, res) => {
    res.json({ success: true });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 ASKARI BANK - ULTRA STRICT FACE VERIFICATION');
    console.log('='.repeat(50));
    console.log(`✅ Server: http://localhost:${PORT}`);
    console.log(`📁 Stored Faces: ${storedFacesDir}`);
    console.log(`\n📸 ${storedFaces.length} face(s) registered:`);
    storedFaces.forEach(face => console.log(`   👤 ${face.userId}`));
    console.log('\n⚠️  THRESHOLD: 95% - Only exact matches work!');
    console.log('='.repeat(50) + '\n');
});