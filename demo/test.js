function init() {
    // シーン
    const scene = new THREE.Scene();

    // カメラ
    /*
    引数
    - FOV: 視野角
    - aspect ratio
    - near: この値以上に近いオブジェクトは表示されない
    - far: この値以上に遠いオブジェクトは表示されない
    */
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = 110;
    camera.position.y = 100;
    camera.position.z = 150;
    camera.lookAt({ x: 0, y: 0, z: 0 });
    const controls = new THREE.OrbitControls(camera);

    // メッシュ
    /*
    - BoxGeometry: 頂点と面を持つ
    - MeshLambertMaterial（material）: オブジェクトのプロパティを処理する
    - Mesh: Sceneに挿入されうる
    */
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    const material = new THREE.MeshLambertMaterial({ color: 0xd5595f });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    const geometry2 = new THREE.BoxGeometry(50, 50, 50);
    const material2 = new THREE.MeshLambertMaterial({ color: 0x4e7dbf });
    const cube2 = new THREE.Mesh(geometry2, material2);
    cube2.position.set(60, -30, 40);
    scene.add(cube2);
    const geometry3 = new THREE.SphereGeometry(50, 50, 50)

    // const material3 = new THREE.MeshLambertMaterial({ color: 0xd5595f });
    // 画像を読み込む
    // const loader = new THREE.TextureLoader();
    // loader.crossOrigin = "*";
    // loader.crossOrigin = "";
    // const texture = THREE.ImageUtils.loadTexture('test.png');
    // const texture = loader.load('test.png');
    // const texture = THREE.ImageUtils.loadTexture('http://aisamurai.co.jp/wp-content/themes/ai_samurai/img/top/top-pc.svg');
    // const texture = loader.load('https://aisamurai.app/_nuxt/img/samurai_default.12d5605.svg');
    // マテリアルを作成
    // const material3 = new THREE.MeshStandardMaterial({ map: texture });

    const material3 = new THREE.MeshLambertMaterial({ color: 0x4e7dbf });
    const ball1 = new THREE.Mesh(geometry3, material3);
    ball1.position.set(-60, 30, -40);
    scene.add(ball1);

    // glbを読み込む
    const model = loadGLB();
    scene.add(model);

    // ライト
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.x = 0;
    light.position.y = 100;
    light.position.z = 50;
    scene.add(light);

    var axes = new THREE.AxisHelper(200);
    scene.add(axes);

    const canvas = document.getElementById('sample');
    const meshList = [cube, cube2, ball1];
    // マウス座標管理用のベクトルを作成
    const mouse = new THREE.Vector2();
    // マウスイベントを登録
    canvas.addEventListener('mousemove', handleMouseMove);

    // マウスを動かしたときのイベント
    function handleMouseMove(event) {
        const element = event.currentTarget;
        // canvas要素上のXY座標
        const x = event.clientX - element.offsetLeft;
        const y = event.clientY - element.offsetTop;
        // canvas要素の幅・高さ
        const w = element.offsetWidth;
        const h = element.offsetHeight;

        // -1〜+1の範囲で現在のマウス座標を登録する
        mouse.x = (x / w) * 2 - 1;
        mouse.y = -(y / h) * 2 + 1;
    }

    // レイキャストを作成
    const raycaster = new THREE.Raycaster();

    // レンダラー
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xf8f8f8);
    document.getElementById('sample').appendChild(renderer.domElement);
    renderer.render(scene, camera);
    // let rot = 0;
    tick();

    // 毎フレーム時に実行されるループイベントです
    function tick() {
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

        // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
        raycaster.setFromCamera(mouse, camera);

        // その光線とぶつかったオブジェクトを得る
        const intersects = raycaster.intersectObjects(scene.children);

        meshList.map(mesh => {
            // 交差しているオブジェクトが1つ以上存在し、
            // 交差しているオブジェクトの1番目(最前面)のものだったら
            if (intersects.length > 0 && mesh === intersects[0].object) {
                // 色を赤くする
                mesh.material.color.setHex(0xff0000);
            } else {
                // それ以外は元の色にする
                mesh.material.color.setHex(0xffffff);
            }
        });


        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}
function loadGLB() {
    const loader = new THREE.GLTFLoader();
    const url = './tree.glb';
    
    let model = null;
    loader.load(
        url, 
        function ( gltf ){
            model = gltf.scene;
            model.name = "tree";
            model.position.set(0,200,0);

            model["test"] = 100;
            console.log("model");
        },
        function ( error ) {
            console.log( 'An error happened' );
            console.log( error );
        }
    );
    return model
}
window.onload = init();