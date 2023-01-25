let loadedQuizzes = [];
const uri = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes';
getQuizz();
function getQuizz() {
    loadedQuizzes = [];
    const promise = axios.get(uri)
    promise.then((answer) => {
        let lastIndex = answer.data.length - 1;
        document.querySelector('.quizz>ul').innerHTML = ''
        for (let i = 0; i < lastIndex; i++) {
            document.querySelector('.quizz>ul').innerHTML += `<li onclick="renderQuiz(${i});">
            <img src="${answer.data[i].image}" alt="">
            <span>${answer.data[i].title}</span>
        </li>`;
            loadedQuizzes.push(answer.data[i]);
        }
    });
}

function creationPage() {
    document.querySelector('main').classList.add('hide');
    document.querySelector('.creation').classList.remove('hide');
}

function validateInput() {
    const gameTitle = document.querySelector('.creation--title');
    const gameImage = document.querySelector('.creation--img');
    const gameQuestionNums = document.querySelector('.creation--qnum');
    const gameLevelNums = document.querySelector('.creation--lvls');
    console.log(gameTitle.value.length)
    const passCheck = [];
    const erroInfo = []
    if (gameTitle.value.length < 20 || gameTitle.value.length > 66) {
        gameTitle.classList.add('validation-error');
        erroInfo.push('O título deve ter entre 20 e 65 caracteres')
    } else {
        passCheck.push('1');
        if (gameTitle.classList.contains('validation-error')) {
            gameTitle.classList.remove('validation-error');
        }
    }
    if (!gameImage.value.includes('https://')) {
        gameImage.classList.add('validation-error');
        erroInfo.push('A imagem deve ser uma url em https://')
    } else {
        passCheck.push('2');
        if (gameImage.classList.contains('validation-error')) {
            gameImage.classList.remove('validation-error');
        }
    }
    if (gameQuestionNums.value < 3) {
        gameQuestionNums.classList.add('validation-error');
        erroInfo.push('Faça um mínimo de 3 perguntas');
    } else {
        passCheck.push('3');
        if (gameQuestionNums.classList.contains('validation-error')) {
            gameQuestionNums.classList.remove('validation-error');
        }
    }
    if (gameLevelNums.value < 2) {
        gameLevelNums.classList.add('validation-error');
        erroInfo.push('Faça pelo menos 2 niveis de resultado');
    } else {
        passCheck.push('4');
        if (gameLevelNums.classList.contains('validation-error')) {
            gameLevelNums.classList.remove('validation-error');
        }
    }
    inputChecks(passCheck, erroInfo);
}

function inputChecks(passCheck, erroInfo){
    if (passCheck.length === 4) {
        console.log('all pass');
        //execute command to show next step;
    } else {
        for(let i = 0; i < erroInfo.length; i++){
            alert(`Preencha os campos corretamente: ${erroInfo[i]}`);
        }
    }
}