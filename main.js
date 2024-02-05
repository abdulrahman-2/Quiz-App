// Select Elements
let count = document.querySelector(".question-count .count");
let bullets = document.querySelector(".progres-bullets");
let questionsArea = document.querySelector(".row-2");
let submitButton = document.querySelector(".submit");
let submitButtonContainer = document.querySelector(".row-3");
let timerAndProgresContanier = document.querySelector(".row-4");
let timerElement = document.querySelector(".time");

// Set options
let currentIndex = 0;
let rigthAnswer = 0;
let countdownInterval;

getQuestions();
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onload = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questions = JSON.parse(this.responseText);
      // console.log(questions);
      let questionsCount = questions.length;
      createBullets(questionsCount);
      addQuestionData(questions[currentIndex], questionsCount);

      countDown(5, questionsCount);

      submitButton.onclick = () => {
        let rigthAnswer = questions[currentIndex].right_answer;

        currentIndex++;

        checkAnswer(rigthAnswer, questionsCount);

        questionsArea.innerHTML = "";

        addQuestionData(questions[currentIndex], questionsCount);

        handleBullets();

        clearInterval(countdownInterval);
        countDown(5, questionsCount);

        showResulet(questionsCount);
      };
    }
  };

  myRequest.open("Get", "html_questions.json");
  myRequest.send();
}

function createBullets(countNum) {
  count.innerHTML = countNum;

  // create span circle
  let content = "";
  for (let i = 0; i < countNum; i++) {
    // CHECK iF iT First Span
    if (i === 0) {
      content = `
        <span class="active" id="circle-${i + 1}"></span>
      `;
    } else {
      content = `
        <span id="circle-${i + 1}"></span>
      `;
    }
    bullets.innerHTML += content;
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionContainer = document.createElement("div");
    questionContainer.classList.add("question");

    let h2 = document.createElement("h2");
    let questionTitle = document.createTextNode(obj.title);
    h2.appendChild(questionTitle);

    let answers = document.createElement("div");
    answers.classList.add("answers");

    let answerArea = document.createElement("div");
    answerArea.classList.add("question");
    answerArea.appendChild(h2);

    for (let i = 1; i <= 4; i++) {
      let ansDiv = document.createElement("div");

      // add radio input
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // add lable
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      let labelText = document.createTextNode(obj[`answer_${i}`]);
      label.appendChild(labelText);

      // add label and radioInput to ansDiv
      ansDiv.append(radioInput, label);
      answers.appendChild(ansDiv);
      answerArea.appendChild(answers);
      questionsArea.appendChild(answerArea);

      // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }
    }
  }
}

function checkAnswer(rAnswer) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rigthAnswer++;
  }
}

function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".progres-bullets span");
  let arrayOfSpan = [...bulletsSpan];
  arrayOfSpan.forEach((span, index) => {
    if (currentIndex === index) {
      span.classList.add("active");
    }
  });
}

function showResulet(count) {
  let theResult;
  if (currentIndex === count) {
    bullets.remove();
    submitButtonContainer.remove();
    timerAndProgresContanier.remove();

    if (rigthAnswer > count / 2 && rigthAnswer < count) {
      theResult = `
        <span class="Great">Great,</span>
        <span>You Answered ${rigthAnswer} From ${count}</span>
      `;
    } else if (rigthAnswer === count) {
      theResult = `
        <span class="Perfect">Perfect,</span>
        <span>You Answered ${rigthAnswer} From ${count}</span>
      `;
    } else {
      theResult = `
        <span class="Bad">Bad,</span>
        <span>You Answered ${rigthAnswer} From ${count}</span>
      `;
    }
    let resultContanier = document.createElement("div");
    resultContanier.classList.add("row-5");
    resultContanier.innerHTML = theResult;
    document.querySelector(".quize-container").appendChild(resultContanier);
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let miuntes, socends;
    countdownInterval = setInterval(() => {
      miuntes = parseInt(duration / 60);
      socends = parseInt(duration % 60);

      miuntes = miuntes < 10 ? `0${miuntes}` : miuntes;
      socends = socends < 10 ? `0${socends}` : socends;

      timerElement.innerHTML = `${miuntes}:${socends}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
