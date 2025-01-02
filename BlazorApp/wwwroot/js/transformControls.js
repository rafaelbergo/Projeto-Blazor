import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

let renderer, currentCamera, scene, orbit, control;

export function initScene(canvasId) {
    const canvas = document.getElementById(canvasId);
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const frustumSize = 5;

    const cameraPersp = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    const cameraOrtho = new THREE.OrthographicCamera(-frustumSize * aspect, frustumSize * aspect, frustumSize, -frustumSize, 0.1, 100);
    currentCamera = cameraPersp;

    currentCamera.position.set(5, 2.5, 5);

    scene = new THREE.Scene();
    scene.add(new THREE.GridHelper(5, 10, 0x888888, 0x444444));

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    orbit = new OrbitControls(currentCamera, renderer.domElement);
    orbit.update();
    orbit.addEventListener('change', render);

    control = new TransformControls(currentCamera, renderer.domElement);
    control.addEventListener('change', render);
    control.addEventListener('dragging-changed', function (event) {
        orbit.enabled = !event.value;
    });

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    control.attach(mesh);
    scene.add(control);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(1, 1, 1);
    scene.add(light);

    render();

    window.addEventListener('resize', () => onWindowResize(canvas), false);
}

function onWindowResize(canvas) {
    const aspect = canvas.clientWidth / canvas.clientHeight;

    if (currentCamera.isPerspectiveCamera) {
        currentCamera.aspect = aspect;
    } else {
        const frustumSize = 5;
        currentCamera.left = -frustumSize * aspect;
        currentCamera.right = frustumSize * aspect;
    }
    currentCamera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    render();
}

function render() {
    renderer.render(scene, currentCamera);
}