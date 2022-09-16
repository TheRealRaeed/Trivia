/*
This below is my hello world program
don't steal this code, it sucks
copyright me aka raeed 
*/
let questionsarray = [];
let score = 0;
let scoretable = {
  hard: 10,
  easy: 1,
  medium: 5,
};

console.log(`WELCOME TO TRIVIA 1.0\nDATE: ${new Date().toLocaleDateString()}`);
const cats = document.getElementById("catselect");
fetch("/trivia/category.json", {
  method: "GET",
})
  .then((res) => res.json())
  .then((res) => {
    res.trivia_categories.forEach((bat) => {
      cats.innerHTML += `<option value="${bat.id}">${bat.name}</option>`;
    });

    cats.value = localStorage.catid;
  });

cats.addEventListener("change", () => {
  questionsarray = [];
  localStorage.catid = cats.value;
  updateQuestion(cats.value);
  score = 0;
});
function updateQuestion(catid) {
  document.getElementById("score").innerText = `Score: ${score}`;
  if (catid == 0 || !catid) {
    fetch("https://opentdb.com/api.php?amount=10", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        questionsarray = res.results;
        qSetup();
      });
  } else {
    fetch(`https://opentdb.com/api.php?amount=10&category=${catid}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        questionsarray = res.results;
        qSetup();
      });
  }
}

function qSetup() {
  document.getElementById("result").innerText = "";
  document.querySelector(".continue-btn").style.display = "none";
  const q = questionsarray.pop();
  if (!q) updateQuestion(localStorage.catid);
  else loadQuestion(q);
}

function loadQuestion(q) {
  let choices = [];
  document.getElementById("question").innerHTML = q.question;
  document.querySelector(".choice-section").innerHTML = "";
  document.getElementById("cat").innerHTML = "";
  document.getElementById("difficulty").innerHTML = "";
  document.getElementById("cat").innerHTML = "CATEGORY: " + q.category;
  document.getElementById("difficulty").innerHTML =
    "DIFFICULTY: " + q.difficulty;
  choices.push(q.correct_answer);
  q.incorrect_answers.forEach((a) => choices.push(a));
  choices = shuffleArray(choices);
  const choicesect = document.querySelector(".choice-section");

  // Updates the buttons
  choices.forEach((choice) => {
    const cbtn = document.createElement("button");
    cbtn.dataset.choice = choice.toLowerCase().replace(/\s/g, "_");
    cbtn.innerHTML = choice;
    cbtn.setAttribute("class", "choice-btn");
    cbtn.onclick = (e) => {
      checkQuestion(e, q.correct_answer, q.difficulty);
    };
    choicesect.append(cbtn);
  });
}

function checkQuestion(e, c, h) {
  const choice = e.target.getAttribute("data-choice");
  const childlist = document.querySelector(".choice-section").children;
  for (let child of childlist) child.disabled = true;
  if (choice.toLowerCase() == c.toLowerCase()) {
    for (let child of childlist) {
      if (child.getAttribute("data-choice") == choice.toLowerCase()) {
        child.classList.add("correct-btn");
      }
    }
    score = score + scoretable[h];
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("result").innerText = "That's correct!";
    document.getElementById("result").style.color = "GREEN";
    setTimeout(() => {
      qSetup();
    }, 1000);
  } else {
    for (let child of childlist) {
      if (child.getAttribute("data-choice") == choice.toLowerCase()) {
        child.classList.add("incorrect-btn");
      }
      if (child.getAttribute("data-choice") == c.toLowerCase()) {
        child.classList.add("correct-btn");
      }
    }
    score = score - 2;
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("result").innerHTML =
      "Incorrect noob. Correct answer is " + c;
    document.getElementById("result").style.color = "RED";
    document.querySelector(".continue-btn").style.display = "block";
  }
}

function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

updateQuestion(localStorage.catid);
