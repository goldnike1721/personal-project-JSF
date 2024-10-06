import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 20;
controls.minPolarAngle = 0.2;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
varying vec2 vUv;
void main() {
    float alpha = 1.0 - smoothstep(0.2, 0.5, length(vUv - 0.5));
    gl_FragColor = vec4(127.0 / 255.0, 121.0 / 255.0, 121.0 / 255.0, alpha);
}`;

const groundMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
});

// Геометрія підлоги
const groundGeometry = new THREE.CircleGeometry(7, 320);
groundGeometry.rotateX(-Math.PI / 2);

// Мішень
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh);

// const groundGeometry = new THREE.CircleGeometry(7, 15);
// groundGeometry.rotateX(-Math.PI / 2);
// const groundMaterial = new THREE.MeshStandardMaterial({
//   color: 0x000000,
//   side: THREE.DoubleSide
// });
// const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
// groundMesh.castShadow = false;
// groundMesh.receiveShadow = true;
// scene.add(groundMesh);

// Додати амбієнтне світло
const ambientLight = new THREE.AmbientLight(0xfff4e5, 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xfff4e5, 21115, 100, 0.1, 0.5);
spotLight.position.set(0, 40, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

// Сонце (Directional Light)
const directionalLight = new THREE.DirectionalLight(0xfff4e5, 20);
directionalLight.position.set(10, 50, 10);
directionalLight.castShadow = true;

// Налаштування камери тіней для обмеження області освітлення
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.camera.near = 50;
directionalLight.shadow.camera.far = 50;

// Додавання світла на сцену
scene.add(directionalLight);

// Камера тіней для візуалізації (необов'язково, для налагодження)
// const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(helper);

// const spotLight1 = new THREE.SpotLight(0xffffff, 30000, 100, 0.2, 0.5);
// spotLight1.position.set(0, 10, 0); // Освітлення в центрі сцени
// spotLight1.castShadow = true;
// spotLight1.shadow.bias = -0.0001;
// scene.add(spotLight1);

// const spotLight2 = new THREE.SpotLight(0xffffff, 700000, 10000, 10.2, 0.5);
// spotLight2.position.set(0, 1, 30); // Освітлення в центрі сцени
// spotLight2.castShadow = true;
// spotLight2.shadow.bias = -0.0001;
// scene.add(spotLight2);
// const spotLight1 = new THREE.SpotLight(0xffffff, 3000, 100, 0.2, 0.5);
// spotLight1.position.set(10, 10, 0); // Освітлення в центрі сцени
// spotLight1.castShadow = true;
// spotLight1.shadow.bias = -20.0001;
// scene.add(spotLight1);

// const spotLight2 = new THREE.SpotLight(0xffffff, 3000, 100, 0.2, 0.5);
// spotLight2.position.set(0, 10, 10); // Освітлення в центрі сцени
// spotLight2.castShadow = true;
// spotLight2.shadow.bias = -20.0001;
// scene.add(spotLight2);

// const spotLight3 = new THREE.SpotLight(0xffffff, 3000, 100, 0.2, 0.5);
// spotLight3.position.set(0, 10, -10); // Освітлення в центрі сцени
// spotLight3.castShadow = true;
// spotLight3.shadow.bias = -20.0001;
// scene.add(spotLight3);

let mixer, doorFL, doorFR, doorRL, doorRR, doorLC, doorHood, windowDoorFR, windowDoorFL, CarWiperLeft, CarWiperRight, windowDoorRL, windowDoorRR, doorLCCylinderL, doorLCCylinderR, doorLCPistoneL, doorLCPistoneR, doorLCRodL, doorLCRodR, doorLCSpoiler1, doorLCSpoiler2, doorLCSpoiler3, doorLCSpoiler4, carstartingTrip;

const loader = new GLTFLoader().setPath('tesla-model/');
loader.load('scene.gltf', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  mesh.scale.set(2, 2, 2);
  mesh.position.set(0, 0.65, 0);
  scene.add(mesh);

  // // Автоматичне позиціювання камери
  // const boundingBox = new THREE.Box3().setFromObject(mesh);
  // const center = boundingBox.getCenter(new THREE.Vector3());
  // const size = boundingBox.getSize(new THREE.Vector3());
  // const maxSize = Math.max(size.x, size.y, size.z);



  // Встановлюємо камеру по центру сцени
  camera.position.set(4, 2, 10); // Налаштуйте параметри (x, y, z) під свої потреби
  controls.target.set(0, 0.7, 0); // Фокусуємо OrbitControls на центр сцени
  controls.update();









  // Зміщення камери вліво на 50 одиниць
  // camera.position.set(center.x + 3, center.y + maxSize / 5, center.z + maxSize + 2);
  // controls.target.copy(center); // Орієнтуємо OrbitControls на центр моделі

  // controls.update();

  // Анімації
  mixer = new THREE.AnimationMixer(mesh);
  doorFL = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDFrontLeftDoorAction'));
  doorFR = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDFrontRightDoorAction'));
  doorRL = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDRearLeftDoorAction'));
  doorRR = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDRearRightDoorAction'));
  doorLC = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDLuggageCompartmentAction'));
  doorLCSpoiler1 = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDCarSpoiler1Action'));
  doorLCSpoiler2 = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDCarSpoiler2Action'));
  doorLCSpoiler3 = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDCarSpoiler3Action'));
  doorLCSpoiler4 = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDCarSpoiler4Action'));
  doorLCCylinderL = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDShockAbsorberCylinderLeftAction'));
  doorLCCylinderR = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDShockAbsorberCylinderRightAction'));
  doorLCPistoneL = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDShockAbsorberPistonLeftAction'));
  doorLCPistoneR = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDShockAbsorberPistonRightAction'));
  doorLCRodL = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDShockAbsorberPistonRodLeftAction'));
  doorLCRodR = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDShockAbsorberPistonRodRightAction'));
  doorHood = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDHoodAction'));
  windowDoorFL = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDWindowFrontLeftDoorAction'));
  windowDoorFR = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDWindowFrontRightDoorAction'));
  windowDoorRL = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDWindowRearLeftDoorAction'));
  windowDoorRR = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDWindowRearRightDoorAction'));
  CarWiperLeft = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDCarWiperLeftAction'));
  CarWiperRight = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDCarWiperRightAction'));
  carstartingTrip = mixer.clipAction(gltf.animations.find(clip => clip.name === '$ColladaAutoName$_0Action'));

  // Перевіряємо та запускаємо анімації
  if (carstartingTrip) {
    carstartingTrip.clampWhenFinished = true;
    carstartingTrip.loop = THREE.LoopOnce;
    carstartingTrip.play(); // Запуск анімації
  }

  [doorFL, doorFR, doorRL, doorRR, doorLC, doorHood, windowDoorFR, windowDoorFL, CarWiperLeft, CarWiperRight, windowDoorRL, windowDoorRR, doorLCCylinderL, doorLCCylinderR, doorLCPistoneL, doorLCPistoneR, doorLCRodL, doorLCRodR, doorLCSpoiler1, doorLCSpoiler2, doorLCSpoiler3, doorLCSpoiler4, carstartingTrip].forEach(action => {
    if (action) {
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }
  });

  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});

const toggleDoorButtonRL = document.getElementById('toggleDoorButtonRL');
const toggleDoorButtonRR = document.getElementById('toggleDoorButtonRR');
const toggleDoorButtonLC = document.getElementById('toggleDoorButtonLC');
const toggleDoorButtonHood = document.getElementById('toggleDoorButtonHood');
// const toggleDoorButtonWipers = document.getElementById('toggleDoorButtonWipers');
const toggleDoorButtonWindowFL = document.getElementById('toggleDoorButtonWindowFL');
const toggleDoorButtonWindowFR = document.getElementById('toggleDoorButtonWindowFR');
const toggleDoorButtonWindowRL = document.getElementById('toggleDoorButtonWindowRL');
const toggleDoorButtonWindowRR = document.getElementById('toggleDoorButtonWindowRR');
const toggleDoorButtonFL = document.getElementById('toggleDoorButtonFL');
const toggleDoorButtonFR = document.getElementById('toggleDoorButtonFR');

// Стан дверей: true - відкриті, false - закриті
const doorStates = {
  FL: false,
  FR: false,
  RL: false,
  RR: false,
  LC: false,
  H: false,
  Wipers: false,
  WindowFR: false,
  WindowFL: false,
  WindowRL: false,
  WindowRR: false
};

// Функція для часткового відкриття вікна
function openWindowPartial(windowAction, percentage) {
  const duration = windowAction.getClip().duration;
  const partialDuration = duration * percentage;

  windowAction.timeScale = 1;
  windowAction.paused = false;
  windowAction.play();
  setTimeout(() => {
    windowAction.paused = true;
  }, partialDuration * 1000);
}

// function closeWindowPartial(windowAction, percentage) {
//   const duration = windowAction.getClip().duration;
//   const partialDuration = duration * percentage;

//   windowAction.timeScale = -1;
//   windowAction.play();
//   setTimeout(() => {
//     windowAction.paused = true;
//   }, partialDuration * 1000);
// }

const listener = new THREE.AudioListener();
camera.add(listener);

// Звуки для передніх дверей
const openSoundFront = new THREE.Audio(listener);
const closeSoundFront = new THREE.Audio(listener);

// Звуки для задніх дверей
const openSoundRear = new THREE.Audio(listener);
const closeSoundRear = new THREE.Audio(listener);

// Звуки для капота
const openSoundH = new THREE.Audio(listener);
const closeSoundH = new THREE.Audio(listener);

// Звуки для багажника
const openSoundLC = new THREE.Audio(listener);
const closeSoundLC = new THREE.Audio(listener);

// Звуки для вікое
const openSoundWindow = new THREE.Audio(listener);
const closeSoundWindow = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();

// Завантаження звуків для передніх дверей
audioLoader.load('mp3/doorOpenFront.mp3', function (buffer) {
  openSoundFront.setBuffer(buffer);
  openSoundFront.setVolume(0.5);
});

audioLoader.load('mp3/doorCloseFront.mp3', function (buffer) {
  closeSoundFront.setBuffer(buffer);
  closeSoundFront.setVolume(0.3);
});

// Завантаження звуків для задніх дверей
audioLoader.load('mp3/doorOpenRear.mp3', function (buffer) {
  openSoundRear.setBuffer(buffer);
  openSoundRear.setVolume(0.3);
});

audioLoader.load('mp3/doorCloseRear.mp3', function (buffer) {
  closeSoundRear.setBuffer(buffer);
  closeSoundRear.setVolume(0.5);
});

// Завантаження звуків для капота
audioLoader.load('mp3/doorOpenH.mp3', function (buffer) {
  openSoundH.setBuffer(buffer);
  openSoundH.setVolume(0.7);
});

audioLoader.load('mp3/doorCloseH.mp3', function (buffer) {
  closeSoundH.setBuffer(buffer);
  closeSoundH.setVolume(0.5);
});

// Завантаження звуків для багажника
audioLoader.load('mp3/doorOpenLC.mp3', function (buffer) {
  openSoundLC.setBuffer(buffer);
  openSoundLC.setVolume(0.5);
});

audioLoader.load('mp3/doorCloseLC.mp3', function (buffer) {
  closeSoundLC.setBuffer(buffer);
  closeSoundLC.setVolume(0.5);
});

// Завантаження звуків для вікон
audioLoader.load('mp3/windowOpen.mp3', function (buffer) {
  openSoundWindow.setBuffer(buffer);
  openSoundWindow.setVolume(0.4);
});

audioLoader.load('mp3/windowClose.mp3', function (buffer) {
  closeSoundWindow.setBuffer(buffer);
  closeSoundWindow.setVolume(0.4);
});

// Передні ліві двері (FL)
toggleDoorButtonFL.addEventListener('click', () => {
  if (doorFL && windowDoorFL) {
    if (doorStates.FL) {
      doorFL.timeScale = -2;
      doorFL.paused = false;
      doorFL.play();

      setTimeout(() => {
        closeSoundFront.play();
      }, doorFL.getClip().duration * 430);

      setTimeout(() => {
        windowDoorFL.timeScale = - 1;
        windowDoorFL.paused = false;
        windowDoorFL.play(0.15);
        doorStates.WindowFL = false;
      }, doorFL.getClip().duration * 1000);

      doorStates.FL = false;
    } else {
      openWindowPartial(windowDoorFL, 0.15);

      setTimeout(() => {
        openSoundFront.play();
      }, 150);

      setTimeout(() => {
        doorFL.timeScale = 2;
        doorFL.paused = false;
        doorFL.play();
      }, 150);

      doorStates.FL = true;
    }
  }
});

// Передні праві двері (FR)
toggleDoorButtonFR.addEventListener('click', () => {
  if (doorFR && windowDoorFR) {
    if (doorStates.FR) {
      doorFR.timeScale = -2;
      doorFR.paused = false;
      doorFR.play();

      setTimeout(() => {
        closeSoundFront.play();
      }, doorFR.getClip().duration * 430);

      setTimeout(() => {
        windowDoorFR.timeScale = -1;
        windowDoorFR.paused = false;
        windowDoorFR.play();
        doorStates.WindowFR = false;
      }, doorFR.getClip().duration * 1000);

      doorStates.FR = false;
    } else {
      openWindowPartial(windowDoorFR, 0.15);

      setTimeout(() => {
        openSoundFront.play();
      }, 150);

      setTimeout(() => {
        doorFR.timeScale = 2;
        doorFR.paused = false;
        doorFR.play();
      }, 150);

      doorStates.FR = true;
    }
  }
});

// Задні ліві двері (RL)
toggleDoorButtonRL.addEventListener('click', () => {
  if (doorRL) {
    if (doorStates.RL) {
      doorRL.timeScale = -1;
      doorRL.paused = false;
      doorRL.play();

      setTimeout(() => {
        closeSoundRear.play();
      }, doorRL.getClip().duration * 1000);

      doorStates.RL = false;
    } else {
      doorRL.timeScale = 1;
      doorRL.paused = false;
      doorRL.play();

      setTimeout(() => {
        openSoundRear.play();
      }, 150);

      doorStates.RL = true;
    }
  }
});

// Задні праві двері (RR)
toggleDoorButtonRR.addEventListener('click', () => {
  if (doorRR) {
    if (doorStates.RR) {
      doorRR.timeScale = -1;
      doorRR.paused = false;
      doorRR.play();

      setTimeout(() => {
        closeSoundRear.play();
      }, doorRR.getClip().duration * 1000);

      doorStates.RR = false;
    } else {
      doorRR.timeScale = 1;
      doorRR.paused = false;
      doorRR.play();

      setTimeout(() => {
        openSoundRear.play();
      }, 150);

      doorStates.RR = true;
    }
  }
});

// Багажник (LC)
toggleDoorButtonLC.addEventListener('click', () => {
  if (doorLC && doorLCCylinderL && doorLCCylinderR && doorLCPistoneL && doorLCPistoneR && doorLCRodL && doorLCRodR && doorLCSpoiler1 && doorLCSpoiler2 && doorLCSpoiler3 && doorLCSpoiler4) {
    if (doorStates.LC) {
      // Анімації для всіх елементів, окрім спойлера
      doorLC.timeScale = -1;
      doorLC.paused = false;
      doorLC.play();
      doorLCCylinderL.timeScale = -1;
      doorLCCylinderL.paused = false;
      doorLCCylinderL.play();
      doorLCCylinderR.timeScale = -1;
      doorLCCylinderR.paused = false;
      doorLCCylinderR.play();
      doorLCPistoneL.timeScale = -1;
      doorLCPistoneL.paused = false;
      doorLCPistoneL.play();
      doorLCPistoneR.timeScale = -1;
      doorLCPistoneR.paused = false;
      doorLCPistoneR.play();
      doorLCRodL.timeScale = -1;
      doorLCRodL.paused = false;
      doorLCRodL.play();
      doorLCRodR.timeScale = -1;
      doorLCRodR.paused = false;
      doorLCRodR.play();

      // Відтермінування запуску анімації для спойлера
      setTimeout(() => {
        doorLCSpoiler1.timeScale = -1;
        doorLCSpoiler1.paused = false;
        doorLCSpoiler1.play();
        doorLCSpoiler2.timeScale = -1;
        doorLCSpoiler2.paused = false;
        doorLCSpoiler2.play();
        doorLCSpoiler3.timeScale = -1;
        doorLCSpoiler3.paused = false;
        doorLCSpoiler3.play();
        doorLCSpoiler4.timeScale = -1;
        doorLCSpoiler4.paused = false;
        doorLCSpoiler4.play();
      }, 5000); // Затримка на 1 секунду перед запуском анімації спойлера

      closeSoundLC.play();

      doorStates.LC = false;
    } else {
      // Анімації для всіх елементів
      doorLC.timeScale = 1;
      doorLC.paused = false;
      doorLC.play();
      doorLCCylinderL.timeScale = 1;
      doorLCCylinderL.paused = false;
      doorLCCylinderL.play();
      doorLCCylinderR.timeScale = 1;
      doorLCCylinderR.paused = false;
      doorLCCylinderR.play();
      doorLCPistoneL.timeScale = 1;
      doorLCPistoneL.paused = false;
      doorLCPistoneL.play();
      doorLCPistoneR.timeScale = 1;
      doorLCPistoneR.paused = false;
      doorLCPistoneR.play();
      doorLCRodL.timeScale = 1;
      doorLCRodL.paused = false;
      doorLCRodL.play();
      doorLCRodR.timeScale = 1;
      doorLCRodR.paused = false;
      doorLCRodR.play();

      // Спойлер відкривається без затримки
      doorLCSpoiler1.timeScale = 1;
      doorLCSpoiler1.paused = false;
      doorLCSpoiler1.play();
      doorLCSpoiler2.timeScale = 1;
      doorLCSpoiler2.paused = false;
      doorLCSpoiler2.play();
      doorLCSpoiler3.timeScale = 1;
      doorLCSpoiler3.paused = false;
      doorLCSpoiler3.play();
      doorLCSpoiler4.timeScale = 1;
      doorLCSpoiler4.paused = false;
      doorLCSpoiler4.play();

      setTimeout(() => {
        openSoundLC.play();
      }, 150);

      doorStates.LC = true;
    }
  }
});

// Капот (Hood)
toggleDoorButtonHood.addEventListener('click', () => {
  if (doorHood) {
    if (doorStates.H) {
      doorHood.timeScale = -1;
      doorHood.paused = false;
      doorHood.play();

      setTimeout(() => {
        closeSoundH.play();
      }, doorHood.getClip().duration * 1000);

      doorStates.H = false;
    } else {
      doorHood.timeScale = 1;
      doorHood.paused = false;
      doorHood.play();

      setTimeout(() => {
        openSoundH.play();
      }, 150);

      doorStates.H = true;
    }
  }
});

// Двірники (Wrapers)
let isAnimating = {
  buttonDelay2s: false,
  buttonDelay3s: false,
  buttonDelay5s: false,
  buttonOneTime: false,
};

let isAnimationRunning = {
  buttonDelay2s: false,
  buttonDelay3s: false,
  buttonDelay5s: false,
  buttonOneTime: false,
};

function animateWipersWithDelay(delay, speed, buttonId, oneTime = false) {
  if (CarWiperLeft && CarWiperRight) {
    for (const key in isAnimating) {
      if (key !== buttonId && isAnimating[key]) {
        isAnimating[key] = false;
        isAnimationRunning[key] = false;
      }
    }

    if (!isAnimating[buttonId] || isAnimationRunning[buttonId]) return;

    isAnimationRunning[buttonId] = true;

    CarWiperLeft.timeScale = speed;
    CarWiperRight.timeScale = speed;
    CarWiperLeft.paused = false;
    CarWiperRight.paused = false;
    CarWiperLeft.play();
    CarWiperRight.play();

    setTimeout(() => {
      CarWiperLeft.timeScale = -speed;
      CarWiperRight.timeScale = -speed;
      CarWiperLeft.paused = false;
      CarWiperRight.paused = false;
      CarWiperLeft.play();
      CarWiperRight.play();

      setTimeout(() => {
        isAnimationRunning[buttonId] = false;

        if (!oneTime) {
          if (isAnimating[buttonId]) {
            setTimeout(() => {
              animateWipersWithDelay(delay, speed, buttonId);
            }, delay);
          }
        } else {
          isAnimating[buttonId] = false;
          isAnimationRunning[buttonId] = false;
        }
      }, CarWiperLeft.getClip().duration * 1000 / speed);
    }, CarWiperLeft.getClip().duration * 1000 / speed);
  }
}

document.getElementById('buttonFirstModeWrapers').addEventListener('click', () => {
  isAnimating.buttonFirstModeWrapers = !isAnimating.buttonFirstModeWrapers;
  if (isAnimating.buttonFirstModeWrapers) {
    animateWipersWithDelay(600, 3, 'buttonFirstModeWrapers');
  }
});

document.getElementById('buttonSecondModeWrapers').addEventListener('click', () => {
  isAnimating.buttonSecondModeWrapers = !isAnimating.buttonSecondModeWrapers;
  if (isAnimating.buttonSecondModeWrapers) {
    animateWipersWithDelay(300, 3.7, 'buttonSecondModeWrapers');
  }
});

document.getElementById('buttonThirdModeWrapers').addEventListener('click', () => {
  isAnimating.buttonThirdModeWrapers = !isAnimating.buttonThirdModeWrapers;
  if (isAnimating.buttonThirdModeWrapers) {
    animateWipersWithDelay(0, 4.7, 'buttonThirdModeWrapers');
  }
});

document.getElementById('buttonFirstModeWrapersOne').addEventListener('click', () => {
  if (!isAnimating.buttonFirstModeWrapersOne) {
    isAnimating.buttonFirstModeWrapersOne = true;
    animateWipersWithDelay(600, 3, 'buttonFirstModeWrapersOne', true);
  }
});

// Вікно переднє ліве
toggleDoorButtonWindowFL.addEventListener('click', () => {
  if (windowDoorFL) {
    if (doorStates.WindowFL) {
      windowDoorFL.timeScale = -1;
      windowDoorFL.paused = false;
      windowDoorFL.play();

      closeSoundWindow.play();

      doorStates.WindowFL = false;
    } else {
      windowDoorFL.timeScale = 1;
      windowDoorFL.paused = false;
      windowDoorFL.play();

      openSoundWindow.play();

      doorStates.WindowFL = true;
    }
  }
});

// Вікно переднє праве
toggleDoorButtonWindowFR.addEventListener('click', () => {
  if (windowDoorFR) {
    if (doorStates.WindowFR) {
      windowDoorFR.timeScale = -1;
      windowDoorFR.paused = false;
      windowDoorFR.play();

      closeSoundWindow.play();

      doorStates.WindowFR = false;
    } else {
      windowDoorFR.timeScale = 1;
      windowDoorFR.paused = false;
      windowDoorFR.play();

      openSoundWindow.play();

      doorStates.WindowFR = true;
    }
  }
});

// Вікно заднє ліве
toggleDoorButtonWindowRL.addEventListener('click', () => {
  if (windowDoorRL) {
    if (doorStates.WindowRL) {
      windowDoorRL.timeScale = -1;
      windowDoorRL.paused = false;
      windowDoorRL.play();

      closeSoundWindow.play();

      doorStates.WindowRL = false;
    } else {
      windowDoorRL.timeScale = 1;
      windowDoorRL.paused = false;
      windowDoorRL.play();

      openSoundWindow.play();

      doorStates.WindowRL = true;
    }
  }
});

// Вікно заднє праве
toggleDoorButtonWindowRR.addEventListener('click', () => {
  if (windowDoorRR) {
    if (doorStates.WindowRR) {
      windowDoorRR.timeScale = -1;
      windowDoorRR.paused = false;
      windowDoorRR.play();

      closeSoundWindow.play();

      doorStates.WindowRR = false;
    } else {
      windowDoorRR.timeScale = 1;
      windowDoorRR.paused = false;
      windowDoorRR.play();

      openSoundWindow.play();

      doorStates.WindowRR = true;
    }
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  controls.update();
  renderer.render(scene, camera);
}

animate();