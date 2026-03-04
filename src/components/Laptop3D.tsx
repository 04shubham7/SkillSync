"use client";

import { useEffect, useRef } from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshStandardMaterial,
  Group,
  PlaneGeometry,
  DoubleSide,
  PointLight,
  MeshPhysicalMaterial,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  AdditiveBlending,
  Points
} from 'three';

import './Laptop3D.css';

interface Laptop3DProps {
  size?: number;
  rotationSpeed?: number;
  floatSpeed?: number;
  screenGlow?: boolean;
}

export default function Laptop3D({
  size = 1,
  rotationSpeed = 0.3,
  floatSpeed = 0.5,
  screenGlow = true
}: Laptop3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new Scene();

    const camera = new PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const backLight = new DirectionalLight(0x6366f1, 0.4);
    backLight.position.set(-5, 3, -5);
    scene.add(backLight);

    // Create laptop group
    const laptopGroup = new Group();
    scene.add(laptopGroup);

    // Laptop base (keyboard area)
    const baseGeometry = new BoxGeometry(2.4 * size, 0.08 * size, 1.6 * size);
    const baseMaterial = new MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2
    });
    const base = new Mesh(baseGeometry, baseMaterial);
    base.position.y = 0;
    laptopGroup.add(base);

    // Keyboard area (darker inset)
    const keyboardGeometry = new BoxGeometry(2.2 * size, 0.02 * size, 1.4 * size);
    const keyboardMaterial = new MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.3,
      roughness: 0.8
    });
    const keyboard = new Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.position.y = 0.05 * size;
    keyboard.position.z = -0.05 * size;
    laptopGroup.add(keyboard);

    // Laptop screen back
    const screenBackGeometry = new BoxGeometry(2.4 * size, 1.5 * size, 0.08 * size);
    const screenBackMaterial = new MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2
    });
    const screenBack = new Mesh(screenBackGeometry, screenBackMaterial);
    screenBack.position.y = 0.79 * size;
    screenBack.position.z = -0.76 * size;
    screenBack.rotation.x = -Math.PI * 0.05;
    laptopGroup.add(screenBack);

    // Laptop screen (glowing)
    const screenGeometry = new PlaneGeometry(2.2 * size, 1.3 * size);
    const screenMaterial = new MeshStandardMaterial({
      color: screenGlow ? 0x3b82f6 : 0x1e3a8a,
      emissive: screenGlow ? 0x3b82f6 : 0x1e3a8a,
      emissiveIntensity: screenGlow ? 0.6 : 0.2,
      side: DoubleSide,
      metalness: 0.1,
      roughness: 0.2
    });
    const screen = new Mesh(screenGeometry, screenMaterial);
    screen.position.y = 0.79 * size;
    screen.position.z = -0.72 * size;
    screen.rotation.x = -Math.PI * 0.05;
    laptopGroup.add(screen);

    // Add screen glow light
    if (screenGlow) {
      const screenLight = new PointLight(0x3b82f6, 1.5, 5);
      screenLight.position.set(0, 0.79 * size, -0.5 * size);
      laptopGroup.add(screenLight);
    }

    // Code lines on screen (visual detail)
    const createCodeLine = (width: number, xPos: number, yPos: number) => {
      const lineGeometry = new PlaneGeometry(width * size, 0.04 * size);
      const lineMaterial = new MeshStandardMaterial({
        color: 0x60a5fa,
        emissive: 0x60a5fa,
        emissiveIntensity: 0.8,
        side: DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const line = new Mesh(lineGeometry, lineMaterial);
      line.position.set(xPos * size, (0.79 + yPos) * size, -0.71 * size);
      line.rotation.x = -Math.PI * 0.05;
      return line;
    };

    // Add multiple code lines
    const codeLine1 = createCodeLine(1.4, -0.3, 0.3);
    const codeLine2 = createCodeLine(1.8, -0.1, 0.15);
    const codeLine3 = createCodeLine(1.0, -0.5, 0);
    const codeLine4 = createCodeLine(1.6, -0.2, -0.15);
    const codeLine5 = createCodeLine(1.2, -0.4, -0.3);

    laptopGroup.add(codeLine1, codeLine2, codeLine3, codeLine4, codeLine5);

    // Trackpad
    const trackpadGeometry = new PlaneGeometry(0.8 * size, 0.5 * size);
    const trackpadMaterial = new MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.5,
      roughness: 0.6,
      side: DoubleSide
    });
    const trackpad = new Mesh(trackpadGeometry, trackpadMaterial);
    trackpad.position.y = 0.06 * size;
    trackpad.position.z = 0.3 * size;
    trackpad.rotation.x = -Math.PI / 2;
    laptopGroup.add(trackpad);

    // Position laptop group
    laptopGroup.position.y = 0;
    laptopGroup.rotation.y = Math.PI * 0.15;

    // Animation variables
    const clock = { elapsed: 0 };
    let animationId: number;

    // Floating Antigravity Particles
    const particleCount = 100;
    const particlesGeometry = new BufferGeometry();
    const particlesPosition = new Float32Array(particleCount * 3);
    const particlesVelocity = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Random position around the laptop
      particlesPosition[i * 3] = (Math.random() - 0.5) * 10; // x
      particlesPosition[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      particlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 10; // z

      // Upward velocity
      particlesVelocity[i] = Math.random() * 0.02 + 0.01;
    }

    particlesGeometry.setAttribute('position', new BufferAttribute(particlesPosition, 3));

    const particlesMaterial = new PointsMaterial({
      color: 0xa855f7, // purple-500
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: AdditiveBlending
    });

    const particleSystem = new Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock.elapsed += 0.016;

      // Floating animation
      laptopGroup.position.y = Math.sin(clock.elapsed * floatSpeed) * 0.15 * size;

      // Rotation animation
      laptopGroup.rotation.y = Math.PI * 0.15 + Math.sin(clock.elapsed * rotationSpeed) * 0.2;

      // Mouse interaction - subtle tilt
      const targetRotationX = mouseY * 0.1;
      const targetRotationY = Math.PI * 0.15 + mouseX * 0.2;

      laptopGroup.rotation.x += (targetRotationX - laptopGroup.rotation.x) * 0.05;
      laptopGroup.rotation.y += (targetRotationY - laptopGroup.rotation.y) * 0.05;

      // Pulse screen glow
      if (screenGlow && screen.material instanceof MeshStandardMaterial) {
        screen.material.emissiveIntensity = 0.5 + Math.sin(clock.elapsed * 2) * 0.15;
      }

      // Animate particles (Antigravity effect)
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particlesVelocity[i]; // Move up

        // Rotate slowly around center
        const x = positions[i * 3];
        const z = positions[i * 3 + 2];
        positions[i * 3] = x * Math.cos(0.005) - z * Math.sin(0.005);
        positions[i * 3 + 2] = z * Math.cos(0.005) + x * Math.sin(0.005);

        // Reset if too high
        if (positions[i * 3 + 1] > 5) {
          positions[i * 3 + 1] = -5;
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();

      renderer.dispose();
      baseGeometry.dispose();
      baseMaterial.dispose();
      keyboardGeometry.dispose();
      keyboardMaterial.dispose();
      screenBackGeometry.dispose();
      screenBackMaterial.dispose();
      screenGeometry.dispose();
      screenMaterial.dispose();
      trackpadGeometry.dispose();
      trackpadMaterial.dispose();

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [size, rotationSpeed, floatSpeed, screenGlow]);

  return <div ref={containerRef} className="laptop-3d-container" />;
}
