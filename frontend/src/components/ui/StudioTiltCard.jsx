import React, { useRef, useState } from 'react';

/**
 * 3D Tilt Card Component (React Bits / ThreeUI style)
 * Provides tactile perspective tilting and dynamic cursor specular light reflections.
 */
export const StudioTiltCard = ({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
  onClick,
  ...props
}) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`,
      transition: 'transform 0.1s ease-out',
    });

    if (glare) {
      setGlareStyle({
        opacity: 0.15,
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(217, 93, 57, 0.35) 0%, transparent 60%)`,
        transition: 'opacity 0.2s ease',
      });
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    });
    setGlareStyle({ opacity: 0, transition: 'opacity 0.4s ease' });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
      className={`relative rounded-3xl overflow-hidden bg-white dark:bg-ink-850 border border-stone-200 dark:border-ink-750 text-stone-900 dark:text-parchment-100 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Dynamic Specular Glare Layer */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 rounded-3xl"
          style={glareStyle}
        />
      )}
      <div className="relative z-0 h-full">{children}</div>
    </div>
  );
};

export default StudioTiltCard;
