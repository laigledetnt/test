import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { world } from './physics.js';

export let playerBody;

let isOnGround = false;
let lastGroundContact = 0; // 🔥 Stocke le dernier moment où le joueur a touché le sol

// 📌 Création du joueur avec une boîte solide
playerBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.2, 0.3, 0.2)), // ✅ Taille ajustée
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
const groundSpeed = 45;
const airSpeed = 5;
const jumpForce = 14;
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
    if (timeSinceLastContact < 15) {
        isOnGround = true;
    } else if (playerBody.velocity.y < -0.9) {
        isOnGround = false;
    }
}

// 📌 Mise à jour du mouvement avec alignement sur la caméra
export function updatePlayer(camera) {
    if (!camera) return;

    checkIfOnGround(); // ✅ Vérifie si le joueur est en l'air

    let speed = isOnGround ? groundSpeed : airSpeed;
    let moveDirection = new THREE.Vector3();
    let moveX = 0, moveZ = 0;

    if (keys['KeyW']) moveZ += 0.01;
    if (keys['KeyS']) moveZ -= 0.01;
    if (keys['KeyA']) moveX -= 0.01;
    if (keys['KeyD']) moveX += 0.01;

    if (moveX !== 0 || moveZ !== 0) {
        moveDirection.set(moveX, 0, moveZ).normalize(); // ✅ Normalisation avant rotation

        // ✅ Appliquer la rotation de la caméra mais garder le déplacement au sol
        let camDirection = new THREE.Vector3();
        camera.getWorldDirection(camDirection);
        camDirection.y = 0; // ✅ Ne pas affecter la vitesse verticale
        camDirection.normalize();

        let right = new THREE.Vector3().crossVectors(camDirection, new THREE.Vector3(0, 1, 0)).normalize();

        // ✅ Recalculer le mouvement en fonction de la caméra
        let finalMove = new THREE.Vector3();
        finalMove.addScaledVector(camDirection, moveDirection.z);
        finalMove.addScaledVector(right, moveDirection.x);
        finalMove.normalize().multiplyScalar(speed); // ✅ Garder une vitesse constante

        // ✅ Appliquer un déplacement fluide sans boost
        playerBody.velocity.x = finalMove.x;
        playerBody.velocity.z = finalMove.z;
    } 

    // ✅ Limiter la vitesse de chute uniquement sur Y
    const maxFallSpeed = -40;
    if (playerBody.velocity.y < maxFallSpeed) {
        playerBody.velocity.y = maxFallSpeed;
    }

    // 🚀 **Correction avancée : empêcher le boost des arêtes**
    playerBody.addEventListener("collide", (event) => {
        if (event.body.mass === 0) { // ✅ Vérifier que c'est un objet statique
            let contactNormal = event.contact.ni; // ✅ Normal du contact

            // 🚀 **Si le contact est presque horizontal, éviter les boosts**
            if (Math.abs(contactNormal.y) < 0.5) { 
                playerBody.velocity.x *= 0.2; // 🔥 Réduction massive du boost
                playerBody.velocity.z *= 0.2;
            }
        }
    });

    // ✅ Correction finale : Stabilisation en atterrissant
    if (isOnGround) {
        playerBody.velocity.x *= 0.85; // 🔥 Réduction progressive pour éviter tout glissement
        playerBody.velocity.z *= 0.85;
    }
}
