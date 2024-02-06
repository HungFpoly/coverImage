const fs = require('fs');
const express = require('express');
const { createCanvas, loadImage } = require('canvas');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const imageUrl = 'image/test.jpg'; // Thay thế đường dẫn bằng hình ảnh thực tế
    const rows = 6;
    const cols = 12;

    loadImage(imageUrl).then((img) => {
        const tileWidth = img.width / cols;
        const tileHeight = img.height / rows;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const canvas = createCanvas(tileWidth, tileHeight);
                const context = canvas.getContext('2d');

                const sx = col * tileWidth;
                const sy = row * tileHeight;

                context.drawImage(img, sx, sy, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);

                // Lưu file vào thư mục với định dạng JPEG và chất lượng cao
                const buffer = canvas.toBuffer('image/jpeg', { quality: 1 });
                const fileName = `output/slice_${row}_${col}.jpg`;
                fs.writeFileSync(fileName, buffer);
            }
        }

        res.send('Images sliced and saved!');
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
