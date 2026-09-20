const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

const storedFacesDir = path.join(__dirname, 'stored-faces');

async function compareFaces(imagePath1, imagePath2) {
    try {
        const img1 = await loadImage(imagePath1);
        const img2 = await loadImage(imagePath2);
        
        const size = 100;
        const canvas1 = createCanvas(size, size);
        const canvas2 = createCanvas(size, size);
        const ctx1 = canvas1.getContext('2d');
        const ctx2 = canvas2.getContext('2d');
        
        ctx1.imageSmoothingEnabled = true;
        ctx2.imageSmoothingEnabled = true;
        ctx1.drawImage(img1, 0, 0, size, size);
        ctx2.drawImage(img2, 0, 0, size, size);
        
        const data1 = ctx1.getImageData(0, 0, size, size).data;
        const data2 = ctx2.getImageData(0, 0, size, size).data;
        
        // Simple pixel comparison
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
        const similarity = Math.max(0, Math.min(100, 100 - (avgDiff / 255 * 100)));
        
        return similarity;
    } catch (error) {
        console.error('Error:', error.message);
        return 0;
    }
}

async function testAllComparisons() {
    console.log('\n🔍 TESTING ALL FACE COMPARISONS\n');
    console.log('Stored Faces Directory:', storedFacesDir);
    console.log('='.repeat(60));
    
    const files = fs.readdirSync(storedFacesDir);
    const imageFiles = files.filter(f => 
        f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
    );
    
    console.log(`\n📸 Found ${imageFiles.length} images:\n`);
    imageFiles.forEach((f, i) => console.log(`   ${i+1}. ${f}`));
    
    console.log('\n' + '='.repeat(60));
    console.log('COMPARING EACH IMAGE WITH ITSELF (Should be ~100%):');
    console.log('='.repeat(60) + '\n');
    
    for (const file of imageFiles) {
        const imagePath = path.join(storedFacesDir, file);
        const similarity = await compareFaces(imagePath, imagePath);
        console.log(`${file} vs ${file}`);
        console.log(`   → Similarity: ${similarity.toFixed(2)}%\n`);
    }
    
    if (imageFiles.length >= 2) {
        console.log('='.repeat(60));
        console.log('COMPARING DIFFERENT IMAGES:');
        console.log('='.repeat(60) + '\n');
        
        for (let i = 0; i < imageFiles.length; i++) {
            for (let j = i + 1; j < imageFiles.length; j++) {
                const path1 = path.join(storedFacesDir, imageFiles[i]);
                const path2 = path.join(storedFacesDir, imageFiles[j]);
                const similarity = await compareFaces(path1, path2);
                
                console.log(`${imageFiles[i]} vs ${imageFiles[j]}`);
                console.log(`   → Similarity: ${similarity.toFixed(2)}%\n`);
            }
        }
    }
}

testAllComparisons().catch(console.error);