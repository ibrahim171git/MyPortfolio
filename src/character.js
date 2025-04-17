import * as THREE from 'three';
import { FBXLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

console.log("character.js")

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('threeView');
  console.log(container)
  if (!container) {
    return
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = -.4;
  camera.position.y = .3;
  camera.position.x = .2;
  camera.lookAt(0, 0, 0);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
  scene.add(ambientLight);


  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight.position.set(5, 10, 0);
  scene.add(directionalLight);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  let loader = new GLTFLoader();
  let mixer;
  let model;
  let action;
  let anim = true;

  loader.load(
    './public/models/characterModel.glb',
    (gltf) => {
      model = gltf.scene;
      scene.add(model);

      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        const clip = gltf.animations[0];
        action = mixer.clipAction(clip);
        action.play();

        const animButton = document.querySelector(".animation-button");
        animButton.addEventListener('click', () => {
          
          if (anim) {
            console.log("Pause animation");
            action.paused = true;
            animButton.innerHTML = `start animation`
          } else {
            console.log("Resume animation");
            animButton.innerHTML = `stop animation`
            action.paused = false;
          }
          anim = !anim;
        });
      }
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
      console.error('An error happened while loading the model:', error);
    }
  );


  // Orbit Controls
  const control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
  control.update();



  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });

  const clock = new THREE.Clock();



  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    control.update();

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

  }

  animate();
})


