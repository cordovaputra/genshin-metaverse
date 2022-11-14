import {loadAether} from "./aether.js"

export const characters = [
  "Aether",
  "Zhongli",
  "Venti",
  "Keqing",
  "Ganyu",
  "Mona",
  "Eula",
  "Amber",
];

export const characterURL = [
  "https://cdn.glitch.me/40a5d633-e9a4-4101-b267-6437f92dd8d8/Aether.vrm?v=1668411478013",
  "https://cdn.glitch.me/40a5d633-e9a4-4101-b267-6437f92dd8d8/Zhongli.vrm?v=1668411077094",
];

export function CharacterSelectionUIControls() {
  var characterSelection = document.getElementById("select_character");
  for (var i = 0; i < characters.length; i++) {
    var buttons = document.createElement("button");
    var t = document.createTextNode(characters[i]);
    buttons.appendChild(t);
    buttons.onclick = btnClick;
    characterSelection.appendChild(buttons);
  }
}

export function btnClick(e) {
  switch (e.target.textContent) {
    case "Aether":
      loadAether();
      break;
    case "Zhongli":
      console.log("Zhongli")
      break;
  }
}