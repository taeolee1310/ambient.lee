// main.js
(function () {
  /* ============================================================
     [설정] 다국어 번역 데이터
     ============================================================ */
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

  /* ============================================================
     1. 부드러운 스크롤 내비게이션
     ============================================================ */
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

  /* ============================================================
     2. 스크롤 헤더 변화 + Hero 효과
     ============================================================ */
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
        // CSS에서 배경 설정을 따로 하므로 여기서는 심플하게 패럴랙스만
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

  /* ============================================================
     3. 페이드 인 애니메이션
     ============================================================ */
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

  /* ============================================================
     4. 언어 변경 시스템
     ============================================================ */
  function initLanguageSystem() {
    const langButtons = document.querySelectorAll(".lang-btn");

    function setLanguage(lang) {
      document.documentElement.lang = lang;
      
      const elements = document.querySelectorAll('[data-lang]');
      elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
          el.innerHTML = translations[lang][key];
        }
      });

      langButtons.forEach(btn => {
        const btnText = btn.textContent.trim().toLowerCase();
        const targetLang = (lang === 'ko') ? 'kr' : 'en';

        if (btnText === targetLang) {
          btn.style.backgroundColor = 'var(--color-primary)';
          btn.style.color = '#fff';
        } else {
          btn.style.backgroundColor = '#fff';
          btn.style.color = 'var(--color-primary)';
        }
      });
    }

    langButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const langCode = this.textContent.trim().toLowerCase() === 'kr' ? 'ko' : 'en';
        setLanguage(langCode);
      });
    });

    setLanguage('ko');
  }

  /* ============================================================
     5. 테마 스위치 (Light/Dark)
     ============================================================ */
  function initThemeToggle() {
    const body = document.body;
    let toggle = document.querySelector(".theme-switch");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "theme-switch";
      toggle.type = "button";
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

  /* ============================================================
     6. [배경] Ambient Grain (CSS의 Fixed Canvas 사용)
     ============================================================ */
  function initAmbientGrain() {
    const staticCanvas = document.getElementById("grain-static");
    const scrollCanvas = document.getElementById("grain-scroll");
    
    if (!staticCanvas || !scrollCanvas) return;

    const sctx = staticCanvas.getContext("2d");
    const ctx = scrollCanvas.getContext("2d");

    let w, h, grainTexture;

    function resize() {
      // CSS에서 width: 100%, height: 100%로 잡혀있으므로
      // 실제 픽셀 해상도를 윈도우 크기에 맞춰야 선명하게 나옵니다.
      w = staticCanvas.width = scrollCanvas.width = window.innerWidth;
      h = staticCanvas.height = scrollCanvas.height = window.innerHeight;
      generateGrain();
      drawStaticGrain();
    }

    function generateGrain() {
      const temp = document.createElement("canvas");
      const tctx = temp.getContext("2d");
      temp.width = w;
      temp.height = h;

      const imgData = tctx.createImageData(w, h);
      const buffer = imgData.data;

      // CSS 테마에 맞춘 그레인 노이즈 색상 (약간의 Teal/Red 섞임)
      const mainR = 51, mainG = 140, mainB = 135; // Teal
      const subR = 140, subG = 50, subB = 56;   // Brick Red

      for (let i = 0; i < buffer.length; i += 4) {
        const t = Math.random();
        // 무작위로 Teal 또는 Red 계열 노이즈 생성
        if (Math.random() > 0.5) {
             buffer[i] = mainR; buffer[i+1] = mainG; buffer[i+2] = mainB;
        } else {
             buffer[i] = subR; buffer[i+1] = subG; buffer[i+2] = subB;
        }
        buffer[i + 3] = 30; // 투명도 (너무 진하면 안됨)
      }
      tctx.putImageData(imgData, 0, 0);
      grainTexture = temp;
    }

    function drawStaticGrain() {
      if (!grainTexture) return;
      sctx.clearRect(0, 0, w, h);
      sctx.drawImage(grainTexture, 0, 0);
    }

    // 초기 실행
    resize();
    window.addEventListener("resize", resize);

    // 스크롤 시 약간 움직이는 효과
    let targetOffset = 0;
    let currentOffset = 0;
    window.addEventListener("scroll", () => {
      targetOffset = (window.scrollY || window.pageYOffset || 0) * 0.5;
    });

    function render() {
      currentOffset += (targetOffset - currentOffset) * 0.1;
      ctx.clearRect(0, 0, w, h);
      const offsetY = - (currentOffset % h); // 위로 흘러가게
      
      if (grainTexture) {
          ctx.drawImage(grainTexture, 0, offsetY);
          ctx.drawImage(grainTexture, 0, offsetY + h);
      }
      requestAnimationFrame(render);
    }
    render();
  }

  /* ============================================================
     7. [HERO] Liquid Blob (CSS 색상 적용: Teal & Red)
     ============================================================ */
  function initHeroBlobAndGrain() {
    const hero = document.querySelector(".hero");
    const blobCanvas = document.getElementById("hero-blob");
    const grainCanvas = document.getElementById("hero-grain");
    
    // 캔버스가 없으면 중단
    if (!hero || !blobCanvas || !grainCanvas) return;

    const bctx = blobCanvas.getContext("2d");
    const gctx = grainCanvas.getContext("2d");

    let w, h;
    let ballX, ballY, vx, vy, r;
    let mouseX = 0, mouseY = 0, mouseInside = false;

    // 움직임 설정
    const FRICTION = 0.98;
    const BOUNCE = 0.9;
    
    let grainTexture = null;

    function resize() {
      // Hero 섹션의 실제 크기를 가져옴
      const rect = hero.getBoundingClientRect();
      w = blobCanvas.width = grainCanvas.width = rect.width;
      h = blobCanvas.height = grainCanvas.height = rect.height;

      // 공 크기 설정
      r = Math.min(w, h) * 0.15; // 화면의 15% 크기

      // 공 초기 위치
      if (typeof ballX === 'undefined') {
        ballX = w / 2;
        ballY = h / 2;
        vx = 2; vy = -1.5;
      }
      
      generateHeroGrain();
    }

    // 마우스 인터랙션
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseInside = true;
    });
    hero.addEventListener("mouseleave", () => { mouseInside = false; });

    function updateBall() {
      if (!w || !h) return;

      // 마우스 반발력
      if (mouseInside) {
        const dx = ballX - mouseX;
        const dy = ballY - mouseY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const forceRadius = r * 1.5;

        if (dist < forceRadius) {
           const angle = Math.atan2(dy, dx);
           const force = (forceRadius - dist) * 0.05;
           vx += Math.cos(angle) * force;
           vy += Math.sin(angle) * force;
        }
      }

      // 물리 적용
      ballX += vx;
      ballY += vy;
      vx *= FRICTION;
      vy *= FRICTION;

      // 벽 튕기기
      if (ballX < r) { ballX = r; vx *= -BOUNCE; }
      if (ballX > w - r) { ballX = w - r; vx *= -BOUNCE; }
      if (ballY < r) { ballY = r; vy *= -BOUNCE; }
      if (ballY > h - r) { ballY = h - r; vy *= -BOUNCE; }

      // 멈춤 방지 (계속 조금씩 움직이게)
      const speed = Math.sqrt(vx*vx + vy*vy);
      if (speed < 0.2) {
         vx += (Math.random() - 0.5) * 0.5;
         vy += (Math.random() - 0.5) * 0.5;
      }
    }

    function drawBlob() {
      if (!w || !h) return;
      bctx.clearRect(0, 0, w, h);

      // ✅ [중요] CSS 컬러 변수 적용 (Teal -> Red 그라디언트)
      // --color-primary: #338C87 (Teal)
      // --color-sub: #8C3238 (Brick Red)
      const grad = bctx.createRadialGradient(ballX, ballY, r * 0.2, ballX, ballY, r);
      grad.addColorStop(0, "rgba(51, 140, 135, 1)");  // Teal 중심
      grad.addColorStop(1, "rgba(140, 50, 56, 0.8)"); // Red 외곽

      bctx.beginPath();
      bctx.arc(ballX, ballY, r, 0, Math.PI * 2);
      bctx.fillStyle = grad;
      bctx.fill();
    }

    function generateHeroGrain() {
       // Hero 전용 거친 노이즈
       const temp = document.createElement("canvas");
       temp.width = w; temp.height = h;
       const tctx = temp.getContext("2d");
       const img = tctx.createImageData(w, h);
       const buf = img.data;
       
       for(let i=0; i<buf.length; i+=4) {
         const v = Math.random() * 255;
         buf[i] = v; buf[i+1] = v; buf[i+2] = v;
         buf[i+3] = 40; // 투명도
       }
       tctx.putImageData(img, 0, 0);
       grainTexture = temp;
    }

    function drawGrain() {
        if(grainTexture) {
            gctx.clearRect(0, 0, w, h);
            gctx.drawImage(grainTexture, 0, 0);
        }
    }

    function render() {
      updateBall();
      drawBlob();
      drawGrain();
      requestAnimationFrame(render);
    }

    // 초기화
    resize();
    window.addEventListener("resize", resize);
    render();
  }

  /* ============================================================
     실행 (DOM 로드 후)
     ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initScrollEffects();
    initFadeInUp();
    initLanguageSystem();
    initThemeToggle();
    initAmbientGrain();      // 배경 그레인 실행
    initHeroBlobAndGrain();  // 히어로 원 실행 (Teal/Red)
  });
})();
