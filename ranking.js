const API_URL = process.env.API_URL || 'http://localhost:3000';

let cards = ["1", "1", "2", "2", "3", "3", "4", "4", "5", "5", "6", "6"];
let contadorJogadas = 0;
let tempoInicio;
let tempoDecorrido;
let timerInterval;
let apelido;

function embaralharCartas(cards) {
    return cards.sort(() => Math.random() - 0.5);
}

function iniciarJogo() {
    document.querySelector('.game').innerHTML = '';

    const apelidoInput = document.getElementById('apelido');
    apelido = apelidoInput.value.trim();

    if (!apelido) {
        alert('Por favor, insira um apelido antes de começar o jogo.');
        return;
    }

    apelidoInput.style.display = 'none';

    const startButton = document.getElementById('startButton');
    startButton.textContent = 'Restart';
    contadorJogadas = 0;
    tempoInicio = new Date().getTime();
    clearInterval(timerInterval);
    atualizarTempo();

    const shuffledCards = embaralharCartas(cards);

    for (let i = 0; i < shuffledCards.length; i++) {
        let box = document.createElement('div');
        box.className = 'item';
        box.innerHTML = shuffledCards[i];

        box.onclick = function() {
            virarCarta(this);
        };

        document.querySelector('.game').appendChild(box);
    }
}

function virarCarta(carta) {
    carta.classList.add('boxOpen');

    setTimeout(function() {
        if (document.querySelectorAll('.boxOpen').length > 1) {
            if (document.querySelectorAll('.boxOpen')[0].innerHTML == document.querySelectorAll('.boxOpen')[1].innerHTML) {
                document.querySelectorAll('.boxOpen')[0].classList.add('boxMatch');
                document.querySelectorAll('.boxOpen')[1].classList.add('boxMatch');

                document.querySelectorAll('.boxOpen')[1].classList.remove('boxOpen');
                document.querySelectorAll('.boxOpen')[0].classList.remove('boxOpen');

                if (document.querySelectorAll('.boxMatch').length == cards.length) {
                    clearInterval(timerInterval);
                    alert('Você venceu, ' + apelido + '! Tempo: ' + tempoDecorrido + ' segundos, Jogadas: ' + contadorJogadas);
                    enviarScore(apelido, tempoDecorrido, contadorJogadas);
                    obterRanking();
                }
            } else {
                document.querySelectorAll('.boxOpen')[1].classList.remove('boxOpen');
                document.querySelectorAll('.boxOpen')[0].classList.remove('boxOpen');
            }

            contadorJogadas++;
            document.querySelector('.jogadas').innerHTML = `Jogadas: ${contadorJogadas}`;
        }
    }, 500);
}

function atualizarTempo() {
    timerInterval = setInterval(function() {
        const agora = new Date().getTime();
        tempoDecorrido = Math.floor((agora - tempoInicio) / 1000); 

        document.querySelector('.tempo').innerHTML = `Tempo: ${tempoDecorrido}`;
    }, 1000);
}

function enviarScore(apelido, tempo, jogadas) {
    fetch(`${API_URL}/submit-score`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apelido, tempo, jogadas })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function obterRanking() {
    fetch(`${API_URL}/leaderboard`)
    .then(response => response.json())
    .then(data => {
        console.log("Dados do ranking recebidos:", data); 

        const tabelaRanking = document.getElementById('tabela-ranking');
        tabelaRanking.innerHTML = '';

        data.forEach((score, index) => {
            const row = document.createElement('tr');
            const rankCell = document.createElement('td');
            const apelidoCell = document.createElement('td');
            const tempoCell = document.createElement('td');
            const jogadasCell = document.createElement('td');

            rankCell.textContent = index + 1;
            apelidoCell.textContent = score.apelido;
            tempoCell.textContent = score.tempo;
            jogadasCell.textContent = score.jogadas;

            row.appendChild(rankCell);
            row.appendChild(apelidoCell);
            row.appendChild(tempoCell);
            row.appendChild(jogadasCell);

            tabelaRanking.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName('tabcontent');
    for (const tabContent of tabContents) {
        tabContent.style.display = 'none';
    }

    const tabLinks = document.getElementsByClassName('tablinks');
    for (const tabLink of tabLinks) {
        tabLink.className = tabLink.className.replace(' active', '');
    }

    document.getElementById(tabName).style.display = 'block';
    if (evt.currentTarget) {
        evt.currentTarget.className += ' active';
    }

    if (tabName === 'Ranking') {
        obterRanking();
    }
}

const fakeEvent = {
    currentTarget: null,
};

openTab(fakeEvent, 'Jogo');
