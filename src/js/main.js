import '../css/styles.css';
import asciiArt from './asciiArt';
import {
    clearApp,
    wrapper,
    inputText,
    button,
    attackBoard,
    shipsBoard,
} from './DOMrender';
import Game from './gameflow';

const app = document.querySelector('#app');

app.append(
    wrapper('pre', asciiArt.submarine),
    wrapper('pre', asciiArt.name),
    wrapper('p', 'Presiona [Enter] o haz clic aquí para empezar'),
    wrapper('pre', asciiArt.sea),
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

const configGame = () => {
    app.append(
        wrapper(
            'p',
            'Escribe el nombre de los jugadores o deja un espacio en blanco para jugar contra la computadora...',
        ),
        inputText('¿Quién inicia el juego?', 'Nombre'),
        inputText('¿Quiés es el contrincante?', 'Nombre'),
        button('¡Iniciar el encuentro!'),
    );

    document.querySelector('button').addEventListener('pointerdown', () => {
        const [player1, player2] = document.querySelectorAll('input');

        if (!player1.value && !player2.value) {
            app.insertBefore(
                wrapper('h2', '¡Debe haber al menos una persona!', 'warn'),
                app.querySelector('label'),
            );

            return;
        }

        const game = new Game(player1.value, player2.value);
        game.setShips();
    });
};
