import {
  WebGLRenderer,
  ACESFilmicToneMapping,
  sRGBEncoding,
  Scene,
  PerspectiveCamera,
  UnsignedByteType,
  PMREMGenerator,
  Box3,
  Vector3,
  MathUtils,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export function useViewport(canvas) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = sRGBEncoding;

  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 50;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0.25, 1, 1);

  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 1;
  controls.target.set(0, 0, 0);
  controls.update();

  const scene = new Scene();

  function resizeRenderer(renderer) {
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  let renderRequested = false;

  function render() {
    renderRequested = undefined;

    if (resizeRenderer(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();
    renderer.render(scene, camera);
  }
  render();

  function requestRender() {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  }

  controls.addEventListener("change", requestRender);
  window.addEventListener("resize", requestRender);

  const loadHdr = (hdr) => {
    return new Promise((resolve, reject) => {
      new RGBELoader().setDataType(UnsignedByteType).load(
        hdr,
        (texture) => {
          const pmremGenerator = new PMREMGenerator(renderer);
          pmremGenerator.compileEquirectangularShader();
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          scene.environment = envMap;
          texture.dispose();
          pmremGenerator.dispose();
          requestRender();
          resolve();
        },
        (xhr) => {
          console.log(
            `HDR ${Math.floor((xhr.loaded / xhr.total) * 100)}% loaded`
          );
        },
        (err) => {
          reject(new Error(err));
        }
      );
    });
  };

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  const loader = new GLTFLoader().setDRACOLoader(dracoLoader);
  const loadModel = (model) => {
    return new Promise((resolve, reject) => {
      loader.load(
        model,
        (data) => {
          const root = data.scene;
          scene.add(root);
          requestRender();
          resolve(root);
        },
        (xhr) => {
          const progress = Math.floor((xhr.loaded / xhr.total) * 100);
          console.log(`Model ${progress}% loaded`);
        },
        (err) => {
          reject(new Error(err));
        }
      );
    });
  };

  const frameArea = (sizeToFitOnScreen, boxSize, boxCenter, camera) => {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = MathUtils.degToRad(camera.fov * 0.5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = new Vector3()
      .subVectors(camera.position, boxCenter)
      .multiply(new Vector3(1, 0, 1))
      .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  };

  const frameObject = (object) => {
    // compute the box that contains all the stuff
    // from root and below
    const box = new Box3().setFromObject(object);

    const boxSize = box.getSize(new Vector3()).length();
    const boxCenter = box.getCenter(new Vector3());

    // set the camera to frame the box
    frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

    // update the Trackball controls to handle the new size
    controls.maxDistance = boxSize * 10;
    controls.target.copy(boxCenter);
    controls.update();
    requestRender();
  };

  return { scene, loadHdr, loadModel, frameObject };
}
