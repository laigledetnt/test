import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { world } from './physics.js';

export let playerBody;

let isOnGround = false;
let lastGroundContact = 0; // 🔥 Stocke le dernier moment où le joueur a touché le sol

// 📌 Création du joueur avec une boîte solide
playerBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.3, 0.7, 0.3)), // ✅ Taille ajustée
    position: new CANNON.Vec3(0, 11, 0), // ✅ Spawn
    fixedRotation: true
});
world.addBody(playerBody);

// 📌 Détection des collisions avec le sol
playerBody.addEventListener("collide", (event) => {
    if (event.body.mass === 0) { // ✅ Vérifie que c'est un objet statique (sol/mur)
        isOnGround = true;
        lastGroundContact = performance.now(); // 🔥 Stocke le moment du dernier contact
    }
});

// 📌 Déplacement du joueur
const groundSpeed = 27;
const airSpeed = 5;
const jumpForce = 10;
let keys = {};

// 📌 Gestion des touches
document.addEventListener('keydown', (event) => {
    keys[event.code] = true;

    // ✅ Saut uniquement si `isOnGround` est vrai
    if (event.code === "Space" && isOnGround) {
        playerBody.velocity.y = jumpForce;
        isOnGround = false;
    }
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// 📌 Vérifier si le joueur quitte le sol
function checkIfOnGround() {
    let timeSinceLastContact = performance.now() - lastGroundContact;

    // 🔥 Si le joueur a touché un objet solide dans les 200ms, il est encore au sol
    if (timeSinceLastContact < 10) {
        isOnGround = true;
    } else if (playerBody.velocity.y < -0.1) {
        isOnGround = false;
    }
}

// 📌 Mise à jour du mouvement avec alignement sur la caméra
export function updatePlayer(camera) {
    if (!camera) return;

    checkIfOnGround(); // ✅ Vérifie si le joueur est en l'air

    let speed = isOnGround ? groundSpeed : airSpeed;
    let moveDirection = new THREE.Vector3();

    if (keys['KeyW']) moveDirection.z -= 1;
    if (keys['KeyS']) moveDirection.z += 1;
    if (keys['KeyA']) moveDirection.x -= 1;
    if (keys['KeyD']) moveDirection.x += 1;

    if (moveDirection.length() > 0) {
        moveDirection.normalize();

        // ✅ Appliquer la rotation de la caméra pour aligner les déplacements
        moveDirection.applyQuaternion(camera.quaternion);
        moveDirection.y = 0; // ✅ Empêche le joueur de bouger verticalement

        playerBody.velocity.set(
            moveDirection.x * speed, 
            playerBody.velocity.y, 
            moveDirection.z * speed
        );
    }
}
