let loadedQuizzes = [];

getQuizz();
function getQuizz(){
    loadedQuizzes = [];
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
    promise.then((answer)=>{
        let lastIndex = answer.data.length-1;
        document.querySelector('.quizz>ul').innerHTML = ''
        for(let i = 0; i < lastIndex; i++){
            document.querySelector('.quizz>ul').innerHTML += `<li onclick="renderQuiz(${i});">
            <img src="${answer.data[i].image}" alt="">
            <span>${answer.data[i].title}</span>
        </li>`;
        loadedQuizzes.push(answer.data[i]);
        }
    });
}