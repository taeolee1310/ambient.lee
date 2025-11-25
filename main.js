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
  // 5. Light / Dark 스위치
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
     6. Dual Layer Film Grain – static + scroll
     색상: 메인 #FC9877, 서브 #003049만 사용
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
      const y = window.scrollY;
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

  // ================================
  // INITIALIZE (공통 UI)
  // ================================
  document.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initScrollEffects();
    initFadeInUp();
    initLangToggle();
    initThemeToggle();
    initAmbientGrain();
  });
})();

/* ============================================================
   HERO – Liquid Blob + Bouncy Ball + Film Grain
   Colors: #FC9877 (main), #003049 (sub)
   - 히어로 전체를 운동장으로 사용
   - 공은 더 작게
   - 회전 없음 (찌그러짐만)
   - 마우스가 공 근처에 올 때만 부드럽게 반응
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

  // 공 위치/속도
  let ballX = 0;
  let ballY = 0;
  let vx = 0;
  let vy = 0;

  // 마우스 상태
  let mouseX = 0;
  let mouseY = 0;
  let mouseInside = false;

  // 물리 상수
  const SPRING_STRENGTH = 0.14; // 마우스 근처에서 끌려오는 힘
  const DAMPING = 0.985;        // 감쇠(마찰)
  const BOUNCE = 0.94;          // 벽 튕김 탄성
  const MIN_SPEED = 0.18;       // 너무 느려질 때 기준
  const IDLE_JITTER = 0.06;     // 멈추지 않게 살짝 넣는 랜덤 힘

  let grainTexture = null;

  /* ===========================
        리사이즈: hero 전체 기준
  ============================ */
  function resize() {
    const rect = hero.getBoundingClientRect();
    w = blobCanvas.width = grainCanvas.width = rect.width || window.innerWidth;
    h = blobCanvas.height = grainCanvas.height = rect.height || 400;

    // 공 크기: hero 크기의 12% 정도
    r = Math.min(w, h) * 0.12;

    // 기본 위치: 중앙
    ballX = w * 0.5;
    ballY = h * 0.5;

    // 초깃값에 약간의 속도 부여 (마우스 없어도 살아있게)
    vx = 2.0;
    vy = -1.5;

    generateGrain();
  }

  /* ===========================
        마우스 이벤트 (hero 기준)
  ============================ */
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

  /* ===========================
        1) 탱탱볼 업데이트
  ============================ */
  function updateBall() {
    if (!w || !h || !r) return;

    let applySpring = false;

    // 마우스가 공 주변 일정 반경(influenceRadius) 안에 있을 때만 스프링 적용
    if (mouseInside) {
      const dx = mouseX - ballX;
      const dy = mouseY - ballY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influenceRadius = r * 1.1; // 공 반지름 근처 정도에서만 반응

      if (dist < influenceRadius && dist > 0.001) {
        applySpring = true;

        const t = 1 - dist / influenceRadius; // 가까울수록 1에 가까움
        const effectiveSpring = SPRING_STRENGTH * t;

        vx += dx * effectiveSpring;
        vy += dy * effectiveSpring;
      }
    }

    // 마찰
    vx *= DAMPING;
    vy *= DAMPING;

    // 위치 업데이트
    ballX += vx;
    ballY += vy;

    // 히어로 영역 안에서만 튕기도록 경계 설정
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

    // 마우스 영향이 없고 너무 느려지면,
    // 완전히 멈추지 않도록 부드러운 랜덤 힘만 살짝 추가
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (!applySpring && speed < MIN_SPEED) {
      const angle = Math.random() * Math.PI * 2;
      vx += Math.cos(angle) * IDLE_JITTER;
      vy += Math.sin(angle) * IDLE_JITTER;
    }
  }

  /* ===========================
        2) Blob 드로잉 (회전 없음)
  ============================ */
  function drawBlob() {
    if (!w || !h || !r) return;

    bctx.clearRect(0, 0, w, h);

    const speed = Math.sqrt(vx * vx + vy * vy);
    const squish = Math.min(speed * 0.02, 0.35); // 속도에 따른 찌그러짐

    const rx = r * (1 + squish);
    const ry = r * (1 - squish);

    const grad = bctx.createRadialGradient(
      ballX,
      ballY,
      r * 0.35,
      ballX,
      ballY,
      r
    );
    grad.addColorStop(0, "#FC9877");
    grad.addColorStop(1, "#003049");

    bctx.save();
    bctx.translate(ballX, ballY);
    bctx.rotate(0); // 회전 제거
    bctx.beginPath();
    bctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    bctx.fillStyle = grad;
    bctx.fill();
    bctx.restore();
  }

  /* ===========================
        3) Grain (hero 전용)
  ============================ */
  function generateGrain() {
    const temp = document.createElement("canvas");
    temp.width = w;
    temp.height = h;

    const tctx = temp.getContext("2d");
    const img = tctx.createImageData(w, h);
    const buf = img.data;

    const mainR = 252,
      mainG = 152,
      mainB = 119; // #FC9877
    const subR = 0,
      subG = 48,
      subB = 73; // #003049

    for (let i = 0; i < buf.length; i += 4) {
      const t = Math.random();

      buf[i] = mainR * t + subR * (1 - t);
      buf[i + 1] = mainG * t + subG * (1 - t);
      buf[i + 2] = mainB * t + subB * (1 - t);
      buf[i + 3] = 140;
    }

    tctx.putImageData(img, 0, 0);
    grainTexture = temp;
  }

  function drawGrain() {
    if (!grainTexture) return;
    gctx.clearRect(0, 0, w, h);
    gctx.drawImage(grainTexture, 0, 0);
  }

  /* ===========================
        4) Render Loop
  ============================ */
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

/* ===========================
   DOM Loaded Init (Hero)
=========================== */
document.addEventListener("DOMContentLoaded", () => {
  initHeroBlobAndGrain();
});
