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
            
            <button class="deleteBtn" onclick="event.stopPropagation(); removeQuizz(${objId});"><ion-icon name="trash-outline"></ion-icon></button>
            </div>
            <img src="${objPARSE.image}" alt="" onerror="this.src='./assets/imgs/error404.png'">
            <span>${objPARSE.title}</span>
        </li>`;
        });
    }
}

function postQuestion() {
    const promise = axios.post(uri, form)
    promise.then((answer) => {
        console.log(answer);
        const answerID = answer.data.id;
        const sendingObj = JSON.stringify({
            key: answer.data.key,
            image: answer.data.image,
            title: answer.data.title
        });
        localStorage.setItem(answerID, sendingObj);
        renderSucess(answerID);
    })
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