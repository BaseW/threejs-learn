function init() {
    // scene
    const scene = new THREE.Scene();

    // camera
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 50;
    camera.position.z = 200;

    // henlpers
    const axes = new THREE.AxisHelper(200);
    scene.add(axes);
    // const grids = new THREE.GridHelper(200, 150);
    // scene.add(grids);

    // others
    let degree = 0;
    let radius = 150;
    let frontVector = new THREE.Vector3(0, -1, 0);

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(10),
        new THREE.MeshBasicMaterial({ color: 0xCC0000, wireframe: true })
    );
    scene.add(sphere);

    const vecHelper = new THREE.ArrowHelper(
        frontVector,
        new THREE.Vector3(0, 0, 0),
        40
    );
    sphere.add(vecHelper);

    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(70, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: true }),
    );
    scene.add(earth);

    const plane = new THREE.GridHelper(1000, 20);
    plane.position.y = -80;
    scene.add(plane);

    // renderer, controls
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // レンダリング
    const animate = () => {
        requestAnimationFrame(animate);

        degree -= 2;
        const oldPosition = sphere.position.clone();
        const newPosition = getCircularMotionPosition(degree, radius);
        frontVector = newPosition.clone().sub(oldPosition);
        frontVector = frontVector.normalize();
        sphere.position.copy(newPosition);
        vecHelper.setDirection(frontVector);

        controls.update();
        renderer.render(scene, camera);
    };
    animate();
}

/**
 * @param {Number} degree
 * @param {Number} radius
 * @returns {THREE.Vector3}
 */
function getCircularMotionPosition(degree, radius) {
    // 角度をラジアンに変換します
    const rad = degree * Math.PI / 180;
    // X座標 = 半径 x Cosθ
    const x = radius * Math.cos(rad);
    // Y座標
    const y = radius * Math.sin(rad * 1.5) / 7;
    // Z座標 = 半径 x Sinθ
    const z = radius * Math.sin(rad);

    return new THREE.Vector3(x, y, z);
}

window.onload = init();