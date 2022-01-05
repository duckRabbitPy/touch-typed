let ul = document.querySelector("ul")!;
let frontOfStackElem = ul.firstElementChild!;
const keySound = document.querySelector("#key_sound") as HTMLAudioElement;
const wrongSound = document.querySelector("#wrong_sound") as HTMLAudioElement;

nextSet();

document.addEventListener("keydown", (event) => {
  let currPress = event.key;
  const frontOfStackLetter = frontOfStackElem?.innerHTML;

  currPress = convertSpecial(currPress);

  if (currPress === frontOfStackLetter && frontOfStackElem !== null) {
    //correct key
    isCorrect(frontOfStackElem, true);
    frontOfStackElem = moveToNext(frontOfStackElem);
    return;
  } else if (
    currPress === " " &&
    frontOfStackLetter === "" &&
    frontOfStackElem !== null
  ) {
    //correct space key
    frontOfStackElem = moveToNext(frontOfStackElem);
    return;
  } else if (currPress !== "Shift" && frontOfStackElem !== null) {
    //incorrect key
    isCorrect(frontOfStackElem, false);
    return;
  }
});

function nextSet() {
  clearList();
  const snippet = `const wrongSound = document.querySelector("#wrong_sound") as HTMLAudioElement;`;
  const itemsArr = snippet.split("");
  populateList(itemsArr);
  frontOfStackElem = ul.firstElementChild!;
  if (frontOfStackElem !== null) {
    return frontOfStackElem;
  } else {
    throw new Error("Ul has no child element");
  }
}

function clearList() {
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
}

function populateList(itemsArr: string[]) {
  itemsArr.forEach((item) => {
    let li = document.createElement("li");
    if (item === " ") {
      item = " ";
    }
    li.appendChild(document.createTextNode(item));
    ul.appendChild(li);
  });
}

function isCorrect(frontOfStackElem: Element, correct: Boolean) {
  if (correct) {
    keySound.currentTime = 0;
    keySound.play();
    frontOfStackElem.classList.remove("incorrect");
    frontOfStackElem.classList.add("correct");
  } else if (!correct) {
    wrongSound.currentTime = 0;
    wrongSound.play();
    frontOfStackElem.classList.add("incorrect");
  }
}

function moveToNext(frontOfStackElem: Element) {
  if (frontOfStackElem.nextElementSibling === null) {
    frontOfStackElem = nextSet();
    return frontOfStackElem;
  }
  return frontOfStackElem.nextElementSibling;
}

function convertSpecial(currPress: string) {
  switch (currPress) {
    case "&":
      if (frontOfStackElem.innerHTML === "&amp;") {
        return "&amp;";
      }
    case ">":
      if (frontOfStackElem.innerHTML === "&gt;") {
        return "&gt;";
      }
    case "<":
      if (frontOfStackElem.innerHTML === "&lt;") {
        return "&lt;";
      }
    default:
      return currPress;
  }
}
