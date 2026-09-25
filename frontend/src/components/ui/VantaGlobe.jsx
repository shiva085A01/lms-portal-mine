import React, { useEffect, useRef, useState } from 'react';

/**
 * Reusable Vanta.js 3D Globe Background Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Optional child elements to render on top
 * @param {string} [props.className] - Extra Tailwind or CSS classes
 * @param {number} [props.color=0xff3f81] - Globe line color (hex format: 0x...)
 * @param {number} [props.color2=0xffffff] - Secondary accent color
 * @param {number} [props.backgroundColor=0x090d16] - Background color matching LMS dark theme
 * @param {number} [props.size=1.00] - Globe size multiplier
 * @param {boolean} [props.mouseControls=true] - Enable mouse interaction
 * @param {boolean} [props.touchControls=true] - Enable touch interaction
 * @param {boolean} [props.gyroControls=false] - Enable gyroscope interaction
 */
export const VantaGlobe = ({
  children,
  className = '',
  color = 0x6366f1,        // Indigo/Brand glow
  color2 = 0xec4899,       // Pink/Accent glow
  backgroundColor = 0x090d16, // Dark slate theme background
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

    // Helper to dynamically load script if not present
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
        // 1. Ensure Three.js is loaded
        if (!window.THREE) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        }

        // 2. Ensure Vanta Globe is loaded
        if (!window.VANTA || !window.VANTA.GLOBE) {
          await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js');
        }

        // 3. Initialize Vanta on container ref
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

    // Clean up Vanta WebGL instance on unmount to avoid memory leaks
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
