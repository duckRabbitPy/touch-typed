"use strict";
const topicSelectors = document.querySelectorAll("input");
const container = document.querySelector(".container");
const form = document.querySelector("form");
const menu = document.querySelector("#menu");
const footer = document.querySelector("footer");
let ul = document.querySelector("ul");
let frontOfStackElem = ul.firstElementChild;
const keySound = document.querySelector("#key_sound");
const wrongSound = document.querySelector("#wrong_sound");
const winSound = document.querySelector("#win_sound");
const statDisplay = document.querySelector("#stats");
const starUL = document.querySelector("#stars");
const roundInfo = document.querySelector("#round_info");
const XP = document.querySelector("#xp");
const timer = new Timer();
// globals
let topic = "Functions";
let round = 0;
let errorcount = 0;
let snippetIndex = 0;
let runningScore = 0;
let timerStarted = false;
//retrieve first set
window.onload = () => {
    nextSet();
};
const snippets = {
    Functions: [
        `type: functions`,
        `function reverse(s: string): string;`,
        `function playSound(x: () => void) {x();}`,
        `const compact = (arr: any[]) => arr.filter(Boolean);`,
        `let oddNumbers:number[] = myArr.filter( (n:number) => n % 2 == 0 )`,
        `function firstElement2<Type extends any[]>(arr: Type) {return arr[0];}`,
        `topic complete return to menu!`,
    ],
    Casting: [
        `type: casting`,
        `const currTopic = topic as options`,
        `const winSound = document.querySelector("#win_sound") as HTMLAudioElement;`,
        `let input = document.querySelector('input[type="text"]') as HTMLInputElement;`,
        `const XP = document.querySelector("#xp") as HTMLParagraphElement;`,
        `topic complete return to menu!`,
    ],
    Interfaces: [
        `type: interfaces`,
        `interface Person { name: string; age: number;}`,
        `interface PaintOptions { shape: Shape; xPos?: number; yPos?: number;}`,
        `interface CallOrConstruct {new (s: string): Date; (n?: number): number;}`,
        `topic complete return to menu!`,
    ],
    Generics: [
        `type: generics`,
        `function identity<Type>(arg: Type): Type {return arg;}`,
        `let myIdentity: <Type>(arg: Type) => Type = identity;`,
        `function firstElem<Type>(arr: Type[]): Type | undefined {return arr[0];}`,
        `topic complete return to menu!`,
    ],
    Tsx: [
        `type: tsx`,
        `import type { menuBtn } from '@components/ReactHooks/menu';`,
        `<Select selectProps={{ items: cards }} {...props} />`,
        `useEffect(() => { findOptions(searchText);}, [searchText]);`,
        `<div onClick={() => addLinkedRecord(recordId)} key={recordId}>`,
        `export const useTransition = <T extends HTMLElement = HTMLElement>():`,
        `topic complete return to menu!`,
    ],
    Classes: [
        `type: classes`,
        `class magician {powers: element[]; constructor(powers: element[]){}`,
        `class Greeter {name: string; constructor() { this.name = "hello";}}`,
        `class Place {readonly name: string = "world";}`,
        `class Derived extends Base {constructor() {super();}}`,
        `topic complete return to menu!`,
    ],
};
// key event listener
document.addEventListener("keydown", (event) => {
    let currPress = event.key;
    const frontOfStackLetter = frontOfStackElem.innerHTML;
    currPress = convertSpecial(currPress);
    if (currPress === "Enter") {
        ul.classList.remove("hidden");
        round++;
        roundInfo.innerHTML = `${topic}: Round ${String(round)}`;
        clearList(starUL);
        statDisplay.innerHTML = "";
        return;
    }
    if (currPress === frontOfStackLetter && frontOfStackElem !== null) {
        //correct key
        keyEffect(frontOfStackElem, true);
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
        keyEffect(frontOfStackElem, false);
        return;
    }
});
topicSelectors.forEach((btn) => {
    btn.addEventListener("click", () => {
        topic = btn.value;
        container === null || container === void 0 ? void 0 : container.classList.remove("hidden");
        form === null || form === void 0 ? void 0 : form.classList.add("hidden");
        menu === null || menu === void 0 ? void 0 : menu.classList.remove("hidden");
        footer === null || footer === void 0 ? void 0 : footer.classList.add("hidden");
        clearList(ul);
        nextSet();
        ul.classList.remove("hidden");
        roundInfo.innerHTML = `${topic}: Warm up ????`;
    });
});
menu === null || menu === void 0 ? void 0 : menu.addEventListener("click", () => {
    container === null || container === void 0 ? void 0 : container.classList.add("hidden");
    form === null || form === void 0 ? void 0 : form.classList.remove("hidden");
    menu === null || menu === void 0 ? void 0 : menu.classList.add("hidden");
    footer === null || footer === void 0 ? void 0 : footer.classList.remove("hidden");
    reset();
});
function clearList(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
function populateList(itemsArr) {
    itemsArr.forEach((item) => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(item));
        ul.appendChild(li);
    });
}
function keyEffect(frontOfStackElem, correct) {
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
    //start timer when first correct key entered on new round
    if (correct && timerStarted === false) {
        timer.start();
        errorcount = 0;
        timerStarted = true;
    }
}
function moveToNext(frontOfStackElem) {
    if (frontOfStackElem.nextElementSibling === null) {
        displayStats();
        frontOfStackElem = nextSet();
        ul.classList.add("hidden");
        timer.stop();
        timer.reset();
        timerStarted = false;
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
function displayStats() {
    const { speed, accuracy, score } = getStats();
    printStars(score);
    runningScore += score;
    XP.innerHTML = `${String(Math.ceil(runningScore))} XP`;
    if (score > 1500) {
        statDisplay.innerHTML = `${speed} words a minute!${speed > 40 ? "????????" : ""} ${accuracy}% accuracy ${accuracy > 95 ? "????????????" : ""} +${score} xp`;
        winSound.currentTime = 0;
        winSound.play();
        snippetIndex++;
    }
    else {
        statDisplay.innerHTML = `Failed ????. ${speed} words per minute. ${accuracy}% accuracy. Try again!`;
    }
    statDisplay.innerHTML += "</br></br>'Enter' to continue...";
}
function getStats() {
    const secondsExpired = timer.getTime() / 1000;
    const currTopic = topic;
    const chars = snippets[currTopic][snippetIndex].length;
    const speed = Math.ceil((chars / secondsExpired / 5) * 60);
    const accuracy = 100 - Math.floor((errorcount / chars) * 100);
    const score = Math.ceil(accuracy * speed * 1.7);
    return {
        speed,
        accuracy,
        score,
    };
}
function printStars(score) {
    let stars = 0;
    if (score > 6000) {
        stars = 5;
    }
    else if (score > 5000) {
        stars = 4;
    }
    else if (score > 4000) {
        stars = 3;
    }
    else if (score > 2000) {
        stars = 2;
    }
    else if (score > 1500) {
        stars = 1;
    }
    else if (score < 1500) {
        return;
    }
    for (let i = 0; i < stars; i++) {
        let li = document.createElement("li");
        li.setAttribute("class", "spinning");
        li.appendChild(document.createTextNode("???"));
        starUL.appendChild(li);
    }
}
function nextSet() {
    clearList(ul);
    const currTopic = topic;
    const snippet = snippets[currTopic][snippetIndex];
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
function reset() {
    topic = "Functions";
    round = 0;
    errorcount = 0;
    snippetIndex = 0;
    runningScore = 0;
    timer.stop();
    timer.reset();
    timerStarted = false;
    clearList(ul);
    clearList(starUL);
    nextSet();
    statDisplay.innerHTML = "";
    roundInfo.innerHTML = "";
}
