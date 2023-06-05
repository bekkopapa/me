$('#button_1').on('click', function() {
  const playButton = $(this);
  const blackOverlay = $('#blackOverlay');

  // 이미지 변경
  playButton.attr('src', 'icons/button_2.png');

  // 오버레이 작동
  blackOverlay.css('display', 'block');
  setTimeout(function() {
    blackOverlay.css('visibility', 'visible');
    blackOverlay.css('opacity', 1);
  }, 10);

  setTimeout(function() {
    blackOverlay.css('opacity', 0);
    setTimeout(function() {
      blackOverlay.css('visibility', 'hidden');
      blackOverlay.css('display', 'none');
    }, 1500);
  }, 1500);

  // 페이지 이동
  const nextPageUrl = 'GPTweb/door.html';
  setTimeout(function() {
    window.location.href = nextPageUrl;
  }, 1000);
});

$('#button_2').on('click', function() {
  const playButton = $(this);
  const blackOverlay = $('#blackOverlay');

  // 이미지 변경
  playButton.attr('src', 'icons/button_2.png');

  // 오버레이 작동
  blackOverlay.css('display', 'block');
  setTimeout(function() {
    blackOverlay.css('visibility', 'visible');
    blackOverlay.css('opacity', 1);
  }, 10);

  setTimeout(function() {
    blackOverlay.css('opacity', 0);
    setTimeout(function() {
      blackOverlay.css('visibility', 'hidden');
      blackOverlay.css('display', 'none');
    }, 1500);
  }, 1500);

  // 페이지 이동
  const nextPageUrl = 'novel/novel.html';
  setTimeout(function() {
    window.location.href = nextPageUrl;
  }, 1000);
});

$('#button_3').on('click', function() {
  const playButton = $(this);
  const blackOverlay = $('#blackOverlay');

  // 이미지 변경
  playButton.attr('src', 'icons/button_2.png');

  // 오버레이 작동
  blackOverlay.css('display', 'block');
  setTimeout(function() {
    blackOverlay.css('visibility', 'visible');
    blackOverlay.css('opacity', 1);
  }, 10);

  setTimeout(function() {
    blackOverlay.css('opacity', 0);
    setTimeout(function() {
      blackOverlay.css('visibility', 'hidden');
      blackOverlay.css('display', 'none');
    }, 1500);
  }, 1500);

  // 페이지 이동
  const nextPageUrl = 'aigallery';
  setTimeout(function() {
    window.location.href = nextPageUrl;
  }, 1000);
});

$(document).ready(function() {
  $("#title").click(function() {
    titleClick();
  });
});


function loadTable(url, callback) {
  $.ajax({
      url: url,
      success: function(responseText) {
          callback(responseText);
      }
  });
}

$('#SOHYUNSOO').on('change', function(event) {
  var tableContainer = $('#table-container');

  if (event.target.value === 'novelist') {
      loadTable('tables/novelist_table.html', function(responseText) {
          tableContainer
          .html(responseText);
        });
    } else if (event.target.value === 'screenwriter') {
        loadTable('tables/screenwriter_table.html', function(responseText) {
            tableContainer.html(responseText);
        });
    } else if (event.target.value === 'stereographer') {
        loadTable('tables/stereographer_table.html', function(responseText) {
            tableContainer.html(responseText);
        });
    } else {
        tableContainer.html('');
    }
    });

            // Quotes array
            const quotes = [
                { text: '"오시리스들이야말로 개척군의 영웅이야. 탈영병 신세가 돼버린 건 참 안타까운 일일세. 우리가 몹쓸 짓을 한 거야. 몹쓸 짓을........"', author: '-차원우주개척군 사령관 막심 하이예크 / 프린테라' },
                { text: '"내 인생의 1막은 씁쓸한 이혼으로 막을 내렸고, 2막은 전쟁의 참화 속에 있었다. 그리고 이제 내 생의 마지막이 될 3막이 펼쳐지려 하고 있다."', author: '-진 오시리스 / 프린테라' },
                { text: '발아래 부서지는 모래언덕의 울부짖음이 가슴에 와 닿는구나.... 모로나두, 모로나두, 백색의 종양, 야후들의 공세는 흩날리는 모래폭풍만큼 지독하다오....', author: '-야후 / 프린테라' },
                { text: '"영원히. 당신 남편은 거기 갇혀서 그렇게 고통받는 거죠. 무간지옥, 아비. 우리는 그곳을 그렇게 불러요."', author: '-호희 / 아비' },
                { text: '"네가…… 네놈이 무슨 짓을…… 한 건지 똑똑히 봐 둬."', author: '-보영 / 아비' },
                { text: '"안드로이드와 인간이길 포기한 더미 쓰는 놈들. 둘 사이에 경계를 없애주려는 거죠. 제가 밖에 있었으면 안드로이드에게 자유의지를 주고 진짜 해방을 선사했을 텐데, 아쉽네요."', author: '-소년 / 사건분석관K:미래범죄 수사일지' },
                { text: '나는 늘 불안하고 목에 가시라도 걸린 듯 답답했다. 몇 번인가 심장이 두근거리며 예의 검은 얼룩이 희미하게 나타나기도 했다. 어쩌면 이것이 그 소년이 말했던 사건분석관의 결함인지도.', author: '-K / 사건분석관K:미래범죄 수사일지' },
                { text: '"이 소돔의 악인들도 사실 서로 의지하며 살아가고 있는 셈이지. 강자는 더 강한 자에게 또 강자는 약자에게 그리고 약자는 그보다 더 약한 자에게 뺏고 빼앗기면서 말이다."', author: '-마테오 / 에덴' },
                { text: '"썩어버린 새까맣고 더러운 물의 수면이 잔잔하다고 해서! 그 더러운 물에 파문이 이는 것이 두려워 깨끗한 물을 섞지 않는 게 옳은가요? 그게 헛된 일일까요?"', author: '-제이 / 에덴' },
                { text: '"시간의 역설이 저를 쫓아내고 뭐고 간에 저 같은 노인은 그녀에게 다가갈 수조차 없었죠."', author: '-노인 / 시공간의 이방인' },
                { text: '그때 목에 닿은 서늘한 칼날, 뒤쪽에서 칼을 들고 서 있을 남자의 뿌리 깊은 악의와 처연한 살기가 아직도 생생하게 느껴진다. 나는 피할 수 없는 죽음을 목도하고 있었다.', author: '-괴물 / 괴물'},
                { text: '"아니 들어봐. 놀라지 마. 잠깐 심호흡 좀 하고. 진짜 너 놀라지 마라. 후우...... 그니까 이 다섯 개의 두뇌......... 양자확률패턴이 99% 이상 일치하고 있어!"', author: '-주노 / 사건분석관K:미래범죄 수사일지'},
                { text: '"몇 번을 말해도 부족하겠지만, 정말 미안해. 진심으로 사죄하고 싶어. 네가 이걸로 원을 풀 수 있다면 좋겠어. 이제 다 잊고 영원히 행복하게 살길 바랄게."', author: '-보영 / 아비'},
                { text: '그땐 그랬다. 내게 전쟁이란 고작 그런 의미였다. 거지같은 현실로부터의 탈출구였다.', author: '-진 오시리스 / 프린테라'},
                { text: '“제 생각엔 다름 아닌 걔들이 그 사이코패스였어요. 소문이긴 한데 걔들이 길에서 길고양이랑 강아지 죽이는 거 본 애도 있어요. 저는요. 자신 있게 말할 수 있어요. 죽을 애들이 죽었다고요. 천벌받은 거라고요.”', author: '-민지 / 괴물'},
                { text: '마지막 임무가 끝이 났다는 건, 내 품안의 엘리도, 아끼는 동료들도 잃을 필요가 없게 됐다는 의미다. 나는 뒤늦게 감정이 북받쳐 오르는 걸 느꼈다. 엘리가 우는 이유도 알 것 같았다. 눈물을 흘리지는 않았다. 다만 품안의 엘리를 더 꽉 끌어안았을 뿐이다. 이로써 나의 전쟁은 끝났다.', author: '-진 오시리스 / 프린테라'},
                { text: '“완전히 죽지는 않았어. 호흡도 있었고, 손상이 좀 있었지만 두뇌는 분명 살아있었지. 죽은 부분도 있었지만 뭐 살려낼 수 있었어. 심장은 거의 정지했었지만. 그래서 우린 자넬 우리의 ‘자원’으로 삼기로 결정했지.”', author: '-루퍼트 오시리스 / 프린테라'},
                { text: '생전 처음 보는 기괴한 모습을 한 여자였다. 두 팔을 축 늘어뜨리고 맨발로 섰는데, 머리칼이 새하얀 백발이다. 얼굴은 그보다 더 하얗다. 핏기없이 하얗다 못해 푸르딩딩하다. 초상이라도 치른 듯 여자는 까만 소복을 입고 있다. 팔은 기형적으로 길어 소매 밖으로 한참이나 비어져 나와 하얀 손이 거의 무릎에 닿아 있다. 손가락 끝에 있는 손톱이 송곳처럼 뾰족하다. 그리고 까만 치마 아래로 제 얼굴처럼 새하얀 두 발, 발톱도 손톱처럼 길다.', author: '-아비'},
            ];
    
            function getRandomQuote() {
              return quotes[Math.floor(Math.random() * quotes.length)];
          }
          
          function updateQuote() {
              const quote = getRandomQuote();
              $('blockquote small').text(quote.text);
              $('footer small').text(quote.author);
          }
          
          $(document).ready(function() {
              updateQuote();
          });
          
          $('#SOHYUNSOO').on('change', updateQuote);
          $('blockquote').on('click', updateQuote); 