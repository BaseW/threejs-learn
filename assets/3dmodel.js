import * as THREE from 'three';

export default class Model {
    constructor() {
        this.name = '3dmodel';
        this.window = {
            width: 1500,
            height: 800
        };
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    create() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(70, this.window.width, this.window.height);
        this.camera.position.set(100, 100, 100);
        this.camera.lookAt({ x: 0, y: 0, z: 0 });

        const geometry1 = new THREE.BoxGeometry(50, 50, 50);
        const material1 = new THREE.MeshLambertMaterial({ color: 0xd5595f });
        const cube1 = new THREE.Mesh(geometry1, material1);
        this.scene.add(cube1);

        const geometry2 = new THREE.BoxGeometry(50, 50, 50);
        const material2 = new THREE.MeshLambertMaterial({ color: 0x4e7dbf });
        const cube2 = new THREE.Mesh(geometry2, material2);
        cube2.position.set(60, -30, 40);
        this.scene.add(cube2);

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 100, 50);
        this.scene.add(light);

        var axes = new THREE.AxisHelper(200);
        this.scene.add(axes);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.window.width, this.window.height);
        this.renderer.setClearColor(0xf8f8f8);
        // document.getElementById('sample').appendChild(this.renderer.domElement);
        // this.renderer.render();
    }

    start() {
        debugger
        document.getElementById('sample').appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
        this.tick();
    }

    tick() {
        // レンダリング
        //   cube.rotation.y += 0.01
        //   cube2.rotation.x += 0.01
        // rot += 0.5;
        // console.log(rot);
        // // ラジアンに変換する
        // const radian = (rot * Math.PI) / 180;
        // // 角度に応じてカメラの位置を設定
        // camera.position.x = 100 * Math.sin(radian);
        // camera.position.z = 100 * Math.cos(radian);
        // // 原点方向を見つめる
        // camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {this.tick()});
    }

}

// let model = new Model();

// export default model;
