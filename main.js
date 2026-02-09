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
    const wrapper = document.querySelector(".lang-switch-wrapper");
    // const glider = document.querySelector(".lang-glider"); // HTML 구조 변경 시 없을 수 있음
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
            // Glider 애니메이션 (필요 시 복구)
            // if (glider) {
            //     if (val === 'ko') glider.style.transform = "translateX(0)";
            //     else glider.style.transform = "translateX(100%)";
            // }
        } else {
            btn.classList.remove("active");
        }
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener("click", function () {
        const val = this.getAttribute("data-val");
        setLanguage(val);
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
    
    if (!toggle) return; 

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
     6. [배경] Ambient Grain (캔버스 노이즈)
     ============================================================ */
  function initAmbientGrain() {
    // 기존 id: grain-static, grain-scroll -> 새 HTML id: grain-canvas
    // 호환성을 위해 둘 다 체크
    const canvas = document.getElementById("grain-canvas") || document.getElementById("grain-static");
    
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        const idata = ctx.createImageData(w, h);
        const buffer32 = new Uint32Array(idata.data.buffer);
        const len = buffer32.length;

        for (let i = 0; i < len; i++) {
            if (Math.random() < 0.05) { // 노이즈 밀도 조절
                buffer32[i] = 0xffffffff; // White noise
            }
        }
        ctx.putImageData(idata, 0, 0);
        requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();
  }

  /* ============================================================
     7. [HERO] Liquid Blob (기존 코드 유지)
     ============================================================ */
  function initHeroBlobAndGrain() {
    const hero = document.querySelector(".hero");
    // 새 HTML 구조에서는 canvas id가 없을 수 있으므로 체크
    const blobCanvas = document.getElementById("hero-blob");
    const grainCanvas = document.getElementById("hero-grain");
    
    if (!hero || !blobCanvas || !grainCanvas) return;

    const bctx = blobCanvas.getContext("2d");
    const gctx = grainCanvas.getContext("2d");

    let w, h;
    let ballX, ballY, vx, vy, r;
    let mouseX = 0, mouseY = 0, mouseInside = false;

    const FRICTION = 0.98;
    const BOUNCE = 0.9;
    let grainTexture = null;

    function resize() {
      const rect = hero.getBoundingClientRect();
      w = blobCanvas.width = grainCanvas.width = rect.width;
      h = blobCanvas.height = grainCanvas.height = rect.height;
      r = Math.min(w, h) * 0.15;

      if (typeof ballX === 'undefined') {
        ballX = w / 2;
        ballY = h / 2;
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
        const dist = Math.sqrt(dx*dx + dy*dy);
        const forceRadius = r * 1.5;

        if (dist < forceRadius) {
           const angle = Math.atan2(dy, dx);
           const force = (forceRadius - dist) * 0.05;
           vx += Math.cos(angle) * force;
           vy += Math.sin(angle) * force;
        }
      }

      ballX += vx;
      ballY += vy;
      vx *= FRICTION;
      vy *= FRICTION;

      if (ballX < r) { ballX = r; vx *= -BOUNCE; }
      if (ballX > w - r) { ballX = w - r; vx *= -BOUNCE; }
      if (ballY < r) { ballY = r; vy *= -BOUNCE; }
      if (ballY > h - r) { ballY = h - r; vy *= -BOUNCE; }

      const speed = Math.sqrt(vx*vx + vy*vy);
      if (speed < 0.2) {
         vx += (Math.random() - 0.5) * 0.5;
         vy += (Math.random() - 0.5) * 0.5;
      }
    }

    function drawBlob() {
      if (!w || !h) return;
      bctx.clearRect(0, 0, w, h);
      bctx.beginPath();
      bctx.arc(ballX, ballY, r, 0, Math.PI * 2);
      bctx.fillStyle = "#214769"; 
      bctx.fill();
    }

    function generateHeroGrain() {
       const temp = document.createElement("canvas");
       temp.width = w; temp.height = h;
       const tctx = temp.getContext("2d");
       const img = tctx.createImageData(w, h);
       const buf = img.data;
       
       for(let i=0; i<buf.length; i+=4) {
         const v = Math.random() * 255;
         buf[i] = v; buf[i+1] = v; buf[i+2] = v;
         buf[i+3] = 40;
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

    resize();
    window.addEventListener("resize", resize);
    render();
  }

  /* ============================================================
     8. [NEW] FRACTAL LENS ENGINE (새로운 렌즈 왜곡 엔진)
     - 마우스 위치를 추적하여 SVG 필터 내부의 렌즈 맵을 이동시킵니다.
     - 부드러운 움직임(Lerp)을 적용하여 고급스러운 느낌을 줍니다.
     ============================================================ */
  const lensEngine = {
    section: document.querySelector('.we-artist'),
    lensMap: document.getElementById('lens-map-source'),
    
    // 마우스 좌표 및 보간(Lerp) 변수
    mouse: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    
    // 설정값
    lerpFactor: 0.1, // 숫자가 작을수록 더 부드럽게(느리게) 따라옴
    lensSize: 500,   // 렌즈 크기 (픽셀)
    
    init() {
        if (!this.section || !this.lensMap) return;
        this.addEventListeners();
        this.animate();
    },

    addEventListeners() {
        // 마우스 움직임 감지 -> 목표 좌표(target) 업데이트
        this.section.addEventListener('mousemove', (e) => {
            const rect = this.section.getBoundingClientRect();
            this.target.x = e.clientX - rect.left;
            this.target.y = e.clientY - rect.top;
            
            // CSS 변수 업데이트 (블루 글로우 조명용)
            this.section.style.setProperty('--mouse-x', `${this.target.x}px`);
            this.section.style.setProperty('--mouse-y', `${this.target.y}px`);
        });

        // 마우스가 섹션을 벗어나면 특별한 동작 없음 (중앙에 멈추거나 마지막 위치 유지)
    },

    // 애니메이션 루프 (매 프레임마다 실행)
    animate() {
        // 현재 위치를 목표 위치로 조금씩 이동 (Lerp)
        this.mouse.x += (this.target.x - this.mouse.x) * this.lerpFactor;
        this.mouse.y += (this.target.y - this.mouse.y) * this.lerpFactor;

        // SVG feImage의 위치 업데이트
        // 렌즈의 중심이 마우스 위치에 오도록 좌표 보정 (lensSize / 2)
        const lensX = this.mouse.x - (this.lensSize / 2);
        const lensY = this.mouse.y - (this.lensSize / 2);

        // 1. 렌즈 맵 이미지 생성 (한 번만 만들어도 되지만, 동적 처리를 위해 데이터 URI 활용)
        const svgData = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${this.lensSize}" height="${this.lensSize}">
                <defs>
                    <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="white" stop-opacity="1"/>
                        <stop offset="40%" stop-color="#888" stop-opacity="0.8"/>
                        <stop offset="100%" stop-color="black" stop-opacity="0"/>
                    </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad)"/>
            </svg>
        `;
        
        // Base64 변환
        const encodedSVG = "data:image/svg+xml;base64," + btoa(svgData);
        
        // SVG 필터 내의 이미지 소스 및 위치 업데이트
        this.lensMap.setAttributeNS('http://www.w3.org/1999/xlink', 'href', encodedSVG);
        this.lensMap.setAttribute('x', lensX);
        this.lensMap.setAttribute('y', lensY);
        this.lensMap.setAttribute('width', this.lensSize);
        this.lensMap.setAttribute('height', this.lensSize);

        requestAnimationFrame(this.animate.bind(this));
    }
  };

  /* ============================================================
     실행 (DOM 로드 후)
     ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initScrollEffects();
    initFadeInUp();
    initLanguageSystem();
    initThemeToggle();
    
    // 배경 그레인 (새 ID가 있으면 새 함수, 없으면 기존 함수 호환)
    initAmbientGrain();      
    
    // 히어로 블롭 (HTML 요소가 있을 때만 실행됨)
    initHeroBlobAndGrain();
    
    // ★ [NEW] 렌즈 왜곡 엔진 실행
    lensEngine.init();   
  });
})();
