const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(__dirname, '../uploads');
const ORIGINAL_DIR = path.join(UPLOAD_DIR, 'original');
const COMPRESSED_DIR = path.join(UPLOAD_DIR, 'compressed');

// 디렉토리 확인 및 생성
const ensureDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};
ensureDirectory(ORIGINAL_DIR);
ensureDirectory(COMPRESSED_DIR);

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, ORIGINAL_DIR),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file type.'));
};
const fileUpload = multer({
    storage,
    limits: { fileSize: 30 * 1024 * 1024 },
    fileFilter,
}).array('profileImg', 5);

// 파일 업로드 처리
app.post('/updateFiles', fileUpload, async (req, res) => {
  try {
      if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: 'No files uploaded.' });
      }

      const uploadedFiles = [];
      for (const file of req.files) {
          const inputFilePath = path.join(ORIGINAL_DIR, file.filename);
          const outputFilePath = path.join(COMPRESSED_DIR, file.filename);

          let isResized = false;
          if (file.size > 6 * 1024 * 1024) {
              await sharp(inputFilePath)
                  .resize({ width: 1024 }) // 이미지 너비 1024px 제한
                  .jpeg({ quality: 80 }) // JPEG 품질 80%로 압축
                  .toFile(outputFilePath);

              isResized = true;
              fs.unlinkSync(inputFilePath); // 원본 파일 삭제
          }

          // 업로드된 파일 정보 구성
          uploadedFiles.push({
              fileName: file.filename,
              location: `/uploads/compressed/${file.filename}`, // 저장된 위치
                uploadTime: new Date().toLocaleString('ko-KR',{timeZone:'Asia/Seoul',hour12: false }),
                uploader: req.body.uploader || "unknown-user", // 요청에서 업로더 정보 처리
              isResized,
          });
      }

      // 응답: 단일 파일인지 다중 파일인지에 따라 다르게 처리
      if (uploadedFiles.length === 1) {
          res.status(200).json({
              message: 'Single file uploaded successfully!',
              single: uploadedFiles[0], // 단일 파일 정보
          });
      } else {
          res.status(200).json({
              message: 'Multiple files uploaded successfully!',
              group: uploadedFiles, // 다중 파일 정보 배열
          });
      }
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ message: 'Failed to process files.', error: error.message });
  }
});

// 정적 파일 제공
app.use(express.static('../public'));

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Original files stored in "${ORIGINAL_DIR}"`);
    console.log(`Resized files stored in "${COMPRESSED_DIR}"`);
});
