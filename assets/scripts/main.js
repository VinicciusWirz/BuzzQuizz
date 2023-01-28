const uri = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/';
let loadedQuizzes = [];
let numQuestions = 0;
let questionsRef = 0;
let points = 0;
let levelsRef = [];
let form = {
    title: null,
    image: null,
    questions: [],
    levels: []
}

//MAIN

getQuizz();

function getQuizz() {
    loadedQuizzes = [];
    const promise = axios.get(uri)
    promise.then((answer) => {
        let lastIndex = answer.data.length - 1;
        document.querySelector('.quizz>ul').innerHTML = ''
        for (let i = 0; i < lastIndex; i++) {
            document.querySelector('.quizz>ul').innerHTML += `<li onclick="chooseQuizz(${answer.data[i].id});">
            <img src="${answer.data[i].image}" alt="">
            <span>${answer.data[i].title}</span>
        </li>`;
            loadedQuizzes.push(answer.data[i]);
        }
    });
}

//QUIZZ PAGE

function chooseQuizz(id) {
    const promise = axios.get(uri + id);
    promise.then(renderQuizz);
    promise.catch((error) => {
        console.log(error);
    });
}
function renderQuizz(answer) {
    document.querySelector('main').classList.add('hide');
    document.querySelector('.quizz-page').classList.remove('hide');
    document.querySelector('.quizz-page').scrollIntoView({ behavior: 'smooth', block: "start", });

    document.querySelector('.banner').innerHTML = `<img src="${answer.data.image}" alt="">
            <span>${answer.data.title}</span>`;

    document.querySelector('.question-feed').innerHTML = "";

    numQuestions = answer.data.questions.length;
    levelsRef = answer.data.levels;

    for (let i = 0; i < numQuestions; i++) {
        document.querySelector('.question-feed').innerHTML += `
            <div class="question-box">
                <div class="question" style="background-color:${answer.data.questions[i].color};">
                    <span>${answer.data.questions[i].title}</span>
                </div>
                <div class="answer-box" id="data${i}"></div>
            </div>`;
    }


    for (let j = 0; j < numQuestions; j++) {
        const sortedAnswers = answer.data.questions[j].answers.sort(shuffle);
        for (let z = 0; z < sortedAnswers.length; z++) {
            if (sortedAnswers[z].isCorrectAnswer) {
                document.getElementById(`data${j}`).innerHTML += `
                <div class="answer" onclick="answerSelection(this, ${z});">
                    <img src="${sortedAnswers[z].image}" alt="">
                    <span class="v">${sortedAnswers[z].text}</span>
                </div>`;
            } else {
                document.getElementById(`data${j}`).innerHTML += `
                <div class="answer" onclick="answerSelection(this, ${z});">
                    <img src="${sortedAnswers[z].image}" alt="">
                    <span class="f">${sortedAnswers[z].text}</span>
                </div>`;
            }
        }
    }
}

function shuffle() {
    return Math.random() - 0.5;
}

function answerSelection(item, index) {
    if (item.parentElement.classList.contains('answered')) {
        return;
    } else {
        questionsRef++;
        item.parentElement.classList.add('answered')
        item.classList.add('selection')
        const answerRefPos = item.parentElement.id.replace('data', '');
        console.log(answerRefPos)
        console.log(index)
        if (item.querySelector('span').classList.contains('v')) {
            points++;
        }
        setTimeout(() => {
            smoothMove(answerRefPos);
        }, 2000);
        if (questionsRef === numQuestions) {
            setTimeout(() => {
                calculateResults(points, numQuestions);
            }, 2000);
        }
    }
}

function smoothMove(lastId) {
    console.log(lastId);
    console.log(`data${Number(lastId) + 1}`)
    if (document.getElementById(`data${Number(lastId) + 1}`) === null) {
        return;
    }
    document.getElementById(`data${Number(lastId) + 1}`).parentElement.scrollIntoView({ behavior: 'smooth', block: "center", })
}

function calculateResults(points, numQuestions) {
    document.querySelector('.quizz-result').classList.remove('hide');
    document.querySelector('.final').classList.remove('hide');
    let score = Math.floor((points / numQuestions) * 100);
    console.log(levelsRef);
    for (let i = (levelsRef.length - 1); i >= 0; i--) {
        if (score >= levelsRef[i].minValue) {
            document.querySelector('.quizz-result').innerHTML = `
                <div class="result-title">
                    <span>${score}% de acerto: ${levelsRef[i].title}</span>
                </div>
                <div class="result">
                    <img src=${levelsRef[i].image} alt="">
                    <span>${levelsRef[i].text}</span>
                </div>
            `;
            document.querySelector('.quizz-result').scrollIntoView({ behavior: 'smooth', block: "center", });
            return;
        }
    }
}

function restartQuizz() {

    let restartQuestions = document.querySelectorAll('.answer-box');
    for (let i = 0; i < restartQuestions.length; i++) {
        restartQuestions[i].classList.remove("answered");
        restartQuestions[i].querySelector('.selection').classList.remove("selection");
    }
    points = 0;
    questionsRef = 0;
    document.querySelector('.quizz-result').classList.add('hide');
    document.querySelector('.final').classList.add('hide');
    document.querySelector('.quizz-page').scrollIntoView({ behavior: 'smooth', block: "start", });

}

function goHome() {
    document.querySelector('.quizz-page').classList.add('hide');
    window.location.reload();
}

//CREATE QUIZZ

function creationPage() {
    document.querySelector('main').classList.add('hide');
    document.querySelector('.creation').classList.remove('hide');
}

function validateInput() {
    const gameTitle = document.querySelector('.creation--title');
    const gameImage = document.querySelector('.creation--img');
    const gameQuestionNums = document.querySelector('.creation--qnum');
    const gameLevelNums = document.querySelector('.creation--lvls');
    const passCheck = [];
    if (gameTitle.value.length < 20 || gameTitle.value.length > 66) {
        gameTitle.parentElement.classList.add('validation-error');
    } else {
        passCheck.push('1');
        if (gameTitle.parentElement.classList.contains('validation-error')) {
            gameTitle.parentElement.classList.remove('validation-error');
        }
    }
    if (!gameImage.value.includes('https://')) {
        gameImage.parentElement.classList.add('validation-error');
    } else {
        passCheck.push('2');
        if (gameImage.parentElement.classList.contains('validation-error')) {
            gameImage.parentElement.classList.remove('validation-error');
        }
    }
    if (gameQuestionNums.value < 3) {
        gameQuestionNums.parentElement.classList.add('validation-error');
    } else {
        passCheck.push('3');
        if (gameQuestionNums.parentElement.classList.contains('validation-error')) {
            gameQuestionNums.parentElement.classList.remove('validation-error');
        }
    }
    if (gameLevelNums.value < 2) {
        gameLevelNums.parentElement.classList.add('validation-error');
    } else {
        passCheck.push('4');
        if (gameLevelNums.parentElement.classList.contains('validation-error')) {
            gameLevelNums.parentElement.classList.remove('validation-error');
        }
    }
    inputChecks(passCheck);
}

function inputChecks(passCheck) {
    if (passCheck.length === 4) {
        //execute command to show next step;
        createQuizQuestions(passCheck);
    }
}

function createQuizQuestions(passCheck) {
    document.querySelector('.creation>.first').classList.add('hide');
    const pageCreation = document.querySelector('.creation>.second');
    pageCreation.classList.remove('hide');

    pageCreation.innerHTML += `
    <div class='create-quiz-questions'>
      <h1>Crie suas perguntas</h1>
      <ul></ul>
    </div>
    `;

    for (let i = 0; i < 3; i++) {
        const list = document.querySelector('.create-quiz-questions>ul');

        list.innerHTML += `
          <li>
            <p>Pergunta ${i + 1}</p>
            <form class='questions-form-${i + 1}'>
            <input class='question-title' value='xxxx' required/>
              <input class='color-title' required/>
              <p>Resposta Correta</p>
              <input class='correct-answer' required/>
              <input class='correct-img-answer' required type='url'/>
              <p>Resposta incorretas</p>
              <input class='wrong-answer1' required/>
              <input class='wrong-img-answer1' required type='url'/>
              <br>
              <input class='wrong-answer2' />
              <input class='wrong-img-answer2' type='url' />
              <br>
              <input class='wrong-answer3' />
              <input class='wrong-img-answer3' type='url' />
            </form>
          </li>
        `;

        const questionTitle = document.querySelector(`.questions-form-${i + 1}>.question-title`).value;
        const colorTitle = document.querySelector(`.questions-form-${i + 1}>.color-title`).value;
        const correctAnswer = document.querySelector(`.questions-form-${i + 1}>.correct-answer`).value;
        const correctImg = document.querySelector(`.questions-form-${i + 1}>.correct-img-answer`).value;
        const wrongAnswer1 = document.querySelector(`.questions-form-${i + 1}>.wrong-answer1`).value;
        const wrongImg1 = document.querySelector(`.questions-form-${i + 1}>.wrong-img-answer1`).value;
        const wrongAnswer2 = document.querySelector(`.questions-form-${i + 1}>.wrong-answer2`).value;
        const wrongImg2 = document.querySelector(`.questions-form-${i + 1}>.wrong-img-answer2`).value;
        const wrongAnswer3 = document.querySelector(`.questions-form-${i + 1}>.wrong-answer3`).value;
        const wrongImg3 = document.querySelector(`.questions-form-${i + 1}>.wrong-img-answer3`).value;


    }



    pageCreation.innerHTML += `
      <button onclick="checkQuestions()">Prosseguir para criar niveis</button>
    `;

}

function checkQuestions() {

}