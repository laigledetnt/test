import * as CANNON from 'cannon-es';

export const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// 📌 Création du sol solide (Box au lieu de Plane)
export function initPhysics() {
    const groundMaterial = new CANNON.Material();
    
    const groundShape = new CANNON.Box(new CANNON.Vec3(50, 0.5, 50)); // ✅ Sol solide et épais
    const groundBody = new CANNON.Body({
        mass: 0, // ✅ Fixé pour ne pas bouger
        shape: groundShape,
        material: groundMaterial
    });

    groundBody.position.set(0, -0.5, 0); // ✅ Correction hauteur
    world.addBody(groundBody);
}
