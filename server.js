const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

const fs = require('fs');
const http = require('http');
const https = require('https');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/sohyunsoo.xyz/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/sohyunsoo.xyz/fullchain.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});


app.use(express.json());
app.use(express.static(path.join(__dirname, './')));
app.use(express.static(path.join(__dirname, './GPTweb')));
app.use(express.static(path.join(__dirname, './GPTweb/js')));

app.listen(8080, function(){
    console.log("working...");
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/GPTweb', function(req, res){
    res.sendFile(path.join(__dirname, 'gpt.html'));
});

let fetch;
import("node-fetch").then((module) => {
  fetch = module.default;
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
