import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js';
import { TransformControls } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/controls/TransformControls.js';

let registeredScene = null;
let registeredCamera = null;

window.initThreeScene = (canvasId) => {
    const canvas = document.getElementById(canvasId);

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(5, 2.5, 5);

    registeredScene = scene;
    registeredCamera = camera;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.name = "objectToTransform"; // Nome para identificar o objeto
    scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    console.log("Scene and camera initialized and registered.");
};

window.initTransformControls = (objectId) => {
    if (!registeredScene || !registeredCamera) {
        console.error("Scene or camera not registered.");
        return;
    }

    const object = registeredScene.children.find(obj => obj.name === objectId);
    if (!object) {
        console.error(`Object with ID '${objectId}' not found.`);
        return;
    }

    const transformControls = new TransformControls(registeredCamera, document.getElementById('threeCanvas'));
    transformControls.attach(object);
    registeredScene.add(transformControls);

    console.log("TransformControls attached to object:", object);
};
