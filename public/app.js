"use strict";
let ul = document.querySelector("ul");
let frontOfStackElem = ul.firstElementChild;
const keySound = document.querySelector("#key_sound");
const wrongSound = document.querySelector("#wrong_sound");
const statDisplay = document.querySelector("#stats");
const timer = new Timer();
let errorcount = 0;
let snippetIndex = 0;
let timerStarted = false;
const snippets = {
    test: ["hello my name is oli", "const", "="],
    functions: [
        `constructor(fname:string, lname:string, age:number, married:boolean)`,
        `const compact = (arr: any[]) => arr.filter(Boolean);`,
        `let oddNumbers2:number[] = myArr.filter( (n:number) => n % 2 == 0 )`,
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
    const snippet = snippets.functions[snippetIndex];
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
        errorcount++;
        frontOfStackElem.classList.add("incorrect");
    }
    if (timerStarted === false) {
        timer.start();
        errorcount = 0;
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
    let chars = snippets.functions[snippetIndex].length;
    const speed = Math.floor(chars / secondsExpired);
    const accuracy = 100 - Math.floor((errorcount / chars) * 100);
    statDisplay.innerHTML = `${(speed / 5) * 60} words a minute!! ${accuracy}% real accuracy`;
    timer.stop();
    timer.reset();
    timerStarted = false;
    snippetIndex++;
}
