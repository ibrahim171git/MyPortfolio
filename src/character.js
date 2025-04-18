import * as THREE from "three";
import { FBXLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AxesHelper } from "three";

document.addEventListener("DOMContentLoaded", () => {
 
  const container = document.getElementById("threeView");

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.01,
    10000
  );
  camera.position.z = -.5;
  camera.position.y = .08;
  camera.position.x = 0.72;
  camera.lookAt(0,0.2,0)


 const handleResize = () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
 
};

window.addEventListener("resize", handleResize);


  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
  scene.add(ambientLight);

 
  const directionalLight = new THREE.DirectionalLight(0xffffff,5);
  directionalLight.position.set(5, 10, 0);
  scene.add(directionalLight);
  directionalLight.castShadow = true;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true; 
  container.appendChild(renderer.domElement);


  const control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
  control.target= new THREE.Vector3(0,0.2,0)
  control.autoRotate = true
  control.autoRotateSpeed = 0.5

//add plane 

const plainGeo = new THREE.PlaneGeometry(10,10);
const planeMat = new THREE.MeshStandardMaterial({color:0xfffff})
const planeMesh = new THREE.Mesh(plainGeo,planeMat)
planeMesh.rotation.x=- Math.PI / 2
planeMesh.receiveShadow = true;
scene.add(planeMesh);



  let loader = new GLTFLoader();
  let mixer;
  let model;
  let action;
  let anim = true;

  loader.load(
    "/models/characterModel.glb",
    (gltf) => {
      model = gltf.scene;
      model.castShadow = true;
      scene.add(model);

      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        const clip = gltf.animations[0];
        action = mixer.clipAction(clip);
        action.play();

        const animButton = document.querySelector(".animation-button");
        animButton.addEventListener("click", () => {
          if (anim) {
            control.autoRotate = false
            action.paused = true;
            animButton.innerHTML = `start animation`;
          } else {
            control.autoRotate = true
            animButton.innerHTML = `stop animation`;
            action.paused = false;
          }
          anim = !anim;
        });
      }
    },
  );


  loader.load(
    "/models/trees.glb",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);

});

  // Orbit Controls


  const axesHelper = new THREE.AxesHelper( 5 );
  scene.add( axesHelper );



  const clock = new THREE.Clock();

  function animate() {
    
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    control.update()

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
  }
  animate();
  
});


