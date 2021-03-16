function init() {
    // scene
    const scene = new THREE.Scene();

    // camera
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 50;
    camera.position.z = 600;

    // henlpers
    const axes = new THREE.AxisHelper(200);
    scene.add(axes);
    const grids = new THREE.GridHelper(200, 150);
    scene.add(grids);

    // others
    let degree = 0;
    const radius = 300;

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(10),
        new THREE.MeshBasicMaterial({color: 0xff0000})
    );
    scene.add(sphere);

    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(250),
        new THREE.MeshBasicMaterial({wireframe: true})
    );
    scene.add(earth);

    // renderer, controls
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // レンダリング
    const animate = () => {
        requestAnimationFrame(animate);
        degree += 5;
        const rad = degree * Math.PI / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);
        sphere.position.set(x, y, 0);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
}
window.onload = init();