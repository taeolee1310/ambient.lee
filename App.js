import React, { useEffect, useRef } from "react";

const ParticleAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false }); // 성능 최적화 1: 알파 채널 비활성화

    const PARTICLE_COUNT = 800; // 성능 최적화 2: 입자 수를 약간 조절 (800~1000 권장)
    const FOV = 800;
    const GRID_SIZE = 45;

    let width, height;
    let particles = [];
    const modes = ["grid", "warp", "circle", "sphere", "cube"];
    let modeIdx = 0;
    let currentMode = modes[modeIdx];
    let isTransitioning = false;

    let rotation = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    let mouse = { x: 0, y: 0, isActive: false };

    class Particle {
      constructor(id, total) {
        this.id = id;
        this.total = total;
        this.init();
        this.x = (Math.random() - 0.5) * 2000;
        this.y = (Math.random() - 0.5) * 2000;
        this.z = (Math.random() - 0.5) * 2000;
      }

      init() {
        const sizeMult = width < 768 ? 1 : 1.2;
        this.baseRadius = (Math.random() * 0.4 + 0.6) * sizeMult;
        this.randomOpacity = 0.4 + Math.random() * 0.5;

        // Grid
        this.gridAxis = Math.random() > 0.5 ? "x" : "y";
        this.alignToGrid();

        // Warp
        this.warpZ = Math.random() * 1500;
        this.warpAngle = Math.random() * Math.PI * 2;
        this.warpDist = Math.random() * 800;

        // Circle
        const cAngle = (this.id / this.total) * Math.PI * 2;
        const cRadius = Math.min(width, height) * (width < 768 ? 0.5 : 0.35);
        const thick = (Math.random() - 0.5) * 60;
        this.circleX = width / 2 + Math.cos(cAngle) * (cRadius + thick);
        this.circleY = height / 2 + Math.sin(cAngle) * (cRadius + thick);

        // Sphere
        const phi = Math.acos(1 - 2 * (this.id / this.total));
        const sTheta = Math.PI * (1 + Math.sqrt(5)) * this.id;
        const sRadius = 350;
        this.sphereX = sRadius * Math.sin(phi) * Math.cos(sTheta) + width / 2;
        this.sphereY = sRadius * Math.sin(phi) * Math.sin(sTheta) + height / 2;
        this.sphereZ = sRadius * Math.cos(phi);

        // Cube
        const side = Math.ceil(Math.pow(this.total, 1 / 3));
        const offset = (side - 1) / 2;
        this.cubeX = ((this.id % side) - offset) * 100 + width / 2;
        this.cubeY =
          ((Math.floor(this.id / side) % side) - offset) * 100 + height / 2;
        this.cubeZ = (Math.floor(this.id / (side * side)) - offset) * 100;
      }

      alignToGrid() {
        const ox = (width % GRID_SIZE) / 2;
        const oy = (height % GRID_SIZE) / 2;
        if (this.gridAxis === "x") {
          this.gridX =
            Math.round((Math.random() * width - ox) / GRID_SIZE) * GRID_SIZE +
            ox;
          this.gridY = Math.random() * height;
        } else {
          this.gridY =
            Math.round((Math.random() * height - oy) / GRID_SIZE) * GRID_SIZE +
            oy;
          this.gridX = Math.random() * width;
        }
      }

      update(mode) {
        let tx = 0,
          ty = 0,
          tz = 0;
        if (mode === "grid") {
          tx = this.gridX;
          ty = this.gridY;
          tz = 0;
        } else if (mode === "warp") {
          const t = Date.now() * 0.0008;
          tx = width / 2 + Math.cos(this.warpAngle) * this.warpDist;
          ty = height / 2 + Math.sin(this.warpAngle) * this.warpDist;
          tz = ((this.warpZ + t * 1000) % 1500) - 750;
        } else if (mode === "circle") {
          tx = this.circleX;
          ty = this.circleY;
          tz = 0;
        } else if (mode === "sphere") {
          tx = this.sphereX;
          ty = this.sphereY;
          tz = this.sphereZ;
        } else if (mode === "cube") {
          tx = this.cubeX;
          ty = this.cubeY;
          tz = this.cubeZ;
        }

        this.x += (tx - this.x) * 0.08;
        this.y += (ty - this.y) * 0.08;
        this.z += (tz - this.z) * 0.08;
      }

      draw(cx, cy) {
        const rx = this.x - cx;
        const ry = this.y - cy;
        const rz = this.z;

        // 성능 최적화 3: 회전 계산 최적화 (미리 계산된 cos/sin 사용 가능하나 우선 유지)
        const cosY = Math.cos(rotation.y);
        const sinY = Math.sin(rotation.y);
        const cosX = Math.cos(rotation.x);
        const sinX = Math.sin(rotation.x);

        let x1 = rx * cosY - rz * sinY;
        let z1 = rz * cosY + rx * sinY;
        let y1 = ry * cosX - z1 * sinX;
        let z2 = z1 * cosX + ry * sinX;

        if (z2 > -FOV) {
          const scale = FOV / (FOV + z2);
          const x2d = x1 * scale + cx;
          const y2d = y1 * scale + cy;

          // 성능 최적화 4: shadowBlur 제거 및 단순화된 드로잉
          ctx.globalAlpha =
            this.randomOpacity * Math.min(1, (z2 + FOV) / (FOV * 1.5));
          ctx.fillStyle = "#4ADEDE";
          ctx.beginPath();
          ctx.arc(x2d, y2d, this.baseRadius * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const init = () => {
      // 성능 최적화 5: 고해상도 모니터에서도 스케일을 적절히 제한 (DPR 1.5~2 정도로 제한 가능)
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++)
        particles.push(new Particle(i, PARTICLE_COUNT));
    };

    const animate = () => {
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = "#020d14";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      if (mouse.isActive) {
        targetRotation.x = (mouse.y - cy) * 0.0004;
        targetRotation.y = (mouse.x - cx) * 0.0004;
      } else {
        targetRotation.y += 0.001;
      }

      rotation.x += (targetRotation.x - rotation.x) * 0.05;
      rotation.y += (targetRotation.y - rotation.y) * 0.05;

      particles.forEach((p) => {
        p.update(currentMode);
        p.draw(cx, cy);
      });
      requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener("resize", init);
    window.addEventListener(
      "wheel",
      (e) => {
        if (isTransitioning || Math.abs(e.deltaY) < 20) return;
        modeIdx =
          e.deltaY > 0
            ? (modeIdx + 1) % modes.length
            : (modeIdx - 1 + modes.length) % modes.length;
        currentMode = modes[modeIdx];
        isTransitioning = true;
        setTimeout(() => (isTransitioning = false), 1000);
      },
      { passive: true }
    );

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    });
    window.addEventListener("mouseleave", () => {
      mouse.isActive = false;
    });

    return () => window.removeEventListener("resize", init);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", backgroundColor: "#020d14" }}
    />
  );
};

export default ParticleAnimation;
