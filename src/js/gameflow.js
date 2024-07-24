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

    setShips() {
        // TODO: 
        // 1, que solo se cargue el tablero de los jugadores humanos... 
        // 2, que muestre donde va a acomodar el barco antes de ubicarlo
        // 3, drag n' drop
        //

        clearApp();

        this.player1.board.placeRemainignShipsRandom()

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
            'Escribe las coordenadas y presiona [Enter] para confirmar la ubicación:',
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
            wrapper(
                'p',
                `${this.player1.name}, ubica tus barcos...`,
            ),
            shipsBoard(this.player1),
            settings,
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
