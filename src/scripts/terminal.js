// Progressive enhancements only: the portfolio content is static HTML.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const canvas = document.getElementById('pixel-canvas');
const ctx = canvas?.getContext('2d');
const toroidEl = document.getElementById('toroid');
let width = window.innerWidth;
let height = window.innerHeight;
const mouse = { x: undefined, y: undefined };
const gruvColors = ['#fb4934', '#b8bb26', '#fabd2f', '#83a598', '#d3869b', '#8ec07c', '#fe8019'];
const particles = [];
const gridSize = 30;
let grid = [];

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  if (!canvas || !ctx) return;
  canvas.width = width;
  canvas.height = height;
  grid = [];
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      grid.push({ x, y, opacity: 0.1 });
    }
  }
}

class Pixel {
  constructor(depth) {
    this.depth = depth;
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 4 + 2;
    this.color = gruvColors[Math.floor(Math.random() * gruvColors.length)];
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (mouse.x !== undefined && mouse.y !== undefined) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 300) {
        const force = (300 - dist) / 300;
        this.x += dx * force * 0.05 * this.depth;
        this.y += dy * force * 0.05 * this.depth;
      }
    }
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.reset();
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.4 * this.depth;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

function drawParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  grid.forEach((point) => {
    let dist = 1000;
    if (mouse.x !== undefined && mouse.y !== undefined) {
      dist = Math.hypot(point.x - mouse.x, point.y - mouse.y);
    }
    const targetOpacity = dist < 150 ? 0.4 : 0.05;
    point.opacity += (targetOpacity - point.opacity) * 0.1;
    ctx.fillStyle = '#ebdbb2';
    ctx.globalAlpha = point.opacity;
    ctx.fillRect(point.x, point.y, 2, 2);
  });
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
}

window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
}, { passive: true });
window.addEventListener('mouseout', (event) => {
  if (!event.relatedTarget) {
    mouse.x = undefined;
    mouse.y = undefined;
  }
});
window.addEventListener('resize', resize, { passive: true });

// Spinning ASCII toroid: the original donut.c math and Gruvbox luminance ramp.
const T_COLS = 38;
const T_ROWS = 19;
const LUM_CHARS = '.,-~:;=!*#$@';
const LUM_COLORS = ['#665c54', '#7c6f64', '#928374', '#a89984', '#bdae93', '#d5c4a1', '#83a598', '#8ec07c', '#b8bb26', '#fabd2f', '#fe8019', '#fb4934'];
let tA = 0.5;
let tB = 0.2;

function renderToroid() {
  if (!toroidEl) return;
  const out = new Array(T_COLS * T_ROWS).fill(' ');
  const lum = new Int8Array(T_COLS * T_ROWS).fill(-1);
  const zb = new Float32Array(T_COLS * T_ROWS);
  const cosA = Math.cos(tA), sinA = Math.sin(tA);
  const cosB = Math.cos(tB), sinB = Math.sin(tB);

  for (let j = 0; j < 6.28; j += 0.07) {
    const cosJ = Math.cos(j), sinJ = Math.sin(j);
    for (let i = 0; i < 6.28; i += 0.02) {
      const cosI = Math.cos(i), sinI = Math.sin(i);
      const h = cosJ + 2;
      const D = 1 / (sinI * h * sinA + sinJ * cosA + 5);
      const t = sinI * h * cosA - sinJ * sinA;
      const x = Math.floor(T_COLS / 2 + T_COLS * 0.38 * D * (cosI * h * cosB - t * sinB));
      const y = Math.floor(T_ROWS / 2 + T_ROWS * 0.40 * D * (cosI * h * sinB + t * cosB));
      const o = x + T_COLS * y;
      const N = Math.floor(8 * ((sinJ * sinA - sinI * cosJ * cosA) * cosB - sinI * cosJ * sinA - sinJ * cosA - cosI * cosJ * sinB));
      if (y >= 0 && y < T_ROWS && x >= 0 && x < T_COLS && D > zb[o]) {
        zb[o] = D;
        const idx = Math.max(0, Math.min(11, N));
        out[o] = LUM_CHARS[idx];
        lum[o] = idx;
      }
    }
  }

  // Only fixed, locally generated characters and colors enter this markup.
  let html = '';
  for (let k = 0; k < out.length; k++) {
    if (k !== 0 && k % T_COLS === 0) html += '\n';
    const level = lum[k];
    if (level < 0) {
      html += ' ';
      continue;
    }
    let run = out[k];
    let next = k + 1;
    while (next < out.length && next % T_COLS !== 0 && lum[next] === level) {
      run += out[next];
      next++;
    }
    html += '<span style="color:' + LUM_COLORS[level] + '">' + run + '</span>';
    k = next - 1;
  }
  toroidEl.innerHTML = html;
  tA += 0.045;
  tB += 0.022;
}

// One animation loop, paused in background tabs and for reduced-motion users.
let animationFrame = null;
let lastToroidFrame = 0;
let lastParticleFrame = 0;

function animate(timestamp) {
  if (timestamp - lastParticleFrame >= 1000 / 60) {
    drawParticles();
    lastParticleFrame = timestamp;
  }
  if (timestamp - lastToroidFrame >= 50) {
    renderToroid();
    lastToroidFrame = timestamp;
  }
  animationFrame = requestAnimationFrame(animate);
}

function syncAnimation() {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  if (!reducedMotion.matches && !document.hidden) {
    animationFrame = requestAnimationFrame(animate);
  }
}

resize();
if (ctx) {
  for (let i = 0; i < 150; i++) {
    particles.push(new Pixel(Math.random() * 0.8 + 0.2));
  }
}
renderToroid();
syncAnimation();
reducedMotion.addEventListener('change', syncAnimation);

// tmux status bar: browser-local clock.
const tmuxClock = document.getElementById('tmux-clock');
const tmuxDate = document.getElementById('tmux-date');
const TMUX_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function tickTmuxClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  if (tmuxClock) tmuxClock.textContent = hh + ':' + mm;
  if (tmuxDate) {
    tmuxDate.textContent = String(now.getDate()).padStart(2, '0') + '-' + TMUX_MONTHS[now.getMonth()] + '-' + String(now.getFullYear()).slice(2);
  }
}

tickTmuxClock();
setInterval(() => {
  if (!document.hidden) tickTmuxClock();
}, 1000);
document.addEventListener('visibilitychange', () => {
  syncAnimation();
  if (!document.hidden) tickTmuxClock();
});

