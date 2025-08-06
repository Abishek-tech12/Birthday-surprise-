document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-music');
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  const typewriterElement = document.getElementById('typewriter-text');
  const cursorElement = document.querySelector('.page-title .cursor');
  const balloonsContainer = document.getElementById('balloons-container');
  const sparkleHeartsContainer = document.getElementById('sparkle-hearts-container');
  const hearts = document.querySelectorAll('.heart-container');

  let currentSong = null; // Track the currently playing photo song

  // Fireworks Variables
  let fireworks = [];
  let fireworksParticles = [];
  const maxActiveFireworks = 5;
  const fireworkLaunchInterval = 1000;
  let lastFireworkLaunchTime = 0;

  // Resize Canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Firework Class
  class Firework {
    constructor(startX, startY, endX, endY) {
      this.x = startX;
      this.y = startY;
      this.endX = endX;
      this.endY = endY;
      this.speed = 3;
      this.distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      this.traveled = 0;
      this.angle = Math.atan2(endY - startY, endX - startX);
      this.velocity = {
        x: Math.cos(this.angle) * this.speed,
        y: Math.sin(this.angle) * this.speed
      };
      this.hue = Math.floor(Math.random() * 360);
      this.brightness = 50 + Math.random() * 20;
      this.alpha = 1;
      this.exploded = false;
    }

    update() {
      if (this.exploded) return;
      this.traveled += this.speed;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      if (this.traveled >= this.distance) {
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
        fireworksParticles.push(new FireworkParticle(this.x, this.y, this.hue));
      }
    }
  }

  // Firework Particle Class
  class FireworkParticle {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      this.hue = hue;
      this.speed = 1 + Math.random() * 8;
      this.angle = Math.random() * Math.PI * 2;
      this.velocity = {
        x: Math.cos(this.angle) * this.speed,
        y: Math.sin(this.angle) * this.speed
      };
      this.alpha = 1;
      this.decay = 0.01 + Math.random() * 0.02;
    }

    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= this.decay;
      return this.alpha <= this.decay;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
      ctx.fill();
    }
  }

  // Launch Firework
  function launchFirework() {
    if (Date.now() - lastFireworkLaunchTime > fireworkLaunchInterval) {
      const startX = Math.random() * canvas.width;
      const startY = canvas.height;
      const endX = Math.random() * canvas.width;
      const endY = canvas.height * (0.2 + Math.random() * 0.6);
      fireworks.push(new Firework(startX, startY, endX, endY));
      lastFireworkLaunchTime = Date.now();
    }
  }

  // Animate Fireworks
  function animateFireworks() {
    requestAnimationFrame(animateFireworks);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (fireworks.length < maxActiveFireworks) {
      launchFirework();
    }

    fireworks = fireworks.filter(fw => !fw.exploded);
    fireworks.forEach(fw => {
      fw.update();
      fw.draw();
    });

    fireworksParticles = fireworksParticles.filter(p => !p.update());
    fireworksParticles.forEach(p => p.draw());
  }

  // Typewriter Effect
  function typeWriter(element, text, delay = 100, callback) {
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
    }, delay);
  }

  // Create Balloon
  function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = `${Math.random() * 100}vw`;
    balloon.style.animationDuration = `${Math.random() * 5 + 8}s`;
    balloon.style.setProperty('--rotation', `${Math.random() * 60 - 30}deg`);
    balloonsContainer.appendChild(balloon);
    balloon.addEventListener('animationend', () => balloon.remove());
  }

  // Create Sparkle Heart
  function createSparkleHeart() {
    const heart = document.createElement('div');
    heart.className = 'sparkle-heart';
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${Math.random() * 2 + 2}s`;
    sparkleHeartsContainer.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
  }

  // Initialize Page
  const fullTitleText = "💖 Happy Birthday, SAMYUKTHA! ✨";
  typeWriter(typewriterElement, fullTitleText, 100, () => {
    cursorElement.style.display = 'inline-block';
    animateFireworks();
    setInterval(createBalloon, 1500);
    setInterval(createSparkleHeart, 500);
    confetti({ particleCount: 200, spread: 160, origin: { y: 0.5 } });

    // Play Audio
    audio.play().catch(() => {
      const resumeAudio = () => {
        audio.play();
        document.removeEventListener('click', resumeAudio);
        document.removeEventListener('keydown', resumeAudio);
      };
      document.addEventListener('click', resumeAudio);
      document.addEventListener('keydown', resumeAudio);
    });
  });

  // Heart Click Logic (Updated with Song Playback)
  hearts.forEach(container => {
    const heart = container.querySelector('.heart');
    const msgBox = container.querySelector('.message-overlay');

    if (msgBox) {
      msgBox.innerHTML = heart.dataset.message.replace(/\n/g, '<br>');
    } else {
      return;
    }

    heart.addEventListener('click', () => {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

      if (container.classList.contains('active')) {
        // Closing the popup: Stop current song and resume background music
        if (currentSong) {
          currentSong.pause();
          currentSong.currentTime = 0; // Reset song
          currentSong = null;
        }
        audio.play();
        container.classList.remove('active');
      } else {
        // Opening the popup: Close others, pause background, play song
        hearts.forEach(c => c.classList.remove('active'));
        container.classList.add('active');

        audio.pause();

        if (currentSong) {
          currentSong.pause();
          currentSong.currentTime = 0;
        }

        const songId = heart.dataset.song;
        currentSong = document.getElementById(songId);
        currentSong.currentTime = 0; // Reset to start
        currentSong.play();

        // When song ends, resume background music
        currentSong.onended = () => {
          currentSong = null;
          audio.play();
        };
      }
    });
  });

  // Close Popups on Outside Click
  document.body.addEventListener('click', (e) => {
    if (!e.target.closest('.heart-container') && document.querySelector('.heart-container.active')) {
      document.querySelectorAll('.heart-container.active').forEach(c => c.classList.remove('active'));
      if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0;
        currentSong = null;
      }
      audio.play();
    }
  });
});
