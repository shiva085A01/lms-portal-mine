import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Layers, RotateCw, Eye, Zap } from 'lucide-react';

/**
 * Interactive 3D Study Object Component (Three.js WebGL)
 * Inspired by ThreeUI, CGTrader & React Bits
 * Interactive dimensional learning object with real-time lighting, orbital particles, and material modes.
 */
export const Interactive3DStudyObject = ({
  className = '',
  height = '380px',
  interactive = true,
  defaultMode = 'prism', // 'prism' | 'neural' | 'torus'
}) => {
  const containerRef = useRef(null);
  const [activeMode, setActiveMode] = useState(defaultMode);
  const [wireframe, setWireframe] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [hovered, setHovered] = useState(false);
  const sceneRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let renderer, scene, camera, mesh, wireframeMesh, ringMesh, particleSystem;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const loadThreeAndInit = async () => {
      const container = containerRef.current;
      if (!container) return;

      // Ensure window.THREE is available
      if (!window.THREE) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      const THREE = window.THREE;
      if (!THREE || !container) return;

      const width = container.clientWidth || 400;
      const height = container.clientHeight || 380;

      // Scene & Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 4.2;

      // Renderer
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      // Clear container and append
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

      // Lighting: Warm studio light rig
      const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.9);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xf59e0b, 2.2); // Warm Amber
      keyLight.position.set(5, 5, 4);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xd95d39, 3.0); // Terracotta
      rimLight.position.set(-5, -3, -2);
      scene.add(rimLight);

      const accentLight = new THREE.PointLight(0xe76f51, 1.8, 10);
      accentLight.position.set(0, 3, 2);
      scene.add(accentLight);

      // Geometry according to mode
      let geometry;
      if (activeMode === 'neural') {
        geometry = new THREE.IcosahedronGeometry(1.2, 2);
      } else if (activeMode === 'torus') {
        geometry = new THREE.TorusKnotGeometry(0.85, 0.28, 100, 16);
      } else {
        geometry = new THREE.DodecahedronGeometry(1.25, 1);
      }

      // Main Material: Warm terracotta crystal
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xd95d39,
        emissive: 0x5c1d0c,
        roughness: 0.15,
        metalness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.92,
        wireframe: wireframe,
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Outer Wireframe Cage
      const wireGeo = new THREE.IcosahedronGeometry(1.48, 1);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      });
      wireframeMesh = new THREE.Mesh(wireGeo, wireMat);
      scene.add(wireframeMesh);

      // Orbital Ring
      const ringGeo = new THREE.TorusGeometry(1.75, 0.015, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xe76f51,
        transparent: true,
        opacity: 0.45,
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      scene.add(ringMesh);

      // Ambient Floating Spark Particles
      const particleCount = 60;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 5;
        positions[i + 1] = (Math.random() - 0.5) * 5;
        positions[i + 2] = (Math.random() - 0.5) * 4;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xf59e0b,
        size: 0.04,
        transparent: true,
        opacity: 0.6,
      });
      particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Mouse & Touch Tracking
      const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      };

      if (interactive) {
        container.addEventListener('mousemove', handleMouseMove);
      }

      // Render Loop
      let clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        if (isRotating) {
          mesh.rotation.y += 0.008;
          mesh.rotation.x += 0.004;
          wireframeMesh.rotation.y -= 0.005;
          wireframeMesh.rotation.z += 0.003;
          ringMesh.rotation.z += 0.006;
          particleSystem.rotation.y += 0.002;
        }

        // Mouse Parallax Lerp
        targetRotationY = mouseX * 0.8;
        targetRotationX = -mouseY * 0.8;
        mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.04;
        mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.04;

        // Subtle Float
        mesh.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
        wireframeMesh.position.y = Math.sin(elapsedTime * 1.5 + 0.5) * 0.06;

        renderer.render(scene, camera);
      };

      animate();

      // Resize Listener
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };
      window.addEventListener('resize', handleResize);

      sceneRef.current = { renderer, cleanup: () => {
        window.removeEventListener('resize', handleResize);
        if (interactive) container.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
      }};
    };

    loadThreeAndInit();

    return () => {
      if (sceneRef.current?.cleanup) {
        sceneRef.current.cleanup();
      }
    };
  }, [activeMode, wireframe, isRotating, interactive]);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden studio-card border border-white/10 bg-gradient-to-b from-[#1c1917]/90 to-[#121110]/95 p-4 flex flex-col justify-between select-none ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Controls Overlay */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-parchment/90 font-mono">
            3D Studio Object
          </span>
        </div>

        {/* Tactile Mode Pills */}
        <div className="flex items-center gap-1 bg-[#161412] p-0.5 rounded-lg border border-white/10 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveMode('prism')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
              activeMode === 'prism'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Prism
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('neural')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
              activeMode === 'neural'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Neural
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('torus')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
              activeMode === 'torus'
                ? 'bg-terracotta-500 text-white shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Torus
          </button>
        </div>
      </div>

      {/* WebGL Canvas Container */}
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing flex items-center justify-center relative my-2"
      >
        {/* Fallback while WebGL is initializing */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-stone-500 font-mono">
          Interactive Canvas
        </div>
      </div>

      {/* Bottom Tactile Utilities */}
      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/5 text-xs text-stone-400">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            className={`flex items-center gap-1 hover:text-terracotta-400 transition-colors ${
              wireframe ? 'text-amber-400 font-semibold' : ''
            }`}
            title="Toggle Wireframe"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wireframe</span>
          </button>
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`flex items-center gap-1 hover:text-terracotta-400 transition-colors ${
              !isRotating ? 'text-amber-400 font-semibold' : ''
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
            <span>{isRotating ? 'Spinning' : 'Paused'}</span>
          </button>
        </div>

        <span className="text-[10px] font-mono text-stone-500">Drag / Hover to Inspect</span>
      </div>
    </div>
  );
};

export default Interactive3DStudyObject;
