import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Globe, Sparkles, RotateCw, Compass, Zap } from 'lucide-react';

/**
 * High-Performance Three.js Interactive 3D Globe Component
 * Real-time 3D spherical mesh, dynamic orbital particle rings, pulsating city nodes,
 * and mouse-controlled rotation with dual Light/Dark theme support.
 */
export const ThreeGlobeHero = ({ className = '', height = '460px' }) => {
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    let animationFrameId;
    let renderer, scene, camera;
    let globeGroup, globeMesh, atmosphereMesh, ringsGroup, particlesMesh, markersGroup;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const initGlobe = async () => {
      const container = containerRef.current;
      if (!container) return;

      // Ensure THREE is loaded
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

      const width = container.clientWidth || 500;
      const h = container.clientHeight || 460;

      // 1. Scene & Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 1000);
      camera.position.z = 5.2;

      // 2. Renderer
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

      // 3. Globe Container Group
      globeGroup = new THREE.Group();
      scene.add(globeGroup);

      // Colors based on current theme
      const primaryColor = isDark ? 0xd95d39 : 0xc54e2b; // Terracotta
      const secondaryColor = isDark ? 0xf59e0b : 0xd97706; // Amber
      const wireColor = isDark ? 0x44352a : 0xd6c4b2;
      const coreColor = isDark ? 0x181513 : 0xffffff;

      // 4. Central Sphere (Globe Core)
      const coreGeo = new THREE.SphereGeometry(1.65, 48, 48);
      const coreMat = new THREE.MeshPhongMaterial({
        color: coreColor,
        transparent: true,
        opacity: isDark ? 0.85 : 0.95,
        shininess: 40,
        emissive: isDark ? 0x22130c : 0xfaebd7,
      });
      globeMesh = new THREE.Mesh(coreGeo, coreMat);
      globeGroup.add(globeMesh);

      // 5. Wireframe Latitude/Longitude Grid
      const wireGeo = new THREE.SphereGeometry(1.66, 24, 24);
      const wireMat = new THREE.MeshBasicMaterial({
        color: wireColor,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.35 : 0.45,
      });
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      globeGroup.add(wireMesh);

      // 6. Glowing Atmospheric Shell
      const atmosGeo = new THREE.SphereGeometry(1.76, 32, 32);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        transparent: true,
        opacity: isDark ? 0.12 : 0.08,
        wireframe: true,
      });
      atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
      globeGroup.add(atmosphereMesh);

      // 7. Orbital Particle Cloud & Floating Data Nodes
      const particleCount = 280;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleColors = new Float32Array(particleCount * 3);

      const color1 = new THREE.Color(primaryColor);
      const color2 = new THREE.Color(secondaryColor);

      for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        const radius = 1.72 + (Math.random() * 0.45);

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        const mixedColor = Math.random() > 0.5 ? color1 : color2;
        particleColors[i * 3] = mixedColor.r;
        particleColors[i * 3 + 1] = mixedColor.g;
        particleColors[i * 3 + 2] = mixedColor.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: isDark ? 0.065 : 0.055,
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.9 : 0.8,
      });
      particlesMesh = new THREE.Points(particleGeo, particleMat);
      globeGroup.add(particlesMesh);

      // 8. Tilted Orbital Data Rings (Equatorial & Polar)
      ringsGroup = new THREE.Group();
      globeGroup.add(ringsGroup);

      const ring1Geo = new THREE.RingGeometry(2.1, 2.14, 64);
      const ring1Mat = new THREE.MeshBasicMaterial({
        color: secondaryColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isDark ? 0.4 : 0.5,
      });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1.rotation.x = Math.PI / 2.5;
      ring1.rotation.y = Math.PI / 6;
      ringsGroup.add(ring1);

      const ring2Geo = new THREE.RingGeometry(2.35, 2.37, 64);
      const ring2Mat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isDark ? 0.25 : 0.35,
      });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = -Math.PI / 3;
      ringsGroup.add(ring2);

      // 9. Hotspot LMS Hub Markers (Connected Nodes)
      markersGroup = new THREE.Group();
      globeGroup.add(markersGroup);

      const hubLocations = [
        { lat: 37.77, lon: -122.41 }, // San Francisco
        { lat: 51.50, lon: -0.12 },   // London
        { lat: 35.67, lon: 139.65 },  // Tokyo
        { lat: 12.97, lon: 77.59 },   // Bengaluru
        { lat: -33.86, lon: 151.20 }, // Sydney
        { lat: 48.85, lon: 2.35 },    // Paris
        { lat: 1.35, lon: 103.81 },   // Singapore
      ];

      hubLocations.forEach((loc) => {
        const latRad = (loc.lat * Math.PI) / 180;
        const lonRad = (-loc.lon * Math.PI) / 180;
        const r = 1.67;

        const x = r * Math.cos(latRad) * Math.cos(lonRad);
        const y = r * Math.sin(latRad);
        const z = r * Math.cos(latRad) * Math.sin(lonRad);

        const markerGeo = new THREE.SphereGeometry(0.045, 12, 12);
        const markerMat = new THREE.MeshBasicMaterial({ color: secondaryColor });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.position.set(x, y, z);
        markersGroup.add(marker);

        // Pulsing Spike / Beam
        const spikeGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.25, 8);
        const spikeMat = new THREE.MeshBasicMaterial({ color: primaryColor });
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(x * 1.07, y * 1.07, z * 1.07);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x, y, z).normalize());
        markersGroup.add(spike);
      });

      // 10. Lights
      const ambientLight = new THREE.AmbientLight(isDark ? 0xfff5ea : 0xffffff, isDark ? 1.2 : 1.5);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(secondaryColor, 2.5);
      keyLight.position.set(5, 4, 3);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(primaryColor, 3.0);
      fillLight.position.set(-5, -3, -2);
      scene.add(fillLight);

      // 11. Mouse Interaction Handler
      const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        mouseX = (clientX / width) * 2 - 1;
        mouseY = -(clientY / h) * 2 + 1;
      };

      container.addEventListener('mousemove', handleMouseMove);

      // 12. Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Continuous idle rotation
        globeGroup.rotation.y += 0.004;

        // Subtle mouse parallax rotation
        targetRotationY = mouseX * 0.75;
        targetRotationX = -mouseY * 0.45;

        globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.05;
        globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;

        // Counter-rotate rings & particles
        if (ringsGroup) {
          ringsGroup.rotation.z = elapsedTime * 0.06;
        }
        if (particlesMesh) {
          particlesMesh.rotation.y = -elapsedTime * 0.02;
        }

        renderer.render(scene, camera);
      };

      animate();

      // Handle Resize
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const newW = container.clientWidth || 400;
        const newH = container.clientHeight || 400;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        container.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (renderer && renderer.domElement) {
          renderer.dispose();
        }
      };
    };

    const cleanup = initGlobe();

    return () => {
      cleanup.then((fn) => fn && fn());
    };
  }, [theme, isDark]);

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-stone-200 dark:border-ink-800 bg-white/70 dark:bg-ink-900/80 backdrop-blur-xl shadow-xl flex flex-col justify-between select-none ${className}`}
      style={{ minHeight: height }}
    >
      {/* Top Floating Badge */}
      <div className="relative z-10 p-5 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-500/10 border border-terracotta-500/20 text-terracotta-700 dark:text-terracotta-300 text-xs font-semibold font-mono">
          <Globe className="w-3.5 h-3.5 text-terracotta-500 animate-spin" style={{ animationDuration: '12s' }} />
          <span>Interactive 3D Knowledge Globe</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-ink-800 px-2.5 py-1 rounded-xl border border-stone-200 dark:border-ink-700">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>WebGL 60 FPS</span>
        </div>
      </div>

      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Bottom Floating Control Overlay */}
      <div className="relative z-10 p-5 flex items-center justify-between pointer-events-none">
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-stone-900 dark:text-parchment-50 font-serif">Global Learning Network</p>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">Drag or move mouse to rotate 3D nodes</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Live Orbit</span>
        </div>
      </div>
    </div>
  );
};

export default ThreeGlobeHero;
