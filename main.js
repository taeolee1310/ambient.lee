// main.js
(function () {
  // ================================
  // 1. 부드러운 스크롤 내비게이션
  // ================================
  function initSmoothScroll() {
    const navLinks = document.querySelectorAll(".header-left a");

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
      const y =
        window.pageYOffset || document.documentElement.scrollTop || 0;

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
  // 4. 언어 버튼 토글
  // ================================
  function initLangToggle() {
    const langButtons = document.querySelectorAll(".lang-btn");
    if (!langButtons.length) return;

    langButtons.forEach((btn) =>
      btn.addEventListener("click", function () {
        langButtons.forEach((b) => b.classList.remove("lang-btn--active"));
        this.classList.add("lang-btn--active");
      })
    );

    langButtons[0].classList.add("lang-btn--active");
  }

  // ================================
  // 5. Light / Dark 스위치 (.theme-switch)
  // ================================
  function initThemeToggle() {
    const body = document.body;

    const toggle = document.createElement("button");
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

    let isDark = false;

    function applyTheme() {
      body.classList.add("theme-transition");
      setTimeout(() => body.classList.remove("theme-transition"), 350);

      if (isDark) {
        body.classList.add("theme-dark");
        toggle.classList.add("is-dark");
      } else {
        body.classList.remove("theme-dark");
        toggle.classList.remove("is-dark");
      }
    }

    toggle.addEventListener("click", () => {
      isDark = !isDark;
      applyTheme();
    });

    applyTheme();
  }

  /* ============================================================
     6. Dual Layer Film Grain – static + scroll (배경용)
     색상: 메인 #FC9877, 서브 #003049
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

      temp.width = w;
      temp.height = h;

      const imgData = tctx.createImageData(w, h);
      const buffer = imgData.data;

      const mainR = 252,
        mainG = 152,
        mainB = 119; // #FC9877
      const subR = 0,
        subG = 48,
        subB = 73; // #003049

      for (let i = 0; i < buffer.length; i += 4) {
        const t = Math.random();

        const r = mainR * t + subR * (1 - t);
        const g = mainG * t + subG * (1 - t);
        const b = mainB * t + subB * (1 - t);

        buffer[i] = r;
        buffer[i + 1] = g;
        buffer[i + 2] = b;
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
      const y = window.scrollY || window.pageYOffset || 0;
      targetOffset = y * 0.7;
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
     7. HERO – Liquid Blob + Pro 400H Grain + 마우스 반발 튕김
     - 히어로 전체를 운동장으로 사용
     - 마우스가 공에 "닿으면" 반대 방향으로 튕겨나감 (자석 X)
  ============================================================ */
  function initHeroBlobAndGrain() {
    const hero = document.querySelector(".hero");
    const blobCanvas = document.getElementById("hero-blob");
    const grainCanvas = document.getElementById("hero-grain");
    if (!hero || !blobCanvas || !grainCanvas) return;

    const bctx = blobCanvas.getContext("2d");
    const gctx = grainCanvas.getContext("2d");
    if (!bctx || !gctx) return;

    let w, h, r;
    let ballX, ballY, vx, vy;

    let mouseX = 0;
    let mouseY = 0;
    let mouseInside = false;

    const FRICTION = 0.985;
    const BOUNCE = 0.9;
    const MIN_SPEED = 0.15;
    const IDLE_JITTER = 0.04;

    let grainTexture = null;

    function resize() {
      const rect = hero.getBoundingClientRect();
      w = blobCanvas.width = grainCanvas.width = rect.width || window.innerWidth;
      h = blobCanvas.height = grainCanvas.height = rect.height || 400;

      r = Math.min(w, h) * 0.12;

      if (typeof ballX !== "number" || typeof ballY !== "number") {
        ballX = w * 0.5;
        ballY = h * 0.5;
        vx = 1.8;
        vy = -1.4;
      } else {
        ballX = Math.min(Math.max(ballX, r), w - r);
        ballY = Math.min(Math.max(ballY, r), h - r);
      }

      generateHeroGrain();
    }

    // 마우스 위치 (hero 기준)
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        mouseInside = false;
        return;
      }

      mouseInside = true;
      mouseX = x;
      mouseY = y;
    });

    hero.addEventListener("mouseleave", () => {
      mouseInside = false;
    });

    function updateBall() {
      if (!w || !h || !r) return;

      // 마우스에 "닿으면" 반대 방향으로 튕겨 나가게 하는 반발력
      if (mouseInside) {
        const dx = ballX - mouseX;
        const dy = ballY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const collideRadius = r * 1.05;

        if (dist > 0 && dist < collideRadius) {
          const ux = dx / dist;
          const uy = dy / dist;

          const hitForce = 2.8; // 너무 튀면 2.0~2.5로 줄이면 됨
          vx += ux * hitForce;
          vy += uy * hitForce;

          const pushOut = collideRadius - dist;
          ballX += ux * pushOut;
          ballY += uy * pushOut;
        }
      }

      vx *= FRICTION;
      vy *= FRICTION;

      ballX += vx;
      ballY += vy;

      const minX = r * 0.7;
      const maxX = w - r * 0.7;
      const minY = r * 0.7;
      const maxY = h - r * 0.7;

      if (ballX < minX) {
        ballX = minX;
        vx = Math.abs(vx) * BOUNCE;
      } else if (ballX > maxX) {
        ballX = maxX;
        vx = -Math.abs(vx) * BOUNCE;
      }

      if (ballY < minY) {
        ballY = minY;
        vy = Math.abs(vy) * BOUNCE;
      } else if (ballY > maxY) {
        ballY = maxY;
        vy = -Math.abs(vy) * BOUNCE;
      }

      const speed = Math.sqrt(vx * vx + vy * vy);
      if (!mouseInside && speed < MIN_SPEED) {
        const angle = Math.random() * Math.PI * 2;
        vx += Math.cos(angle) * IDLE_JITTER;
        vy += Math.sin(angle) * IDLE_JITTER;
      }
    }

    function drawBlob() {
      if (!w || !h || !r) return;

      bctx.clearRect(0, 0, w, h);

      const speed = Math.sqrt(vx * vx + vy * vy);
      const squish = Math.min(speed * 0.02, 0.35);

      const rx = r * (1 + squish);
      const ry = r * (1 - squish);

      const grad = bctx.createRadialGradient(
        ballX,
        ballY,
        r * 0.3,
        ballX,
        ballY,
        r
      );
      grad.addColorStop(0, "#FC9877");
      grad.addColorStop(1, "#003049");

      bctx.save();
      bctx.translate(ballX, ballY);
      bctx.beginPath();
      bctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      bctx.fillStyle = grad;
      bctx.fill();
      bctx.restore();
    }

    // Pro 400H 느낌의 Hero 전용 컬러 그레인
    function generateHeroGrain() {
      const scale = 0.45; // 해상도 일부러 낮춰서 입자를 크게
      const gw = Math.max(1, Math.floor(w * scale));
      const gh = Math.max(1, Math.floor(h * scale));

      const temp = document.createElement("canvas");
      temp.width = gw;
      temp.height = gh;

      const tctx = temp.getContext("2d");
      const img = tctx.createImageData(gw, gh);
      const buf = img.data;

      for (let i = 0; i < buf.length; i += 4) {
        const n = Math.random();

        // Pro 400H 계열 – 약간 차갑고 중립적인 톤
        const rCh = 240 + n * 18;
        const gCh = 238 + n * 20;
        const bCh = 242 + n * 22;

        buf[i] = rCh;
        buf[i + 1] = gCh;
        buf[i + 2] = bCh;
        buf[i + 3] = 55; // 낮은 알파 → 공기감만
      }

      tctx.putImageData(img, 0, 0);
      grainTexture = temp;
    }

    function drawGrain() {
      if (!grainTexture) return;
      gctx.clearRect(0, 0, w, h);
      gctx.imageSmoothingEnabled = true;
      gctx.drawImage(grainTexture, 0, 0, w, h);
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

  // ================================
  // INITIALIZE
  // ================================
  document.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initScrollEffects();
    initFadeInUp();
    initLangToggle();
    initThemeToggle();
    initAmbientGrain();
    initHeroBlobAndGrain();
  });
})();
