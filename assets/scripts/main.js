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

function inputChecks(passCheck){
    if (passCheck.length === 4) {
        console.log('all pass');
        //execute command to show next step;
    }
}