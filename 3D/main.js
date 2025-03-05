import * as THREE from 'three';
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
export { camera };

import { initPhysics, world } from './physics.js';
import { playerBody, updatePlayer } from './player.js';
import { loadWorld, checkItemCollection } from './world.js';



// 📌 Création de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 0);

// 📌 Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 📌 Lumières
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// 📌 Contrôles FPS
const controls = new PointerLockControls(camera, document.body);
document.getElementById("startButton").addEventListener("click", () => {
    controls.lock();
    document.getElementById("startButton").style.display = "none";
});

// 📌 Initialisation de la physique et du monde
initPhysics();
loadWorld(scene);

// 📌 Boucle d’animation
function animate() {
    requestAnimationFrame(animate);
    world.step(1 / 60);
    updatePlayer(camera);

    // ✅ Correction : Ajuster la hauteur de la caméra pour qu'elle soit bien au centre du joueur
    camera.position.set(
        playerBody.position.x, 
        playerBody.position.y + 1, // ✅ Ajusté pour éviter l'effet "collé au plafond"
        playerBody.position.z
    );

    checkItemCollection(scene);
    renderer.render(scene, camera);
}
animate();
