const express = require('express');
const db = require('../db/db')
const imageRoutes = require('../routers/imageRouter');

const app = express();
const port = process.env.PORT || 3000;

// Kết nối đến cơ sở dữ liệu PostgreSQL
db.connect();

// Middleware để xử lý các request có nội dung JSON
app.use(express.json());

// Sử dụng định tuyến cho ảnh
app.use('/api/images', imageRoutes);

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
