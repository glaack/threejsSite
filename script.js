import * as THREE from 'https://cdn.skypack.dev/three@0.160.0';

let scene, camera, renderer, earth;
let zoomTarget = 10;

init();
animate();

function init() {
  // Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Starfield background
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 10000;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 2000;
  }
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // Low-poly Earth
  const geometry = new THREE.IcosahedronGeometry(5, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x3366ff,
    flatShading: true,
  });
  earth = new THREE.Mesh(geometry, material);
  scene.add(earth);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Resize support
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Scroll Zoom
  window.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) {
      zoomTarget = Math.max(5, zoomTarget - 1);
    } else {
      zoomTarget = Math.min(50, zoomTarget + 1);
    }
  });
}

function animate() {
  requestAnimationFrame(animate);

  camera.position.z += (zoomTarget - camera.position.z) * 0.05;
  earth.rotation.y += 0.002;

  renderer.render(scene, camera);
}
