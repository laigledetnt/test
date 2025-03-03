import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';
import { world } from './physics.js';
import { camera } from './main.js';
import { playerBody } from './player.js';
import { TextureLoader } from 'three';

const items = [];
const buttons = {};
const walls = {};
let activatedButtons = 0;
let requiredButtons = 0;
let score = 0;
let sceneRef;

const scoreElement = document.createElement("div");
scoreElement.id = "score";
scoreElement.style.position = "absolute";
scoreElement.style.top = "10px";
scoreElement.style.left = "10px";
scoreElement.style.color = "black";
scoreElement.style.fontSize = "20px";
scoreElement.style.userSelect = "none";
scoreElement.innerHTML = "item collectés : 0";

document.body.appendChild(scoreElement);

export function loadWorld(scene) {
    sceneRef = scene;

    const loader = new GLTFLoader();
    loader.load('world.glb', (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        model.traverse((child) => {
            if (child.isMesh) {
                if (child.name.startsWith("p_")) {
                    const number = child.name.split("_")[1];
                    const wallGeometry = new THREE.BoxGeometry(10, 10, 0.5);
                    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
                    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
                    wallMesh.position.set(child.position.x, child.position.y + 5, child.position.z);
                    scene.add(wallMesh);

                    const wallShape = new CANNON.Box(new CANNON.Vec3(6, 5, 0.5));
                    const wallBody = new CANNON.Body({ mass: 0, shape: wallShape });
                    wallBody.position.set(child.position.x, child.position.y + 5, child.position.z);
                    world.addBody(wallBody);

                    walls[number] = { mesh: wallMesh, body: wallBody };
                    requiredButtons++;
                } else if (child.name.startsWith("b_")) {
                    const number = child.name.split("_")[1];
                    const buttonGeometry = new THREE.BoxGeometry(0.9, 0.5, 0.9);
                    const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0xff0602 });
                    const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
                    buttonMesh.position.copy(child.position);
                    scene.add(buttonMesh);

                    buttons[number] = { mesh: buttonMesh, activated: false };
                } else if (child.name.startsWith("item_")) {
                    const itemPosition = new THREE.Vector3();
                    child.getWorldPosition(itemPosition);
                    const newX = itemPosition.x;
                    const newY = itemPosition.y + 1;
                    const newZ = itemPosition.z;

                    const collectibleGeometry = new THREE.SphereGeometry(0.5);
                    const collectibleMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
                    const collectibleMesh = new THREE.Mesh(collectibleGeometry, collectibleMaterial);
                    collectibleMesh.position.set(newX, newY, newZ);
                    scene.add(collectibleMesh);

                    const itemShape = new CANNON.Sphere(0.5);
                    const itemBody = new CANNON.Body({
                        mass: 0,
                        shape: itemShape,
                        position: new CANNON.Vec3(newX, newY, newZ)
                    });
                    world.addBody(itemBody);
                    items.push({ mesh: collectibleMesh, body: itemBody });
                }

                const textureLoader = new TextureLoader();
                textureLoader.load('sky.jpg', (texture) => {
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    scene.background = texture;
                });
            }
        });
    });
}

function onMouseClick(event) {
    if (!sceneRef) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const buttonMeshes = Object.values(buttons).map(btn => btn.mesh);
    const intersects = raycaster.intersectObjects(buttonMeshes);

    if (intersects.length > 0) {
        const clickedButton = intersects[0].object;
        for (let key in buttons) {
            if (buttons[key].mesh === clickedButton && !buttons[key].activated) {
                buttons[key].activated = true;
                activatedButtons++;
                buttons[key].mesh.material.color.set(0x80ff00);

                if (walls[key]) {
                    sceneRef.remove(walls[key].mesh);
                    world.removeBody(walls[key].body);
                    delete walls[key];
                }
            }
        }
    }
}

window.addEventListener("click", onMouseClick);

export function checkItemCollection() {
    if (!sceneRef) return;

    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];
        let distance = playerBody.position.vsub(item.body.position).length();

        if (distance < 1.5) {
            sceneRef.remove(item.mesh);
            world.removeBody(item.body);
            items.splice(i, 1);
            score++;

            if (scoreElement) {
                scoreElement.innerText = `Objets collectés : ${score}`;
            }
        }
    }
}

const startPosition = new CANNON.Vec3(playerBody.position.x, playerBody.position.y, playerBody.position.z);

function checkPlayerFell() {
    if (playerBody.position.y < 4) {
        resetPlayerPosition();
    }
}

function resetPlayerPosition() {
    playerBody.position.copy(startPosition);
    playerBody.velocity.set(0, 0, 0);
    playerBody.angularVelocity.set(0, 0, 0);
}

function update() {
    checkPlayerFell();
    requestAnimationFrame(update);
}
update();
