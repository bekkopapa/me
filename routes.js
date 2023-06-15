const express = require('express');
const router = express.Router();

  router.get('/', (req, res) => {
    res.sendFile('index.html');
  });
  
  router.get('/aigallery', (req, res) => {
    res.sendFile(__dirname + '/aigallery.html');
  });
  
  router.get('/novel', (req, res) => {
    res.sendFile(__dirname + '/novel/novelHome.html');
  });
  
  router.get('/novel/novel_1', (req, res) => {
    res.sendFile(__dirname + '/novel/novel.html');
  });
  
  router.get('/novel/novel_2', (req, res) => {
    res.sendFile(__dirname + '/novel/novel_2.html');
  });
  
  router.get('/GPTweb', (req, res) => {
    res.sendFile(__dirname + '/GPTweb/door.html');
  });
  
  router.get('/GPTweb/gpt1', (req, res) => {
    res.sendFile(__dirname + '/GPTweb/gpt1/gpt.html');
  });
  
  router.get('/GPTweb/gpt2', (req, res) => {
    res.sendFile(__dirname + '/GPTweb/gpt2/gpt2.html');
  });
  
  router.get('/GPTweb/gpt3', (req, res) => {
    res.sendFile(__dirname + '/GPTweb/gpt3/gpt3.html');
  });
  
  router.get('/GPTweb/gpt4', (req, res) => {
    res.sendFile(__dirname + '/GPTweb/gpt4/gpt4.html');
  });
  
  router.get('/board', (req, res) => {
    res.sendFile(__dirname + '/board/board.html');
  });

  module.exports = router;
  