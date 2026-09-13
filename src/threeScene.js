import * as THREE from 'three';

export function initThreeScene(canvasContainerId) {
  const container = document.getElementById(canvasContainerId);
  if (!container) return;

  const width = container.clientWidth || 400;
  const height = container.clientHeight || 500;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 8.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  container.appendChild(renderer.domElement);

  // 2. Lights
  const ambientLight = new THREE.AmbientLight(0xfff3db, 0.9);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xfff7e6, 2.2);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const amberLight = new THREE.PointLight(0xd4a373, 3.5, 12);
  amberLight.position.set(-3, 1, 3);
  scene.add(amberLight);

  const rimLight = new THREE.DirectionalLight(0xffd700, 1.8);
  rimLight.position.set(-5, -2, -5);
  scene.add(rimLight);

  // 3. 3D Oil Bottle Group
  const bottleGroup = new THREE.Group();
  scene.add(bottleGroup);

  // Glass Bottle Profile (Lathe Geometry)
  const points = [];
  // Base
  points.push(new THREE.Vector2(0.001, -2.0));
  points.push(new THREE.Vector2(1.15, -2.0));
  points.push(new THREE.Vector2(1.2, -1.9));
  // Body straight
  points.push(new THREE.Vector2(1.2, 0.4));
  // Shoulder curve
  points.push(new THREE.Vector2(1.1, 0.8));
  points.push(new THREE.Vector2(0.7, 1.3));
  points.push(new THREE.Vector2(0.48, 1.6));
  // Neck
  points.push(new THREE.Vector2(0.48, 2.2));
  // Lip
  points.push(new THREE.Vector2(0.55, 2.3));
  points.push(new THREE.Vector2(0.55, 2.45));
  points.push(new THREE.Vector2(0.44, 2.45));

  const bottleGeometry = new THREE.LatheGeometry(points, 48);

  // Outer Glass Material
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.92,
    opacity: 1,
    transparent: true,
    roughness: 0.12,
    metalness: 0.05,
    ior: 1.52,
    thickness: 0.8,
    specularIntensity: 1.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  const glassMesh = new THREE.Mesh(bottleGeometry, glassMaterial);
  glassMesh.castShadow = true;
  glassMesh.receiveShadow = true;
  bottleGroup.add(glassMesh);

  // Inner Liquid Geometry
  const liquidPoints = [];
  liquidPoints.push(new THREE.Vector2(0.001, -1.94));
  liquidPoints.push(new THREE.Vector2(1.12, -1.94));
  liquidPoints.push(new THREE.Vector2(1.14, 0.4));
  liquidPoints.push(new THREE.Vector2(1.04, 0.76));
  liquidPoints.push(new THREE.Vector2(0.66, 1.25));
  liquidPoints.push(new THREE.Vector2(0.44, 1.5));
  liquidPoints.push(new THREE.Vector2(0.001, 1.5)); // Liquid fill level

  const liquidGeometry = new THREE.LatheGeometry(liquidPoints, 48);

  // Liquid Material
  const liquidMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4a373, // Default Mustard Gold
    roughness: 0.2,
    metalness: 0.1,
    emissive: 0x7a6345,
    emissiveIntensity: 0.3
  });

  const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
  bottleGroup.add(liquidMesh);

  // Wooden Cork Cap
  const capGeo = new THREE.CylinderGeometry(0.52, 0.48, 0.5, 32);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0xa89f8f,
    roughness: 0.8,
    metalness: 0.1
  });
  const capMesh = new THREE.Mesh(capGeo, capMat);
  capMesh.position.y = 2.65;
  bottleGroup.add(capMesh);

  // Brand Label Cylinder
  const labelGeo = new THREE.CylinderGeometry(1.21, 1.21, 1.4, 48, 1, true, 0, Math.PI * 1.6);
  const canvasLabel = document.createElement('canvas');
  canvasLabel.width = 1024;
  canvasLabel.height = 512;
  const ctx = canvasLabel.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.strokeStyle = '#b88655';
  ctx.lineWidth = 12;
  ctx.strokeRect(30, 30, 964, 452);

  const img = new Image();
  img.src = '/assets/logo.webp';
  img.onload = () => {
    // Logo is roughly square/circle, draw it nicely centered
    const imgWidth = 320;
    const imgHeight = (img.height / img.width) * imgWidth;
    ctx.drawImage(img, 512 - imgWidth / 2, 256 - imgHeight / 2 - 40, imgWidth, imgHeight);
    
    ctx.fillStyle = '#a9b388';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('100% WOOD COLD PRESSED', 512, 410);

    ctx.fillStyle = '#c08552';
    ctx.font = '24px sans-serif';
    ctx.fillText('Unrefined • Natural • FSSAI Certified', 512, 450);
    
    if (typeof labelTexture !== 'undefined') {
      labelTexture.needsUpdate = true;
    }
  };

  const labelTexture = new THREE.CanvasTexture(canvasLabel);
  const labelMat = new THREE.MeshBasicMaterial({
    map: labelTexture,
    side: THREE.DoubleSide
  });

  const labelMesh = new THREE.Mesh(labelGeo, labelMat);
  labelMesh.position.y = -0.5;
  labelMesh.rotation.y = Math.PI * 1.2;
  bottleGroup.add(labelMesh);

  // 4. Floating Seed & Golden Particle System
  const particleCount = 100;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    scales[i] = Math.random() * 0.15 + 0.05;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xd4a373,
    size: 0.12,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // 5. Mouse Parallax & Smooth Rotation Logic
  let targetRotationY = 0;
  let targetRotationX = 0;
  let mouseX = 0;
  let mouseY = 0;

  function onMouseMove(e) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX = (x / rect.width - 0.5) * 2;
    mouseY = (y / rect.height - 0.5) * 2;
  }

  window.addEventListener('mousemove', onMouseMove);

  // 6. Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Floating idle bottle movement
    bottleGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;
    bottleGroup.rotation.y += 0.005;

    // Smooth tilt to mouse
    targetRotationY = mouseX * 0.4;
    targetRotationX = mouseY * 0.2;
    bottleGroup.rotation.y += (targetRotationY - bottleGroup.rotation.y) * 0.05;
    bottleGroup.rotation.x += (targetRotationX - bottleGroup.rotation.x) * 0.05;

    // Animate Floating Seed Particles
    const pos = particleGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.003 + 0.002;
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -4;
    }
    particleGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Public method to transition oil color
  return {
    setOilColor: (hexColor) => {
      const targetColor = new THREE.Color(hexColor);
      liquidMaterial.color = targetColor;
      amberLight.color = targetColor;
    }
  };
}
