// Firebase Firestore 연동 버전 scripts.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  projectId: "sohyunsoo-2026",
  appId: "1:664222823154:web:835cabbaaddc98a841d66b",
  storageBucket: "sohyunsoo-2026.firebasestorage.app"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let quotes = [];

// 명언 데이터 불러오기
async function loadQuotes() {
  try {
    const querySnapshot = await getDocs(collection(db, "quotes"));
    quotes = querySnapshot.docs.map(doc => doc.data());
    updateQuote();
  } catch (err) {
    console.error("Quotes 로드 실패:", err);
    quotes = [{ text: "세상이 우리를 속일지라도 슬퍼하거나 노여워하지 말라.", author: "- 푸시킨" }];
    updateQuote();
  }
}

function updateQuote() {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  if (quoteText && quoteAuthor && quotes.length > 0) {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = quote.author;
  }
}

// 버튼 클릭 공통 로직
function handleButtonClick(buttonId, nextPageUrl) {
  const playButtonImg = document.getElementById(buttonId);
  const blackOverlay = document.getElementById('blackOverlay');
  if (playButtonImg) playButtonImg.src = 'icons/button_2.png';
  if (blackOverlay) {
    blackOverlay.classList.remove('invisible');
    blackOverlay.style.opacity = '1';
    setTimeout(() => { window.location.href = nextPageUrl; }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();

  // 버튼 이벤트 바인딩
  const btn1 = document.getElementById('button_1');
  const btn2 = document.getElementById('button_2');
  const btn3 = document.getElementById('button_3');
  
  if(btn1) btn1.parentElement.addEventListener('click', () => handleButtonClick('button_1', 'GPTweb'));
  if(btn2) btn2.parentElement.addEventListener('click', () => handleButtonClick('button_2', 'novel'));
  if(btn3) btn3.parentElement.addEventListener('click', () => handleButtonClick('button_3', 'aigallery.html'));

  document.getElementById('quote-container')?.addEventListener('click', updateQuote);

  // 모달 제어 로직 (개선)
  const modal1 = document.getElementById('modal1');
  const modal2 = document.getElementById('modal2');

  // 모든 닫기 버튼에 이벤트 연결
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal1?.classList.remove('active');
      modal2?.classList.remove('active');
      localStorage.setItem('modalClosed', Date.now());
    });
  });

  // 언어 전환 버튼
  document.getElementById('enButton')?.addEventListener('click', (e) => {
    e.preventDefault();
    modal1?.classList.remove('active');
    modal2?.classList.add('active');
  });

  document.getElementById('krButton')?.addEventListener('click', (e) => {
    e.preventDefault();
    modal2?.classList.remove('active');
    modal1?.classList.add('active');
  });

  // 유튜브 랜덤 링크
  document.getElementById("randomYoutube")?.addEventListener("click", (e) => {
    e.preventDefault();
    const links = ["https://youtu.be/IE_ifxLlicI?t=43", "https://youtu.be/J7ztey3AHFQ?si=D9dsD0-4wN73JDUO&t=53"];
    window.open(links[Math.floor(Math.random() * links.length)], "_blank");
  });

  // 테이블 로딩
  document.getElementById('SOHYUNSOO')?.addEventListener('change', async function(e) {
    const tableContainer = document.getElementById('table-container');
    const tableMap = {
      'novelist': 'tables/novelist_table.html',
      'screenwriter': 'tables/screenwriter_table.html',
      'stereographer': 'tables/stereographer_table.html',
      'gamemaker': 'tables/gamemaker_table.html',
      'appmaker': 'tables/appmaker_table.html'
    };
    const targetTable = tableMap[e.target.value];
    if (targetTable) {
      try {
        const response = await fetch(targetTable);
        const html = await response.text();
        tableContainer.innerHTML = `<div class="overflow-x-auto w-full"><div class="inline-block min-w-full align-middle">${html}</div></div>`;
        const table = tableContainer.querySelector('table');
        if (table) {
          table.classList.add('w-full', 'text-left', 'border-collapse', 'text-sm', 'md:text-base');
          table.querySelectorAll('th').forEach(th => th.classList.add('border-b', 'border-gray-700', 'p-2', 'md:p-3', 'text-white', 'whitespace-nowrap'));
          table.querySelectorAll('td').forEach(td => td.classList.add('border-b', 'border-gray-800', 'p-2', 'md:p-3', 'break-words'));
        }
      } catch (err) { console.error(err); }
    } else {
      tableContainer.innerHTML = '';
    }
    updateQuote();
  });
});
