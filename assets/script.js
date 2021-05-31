var counter = 90;

// States:
//   - "start"
//   - "running"
//   - "end"
var gameState = "start";
var currentQuestion = null;
var highScores = [];
var currentTimout = null;

const quesChoice = [
  {
    question:
      "Which of the following is a valid type of function javascript supports?",
    choices: [
      "named function",
      "anonymous function",
      "Both of the above.",
      "None of the above.",
    ],
    correctAns: 2,
  },

  {
    question:
      "Which built-in method returns the string representation of the number's value?",
    choices: ["toValue()", "toNumber()", "toString()", "None of the above."],
    correctAns: 2,
  },

  {
    question:
      "Which of the following function of String object splits a String object into an array of strings by separating the string into substrings?",
    choices: ["slice()", "split()", "replace()", "search()"],
    correctAns: 1,
  },

  {
    question:
      "Which built-in method adds one or more elements to the end of an array and returns the new length of the array?",
    choices: ["last())", "put()", "push()", "None of the above."],
    correctAns: 2,
  },
];

function updateCounter() {
  let timer = document.getElementById("timer");
  if (counter <= 1) {
    timer.textContent = 0;
    endQuiz();
  } else {
    counter = counter - 1;
    timer.textContent = counter;
    currentTimeout = setTimeout(updateCounter, 1000);
  }
}
const quizContainer = document.getElementById("quiz-container");
let container = document.getElementById("container");

//create a function to change view pages

function selectView(name) {
  var classNameContainer;
  switch (name) {
    case "start":
      classNameContainer = "start-view";
      break;
    case "questions":
      classNameContainer = "question-view";
      break;
    case "end":
      classNameContainer = "end-view";
      break;
    case "high-score":
      classNameContainer = "hs-view";
      showHighScore();
      break;
  }
  document.body.className = classNameContainer;
}

function setState(name) {
  switch (name) {
    case "start":
      gameState = "start";
      selectView("start");
      break;
    case "running":
      gameState = "running";
      selectView("questions");
      break;
    case "end":
      gameState = "end";
      selectView("end");
      break;
  }
}

function showQuestion() {
  var curr = quesChoice[currentQuestion];

  var qElem = document.getElementById("quizQues");
  var aElemContainer = document.getElementById("answerBtn");

  qElem.textContent = "Q" + (currentQuestion + 1) + " - " + curr.question;

  for (let i = 0; i < curr.choices.length; i++) {
    let answerElm = aElemContainer.children[i];
    answerElm.textContent = curr.choices[i];
    answerElm.className = "";
  }
}

function showHighScore() {
  let tableBody = document.getElementById("hs-table-body");
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  highScores.sort((a, b) => b.score - a.score);

  for (var i = 0; i < highScores.length; i++) {
    let tr = document.createElement("tr");

    let initTd = document.createElement("td");
    initTd.textContent = highScores[i].name;
    tr.appendChild(initTd);

    let scoreTd = document.createElement("td");
    scoreTd.textContent = highScores[i].score;
    tr.appendChild(scoreTd);

    tableBody.appendChild(tr);
  }
}

function startQuiz() {
  setState("running");
  updateCounter();
  counter = 90;
  currentQuestion = 0;
  showQuestion();
}

function endQuiz() {
  currentTimeout = clearTimeout(currentTimeout);
  setState("end");
}

function onViewHighScoreClick() {
  var hsBtn = document.getElementById("highscore");
  if (document.body.className == "hs-view") {
    hsBtn.textContent = "View High Score";
    switch (gameState) {
      case "start":
        selectView("start");
        break;
      case "running":
        selectView("questions");
        break;
      case "end":
        selectView("end");
        break;
    }
  } else {
    hsBtn.textContent = "Go Back";
    selectView("high-score");
  }
}

function onNextQuestion() {
  let qLength = quesChoice.length;
  if (currentQuestion + 1 < qLength) {
    currentQuestion += 1;
    showQuestion();
  } else {
    endQuiz();
  }
}

function onScoreSubmit() {
  let initialsElm = document.getElementById("score-initials");
  highScores.push({
    name: initialsElm.value,
    score: counter,
  });
  setState("start");
  selectView("high-score");
  var hsBtn = document.getElementById("highscore");
  hsBtn.textContent = "Go Back";
}

function onQuestionAnswered() {
  var curr = quesChoice[currentQuestion];
  var answerIdx = parseInt(this.value);

  if (answerIdx == curr.correctAns) {
    this.className = "correct";
  } else {
    this.className = "wrong";
    counter -= 10;
  }
  setTimeout(() => {
    if (answerIdx != curr.correctAns) {
      this.className = "";
    }
  }, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
  let startBtn = document.getElementById("start");
  startBtn.addEventListener("click", startQuiz);

  let hsBtn = document.getElementById("highscore");
  hsBtn.addEventListener("click", onViewHighScoreClick);

  let nextBtn = document.getElementById("nextBtn");
  nextBtn.addEventListener("click", onNextQuestion);

  let scoreBtn = document.getElementById("scoreSubmit");
  scoreBtn.addEventListener("click", onScoreSubmit);

  let answersContainer = document.getElementById("answerBtn");
  for (let i = 0; i < answersContainer.children.length; i++) {
    answersContainer.children[i].addEventListener("click", onQuestionAnswered);
  }
});
