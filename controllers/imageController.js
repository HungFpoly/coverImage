const fs = require('fs');
const sharp = require('sharp');
const db = require('../db/db');

async function imageToText(inputImagePath, outputFolder, customFileName) {
    // ... (phần code chuyển đổi từ trước)
    // Kích thước của từng phần nhỏ
    const partWidth = 4816;
    const partHeight = 3072;
    // Zoom factor
    const zoom = 1.0;
    // Đọc ảnh và chuyển đổi thành các phần nhỏ
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

            const base64String = 'data:image/jpeg;base64,' + Buffer.from(extractedBuffer).toString('base64');
            const partFileName = `${outputFolder}/${customFileName}.txt`;
            console.log(customFileName);
            fs.writeFileSync(partFileName, base64String);
            console.log('Đã ghi file:', partFileName);
        }
    }
    console.log('Image to text conversion completed.');
}

async function convertAndSaveToDB(inputImagePath, outputFolder, customFileName) {
    try {
        await imageToText(inputImagePath, outputFolder, customFileName);

        // const files = fs.readdirSync(outputFolder);

        // for (const file of files) {
        //     const content = fs.readFileSync(`${outputFolder}/${file}`, 'base64');
        //     await db.query('INSERT INTO images(name, content) VALUES($1, $2)', [file, content]);
        // }
        console.log('Conversion and saving completed successfully');
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Conversion and saving failed');
    }
}

// async function textToImage(outputImagePath, partWidth, partHeight) {
//     try {
//         // Thực hiện truy vấn cơ sở dữ liệu để lấy dữ liệu từ bảng 'images'
//         const result = await db.query('SELECT name, content FROM images');

//         if (result.rows.length === 0) {
//             console.error('No data found in the images table.');
//             return;
//         }

//         // Chuyển đổi từng bản ghi từ cơ sở dữ liệu thành ảnh và lưu vào mảng
//         const images = await Promise.all(result.rows.map(async (row) => {
//             const base64Data = row.content.replace(/\\/g, "");
//             const buffer = Buffer.from(base64Data, 'base64');
//             console.log(base64Data);
//             return buffer;
//         }));

//         const firstImageMetadata = await sharp(images[0]).metadata();

//         // Gộp ảnh
//         const mergedImage = await sharp({
//             create: {
//                 width: partWidth * Math.ceil(firstImageMetadata.width / partWidth),
//                 height: partHeight * Math.ceil(firstImageMetadata.height / partHeight),
//                 channels: 4, // Số kênh màu (4 cho RGBA)
//                 background: { r: 255, g: 255, b: 255, alpha: 1 } // Màu nền
//             }
//         });

//         // Sử dụng phương thức composite để gộp ảnh
//         for (const image of images) {
//             mergedImage.composite([{ input: image, left: 0, top: 0 }]);
//         }

//         // Ghi ảnh gộp vào file với định dạng PNG
//         await mergedImage.toFormat('png').toFile(outputImagePath);
//         console.log('Text to image conversion completed.');

//         // Trả về đường dẫn tới tệp tin ảnh đã tạo
//         return outputImagePath;
//     } catch (error) {
//         console.error('Error during conversion:', error);
//         throw error;
//     }
// }


module.exports = {
    convertAndSaveToDB
};
