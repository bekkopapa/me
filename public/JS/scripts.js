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

const fallbackQuote = {
  text: "세상이 우리를 속일지라도 슬퍼하거나 노여워하지 말라.",
  author: "- 푸시킨"
};
let quotes = [fallbackQuote];
let currentQuoteText = "";

// Subtle synthesized click sound
let audioCtx = null;
function ensureAudioContext() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
}

function playClickSound() {
  if (!audioCtx || audioCtx.state !== "running") return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const sounds = [
    { freq: 1500, type: "sine", duration: 0.045 },
    { freq: 1200, type: "sine", duration: 0.04 },
    { freq: 1800, type: "sine", duration: 0.03 },
    { freq: 1400, type: "triangle", duration: 0.045 },
    { freq: 1600, type: "sine", duration: 0.05 }
  ];
  const sound = sounds[Math.floor(Math.random() * sounds.length)];

  oscillator.type = sound.type;
  oscillator.frequency.setValueAtTime(sound.freq, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(sound.freq / 3, audioCtx.currentTime + sound.duration);

  gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.004, audioCtx.currentTime + sound.duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + sound.duration);
}

// 명언 데이터 불러오기
async function loadQuotes() {
  try {
    const querySnapshot = await getDocs(collection(db, "quotes"));
    const loadedQuotes = querySnapshot.docs.map(doc => doc.data()).filter(q => q && q.text);
    quotes = loadedQuotes.length > 0 ? loadedQuotes : [fallbackQuote];
    updateQuote();
  } catch (err) {
    console.error("Quotes 로드 실패:", err);
    quotes = [fallbackQuote];
    updateQuote();
  }
}

function updateQuote() {
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  const quoteContainer = document.getElementById("quote-container");
  const quoteToggle = document.getElementById("quote-toggle");
  if (quoteText && quoteAuthor && quotes.length > 0) {
    const pool = quotes.length > 1 && currentQuoteText
      ? quotes.filter(q => q.text !== currentQuoteText)
      : quotes;
    const quote = pool[Math.floor(Math.random() * pool.length)];
    currentQuoteText = quote.text;
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = quote.author || "";
    quoteContainer?.classList.remove("expanded");
    quoteToggle?.setAttribute("aria-expanded", "false");
  }
}

// 포털 페이지 전환
function navigateWithTransition(nextPageUrl) {
  const blackOverlay = document.getElementById("blackOverlay");
  if (blackOverlay) {
    blackOverlay.classList.add("active");
    setTimeout(() => {
      window.location.href = nextPageUrl;
    }, 450);
  } else {
    window.location.href = nextPageUrl;
  }
}

function resetTransitionState() {
  const blackOverlay = document.getElementById("blackOverlay");
  if (blackOverlay) {
    blackOverlay.classList.remove("active");
  }
}

window.addEventListener("pageshow", resetTransitionState);
window.addEventListener("load", resetTransitionState);

document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  resetTransitionState();

  const unlockAudio = () => {
    ensureAudioContext();
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };
  window.addEventListener("pointerdown", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });

  // 상단 브랜드 클릭 시 상단 스크롤
  document.getElementById("title")?.addEventListener("click", () => {
    ensureAudioContext();
    playClickSound();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 상단 ARCHIVE 드롭다운 메뉴
  const exploreDropdown = document.getElementById("exploreDropdown");
  const exploreToggle = document.getElementById("exploreToggle");
  const exploreMenu = document.getElementById("exploreMenu");

  const setExploreOpen = isOpen => {
    if (!exploreToggle || !exploreMenu) return;
    exploreMenu.classList.toggle("open", isOpen);
    exploreToggle.setAttribute("aria-expanded", String(isOpen));
  };

  exploreToggle?.addEventListener("click", e => {
    e.stopPropagation();
    ensureAudioContext();
    playClickSound();
    const isOpen = exploreMenu?.classList.contains("open");
    setExploreOpen(!isOpen);
  });

  document.addEventListener("click", e => {
    if (exploreDropdown && !exploreDropdown.contains(e.target)) {
      setExploreOpen(false);
    }
  });

  // 포털 링크 클릭 (상단 드롭다운 + 푸터)
  document.querySelectorAll(".portal-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      ensureAudioContext();
      playClickSound();
      setExploreOpen(false);
      const url = link.getAttribute("data-url");
      if (url) navigateWithTransition(url);
    });
  });

  // 푸터 명언: 문장 클릭 시 펼치기/접기, ↻ 클릭 시 다음 문장
  const quoteContainer = document.getElementById("quote-container");
  const quoteToggle = document.getElementById("quote-toggle");
  const quoteRefresh = document.getElementById("quote-refresh");

  quoteToggle?.addEventListener("click", () => {
    ensureAudioContext();
    playClickSound();
    const isExpanded = quoteContainer?.classList.toggle("expanded");
    quoteToggle.setAttribute("aria-expanded", String(Boolean(isExpanded)));
  });

  quoteRefresh?.addEventListener("click", e => {
    e.stopPropagation();
    ensureAudioContext();
    playClickSound();
    updateQuote();
  });

  // 선언문 모달 제어
  const modal1 = document.getElementById("modal1");
  const modal2 = document.getElementById("modal2");

  const openModal = targetModal => {
    if (!targetModal) return;
    setExploreOpen(false);
    modal1?.classList.remove("active");
    modal2?.classList.remove("active");
    modal1?.setAttribute("aria-hidden", "true");
    modal2?.setAttribute("aria-hidden", "true");
    targetModal.classList.add("active");
    targetModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeAllModals = () => {
    modal1?.classList.remove("active");
    modal2?.classList.remove("active");
    modal1?.setAttribute("aria-hidden", "true");
    modal2?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    localStorage.setItem("modalClosed", Date.now());
  };

  document.querySelectorAll(".open-manifesto").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      ensureAudioContext();
      playClickSound();
      openModal(modal1);
    });
  });

  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      playClickSound();
      closeAllModals();
    });
  });

  [modal1, modal2].forEach(modal => {
    modal?.addEventListener("click", e => {
      if (e.target === modal) closeAllModals();
    });
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      setExploreOpen(false);
      closeAllModals();
    }
  });

  document.getElementById("enButton")?.addEventListener("click", e => {
    e.preventDefault();
    playClickSound();
    openModal(modal2);
  });

  document.getElementById("krButton")?.addEventListener("click", e => {
    e.preventDefault();
    playClickSound();
    openModal(modal1);
  });

  // 유튜브 랜덤 링크
  document.getElementById("randomYoutube")?.addEventListener("click", e => {
    e.preventDefault();
    ensureAudioContext();
    playClickSound();
    const links = [
      "https://youtu.be/IE_ifxLlicI?t=43",
      "https://youtu.be/J7ztey3AHFQ?si=D9dsD0-4wN73JDUO&t=53"
    ];
    window.open(links[Math.floor(Math.random() * links.length)], "_blank", "noopener,noreferrer");
  });

  // WHO AM I? 테이블 로딩 (기존 select 방식 유지)
  const pageMain = document.getElementById("pageMain");
  document.getElementById("SOHYUNSOO")?.addEventListener("change", async function (e) {
    ensureAudioContext();
    playClickSound();

    const tableContainer = document.getElementById("table-container");
    const tableMap = {
      novelist: "tables/novelist_table.html",
      screenwriter: "tables/screenwriter_table.html",
      stereographer: "tables/stereographer_table.html",
      game_creator: "tables/game_creator_table.html",
      app_creator: "tables/app_creator_table.html",
      ai_professional: "tables/ai_professional_table.html"
    };

    const targetTable = tableMap[e.target.value];
    if (targetTable && tableContainer) {
      pageMain?.classList.add("has-selection");
      try {
        const response = await fetch(targetTable);
        if (!response.ok) throw new Error(`Failed to fetch ${targetTable}`);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const parsedTable = doc.querySelector("table");

        tableContainer.innerHTML = "";
        if (parsedTable) {
          parsedTable.querySelectorAll("a").forEach(a => {
            a.setAttribute("target", "_blank");
            a.setAttribute("rel", "noopener noreferrer");
          });
          const shell = document.createElement("div");
          shell.className = "table-shell";
          shell.appendChild(parsedTable);
          tableContainer.appendChild(shell);
        }
      } catch (err) {
        console.error(err);
      }
    } else if (tableContainer) {
      pageMain?.classList.remove("has-selection");
      tableContainer.innerHTML = "";
    }

    updateQuote();
  });
});
