localStorageRender();
function localStorageRender() {
    if (localStorage.length !== 0) {
        const localKeys = Object.keys(localStorage);
        document.querySelector('.user-nav').classList.add('has-data');
        document.querySelector('.user-list').innerHTML = ''
        localKeys.forEach(element => {
            const objId = Number(element);
            const objPARSE = JSON.parse(localStorage.getItem(objId))
            console.log(objPARSE)
            document.querySelector('.user-list').innerHTML += `<li onclick="chooseQuizz(${objId});">
            <img src="${objPARSE.image}" alt="" onerror="this.src='./assets/imgs/error404.png'">
            <span>${objPARSE.title}</span>
        </li>`;
        });
    }
}

function postQuestion() {
    const objectSend = {
        title: "Título do quizz",
        image: "https://http.cat/411.jpg",
        questions: [
            {
                title: "Título da pergunta 1",
                color: "#123456",
                answers: [
                    {
                        text: "Texto da resposta 1",
                        image: "https://http.cat/411.jpg",
                        isCorrectAnswer: true
                    },
                    {
                        text: "Texto da resposta 2",
                        image: "https://http.cat/412.jpg",
                        isCorrectAnswer: false
                    }
                ]
            },
            {
                title: "Título da pergunta 2",
                color: "#123456",
                answers: [
                    {
                        text: "Texto da resposta 1",
                        image: "https://http.cat/411.jpg",
                        isCorrectAnswer: true
                    },
                    {
                        text: "Texto da resposta 2",
                        image: "https://http.cat/412.jpg",
                        isCorrectAnswer: false
                    }
                ]
            },
            {
                title: "Título da pergunta 3",
                color: "#123456",
                answers: [
                    {
                        text: "Texto da resposta 1",
                        image: "https://http.cat/411.jpg",
                        isCorrectAnswer: true
                    },
                    {
                        text: "Texto da resposta 2",
                        image: "https://http.cat/412.jpg",
                        isCorrectAnswer: false
                    }
                ]
            }
        ],
        levels: [
            {
                title: "Título do nível 1",
                image: "https://http.cat/411.jpg",
                text: "Descrição do nível 1",
                minValue: 0
            },
            {
                title: "Título do nível 2",
                image: "https://http.cat/412.jpg",
                text: "Descrição do nível 2",
                minValue: 50
            }
        ]
    }
    const promise = axios.post(uri, objectSend)
    promise.then((answer) => {
        console.log(answer);
        const answerID = answer.data.id;
        const sendingObj = JSON.stringify({
            key: answer.data.key,
            image: answer.data.image,
            title: answer.data.title
        });
        localStorage.setItem(answerID, sendingObj);
        window.location.reload();
    })
}