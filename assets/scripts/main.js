let loadedQuizzes = [];
const uri = 'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/';
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

function chooseQuizz(id){
    const promise = axios.get(uri+id);
    promise.then(renderQuizz);
    promise.catch((error) => {
        console.log(error);
    });
}

function renderQuizz(answer){
    console.log(answer);
    document.querySelector('main').classList.add('hide');
    document.querySelector('.quizz-page').classList.remove('hide');

    document.querySelector('.banner').innerHTML = `<img src="${answer.data.image}" alt="">
            <span>${answer.data.title}</span>`;
    
    document.querySelector('.question-feed').innerHTML = "";
    
    for (let i = 0; i < answer.data.questions.length; i++){
        document.querySelector('.question-feed').innerHTML += `
            <div class="question-box">
                <div class="question" style="background-color:${answer.data.questions[i].color};">
                    <span>${answer.data.questions[i].title}</span>
                </div>
                <div class="answer-box data${i}"></div>
            </div>`;
    }
    

    for(let j = 0; j < answer.data.questions.length; j++){
        const sortedAnswers = answer.data.questions[j].answers.sort(shuffle);
        console.log(sortedAnswers);

        for(let z = 0; z < sortedAnswers.length; z++){
            console.log(z);
            document.querySelector(`.data${j}`).innerHTML += `
                    <div class="answer">
                        <img src="${sortedAnswers[z].image}" alt="">
                        <span>${sortedAnswers[z].text}</span>
                    </div>
                </div>
            </div>`;
        }
    }
}

function shuffle() { 
	return Math.random() - 0.5; 
}