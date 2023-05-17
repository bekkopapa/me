const fs = require('fs');
const http = require('http');
const https = require('https');

const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

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
app.use(express.static(path.join(__dirname, './')));
app.use(express.static(path.join(__dirname, './GPTweb')));
app.use(express.static(path.join(__dirname, './GPTweb/js')));

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
        const prompt = '당신은 이솝우화를 쓴 이솝입니다. 주어지는 이름의 아이를 주인공으로 교육적인 동화를 창작합니다. 길이는 여섯 문장을 넘지 않도록 합니다.';
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
                  content: `${prompt} 아이의 이름과 주제를 제시하겠습니다. 이름:${name}, 주제: ${subject}`,
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

app.post("/api/chat3", async (req, res) => {
  try{
      const job = req.body.job;
      const apiKey = process.env.API_KEY;
      const prompt = "지금부터 너는 직업 상담사다. 제시하는 직업에 대해 평가하라. 평가 기준은 수익성과 장래성, 중요 변수는 인공지능 시대. 대답은 각 기준에 대해 아주 좋음, 좋음, 중간, 나쁨, 아주 나쁨으로 평가한 뒤 결론을 내린다.결론은 '무조건 계속 이거 하세요.' 혹은 '다른 직업을 알아보시는 게 좋겠네요.' 로 시작한다. 결론에 대한 이유 간략하게 설명. 답변은 두 문장을 넘기지 않는다.";
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
                content: `${prompt} 말투는 공손하게 할 것. 직업: ${job}`,
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