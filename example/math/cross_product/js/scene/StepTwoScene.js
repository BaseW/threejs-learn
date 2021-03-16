import * as THREE from '../../../../three/three.module.js';
import Camera from '../camera/Camera.js';
import Course from '../object/Course.js';
import Dolly from '../object/Dolly.js';

/**
 * ステップ１シーンクラスです。
 */
export default class StepTwoScene extends THREE.Scene {
  /**
   * コンストラクター
   * @constructor
   */
  constructor() {
    super();

    this._frame = 0;

    /** カメラ */
    this.camera = new Camera();
    this.camera.position.x = 10;
    this.camera.position.y = 50;
    this.camera.position.z = 10;

    // 環境光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    console.log('ambient light');
    this.add(ambientLight);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    console.log('directional light');
    this.add(directionalLight);

    // 床
    const gridHelper = new THREE.GridHelper(50, 30);
    gridHelper.position.y = -10;
    console.log('grid helper');
    this.add(gridHelper);

    // コース
    this._course = new Course();
    this.add(this._course);

    // トロッコ
    this._dolly = new Dolly();
    this._dolly.scale.multiplyScalar(0.5);
    this._dolly.position.copy(this._course.points[0]);
    this.add(this._dolly);
  }

  /**
   * 更新します。
   */
  update() {
    // カメラを更新
    this.camera.update();

    // コース
    const normal = this._getNormal(
      this._course.points[this._frame],
      this._course.points[this._frame + 1]
    )

    // トロッコ
    this._dolly.position.copy(this._course.points[this._frame]);
    this._dolly.up.set(normal.x, normal.y, normal.z);
    this._dolly.lookAt(this._course.points[this._frame + 1]);

  }

  /**
   * ポイントから法線を計算
   */
  _getNormal(currentPoint, nextPoint) {
    const frontVector = currentPoint
      .clone()
      .sub(nextPoint)
      .normalize();
    const slideVector = new THREE.Vector3(0, 0, -1);
    const normalVector = frontVector.cross(slideVector);

    return normalVector;
  }
}