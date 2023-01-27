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

let gameTitle = document.querySelector('.creation--title');
let gameImage = document.querySelector('.creation--img');
let gameQuestionNums = document.querySelector('.creation--qnum');
let gameLevelNums = document.querySelector('.creation--lvls');
let passCheck = [];

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
                </div>`;
                }
            }
        }
    }
}

function smoothMove(lastId) {
    console.log(lastId);
    console.log(`data${Number(lastId) + 1}`)
    if (document.getElementById(`data${Number(lastId) + 1}`) === null) {
        document.querySelector('.quizz-result').classList.remove('hide');
        document.querySelector('.final').classList.remove('hide');
        document.querySelector('.quizz-result').scrollIntoView({ behavior: 'smooth', block: "center", });
        return;
    }
    document.getElementById(`data${Number(lastId) + 1}`).parentElement.scrollIntoView({ behavior: 'smooth', block: "center", })
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
    
    if (gameTitle.value.length < 20 || gameTitle.value.length > 66) {
        gameTitle.parentElement.classList.add('validation-error');
    } else {
        passCheck.push(gameTitle.value);
        if (gameTitle.parentElement.classList.contains('validation-error')) {
            gameTitle.parentElement.classList.remove('validation-error');
        }
    }
    if (!gameImage.value.includes('https://')) {
        gameImage.parentElement.classList.add('validation-error');
    } else {
        passCheck.push(gameImage.value);
        if (gameImage.parentElement.classList.contains('validation-error')) {
            gameImage.parentElement.classList.remove('validation-error');
        }
    }
    if (gameQuestionNums.value < 3) {
        gameQuestionNums.parentElement.classList.add('validation-error');
    } else {
        passCheck.push(gameQuestionNums.value);
        if (gameQuestionNums.parentElement.classList.contains('validation-error')) {
            gameQuestionNums.parentElement.classList.remove('validation-error');
        }
    }
    if (gameLevelNums.value < 2) {
        gameLevelNums.parentElement.classList.add('validation-error');
    } else {
        passCheck.push(gameLevelNums.value);
        if (gameLevelNums.parentElement.classList.contains('validation-error')) {
            gameLevelNums.parentElement.classList.remove('validation-error');
        }
    }
    inputChecks();
}

function inputChecks() {
    if (passCheck.length === 4) {
        //execute command to show next step;
        createQuizQuestions();
    }
}

function createQuizQuestions() {
    document.querySelector('.creation .first').classList.add('hide');
    const pageCreation = document.querySelector('.creation .second');
    pageCreation.classList.remove('hide');
    

    pageCreation.innerHTML += `
      <div class="create-quiz-questions">
        <p>Crie suas perguntas</p>
        <div></div>
        <button onclick="checkQuestions();">Prosseguir para criar niveis</button>
      </div>
    `;
    showQuestions();
}

function showQuestions() {
  const formPosition = document.querySelector('.create-quiz-questions>div');

  for (let i = 0; i < Number(passCheck[2]); i++) {
    formPosition.innerHTML += `
      <form class="question-${i+1}">
        <p>Pergunta ${i+1}</p>
        <div>
          <input class="question-title" placeholder="Texto da pergunta" />
          <input class="question-color" placeholder="Cor de fundo da pergunta" />
        </div>
      </form>
    `;

    for (let j = 0; j < 4; j++) {
      let answerPosition = document.querySelector(`.question-${i+1}`);
      if(j == 0) {
        answerPosition.innerHTML += `
          <p>Resposta correta</p>
          <div>
            <input class="question-answer-${j+1}" required placeholder="Resposta Correta" />
            <input class="question-url-${j+1}" required placeholder="URL da imagem" />
          </div>
        `;
      }
      else if (j == 1) {
        answerPosition.innerHTML += `
        <p>Respostas incorreta</p>
          <div>
            <input required class="question-answer-${j+1}" placeholder="Resposta Incorreta" />
            <input required class="question-url-${j+1}" placeholder="URL da imagem" />
          </div>
        `;
      }
      else {
        answerPosition.innerHTML += `
          <div>
            <input class="question-answer-${j+1}" placeholder="Resposta Incorreta" />
            <input class="question-url-${j+1}" placeholder="URL da imagem" />
          </div>
        `;
      }
    }
  }
}

function checkColor(string){
  let ref = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  if(string[0] === '#' && string.length < 8){
    string = string.substring(1).toLowerCase();
      for(let i=0; i<string.length; i++){
        if(!ref.includes(string.charAt(i))){
          return false
        }
      }
      return true
  } 
  else{
      return false
  }
}

function checkQuestions() {
  let counterQuestionItens = {
    length: 0,
    color: 0,
    answerAmount: 0,
    isAnswerEmpty: 0,
    isUrl: 0,
    isTrue: 0
  };

  for (let i = 0; i < Number(passCheck[2]); i++) {
    let questionObject = {
      title: '',
      color: '',
      answers: []
    };

    questionObject.title = document.querySelector(`.question-${i+1} .question-title`).value;
    questionObject.color = document.querySelector(`.question-${i+1} .question-color`).value;

    for (let j = 0; j < 4; j++) {
      let answerObject = {
        text: '',
        image: '',
        isCorrectAnswer: ''
      };

      answerObject.text = document.querySelector(`.question-${i+1} .question-answer-${j+1}`).value;
      answerObject.image = document.querySelector(`.question-${i+1} .question-url-${j+1}`).value;

      if(j == 1) {
        answerObject.isCorrectAnswer = true;
      }
      else {
        answerObject.isCorrectAnswer = false;
      }

      if(answerObject.image) {
        questionObject.answers.push(answerObject);
      }
    }
    form.questions.push(questionObject);
  }

  // percorrer form.questions e verificar as perguntas
  form.questions.forEach(question => {
    let counter = 0;
    if(question.title.length < 20 && counterQuestionItens.length === 0) {
      alert('O titulo das questoes devem ter pelo menos 20 caracteres');
      counterQuestionItens.length++;
      form.questions = [];
    }
    if(checkColor(question.color) == false && counterQuestionItens.color === 0) {
      alert('A cor de fundo das questoes devem ser passada em formato hexadecimal! ex: #32bf7a');
      counterQuestionItens.color++;
      form.questions = [];
    }
    if(question.answers.length < 2 && counterQuestionItens.answerAmount === 0) {
      alert('As questoes devem conter ao menos duas respostas');
      counterQuestionItens.answerAmount++;
      form.questions = [];
    }

    // percorrer question.answer e verificar as respostas
    question.answers.forEach(answer => {
      if((answer.text == '') && counterQuestionItens.isAnswerEmpty === 0) {
        counterQuestionItens.isAnswerEmpty++;
        form.questions = [];
      }
      if ((!answer.image.includes('https://') || answer.image == undefined) && counterQuestionItens.isUrl == 0) {
        alert('A imagem das respostas devem ter uma url valida');
        counterQuestionItens.isUrl++;
        form.questions = [];
      }
      if (answer.isCorrectAnswer === true) {
          counter++;
      }
    })
    if ((counter === 0) && counterQuestionItens.isTrue === 0) {
      alert("As questões devem conter ao menos uma respota correta");
      counterQuestionItens.isTrue++;
      form.questions = [];
    }
  })

  if (form.questions.length !== 0) {
    createQuizLevels();
  }
}

function createQuizLevels() {
  document.querySelector('.creation>.second').classList.add('hide');
  const pageCreation = document.querySelector('.creation>.third');
  pageCreation.classList.remove('hide');
  
  pageCreation.innerHTML += `
    <div class="create-quiz-levels">
      <h1>Agora, decida os niveis!</h1>
      <div></div>
      <button onclick="checkLevels()">Finalizar</button>
    </div>
  `;
  showLevels();
}

function showLevels() {

}