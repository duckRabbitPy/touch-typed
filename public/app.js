"use strict";
let ul = document.querySelector("ul");
let frontOfStackElem = ul.firstElementChild;
const keySound = document.querySelector("#key_sound");
const wrongSound = document.querySelector("#wrong_sound");
const statDisplay = document.querySelector("#stats");
const timer = new Timer();
let timerStarted = false;
const snippets = {
    test: ["hello my name is oli", "const", "="],
    functions: [
        `const capitalize = (str: string = "", lowerRest = false): string =>
  str.slice(0, 1).toUpperCase() +
  (lowerRest ? str.slice(1).toLowerCase() : str.slice(1));`,
        `const compact = (arr: any[]) => arr.filter(Boolean);`,
    ],
};
nextSet();
document.addEventListener("keydown", (event) => {
    let currPress = event.key;
    const frontOfStackLetter = frontOfStackElem === null || frontOfStackElem === void 0 ? void 0 : frontOfStackElem.innerHTML;
    currPress = convertSpecial(currPress);
    if (currPress === frontOfStackLetter && frontOfStackElem !== null) {
        //correct key
        isCorrect(frontOfStackElem, true);
        frontOfStackElem = moveToNext(frontOfStackElem);
        return;
    }
    else if (currPress === " " &&
        frontOfStackLetter === "" &&
        frontOfStackElem !== null) {
        //correct space key
        frontOfStackElem = moveToNext(frontOfStackElem);
        return;
    }
    else if (currPress !== "Shift" &&
        currPress !== "Meta" &&
        currPress !== "Alt" &&
        frontOfStackElem !== null) {
        //incorrect key
        isCorrect(frontOfStackElem, false);
        return;
    }
});
function nextSet() {
    clearList();
    const snippet = snippets.functions[1];
    const itemsArr = snippet.split("");
    populateList(itemsArr);
    frontOfStackElem = ul.firstElementChild;
    if (frontOfStackElem !== null) {
        return frontOfStackElem;
    }
    else {
        throw new Error("Ul has no child element");
    }
}
function clearList() {
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
}
function populateList(itemsArr) {
    itemsArr.forEach((item) => {
        let li = document.createElement("li");
        if (item === " ") {
            item = " ";
        }
        li.appendChild(document.createTextNode(item));
        ul.appendChild(li);
    });
}
function isCorrect(frontOfStackElem, correct) {
    if (correct) {
        keySound.currentTime = 0;
        keySound.play();
        frontOfStackElem.classList.remove("incorrect");
        frontOfStackElem.classList.add("correct");
    }
    else if (!correct) {
        wrongSound.currentTime = 0;
        wrongSound.play();
        frontOfStackElem.classList.add("incorrect");
    }
    if (timerStarted === false) {
        timer.start();
        timerStarted = true;
    }
}
function moveToNext(frontOfStackElem) {
    if (frontOfStackElem.nextElementSibling === null) {
        getStats();
        frontOfStackElem = nextSet();
        return frontOfStackElem;
    }
    return frontOfStackElem.nextElementSibling;
}
function convertSpecial(currPress) {
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
function getStats() {
    const secondsExpired = Math.ceil(timer.getTime() / 1000);
    let chars = snippets.functions[1].length;
    const speed = chars / secondsExpired;
    statDisplay.innerHTML = `${(speed / 5) * 60} words a minute!!`;
    timer.stop();
    timer.reset();
    timerStarted = false;
}
