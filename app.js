const fs = require('fs');
const sharp = require('sharp');

// Đường dẫn đến ảnh gốc
const inputImagePath = 'image/ENTRANCE-GATE.png';

// Kích thước của từng phần nhỏ
const partWidth = 4816;
const partHeight = 3072;

// Zoom factor
const zoom = 1.0;

// Đọc ảnh và chuyển đổi thành các phần nhỏ
async function imageToText(inputImagePath, outputFolder) {
  const imageBuffer = fs.readFileSync(inputImagePath);
  const image = sharp(imageBuffer);
  
  // Tạo thư mục đầu ra nếu chưa tồn tại
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  // Chuyển đổi và ghi vào các file văn bản
  const imageMetadata = await image.metadata();
  console.log('Image Metadata:', imageMetadata);

  const resizedWidth = imageMetadata.width * zoom;
  const resizedHeight = imageMetadata.height * zoom;

  for (let top = 0; top < imageMetadata.height; top += partHeight) {
    console.log('Vào vòng lặp top');
    for (let left = 0; left < imageMetadata.width; left += partWidth) {
      console.log('Vào vòng lặp left');

      const adjustedWidth = Math.min(partWidth, imageMetadata.width - left);
      const adjustedHeight = Math.min(partHeight, imageMetadata.height - top);
      const adjustedLeft = Math.max(0, left);
      const adjustedTop = Math.max(0, top);

      const leftPercentage = adjustedLeft / imageMetadata.width;
      const topPercentage = adjustedTop / imageMetadata.height;

      const resizedBuffer = await image
        .jpeg()
        .resize(resizedWidth, resizedHeight)
        .toBuffer();

      const extractedBuffer = await sharp(resizedBuffer)
        .extract({
          left: Math.floor(leftPercentage * resizedWidth),
          top: Math.floor(topPercentage * resizedHeight),
          width: adjustedWidth,
          height: adjustedHeight
        })
        .resize(adjustedWidth, adjustedHeight)
        .toBuffer();

      const partFileName = `${outputFolder}/part_${adjustedLeft}_${adjustedTop}.txt`;
      fs.writeFileSync(partFileName, extractedBuffer.toString('base64'));
      console.log('Đã ghi file:', partFileName);
    }
  }

  console.log('Image to text conversion completed.');
}

// Gọi hàm chuyển đổi
imageToText(inputImagePath, 'text')
  .then(() => console.log('Conversion completed successfully'))
  .catch((error) => console.error('Error:', error));
