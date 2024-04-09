

let cards = ["1", "1", "2", "2", "3", "3", "4", "4", "5", "5", "6", "6"];
let contadorJogadas = 0;
let tempoInicio;
let tempoDecorrido;
let timerInterval;

function embaralharCartas(cards) {
    return cards.sort(() => Math.random() - 0.5);
}

function iniciarJogo() {
    document.querySelector('.game').innerHTML = '';

     apelidoInput = document.getElementById('apelido');
     apelido = apelidoInput.value.toString();

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
            if (document.querySelectorAll('.boxOpen')[0].innerHTML ==
                document.querySelectorAll('.boxOpen')[1].innerHTML) {
                document.querySelectorAll('.boxOpen')[0].classList.add('boxMatch');
                document.querySelectorAll('.boxOpen')[1].classList.add('boxMatch');

                document.querySelectorAll('.boxOpen')[1].classList.remove('boxOpen');
                document.querySelectorAll('.boxOpen')[0].classList.remove('boxOpen');

                if (document.querySelectorAll('.boxMatch').length == cards.length) {
                    clearInterval(timerInterval);
                    alert('Você venceu, '  +  apelido + '! Tempo: ' + tempoDecorrido + ' segundos, Jogadas: ' + contadorJogadas);

                    function atualizarRankingEmTempoReal() {
                        const dadosJogador = {
                        apelido: apelido,
                        tempo: tempoDecorrido,
                        jogadas: contadorJogadas, };}

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
        tempoDecorrido = Math.floor((agora - tempoInicio) / 1000); // Tempo em segundos

        document.querySelector('.tempo').innerHTML = `Tempo: ${tempoDecorrido}`;
    }, 1000);
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
evt.currentTarget.className += ' active';

if (tabName === 'Ranking') {
obterRanking();
}
}

const fakeEvent = {
currentTarget: null,
};

openTab(fakeEvent, 'Jogo');



