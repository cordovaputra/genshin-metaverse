/*----------------------------------------------------------------------------------------------------------
A. 3D WORLD SETUP
In this step, we will prepare the 3D world setup for the 3D object to interact with users, or
users can interact with the 3D objects 
1. Helper function
2. 3D Renderer
3. Camera
4. Camera Control
5. World Scene & Lighting
6. Real-Time Animation
*/
const remap = Kalidokit.Utils.remap;
const clamp = Kalidokit.Utils.clamp;
const lerp = Kalidokit.Vector.lerp;

// 3D renderer3D

const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Camera Setup
const orbitCamera = new THREE.PerspectiveCamera(35,window.innerWidth / window.innerHeight,0.1,1000);
orbitCamera.position.set(0.0, 1.4, 0.7);

// Camera Control
const orbitControls = new THREE.OrbitControls(orbitCamera, renderer.domElement);
orbitControls.screenSpacePanning = true;
orbitControls.target.set(0.0, 1.4, 0.0);
orbitControls.update();

// Scene & Lighting
export const scene = new THREE.Scene();
export const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1.0, 1.0, 1.0).normalize();
scene.add(light);

// 3D Loader
const loaderAether = new THREE.GLTFLoader();
loaderAether.crossOrigin = "anonymous";

// Real-Time Animation & Interaction
const STATUS = document.getElementById('status')
let currentVrm; 
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    if (currentVrm) {
      currentVrm.update(clock.getDelta());
    }
    renderer.render(scene, orbitCamera);
  }
  animate();

/*----------------------------------------------------------------------------------------------------------
B. DRAW CHARACTER RIG 
----------------------------------------------------------------------------------------------------------*/

// 3. Configure 3D Character Rotation Animation
const rigRotation = (
    name,
    rotation = { x: 0, y: 0, z: 0 },
    dampener = 1,
    lerpAmount = 0.3
  ) => {
    if (!currentVrm) {return}
    const Part = currentVrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName[name]
    );
    if (!Part) {return}
    
    let euler = new THREE.Euler(
      rotation.x * dampener,
      rotation.y * dampener,
      rotation.z * dampener
    );
    let quaternion = new THREE.Quaternion().setFromEuler(euler);
    Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
  };

// 4. Configure 3D Character Position Animation
const rigPosition = (
    name,
    position = { x: 0, y: 0, z: 0 },
    dampener = 1,
    lerpAmount = 0.3
  ) => {
    if (!currentVrm) {return}
    const Part = currentVrm.humanoid.getBoneNode(
      THREE.VRMSchema.HumanoidBoneName[name]
    );
    if (!Part) {return}
    let vector = new THREE.Vector3(
      position.x * dampener,
      position.y * dampener,
      position.z * dampener
    );
    Part.position.lerp(vector, lerpAmount); // interpolate
  };

// 5. Configure 3D Character Face (Eye, Mouth and Pupils)
let oldLookTarget = new THREE.Euler()
const rigFace = (riggedFace) => {
    if(!currentVrm){return}
    rigRotation("Neck", riggedFace.head, 0.7);

    // Blendshapes and Preset Name Schema
    const Blendshape = currentVrm.blendShapeProxy;
    const PresetName = THREE.VRMSchema.BlendShapePresetName;
  
    // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
    // for VRM, 1 is closed, 0 is open.
    riggedFace.eye.l = lerp(clamp(1 - riggedFace.eye.l, 0, 1),Blendshape.getValue(PresetName.Blink), .5)
    riggedFace.eye.r = lerp(clamp(1 - riggedFace.eye.r, 0, 1),Blendshape.getValue(PresetName.Blink), .5)
    riggedFace.eye = Kalidokit.Face.stabilizeBlink(riggedFace.eye,riggedFace.head.y)
    Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);
    
    // Interpolate and set mouth blendshapes
    Blendshape.setValue(PresetName.I, lerp(riggedFace.mouth.shape.I,Blendshape.getValue(PresetName.I), .5));
    Blendshape.setValue(PresetName.A, lerp(riggedFace.mouth.shape.A,Blendshape.getValue(PresetName.A), .5));
    Blendshape.setValue(PresetName.E, lerp(riggedFace.mouth.shape.E,Blendshape.getValue(PresetName.E), .5));
    Blendshape.setValue(PresetName.O, lerp(riggedFace.mouth.shape.O,Blendshape.getValue(PresetName.O), .5));
    Blendshape.setValue(PresetName.U, lerp(riggedFace.mouth.shape.U,Blendshape.getValue(PresetName.U), .5));

    //PUPILS
    //interpolate pupil and keep a copy of the value
    let lookTarget =
      new THREE.Euler(
        lerp(oldLookTarget.x , riggedFace.pupil.y, .4),
        lerp(oldLookTarget.y, riggedFace.pupil.x, .4),
        0,
        "XYZ"
      )
    oldLookTarget.copy(lookTarget)
    currentVrm.lookAt.applyer.lookAt(lookTarget);
}
/*----------------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------------
C. ANIMATE 3D CHARACTER (POSE, HAND & FACE )
*/
const animateVRM = (vrm, results) => {
    if (!vrm) {
      return;
    }   
    let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;
    const faceLandmarks = results.faceLandmarks;
    const pose3DLandmarks = results.ea;
    const pose2DLandmarks = results.poseLandmarks;
    const leftHandLandmarks = results.rightHandLandmarks;
    const rightHandLandmarks = results.leftHandLandmarks;
  
    // Animate Face
    if (faceLandmarks) {
     riggedFace = Kalidokit.Face.solve(faceLandmarks,{
        runtime:"mediapipe",
        video:videoElement
     });
     rigFace(riggedFace)
    }
  
    // Animate Pose
    if (pose2DLandmarks && pose3DLandmarks) {
      riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
        runtime: "mediapipe",
        video:videoElement,
      });
      rigRotation("Hips", riggedPose.Hips.rotation, 0.7);
      rigPosition(
        "Hips",
        {
          x: -riggedPose.Hips.position.x, // Reverse direction
          y: riggedPose.Hips.position.y + 1, // Add a bit of height
          z: -riggedPose.Hips.position.z // Reverse direction
        },
        1,
        0.07
      );
  
      rigRotation("Chest", riggedPose.Spine, 0.25, .3);
      rigRotation("Spine", riggedPose.Spine, 0.45, .3);
  
      rigRotation("RightUpperArm", riggedPose.RightUpperArm, 1, .3);
      rigRotation("RightLowerArm", riggedPose.RightLowerArm, 1, .3);
      rigRotation("LeftUpperArm", riggedPose.LeftUpperArm, 1, .3);
      rigRotation("LeftLowerArm", riggedPose.LeftLowerArm, 1, .3);
  
      rigRotation("LeftUpperLeg", riggedPose.LeftUpperLeg, 1, .3);
      rigRotation("LeftLowerLeg", riggedPose.LeftLowerLeg, 1, .3);
      rigRotation("RightUpperLeg", riggedPose.RightUpperLeg, 1, .3);
      rigRotation("RightLowerLeg", riggedPose.RightLowerLeg, 1, .3);
    }
  
    // Animate Hands
    if (leftHandLandmarks) {
      riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left");
      rigRotation("LeftHand", {
        // Combine pose rotation Z and hand rotation X Y
        z: riggedPose.LeftHand.z,
        y: riggedLeftHand.LeftWrist.y,
        x: riggedLeftHand.LeftWrist.x
      });
      rigRotation("LeftRingProximal", riggedLeftHand.LeftRingProximal);
      rigRotation("LeftRingIntermediate", riggedLeftHand.LeftRingIntermediate);
      rigRotation("LeftRingDistal", riggedLeftHand.LeftRingDistal);
      rigRotation("LeftIndexProximal", riggedLeftHand.LeftIndexProximal);
      rigRotation("LeftIndexIntermediate", riggedLeftHand.LeftIndexIntermediate);
      rigRotation("LeftIndexDistal", riggedLeftHand.LeftIndexDistal);
      rigRotation("LeftMiddleProximal", riggedLeftHand.LeftMiddleProximal);
      rigRotation("LeftMiddleIntermediate", riggedLeftHand.LeftMiddleIntermediate);
      rigRotation("LeftMiddleDistal", riggedLeftHand.LeftMiddleDistal);
      rigRotation("LeftThumbProximal", riggedLeftHand.LeftThumbProximal);
      rigRotation("LeftThumbIntermediate", riggedLeftHand.LeftThumbIntermediate);
      rigRotation("LeftThumbDistal", riggedLeftHand.LeftThumbDistal);
      rigRotation("LeftLittleProximal", riggedLeftHand.LeftLittleProximal);
      rigRotation("LeftLittleIntermediate", riggedLeftHand.LeftLittleIntermediate);
      rigRotation("LeftLittleDistal", riggedLeftHand.LeftLittleDistal);
    }
    if (rightHandLandmarks) {
      riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
      rigRotation("RightHand", {
        // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
        z: riggedPose.RightHand.z,
        y: riggedRightHand.RightWrist.y,
        x: riggedRightHand.RightWrist.x
      });
      rigRotation("RightRingProximal", riggedRightHand.RightRingProximal);
      rigRotation("RightRingIntermediate", riggedRightHand.RightRingIntermediate);
      rigRotation("RightRingDistal", riggedRightHand.RightRingDistal);
      rigRotation("RightIndexProximal", riggedRightHand.RightIndexProximal);
      rigRotation("RightIndexIntermediate",riggedRightHand.RightIndexIntermediate);
      rigRotation("RightIndexDistal", riggedRightHand.RightIndexDistal);
      rigRotation("RightMiddleProximal", riggedRightHand.RightMiddleProximal);
      rigRotation("RightMiddleIntermediate", riggedRightHand.RightMiddleIntermediate);
      rigRotation("RightMiddleDistal", riggedRightHand.RightMiddleDistal);
      rigRotation("RightThumbProximal", riggedRightHand.RightThumbProximal);
      rigRotation("RightThumbIntermediate", riggedRightHand.RightThumbIntermediate);
      rigRotation("RightThumbDistal", riggedRightHand.RightThumbDistal);
      rigRotation("RightLittleProximal", riggedRightHand.RightLittleProximal);
      rigRotation("RightLittleIntermediate", riggedRightHand.RightLittleIntermediate);
      rigRotation("RightLittleDistal", riggedRightHand.RightLittleDistal);
    }
  };


/*----------------------------------------------------------------------------------------------------------
D. SETUP MEDIAPIPE
----------------------------------------------------------------------------------------------------------*/
let videoElement = document.querySelector(".input_video"),
    guideCanvas = document.querySelector('canvas.guides');

const onResults = (results) => {
  // Draw landmark guides
  drawResults(results)
  // Animate model
  animateVRM(currentVrm, results);
}

const holistic = new Holistic({
    locateFile: file => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
    }
  });

  holistic.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
    refineFaceLandmarks: true,
  });
  // Pass holistic a callback function
  holistic.onResults(onResults);

const drawResults = (results) => {
  guideCanvas.width = videoElement.videoWidth;
  guideCanvas.height = videoElement.videoHeight;
  let canvasCtx = guideCanvas.getContext('2d');
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);

}

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({image: videoElement});
  },
  width: 640,
  height: 480
});
camera.start();


/*----------------------------------------------------------------------------------------------------------
E. LOAD 3D CHARACTER
-------------------------------------------------------------------------------------------------------------*/


 export function loadAether(){
  const loaderAether = new THREE.GLTFLoader();
  loaderAether.crossOrigin = "anonymous";
  loaderAether.load(
    "https://cdn.glitch.me/40a5d633-e9a4-4101-b267-6437f92dd8d8/Aether.vrm?v=1668411478013",
    gltf => {
      THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
  
      THREE.VRM.from(gltf).then(vrm => {
        scene.add(vrm.scene);
        currentVrm = vrm;
        currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
      });
    },
    progress =>
      console.log(
        "Loading model...",
        100.0 * (progress.loaded / progress.total),
        "%"
      ),
    error => console.error(error)
  );
}

export function removeAether(){
  scene.remove(loaderAether);
}
