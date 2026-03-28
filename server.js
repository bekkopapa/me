const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();
const path = require('path');
require('dotenv').config();
const multer = require('multer');
const oracledb = require('oracledb');
const router = express.Router();
const moment = require('moment');
const compression = require('compression');
const fs = require('fs');
const http = require('http');
const https = require('https');

// 미들웨어 설정
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 관리자 페이지 인증
app.use('/admin.html', basicAuth({
  users: { [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD },
  challenge: true,
}));

// SSL 인증서 로드 (경로 주의)
let credentials = {};
try {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/sohyunsoo.com/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/sohyunsoo.com/fullchain.pem', 'utf8');
  credentials = { key: privateKey, cert: certificate };
} catch (e) {
  console.warn("SSL 인증서를 찾을 수 없습니다. 로컬 환경인 경우 무시하세요.");
}

// HTTPS 리다이렉트 및 서버 실행
const domain = "sohyunsoo.com";
app.use((req, res, next) => {
  if (!req.secure && credentials.key) {
    return res.redirect(`https://${domain}${req.url}`);
  }
  next();
});

// 정적 파일 서빙 (캐싱 설정)
app.use(express.static(path.join(__dirname, './'), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0');
    }
  }
}));

// DB 연결 풀 초기화
async function initDB() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.CONNECT_STRING,
      poolMin: 2,
      poolMax: 10,
    });
    console.log('Oracle Connection Pool initialized');
  } catch (err) {
    console.error('DB Pool Error:', err);
  }
}
initDB();

// 라우팅 설정
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/PPT', (req, res) => res.sendFile(path.join(__dirname, 'PPT/ppt.html')));
app.get('/novel', (req, res) => res.sendFile(path.join(__dirname, 'novel/novelHome.html')));
app.get('/GPTweb', (req, res) => res.redirect('https://cafe.naver.com/stablediffusionlab?iframe_url=/ArticleList.nhn%3Fsearch.clubid=30997614%26search.menuid=14%26search.boardtype=L'));

// OpenAI API 공통 호출 함수
async function callOpenAI(prompt, systemMessage, temperature = 0.5) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      temperature: temperature,
      max_tokens: 300,
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

// OpenAI API 라우트 통합 및 최적화
app.post("/api/chat", async (req, res) => {
  try {
    const system = "제시되는 문장의 수준을 평가합니다. 문장의 등급을 최상, 상, 중, 하, 폐급으로 나눕니다. 답변은 무조건 문장등급:상 or 폐급, 평가이유로 합니다.";
    const answer = await callOpenAI(req.body.question, system, 0.6);
    res.json({ answer });
  } catch (e) { res.status(500).send("AI Error"); }
});

app.post("/api/chat2", async (req, res) => {
  try {
    const system = '3세 아이를 위한 교육적인 동화의 줄거리 생성. 대화를 포함해 길이는 200자를 넘지 않음.';
    const prompt = `주인공 이름: ${req.body.name}, 주제: ${req.body.subject}`;
    const answer = await callOpenAI(prompt, system, 0.3);
    res.json({ answer });
  } catch (e) { res.status(500).send("AI Error"); }
});

app.post("/api/chat3", async (req, res) => {
  try {
    const system = "제시하는 직업에 대해 수익성과 장래성을 인공지능 시대를 변수로 평가하라. 답변 형식: 수익성:00, 장래성:00, 결론(계속 하세요 or 다른 것 알아보세요), 이유(3문장)";
    const answer = await callOpenAI(`직업: ${req.body.job}`, system, 0.5);
    res.json({ answer });
  } catch (e) { res.status(500).send("AI Error"); }
});

// 이미지/비디오 업로드 및 갤러리 로직 (기존 유지하되 정리)
const storageConfig = (dest) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, dest),
  filename: (req, file, cb) => cb(null, `${path.basename(file.originalname, path.extname(file.originalname))}-${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage: storageConfig('uploads/') });
const uploadImage = multer({ storage: storageConfig('imageDB/') });
const uploadVideo = multer({ storage: storageConfig('imageDB/videos') });

// ... (DB 관련 라우트들은 구조 동일하므로 생략하거나 필요한 부분만 간소화 가능)
// 예시: /api/upload, /api/posts, /uploadImage, /gallery 등 기존 로직 유지

// 서버 시작
const PORT = process.env.PORT || 8080;
if (credentials.key) {
  https.createServer(credentials, app).listen(443, () => console.log('HTTPS Server on 443'));
  http.createServer(app).listen(80);
} else {
  app.listen(PORT, () => console.log(`HTTP Server on ${PORT}`));
}
