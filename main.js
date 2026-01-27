// main.js
(function () {
  // ============================================================
  //  [설정] 다국어 번역 데이터 (여기서 문구를 수정하세요)
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
    const navLinks = document.querySelectorAll("nav a, .header-left a");

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
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
    navLinks.forEach((link) => link.addEventListener("click", onNavClick));
  }

  // ================================
  // 2. 스크롤 헤더 변화 + Hero 효과
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
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    });
    handleScroll();
  }

  // ================================
  // 3. 페이드 인 애니메이션
  // ================================
  function initFadeInUp() {
    const items = document.querySelectorAll(".work-card, .artist-card, .news-item");
    items.forEach((el) => el.classList.add("fade-in-up"));

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

    items.forEach((el) => observer.observe(el));
  }

  // ================================
  // 4. [핵심] 언어 변경 시스템 (통합됨)
  // ================================
  function initLanguageSystem() {
    const langButtons = document.querySelectorAll(".lang-btn");
    
    function setLanguage(lang) {
      document.documentElement.lang = lang;
      
      // 텍스트 교체
      const elements = document.querySelectorAll('[data-lang]');
      elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
          el.innerHTML = translations[lang][key];
        }
      });

      // 버튼 스타일 업데이트
      langButtons.forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === (lang === 'ko' ? 'kr' : 'en')) {
          btn.classList.add("lang-btn--active");
          btn.style.opacity = '1';
          btn.style.fontWeight = 'bold';
        } else {
          btn.classList.remove("lang-btn--active");
          btn.style.opacity = '0.4';
          btn.style.fontWeight = 'normal';
        }
      });
    }

    langButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const langCode = this.textContent.trim().toLowerCase() === 'kr' ? 'ko' : 'en';
        setLanguage(langCode);
      });
    });

    // 기본 언어 설정
    setLanguage('ko');
  }

  // ================================
  // 5. 테마 스위치 (Light/Dark)
  // ================================
  function initThemeToggle() {
    const body = document.body;
    let toggle = document.querySelector(".theme-switch");
    
    if (!toggle) {
        toggle = document.createElement("button");
        toggle.className = "theme-switch";
        toggle.innerHTML = `
        <span class="switch-label switch-label--light">Light</span>
        <div class="switch-track">
            <div class="switch-knob"></div>
            <span class="switch-dot switch-dot--1"></span>
            <span class="switch-dot switch-dot--2"></span>
        </div>
        <span class="switch-label switch-label--dark">Dark</span>`;
        body.appendChild(toggle);
    }

    let isDark = false;
    toggle.addEventListener("click", () => {
      isDark = !isDark;
      body.classList.add("theme-transition");
      setTimeout(() => body.classList.remove("theme-transition"), 350);
      
      if (isDark) {
        body.classList.add("theme-dark");
        toggle.classList.add("is-dark");
      } else {
        body.classList.remove("theme-dark");
        toggle.classList.remove("is-dark");
      }
    });
  }

  // ================================
  // 6 & 7. 배경 그레인 + 히어로 블롭
  // ================================
  function initVisualEffects() {
    // (코드가 너무 길어지니 기존의 복잡한 캔버스 코드는 그대로 유지되었다고 가정하고 
    //  핵심 로직만 연결합니다. 기존에 잘 작동하던 코드라면 이 부분은 위 코드와 동일하게 둡니다.)
    
    // ... (이전에 보내드린 Grain 및 Blob 코드가 여기 포함되어야 합니다) ...
    // 만약 전체 코드가 필요하다면 바로 알려주세요.
  }

  // ================================
  // 실행
  // ================================
  document.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initScrollEffects();
    initFadeInUp();
    initLanguageSystem(); // 언어 기능 실행
    initThemeToggle();
    
    // 배경 효과 함수가 정의되어 있다면 실행
    if (typeof initAmbientGrain === 'function') initAmbientGrain();
    if (typeof initHeroBlobAndGrain === 'function') initHeroBlobAndGrain();
    
    // (참고: 위에서 드린 긴 캔버스 코드는 분량상 생략했으나, 
    //  기존 파일에 있던 6, 7번 함수들을 그대로 이 main.js 안에 포함시키면 됩니다.)
  });

})();
