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