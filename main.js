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
  // 4. 언어 변경 시스템 (통합됨)
  // ================================
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
        if (btn.textContent.trim().toLowerCase() === (lang === 'ko' ? 'kr' : 'en')) {
          btn.classList.add("lang-btn--active");
        } else {
          btn.classList.remove("lang-btn--active");
        }
      });
    }

    langButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        const langCode = this.textContent.trim().toLowerCase() === 'kr' ? 'ko' : 'en';
        setLanguage(langCode);
      });
    });

    setLanguage('ko'); // 기본값 설정
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
        toggle.innerHTML = `<span class="switch-label switch-label--light">Light</span><div class="switch-track"><div class="switch-knob"></div><span class="switch-dot switch-dot--1"></span><span class="switch-dot switch-dot--2"></span></div><span class="switch-label switch-label--dark">Dark</span>`;
        body.appendChild(toggle);
    }
    let isDark = false;
    toggle.addEventListener("click", () => {
      isDark = !isDark;
      body.classList.add("theme-transition");
      setTimeout(() => body.classList.remove("theme-transition"), 350);
      if (isDark) {
        body.classList.add("theme-dark"); toggle.classList.add("is-dark");
      } else {
        body.classList.remove("theme-dark"); toggle.classList.remove("is-dark");
      }
    });
  }

  /* ============================================================
     6. Dual Layer Film Grain – static + scroll (배경용)
     (누락되었던 코드를 복구했습니다)
  ============================================================ */
  function initAmbientGrain() {
    const staticCanvas = document.getElementById("grain-static");
    const scrollCanvas = document.getElementById("grain-scroll");
    if (!staticCanvas || !scrollCanvas) return;

    const sctx = staticCanvas.getContext("2d");
    const ctx = scrollCanvas.getContext("2d");
    let w, h, grainTexture;

    function resize() {
      w = staticCanvas.width = scrollCanvas.width = window.innerWidth;
      h = staticCanvas.height = scrollCanvas.height = window.innerHeight;
      generateGrain();
      drawStaticGrain();
    }

    function generateGrain() {
      const temp = document.createElement("canvas");
      const tctx = temp.getContext("2d");
      temp.width = w; temp.height = h;
      const imgData = tctx.createImageData(w, h);
      const buffer = imgData.data;
      const mainR = 252, mainG = 152, mainB = 119; 
      const subR = 0, subG = 48, subB = 73; 
      for (let i = 0; i < buffer.length; i += 4) {
        const t = Math.random();
        buffer[i] = mainR * t + subR * (1 - t);
        buffer[i + 1] = mainG * t + subG * (1 - t);
        buffer[i + 2] = mainB * t + subB * (1 - t);
        buffer[i + 3] = 130;
      }
      tctx.putImageData(imgData, 0, 0);
      grainTexture = temp;
    }

    function drawStaticGrain() {
      sctx.clearRect(0, 0, w, h);
      sctx.drawImage(grainTexture, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    let targetOffset = 0;
    let currentOffset = 0;
    window.addEventListener("scroll", () => {
      targetOffset = (window.scrollY || window.pageYOffset || 0) * 0.7;
    });

    function render() {
      currentOffset += (targetOffset - currentOffset) * 0.06;
      ctx.clearRect(0, 0, w, h);
      const offsetY = currentOffset % h;
      ctx.drawImage(grainTexture, 0, offsetY);
      ctx.drawImage(grainTexture, 0, offsetY - h);
      requestAnimationFrame(render);
    }
    render();
  }

  /* ============================================================
     7. HERO – Liquid Blob + Grain + 마우스 반발
     (누락되었던 코드를 복구했습니다)
  ============================================================ */
  function initHeroBlobAndGrain() {
    const hero = document.querySelector(".hero");
    const blobCanvas = document.getElementById("hero-blob");
    const grainCanvas = document.getElementById("hero-grain");
    if (!hero || !blobCanvas || !grainCanvas) return;

    const bctx = blobCanvas.getContext("2d");
    const gctx = grainCanvas.getContext("2d");
    let w, h, r, ballX, ballY, vx, vy;
    let mouseX = 0, mouseY = 0, mouseInside = false;
    const FRICTION = 0.985, BOUNCE = 0.9, MIN_SPEED = 0.15, IDLE_JITTER = 0.04;
    let grainTexture = null;

    function resize() {
      const rect = hero.getBoundingClientRect();
      w = blobCanvas.width = grainCanvas.width = rect.width || window.innerWidth;
      h = blobCanvas.height = grainCanvas.height = rect.height || 400;
      r = Math.min(w, h) * 0.12;
      if (typeof ballX !== "number") {
        ballX = w * 0.5; ballY = h * 0.5; vx = 1.8; vy = -1.4;
      } else {
        ballX = Math.min(Math.max(ballX, r), w - r);
        ballY = Math.min(Math.max(ballY, r), h - r);
      }
      generateHeroGrain();
    }

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouseInside = true;
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    hero.addEventListener("mouseleave", () => { mouseInside = false; });

    function updateBall() {
      if (!w) return;
      if (mouseInside) {
        const dx = ballX - mouseX, dy = ballY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const collideRadius = r * 1.05;
        if (dist > 0 && dist < collideRadius) {
          const ux = dx / dist, uy = dy / dist;
          vx += ux * 2.8; vy += uy * 2.8;
          ballX += ux * (collideRadius - dist); ballY += uy * (collideRadius - dist);
        }
      }
      vx *= FRICTION; vy *= FRICTION;
      ballX += vx; ballY += vy;
      // 벽 튕기기
      if (ballX < r*0.7) { ballX = r*0.7; vx = Math.abs(vx) * BOUNCE; }
      else if (ballX > w - r*0.7) { ballX = w - r*0.7; vx = -Math.abs(vx) * BOUNCE; }
      if (ballY < r*0.7) { ballY = r*0.7; vy = Math.abs(vy) * BOUNCE; }
      else if (ballY > h - r*0.7) { ballY = h - r*0.7; vy = -Math.abs(vy) * BOUNCE; }
      
      const speed = Math.sqrt(vx*vx + vy*vy);
      if (!mouseInside && speed < MIN_SPEED) {
        const angle = Math.random() * Math.PI * 2;
        vx += Math.cos(angle) * IDLE_JITTER; vy += Math.sin(angle) * IDLE_JITTER;
      }
    }

    function drawBlob() {
      if (!w) return;
      bctx.clearRect(0, 0, w, h);
      const speed = Math.sqrt(vx*vx + vy*vy);
      const squish = Math.min(speed * 0.02, 0.35);
      const grad = bctx.createRadialGradient(ballX, ballY, r*0.3, ballX, ballY, r);
      grad.addColorStop(0, "#FC9877"); grad.addColorStop(1, "#003049");
      bctx.save();
      bctx.translate(ballX, ballY);
      bctx.beginPath();
      bctx.ellipse(0, 0, r*(1+squish), r*(1-squish), 0, 0, Math.PI*2);
      bctx.fillStyle = grad; bctx.fill(); bctx.restore();
    }

    function generateHeroGrain() {
      const scale = 0.45, gw = Math.floor(w * scale), gh = Math.floor(h * scale);
      const temp = document.createElement("canvas");
      temp.width = gw; temp.height = gh;
      const tctx = temp.getContext("2d"), img = tctx.createImageData(gw, gh), buf = img.data;
      for (let i = 0; i < buf.length; i += 4) {
        const n = Math.random();
        buf[i] = 240 + n * 18; buf[i+1] = 238 + n * 20; buf[i+2] = 242 + n * 22; buf[i+3] = 55;
      }
      tctx.putImageData(img, 0, 0); grainTexture = temp;
    }

    function drawGrain() {
      if (!grainTexture) return;
      gctx.clearRect(0, 0, w, h); gctx.imageSmoothingEnabled = true;
      gctx.drawImage(grainTexture, 0, 0, w, h);
    }

    function render() {
      updateBall(); drawBlob(); drawGrain(); requestAnimationFrame(render);
    }
    resize(); window.addEventListener("resize", resize); render();
  }

  // ================================
  // 실행
  // ================================
  document.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initScrollEffects();
    initFadeInUp();
    initLanguageSystem();
    initThemeToggle();
    initAmbientGrain();      // 배경 그레인 실행
    initHeroBlobAndGrain();  // 히어로 원 실행
  });
})();
