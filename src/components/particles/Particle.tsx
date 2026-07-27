import { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let nebulae: Nebula[] = [];
    let galaxies: Galaxy[] = [];
    let blasts: Blast[] = [];
    let rafId = 0;
    let lastTime = performance.now();
    let resizeTimeout: number | undefined;
    let nextShootingStarAt = performance.now() + 8000 + Math.random() * 6000;

    const targetMouse = { x: -10000, y: -10000 };
    const mouse = { x: -10000, y: -10000 };
    let mouseActive = 0;

    const parallaxTarget = { x: 0, y: 0 };
    const parallax = { x: 0, y: 0 };

    const hoverRadius = 140;
    const coreRadius = 140;
    const maxLineDistance = 100;
    const maxLineDistanceSq = maxLineDistance * maxLineDistance;

    type Sprite = { canvas: HTMLCanvasElement; size: number };
    const spriteCache = new Map<string, Sprite>();

    function makeGlowSprite(coreR: number, glowR: number, tint: string): Sprite {
      const key = `${coreR}-${glowR}-${tint}`;
      const cached = spriteCache.get(key);
      if (cached) return cached;

      const size = Math.ceil(glowR * 2);
      const off = document.createElement('canvas');
      off.width = size;
      off.height = size;
      const octx = off.getContext('2d')!;
      const cx = size / 2;
      const cy = size / 2;

      const gradient = octx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
      gradient.addColorStop(0.15, tint);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      octx.fillStyle = gradient;
      octx.beginPath();
      octx.arc(cx, cy, glowR, 0, Math.PI * 2);
      octx.fill();

      octx.beginPath();
      octx.fillStyle = 'rgba(255,255,255,0.92)';
      octx.arc(cx, cy, coreR, 0, Math.PI * 2);
      octx.fill();

      const sprite = { canvas: off, size };
      spriteCache.set(key, sprite);
      return sprite;
    }

    const spikeSpriteCache = new Map<string, Sprite>();
    function makeSpikeSprite(radius: number, tint: string): Sprite {
      const key = `${radius}-${tint}`;
      const cached = spikeSpriteCache.get(key);
      if (cached) return cached;

      const size = Math.ceil(radius * 2);
      const off = document.createElement('canvas');
      off.width = size;
      off.height = size;
      const octx = off.getContext('2d')!;
      const cx = size / 2;
      const cy = size / 2;

      octx.globalCompositeOperation = 'lighter';

      const spike = (len: number, width: number, alpha: number) => {
        for (let i = 0; i < 2; i++) {
          const grad = octx.createLinearGradient(
            i === 0 ? cx - len : cx,
            i === 0 ? cy : cy - len,
            i === 0 ? cx + len : cx,
            i === 0 ? cy : cy + len
          );
          grad.addColorStop(0, 'rgba(255,255,255,0)');
          grad.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
          grad.addColorStop(1, 'rgba(255,255,255,0)');
          octx.strokeStyle = grad;
          octx.lineWidth = width;
          octx.lineCap = 'round';
          octx.beginPath();
          if (i === 0) {
            octx.moveTo(cx - len, cy);
            octx.lineTo(cx + len, cy);
          } else {
            octx.moveTo(cx, cy - len);
            octx.lineTo(cx, cy + len);
          }
          octx.stroke();
        }
      };
      spike(radius * 0.95, 1.1, 0.55);

      const glow = octx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.3);
      glow.addColorStop(0, 'rgba(255,255,255,0.9)');
      glow.addColorStop(0.4, tint);
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      octx.fillStyle = glow;
      octx.beginPath();
      octx.arc(cx, cy, radius * 0.3, 0, Math.PI * 2);
      octx.fill();

      const sprite = { canvas: off, size };
      spikeSpriteCache.set(key, sprite);
      return sprite;
    }

    type SpectralClass = {
      name: string;
      weight: number;
      tint: string;
      sizeMul: number;
      alphaMul: number;
      exotic?: boolean;
    };

    const SPECTRAL_CLASSES: SpectralClass[] = [
      { name: 'M', weight: 62, tint: 'rgba(255,190,150,0.55)', sizeMul: 0.75, alphaMul: 0.7 },
      { name: 'K', weight: 14, tint: 'rgba(255,206,168,0.55)', sizeMul: 0.85, alphaMul: 0.8 },
      { name: 'G', weight: 9, tint: 'rgba(255,236,214,0.55)', sizeMul: 1, alphaMul: 0.95 },
      { name: 'F', weight: 5, tint: 'rgba(240,244,255,0.55)', sizeMul: 1.1, alphaMul: 1 },
      { name: 'A', weight: 2.5, tint: 'rgba(214,225,255,0.6)', sizeMul: 1.3, alphaMul: 1.08 },
      { name: 'B', weight: 1.2, tint: 'rgba(178,196,255,0.65)', sizeMul: 1.6, alphaMul: 1.2 },
      { name: 'O', weight: 0.4, tint: 'rgba(150,175,255,0.7)', sizeMul: 2, alphaMul: 1.3 },
      { name: 'cyan-anomaly', weight: 1.6, tint: 'rgba(120,240,231,0.7)', sizeMul: 1.5, alphaMul: 1.2, exotic: true },
      { name: 'violet-anomaly', weight: 1.6, tint: 'rgba(200,150,255,0.7)', sizeMul: 1.5, alphaMul: 1.2, exotic: true },
      { name: 'rose-anomaly', weight: 0.9, tint: 'rgba(255,140,190,0.7)', sizeMul: 1.6, alphaMul: 1.25, exotic: true },
    ];
    const SPECTRAL_TOTAL_WEIGHT = SPECTRAL_CLASSES.reduce((sum, c) => sum + c.weight, 0);

    function pickSpectralClass(): SpectralClass {
      let r = Math.random() * SPECTRAL_TOTAL_WEIGHT;
      for (const c of SPECTRAL_CLASSES) {
        r -= c.weight;
        if (r <= 0) return c;
      }
      return SPECTRAL_CLASSES[0];
    }

    function approach(current: number, target: number, rate: number, dt: number) {
      const t = 1 - Math.pow(1 - rate, dt);
      return current + (target - current) * t;
    }

    type DepthLayer = { parallax: number; speedMul: number; sizeMul: number; alphaMul: number; shareOfStars: number };
    const DEPTH_LAYERS: DepthLayer[] = [
      { parallax: 0.08, speedMul: 0.35, sizeMul: 0.6, alphaMul: 0.55, shareOfStars: 0.5 },
      { parallax: 0.22, speedMul: 0.7, sizeMul: 0.95, alphaMul: 0.85, shareOfStars: 0.34 },
      { parallax: 0.5, speedMul: 1.15, sizeMul: 1.45, alphaMul: 1.1, shareOfStars: 0.16 },
    ];

    class Star {
      x: number;
      y: number;
      vx: number;
      vy: number;
      driftX: number;
      driftY: number;
      driftTimer: number;
      maxSpeed: number;
      coreR: number;
      glowR: number;
      tint: string;
      layer: DepthLayer;
      bright: boolean;
      hero: boolean;
      exotic: boolean;
      maxAlpha: number;
      minAlpha: number;
      alpha: number;
      twinklePhase: number;
      twinkleSpeed: number;
      twinklePhase2: number;
      twinkleSpeed2: number;
      scintillation: number;
      sparklePhase: number;

      isShooting: boolean;
      shootVx: number;
      shootVy: number;
      shootLife: number;
      shootMaxLife: number;
      shootLength: number;
      shootTint: string;

      constructor(layer: DepthLayer) {
        this.layer = layer;
        this.x = Math.random() * W;
        this.y = Math.random() * H;

        const speedBase = 0.045 * layer.speedMul;
        this.vx = (Math.random() - 0.5) * speedBase;
        this.vy = (Math.random() - 0.5) * speedBase;
        this.driftX = this.vx;
        this.driftY = this.vy;
        this.driftTimer = Math.random() * 6000;
        this.maxSpeed = speedBase * (0.8 + Math.random() * 0.6);

        const magnitude = Math.pow(Math.random(), 3);
        this.bright = magnitude > 0.8;
        this.hero = magnitude > 0.975 && layer.parallax > 0.3;

        const cls = pickSpectralClass();
        this.exotic = !!cls.exotic;
        this.tint = cls.tint;
        this.shootTint = cls.tint;

        const baseCoreR = this.bright ? Math.random() * 0.75 + 1.1 : Math.random() * 0.5 + 0.4;
        this.coreR = baseCoreR * cls.sizeMul * layer.sizeMul;
        this.glowR = (this.bright ? this.coreR * 10 : this.coreR * 5.4);

        this.maxAlpha = Math.min(1, (this.bright ? Math.random() * 0.18 + 0.8 : Math.random() * 0.4 + 0.28) * cls.alphaMul * layer.alphaMul);
        this.minAlpha = this.bright ? 0.45 : Math.random() * 0.07 + 0.03;
        this.alpha = Math.random() * (this.maxAlpha - this.minAlpha) + this.minAlpha;

        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 0.0003 + Math.random() * 0.0006;
        this.twinklePhase2 = Math.random() * Math.PI * 2;
        this.twinkleSpeed2 = 0.001 + Math.random() * 0.0013;
        this.scintillation = 0.12 + Math.random() * 0.22;
        this.sparklePhase = Math.random() * Math.PI * 2;

        this.isShooting = false;
        this.shootVx = 0;
        this.shootVy = 0;
        this.shootLife = 0;
        this.shootMaxLife = 0;
        this.shootLength = 0;
      }

      startShooting() {
        this.isShooting = true;
        const goingRight = Math.random() < 0.5;
        const speed = 8 + Math.random() * 6;
        const angle = goingRight
          ? (Math.PI / 5) + Math.random() * (Math.PI / 10)
          : Math.PI - (Math.PI / 5) - Math.random() * (Math.PI / 10);
        this.shootVx = Math.cos(angle) * speed * (goingRight ? 1 : -1);
        this.shootVy = Math.sin(angle) * speed;
        this.shootMaxLife = 55 + Math.random() * 25;
        this.shootLife = this.shootMaxLife;
        this.shootLength = 100 + Math.random() * 90;
      }

      update(dt: number) {
        if (this.isShooting) {
          this.x += this.shootVx * dt;
          this.y += this.shootVy * dt;
          this.shootLife -= dt;
          const margin = this.shootLength + 40;
          const offscreen = this.x < -margin || this.x > W + margin || this.y < -margin || this.y > H + margin;
          if (this.shootLife <= 0 || offscreen) {
            this.isShooting = false;
            this.x = Math.min(Math.max(this.x, 0), W);
            this.y = Math.min(Math.max(this.y, 0), H);
            const angle = Math.random() * Math.PI * 2;
            const speed = this.maxSpeed * (0.4 + Math.random() * 0.6);
            this.driftX = Math.cos(angle) * speed;
            this.driftY = Math.sin(angle) * speed;
            this.vx = this.driftX;
            this.vy = this.driftY;
            this.driftTimer = 4000 + Math.random() * 4000;
          }
          this.twinklePhase += this.twinkleSpeed * dt * 16.6667;
          this.twinklePhase2 += this.twinkleSpeed2 * dt * 16.6667;
          return;
        }

        this.driftTimer -= dt * 16.6667;
        if (this.driftTimer <= 0) {
          this.driftTimer = 4000 + Math.random() * 4000;
          const angle = Math.random() * Math.PI * 2;
          const speed = this.maxSpeed * (0.4 + Math.random() * 0.6);
          this.driftX = Math.cos(angle) * speed;
          this.driftY = Math.sin(angle) * speed;
        }
        this.vx = approach(this.vx, this.driftX, 0.012, dt);
        this.vy = approach(this.vy, this.driftY, 0.012, dt);

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
        this.x = Math.min(Math.max(this.x, 0), W);
        this.y = Math.min(Math.max(this.y, 0), H);

        if (mouseActive > 0.01) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < hoverRadius * hoverRadius) {
            const dist = Math.sqrt(distSq) || 1;
            const rawT = 1 - dist / hoverRadius;
            const force = (rawT * rawT * (3 - 2 * rawT)) * mouseActive;
            this.x += dx * force * 0.0007 * dt;
            this.y += dy * force * 0.0007 * dt;
          }
        }

        this.twinklePhase += this.twinkleSpeed * dt * 16.6667;
        this.twinklePhase2 += this.twinkleSpeed2 * dt * 16.6667;
        const span = (this.maxAlpha - this.minAlpha) / 2;
        const wave = Math.sin(this.twinklePhase) * (1 - this.scintillation)
          + Math.sin(this.twinklePhase2) * this.scintillation;
        this.alpha = this.minAlpha + span + wave * span;
      }

      draw(time: number, px: number, py: number) {
        const dx = this.x + px;
        const dy = this.y + py;

        if (this.isShooting) {
          const fadeIn = Math.min(1, (this.shootMaxLife - this.shootLife) / 8);
          const fadeOut = Math.min(1, this.shootLife / (this.shootMaxLife * 0.4));
          const alpha = Math.min(fadeIn, fadeOut);

          const mag = Math.hypot(this.shootVx, this.shootVy) || 1;
          const dirX = this.shootVx / mag;
          const dirY = this.shootVy / mag;
          const tailX = dx - dirX * this.shootLength;
          const tailY = dy - dirY * this.shootLength;

          const grad = ctx!.createLinearGradient(dx, dy, tailX, tailY);
          grad.addColorStop(0, `rgba(255,255,255,${0.95 * alpha})`);
          grad.addColorStop(0.25, this.shootTint.replace(/[\d.]+\)$/, `${0.55 * alpha})`));
          grad.addColorStop(1, 'rgba(199,210,254,0)');

          ctx!.strokeStyle = grad;
          ctx!.lineWidth = 1.5 + this.coreR * 0.6;
          ctx!.lineCap = 'round';
          ctx!.beginPath();
          ctx!.moveTo(dx, dy);
          ctx!.lineTo(tailX, tailY);
          ctx!.stroke();

          const headGrad = ctx!.createRadialGradient(dx, dy, 0, dx, dy, 5);
          headGrad.addColorStop(0, `rgba(255,255,255,${0.95 * alpha})`);
          headGrad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx!.fillStyle = headGrad;
          ctx!.beginPath();
          ctx!.arc(dx, dy, 5, 0, Math.PI * 2);
          ctx!.fill();
          return;
        }

        let boost = 0;
        if (mouseActive > 0.01) {
          const mdx = mouse.x - dx;
          const mdy = mouse.y - dy;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < coreRadius) {
            boost = (1 - dist / coreRadius) * mouseActive;
          }
        }

        const drawAlpha = Math.min(1, Math.max(0, this.alpha) + boost * 0.25);
        const scale = 1 + boost * 0.35;
        const sprite = makeGlowSprite(this.coreR, this.glowR, this.tint);
        const drawSize = sprite.size * scale;

        ctx!.globalAlpha = drawAlpha;
        ctx!.drawImage(sprite.canvas, dx - drawSize / 2, dy - drawSize / 2, drawSize, drawSize);

        if (this.hero) {
          const pulse = (Math.sin(time * 0.0009 + this.sparklePhase) * 0.5 + 0.5) * 0.35 + 0.75;
          const spikeSprite = makeSpikeSprite(this.glowR * 3.4, this.tint);
          const sSize = spikeSprite.size * pulse;
          ctx!.globalAlpha = drawAlpha * 0.85;
          ctx!.drawImage(spikeSprite.canvas, dx - sSize / 2, dy - sSize / 2, sSize, sSize);
        }

        if (boost > 0.04) {
          const pulse = (Math.sin(time * 0.0012 + this.sparklePhase) * 0.5 + 0.5) * 0.3 + 0.7;
          const extraR = this.glowR * (1.1 + boost * 0.6) * pulse;
          const haloGrad = ctx!.createRadialGradient(dx, dy, 0, dx, dy, extraR);
          haloGrad.addColorStop(0, `rgba(255,255,255,${0.16 * boost})`);
          haloGrad.addColorStop(0.5, `rgba(224,231,255,${0.08 * boost})`);
          haloGrad.addColorStop(1, 'rgba(224,231,255,0)');
          ctx!.globalAlpha = 1;
          ctx!.fillStyle = haloGrad;
          ctx!.beginPath();
          ctx!.arc(dx, dy, extraR, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.globalAlpha = 1;
      }
    }

    class Nebula {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      radius: number;
      color: string;
      driftSpeed: number;
      phase: number;

      constructor(colors: string[]) {
        this.baseX = Math.random() * W;
        this.baseY = Math.random() * H;
        this.x = this.baseX;
        this.y = this.baseY;
        this.radius = Math.min(W, H) * (0.4 + Math.random() * 0.42);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.driftSpeed = 0.00005 + Math.random() * 0.00007;
        this.phase = Math.random() * Math.PI * 2;
      }

      update(time: number) {
        this.x = this.baseX + Math.sin(time * this.driftSpeed + this.phase) * W * 0.1;
        this.y = this.baseY + Math.cos(time * this.driftSpeed * 0.8 + this.phase) * H * 0.1;
      }

      draw() {
        const gradient = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, W, H);
      }
    }

    class Galaxy {
      x: number;
      y: number;
      radius: number;
      rotation: number;
      tint: string;
      coreTint: string;
      spinSpeed: number;

      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.radius = Math.min(W, H) * (0.09 + Math.random() * 0.08);
        this.rotation = Math.random() * Math.PI;
        this.tint = Math.random() < 0.5 ? 'rgba(180,160,255,0.14)' : 'rgba(140,220,255,0.12)';
        this.coreTint = 'rgba(255,250,240,0.35)';
        this.spinSpeed = (Math.random() < 0.5 ? -1 : 1) * (0.000006 + Math.random() * 0.000006);
      }

      draw(time: number) {
        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate(this.rotation + time * this.spinSpeed);
        ctx!.scale(1, 0.32);

        const grad = ctx!.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        grad.addColorStop(0, this.coreTint);
        grad.addColorStop(0.25, this.tint);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
    }

    class Blast {
      x: number;
      y: number;
      age: number;
      maxLife: number;
      shockRadius: number;
      shockSpeed: number;
      colors: string[];

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.age = 0;
        this.maxLife = 90;
        this.shockRadius = 2;
        this.shockSpeed = 5.5 + Math.random() * 1.5;
        this.colors = [
          'rgba(190,170,255,ALPHA)', 
          'rgba(110,225,255,ALPHA)', 
          'rgba(255,140,220,ALPHA)', 
          'rgba(130,255,225,ALPHA)', 
          'rgba(150,140,255,ALPHA)', 
          'rgba(255,200,140,ALPHA)', 
        ];
      }

      update(dt: number) {
        this.age += dt;
        this.shockSpeed *= Math.pow(0.965, dt);
        this.shockRadius += this.shockSpeed * dt;
      }

      get done() {
        return this.age >= this.maxLife;
      }

      applyForce(dt: number) {
        const band = 65;
        const strength = Math.min(1.1, this.shockSpeed * 0.4);
        if (strength < 0.05) return;
        for (const s of stars) {
          if (s.isShooting) continue;
          const dx = s.x - this.x;
          const dy = s.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const diff = Math.abs(dist - this.shockRadius);
          if (diff < band) {
            const t = 1 - diff / band;
            const falloff = t * t * (3 - 2 * t);
            const push = Math.min(0.35, falloff * strength * (0.4 + 0.6 / (1 + dist * 0.004)));
            s.vx += (dx / dist) * push * 0.012 * dt;
            s.vy += (dy / dist) * push * 0.012 * dt;
          }
        }
      }

      draw() {
        const t = this.age / this.maxLife;
        const fade = Math.max(0, 1 - t);
        if (fade <= 0.01) return;

        ctx!.save();
        ctx!.filter = 'blur(24px)';

        const layers = [
          { rMul: 1.2, color: this.colors[4], a: 0.22 }, 
          { rMul: 1.05, color: this.colors[1], a: 0.24 },
          { rMul: 0.85, color: this.colors[0], a: 0.27 }, 
          { rMul: 0.66, color: this.colors[2], a: 0.29 }, 
          { rMul: 0.46, color: this.colors[5], a: 0.26 }, 
          { rMul: 0.26, color: this.colors[3], a: 0.4 }, 
        ];
        for (const layer of layers) {
          const r = Math.max(4, this.shockRadius * layer.rMul);
          const alpha = layer.a * fade;
          const grad = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
          grad.addColorStop(0, layer.color.replace('ALPHA', alpha.toFixed(3)));
          grad.addColorStop(0.7, layer.color.replace('ALPHA', (alpha * 0.4).toFixed(3)));
          grad.addColorStop(1, layer.color.replace('ALPHA', '0'));
          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.arc(this.x, this.y, r, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.restore();

        if (t < 0.16) {
          const coreFade = 1 - t / 0.16;
          const coreGrad = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, 24);
          coreGrad.addColorStop(0, `rgba(255,255,255,${0.85 * coreFade})`);
          coreGrad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx!.fillStyle = coreGrad;
          ctx!.beginPath();
          ctx!.arc(this.x, this.y, 24, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    function getDocumentSize() {
      const el = document.documentElement;
      const body = document.body;
      return {
        width: Math.max(el.scrollWidth, body.scrollWidth, el.clientWidth),
        height: Math.max(el.scrollHeight, body.scrollHeight, el.clientHeight),
      };
    }

    function starCountFor(width: number, height: number) {
      const area = width * height;
      return Math.min(340, Math.max(90, Math.floor(area / 10500)));
    }

    function buildNebulae() {
      const colors = [
        'rgba(124,58,237,0.28)',
        'rgba(56,189,248,0.22)',
        'rgba(219,39,119,0.16)',
        'rgba(8,47,73,0.28)',
        'rgba(45,212,191,0.14)',
        'rgba(99,102,241,0.2)',
      ];
      const count = 5;
      nebulae = Array.from({ length: count }, () => new Nebula(colors));
    }

    function buildGalaxies() {
      const count = 2;
      galaxies = Array.from({ length: count }, () => new Galaxy());
    }

    function init() {
      const size = getDocumentSize();
      W = size.width;
      H = size.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildNebulae();
      buildGalaxies();

      const total = starCountFor(W, H);
      stars = [];
      for (const layer of DEPTH_LAYERS) {
        const count = Math.round(total * layer.shareOfStars);
        for (let i = 0; i < count; i++) stars.push(new Star(layer));
      }
    }

    function scheduleResize() {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(init, 150);
    }

    function drawConstellationLines(px: number, py: number) {
      const cellSize = maxLineDistance;
      const cols = Math.max(1, Math.ceil(W / cellSize));
      const rows = Math.max(1, Math.ceil(H / cellSize));
      const grid: Star[][] = new Array(cols * rows);

      const cellIndex = (x: number, y: number) => {
        const cx = Math.min(cols - 1, Math.max(0, Math.floor(x / cellSize)));
        const cy = Math.min(rows - 1, Math.max(0, Math.floor(y / cellSize)));
        return cy * cols + cx;
      };

      for (const s of stars) {
        if (s.isShooting || s.layer.parallax < 0.3) continue; // only the nearest layer constellates
        const idx = cellIndex(s.x, s.y);
        (grid[idx] || (grid[idx] = [])).push(s);
      }

      ctx!.lineWidth = 0.5;
      ctx!.lineCap = 'round';
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const idx = cy * cols + cx;
          const cellStars = grid[idx];
          if (!cellStars) continue;

          for (let ny = cy; ny <= cy + 1 && ny < rows; ny++) {
            const startNx = ny === cy ? cx : cx - 1;
            for (let nx = Math.max(0, startNx); nx <= cx + 1 && nx < cols; nx++) {
              const neighborIdx = ny * cols + nx;
              const neighborStars = grid[neighborIdx];
              if (!neighborStars) continue;
              const sameCell = neighborIdx === idx;

              for (let i = 0; i < cellStars.length; i++) {
                const s1 = cellStars[i];
                const startJ = sameCell ? i + 1 : 0;
                for (let j = startJ; j < neighborStars.length; j++) {
                  const s2 = neighborStars[j];
                  const dx0 = s1.x - s2.x;
                  const dy0 = s1.y - s2.y;
                  const distSq = dx0 * dx0 + dy0 * dy0;
                  if (distSq < maxLineDistanceSq) {
                    const dist = Math.sqrt(distSq);
                    let lineBoost = 0;
                    if (mouseActive > 0.01) {
                      const mdx1 = mouse.x - (s1.x + px);
                      const mdy1 = mouse.y - (s1.y + py);
                      const mdx2 = mouse.x - (s2.x + px);
                      const mdy2 = mouse.y - (s2.y + py);
                      const d1 = Math.sqrt(mdx1 * mdx1 + mdy1 * mdy1);
                      const d2 = Math.sqrt(mdx2 * mdx2 + mdy2 * mdy2);
                      const closest = Math.min(d1, d2);
                      if (closest < coreRadius) {
                        const t = 1 - closest / coreRadius;
                        lineBoost = (t * t * (3 - 2 * t)) * mouseActive;
                      }
                    }
                    const rawT = 1 - dist / maxLineDistance;
                    const smoothT = rawT * rawT * (3 - 2 * rawT);
                    const baseOpacity = 0.07 * smoothT;
                    const opacity = Math.min(0.45, baseOpacity + lineBoost * 0.32);
                    ctx!.strokeStyle = `rgba(190,205,255,${opacity})`;
                    ctx!.lineWidth = 0.5 + lineBoost * 0.35;
                    ctx!.beginPath();
                    ctx!.moveTo(s1.x + px, s1.y + py);
                    ctx!.lineTo(s2.x + px, s2.y + py);
                    ctx!.stroke();
                  }
                }
              }
            }
          }
        }
      }
    }

    function drawCursorCluster() {
      if (mouseActive < 0.01) return;

      const glowR = coreRadius * 1.2;
      const gradient = ctx!.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowR);
      gradient.addColorStop(0, `rgba(180,220,255,${0.11 * mouseActive})`);
      gradient.addColorStop(0.4, `rgba(129,140,248,${0.06 * mouseActive})`);
      gradient.addColorStop(1, 'rgba(129,140,248,0)');
      ctx!.fillStyle = gradient;
      ctx!.beginPath();
      ctx!.arc(mouse.x, mouse.y, glowR, 0, Math.PI * 2);
      ctx!.fill();

      const coreGrad = ctx!.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 7);
      coreGrad.addColorStop(0, `rgba(255,255,255,${0.4 * mouseActive})`);
      coreGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx!.fillStyle = coreGrad;
      ctx!.beginPath();
      ctx!.arc(mouse.x, mouse.y, 7, 0, Math.PI * 2);
      ctx!.fill();
    }

    function maybeSpawnShootingStar(now: number) {
      if (now >= nextShootingStarAt) {
        nextShootingStarAt = now + 8000 + Math.random() * 6000;
        const candidates = stars.filter((s) => !s.isShooting && s.layer.parallax >= 0.22);
        if (candidates.length > 0) {
          const chosen = candidates[Math.floor(Math.random() * candidates.length)];
          chosen.startShooting();
        }
      }
    }

    function drawVignette() {
      const grad = ctx!.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.max(W, H) * 0.75);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,2,10,0.55)');
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, W, H);
    }

    function animate(now: number) {
      const dt = Math.min(2.5, (now - lastTime) / 16.6667);
      lastTime = now;

      mouse.x = approach(mouse.x, targetMouse.x, 0.18, dt);
      mouse.y = approach(mouse.y, targetMouse.y, 0.18, dt);
      const wantsActive = targetMouse.x > -5000 ? 1 : 0;
      mouseActive = approach(mouseActive, wantsActive, 0.06, dt);

      if (wantsActive) {
        parallaxTarget.x = -(targetMouse.x - W / 2) * 0.02;
        parallaxTarget.y = -(targetMouse.y - H / 2) * 0.02;
      } else {
        parallaxTarget.x = 0;
        parallaxTarget.y = 0;
      }
      parallax.x = approach(parallax.x, parallaxTarget.x, 0.02, dt);
      parallax.y = approach(parallax.y, parallaxTarget.y, 0.02, dt);

      ctx!.globalCompositeOperation = 'source-over';
      ctx!.fillStyle = '#01020a';
      ctx!.fillRect(0, 0, W, H);

      ctx!.globalCompositeOperation = 'lighter';
      for (const n of nebulae) {
        n.update(now);
        n.draw();
      }
      for (const g of galaxies) g.draw(now);

      ctx!.globalCompositeOperation = 'source-over';
      drawConstellationLines(parallax.x * DEPTH_LAYERS[2].parallax, parallax.y * DEPTH_LAYERS[2].parallax);

      ctx!.globalCompositeOperation = 'lighter';
      drawCursorCluster();

      for (const b of blasts) {
        b.update(dt);
        b.applyForce(dt);
      }

      for (const layer of DEPTH_LAYERS) {
        const px = parallax.x * layer.parallax;
        const py = parallax.y * layer.parallax;
        for (const s of stars) {
          if (s.layer !== layer) continue;
          s.update(dt);
          s.draw(now, px, py);
        }
      }

      maybeSpawnShootingStar(now);

      if (blasts.length > 0) {
        ctx!.globalCompositeOperation = 'lighter';
        for (const b of blasts) b.draw();
        blasts = blasts.filter((b) => !b.done);
      }

      ctx!.globalCompositeOperation = 'source-over';
      drawVignette();

      rafId = requestAnimationFrame(animate);
    }

    init();
    rafId = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.pageX;
      targetMouse.y = e.pageY;
    };
    const handleMouseLeave = () => {
      targetMouse.x = -10000;
      targetMouse.y = -10000;
    };
    const handleClick = (e: MouseEvent) => {
      blasts.push(new Blast(e.pageX, e.pageY));
      if (blasts.length > 6) blasts.splice(0, blasts.length - 6);
    };

    window.addEventListener('resize', scheduleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseout', handleMouseLeave, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    const resizeObserver = new ResizeObserver(() => scheduleResize());
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      window.removeEventListener('resize', scheduleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block pointer-events-none z-0"
    />
  );
};

export default ParticleBackground;