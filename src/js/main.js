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
        console.log('blablablablablablabla')
        clearApp()

        app.removeEventListener('pointerdown', startGame)
        document.body.removeEventListener('keydown', startGame)

        app.textContent = 'nnnn'
    }





}
app.addEventListener('pointerdown', startGame)
document.body.addEventListener('keydown', startGame)



// const game = {
//     start: () => {
//         game.clearScreen();
//
//         document.body.removeEventListener('keydown', game.start);
//         document.body.removeEventListener('pointerdown', game.start);
//
//         game.setPlayers();
//     },
//
//     landing: () => {
//
//         document.body.addEventListener('keydown', game.start);
//         document.body.addEventListener('pointerdown', game.start);
//     },
//
//     setPlayers: () => {
//         const setPlayersBTN = button('¡Iniciar el encuentro!');
//
//         setPlayersBTN.addEventListener('pointerdown', () => {
//             const [name1, name2] = document.querySelectorAll('input');
//
//             if (!name1.value && !name2.value) {
//                 header.append(
//                     wrapper(
//                         'div',
//                         'warn',
//                         '¡Debe haber al menos una persona jugando!',
//                     ),
//                 );
//             }
//
//             game.player1 = new Player(!name1.value ? undefined : name1.value);
//             game.player2 = new Player(!name2.value ? undefined : name2.value);
//             game.player1.setAdversary(game.player2);
//
//             game.setShips();
//         });
//
//         app.append(
//             inputText(
//                 '¿Quién arranca el juego?, deja vacío para que sea la computadora',
//                 'Escibe el nombre',
//             ),
//             inputText(
//                 '¿Quién sigue?, deja vacío para que sea la computadora',
//                 'Escibe el nombre',
//             ),
//             setPlayersBTN,
//         );
//     },
// };
//
// game.landing();
