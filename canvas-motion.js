/**
 * WEBMINT CANVAS MOTION GRAPHICS ENGINE
 * 60fps Interactive 3D Calligraphic W Emblem + Concentric Radar System
 */

(function () {
  const canvas = document.getElementById('motionCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Canvas State & Variables
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  // Mouse / Pointer State
  const mouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isHovered: false,
    clickRipples: []
  };

  // 3D Emblem Physics State
  const emblem = {
    rotX: 0,
    rotY: 0,
    targetRotX: 0,
    targetRotY: 0,
    offsetX: 0,
    offsetY: 0,
    targetOffsetX: 0,
    targetOffsetY: 0,
    scale: 1,
    targetScale: 1
  };

  // Radar Animation Angles & Particles
  let radarAngle = 0;
  const particles = [];
  const particleCount = 28;

  function resizeCanvas() {
    const parent = canvas.parentElement;
    width = parent.clientWidth;
    height = parent.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);

    // Initialize particles centered around radar
    initParticles();
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 160;
      particles.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        baseAngle: angle,
        baseDist: dist,
        size: 1.5 + Math.random() * 2,
        speed: 0.002 + Math.random() * 0.005,
        alpha: 0.3 + Math.random() * 0.5
      });
    }
  }

  // Path data for calligraphic W logo
  function drawWLogoPath(ctx, scaleMultiplier = 1) {
    ctx.beginPath();

    // Calligraphic W stroke points scaled relative to center (0,0)
    // Centered around (0,0), original canvas width 100x100 -> shift (-45, -45)
    const scale = 2.4 * scaleMultiplier;

    // Outer Calligraphic Brush W
    ctx.moveTo(-27 * scale, -15 * scale);
    ctx.bezierCurveTo(-23 * scale, -27 * scale, -15 * scale, -20 * scale, -11 * scale, 13 * scale);
    ctx.bezierCurveTo(-7 * scale, -10 * scale, 3 * scale, -10 * scale, 9 * scale, 17 * scale);
    ctx.bezierCurveTo(15 * scale, -17 * scale, 25 * scale, -25 * scale, 33 * scale, 27 * scale);
    ctx.bezierCurveTo(33 * scale, 31 * scale, 27 * scale, 33 * scale, 23 * scale, 27 * scale);
    ctx.bezierCurveTo(15 * scale, 3 * scale, 10 * scale, 0 * scale, 5 * scale, 23 * scale);
    ctx.bezierCurveTo(0 * scale, 33 * scale, -5 * scale, 31 * scale, -9 * scale, 15 * scale);
    ctx.bezierCurveTo(-15 * scale, 33 * scale, -21 * scale, 30 * scale, -27 * scale, -15 * scale);
    ctx.closePath();
  }

  function drawWDot(ctx, scaleMultiplier = 1) {
    const scale = 2.4 * scaleMultiplier;
    ctx.beginPath();
    ctx.arc(43 * scale, 23 * scale, 6.5 * scale, 0, Math.PI * 2);
  }

  // Main Render Loop (60 FPS)
  function render(time) {
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const isDarkMode = document.body.classList.contains('dark-mode');

    // Color tokens based on theme
    const gridLineColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)';
    const accentBlue = isDarkMode ? '#3B82F6' : '#2563EB';
    const accentBlueDark = isDarkMode ? '#2563EB' : '#1E3A8A';
    const axisColor = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)';

    // Smooth Lerp Mouse / Physics
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    emblem.rotX += (emblem.targetRotX - emblem.rotX) * 0.08;
    emblem.rotY += (emblem.targetRotY - emblem.rotY) * 0.08;
    emblem.offsetX += (emblem.targetOffsetX - emblem.offsetX) * 0.08;
    emblem.offsetY += (emblem.targetOffsetY - emblem.offsetY) * 0.08;

    radarAngle += 0.006;

    // ----------------------------------------------------
    // 1. DRAW CONCENTRIC RADAR GRID SYSTEM
    // ----------------------------------------------------
    ctx.save();
    ctx.translate(centerX, centerY);

    // Fine Axis Crosshairs
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(-width / 2 + 40, 0);
    ctx.lineTo(width / 2 - 40, 0);
    ctx.moveTo(0, -height / 2 + 40);
    ctx.lineTo(0, height / 2 - 40);
    ctx.stroke();

    ctx.setLineDash([]); // Reset line dash

    // Concentric Circles
    const radii = [70, 130, 190, 240];
    radii.forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = gridLineColor;
      ctx.lineWidth = idx === 1 ? 1.5 : 1;
      ctx.stroke();

      // Degree Tick Marks on 2nd Circle
      if (idx === 1) {
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
          const tx1 = Math.cos(a) * (r - 4);
          const ty1 = Math.sin(a) * (r - 4);
          const tx2 = Math.cos(a) * (r + 4);
          const ty2 = Math.sin(a) * (r + 4);
          ctx.beginPath();
          ctx.moveTo(tx1, ty1);
          ctx.lineTo(tx2, ty2);
          ctx.strokeStyle = axisColor;
          ctx.stroke();
        }
      }
    });

    // Rotating Radar Sweep Beam
    const sweepRadius = 240;
    const sweepGradient = ctx.createConicGradient(radarAngle, 0, 0);
    sweepGradient.addColorStop(0, 'rgba(37, 99, 235, 0.15)');
    sweepGradient.addColorStop(0.1, 'rgba(37, 99, 235, 0.02)');
    sweepGradient.addColorStop(0.25, 'transparent');
    sweepGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = sweepGradient;
    ctx.beginPath();
    ctx.arc(0, 0, sweepRadius, 0, Math.PI * 2);
    ctx.fill();

    // ----------------------------------------------------
    // 2. DRAW CLICK RIPPLE ANIMATIONS
    // ----------------------------------------------------
    for (let i = mouse.clickRipples.length - 1; i >= 0; i--) {
      const ripple = mouse.clickRipples[i];
      ripple.radius += 4;
      ripple.alpha -= 0.02;

      if (ripple.alpha <= 0) {
        mouse.clickRipples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(ripple.x - centerX, ripple.y - centerY, ripple.radius, 0, Math.PI * 2);
      ctx.strokeStyle = isDarkMode ? `rgba(96, 165, 250, ${ripple.alpha})` : `rgba(37, 99, 235, ${ripple.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // ----------------------------------------------------
    // 3. DRAW ORBITING AMBIENT PARTICLES
    // ----------------------------------------------------
    particles.forEach(p => {
      p.baseAngle += p.speed;
      const px = Math.cos(p.baseAngle) * p.baseDist;
      const py = Math.sin(p.baseAngle) * p.baseDist;

      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = isDarkMode ? `rgba(96, 165, 250, ${p.alpha})` : `rgba(37, 99, 235, ${p.alpha})`;
      ctx.fill();
    });

    ctx.restore();

    // ----------------------------------------------------
    // 4. DRAW 3D MAGNETIC FLOATING CALLIGRAPHIC LOGO ('W.')
    // ----------------------------------------------------
    ctx.save();
    // Position emblem at center + magnetic offsets
    ctx.translate(centerX + emblem.offsetX, centerY + emblem.offsetY);

    // Apply 3D perspective simulated transform
    const tiltScaleX = 1 + Math.sin(emblem.rotY) * 0.05;
    const tiltScaleY = 1 + Math.sin(emblem.rotX) * 0.05;
    ctx.scale(tiltScaleX, tiltScaleY);

    // Soft Drop Shadow Layer
    ctx.save();
    ctx.translate(12 - emblem.rotY * 20, 18 - emblem.rotX * 20);
    ctx.fillStyle = isDarkMode ? 'rgba(0, 0, 0, 0.45)' : 'rgba(30, 58, 138, 0.12)';
    ctx.filter = 'blur(10px)';
    drawWLogoPath(ctx);
    ctx.fill();
    drawWDot(ctx);
    ctx.fill();
    ctx.restore();

    // Main Solid Calligraphic W Logo & Dot
    ctx.fillStyle = accentBlueDark;
    drawWLogoPath(ctx);
    ctx.fill();
    drawWDot(ctx);
    ctx.fill();

    // Specular Highlight Overlay
    const highlightGradient = ctx.createLinearGradient(-50, -50, 50, 50);
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    highlightGradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');

    ctx.fillStyle = highlightGradient;
    drawWLogoPath(ctx);
    ctx.fill();

    ctx.restore();

    requestAnimationFrame(render);
  }

  // Mouse Listener Handlers
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      mouse.isHovered = true;
      const relX = e.clientX - rect.left - width / 2;
      const relY = e.clientY - rect.top - height / 2;

      mouse.targetX = relX;
      mouse.targetY = relY;

      // Calculate 3D tilt & offset physics targets
      emblem.targetRotX = (relY / height) * 0.4;
      emblem.targetRotY = (relX / width) * 0.4;
      emblem.targetOffsetX = relX * 0.12;
      emblem.targetOffsetY = relY * 0.12;
    } else if (mouse.isHovered) {
      mouse.isHovered = false;
      emblem.targetRotX = 0;
      emblem.targetRotY = 0;
      emblem.targetOffsetX = 0;
      emblem.targetOffsetY = 0;
    }
  });

  // Touch Support
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const relX = touch.clientX - rect.left - width / 2;
      const relY = touch.clientY - rect.top - height / 2;

      emblem.targetRotX = (relY / height) * 0.4;
      emblem.targetRotY = (relX / width) * 0.4;
      emblem.targetOffsetX = relX * 0.15;
      emblem.targetOffsetY = relY * 0.15;
    }
  });

  // Click Ripple Trigger
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.clickRipples.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      radius: 10,
      alpha: 1
    });

    // Bounce emblem on click
    emblem.offsetY -= 15;
  });

  // Resize listener
  window.addEventListener('resize', resizeCanvas);

  // Initialize & Start Loop
  resizeCanvas();
  requestAnimationFrame(render);
})();
