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

const groundGeometry = new THREE.CircleGeometry(7, 320);
groundGeometry.rotateX(-Math.PI / 2);

const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh);

const ambientLight = new THREE.AmbientLight(0xfff4e5, 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xfff4e5, 21115, 100, 0.1, 0.5);
spotLight.position.set(0, 40, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const directionalLight = new THREE.DirectionalLight(0xfff4e5, 20);
directionalLight.position.set(10, 50, 10);
directionalLight.castShadow = true;

directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.camera.near = 50;
directionalLight.shadow.camera.far = 50;

scene.add(directionalLight);

let mixer, doorFL, doorFR, doorRL, doorRR, doorLC, doorHood, windowDoorFR, windowDoorFL, carWiperLeft, carWiperRight, windowDoorRL, windowDoorRR, doorLCCylinderL, doorLCCylinderR, doorLCPistoneL, doorLCPistoneR, doorLCRodL, doorLCRodR, doorLCSpoiler1, doorLCSpoiler2, doorLCSpoiler3, doorLCSpoiler4, carStartingTrip, carStartingTripFLWheel, carStartingTripFRWheel, carStartingTripFLDisc, carStartingTripFRDisc, carStartingTripRLDisc, carStartingTripRRDisc, suspensionCar, suspensionFLWheel, suspensionFRWheel, suspensionRLWheel, suspensionRRWheel;

const loader = new GLTFLoader().setPath('tesla-model/');
loader.load('scene.gltf', (gltf) => {
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

  camera.position.set(4, 2, 10);
  controls.target.set(0, 0.7, 0);
  controls.update();

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
  carWiperLeft = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDCarWiperLeftAction'));
  carWiperRight = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDCarWiperRightAction'));
  carStartingTrip = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDCarStartingTripAction'));
  carStartingTripFLWheel = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDFrontLeftWheelAction'));
  carStartingTripFRWheel = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDFrontRightWheelAction'));
  carStartingTripFLDisc = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDFrontLeftDiscAction'));
  carStartingTripFRDisc = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDFrontRightDiscAction'));
  carStartingTripRLDisc = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDRearLeftDiscAction'));
  carStartingTripRRDisc = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDRearRightDiscAction'));
  suspensionCar = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDSuspensionCarAction'));
  suspensionFLWheel = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDSuspensionFLWheelAction'));
  suspensionFRWheel = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDSuspensionFRWheelAction'));
  suspensionRLWheel = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDSuspensionRLWheelAction'));
  suspensionRRWheel = mixer.clipAction(gltf.animations.find(clip => clip.name === 'IDSuspensionRRWheelAction'));

  [doorFL, doorFR, doorRL, doorRR, doorLC, doorHood, windowDoorFR, windowDoorFL, carWiperLeft, carWiperRight, windowDoorRL, windowDoorRR, doorLCCylinderL, doorLCCylinderR, doorLCPistoneL, doorLCPistoneR, doorLCRodL, doorLCRodR, doorLCSpoiler1, doorLCSpoiler2, doorLCSpoiler3, doorLCSpoiler4, suspensionCar, suspensionFLWheel, suspensionFRWheel, suspensionRLWheel, suspensionRRWheel].forEach(action => {
    if (action) {
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }
  });

  function showConfirmationModal() {
    const confirmationModal = document.getElementById('confirmation-modal');
    confirmationModal.style.display = 'block';
  }

  showConfirmationModal();

  document.getElementById('confirm-sound').addEventListener('click', () => {

    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const loadModel = new Promise((resolve, reject) => {
      let xhr = { loaded: 0, total: 100 };
      let interval = setInterval(() => {
        if (xhr.loaded < xhr.total) {
          xhr.loaded += 1;
          const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
          progressText.textContent = `Loading ${percentComplete}%`;
          progressFill.style.width = `${percentComplete}%`;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });

    loadModel.then(() => {
      if (progressContainer) {
        setTimeout(() => {
          progressContainer.style.display = 'none';
          startAnimations();
          startCarSound.play();

        }, 500);
      }
    }).catch((error) => {
      console.error('Error loading model:', error);
      if (progressContainer) {
        progressContainer.style.display = 'none';
      }
    });

    document.getElementById('confirmation-modal').style.display = 'none';
  });

  document.getElementById('cancel-sound').addEventListener('click', () => {
    document.getElementById('confirmation-modal').style.display = 'none';
  });
});

function startAnimations() {
  if (carStartingTrip && carStartingTripFLWheel && carStartingTripFLDisc && carStartingTripFRDisc && carStartingTripRLDisc && carStartingTripRRDisc) {
    carStartingTrip.clampWhenFinished = true;
    carStartingTrip.loop = THREE.LoopOnce;
    carStartingTrip.play();

    carStartingTripFLWheel.clampWhenFinished = true;
    carStartingTripFLWheel.loop = THREE.LoopOnce;
    carStartingTripFLWheel.play();

    carStartingTripFRWheel.clampWhenFinished = true;
    carStartingTripFRWheel.loop = THREE.LoopOnce;
    carStartingTripFRWheel.play();

    carStartingTripFLDisc.clampWhenFinished = true;
    carStartingTripFLDisc.loop = THREE.LoopOnce;
    carStartingTripFLDisc.play();

    carStartingTripFRDisc.clampWhenFinished = true;
    carStartingTripFRDisc.loop = THREE.LoopOnce;
    carStartingTripFRDisc.play();

    carStartingTripRLDisc.clampWhenFinished = true;
    carStartingTripRLDisc.loop = THREE.LoopOnce;
    carStartingTripRLDisc.play();

    carStartingTripRRDisc.clampWhenFinished = true;
    carStartingTripRRDisc.loop = THREE.LoopOnce;
    carStartingTripRRDisc.play();
  }
}

const toggleDoorButtonRL = document.getElementById('toggleDoorButtonRL');
const toggleDoorButtonRR = document.getElementById('toggleDoorButtonRR');
const toggleDoorButtonLC = document.getElementById('toggleDoorButtonLC');
const toggleDoorButtonHood = document.getElementById('toggleDoorButtonHood');
const toggleDoorButtonWindowFL = document.getElementById('toggleDoorButtonWindowFL');
const toggleDoorButtonWindowFR = document.getElementById('toggleDoorButtonWindowFR');
const toggleDoorButtonWindowRL = document.getElementById('toggleDoorButtonWindowRL');
const toggleDoorButtonWindowRR = document.getElementById('toggleDoorButtonWindowRR');
const toggleDoorButtonFL = document.getElementById('toggleDoorButtonFL');
const toggleDoorButtonFR = document.getElementById('toggleDoorButtonFR');
const toggleDoorButtonWindowFLCalibrate = document.getElementById('toggleDoorButtonWindowFLCalibrate');
const toggleDoorButtonWindowFRCalibrate = document.getElementById('toggleDoorButtonWindowFRCalibrate');
const toggleDoorButtonWindowRLCalibrate = document.getElementById('toggleDoorButtonWindowRLCalibrate');
const toggleDoorButtonWindowRRCalibrate = document.getElementById('toggleDoorButtonWindowRRCalibrate');
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

const listener = new THREE.AudioListener();
camera.add(listener);

const openSoundFront = new THREE.Audio(listener);
const closeSoundFront = new THREE.Audio(listener);
const openSoundRear = new THREE.Audio(listener);
const closeSoundRear = new THREE.Audio(listener);
const openSoundH = new THREE.Audio(listener);
const closeSoundH = new THREE.Audio(listener);
const openSoundLC = new THREE.Audio(listener);
const closeSoundLC = new THREE.Audio(listener);
const openSoundWindow = new THREE.Audio(listener);
const closeSoundWindow = new THREE.Audio(listener);
const suspensionSoundForward = new THREE.Audio(listener);
const suspensionSoundReverse = new THREE.Audio(listener);
const wrapersSound = new THREE.Audio(listener);
const startCarSound = new THREE.Audio(listener);


const audioLoader = new THREE.AudioLoader();
audioLoader.load('mp3/start-car.mp3', function (buffer) {
  startCarSound.setBuffer(buffer);
  startCarSound.setVolume(1);
});
audioLoader.load('mp3/doorOpenFront.mp3', function (buffer) {
  openSoundFront.setBuffer(buffer);
  openSoundFront.setVolume(0.5);
});
audioLoader.load('mp3/doorCloseFront.mp3', function (buffer) {
  closeSoundFront.setBuffer(buffer);
  closeSoundFront.setVolume(0.3);
});
audioLoader.load('mp3/doorOpenRear.mp3', function (buffer) {
  openSoundRear.setBuffer(buffer);
  openSoundRear.setVolume(0.3);
});
audioLoader.load('mp3/doorCloseRear.mp3', function (buffer) {
  closeSoundRear.setBuffer(buffer);
  closeSoundRear.setVolume(0.5);
});
audioLoader.load('mp3/doorOpenH.mp3', function (buffer) {
  openSoundH.setBuffer(buffer);
  openSoundH.setVolume(0.7);
});
audioLoader.load('mp3/doorCloseH.mp3', function (buffer) {
  closeSoundH.setBuffer(buffer);
  closeSoundH.setVolume(0.5);
});
audioLoader.load('mp3/doorOpenLC.mp3', function (buffer) {
  openSoundLC.setBuffer(buffer);
  openSoundLC.setVolume(0.5);
});
audioLoader.load('mp3/doorCloseLC.mp3', function (buffer) {
  closeSoundLC.setBuffer(buffer);
  closeSoundLC.setVolume(0.5);
});
audioLoader.load('mp3/windowOpen.mp3', function (buffer) {
  openSoundWindow.setBuffer(buffer);
  openSoundWindow.setVolume(0.4);
});
audioLoader.load('mp3/windowClose.mp3', function (buffer) {
  closeSoundWindow.setBuffer(buffer);
  closeSoundWindow.setVolume(0.4);
});
audioLoader.load('mp3/suspension.mp3', function (buffer) {
  suspensionSoundForward.setBuffer(buffer);
  suspensionSoundForward.setVolume(0.3);
  suspensionSoundForward.setLoop(false);
});
audioLoader.load('mp3/suspension.mp3', function (buffer) {
  suspensionSoundReverse.setBuffer(buffer);
  suspensionSoundReverse.setVolume(0.3);
  suspensionSoundReverse.setLoop(false);
});
audioLoader.load('mp3/wrapers.mp3', function (buffer) {
  wrapersSound.setBuffer(buffer);
  wrapersSound.setVolume(0.4);
});

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

toggleDoorButtonRL.addEventListener('click', () => {
  if (doorRL) {
    if (doorStates.RL) {
      doorRL.timeScale = -1;
      doorRL.paused = false;
      doorRL.play();

      setTimeout(() => {
        closeSoundRear.play();
      }, 3630);

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

toggleDoorButtonRR.addEventListener('click', () => {
  if (doorRR) {
    if (doorStates.RR) {
      doorRR.timeScale = -1;
      doorRR.paused = false;
      doorRR.play();

      setTimeout(() => {
        closeSoundRear.play();
      }, 3630);

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

toggleDoorButtonLC.addEventListener('click', () => {
  if (doorLC && doorLCCylinderL && doorLCCylinderR && doorLCPistoneL && doorLCPistoneR && doorLCRodL && doorLCRodR && doorLCSpoiler1 && doorLCSpoiler2 && doorLCSpoiler3 && doorLCSpoiler4) {
    if (doorStates.LC) {
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
      }, 5300);

      closeSoundLC.play();

      doorStates.LC = false;
    } else {
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
      }, 70);

      doorStates.LC = true;
    }
  }
});

toggleDoorButtonHood.addEventListener('click', () => {
  if (doorHood) {
    if (doorStates.H) {
      doorHood.timeScale = -1;
      doorHood.paused = false;
      doorHood.play();

      setTimeout(() => {
        closeSoundH.play();
      }, 3650);

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

let isAnimating = {
  buttonFirstModeWrapers: false,
  buttonSecondModeWrapers: false,
  buttonThirdModeWrapers: false,
  buttonFirstModeWrapersOne: false,
};

let isAnimationRunning = {
  buttonFirstModeWrapers: false,
  buttonSecondModeWrapers: false,
  buttonThirdModeWrapers: false,
  buttonFirstModeWrapersOne: false,
};

function animateWipersWithDelay(delay, speed, buttonId, oneTime = false, soundSpeed = 1) {
  if (carWiperLeft && carWiperRight) {
    for (const key in isAnimating) {
      if (key !== buttonId && isAnimating[key]) {
        isAnimating[key] = false;
        isAnimationRunning[key] = false;
      }
    }

    if (!isAnimating[buttonId] || isAnimationRunning[buttonId]) return;

    isAnimationRunning[buttonId] = true;

    wrapersSound.playbackRate = soundSpeed;
    wrapersSound.play();

    carWiperLeft.timeScale = speed;
    carWiperRight.timeScale = speed;
    carWiperLeft.paused = false;
    carWiperRight.paused = false;
    carWiperLeft.play();
    carWiperRight.play();

    setTimeout(() => {
      carWiperLeft.timeScale = -speed;
      carWiperRight.timeScale = -speed;
      carWiperLeft.paused = false;
      carWiperRight.paused = false;
      carWiperLeft.play();
      carWiperRight.play();

      setTimeout(() => {
        isAnimationRunning[buttonId] = false;

        if (!oneTime) {
          if (isAnimating[buttonId]) {
            setTimeout(() => {
              animateWipersWithDelay(delay, speed, buttonId, false, soundSpeed);
            }, delay);
          }
        } else {
          isAnimating[buttonId] = false;
          isAnimationRunning[buttonId] = false;
        }
      }, carWiperLeft.getClip().duration * 1000 / speed);
    }, carWiperLeft.getClip().duration * 1000 / speed);
  }
}

document.getElementById('buttonFirstModeWrapers').addEventListener('click', () => {
  isAnimating.buttonFirstModeWrapers = !isAnimating.buttonFirstModeWrapers;
  if (isAnimating.buttonFirstModeWrapers) {
    animateWipersWithDelay(600, 3, 'buttonFirstModeWrapers', false, 0.65);
  }
});

document.getElementById('buttonSecondModeWrapers').addEventListener('click', () => {
  isAnimating.buttonSecondModeWrapers = !isAnimating.buttonSecondModeWrapers;
  if (isAnimating.buttonSecondModeWrapers) {
    animateWipersWithDelay(300, 3.7, 'buttonSecondModeWrapers', false, 0.8);
  }
});

document.getElementById('buttonThirdModeWrapers').addEventListener('click', () => {
  isAnimating.buttonThirdModeWrapers = !isAnimating.buttonThirdModeWrapers;
  if (isAnimating.buttonThirdModeWrapers) {
    animateWipersWithDelay(0, 4.7, 'buttonThirdModeWrapers', false, 1.03);
  }
});

document.getElementById('buttonFirstModeWrapersOne').addEventListener('click', () => {
  if (!isAnimating.buttonFirstModeWrapersOne) {
    isAnimating.buttonFirstModeWrapersOne = true;
    animateWipersWithDelay(600, 3, 'buttonFirstModeWrapersOne', true, 0.65);
  }
});

toggleDoorButtonWindowFL.addEventListener('click', () => {
  if (windowDoorFL) {
    if (doorStates.WindowFL) {
      windowDoorFL.timeScale = -0.5;
      windowDoorFL.paused = false;
      windowDoorFL.play();

      closeSoundWindow.playbackRate = 1.35;
      setTimeout(() => {
        closeSoundWindow.play();
      }, 150);

      doorStates.WindowFL = false;
    } else {
      windowDoorFL.timeScale = 0.5;
      windowDoorFL.paused = false;
      windowDoorFL.play();

      openSoundWindow.playbackRate = 1;
      setTimeout(() => {
        openSoundWindow.play();
      }, 150);

      doorStates.WindowFL = true;
    }
  }
});

toggleDoorButtonWindowFLCalibrate.addEventListener('click', () => {
  if (windowDoorFL) {
    windowDoorFL.timeScale = 1;
    windowDoorFL.paused = false;
    windowDoorFL.play();

    openSoundWindow.playbackRate = 1.9;
    setTimeout(() => {
      openSoundWindow.play();
    }, 150);

    setTimeout(() => {
      windowDoorFL.timeScale = -1;
      windowDoorFL.play();

      closeSoundWindow.playbackRate = 2.7;
      setTimeout(() => {
        closeSoundWindow.play();
      }, 150);

      setTimeout(() => {
        windowDoorFL.timeScale = 0.5;
        windowDoorFL.paused = false;
        windowDoorFL.play();

        openSoundWindow.play();

        setTimeout(() => {
          windowDoorFL.timeScale = -0.5;
          windowDoorFL.play();

          closeSoundWindow.play();

          setTimeout(() => {
            windowDoorFL.timeScale = 0.33;
            windowDoorFL.paused = false;
            windowDoorFL.play();

            openSoundWindow.play();

            setTimeout(() => {
              windowDoorFL.timeScale = -0.33;
              windowDoorFL.play();

              closeSoundWindow.play();
            }, 2000);

          }, 2400);

        }, 2000);

      }, 2400);

    }, 2400);
  }
});

toggleDoorButtonWindowFR.addEventListener('click', () => {
  if (windowDoorFR) {
    if (doorStates.WindowFR) {
      windowDoorFR.timeScale = -0.5;
      windowDoorFR.paused = false;
      windowDoorFR.play();

      closeSoundWindow.playbackRate = 1.35;
      setTimeout(() => {
        closeSoundWindow.play();
      }, 150);

      doorStates.WindowFR = false;
    } else {
      windowDoorFR.timeScale = 0.5;
      windowDoorFR.paused = false;
      windowDoorFR.play();

      openSoundWindow.playbackRate = 1;
      setTimeout(() => {
        openSoundWindow.play();
      }, 150);

      doorStates.WindowFR = true;
    }
  }
});

toggleDoorButtonWindowFRCalibrate.addEventListener('click', () => {
  if (windowDoorFR) {
    windowDoorFR.timeScale = 1;
    windowDoorFR.paused = false;
    windowDoorFR.play();

    openSoundWindow.playbackRate = 1.9;
    setTimeout(() => {
      openSoundWindow.play();
    }, 150);

    setTimeout(() => {
      windowDoorFR.timeScale = -1;
      windowDoorFR.play();

      closeSoundWindow.playbackRate = 2.7;
      setTimeout(() => {
        closeSoundWindow.play();
      }, 150);

      setTimeout(() => {
        windowDoorFR.timeScale = 0.5;
        windowDoorFR.paused = false;
        windowDoorFR.play();

        openSoundWindow.play();

        setTimeout(() => {
          windowDoorFR.timeScale = -0.5;
          windowDoorFR.play();

          closeSoundWindow.play();

          setTimeout(() => {
            windowDoorFR.timeScale = 0.33;
            windowDoorFR.paused = false;
            windowDoorFR.play();

            openSoundWindow.play();

            setTimeout(() => {
              windowDoorFR.timeScale = -0.33;
              windowDoorFR.play();

              closeSoundWindow.play();
            }, 2000);

          }, 2400);

        }, 2000);

      }, 2400);

    }, 2400);
  }
});

toggleDoorButtonWindowRL.addEventListener('click', () => {
  if (windowDoorRL) {
    if (doorStates.WindowRL) {
      windowDoorRL.timeScale = -0.77;
      windowDoorRL.paused = false;
      windowDoorRL.play();

      closeSoundWindow.playbackRate = 1.75;
      setTimeout(() => {
        closeSoundWindow.play();
      }, 150);

      doorStates.WindowRL = false;
    } else {
      windowDoorRL.timeScale = 0.77;
      windowDoorRL.paused = false;
      windowDoorRL.play();

      openSoundWindow.playbackRate = 1;
      setTimeout(() => {
        openSoundWindow.play();
      }, 10);

      doorStates.WindowRL = true;
    }
  }
});

toggleDoorButtonWindowRLCalibrate.addEventListener('click', () => {
  if (windowDoorRL) {
    windowDoorRL.timeScale = 1;
    windowDoorRL.paused = false;
    windowDoorRL.play();

    openSoundWindow.playbackRate = 1.75;
    setTimeout(() => {
      openSoundWindow.play();
    }, 10);

    setTimeout(() => {
      windowDoorRL.timeScale = -1;
      windowDoorRL.play();

      closeSoundWindow.playbackRate = 3.55;
      setTimeout(() => {
        closeSoundWindow.play();
      }, 10);

      setTimeout(() => {
        windowDoorRL.timeScale = 1;
        windowDoorRL.paused = false;
        windowDoorRL.play();

        openSoundWindow.play();

        setTimeout(() => {
          windowDoorRL.timeScale = -1;
          windowDoorRL.play();

          closeSoundWindow.play();

          setTimeout(() => {
            windowDoorRL.timeScale = 0.75;
            windowDoorRL.paused = false;
            windowDoorRL.play();

            openSoundWindow.play();

            setTimeout(() => {
              windowDoorRL.timeScale = -0.75;
              windowDoorRL.play();

              closeSoundWindow.play();
            }, 2000);

          }, 2400);

        }, 2000);

      }, 2400);

    }, 2400);
  }
});

toggleDoorButtonWindowRR.addEventListener('click', () => {
  if (windowDoorRR) {
    if (doorStates.WindowRR) {
      windowDoorRR.timeScale = -0.77;
      windowDoorRR.paused = false;
      windowDoorRR.play();

      closeSoundWindow.playbackRate = 1.75;
      setTimeout(() => {
        closeSoundWindow.play();
      }, 150);

      doorStates.WindowRR = false;
    } else {
      windowDoorRR.timeScale = 0.77;
      windowDoorRR.paused = false;
      windowDoorRR.play();

      openSoundWindow.playbackRate = 1;
      setTimeout(() => {
        openSoundWindow.play();
      }, 10);

      doorStates.WindowRR = true;
    }
  }
});

toggleDoorButtonWindowRRCalibrate.addEventListener('click', () => {
  if (windowDoorRR) {
    windowDoorRR.timeScale = 1;
    windowDoorRR.paused = false;
    windowDoorRR.play();

    openSoundWindow.playbackRate = 1.75;
    setTimeout(() => {
      openSoundWindow.play();
    }, 10);

    setTimeout(() => {
      windowDoorRR.timeScale = -1;
      windowDoorRR.play();

      closeSoundWindow.playbackRate = 3;
      setTimeout(() => {
        closeSoundWindow.play();
      }, 10);

      setTimeout(() => {
        windowDoorRR.timeScale = 1;
        windowDoorRR.paused = false;
        windowDoorRR.play();

        openSoundWindow.play();

        setTimeout(() => {
          windowDoorRR.timeScale = -1;
          windowDoorRR.play();

          closeSoundWindow.play();

          setTimeout(() => {
            windowDoorRR.timeScale = 0.75;
            windowDoorRR.paused = false;
            windowDoorRR.play();

            openSoundWindow.play();

            setTimeout(() => {
              windowDoorRR.timeScale = -0.75;
              windowDoorRR.play();

              closeSoundWindow.play();
            }, 2000);

          }, 2400);

        }, 2000);

      }, 2400);

    }, 2400);
  }
});

let currentClearance = 2;

const clearancePercentages = {
  1: 0.0,
  2: 0.25,
  3: 0.5,
  4: 0.75,
  5: 1.0
};

function changeClearance(suspensionAction, fromPercentage, toPercentage, timeScale = 1) {
  const duration = suspensionAction.getClip().duration;
  const partialDuration = duration * Math.abs(toPercentage - fromPercentage);

  suspensionAction.time = duration * fromPercentage;
  suspensionAction.timeScale = timeScale;
  suspensionAction.paused = false;
  suspensionAction.play();

  const video = document.getElementById('myVideoMov');
  const videoDuration = video.duration;
  video.currentTime = videoDuration * fromPercentage;

  if (timeScale === 1) {
    video.play();

    if (suspensionSoundForward.isPlaying) {
      suspensionSoundForward.stop();
    }
    suspensionSoundForward.play();

  } else {
    video.pause();

    if (suspensionSoundReverse.isPlaying) {
      suspensionSoundReverse.stop();
    }
    suspensionSoundReverse.play();

    let reverseInterval = setInterval(() => {
      if (video.currentTime <= videoDuration * toPercentage) {
        clearInterval(reverseInterval);
        video.pause();
      } else {
        video.currentTime -= (videoDuration * Math.abs(toPercentage - fromPercentage)) / (partialDuration * 1000 / 20);
      }
    }, 100);
  }

  setTimeout(() => {
    suspensionAction.paused = true;
    video.pause();

    suspensionSoundForward.stop();
    suspensionSoundReverse.stop();
  }, partialDuration * 1000);
}

function animateSuspension(fromPosition, toPosition) {
  const fromPercentage = clearancePercentages[fromPosition];
  const toPercentage = clearancePercentages[toPosition];
  const timeScale = (fromPosition < toPosition) ? 1 : -1;

  if (suspensionCar && suspensionFLWheel && suspensionFRWheel && suspensionRLWheel && suspensionRRWheel) {
    [suspensionCar, suspensionFLWheel, suspensionFRWheel, suspensionRLWheel, suspensionRRWheel].forEach((suspension) => {
      suspension.paused = true;
      suspension.time = 0;

      changeClearance(suspension, fromPercentage, toPercentage, timeScale);
    });
  }
}

document.getElementById('clearanceRange').addEventListener('input', function () {
  const value = parseInt(this.value);
  const fromPercentage = clearancePercentages[currentClearance];
  const toPercentage = clearancePercentages[value];

  if (fromPercentage !== toPercentage) {
    animateSuspension(currentClearance, value);
  }

  currentClearance = value;
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clearanceRange').value = currentClearance;
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