document.querySelector("#home-button").addEventListener("click", function home() {
    location.href = "/index.html";
  });

  const capButton = document.getElementById('cap-button');

  capButton.addEventListener('click', function() {
    var node = document.querySelector('.capture-area');
    
    domtoimage.toPng(node)
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'AI-aesop.png';
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
                title: 'AI aesop',
                text: '끝내주는 동화를 창작해보자!',
                url: 'https://sohyunsoo.xyz/GPTweb/gpt2/gpt2.html',
            })
            console.log('Sharing successful')
        } catch (err) {
            console.log('Sharing failed', err)
        }
    } else {
        // fallback for desktop browsers
        const textArea = document.createElement('textarea');
        textArea.value = 'https://sohyunsoo.xyz/GPTweb/gpt2/gpt2.html';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('Copy');
        textArea.remove();
        alert('Link copied to clipboard');
    }
  });

  async function chat(name, subject) {
    const response = await fetch("/api/chat2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, subject }),
    });
  
    const data = await response.json();
    return data.answer;
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
    const name = document.querySelector("#name").value;
    const subject = document.querySelector("#subject").value;
  
    document.querySelector("#loader-4").classList.add("active");
    document.querySelector(".content").textContent = "";
  
    const answer = await chat(name, subject);
    const formattedAnswer = answer.replace(/\n/g, "<br>");
  
    document.querySelector("#loader-4").classList.remove("active");
    document.querySelector(".content").innerHTML = formattedAnswer;
  });
  