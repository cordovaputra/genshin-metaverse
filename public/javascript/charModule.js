import { loadZhongli } from "./zhongli.js";
// import { loadAether } from "./aether.js";
// import { removeAether } from "./aether.js";
export const characters = [
  // "Aether",
  "Zhongli",
  "Venti",
  "Keqing",
  "Ganyu",
  "Mona",
  "Eula",
  "Amber",
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
    // case "Aether":
    //   loadAether();
    //   break;
    case "Zhongli":
      loadZhongli();
      break;
  }
}

CharacterSelectionUIControls();