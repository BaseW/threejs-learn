## 概要

[ここ](https://wgld.org/)で学んだwebglの基礎をメモしながら残していく。
[他の資料](https://developer.mozilla.org/ja/docs/Web/API/WebGL_API)もあった。

## メモ

### 1. ブラウザの準備

- chromeが推奨(2012/02時点)

### 2. WebGL を始める前に canvas を知る

- canvasタグはグラフィックのために追加されたタグであり、図形や画像を描画するためのものである
- 2次元の描画をサポートするのは2dコンテキスト
- WebGL(3次元)の描画をサポートするのは`webgl`コンテキスト

### 3. 3D 描画の基礎知識

- 3次元空間を2次元に出力する必要がある
- OpenGLでは座標が右手座標系
- 3次元を二次元に変換するために座標変換が必要
- 座標変換には`モデル変換`、`ビュー変換`、`プロジェクション変換`がある
    - モデル変換: 三次元空間の原点からの相対位置
    - ビュー変換: カメラの位置や向きを考慮する
    - プロジェクション変換: 三次元空間のどの領域を撮影するのか

### 4. レンダリングのための下準備

- html
    ```
     <html>
        <head>
            <title>WebGL TEST</title>
            <script src="script.js" type="text/javascript"></script>
        </head>
        <body>
            <canvas id="canvas"></canvas>
        </body>
    </html>
    ```
- 固定機能パイプライン
    - 3次元でレンダリングを行う一連の処理の流れ
    - 3つの座標変換を行う
    - WebGLでは存在しないので、これを記述する必要がある -> シェーダ
- シェーダ
    - 文字列として渡される
    ```
    <script id="vshader" type="x-shader/x-vertex">
    ※頂点シェーダのソース
    </script>

    <script id="fshader" type="x-shader/x-fragment">
    ※フラグメントシェーダのソース
    </script>
    ```

### 5. 行列(マトリックス)の基礎知識

- 行列によって、位置・スケール・回転を変換することができる

### 6. 頂点とポリゴン

- WebGLでは三角形（ポリゴン）を用いて描画する
- 3つの頂点を結ぶ順序で裏表を判断し、裏は描画しない -> カリング

### 6. コンテキストの初期化

- canvasの取得
    ```
    var c = document.getElementById('canvas');
    ```
- WebGLのコンテキストを取得
    ```
    var gl = c.gentContext('webgl') || c.getContext('experimental-webgl');
    ```
- 画面の初期化
    ```
    gl.clear(gl.COLOR_BUFFER_BIT);
    ```

### 7. シェーダの記述と基礎

- WebGLでは固定機能パイプラインを利用できないので、GLSL(OpenGL Shading Language)が実装されている
- 記述例は以下
    ```
    attribute vec3 position;
    
    void main(void) {
        gl_position = position;
    }
    ```
- attribute -> 頂点ごとに異なるデータを受け取る
    ```
    attribute vec3 position;
    uniform mat4 mvpMatrix; // model, view, projection
    
    void main(void) {
        gl_position = mvpMatrix * position;
    }
    ```
- uniform -> 全ての頂点に対して一律に処理される情報を受け取る（ex. 座標変換用の行列）
    ```
    attribute vec4 position;
    attribute vec4 color;
    uniform mat4 mvpMatrix;
    varying vec4 vColor

    void main(void) {
        vColor = color;
        gl_Position = mvpMatrix * position;
    }
    ```
    
    ```
    varying vec4 vColor;
    
    void main(void) {
        gl_FragColor = vColor;
    }
    ```
- varying -> 頂点シェーダとフラグメントシェーダの橋渡し

### 8. 頂点バッファの基礎

- 頂点群がどのように配置されているのかを表した座標 -> ローカル座標
- 頂点の情報は頂点バッファ(VBO, Vertex Buffer Object)に格納される -> 法線や色などの種類ごとにVBOが必要
- 頂点情報の配列 -> VBOの生成 -> VBOへの登録 -> attribute変数とVBOの紐付け

### 9. 行列演算とライブラリ

- 基本的な行列演算ライブラリ [minMatrix.js](https://wgld.org/j/minMatrix.js)

### 10. シェーダのコンパイルとリンク

- レンダリングまでの流れ
    - get canvas element from html
    - get webgl context from canvas
    - compile shader <- this section
    - prepare model data
    - generate VBO and notify
    - generate coordinate transformation matrix and notify
    - Issuing drawing instruction
    - update canvas and rendering
- vertex shader
    ```
    attribute vec3 position;
    uniform mat4 mvpMatrix;
    
    void main(void) {
        gl_position = mvpMatrix * vec4(position, 1.0);
    }
    ```
- fragment shader
    ```
    void main(void) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    ```
- compile
    ```
    function create_shader(id){
        // シェーダを格納する変数
        var shader;
        
        // HTMLからscriptタグへの参照を取得
        var scriptElement = document.getElementById(id);
        
        // scriptタグが存在しない場合は抜ける
        if(!scriptElement){return;}
        
        // scriptタグのtype属性をチェック
        switch(scriptElement.type){
            
            // 頂点シェーダの場合
            case 'x-shader/x-vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;
                
            // フラグメントシェーダの場合
            case 'x-shader/x-fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            default :
                return;
        }
        
        // 生成されたシェーダにソースを割り当てる
        gl.shaderSource(shader, scriptElement.text);
        
        // シェーダをコンパイルする
        gl.compileShader(shader);
        
        // シェーダが正しくコンパイルされたかチェック
        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            
            // 成功していたらシェーダを返して終了
            return shader;
        }else{
            
            // 失敗していたらエラーログをアラートする
            alert(gl.getShaderInfoLog(shader));
        }
    }
    ```
- generate program object
    ```
    function create_program(vs, fs){
        // プログラムオブジェクトの生成
        var program = gl.createProgram();
        
        // プログラムオブジェクトにシェーダを割り当てる
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        
        // シェーダをリンク
        gl.linkProgram(program);
        
        // シェーダのリンクが正しく行なわれたかチェック
        if(gl.getProgramParameter(program, gl.LINK_STATUS)){
        
            // 成功していたらプログラムオブジェクトを有効にする
            gl.useProgram(program);
            
            // プログラムオブジェクトを返して終了
            return program;
        }else{
            
            // 失敗していたらエラーログをアラートする
            alert(gl.getProgramInfoLog(program));
        }
    }

    ```

### 11. モデルデータと頂点属性

- 頂点属性: 位置、色など
- 頂点属性とVBOは一対一対応
- 3つの頂点からなる一枚のポリゴンを定義するときの例は以下
```
var vertex_position = [
     // X  //Y  //Z
     0.0, 1.0, 0.0,
     1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
];
```
- VBOの生成
```
function create_vbo(data) {
    // バッファオブジェクトの生成
    var vbo = gl.createBuffer();
    
    // バッファをバインドする
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    
    // バッファにデータをセット
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    
    // バッファのバインドを無効化
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    // 生成した VBO を返して終了
    return vbo;
}
```

### 12. minMatrix.js と座標変換行列

- model transformation matrix -> position, rotation, scale
- view transformation matrix -> camera's position, gaze point, up direction?(上方向)
- projection transformation matrix -> aspect, clipping area
- minMatrix.js
```
var m = new MatIV();
```
- methods -> create, identity, ... [detail](https://wgld.org/d/webgl/w013.html)
- flowchart of transformation
```
// matIVオブジェクトを生成
var m = new matIV();

// 行列の生成と初期化
var Matrix = m.identity(m.create());
```
ex. model: move +1.0 along x
```
var Matrix = m.identity(m.create());
m.translate(Matrix, [1.0, 0.0, 0.0], Matrix);
```
model, view, projection -> mvpMatrix

- prepare mvpMatrix

※OpenGL has the matrix in column order, so the order of multiplication is the exact opposite
```
// 各種行列の生成と初期化
var mMatrix = m.identity(m.create());   // モデル変換行列
var vMatrix = m.identity(m.create());   // ビュー変換行列
var pMatrix = m.identity(m.create());   // プロジェクション変換行列
var mvpMatrix = m.identity(m.create()); // 最終座標変換行列

// 各行列を掛け合わせる順序を示す一例
m.multiply(pMatrix, vMatrix, mvpMatrix); // p に v を掛ける
m.multiply(mvpMatrix, mMatrix, mvpMatrix); // さらに m を掛ける
```

### 13. ポリゴンのレンダリング

- initialize(6)
- generate shader and program object(10)
- generate VBO and notify(11)
- generate coordinate transformation matrix and notify(12)
- drawing models and redrawing context
```
// モデルの描画
gl.drawArrays(gl.TRIANGLES, 0, 3);

// コンテキストの再描画
gl.flush();
```

### 14. ポリゴンに色を塗る(頂点色の指定)

- 頂点情報と色情報のVBOをそれぞれ用意することで色を塗ることができる
- varyingを用いて頂点シェーダからフラグメントシェーダへ情報を送る
- フラグメントシェーダでは精度の指定をしておくほうが良い

### 15. 複数モデルのレンダリング

- VBOは再利用し、座標変換行列を操作することで複数モデルを描画する
- 操作する必要があるのはモデル変換行列のみ

### 16. 再帰処理と移動・回転・拡大縮小

- VBOや座標変換行列の一部を使いまわすことで少ないリソースで複数のモデルを動かせる
- 恒常ループを実装することでアニメーションが可能になる
- argumentsクラスのcalleeプロパティを参照することで関数自身への参照が得られる

### 17. インデックスバッファによる描画

- 複雑なモデルにおける頂点データの肥大化を抑える手段としてIBO(Index Buffer Object)がある。
- IBOはVBOとセットで用いる
- これによって重複する頂点を使いまわすことが可能（ex. 2つの三角形からなる四角形）

### 18. カリングと深度テスト

- カリング: ポリゴンの裏表でレンダリングするかを決定する機構
- 深度テスト: 奥行きを考慮して描画する機構

### 19. 立体モデル(トーラス)の描画

- 円周上に円を描くことでトーラスを生成する

### 20. 平行光源によるライティング

- 平行光源によるライティングは、光を当てる処理というより影を演出する処理
- 光の影響力は光の向きと法線ベクトルから計算される

### 21. 環境光によるライティング

- 平行光源では光が当たっていない部分を演出できない
- 環境光(ambient light)は乱反射をシミュレートする
- 環境光(ambient light)を使うと空間内のあらゆる部分を照らすことができる

### 22. 反射光によるライティング

- 反射光は反射をシミュレートする
- 反射光(specular light)によって光沢や輝きを表現できる
- 光沢を表すにはハイライトのような強い光が必要
- 反射光は視線も考慮するので、拡散光（平行光源）より自然な表現
- 軽い処理で求める方法としてハーフベクトルを使う方法がある

### 23. フォンシェーディング

- グーローシェーディング(gourand shading)ではポリゴンの色が頂点間で補正される
- そのため、頂点が少ない場合はハイライトがなくなる
- フォンシェーディング(phong shading)ではピクセルごとに色が補間される
- そのため、不自然なジャギーが発生しなくなる
- ピクセルごとに補間するため、ライティングの計算をフラグメントシェーダで行う

### 24. 点光源によるライティング

- 点光源を用いた処理では、光源の位置が三次元空間上に固定される
- これにより、三次元空間上のどこにモデルが描画されるかによって、光の当たり方が変わる
- 点光源では光源から頂点に向かうベクトルを計算に用いる

### 25. テクスチャマッピング

- テクスチャ: ポリゴンに貼り付けることができるイメージデータ
- WebGLで利用できるのはデータサイズが2の累乗のもののみ
- テクスチャオブジェクトの生成・バインド・紐付け
- 画像の読み込み終了後に処理を行う
- テクスチャ座標のVBOが必要

### 26. マルチテクスチャ

### 27. テクスチャパラメータ

### 28. アルファブレンディング

### 29. ブレンドファクター

### 30. クォータニオン(四元数)

### クォータニオンと minMatrixb.js

### マウス座標による回転

### クォータニオンと球面線形補間

### クォータニオンとビルボード

### 点や線のレンダリング

### ポイントスプライト

### ステンシルバッファ

### ステンシルバッファでアウトライン

### フレームバッファ

### ブラーフィルターによるぼかし処理

### バンプマッピング

### 視差マッピング

### キューブ環境マッピング

### キューブ環境バンプマッピング

### 屈折マッピング

### 動的キューブマッピング

### トゥーンレンダリング

### 射影テクスチャマッピング

### 光学迷彩

### シャドウマッピング

### 高解像度シャドウマップ

### グレイスケール変換

### セピア調変換

### sobel フィルタ

### laplacian フィルタ

### gaussian フィルタ

### グレアフィルタ

### 被写界深度

### 距離フォグ

### パーティクルフォグ

### ステンシル鏡面反射

### 半球ライティング

### リムライティング

### 後光　表面下散乱

### mosaic フィルタ

### ズームブラーフィルタ

### ゴッドレイフィルタ

### 深度値と座標系について理解する

### 浮動小数点数テクスチャ

### 頂点テクスチャフェッチ(VTF)

### 浮動小数点数VTF

### VAO(vertex array object)

### 異方性フィルタリング

### インスタンシング(instanced arrays)

### ハーフトーンシェーディング

### ラインシェード　シェーダ

### 動画を用いた video テクスチャ

### ウェブカメラをテクスチャに適用する

### 動画テクスチャでクロマキー合成

### VBOを逐次更新しながら描画する

### VBO逐次更新でパーティクル描画

### GPGPU でパーティクルを大量に描く

### MRT(Multiple render targets)

### MRT を利用した多重エッジ検出

### 描画結果から色を取得する readPixels

### フラットシェーディング

### インターリーブ配列 VBO

### スフィア環境マッピング（Matcap Shader）

