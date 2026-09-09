const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const palettes = {
  neon:   ['#ff00ea', '#00fff9', '#7b2fff', '#ff2fbf'],
  sunset: ['#ff5f6d', '#ffc371', '#ff9a5b', '#ffe66d'],
  ocean:  ['#00c6ff', '#0072ff', '#36d1dc', '#5b86e5'],
  mono:   ['#f5f5f5', '#bbbbbb', '#888888', '#555555']
};

let currentPalette = 'sunset';
let currentMode = 'gravity';
let particleCount = 300;
let forceStrength = 8;

const mouse = { x: canvas.width / 2, y: canvas.height / 2, active: false };

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.radius = Math.random() * 2 + 1;
    this.color = palettes[currentPalette][Math.floor(Math.random() * palettes[currentPalette].length)];
    this.life = 1;
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = forceStrength / dist;

    if (mouse.active) {
      if (currentMode === 'gravity') {
        this.vx += (dx / dist) * force * 0.5;
        this.vy += (dy / dist) * force * 0.5;
      } else if (currentMode === 'repel') {
        this.vx -= (dx / dist) * force * 0.5;
        this.vy -= (dy / dist) * force * 0.5;
      } else if (currentMode === 'swirl') {
        this.vx += (-dy / dist) * force * 0.5;
        this.vy += (dx / dist) * force * 0.5;
      }
    }

    if (currentMode === 'fireworks') {
      this.vy += 0.03;
      this.life -= 0.003;
      if (this.life <= 0) this.reset();
    }

    this.vx *= 0.98;
    this.vy *= 0.98;

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = currentMode === 'fireworks' ? Math.max(this.life, 0) : 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

let particles = [];

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
initParticles();

function burst(x, y) {
  for (let i = 0; i < 40; i++) {
    const p = new Particle();
    p.x = x;
    p.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    particles.push(p);
  }
  if (particles.length > 1500) {
    particles.splice(0, particles.length - 1500);
  }
}

function animate() {
  ctx.fillStyle = 'rgba(10, 10, 18, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    p.update();
    p.draw();
  }

  requestAnimationFrame(animate);
}
animate();

canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});

canvas.addEventListener('mouseleave', () => {
  mouse.active = false;
});

canvas.addEventListener('click', (e) => {
  burst(e.clientX, e.clientY);
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  mouse.x = t.clientX;
  mouse.y = t.clientY;
  mouse.active = true;
}, { passive: false });

canvas.addEventListener('touchstart', (e) => {
  const t = e.touches[0];
  burst(t.clientX, t.clientY);
});

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
  });
});

document.querySelectorAll('.palette-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPalette = btn.dataset.palette;
  });
});

const countSlider = document.getElementById('countSlider');
const countValue = document.getElementById('countValue');
countSlider.addEventListener('input', () => {
  particleCount = parseInt(countSlider.value);
  countValue.textContent = particleCount;
  initParticles();
});

const forceSlider = document.getElementById('forceSlider');
const forceValue = document.getElementById('forceValue');
forceSlider.addEventListener('input', () => {
  forceStrength = parseInt(forceSlider.value);
  forceValue.textContent = forceStrength;
});

document.getElementById('clearBtn').addEventListener('click', () => {
  ctx.fillStyle = '#0a0a12';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});
