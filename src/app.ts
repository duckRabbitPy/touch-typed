let ul = document.querySelector("ul")! as HTMLUListElement;
let frontOfStackElem = ul.firstElementChild!;
const keySound = document.querySelector("#key_sound") as HTMLAudioElement;
const wrongSound = document.querySelector("#wrong_sound") as HTMLAudioElement;
const winSound = document.querySelector("#win_sound") as HTMLAudioElement;
const statDisplay = document.querySelector("#stats") as HTMLParagraphElement;
const starUL = document.querySelector("#stars") as HTMLUListElement;
const XP = document.querySelector("#xp") as HTMLParagraphElement;
const timer = new Timer();
let errorcount: number = 0;
let snippetIndex: number = 0;
let runningScore: number = 0;

let timerStarted = false;

const snippets: {
  functions: string[];
} = {
  functions: [
    `const`,
    `function reverse(s: string): string;`,
    `function playSound(x: (audioPlayer) => void) {x();}`,
    `constructor(fname:string, lname:string, age:number, married:boolean)`,
    `const compact = (arr: any[]) => arr.filter(Boolean);`,
    `let oddNumbers2:number[] = myArr.filter( (n:number) => n % 2 == 0 )`,
  ],
};

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
  } else if (
    currPress !== "Shift" &&
    currPress !== "Meta" &&
    currPress !== "Alt" &&
    frontOfStackElem !== null
  ) {
    //incorrect key
    isCorrect(frontOfStackElem, false);
    return;
  }
});

function nextSet() {
  clearList(ul);
  const snippet = snippets.functions[snippetIndex];
  const itemsArr = snippet.split("");
  populateList(itemsArr);
  frontOfStackElem = ul.firstElementChild!;
  if (frontOfStackElem !== null) {
    return frontOfStackElem;
  } else {
    throw new Error("Ul has no child element");
  }
}

function clearList(element: Element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
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
    errorcount++;
    frontOfStackElem.classList.add("incorrect");
  }

  if (correct && timerStarted === false) {
    timer.start();
    clearList(starUL);
    statDisplay.innerHTML = "";
    errorcount = 0;
    timerStarted = true;
  }
}

function moveToNext(frontOfStackElem: Element) {
  if (frontOfStackElem.nextElementSibling === null) {
    getStats();
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

function getStats() {
  const secondsExpired = Math.ceil(timer.getTime() / 1000);
  let chars = snippets.functions[snippetIndex].length;
  const speed = (Math.floor(chars / secondsExpired) / 5) * 60;
  const accuracy = 100 - Math.floor((errorcount / chars) * 100);
  const score = accuracy * speed * 1.7;
  printStars(score);
  runningScore += score;
  XP.innerHTML = `${String(Math.ceil(runningScore))} XP`;

  statDisplay.innerHTML = `${speed} words a minute!${
    speed > 40 ? "🔥🔥" : ""
  } ${accuracy}% real accuracy ${accuracy > 95 ? "🎯🎯🎯" : ""}, +${score} xp`;
  timer.stop();
  timer.reset();
  winSound.play();
  timerStarted = false;
  snippetIndex++;
}

function printStars(score: number) {
  let stars = 0;

  if (score > 6000) {
    stars = 5;
  } else if (score > 5000) {
    stars = 4;
  } else if (score > 4000) {
    stars = 3;
  } else if (score > 2000) {
    stars = 2;
  } else if (score < 2000) {
    stars = 1;
  }

  for (let i = 0; i < stars; i++) {
    let li = document.createElement("li");
    li.setAttribute("class", "spinning");
    li.appendChild(document.createTextNode("⭐"));
    starUL.appendChild(li);
  }
}
