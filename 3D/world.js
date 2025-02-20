import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';
import { world } from './physics.js';
import { camera } from './main.js';


const items = [];
const buttons = {};
const walls = {};
let activatedButtons = 0;
let requiredButtons = 0;

// 📌 Charger le monde 3D et ajouter des collisions
export function loadWorld(scene) {
    const loader = new GLTFLoader();
    loader.load('world.glb', (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        model.traverse((child) => {
            if (child.isMesh) {
                console.log("📦 Ajout de collision à :", child.name);

                // ✅ Générer un mur au-dessus de chaque `p_X`
                if (child.name.startsWith("p_")) {
                    const number = child.name.split("_")[1];

                    const wallGeometry = new THREE.BoxGeometry(2, 4, 0.5);
                    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
                    wallMesh.position.set(child.position.x, child.position.y + 4, child.position.z);
                    scene.add(wallMesh);

                    const wallShape = new CANNON.Box(new CANNON.Vec3(1, 2, 0.25));
                    const wallBody = new CANNON.Body({ mass: 0, shape: wallShape });
                    wallBody.position.set(child.position.x, child.position.y + 4, child.position.z);
                    world.addBody(wallBody);

                    walls[number] = { mesh: wallMesh, body: wallBody };
                    requiredButtons++;
                } 
                
                // ✅ Détecter les boutons `b_X`
                else if (child.name.startsWith("b_")) {
                    const number = child.name.split("_")[1];

                    const buttonGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.5);
                    const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
                    const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
                    buttonMesh.position.copy(child.position);
                    scene.add(buttonMesh);

                    buttons[number] = { mesh: buttonMesh, activated: false };
                } 
                
                // ✅ Générer des collisions pour les autres objets
                else {
                    const bbox = new THREE.Box3().setFromObject(child);
                    const size = new THREE.Vector3();
                    bbox.getSize(size);
                    const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
                    const body = new CANNON.Body({ mass: 0, shape });
                    body.position.copy(child.position);
                    world.addBody(body);
                }
            }
        });
    });
}

// 📌 Vérifier si le joueur clique sur un bouton
function onMouseClick(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // ✅ Calculer la position du clic
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const buttonMeshes = Object.values(buttons).map(btn => btn.mesh);
    const intersects = raycaster.intersectObjects(buttonMeshes);

    if (intersects.length > 0) {
        const clickedButton = intersects[0].object;
        for (let key in buttons) {
            if (buttons[key].mesh === clickedButton && !buttons[key].activated) {
                console.log(`🟢 Bouton ${key} activé !`);
                buttons[key].activated = true;
                activatedButtons++;

                // ✅ Changer la couleur du bouton pour indiquer qu'il est activé
                buttons[key].mesh.material.color.set(0xffff00);
            }
        }
    }

    // ✅ Si tous les boutons sont activés, ouvrir les murs
    if (activatedButtons === requiredButtons) {
        console.log("🚪 Tous les boutons sont activés, ouverture des murs !");
        for (let key in walls) {
            let wall = walls[key];
            wall.mesh.visible = false;  // ✅ Cache le mur
            world.removeBody(wall.body);
        }
    }
}

// ✅ Ajouter un écouteur pour détecter les clics
window.addEventListener("click", onMouseClick);
