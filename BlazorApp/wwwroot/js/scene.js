const THREE = window.THREE;
const OrbitControls = window.OrbitControls; 
const TransformControls = window.TransformControls; 

window.initScene = function () {
    let cameraPersp, cameraOrtho, currentCamera;
    let scene, renderer, control, orbit;

    function init() {
        const container = document.getElementById('threejs-container');

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);

        const aspect = container.offsetWidth / container.offsetHeight;

        const frustumSize = 5;

        cameraPersp = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
        cameraOrtho = new THREE.OrthographicCamera(
            -frustumSize * aspect,
            frustumSize * aspect,
            frustumSize,
            -frustumSize,
            0.1,
            100
        );
        currentCamera = cameraPersp;

        currentCamera.position.set(5, 2.5, 5);

        scene = new THREE.Scene();
        scene.add(new THREE.GridHelper(5, 10, 0x888888, 0x444444));

        const ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);

        const light = new THREE.DirectionalLight(0xffffff, 4);
        light.position.set(1, 1, 1);
        scene.add(light);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshLambertMaterial();

        orbit = new OrbitControls(currentCamera, renderer.domElement);
        orbit.update();
        orbit.addEventListener('change', render);

        control = new TransformControls(currentCamera, renderer.domElement);
        control.addEventListener('change', render);
        control.addEventListener('dragging-changed', function (event) {
            orbit.enabled = !event.value;
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        control.attach(mesh);
        scene.add(control);

        window.addEventListener('resize', onWindowResize);

        render();
    }

    function onWindowResize() {
        const container = document.getElementById('threejs-container');
        const aspect = container.offsetWidth / container.offsetHeight;

        cameraPersp.aspect = aspect;
        cameraPersp.updateProjectionMatrix();

        cameraOrtho.left = cameraOrtho.bottom * aspect;
        cameraOrtho.right = cameraOrtho.top * aspect;
        cameraOrtho.updateProjectionMatrix();

        renderer.setSize(container.offsetWidth, container.offsetHeight);
        render();
    }

    function render() {
        renderer.render(scene, currentCamera);
    }

    init();
};
