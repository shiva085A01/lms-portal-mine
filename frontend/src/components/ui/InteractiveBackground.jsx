import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const InteractiveBackground = ({ className = '' }) => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = {
      x: width / 2,
      y: height / 3,
      radius: 180,
      isHovered: false,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
    };

    // Click ripples
    const ripples = [];
    const handleMouseClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 160,
        opacity: 0.8,
        speed: 3.5,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleMouseClick);

    // Particle nodes
    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const particles = [];

    const primaryColor = isDark ? '217, 93, 57' : '197, 78, 43'; // Terracotta
    const secondaryColor = isDark ? '245, 158, 11' : '217, 119, 6'; // Amber / Marigold
    const neutralColor = isDark ? '235, 222, 211' : '100, 85, 75';

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        baseRadius: Math.random() * 2.2 + 1.2,
        radius: Math.random() * 2.2 + 1.2,
        color: Math.random() > 0.4 ? primaryColor : secondaryColor,
        alpha: Math.random() * 0.5 + 0.25,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.opacity -= 0.015;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${primaryColor}, ${r.opacity * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${secondaryColor}, ${r.opacity * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw particle connections
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.22 : 0.16);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${isDark ? '217, 93, 57' : '197, 78, 43'}, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce from walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction: gravitate or push
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && mouse.isHovered) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          // Gentle attraction & swirl
          p.x += Math.cos(angle) * force * 1.5;
          p.y += Math.sin(angle) * force * 1.5;
          p.radius = p.baseRadius * (1 + force * 0.8);

          // Draw subtle interactive line to mouse
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${primaryColor}, ${force * 0.3})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        } else {
          p.radius = p.baseRadius;
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();

        // Glow center
        if (isDark) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, 0.6)`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleMouseClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-auto z-0 transition-opacity duration-700 ${className}`}
      style={{
        opacity: isDark ? 0.9 : 0.75,
      }}
    />
  );
};

export default InteractiveBackground;
