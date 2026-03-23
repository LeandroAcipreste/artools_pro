export const initSphere3D = () => {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  if (typeof THREE === "undefined") {
    console.error("Three.js não foi carregado.");
    return;
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xF5F5F7, 0.04);
  
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 20);
  
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const objectGroup = new THREE.Group();
  scene.add(objectGroup);

  const geometry = new THREE.IcosahedronGeometry(7, 40);
  const uniforms = {
    uTime: { value: 0 },
    uDistortion: { value: 0.15 },
    uSize: { value: 1.6 },
    uColor: { value: new THREE.Color('#111111') },
    uMouse: { value: new THREE.Vector2(0, 0) }
  };

  const vertexShaderEl = document.getElementById('vertexShader');
  const fragmentShaderEl = document.getElementById('fragmentShader');

  if (!vertexShaderEl || !fragmentShaderEl) return;

  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShaderEl.textContent,
    fragmentShader: fragmentShaderEl.textContent,
    uniforms: uniforms,
    transparent: true,
    blending: THREE.NormalBlending
  });
  
  const points = new THREE.Points(geometry, material);
  objectGroup.add(points);

  let time = 0;
  let mouseX = 0, mouseY = 0;
  let basePosX = 0, basePosY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    uniforms.uMouse.value.x += (mouseX - uniforms.uMouse.value.x) * 0.03;
    uniforms.uMouse.value.y += (mouseY - uniforms.uMouse.value.y) * 0.03;
  });

  function adjustLayout() {
    const w = window.innerWidth;
    if (w < 1024) {
      basePosX = 0;
      basePosY = 2;
      objectGroup.position.set(basePosX, basePosY, -10);
      objectGroup.scale.set(0.6, 0.6, 0.6);
    } else {
      basePosX = -6;
      basePosY = 0;
      objectGroup.position.set(basePosX, basePosY, 0);
      objectGroup.scale.set(0.8, 0.8, 0.8);
    }
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    adjustLayout();
  });

  adjustLayout();

  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    const targetRotX = mouseY * 0.6;
    const targetRotY = (time * 0.1) + (mouseX * 0.6);
    const targetPosX = basePosX + (mouseX * 2);
    const targetPosY = basePosY + (mouseY * 2);

    objectGroup.rotation.x += (targetRotX - objectGroup.rotation.x) * 0.05;
    objectGroup.rotation.y += (targetRotY - objectGroup.rotation.y) * 0.05;
    objectGroup.position.x += (targetPosX - objectGroup.position.x) * 0.05;
    objectGroup.position.y += (targetPosY - objectGroup.position.y) * 0.05;

    uniforms.uTime.value = time;
    renderer.render(scene, camera);
  }
  
  animate();
};
