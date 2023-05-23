const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const multer  = require('multer');
const oracledb = require('oracledb');
const router = express.Router();
const moment = require('moment');

const fs = require('fs');
const http = require('http');
const https = require('https');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/sohyunsoo.xyz/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/sohyunsoo.xyz/fullchain.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

const domain = "sohyunsoo.xyz";
app.use(function (req, res, next) {
    if (!req.secure) {
        res.redirect(`https://${domain}${req.url}`);
    } else {
        next();
    }
});

httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

const httpServer = http.createServer(app);

httpServer.listen(80, () => {
  console.log('HTTP Server running on port 80 and redirecting to HTTPS');
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './board')));
app.use(express.static(path.join(__dirname, './')));
app.use(express.static(path.join(__dirname, './GPTweb')));
app.use(express.static(path.join(__dirname, './GPTweb/js')));
app.use('/', router);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // 'uploads/'는 이미지를 저장할 폴더 경로입니다. 실제 상황에 따라 변경해야 합니다.
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

module.exports = router;

router.get('/api/posts', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.CONNECT_STRING,
    });

    const result = await connection.execute(
      `SELECT id, image_path, comments
       FROM images_table
       ORDER BY DATE '1970-01-01' + (id / 86400) DESC`
    );
            
    const posts = result.rows.map(row => ({
      id: row[0],
      image: row[1],  // 이미지의 경로를 바로 사용합니다.
      comments: row[2]
    }));
    
    console.log(posts);  // posts 배열을 출력하여 확인합니다.
    
    res.json({ posts });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
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

app.listen(8080, function(){
    console.log("working...");
});

app.get('/GPTweb/gpt1', function(req, res){
  res.sendFile(path.join(__dirname, 'gpt.html'));
});

app.get('/GPTweb/gpt2', function(req, res){
res.sendFile(path.join(__dirname, 'gpt2.html'));
});

app.get('/GPTweb/gpt3', function(req, res){
  res.sendFile(path.join(__dirname, 'gpt3.html'));
  });

app.post("/api/chat", async (req, res) => {
  try{
      const question = req.body.question;
      const apiKey = process.env.API_KEY;  
      const prompt = "제시되는 문장의 수준을 평가합니다. 문장의 등급을 최상, 상, 중, 하, 폐급으로 나눕니다. 답변은 무조건 문장등급:상 or 폐급, 평가이유로 합니다.";
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: prompt + question,
              },
            ],
            temperature: 0.6,
            max_tokens: 150,
          }),
      });
      const data = await response.json();
      res.json({ answer: data.choices[0].message.content });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/api/chat2", async (req, res) => {
    try{
        const name = req.body.name;
        const subject = req.body.subject;
        const apiKey = process.env.API_KEY;
        const prompt = '4세 아이를 위한 교육적인 우화를 생성. 대화를 포함해 길이는 150자를 넘지 않음. 예제:어부들이 무거운 그물을 끌어올리며 물고기가 많이 잡힌 줄 알고 기뻐하며 춤을 추었어요. 그런데 그물을 다 끌어올려 보니 돌멩이가 한가득 들어 있었답니다. 그들이 속상해하자 한 늙은 어부가 말했어요. "기쁨과 괴로움은 서로 형제인듯하오. 우리가 기쁨을 맛보았으니, 이제 괴로움을 맛볼 차례가 아니겠소."';
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                { 
                  role: "user",
                  content: `${prompt} 주인공의 이름과 주제는 다음과 같아요. 이름:${name}, 주제: ${subject}`,
                },
              ],
              temperature: 0.6,
              top_p: 1.0,
              max_tokens: 300,
              frequency_penalty: 0.4,
              presence_penalty:0.0,
            }),
        });
        const data = await response.json();
        res.json({ answer: data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/api/chat3", async (req, res) => {
  try{
      const job = req.body.job;
      const apiKey = process.env.API_KEY;
      const prompt = "제시하는 직업에 대해 평가하라. 평가 기준은 수익성과 장래성이며 중요한 변수는 인공지능 시대이다. 각 기준에 대해 아주 좋음, 좋음, 중간, 나쁨, 아주 나쁨으로 평가한 뒤 결론을 내린다. *중요* 답변 형식은 수익성 : 00 장래성 : 00 + 계속 이거 하세요. or 다른 직업을 알아보시는 게 좋겠네요. + 이유 2문장 정도로 설명.";
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: `${prompt} 공손하게 대답합니다. 직업: ${job}`,
              },
            ],
            temperature: 0.6,
            max_tokens: 300,
          }),
      });
      const data = await response.json();
      res.json({ answer: data.choices[0].message.content });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});