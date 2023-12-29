const fs = require('fs');
const sharp = require('sharp');
// Kích thước của từng phần nhỏ
const partWidth = 4816;
const partHeight = 3072;
async function textToImage(inputFolder, outputImagePath, partWidth, partHeight) {
    const partFiles = fs.readdirSync(inputFolder);
  
    if (partFiles.length === 0) {
      console.error('No part files found.');
      return;
    }
    
    // Chuyển đổi từng file văn bản thành ảnh và lưu vào mảng
    const images = await Promise.all(partFiles.map(async (partFile) => {
      const base64Data = fs.readFileSync(`${inputFolder}/${partFile}`, 'utf-8');
      const buffer = Buffer.from(base64Data, 'base64');
      return sharp(buffer);
    }));
  
    const firstImageMetadata = await images[0].metadata();
  
    // Gộp ảnh
    const mergedImage = await sharp({
      create: {
        width: partWidth * Math.ceil(firstImageMetadata.width / partWidth),
        height: partHeight * Math.ceil(firstImageMetadata.height / partHeight),
        channels: 4, // Số kênh màu (4 cho RGBA)
        background: { r: 255, g: 255, b: 255, alpha: 1 } // Màu nền
      }
    });
  
    // Sử dụng phương thức composite để gộp ảnh
    for (const image of images) {
      mergedImage.composite([{ input: await image.toBuffer(), left: 0, top: 0 }]);
    }
  
    // Ghi ảnh gộp vào file với định dạng PNG
    await mergedImage.toFormat('png').toFile(outputImagePath);
    console.log('Text to image conversion completed.');
}
  
  // Gọi hàm chuyển đổi
  textToImage('text', 'output.png', partWidth, partHeight)
    .then(() => console.log('Conversion completed successfully'))
    .catch((error) => console.error('Error:', error));
  