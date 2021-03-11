<template>
  <div>
    <div id="sample"></div>
  </div>
</template>

<script>
import * as THREE from "three";

export default {
  // data() {
  //   return {
  //     // app: null,
  //     window: {
  //       width: 1000,
  //       height: 800,
  //     },
  //     scene: null,
  //     camera: null,
  //     renderer: null,
  //   };
  // },
  // created() {
  //   this.scene = new THREE.Scene();

  //   this.camera = new THREE.PerspectiveCamera(
  //     70,
  //     this.window.width,
  //     this.window.height
  //   );
  //   this.camera.position.set(100, 100, 100);
  //   this.camera.lookAt({ x: 0, y: 0, z: 0 });

  //   const geometry1 = new THREE.BoxGeometry(50, 50, 50);
  //   const material1 = new THREE.MeshLambertMaterial({ color: 0xd5595f });
  //   const cube1 = new THREE.Mesh(geometry1, material1);
  //   this.scene.add(cube1);

  //   const geometry2 = new THREE.BoxGeometry(50, 50, 50);
  //   const material2 = new THREE.MeshLambertMaterial({ color: 0x4e7dbf });
  //   const cube2 = new THREE.Mesh(geometry2, material2);
  //   cube2.position.set(60, -30, 40);
  //   this.scene.add(cube2);

  //   const light = new THREE.DirectionalLight(0xffffff);
  //   light.position.set(0, 100, 50);
  //   this.scene.add(light);

  //   var axes = new THREE.AxisHelper(200);
  //   this.scene.add(axes);

  //   this.renderer = new THREE.WebGLRenderer({ antialias: true });
  //   this.renderer.setSize(this.window.width, this.window.height);
  //   this.renderer.setClearColor(0xf8f8f8);

  //   // if (process.browser) {
  //   //   // ここに window とか document を使った処理
  //   //   document.getElementById("sample").appendChild(this.renderer.domElement);
  //   // }
  // },
  mounted() {
    // document.getElementById('sample').appendChild(this.renderer.domElement);
    this.init();
  },
  methods: {
    async init() {
      const model = require('~/assets/bridge');
      this.app = await model.load();
      this.app.start();
      // document.getElementById('sample').appendChild(this.renderer.domElement);
      // this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style>
</style>