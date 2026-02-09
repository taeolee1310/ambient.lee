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
            if (val === 'ko') {
                glider.style.transform = "translateX(0)";
            } else {
                glider.style.transform = "translateX(100%)";
            }
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
     5. 테마 스위치 (Light/Dark) - ※ 필요 없다면 주석 처리 가능
     ============================================================ */
  function initThemeToggle() {
    const body = document.body;
    let toggle = document.querySelector(".theme-switch");
    
    // HTML에 버튼이 없으면 굳이 만들지 않도록 수정 (원하시는 경우)
    if (!toggle) return; 

    /* 만약 버튼을 동적으로 생성하고 싶다면 아래 주석 해제
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "theme-switch";
      // ... 버튼 생성 코드 ...
      body.appendChild(toggle);
    }
    */

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
      temp.width = w;
      temp.height = h;

      const imgData = tctx.createImageData(w, h);
      const buffer = imgData.data;

      const mainR = 51, mainG = 140, mainB = 135; // Teal
      const subR = 140, subG = 50, subB = 56;    // Brick Red

      for (let i = 0; i < buffer.length; i += 4) {
        if (Math.random() > 0.5) {
             buffer[i] = mainR; buffer[i+1] = mainG; buffer[i+2] = mainB;
        } else {
             buffer[i] = subR; buffer[i+1] = subG; buffer[i+2] = subB;
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
      const offsetY = - (currentOffset % h);
      
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
     8. [NEW] 유리 왜곡 (Fluted Glass) 효과 초기화
     - 이 함수가 추가되어야 효과가 작동합니다.
     ============================================================ */
  function initGlassDistortion() {
    const glassSection = document.querySelector('.we-artist');
    // SVG 필터 내의 displacementMap 요소를 찾습니다.
    const displacementMap = document.querySelector('#glass-distortion feDisplacementMap');
    
    // 요소가 없으면 실행하지 않음 (오류 방지)
    if (!glassSection || !displacementMap) return;
    
    glassSection.addEventListener('mousemove', (e) => {
      // 섹션 기준 상대 좌표 계산
      const rect = glassSection.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // 1. CSS 변수 업데이트 (하이라이트 조명 위치 이동)
      glassSection.style.setProperty('--mouse-x', `${mouseX}px`);
      glassSection.style.setProperty('--mouse-y', `${mouseY}px`);

      // 2. 왜곡(Scale) 동적 조절 (일렁이는 느낌)
      // Math.sin과 시간(Date.now)을 이용해 계속 움직이는 값을 만듭니다.
      const dynamicScale = 30 + (Math.sin(Date.now() / 100) * 5); 
      displacementMap.setAttribute('scale', dynamicScale);
    });
    
    // 마우스가 밖으로 나가면 왜곡을 기본값으로 되돌림
    glassSection.addEventListener('mouseleave', () => {
       displacementMap.setAttribute('scale', '15');
    });
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
    
    // ★ 새로 추가된 유리 효과 함수 실행
    initGlassDistortion();   
  });
})();
/* main.js 파일 하단에 추가 또는 교체 */

/* ============================================================
   [NEW] 마우스 추적 및 SVG 렌즈 왜곡 위치 업데이트
   ============================================================ */
function initLensDistortion() {
  const section = document.querySelector('.we-artist');
  // SVG 내의 feImage 태그를 선택합니다.
  const lensMapSource = document.getElementById('lens-map-source');

  if (!section || !lensMapSource) return;

  // 렌즈 역할을 할 SVG 원 이미지를 데이터 URI로 생성하는 함수
  function createLensSVG(cx, cy) {
    // 마우스 좌표(cx, cy)를 중심으로 하는 원형 그라데이션 SVG 문자열 생성
    const svgString = `
      <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
        <defs>
          <radialGradient id='lens-grad' cx='${cx}%' cy='${cy}%' r='15%'> <stop offset='0%' stop-color='white'/>
            <stop offset='100%' stop-color='black'/>
          </radialGradient>
        </defs>
        <rect width='100%' height='100%' fill='url(#lens-grad)'/>
      </svg>
    `;
    // SVG 문자열을 base64로 인코딩하여 이미지 소스로 변환
    return 'data:image/svg+xml;base64,' + btoa(svgString);
  }

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    // 섹션 내에서의 마우스 상대 좌표를 퍼센트(%)로 계산
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    // 1. CSS 변수 업데이트 (파란색 조명 이동용 - 기존 기능 유지)
    section.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    section.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);

    // 2. SVG 필터 업데이트 (돋보기 왜곡 중심점 이동)
    // 계산된 퍼센트 좌표를 이용해 새로운 렌즈 이미지를 만들어 필터에 적용
    lensMapSource.setAttribute('xlink:href', createLensSVG(xPercent, yPercent));
  });
  
  // 마우스가 섹션을 벗어나면 렌즈 효과 제거 (검은색 이미지로 대체)
  section.addEventListener('mouseleave', () => {
      lensMapSource.setAttribute('xlink:href', 'data:image/svg+xml;base64,' + btoa(`<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><rect width='100%' height='100%' fill='black'/></svg>`));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // ... 다른 초기화 함수들 ...
  
  // ★ 기존 initMouseTracker 대신 이 함수를 실행하세요.
  initLensDistortion(); 
});
