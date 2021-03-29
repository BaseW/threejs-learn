import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function init(document) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(70, 1200 / 800, 1, 1000);
    camera.position.set(10, 20, 20);

    const axes = new THREE.AxisHelper(20);
    scene.add(axes);

    let loader = new GLTFLoader();
    loader.load("./obj/tree.gltf",
        // called when the resource is loaded
        function (gltf) {
            scene.add(gltf.scene);
        }
    );

    const light = new THREE.HemisphereLight(0xFFFFFF, 0x666666, 1.0);
    scene.add(light);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(1200, 800);
    const container = document.getElementById("three_container");
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}