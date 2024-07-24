import Player from './players';
import {
    wrapper,
    inputText,
    button,
    attackBoard,
    shipsBoard,
    clearApp,
} from './DOMrender';

const app = document.querySelector('#app');

export default class Game {
    constructor(player_1, player_2) {
        this.player1 = new Player(player_1 !== '' ? player_1 : undefined);
        this.player2 = new Player(player_2 !== '' ? player_2 : undefined);

        this.player1.setAdversary(this.player2);
    }

    setShips(player) {
        // TODO:
        // 1, que solo se cargue el tablero de los jugadores humanos...
        // 1.a, ordenar codigo
        // 2, que muestre donde va a acomodar el barco antes de ubicarlo
        // 3, drag n' drop
        //

        if (!player.name) {
            player.board.placeRemainignShipsRandom();

            if (player === this.player1) {
                this.setShips(this.player2);
            } else {
                console.log('listo pa arrancar');
            }
            return;
        }

        clearApp();

        const settings = wrapper('div', '', 'settings');

        const nav = wrapper('nav');
        nav.append(
            button('Coordenadas', '', '', true),
            button('Arrastrar y soltar'),
        );

        const dialog = wrapper('div', '', 'settings__dialog');

        const ship = wrapper(
            'p',
            'Barco de batalla(B), 1 de 5 barcos',
            'dialog__ship',
        );

        const form = wrapper('form');
        const input = inputText(
            'Ingresa las coordenadas y presiona [Enter] para confirmar o, escribe <No sé> para ubicar aleatoriamente',
            '<A-B> <1-10> <(H)orizontal/(V)ertical>',
        );
        form.append(input);

        dialog.append(ship, form);

        const confirmation = wrapper('div', '', 'settings__confirmation');
        confirmation.append(
            button('Reiniciar', 'set'),
            button('Confirmar', 'set', '', true),
        );

        settings.append(nav, dialog, confirmation);

        app.append(
            wrapper('p', `${player.name}, ubica tus barcos...`),
            shipsBoard(player),
            settings,
        );

        nav.querySelector('button:not(:disabled)').addEventListener(
            'pointerdown',
            () => {
                console.log('carajo');
            },
        );
    }

    playerAttack(player) {
        //
    }

    hangScreen() {
        //
    }

    afterMath() {
        //
    }
}
