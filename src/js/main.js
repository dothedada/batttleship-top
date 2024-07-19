import '../css/reset.css';
import '../css/styles.css';
import renderInDOM, { Screen } from './DOMrender';
import asciiArt from './asciiArt';
import Player from './players';

const header = document.querySelector('#header');
const app = document.querySelector('#app');

const screenFlow = new Screen();

let player1;
let player2;

const renderGame = {
    startGame: () => {
        screenFlow.next();
        renderGame[screenFlow.current]();
    },

    start: () => {
        header.innerHTML = `<pre>${asciiArt.submarine}</pre><pre>${asciiArt.name}</pre>`;
        app.innerHTML = `<p>Presiona cualquier tecla o haz clic para empezar</p><pre>${asciiArt.sea}</pre>`;
        document.body.addEventListener('keydown', renderGame.startGame);
        document.body.addEventListener('pointerdown', renderGame.startGame);
    },

    setUpPlayers: () => {
        document.body.removeEventListener('keydown', renderGame.startGame);
        document.body.removeEventListener('pointerdown', renderGame.startGame);
        header.innerHTML = '';
        app.textContent = '';
        app.append(
            renderInDOM.inputText(
                '¿Quién arranca el juego?, deja vacío para que sea la computadora',
                'Escibe el nombre',
            ),
            renderInDOM.inputText(
                '¿Quién sigue?, deja vacío para que sea la computadora',
                'Escibe el nombre',
            ),
            renderInDOM.wrapper('h2', '', 'Debe haber al menos un nombre'),
            renderInDOM.button('¡Iniciar el encuentro!'),
        );

        document.querySelector('button').addEventListener('pointerdown', () => {
            const [name1, name2] = document.querySelectorAll('input');
            player1 = new Player(name1.value === '' ? undefined : name1.value)
            player2 = new Player(name2.value === '' ? undefined : name2.value)
            player1.setAdversary(player2)
            console.log(player1.name)
            console.log(player2.name)
        });
    },
};

renderGame[screenFlow.current]();
