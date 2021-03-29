import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function init(document) {
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(70, 1200 / 800, 1, 1000);
    camera.position.set(100, 200, 200);

    // const axes = new THREE.AxisHelper(200);
    // scene.add(axes);
    // const grids = new THREE.GridHelper(200, 50);
    // scene.add(grids);

    // const box = new THREE.Mesh(
    //     new THREE.BoxGeometry(20, 20, 20),
    //     new THREE.MeshBasicMaterial({color: 0xffffff})
    // );
    // scene.add(box);
    // const cylinder = new THREE.Mesh(
    //     new THREE.CylinderGeometry(50, 50, 200),
    //     new THREE.MeshBasicMaterial(0x000000)
    // );
    // scene.add(cylinder);
    const sun = new THREE.Mesh(
        new THREE.SphereGeometry(30),
        new THREE.MeshBasicMaterial({color: 0xffce75})
    );
    scene.add(sun);
    const earch = new THREE.Mesh(
        new THREE.SphereGeometry(5),
        new THREE.MeshBasicMaterial({color: 0x0099ff})
    );
    earch.position.set(-100, 0, -100);
    scene.add(earch);
    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(1),
        new THREE.MeshBasicMaterial({color: 0xffffff})
    );
    moon.position.set(-105, 0, -105);
    scene.add(moon);

    let _particles = [];
    const size = 1000;
    const num = 1000;
    for (let i = 0; i < num; i ++) {
        _particles.push(
            new THREE.Vector3(
                size * (Math.random() - 0.5),
                size * (Math.random() - 0.5),
                size * (Math.random() - 0.5)
            )
        );
    }
    const particles = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(_particles),
        new THREE.PointsMaterial({
            size: 1,
            color: 0xffffff
        })
    );
    scene.add(particles);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(1200, 800);
    const container = document.getElementById("three_container");
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    let earchRot = 0;
    let moonRot = 0;
    const animate = () => {
        earchRot += 0.05;
        const earchRad = earchRot * Math.PI / 180;
        const earchX = -100 * Math.cos(earchRad);
        const earchZ = -100 * Math.sin(earchRad);
        earch.position.set(earchX, 0, earchZ);
        moonRot += 2;
        const moonRad = moonRot * Math.PI / 180;
        const moonX = -10 * Math.cos(moonRad) + earchX;
        const moonZ = -10 * Math.sin(moonRad) + earchZ;
        moon.position.set(moonX, 0, moonZ);
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}