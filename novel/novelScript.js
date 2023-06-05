const toggleSwitch = document.getElementById('switch');
const etSlide = document.querySelector('.et-slide');
const etTabs = document.querySelector('.et-hero-tabs');
const etMain = document.querySelector('.et-main');



toggleSwitch.addEventListener('change', function() {
    if (this.checked) {
      etSlide.classList.add('dark');
      etTabs.classList.add('dark'); // 'dark' 클래스 추가
      etMain.classList.add('dark');
    } else {
      etSlide.classList.remove('dark');
      etTabs.classList.remove('dark');
      etMain.classList.remove('dark');
    }
  });
  


class StickyNavigation {
    constructor() {
        this.currentId = null;
        this.currentTab = null;
        this.tabContainerHeight = 70;
        this.tabs = document.querySelectorAll(".et-hero-tab");
        this.tabContainer = document.querySelector(".et-hero-tabs-container");
        this.tabSlider = document.querySelector(".et-hero-tab-slider");
        this.tabs.forEach(tab => {
            tab.addEventListener('click', this.onTabClick.bind(this));
        });
        window.addEventListener('scroll', this.onScroll.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
    }

    onTabClick(event) {
        event.preventDefault();
        let scrollTop =
            document.querySelector(event.currentTarget.getAttribute('href')).offsetTop - this.tabContainerHeight + 1;
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }

    onScroll() {
        this.checkTabContainerPosition();
        this.findCurrentTabSelector();
    }

    onResize() {
        if (this.currentId) {
            this.setSliderCss();
        }
    }

    checkTabContainerPosition() {
        let offset =
            this.tabContainer.offsetTop +
            this.tabContainer.offsetHeight -
            this.tabContainerHeight;
        if (window.scrollY > offset) {
            this.tabContainer.classList.add("et-hero-tabs-container--top");
        } else {
            this.tabContainer.classList.remove("et-hero-tabs-container--top");
        }
    }

    findCurrentTabSelector() {
        let newCurrentId;
        let newCurrentTab;
        let earlyOffset = 300;  // Set this to however much earlier you want the slider to move
        this.tabs.forEach(tab => {
            let id = tab.getAttribute('href');
            let targetElement = document.querySelector(id);
            let offsetTop = targetElement.offsetTop - this.tabContainerHeight - earlyOffset;
            let offsetBottom = targetElement.offsetTop + targetElement.offsetHeight - this.tabContainerHeight;
            if (
                window.scrollY > offsetTop &&
                window.scrollY < offsetBottom
            ) {
                newCurrentId = id;
                newCurrentTab = tab;
            }
        });
        if (this.currentId !== newCurrentId || this.currentId === null) {
            this.currentId = newCurrentId;
            this.currentTab = newCurrentTab;
            this.setSliderCss();
        }
    }
    

    setSliderCss() {
        let width = 0;
        let left = 0;
        if (this.currentTab) {
            width = getComputedStyle(this.currentTab).width;
            left = this.currentTab.getBoundingClientRect().left;
        }
        this.tabSlider.style.width = width;
        this.tabSlider.style.left = `${left}px`;
    }
}
    document.querySelector("#home-button").addEventListener('click', function(){
        location.href="../"
    });

    document.querySelector('#share-button').addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '소현수 작가의 미공개 작품선',
                    text: '꿀잼 발견!',
                    url: 'https://sohyunsoo.xyz/novel/novel.html',
                })
                console.log('Sharing successful')
            } catch (err) {
                console.log('Sharing failed', err)
            }
        } else {
            // fallback for desktop browsers
            const textArea = document.createElement('textarea');
            textArea.value = 'https://sohyunsoo.xyz/novel/novel.html';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('Copy');
            textArea.remove();
            alert('Link copied to clipboard');
        }
      });

new StickyNavigation();
