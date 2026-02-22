(function () {
  /* ============================================================
     [설정] 다국어 번역 데이터
     ============================================================ */
  const translations = {
    ko: {
      "hero-main": `복잡함을 비워낸 투명함, 일상을 감싸는 편안함.<br>그 경계에서 디지털 프로덕트를 설계합니다.`, // <-- 이 부분이 수정되었습니다.
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
     4. 언어 변경 시스템 (슬라이딩 인터랙션)
     ============================================================ */
  function initLanguageSystem() {
    const glider = document.querySelector(".lang-glider");
    const buttons = document.querySelectorAll(".lang-btn");

    function setLanguage(lang) {
      document.documentElement.lang = lang;
      const elements = document.querySelectorAll('[data-lang]');
      elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
          el.innerHTML = translations[lang][key];
        }
      });

      buttons.forEach(btn => {
        const val = btn.getAttribute("data-val");
        if (val === lang) {
          btn.classList.add("active");
          if (glider) {
            glider.style.transform = (val === 'ko') ? "translateX(0)" : "translateX(100%)";
          }
        } else {
          btn.classList.remove("active");
        }
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener("click", function () {
        setLanguage(this.getAttribute("data-val"));
      });
    });
    setLanguage('ko');
  }

  /* ============================================================
     5. 테마 스위치 (Light/Dark) - 수정됨
     ============================================================ */
  function initThemeToggle() {
    const body = document.body;
    // HTML에 직접 추가한 버튼을 찾습니다.
    const toggle = document.querySelector(".theme-toggle");
    
    if (!toggle) return;

    let isDark = false;
    toggle.addEventListener("click", () => {
      isDark = !isDark;
      
      // 부드러운 전환을 위한 클래스
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
     6. [배경] Ambient Grain
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
      const mainR = 51, mainG = 140, mainB = 135;
      const subR = 140, subG = 50, subB = 56;

      for (let i = 0; i < buffer.length; i += 4) {
        if (Math.random() > 0.5) {
          buffer[i] = mainR; buffer[i + 1] = mainG; buffer[i + 2] = mainB;
        } else {
          buffer[i] = subR; buffer[i + 1] = subG; buffer[i + 2] = subB;
        }
        buffer[i + 3] = 30;
      }
      tctx.putImageData(imgData, 0, 0);
      grainTexture = temp;
    }

    function drawStaticGrain() {
      if (!grainTexture) return;
      sctx.clearRect(0, 0, w, h);
      sctx.drawImage(grainTexture, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    let targetOffset = 0;
    let currentOffset = 0;
    window.addEventListener("scroll", () => {
      targetOffset = (window.scrollY || window.pageYOffset || 0) * 0.5;
    });

    function render() {
      currentOffset += (targetOffset - currentOffset) * 0.1;
      ctx.clearRect(0, 0, w, h);
      const offsetY = -(currentOffset % h);
      if (grainTexture) {
        ctx.drawImage(grainTexture, 0, offsetY);
        ctx.drawImage(grainTexture, 0, offsetY + h);
      }
      requestAnimationFrame(render);
    }
    render();
  }

  /* ============================================================
     7. [HERO] Liquid Blob
     ============================================================ */
  function initHeroBlobAndGrain() {
    const hero = document.querySelector(".hero");
    const blobCanvas = document.getElementById("hero-blob");
    const grainCanvas = document.getElementById("hero-grain");

    if (!hero || !blobCanvas || !grainCanvas) return;

    const bctx = blobCanvas.getContext("2d");
    const gctx = grainCanvas.getContext("2d");
    let w, h, ballX, ballY, vx, vy, r;
    let mouseX = 0, mouseY = 0, mouseInside = false;
    let grainTexture = null;

    function resize() {
      const rect = hero.getBoundingClientRect();
      w = blobCanvas.width = grainCanvas.width = rect.width;
      h = blobCanvas.height = grainCanvas.height = rect.height;
      r = Math.min(w, h) * 0.15;
      if (typeof ballX === 'undefined') {
        ballX = w / 2; ballY = h / 2;
        vx = 2; vy = -1.5;
      }
      generateHeroGrain();
    }

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseInside = true;
    });
    hero.addEventListener("mouseleave", () => { mouseInside = false; });

    function updateBall() {
      if (!w || !h) return;
      if (mouseInside) {
        const dx = ballX - mouseX;
        const dy = ballY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const forceRadius = r * 1.5;
        if (dist < forceRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (forceRadius - dist) * 0.05;
          vx += Math.cos(angle) * force;
          vy += Math.sin(angle) * force;
        }
      }
      ballX += vx; ballY += vy;
      vx *= 0.98; vy *= 0.98;

      if (ballX < r) { ballX = r; vx *= -0.9; }
      if (ballX > w - r) { ballX = w - r; vx *= -0.9; }
      if (ballY < r) { ballY = r; vy *= -0.9; }
      if (ballY > h - r) { ballY = h - r; vy *= -0.9; }
    }

    function drawBlob() {
      if (!w || !h) return;
      bctx.clearRect(0, 0, w, h);
      bctx.beginPath();
      bctx.arc(ballX, ballY, r, 0, Math.PI * 2);
      bctx.fillStyle = "#214769"; // 요청하신 단색
      bctx.fill();
    }

    function generateHeroGrain() {
      const temp = document.createElement("canvas");
      temp.width = w; temp.height = h;
      const tctx = temp.getContext("2d");
      const img = tctx.createImageData(w, h);
      const buf = img.data;
      for (let i = 0; i < buf.length; i += 4) {
        const v = Math.random() * 255;
        buf[i] = v; buf[i + 1] = v; buf[i + 2] = v; buf[i + 3] = 40;
      }
      tctx.putImageData(img, 0, 0);
      grainTexture = temp;
    }

    function drawGrain() {
      if (grainTexture) {
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
    initAmbientGrain();
    initHeroBlobAndGrain();
  });
})();
