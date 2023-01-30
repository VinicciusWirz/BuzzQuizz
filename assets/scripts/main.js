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

let editable = false;

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
            <img src="${answer.data[i].image}" alt="" onerror="this.src='./assets/imgs/error404.png'">
            <span>${answer.data[i].title}</span>
        </li>`;
      loadedQuizzes.push(answer.data[i]);
    }
  });
}

//QUIZZ PAGE

function chooseQuizz(id) {
  document.querySelector('.loadingscreen').classList.remove('hide');
  const promise = axios.get(uri + id);
  promise.then(renderQuizz);
  promise.catch((error) => {
    document.querySelector('.loadingscreen').classList.add('hide');
  });
}
function renderQuizz(answer) {
  document.querySelector('.loadingscreen').classList.add('hide');
  document.querySelector('main').classList.add('hide');
  document.querySelector('.quizz-page').classList.remove('hide');
  document.querySelector('.quizz-page').scrollIntoView({ behavior: 'smooth', block: "start", });

  document.querySelector('.banner').innerHTML = `<img src="${answer.data.image}" alt="" onerror="this.src='./assets/imgs/error404.png'">
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
                    <img src="${sortedAnswers[z].image}" alt="" onerror="this.src='./assets/imgs/error404.png'">
                    <span class="v">${sortedAnswers[z].text}</span>
                </div>`;
      } else {
        document.getElementById(`data${j}`).innerHTML += `
                <div class="answer" onclick="answerSelection(this, ${z});">
                    <img src="${sortedAnswers[z].image}" alt="" onerror="this.src='./assets/imgs/error404.png'">
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
    if (item.querySelector('span').classList.contains('v')) {
      points++;
    }
    setTimeout(() => {
      smoothMove(answerRefPos);
    }, 2000);
    if (questionsRef === numQuestions) {
      let score = Math.floor((points / numQuestions) * 100);
      for (let i = (levelsRef.length - 1); i >= 0; i--) {
        if (score >= levelsRef[i].minValue) {
          document.querySelector('.quizz-result').innerHTML = `
                <div class="result-title">
                    <span>${score}% de acerto: ${levelsRef[i].title}</span>
                </div>
                <div class="result">
                    <img src=${levelsRef[i].image} alt="" onerror="this.src='./assets/imgs/error404.png'">
                    <span>${levelsRef[i].text}</span>
                </div>`;
                return;
        }
      }
    }
  }
}

function smoothMove(lastId) {
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
    form.title = passCheck[0];
    form.image = passCheck[1];
    //execute command to show next step;
    createQuizQuestions(passCheck);
  } else {
    passCheck = [];
    alert('Preencha os campos corretamente');
  }
}

function createQuizQuestions() {
  document.querySelector('.creation .first').classList.add('hide');
  const pageCreation = document.querySelector('.creation .second');
  pageCreation.classList.remove('hide');


  pageCreation.innerHTML += `
      <div class="create-quiz-questions">
        <h1>Crie suas perguntas</h1>
        <div></div>
        <button onclick="checkQuestions();">Prosseguir para criar niveis</button>
      </div>
    `;
  showQuestions()
}

function showQuestions() {
  const formPosition = document.querySelector('.create-quiz-questions>div');

  for (let i = 0; i < Number(passCheck[2]); i++) {
    formPosition.innerHTML += `
      <form class="question-form question-${i + 1} small-size">
        <p>Pergunta ${i + 1}</p>
        <div>
          <ion-icon name="create-outline" onclick="editQuestions(this, 'question-${i + 1}');"></ion-icon>
          <input class="question-title${i + 1}" placeholder="Texto da pergunta" />
          <input class="question-color${i + 1}" placeholder="Cor de fundo da pergunta" />
        </div>
      </form>
    `;

    for (let j = 0; j < 4; j++) {
      let answerPosition = document.querySelector(`.question-${i + 1}`);
      if (j == 0) {
        answerPosition.innerHTML += `
          <p>Resposta correta</p>
          <div>
            <input class="question-answer-${i + 1}-${j + 1}" required placeholder="Resposta Correta" />
            <input class="question-url-${i + 1}-${j + 1}" required placeholder="URL da imagem" />
          </div>
        `;
      }
      else if (j == 1) {
        answerPosition.innerHTML += `
        <p>Respostas incorreta</p>
          <div>
            <input required class="question-answer-${i + 1}-${j + 1}" placeholder="Resposta Incorreta" />
            <input required class="question-url-${i + 1}-${j + 1}" placeholder="URL da imagem" />
          </div>
        `;
      }
      else {
        answerPosition.innerHTML += `
          <div>
            <input class="question-answer-${i + 1}-${j + 1}" placeholder="Resposta Incorreta" />
            <input class="question-url-${i + 1}-${j + 1}" placeholder="URL da imagem" />
          </div>
        `;
      }
    }
  }
  if (editable === true) {
    mapInputs(2);
  }
  setTimeout(() => {
    document.querySelector('.question-1').classList.remove('small-size');
  }, 500);
}

function checkColor(string) {
  let ref = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  if (string[0] === '#' && string.length === 7) {
    string = string.substring(1).toLowerCase();
    for (let i = 0; i < string.length; i++) {
      if (!ref.includes(string.charAt(i))) {
        return false
      }
    }
    return true
  }
  else {
    return false
  }
}

function checkQuestions() {
  if (editable === true) {
    form.questions = [];
  }
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

    questionObject.title = document.querySelector(`.question-${i + 1} .question-title${i + 1}`).value;
    questionObject.color = document.querySelector(`.question-${i + 1} .question-color${i + 1}`).value;

    for (let j = 0; j < 4; j++) {
      let answerObject = {
        text: '',
        image: '',
        isCorrectAnswer: ''
      };

      answerObject.text = document.querySelector(`.question-${i + 1} .question-answer-${i + 1}-${j + 1}`).value;
      answerObject.image = document.querySelector(`.question-${i + 1} .question-url-${i + 1}-${j + 1}`).value;

      if (j == 0) {
        answerObject.isCorrectAnswer = true;
      }
      else {
        answerObject.isCorrectAnswer = false;
      }

      if (answerObject.image) {
        questionObject.answers.push(answerObject);
      }
    }
    form.questions.push(questionObject);
  }

  // percorrer form.questions e verificar as perguntas
  form.questions.forEach(question => {
    let counter = 0;
    if (question.title.length < 20 && counterQuestionItens.length === 0) {
      //   alert('O titulo das questoes devem ter pelo menos 20 caracteres');
      counterQuestionItens.length++;
      form.questions = [];
    }
    if (checkColor(question.color) == false && counterQuestionItens.color === 0) {
      //   alert('A cor de fundo das questoes devem ser passada em formato hexadecimal! ex: #32bf7a');
      counterQuestionItens.color++;
      form.questions = [];
    }
    if (question.answers.length < 2 && counterQuestionItens.answerAmount === 0) {
      //   alert('As questoes devem conter ao menos duas respostas');
      counterQuestionItens.answerAmount++;
      form.questions = [];
    }

    // percorrer question.answer e verificar as respostas
    question.answers.forEach(answer => {
      if ((answer.text == '') && counterQuestionItens.isAnswerEmpty === 0) {
        counterQuestionItens.isAnswerEmpty++;
        form.questions = [];
      }
      if (!(answer.image.includes('https://') || answer.image == undefined) && counterQuestionItens.isUrl == 0) {
        // alert('A imagem das respostas devem ter uma url valida');
        counterQuestionItens.isUrl++;
        form.questions = [];
      }
      if (answer.isCorrectAnswer === true) {
        counter++;
      }
    })
    if ((counter === 0) && counterQuestionItens.isTrue === 0) {
      //   alert("As questões devem conter ao menos uma respota correta");
      counterQuestionItens.isTrue++;
      form.questions = [];
    }
  })

  if (form.questions.length !== 0) {
    createQuizLevels();
  } else {
    alert('Preencha os campos corretamente');
  }
}

function createQuizLevels() {
  document.querySelector('.creation .second').classList.add('hide');
  const pageCreation = document.querySelector('.creation .third');
  pageCreation.classList.remove('hide');

  pageCreation.innerHTML += `
    <div class="create-quiz-levels">
      <h1>Agora, decida os niveis!</h1>
      <div></div>
      <button onclick="checkLevels()">Finalizar Quiz</button>
    </div>
  `;
  showLevels();
}

function showLevels() {
  const formPosition = document.querySelector('.create-quiz-levels div');
  for (let i = 0; i < Number(passCheck[3]); i++) {
    formPosition.innerHTML += `
      <form class="levels-form level-${i + 1} small-size">
        <p>Nivel ${i + 1}</p>
        <div>
          <ion-icon name="create-outline" onclick="editLevels(this, 'level-${i + 1}');"></ion-icon>
          <input placeholder="Titulo do nivel"></input>
          <input type="number" placeholder="% de acerto minima"></input>
          <input placeholder="url da imagem"></input>
          <textarea placeholder="Descrição do nivel"></textarea>
        </div>
      </form>
    `;
  }
  if (editable === true) {
    mapInputs(3);
  }
  setTimeout(() => {
    document.querySelector('.level-1').classList.remove('small-size');
  }, 500);
}

function checkLevels() {
  if(editable === true){
    form.levels = [];
  }
  let verification = {
    length: 0,
    minValue: 0,
    validUrl: 0,
    minCharacter: 0,
    include0: 0
  };

  for (let i = 0; i < Number(passCheck[3]); i++) {
    let levelObject = {
      title: null,
      image: null,
      text: null,
      minValue: null
    };

    levelObject.title = document.querySelector(`.level-${i + 1} input:first-of-type`).value;
    levelObject.minValue = document.querySelector(`.level-${i + 1} input:nth-of-type(2)`).value;
    levelObject.image = document.querySelector(`.level-${i + 1} input:nth-of-type(3)`).value;
    levelObject.text = document.querySelector(`.level-${i + 1} textarea`).value;

    form.levels.push(levelObject);
  }

  form.levels.forEach(level => {
    if (level.title.length < 10 && verification.length == 0) {
      verification.length++;
      form.levels = [];
      //   alert('O titulo do nivel deve conter pelo menos 10 caracteres');
    }
    if ((level.minValue < 0) || (level.minValue > 100) || (level.minValue === '') && verification.minValue === 0) {
      verification.minValue++;
      form.levels = [];
      //   alert('A porcentagem de acerto minima deve ser um numero entre 0 a 100');
    }
    if (!(level.image.includes('https://')) && verification.validUrl === 0) {
      verification.validUrl++;
      form.levels = [];
      //   alert('Preencha uma URL valida');
    }
    if (level.text.length < 30 && verification.minCharacter === 0) {
      verification.minCharacter++;
      form.levels = [];
      //   alert('A descrição do nivel deve ter pelo menos 30 caracteres');
    }
    if (!level.minValue.includes(0) && verification.include0 === 0) {
      verification.include0++;
      form.levels = [];
      //   alert('Pelo menos um dos niveis deve conter uma % de no minimo igual a 0');
    }
  })
  if (form.levels.length !== 0) {
    finishQuizCreation();
  } else {
    alert('Preencha os campos corretamente');
  }
}

function editQuestions(question, select) {
  document.querySelector('.create-quiz-questions').scrollIntoView(true);
  question.parentElement.parentElement.scrollIntoView({block: "center"});
  let questionsArray = [];
  const parent = question.parentNode.parentNode;
  parent.querySelector('p:first-of-type').style.top = '10px';
  parent.classList.remove('small-size');
  parent.querySelector('ion-icon').style.overflow = 'hidden';

  for (let i = 0; i < Number(passCheck[2]); i++) {
    questionsArray.push(`question-${i + 1}`);
  }

  let index = questionsArray.indexOf(select);
  questionsArray.splice(index, 1);

  questionsArray.forEach(element => {
    const elementNode = document.querySelector(`.${element}`);
    elementNode.querySelector('p:first-of-type').style.top = '4px';
    elementNode.classList.add('small-size');
    elementNode.querySelector('ion-icon').style.overflow = 'visible';
  })
}

function editLevels(level, select) {
  document.querySelector('.create-quiz-levels').scrollIntoView(true);
  let levelArray = [];
  const parent = level.parentNode.parentNode;
  parent.classList.remove('small-size');
  parent.querySelector('ion-icon').style.overflow = 'hidden';

  for (let i = 0; i < Number(passCheck[3]); i++) {
    levelArray.push(`level-${i + 1}`);
  }

  let index = levelArray.indexOf(select);
  levelArray.splice(index, 1);

  levelArray.forEach(element => {
    const elementNode = document.querySelector(`.${element}`);
    elementNode.classList.add('small-size');
    elementNode.querySelector('ion-icon').style.overflow = 'visible';
  })
}

function finishQuizCreation() {
  // enviar form pra função que salva no localStorage
  document.querySelector('.creation-result').classList.remove('hide');
  postQuestion();
  // criar tela final
}

function renderSucess(quizzID) {
  document.querySelector('.creation-result').innerHTML = `<article>
    <h1>Seu quizz está pronto!</h1>
    <banner>
    <img src="${form.image}" alt="" onerror="this.src='./assets/imgs/error404.png'">
    <span>${form.title}</span>
    </banner>
    </article>
    <button class="goQuizzBtn" onclick="fromCreation(${quizzID});">Acessar Quizz</button>
    <button class="goHomeBtn" onclick="goHome();">Voltar pra home</button>`
}

function fromCreation(quizzID) {
  document.querySelector('main').classList.remove('hide');
  document.querySelector('.creation').classList.add('hide');
  chooseQuizz(quizzID);
}