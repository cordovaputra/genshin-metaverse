export const characters = [
    "Aether", 
    "Zhongli",
    "Venti",
    "Keqing",
    "Ganyu",
    "Mona",
    "Eula",
    "Amber" 
];

export function CharacterSelectionUIControls () {
    var characterSelection=document.getElementById("select_character");
    for (var i = 0; i < characters.length; i++) {
      var buttons=document.createElement("button");
      var t = document.createTextNode(characters[i]);
      buttons.appendChild(t);
      buttons.onclick = btnClick;
      characterSelection.appendChild(buttons);
    }
  }

//Encapsule Each Characters into Functions
export function Aether(){
    loader.load(
        "https://cdn.glitch.me/40a5d633-e9a4-4101-b267-6437f92dd8d8/Aether.vrm?v=1668411478013",
        gltf => {
          THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
      
          THREE.VRM.from(gltf).then(vrm => {
            scene.add(vrm.scene);
            currentVrm = vrm;
            currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
          });
        },
        progress => STATUS.innerText = 'Loading: ' + 100.0 * (progress.loaded / progress.total) + '%',
        error => console.error(error),
      );
}

export function Zhongli(){
    loader.load(
        "https://cdn.glitch.me/40a5d633-e9a4-4101-b267-6437f92dd8d8/Zhongli.vrm?v=1668411077094",
        gltf => {
          THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
      
          THREE.VRM.from(gltf).then(vrm => {
            scene.add(vrm.scene);
            currentVrm = vrm;
            currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
          });
        },
        progress => STATUS.innerText = 'Loading: ' + 100.0 * (progress.loaded / progress.total) + '%',
        error => console.error(error),
      );
}

export function btnClick(e) {
    switch(e.target.textContent) {
        case "Aether":
          console.log('Aether')
          break;
        case "Zhongli":
          console.log('Zhongli')
          break;
      }
}


// export function btnClick(a) {
//     let characterSelection = a.target.textContent;
//     if(characterSelection == "Aether") {
//         console.log("Aether")
//     }
//     if(characterSelection == "Zhongli") {
//         console.log("Zhongli")

//     }
//     if(characterSelection == "Venti") {
//         console.log("Venti")
//     //   loader.load(
//     //     "https://cdn.glitch.me/40a5d633-e9a4-4101-b267-6437f92dd8d8/Venti.vrm?v=1668412611388",
//     //     gltf => {
//     //       THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
      
//     //       THREE.VRM.from(gltf).then(vrm => {
//     //         scene.add(vrm.scene);
//     //         currentVrm = vrm;
//     //         currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
//     //       });
//     //     },
//     //     progress => STATUS.innerText = 'Loading: ' + 100.0 * (progress.loaded / progress.total) + '%',
//     //     error => console.error(error),
//     //   );
//     }
//     if(characterSelection == "Keqing") {
//         console.log("Keqing")
//     //   loader.load(
//     //     "https://cdn.glitch.me/40a5d633-e9a4-4101-b267-6437f92dd8d8/Keqing.vrm?v=1668411443885",
//     //     gltf => {
//     //       THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
      
//     //       THREE.VRM.from(gltf).then(vrm => {
//     //         scene.add(vrm.scene);
//     //         currentVrm = vrm;
//     //         currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
//     //       });
//     //     },
//     //     progress => STATUS.innerText = 'Loading: ' + 100.0 * (progress.loaded / progress.total) + '%',
//     //     error => console.error(error),
//     //   );
//     }
//     if(characterSelection == "Ganyu") {
//         console.log("Ganyu")
//     //   loader.load(
//     //     "https://cdn.glitch.me/40a5d633-e9a4-4101-b267-6437f92dd8d8/Ganyu.vrm?v=1668411419000",
//     //     gltf => {
//     //       THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
      
//     //       THREE.VRM.from(gltf).then(vrm => {
//     //         scene.add(vrm.scene);
//     //         currentVrm = vrm;
//     //         currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
//     //       });
//     //     },
//     //     progress => STATUS.innerText = 'Loading: ' + 100.0 * (progress.loaded / progress.total) + '%',
//     //     error => console.error(error),
//     //   );
//     }
//     if(characterSelection == "Mona") {
//         console.log("Mona")
//     //   loader.load(
//     //     "https://cdn.glitch.me/40a5d633-e9a4-4101-b267-6437f92dd8d8/Mona.vrm?v=1668411459121",
//     //     gltf => {
//     //       THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
      
//     //       THREE.VRM.from(gltf).then(vrm => {
//     //         scene.add(vrm.scene);
//     //         currentVrm = vrm;
//     //         currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
//     //       });
//     //     },
//     //     progress => STATUS.innerText = 'Loading: ' + 100.0 * (progress.loaded / progress.total) + '%',
//     //     error => console.error(error),
//     //   );
//     }
//     if(characterSelection == "Eula") {
//         console.log("Eula")
//     //   loader.load(
//     //     "https://cdn.glitch.me/40a5d633-e9a4-4101-b267-6437f92dd8d8/Eula.vrm?v=1668411394326",
//     //     gltf => {
//     //       THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
      
//     //       THREE.VRM.from(gltf).then(vrm => {
//     //         scene.add(vrm.scene);
//     //         currentVrm = vrm;
//     //         currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
//     //       });
//     //     },
//     //     progress => STATUS.innerText = 'Loading: ' + 100.0 * (progress.loaded / progress.total) + '%',
//     //     error => console.error(error),
//     //   );
//     }
//     if(characterSelection == "Amber") {
//         console.log("Amber")
//     //   loader.load(
//     //     "https://cdn.glitch.me/40a5d633-e9a4-4101-b267-6437f92dd8d8/Amber.vrm?v=1668411368402",
//     //     gltf => {
//     //       THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
      
//     //       THREE.VRM.from(gltf).then(vrm => {
//     //         scene.add(vrm.scene);
//     //         currentVrm = vrm;
//     //         currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
//     //       });
//     //     },
//     //     progress => STATUS.innerText = 'Loading: ' + 100.0 * (progress.loaded / progress.total) + '%',
//     //     error => console.error(error),
//     //   );
//     }
  
//   }
// //   CharacterSelectionUIControls();