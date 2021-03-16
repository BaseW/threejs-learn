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
    // japan
    const japan = createPoint(0xff0000, 35, 139);
    scene.add(japan);

    for (data of citiesPoints) {
        const latitude = data[0];
        const longitude = data[1];
        const point = createPoint(
            latitude === 90
                ? 0x0000FF
                : 0x00FF00,
            latitude,
            longitude
        );
        scene.add(point);
        const line = createLine(japan.position, point.position);
        scene.add(line)
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
        new THREE.MeshBasicMaterial({ map: texture })
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
        new THREE.MeshBasicMaterial({ color: color })
    );
    sphere.position.copy(translateGeoCoords(latitude, longitude, 102));
    return sphere;
}

/**
 * make line between two points
 * @param {THREE.Vector3} startPoint
 * @param {THREE.Vector3} endPoint
 * @returns {THREE.Line}
 * @see https://ics.media/entry/10657
 */
function createLine(startPoint, endPoint) {
    // 線
    const geometry = new THREE.Geometry();
    geometry.vertices = getOrbitPoints(startPoint, endPoint, 15);
    return new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({ linewidth: 5, color: 0x00ffff }));
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

/**
 * get orbit coordinate from points
 * @param {Vector3} startPos
 * @param {Vector3} endPos
 * @param {number} segmentNum
 * @returns {Vector3[]}
 * @see https://ics.media/entry/10657
 */
function getOrbitPoints(startPos, endPos, segmentNum) {
    // 頂点を格納する配列
    const vertices = [];
    const startVec = startPos.clone();
    const endVec = endPos.clone();

    // ２つのベクトルの回転軸
    const axis = startVec.clone().cross(endVec);
    // 軸ベクトルを単位ベクトルに
    axis.normalize();
    // ２つのベクトルが織りなす角度
    const angle = startVec.angleTo(endVec);

    // ２つの点を結ぶ弧を描くための頂点を打つ
    for (let i = 0; i < segmentNum; i++) {
        // axisを軸としたクォータニオンを生成
        const q = new THREE.Quaternion();
        q.setFromAxisAngle(axis, angle / segmentNum * i);
        // ベクトルを回転させる
        const vertex = startVec.clone().applyQuaternion(q);
        vertices.push(vertex);
    }

    // 終了点を追加
    vertices.push(endVec);
    return vertices;
}

window.onload = init();