// ======== Base Imports ========
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// ===== 縦ナビの現在地ハイライト =====
const navLinks = [...document.querySelectorAll(".side-nav a")];
const sections = navLinks.map(a => document.querySelector(a.getAttribute("href")));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const id = e.target.id;
    const link = document.querySelector(`.side-nav a[href="#${id}"]`);
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove("active"));
      link?.classList.add("active");
    }
  });
}, { rootMargin: "0px 0px -50% 0px", threshold: 0.5 });

sections.forEach(sec => sec && navObserver.observe(sec));

// ===== フェードイン =====
const fades = document.querySelectorAll(".fade-in");
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.2 });
fades.forEach(el => fadeObserver.observe(el));

// ===== 背景：湯気（Canvas） =====
const steamCanvas = document.getElementById("steam");
if (steamCanvas) {
  const ctx = steamCanvas.getContext("2d", { alpha: true });
  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  const particles = [];
  const COUNT = 80;
  const BASE_SPEED = 0.15;
  const NOISE = 0.4;

  function resize() {
    w = steamCanvas.width = Math.floor(innerWidth * dpr);
    h = steamCanvas.height = Math.floor(innerHeight * dpr);
    steamCanvas.style.width = innerWidth + "px";
    steamCanvas.style.height = innerHeight + "px";
  }
  addEventListener("resize", resize);
  resize();

  function makeParticle() {
    const x = Math.random() * w;
    const y = h + Math.random() * h * 0.3;
    const r = (Math.random() * 1.6 + 0.6) * dpr;
    const o = Math.random() * 0.15 + 0.05;
    const s = BASE_SPEED * (0.6 + Math.random() * 0.8) * dpr;
    return { x, y, r, o, s, t: Math.random() * Math.PI * 2 };
  }

  for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

  function step() {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    particles.forEach(p => {
      p.t += 0.01;
      p.y -= p.s;
      p.x += Math.sin(p.t) * NOISE * dpr;
      if (p.y < -40 * dpr) Object.assign(p, makeParticle());
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      grd.addColorStop(0, `rgba(198,163,107, ${p.o * 0.45})`);
      grd.addColorStop(1, `rgba(255,255,255, 0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
    requestAnimationFrame(step);
  }
  step();
}

// ===== サウンド再生／停止 =====
const heroVideo = document.getElementById("hero-bg");
const soundToggle = document.getElementById("sound-toggle");
if (soundToggle && heroVideo) {
  setTimeout(() => soundToggle.classList.add("show"), 1000);
  let isMuted = true;
  soundToggle.addEventListener("click", () => {
    if (isMuted) {
      heroVideo.muted = false;
      heroVideo.volume = 0.6;
      heroVideo.play();
      soundToggle.textContent = "Sound: ON";
      soundToggle.classList.add("active");
    } else {
      heroVideo.muted = true;
      soundToggle.textContent = "Sound: OFF";
      soundToggle.classList.remove("active");
    }
    isMuted = !isMuted;
  });
}

// ===== セクション演出 =====
const observedSections = document.querySelectorAll("#aroma, #pour, #taste, #calm");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active", "show");
    }
  });
}, { threshold: 0.05 });
observedSections.forEach(sec => sectionObserver.observe(sec));
