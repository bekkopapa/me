const express = require('express');
const multer  = require('multer');
const oracledb = require('oracledb');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') 
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const id = path.basename(file.originalname, ext);
      cb(null, id + '-' + Date.now() + ext)
    }
  });
  const upload = multer({ storage: storage });
  
  router.post('/api/upload', upload.single('image'), async (req, res) => {
    let connection;
    try {
      connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.CONNECT_STRING,
      });
  
      const comment = req.body.comment; // 클라이언트에서 보낸 댓글을 가져옵니다.
      const imageId = Date.now(); // 현재 시간을 UNIX 타임스탬프로 생성
  
      // 이미지 파일의 경로를 데이터베이스에 저장합니다.
      const result = await connection.execute(
        `INSERT INTO images_table (id, image_path, comments)
         VALUES (:id, :image_path, :comments)`,
        {
          id: { val: imageId, dir: oracledb.BIND_IN },
          image_path: { val: req.file.path, dir: oracledb.BIND_IN }, // Use the image file path directly
          comments: { val: comment, dir: oracledb.BIND_IN }
        },
        { autoCommit: true } // 자동 커밋 설정
      );
  
      res.json({ message: 'Image and comment uploaded successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload image and comment' });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  });

  const imageUploadStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'imageDB/') 
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const id = path.basename(file.originalname, ext);
      cb(null, id + '-' + Date.now() + ext);
    }
  });
  
  const uploadImage = multer({ storage: imageUploadStorage });
  
  router.post('/uploadImage', uploadImage.single('image'), async (req, res) => {
    try {
      // Set up the Oracle DB connection
      const connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.CONNECT_STRING,
      });
  
      // Insert the title, content, and file path into the GALLERY table
      const result = await connection.execute(
        `INSERT INTO GALLERY (title, content, image_URL) VALUES (:title, :content, :image_URL)`,
        {
          title: { val: req.body.title, dir: oracledb.BIND_IN },
          content: { val: req.body.content, dir: oracledb.BIND_IN },
          image_URL: { val: req.file.path, dir: oracledb.BIND_IN },
        },
        { autoCommit: true }
      );
      await connection.close();
      res.redirect('/admin.html');
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload file and save data to Oracle DB' });
    }
  });
  
  module.exports = router;