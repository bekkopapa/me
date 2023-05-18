document.querySelector("#home-button").addEventListener("click", function home() {
  location.href = "/index.html";
});

const capButton = document.getElementById('cap-button');

capButton.addEventListener('click', function() {
  var node = document.querySelector('.capture-area');
  
  // 캡쳐 전에 배경색 설정
  var originalColor = node.style.backgroundColor;
  node.style.backgroundColor = '#11191f';
  
  domtoimage.toPng(node)
    .then(function (dataUrl) {
      // 캡쳐 후에 배경색을 원래대로 되돌림
      node.style.backgroundColor = originalColor;
      
      var link = document.createElement('a');
      link.download = 'AI-critics.png';
      link.href = dataUrl;
      link.click();
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error);
    });
});

document.querySelector('#share-button').addEventListener('click', async () => {
  if (navigator.share) {
      try {
          await navigator.share({
              title: 'AI critics',
              text: '나의 글쓰기 수준을 가늠해보자!',
              url: 'https://sohyunsoo.xyz/GPTweb/gpt1/gpt.html',
          })
          console.log('Sharing successful')
      } catch (err) {
          console.log('Sharing failed', err)
      }
  } else {
      // fallback for desktop browsers
      const textArea = document.createElement('textarea');
      textArea.value = 'https://sohyunsoo.xyz/GPTweb/gpt1/gpt.html';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('Copy');
      textArea.remove();
      alert('Link copied to clipboard');
  }
});

const maxLength = 300;

function updateCharCount() {
  const textArea = document.getElementById('input-text');
  const charCount = document.getElementById('charCount');
  const remainingChars = maxLength - textArea.value.length;
  charCount.textContent = remainingChars;
}

document.getElementById('input-text').addEventListener('input', updateCharCount);

async function chat(question) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();
  return data.answer;
}

const recommends = [
  { text : ' 문장력을 기르기 위해서는 독서가 필수!! 소현수 작가의 SF소설 <프린테라>를 읽어보시는 건 어떨까요?' },
  { text : ' 문장력을 기르기 위해서는 독서가 필수죠. 소현수 작가의 SF소설 <사건분석관K:미래범죄 수사일지>를 읽어보시는 건 어떨까요? ' },
  { text : ' 문장력을 기르기 위해선 독서가 필수랍니다! 소현수 작가의 호러 단편 <아비>를 읽어보는 건 어떨까요? <어위크>에 수록돼 있습니다.' },
  { text : ' 문장력을 기르기 위해선 독서가 필수! 소현수 작가의 어린이 괴담집 <신비아파트 오싹오싹무서운이야기 6> 추천드려요.' },
  { text : ' 문장력을 기르기 위해선 독서가 필수죠? 소현수 작가의 단편집 <히키코모리 카페> 추천드려요.' },
  { text : ' 교양을 쌓기 위한 다큐멘터리 한 편 어떨까요? 소현수 작가가 참여한 <게임에 진심인 편> 추천드려요.' },
  { text : ' 창의력을 기르기 위해 참신한 프로그램 감상 어떨까요? 국내 최초 SF토크쇼 <공상가들> 추천드려요.' },
  { text : ' ' },
  ];

function getRandomText() {
  return recommends[Math.floor(Math.random() * recommends.length)].text;
}

const clickLimit = 10;

document.querySelector("#send-button").addEventListener("click", async function (event) {
  event.preventDefault();

  // Click limit check
  const currentDate = new Date().toDateString();
  let clickData = JSON.parse(localStorage.getItem("clickData")) || {};

  if (clickData.date !== currentDate) {
    clickData = { date: currentDate, count: 0 };
  }

  if (clickData.count >= clickLimit) {
    document.querySelector("#loader-4").classList.remove("active");
    alert("하루에 10회만 사용가능합니다....ㅎㅎ");
    return; // Do not proceed with the chat() function
  }

  clickData.count += 1;
  localStorage.setItem("clickData", JSON.stringify(clickData));

  // Proceed with the chat() function
  const question = document.querySelector("#input-text").value;
  const recommend = getRandomText();

  document.querySelector("#loader-4").classList.add("active");
  document.querySelector(".content").textContent = "";

  const answer = await chat(question);

  document.querySelector("#loader-4").classList.remove("active");
  document.querySelector(".content").textContent = answer + recommend;
});
