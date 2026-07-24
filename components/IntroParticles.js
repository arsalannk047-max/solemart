'use client';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'solemart_intro_seen';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export default function IntroParticles() {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [skip, setSkip] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (started.current) return;
    started.current = true;

    if (sessionStorage.getItem(STORAGE_KEY)) {
      setSkip(true);
      setVisible(false);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, '1');

    let renderer, raf;
    let cancelled = false;

    async function init() {
      try {
        const THREE = await import('three');
        const { gsap } = await import('gsap');
        if (cancelled || !containerRef.current) return;

        // ---- draw the SoleMart logo (badge + wordmark) onto an offscreen canvas ----
        const W = 700, H = 200;
        const off = document.createElement('canvas');
        off.width = W;
        off.height = H;
        const ctx = off.getContext('2d');
        ctx.clearRect(0, 0, W, H);

        const badgeSize = 96;
        const badgeX = 10;
        const badgeY = (H - badgeSize) / 2;
        ctx.fillStyle = '#111318';
        roundRect(ctx, badgeX, badgeY, badgeSize, badgeSize, 22);
        ctx.fill();
        ctx.fillStyle = '#C6FF4D';
        ctx.font = '700 56px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('S', badgeX + badgeSize / 2, badgeY + badgeSize / 2 + 4);

        const wordX = badgeX + badgeSize + 28;
        const wordY = H / 2 + 4;
        ctx.font = '900 74px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#F5F5F7';
        ctx.fillText('SOLE', wordX, wordY);
        const soleWidth = ctx.measureText('SOLE').width;
        ctx.fillStyle = '#C6FF4D';
        ctx.fillText('MART', wordX + soleWidth, wordY);

        // ---- sample non-transparent pixels into particle targets ----
        const imageData = ctx.getImageData(0, 0, W, H).data;
        const targets = [];
        const colors = [];
        const SAMPLE_STEP = 3; // raise to 4-5 on low-end devices for fewer/faster particles

        for (let y = 0; y < H; y += SAMPLE_STEP) {
          for (let x = 0; x < W; x += SAMPLE_STEP) {
            const idx = (y * W + x) * 4;
            const alpha = imageData[idx + 3];
            if (alpha > 120) {
              targets.push({ x: x - W / 2, y: -(y - H / 2), z: 0 });
              colors.push(imageData[idx] / 255, imageData[idx + 1] / 255, imageData[idx + 2] / 255);
            }
          }
        }

        const count = targets.length;
        const starts = targets.map(t => ({
          x: t.x + (Math.random() - 0.5) * 520,
          y: t.y + (Math.random() - 0.5) * 520,
          z: (Math.random() - 0.5) * 620
        }));

        // ---- three.js scene ----
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          50,
          containerRef.current.clientWidth / containerRef.current.clientHeight,
          0.1,
          3000
        );
        camera.position.set(0, 0, 480);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);

        const positions = new Float32Array(count * 3);
        const colorArr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          positions[i * 3] = starts[i].x;
          positions[i * 3 + 1] = starts[i].y;
          positions[i * 3 + 2] = starts[i].z;
          colorArr[i * 3] = colors[i * 3];
          colorArr[i * 3 + 1] = colors[i * 3 + 1];
          colorArr[i * 3 + 2] = colors[i * 3 + 2];
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colorArr, 3));

        const material = new THREE.PointsMaterial({
          size: 2.6,
          vertexColors: true,
          transparent: true,
          opacity: 0.95,
          depthWrite: false
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // ---- animate: scattered -> assembled logo ----
        const posAttr = geometry.attributes.position;
        const tl = gsap.timeline({
          onComplete: () => {
            setTimeout(() => setVisible(false), 550);
          }
        });
        for (let i = 0; i < count; i++) {
          const proxy = { x: starts[i].x, y: starts[i].y, z: starts[i].z };
          tl.to(
            proxy,
            {
              x: targets[i].x,
              y: targets[i].y,
              z: 0,
              ease: 'power2.out',
              duration: gsap.utils.random(1.1, 2.2),
              onUpdate: () => {
                posAttr.array[i * 3] = proxy.x;
                posAttr.array[i * 3 + 1] = proxy.y;
                posAttr.array[i * 3 + 2] = proxy.z;
                posAttr.needsUpdate = true;
              }
            },
            0
          );
        }

        function loop() {
          raf = requestAnimationFrame(loop);
          renderer.render(scene, camera);
        }
        loop();
      } catch (err) {
        console.warn('Intro particle animation skipped:', err);
        setVisible(false);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (renderer) {
        renderer.dispose();
        renderer.domElement?.remove();
      }
    };
  }, []);

  if (skip || !visible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center" style={{ background: '#05060a' }}>
      <div ref={containerRef} style={{ width: 'min(90vw, 760px)', height: 220 }} />
    </div>
  );
}