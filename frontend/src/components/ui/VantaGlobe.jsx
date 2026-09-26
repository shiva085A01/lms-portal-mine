import React, { useEffect, useRef, useState } from 'react';

/**
 * Reusable Vanta.js 3D Globe Background Component (Warm Studio Palette)
 */
export const VantaGlobe = ({
  children,
  className = '',
  color = 0xd95d39,        // Warm Terracotta glow
  color2 = 0xf59e0b,       // Marigold / Amber accent glow
  backgroundColor = 0x121110, // Warm deep ink background
  size = 1.0,
  mouseControls = true,
  touchControls = true,
  gyroControls = false,
  ...restOptions
}) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let effect = null;

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script ${src}`));
        document.body.appendChild(script);
      });
    };

    const initVanta = async () => {
      try {
        if (!window.THREE) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        }

        if (!window.VANTA || !window.VANTA.GLOBE) {
          await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js');
        }

        if (window.VANTA && window.VANTA.GLOBE && vantaRef.current && !effect) {
          effect = window.VANTA.GLOBE({
            el: vantaRef.current,
            mouseControls,
            touchControls,
            gyroControls,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color,
            color2,
            backgroundColor,
            size,
            ...restOptions,
          });
          setVantaEffect(effect);
        }
      } catch (err) {
        console.error('Failed to initialize Vanta Globe:', err);
      }
    };

    initVanta();

    return () => {
      if (effect) {
        effect.destroy();
      }
    };
  }, [color, color2, backgroundColor, size, mouseControls, touchControls, gyroControls]);

  return (
    <div
      ref={vantaRef}
      className={`relative w-full h-full min-h-[300px] overflow-hidden ${className}`}
    >
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
};

export default VantaGlobe;

