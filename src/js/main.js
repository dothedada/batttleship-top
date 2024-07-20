import '../css/reset.css';
import '../css/styles.css';
import renderInDOM from './DOMrender';
import asciiArt from './asciiArt';
import Player from './players';

const header = document.querySelector('#header');
const app = document.querySelector('#app');

header.textContent = 'header';
app.textContent = 'app';

const game = {
    player1: undefined,
    player2: undefined,

    clearScreen: () => {
        header.textContent = '';
        app.textContent = '';
    },

    start: () => {
        game.clearScreen();

        document.body.removeEventListener('keydown', game.start);
        document.body.removeEventListener('pointerdown', game.start);

        game.setPlayers();
    },

    landing: () => {
        header.innerHTML = `<pre>${asciiArt.submarine}</pre><pre>${asciiArt.name}</pre>`;
        app.innerHTML = `<p>Presiona cualquier tecla o haz clic para iniciar...</p><pre>${asciiArt.sea}</pre>`;

        document.body.addEventListener('keydown', game.start);
        document.body.addEventListener('pointerdown', game.start);
    },

    setPlayers: () => {
        const setPlayersBTN = renderInDOM.button('¡Iniciar el encuentro!');

        setPlayersBTN.addEventListener('pointerdown', () => {
            const [name1, name2] = document.querySelectorAll('input');

            if (!name1.value && !name2.value) {
                header.append(
                    renderInDOM.wrapper(
                        'div',
                        'warn',
                        '¡Debe haber al menos una persona jugando!',
                    ),
                );
            }

            game.player1 = new Player(!name1.value ? undefined : name1.value);
            game.player2 = new Player(!name2.value ? undefined : name2.value);
            game.player1.setAdversary(game.player2);
        });

        app.append(
            renderInDOM.inputText(
                '¿Quién arranca el juego?, deja vacío para que sea la computadora',
                'Escibe el nombre',
            ),
            renderInDOM.inputText(
                '¿Quién sigue?, deja vacío para que sea la computadora',
                'Escibe el nombre',
            ),
            setPlayersBTN,
        );
    },
    setShips: () => {
        //
    },
    attack: () => {
        //
    },
    hangOver: () => {
        //
    },
    aftermath: () => {
        //
    },
};

game.landing();
