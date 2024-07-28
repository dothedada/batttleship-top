import '../css/styles.css';
import asciiArt from './asciiArt';
import {
    clearApp,
    wrapper,
    inputText,
    inputNumber,
    button,
} from './DOMrender';
import Game from './gameflow';

const app = document.querySelector('#app');

const loadGame = () => {
    app.append(
        wrapper('pre', asciiArt.submarine),
        wrapper('pre', asciiArt.name),
        wrapper('pre', asciiArt.sea),
        wrapper('p', 'Presiona [Enter] o haz clic aquí para empezar...'),
    );

    const startGame = (event) => {
        if (event.type === 'pointerdown' || event.key === 'Enter') {
            clearApp();
            app.removeEventListener('pointerdown', startGame);
            document.body.removeEventListener('keydown', startGame);
            configGame();
        }
    };

    app.addEventListener('pointerdown', startGame);
    document.body.addEventListener('keydown', startGame);
};

const configGame = () => {
    app.append(
        wrapper(
            'p',
            'Escribe el nombre de los jugadores o deja un espacio en blanco para jugar contra la computadora...',
        ),
        inputText('¿Quién inicia el juego?', 'Nombre'),
        inputText('¿Quiés es el contrincante?', 'Nombre'),
        inputNumber(
            '¿Turnos de cuanto tiempo? (1-60 segundos)',
            '<1-60>',
            1,
            60,
            15,
        ),
        button('¡Iniciar el encuentro!'),
    );

    const submitSettings = (event) => {

        if (event.type !== 'pointerdown' && event.key !== 'Enter') {
            return;
        }

        const [player1, player2, timer] = document.querySelectorAll('input');

        const previousWarns = app.querySelectorAll('.warn');
        previousWarns.forEach((warn) => warn.remove());
        let validationError = false;

        if (!player1.value && !player2.value) {
            app.insertBefore(
                wrapper('h2', '¡Debe haber al menos una persona!', 'warn'),
                app.querySelector('label'),
            );
            validationError = true;
        }

        if (isNaN(timer.value) || +timer.value < 1 || timer.value > 60) {
            app.insertBefore(
                wrapper(
                    'h2',
                    '¡El timer sólo acepta números entre 1 y 60!',
                    'warn',
                ),
                app.querySelector('label'),
            );
            validationError = true;
        }

        if (validationError) {
            return;
        }

        document.body.removeEventListener('keydown', submitSettings);

        const game = new Game(player1.value, player2.value, +timer.value);
        game.setShips(game.player1);
    };

    document
        .querySelector('button')
        .addEventListener('pointerdown', submitSettings);
    document.body.addEventListener('keydown', submitSettings);
};

loadGame();
