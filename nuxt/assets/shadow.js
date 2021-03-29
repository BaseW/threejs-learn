import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function init(document) {
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
    const meshFloor = new THREE.Mesh(
        new THREE.BoxGeometry(200, 0.1, 200),
        new THREE.MeshStandardMaterial({ color: 0x808080 })
    );
    // 影の有効化
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);

    const meshKnot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(20, 4),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    meshKnot.position.y = 50;
    // 影の有効化
    meshKnot.castShadow = true;
    scene.add(meshKnot);

    // const light = new THREE.SpotLight({color: 0xffffff});
    const light = new THREE.PointLight({ color: 0xffffff });
    light.position.y = 100;
    light.position.z = -100;
    // 影の有効化
    light.castShadow = true;
    scene.add(light);
    const lightHelper = new THREE.PointLightHelper(light);
    scene.add(lightHelper);

    // renderer, controls
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // レンダリング
    let rot = 0;
    // let y = 100;
    const animate = () => {
        rot += 0.5;
        // y += 1;
        // if (y > 500) {
        //     y = 100;
        // }
        let radian = rot * Math.PI / 180;
        if (radian == Math.PI) {
            rot = 0;
            radian = 0;
        }
        // meshKnot.position.x = 30 * Math.cos(radian);
        // meshKnot.position.z = 30 * Math.sin(radian);
        // light.position.y = y;
        light.position.x = -100 * Math.cos(radian);
        light.position.y = 100 * Math.sin(radian);
        light.position.z = -100 * Math.sin(radian);
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();
}