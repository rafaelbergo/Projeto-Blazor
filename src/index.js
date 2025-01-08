import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { ViewHelper } from 'three/addons/helpers/ViewHelper.js';

let cameraPersp, currentCamera;
let scene, renderer, orbit, helper;
let controls = [];

init();
render();

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);

    const aspect = window.innerWidth / window.innerHeight;

    cameraPersp = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    currentCamera = cameraPersp;

    currentCamera.position.set(5, 2.5, 5);

    scene = new THREE.Scene();
    scene.add(new THREE.GridHelper(100, 50, 0x888888, 0x444444));

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(1, 1, 1);
    scene.add(light);
/*
    const texture = new THREE.TextureLoader().load('js/crate.gif', render);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial({ map: texture });*/

    orbit = new OrbitControls(currentCamera, renderer.domElement);
    orbit.update();
    orbit.addEventListener('change', render);

    helper = new ViewHelper(currentCamera, renderer.domElement);
    /*
    function addCube(x, y, z) {
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        scene.add(cube);

        const control = new TransformControls(currentCamera, renderer.domElement);
        control.attach(cube);
        scene.add(control);

        controls.push(control); 

        control.addEventListener('change', render);

        control.addEventListener('dragging-changed', function (event) {
            orbit.enabled = !event.value;
        });

        const gizmo = control.getHelper();
        scene.add(gizmo);
    }

    addCube(0, 0, 0);
    addCube(2, 0, 0);
    addCube(0, 2, 0);
    addCube(0, 0, 2);*/

    window.addEventListener('resize', onWindowResize);

    window.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'q':
                controls.forEach((control) => {
                    control.setSpace(control.space === 'local' ? 'world' : 'local');
                });
                break;

            case 'w':
                controls.forEach((control) => {
                    control.setMode('translate');
                });
                break;

            case 'e':
                controls.forEach((control) => {
                    control.setMode('rotate');
                });
                break;

            case 'r':
                controls.forEach((control) => {
                    control.setMode('scale');
                });
                break;

            case '+':
            case '=':
                controls.forEach((control) => {
                    control.setSize(control.size + 0.1);
                });
                break;

            case '-':
            case '_':
                controls.forEach((control) => {
                    control.setSize(Math.max(control.size - 0.1, 0.1));
                });
                break;

            case 'c':
                controls.forEach((control) => {
                    control.visible = !control.visible;
                    control.showX = !control.showX;
                    control.showY = !control.showY;
                    control.showZ = !control.showZ;
                });
                break;
        }
    });

    window.addEventListener('keyup', function (event) {
        switch (event.key) {
            case 'Shift':
                controls.forEach((control) => {
                    control.setTranslationSnap(null);
                    control.setRotationSnap(null);
                    control.setScaleSnap(null);
                });
                break;
        }
    });
}

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;

    cameraPersp.aspect = aspect;
    cameraPersp.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}

function render() {
    renderer.clear();
    renderer.render(scene, currentCamera);
    helper.render(renderer);
}

export function addCubeToScene(x, y, z, scale, rotX, rotY, rotZ, id) {
    const texture = new THREE.TextureLoader().load('js/crate.gif', render);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshLambertMaterial({ map: texture });

    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(x, y, z);
    cube.scale.set(scale, scale, scale);
    cube.rotation.set(rotX * Math.PI / 180, rotY * Math.PI / 180, rotZ * Math.PI / 180);
    cube.name = id;

    scene.add(cube);
    const control = new TransformControls(currentCamera, renderer.domElement);
    control.attach(cube);
    scene.add(control);

    controls.push(control); 

    control.addEventListener('change', render);

    control.addEventListener('dragging-changed', function (event) {
        orbit.enabled = !event.value;
    });

    const gizmo = control.getHelper();
    scene.add(gizmo);

    render();
}

export function removeCubeFromScene(id) {
    const cubeObject = scene.getObjectByName(id.toString());

    if (cubeObject) {
        const control = controls.find(c => c.object === cubeObject);

        if (control) {
            control.detach();
            scene.remove(control);
            controls = controls.filter(c => c !== control);
        }
        scene.remove(cubeObject);
        render();
    }
}

window.addCubeToScene = addCubeToScene;
window.removeCubeFromScene = removeCubeFromScene;