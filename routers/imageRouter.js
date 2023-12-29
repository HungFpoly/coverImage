const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();

router.post('/convert-and-save', async (req, res) => {
  try {
    const { outputImagePath, outputPath, customFileName } = req.body;
    await imageController.convertAndSaveToDB(outputImagePath, outputPath, customFileName);
    res.status(200).json({ message: 'Conversion and saving completed successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// router.post('/convert', async (req, res) => {
//     const { outputImagePath, partWidth, partHeight } = req.body;

//     // Kiểm tra dữ liệu đầu vào
//     if (!outputImagePath || !partWidth || !partHeight) {
//         return res.status(400).json({ error: 'Missing required parameters.' });
//     }

//     try {
//         // Gọi hàm chuyển đổi từ imageController
//        const data =  await imageController.textToImage(outputImagePath, partWidth, partHeight);
//         res.json({ message: 'Conversion completed successfully.', data: data });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal server error.' });
//     }
// });


module.exports = router;