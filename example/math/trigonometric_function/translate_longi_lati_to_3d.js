function init() {
    let cities = [];
    const citiesPoints = [
        [35, 139], // tokyo
        [39, 140], // akita
        [34, 118], // china?
        [-33, 151], // sydney
        [-23, -46], // sao paulo
        [90, 0], // arctic
        [-90, 0] // antarctic
    ];
    // scene
    const scene = new THREE.Scene();

    // camera
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 50;
    camera.position.z = 200;

    // henlpers
    const axes = new THREE.AxisHelper(200);
    scene.add(axes);
    const grids = new THREE.GridHelper(200, 150);
    scene.add(grids);

    // others
    const earth = createEarth();
    scene.add(earth);

    for (data of citiesPoints) {
        const latitude = data[0];
        const longitude = data[1];
        const point = createPoint(
            citiesPoints.indexOf(data) === 0
                ? 0xff0000
                : (latitude === 90 ? 0x0000FF : 0x00FF00),
            latitude,
            longitude
        );
        scene.add(point);
        cities.push(point);
    }

    // renderer, controls
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // レンダリング
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
}

/**
 * create earth
 * @returns {THREE.Mesh}
 */
function createEarth() {
    const texture = new THREE.TextureLoader().load('./img/ground.jpg');
    return new THREE.Mesh(
        new THREE.SphereGeometry(100, 40, 40),
        new THREE.MeshBasicMaterial({map: texture})
    );
}

/**
 * create point
 * @param {number} color
 * @param {number} latitude
 * @param {number} longitude
 * @returns {THREE.Mesh}
 */
function createPoint(color, latitude = 0, longitude = 0) {
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2),
        new THREE.MeshBasicMaterial({color: color})
    );
    sphere.position.copy(translateGeoCoords(latitude, longitude, 100));
    return sphere;
}

/**
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} radius
 * @returns {Vector3}
 */
function translateGeoCoords(latitude, longitude, radius) {
    // elevation angle
    const phi = (latitude) * Math.PI / 180;
    // azimuth
    const theta = (longitude - 180) * Math.PI / 180;
    const x = -(radius) * Math.cos(phi) * Math.cos(theta);
    const y = (radius) * Math.sin(phi);
    const z = (radius) * Math.cos(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}

window.onload = init();