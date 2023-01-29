let configEditable = '';
let editID = 0;
localStorageRender();
function localStorageRender() {
    if (localStorage.length !== 0) {
        const localKeys = Object.keys(localStorage);
        document.querySelector('.user-nav').classList.add('has-data');
        document.querySelector('.user-list').innerHTML = ''
        localKeys.forEach(element => {
            const objId = Number(element);
            const objPARSE = JSON.parse(localStorage.getItem(objId))
            document.querySelector('.user-list').innerHTML += `<li onclick="chooseQuizz(${objId});">
            <div class="localStorageBtns">
            <button class="editBtn" onclick="event.stopPropagation(); editQuizz(${objId});"><ion-icon name="create-outline"></ion-icon></button>
            <button class="deleteBtn" onclick="event.stopPropagation(); removeQuizz(${objId});"><ion-icon name="trash-outline"></ion-icon></button>
            </div>
            <img src="${objPARSE.image}" alt="" onerror="this.src='./assets/imgs/error404.png'">
            <span>${objPARSE.title}</span>
        </li>`;
        });
    }
}

function postQuestion() {
    if (editable === true) {
        const promise = axios.put(uri + editID, form, configEditable)
        promise.then((answer) => {
            const answerID = answer.data.id;
            const sendingObj = JSON.stringify({
                key: answer.data.key,
                image: answer.data.image,
                title: answer.data.title
            });
            localStorage.setItem(answerID, sendingObj);
            renderSucess(answerID);
        });
        promise.catch((answer) => {
            alert('Envio de quizz falhou');
            console.log(answer);
        })
    } else {
        const promise = axios.post(uri, form)
        promise.then((answer) => {
            const answerID = answer.data.id;
            const sendingObj = JSON.stringify({
                key: answer.data.key,
                image: answer.data.image,
                title: answer.data.title
            });
            localStorage.setItem(answerID, sendingObj);
            renderSucess(answerID);
        });
        promise.catch((answer) => {
            alert('Envio de quizz falhou');
            console.log(answer);
        })
    }
}

function removeQuizz(quizzId) {
    let config = {
        headers: {
            'Secret-Key': ''
        }
    };
    const confirmation = confirm('Você quer mesmo deletar este quizz?');
    if (confirmation === true) {
        document.querySelector('.loadingscreen').classList.remove('hide');
        const key = JSON.parse(localStorage.getItem(quizzId)).key;
        config.headers["Secret-Key"] = key;
        const promise = axios.delete(uri + quizzId, config);
        promise.then(() => {
            localStorage.removeItem(quizzId);
            goHome();
        });
    }
}
function editQuizz(id) {
    document.querySelector('.loadingscreen').classList.remove('hide');
    editable = true;
    editID = id;
    if (editable === true) {
        const promise = axios.get(uri + id);
        promise.then((answer) => {
            configEditable = {headers: {'Secret-Key': JSON.parse(localStorage.getItem(id)).key}};
            form = {
                title: answer.data.title,
                image: answer.data.image,
                questions: answer.data.questions,
                levels: answer.data.levels
            }
            answer.data;
            creationPage();
            mapInputs(1);
            document.querySelector('.loadingscreen').classList.add('hide');
        })
    }
}

function mapInputs(step) {
    if (step === 1) {
        document.querySelector('.creation--title').value = form.title;
        document.querySelector('.creation--img').value = form.image;
        document.querySelector('.creation--qnum').value = form.questions.length;
        document.querySelector('.creation--lvls').value = form.levels.length;
    }
    if (step === 2) {
        for (let i = 0; i < form.questions.length; i++) {
            document.querySelector(`.question-title${i + 1}`).value = form.questions[i].title;
            document.querySelector(`.question-color${i + 1}`).value = form.questions[i].color;
            for (let k = 0; k < form.questions[i].answers.length; k++) {
                document.querySelector(`.question-answer-${i + 1}-${k + 1}`).value = form.questions[i].answers[k].text;
                document.querySelector(`.question-url-${i + 1}-${k + 1}`).value = form.questions[i].answers[k].image;
            }
        }
    }
    if (step === 3) {
        for (let i = 0; i < form.levels.length; i++) {
            const allInputsLvl = document.querySelector(`.level-${i + 1}`).querySelectorAll('input');
            allInputsLvl[0].value = form.levels[i].title;
            allInputsLvl[1].value = form.levels[i].minValue;
            allInputsLvl[2].value = form.levels[i].image;
            document.querySelector(`.level-${i + 1}`).querySelector('textarea').value = form.levels[i].text;
        }
    }
}