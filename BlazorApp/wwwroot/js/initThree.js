(async function () {
    try {
        const THREE = await import('/js/three.module.js');
        console.log('Three.js imported successfully:', THREE);

        const { TransformControls } = await import('/js/TransformControls.js');
        console.log('TransformControls imported successfully:', TransformControls);

        const { OrbitControls } = await import('/js/OrbitControls.js');
        console.log('OrbitControls imported successfully:', OrbitControls);

        // Expõe as funções globais para uso no Blazor
        window.initThreeScene = function (canvasId) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) {
                console.error(`Canvas with ID '${canvasId}' not found.`);
                return;
            }

            const renderer = new THREE.WebGLRenderer({ canvas });
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
            camera.position.set(5, 2.5, 5);

            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(),
                new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            );
            scene.add(cube);

            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(1, 1, 1);
            scene.add(light);

            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();

            console.log("Three.js scene initialized.");
        };
    } catch (error) {
        console.error('Error importing modules:', error);
    }
})();