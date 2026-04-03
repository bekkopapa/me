const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors")({ origin: true });

admin.initializeApp();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.apiChat = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const system = "제시되는 문장의 수준을 평가합니다. 문장의 등급을 최상, 상, 중, 하, 폐급으로 나눕니다. 답변은 무조건 문장등급:상 or 폐급, 평가이유로 합니다.";
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: system },
          { role: "user", content: req.body.question }
        ],
        temperature: 0.6,
        max_tokens: 300,
      });
      res.json({ answer: response.data.choices[0].message.content });
    } catch (e) {
      console.error(e);
      res.status(500).send("AI Error");
    }
  });
});

exports.apiChat2 = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const system = "3세 아이를 위한 교육적인 동화의 줄거리 생성. 대화를 포함해 길이는 200자를 넘지 않음.";
      const prompt = `주인공 이름: ${req.body.name}, 주제: ${req.body.subject}`;
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 300,
      });
      res.json({ answer: response.data.choices[0].message.content });
    } catch (e) {
      console.error(e);
      res.status(500).send("AI Error");
    }
  });
});

exports.apiChat3 = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const system = "제시하는 직업에 대해 수익성과 장래성을 인공지능 시대를 변수로 평가하라. 답변 형식: 수익성:00, 장래성:00, 결론(계속 하세요 or 다른 것 알아보세요), 이유(3문장)";
      const prompt = `직업: ${req.body.job}`;
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 300,
      });
      res.json({ answer: response.data.choices[0].message.content });
    } catch (e) {
      console.error(e);
      res.status(500).send("AI Error");
    }
  });
});

exports.generateUploadUrl = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { filename, contentType } = req.body;
      if (!filename) return res.status(400).send("filename is required");

      const bucket = admin.storage().bucket();
      const file = bucket.file(`uploads/${Date.now()}_${filename}`);
      
      const options = {
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,
        contentType: contentType || "application/octet-stream",
      };

      const [url] = await file.getSignedUrl(options);
      res.json({ url, filePath: file.name });
    } catch (e) {
      console.error("Storage Signed URL Error:", e);
      res.status(500).send("Storage Error");
    }
  });
});