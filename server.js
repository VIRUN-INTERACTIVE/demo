const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const cors = require("cors");
app.use(cors());


// 업로드 디렉토리 생성
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // 디렉토리가 없으면 생성
}

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // 업로드 디렉토리
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

// 라우터
app.post('/updateFiles', fileUpload.single('profileImg'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }

  console.log('Uploaded file:', req.file);

  res.status(200).send({
    message: 'File uploaded successfully!',
    file: {
      originalName: req.file.originalname,
      savedName: req.file.filename,
      savedPath: path.join(uploadDir, req.file.filename),
    },
  });
});

// 정적 파일 제공
app.use(express.static('public'));

// 서버 실행
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
//   console.log(`Uploaded files will be stored in "${uploadDir}" directory.`);
// });


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Uploaded files will be stored in "${uploadDir}" directory.`);
});
