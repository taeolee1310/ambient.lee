// main.js
(function () {
  // ============================================================
  //  [설정] 다국어 번역 데이터
  // ============================================================
  const translations = {
    ko: {
      "hero-main": `I design <span class="hero-italic">ambient</span><br>& clear digital products.`,
      "hero-sub": "Product & UI/UX Designer – Ambient.lee",
      "about-sub": `사용자의 맥락을 깊게 이해하고, 무드를 잃지 않는 정교한 화면을 만드는<br>Product · UI/UX Designer Ambient.lee 입니다.`,
      "about-desc": `사용자 리서치와 데이터 기반 접근을 통해 문제를 정의하고,<br>인터랙션과 무드를 결합한 경험을 설계합니다.<br>‘오래 머물고 싶은 화면’을 만드는 것이 목표입니다.`,
      "menu-about": "ABOUT",
      "menu-work": "WORKS",
      "menu-process": "PROCESS",
      "menu-log": "LOG",
      "menu-contact": "CONTACT"
    },
    en: {
      "hero-main": `I design <span class="hero-italic">ambient</span><br>& clear digital products.`,
      "hero-sub": "Product & UI/UX Designer – Ambient.lee",
      "about-sub": `I am Ambient.lee, a Product & UI/UX Designer<br>who deeply understands context and crafts delicate interfaces.`,
      "about-desc": `I define problems through user research and data-driven approaches,<br>designing experiences that combine interaction and mood.<br>My goal is to create screens where users want to stay.`,
      "menu-about": "ABOUT",
      "menu-work": "WORKS",
      "menu-process": "PROCESS",
      "menu-log": "LOG",
      "menu-contact": "CONTACT"
    }
  };

  // ================================
  // 1. 부드러운 스크롤 내비게이션
  // ================================
  function initSmoothScroll() {
    const navLinks = document.querySelectorAll("nav a, .header-left a"); // nav 태그 지원 추가

    function onNavClick(e) {
      const href = this.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const header = document.querySelector(".header");
      const headerHeight = header ? header.offsetHeight : 60;
      const rect = target.getBoundingClientRect();
      const offset = window.pageYOffset + rect.top - headerHeight;

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }

    navLinks.forEach((link) => link.addEventListener("click", onNavClick));
  }

  // ================================
  // 2. 스크롤에 따른 헤더 변화 + Hero parallax
  // ================================
  function initScrollEffects() {
    const header = document.querySelector(".header");
    const hero = document.querySelector(".hero");
    let ticking = false;

    function handleScroll() {
      const y = window.pageYOffset || document.documentElement.scrollTop || 0;

      if (header) {
        if (y > 24) header.classList.add("header--scrolled");
        else header.classList.remove("header--scrolled");
      }

      if (hero) {
        const offset = Math.min(y * 0.06, 40);
        hero.style.backgroundPosition = `50% ${-offset}px`;
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll);
    handleScroll();
  }

  // ================================
  // 3. 스크롤 인뷰 시 fade-in-up
  // ================================
  function initFadeInUp() {
    const items = [];
    const workCards = document.querySelectorAll(".work-card");
    const artistCards = document.querySelectorAll(".artist-card");
    const newsItems = document.querySelectorAll(".news-item");

    function pushAll(list) {
      list.forEach((el) => {
        el.classList.add("fade-in-up");
        items.push(el);
      });
    }

    pushAll(workCards);
    pushAll(artistCards);
    pushAll(newsItems);

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    items.forEach((el) => observer.observe(el));
  }

  // ================================
  // 4. [통합] 언어 변경 시스템 (기능+스타일)
  // ================================
  function initLanguageSystem() {
    const langButtons = document.querySelectorAll(".lang-btn");
    
    // 언어 변경 실행 함수
    function setLanguage(lang) {
      // 1. HTML lang 속성 변경
      document.documentElement.lang = lang;

      // 2. 텍스트 교체 (data-lang 속성 찾기)
      const elements = document.querySelectorAll('[data-lang]');
      elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
          el.innerHTML = translations[lang][key];
        }
      });

      // 3. 버튼 스타일 업데이트
      updateButtons(lang);
    }

    // 버튼 스타일 제어 함수
    function updateButtons(activeLang) {
      langButtons.forEach(btn => {
        const btnText = btn.textContent.trim().toLowerCase(); // kr 또는 en
        if (btnText === activeLang) {
          btn.style.opacity = '1';
          btn.style.fontWeight = 'bold';
        } else {
          btn.style.opacity = '0.4';
          btn.style.fontWeight = 'normal';
        }
      });
    }

    // 버튼에 클릭 이벤트 연결
    langButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        // 버튼 텍스트(KR/EN)를 읽어서 언어 코드로 변환
        const langCode = this.textContent.trim().toLowerCase() === 'kr' ? 'ko' : 'en';
        setLanguage(langCode);
      });
    });

    // 초기 실행 (기본 한국어)
    setLanguage('ko');
  }

  // ================================
  // 5. Light / Dark 스위치
  // ================================
  function initThemeToggle() {
    const body = document.body;

    // 이미 존재하는지 체크 후 생성
    let toggle = document.querySelector(".theme-switch");
    if (!toggle) {
        toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "theme-switch";
        toggle.innerHTML = `
        <span class="switch-label switch-label--light">Light</span>
        <div class="switch-track">
            <div class="switch-knob"></div>
            <span class="switch-dot switch-dot--1"></span>
            <span class="switch-dot switch-dot--2"></span>
        </div>
        <span class="switch-label switch-label--dark">Dark</span>
        `;
        body.appendChild(toggle);
    }

    let isDark = false;

    function applyTheme() {
      body.classList.add("theme-transition");
      setTimeout(() => body.classList.remove("theme-transition"), 35
