document.addEventListener('DOMContentLoaded', () => {
  // Initialize Elements
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  const typewriterElement = document.getElementById('opening-typewriter-text');
  const cursorElement = document.querySelector('.wish-text-box .cursor');
  const heartsContainer = document.getElementById('blooming-hearts-container');
  const backgroundMusic = document.getElementById('background-music');
  const surpriseButton = document.getElementById('surpriseButton');

  // Fireworks Animation Variables
  let particles = [];
  let fireworks = [];
  const MAX_FIREWORKS = 5;
  const LAUNCH_INTERVAL = 1200;
  let lastLaunchTime = 0;

  // Resize canvas to window size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Firework Rocket Class
  class Firework {
    constructor(startX, startY, targetX, targetY) {
      this.x = startX;
      this.y = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.speed = 3 + Math.random();
      this.angle = Math.atan2(targetY - startY, targetX - startX);
      this.velocity = {
        x: Math.cos(this.angle) * this.speed,
        y: Math.sin(this.angle) * this.speed
      };
      this.hue = Math.floor(Math.random() * 360);
      this.brightness = 50 + Math.random() * 20;
      this.alpha = 1;
      this.exploded = false;
      this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
      this.distanceTraveled = 0;
    }

    update() {
      if (this.exploded) return;
      this.distanceTraveled += this.speed;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      if (this.distanceTraveled >= this.distanceToTarget) {
        this.exploded = true;
        this.explode();
      }
    }

    draw() {
      if (this.exploded) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
      ctx.fill();
    }

    explode() {
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(this.x, this.y, this.hue));
      }
    }
  }

  // Firework Explosion Particle Class
  class Particle {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      this.hue = hue;
      this.speed = 1 + Math.random() * 7;
      this.angle = Math.random() * Math.PI * 2;
      this.velocity = {
        x: Math.cos(this.angle) * this.speed,
        y: Math.sin(this.angle) * this.speed
      };
      this.alpha = 1;
      this.decay = 0.015 + Math.random() * 0.025;
      this.initialSize = 18;
      this.size = this.initialSize;
    }

    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.velocity.y += 0.05;
      this.alpha -= this.decay;
      this.size = this.initialSize * (this.alpha > 0 ? this.alpha : 0);
      return this.alpha <= this.decay;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.font = `${this.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
      ctx.fillText('💖', this.x, this.y);
    }
  }

  // Launch new firework
  function launchFirework() {
    const now = Date.now();
    if (now - lastLaunchTime > LAUNCH_INTERVAL && fireworks.length < MAX_FIREWORKS) {
      const startX = Math.random() * canvas.width;
      const startY = canvas.height;
      const targetX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      const targetY = canvas.height * (0.2 + Math.random() * 0.4);
      fireworks.push(new Firework(startX, startY, targetX, targetY));
      lastLaunchTime = now;
    }
  }

  // Fireworks Animation Loop
  function animateFireworks() {
    requestAnimationFrame(animateFireworks);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    launchFirework();
    fireworks = fireworks.filter(firework => {
      firework.update();
      firework.draw();
      return !firework.exploded;
    });
    particles = particles.filter(particle => {
      const shouldRemove = particle.update();
      particle.draw();
      return !shouldRemove;
    });
  }

  // Typewriter Effect
  function typeWriter(element, text, speed = 100, callback) {
    let i = 0;
    element.textContent = '';
    const interval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
        if (callback) callback();
      }
    }, speed);
  }

  // Create Blooming Heart
  function createBloomingHeart() {
    const heart = document.createElement('span');
    heart.textContent = '💖';
    heart.className = 'blooming-heart';
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `${Math.random() * 100}vh`;
    heart.style.animationDelay = `${Math.random() * 2}s`;
    heart.style.animationDuration = `${4 + Math.random() * 2}s`;
    heartsContainer.appendChild(heart);
    heart.addEventListener('animationend', () => {
      heart.remove();
    });
  }

  // Initialize Page
  const message = "💖 Happy Birthday Samyu... ✨";
  typeWriter(typewriterElement, message, 100, () => {
    cursorElement.style.display = 'inline-block';
    animateFireworks();
    setInterval(createBloomingHeart, 700);
    confetti({
      particleCount: 150,
      spread: 160,
      origin: { y: 0.6 },
      colors: ['#ff69b4', '#ff1493', '#fff'],
      zIndex: 1000
    });
  });

  // Music Playback Logic
  function playMusic() {
    if (backgroundMusic.muted) {
      backgroundMusic.muted = false;
    }
    backgroundMusic.play().catch(() => {});
  }

  // Try to play muted audio on page load
  backgroundMusic.play().catch(() => {});

  // Unmute and play on button click
  surpriseButton.addEventListener('click', playMusic);

  // Fallback for mobile/strict browsers
  document.body.addEventListener('touchstart', playMusic, { once: true });
  document.body.addEventListener('mousedown', playMusic, { once: true });
  document.body.addEventListener('keydown', playMusic, { once: true });
});
