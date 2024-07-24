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
        clearApp();

        const nav = wrapper('nav');
        nav.append(
            button('Coordenadas', '', '', true),
            button('Arrastrar y soltar'),
        );

        const dialog = wrapper('div', '', 'settings__dialog');

        const ship = wrapper(
            'div',
            'Barco de batalla(B), 1 de 5 barcos',
            'dialog__ship',
        );

        const form = wrapper('form');
        const input = inputText(
            'Escribe las coordenadas y oprime [Enter] para confirmar la ubicación',
            '<A-B> <1-10> <(H)orizontal/(V)ertical>',
        );
        form.append(input);

        dialog.append(ship, form);

        const confirmation = wrapper('div', '', 'settings__confirmation');
        confirmation.append(
            button('Reiniciar', 'set'),
            button('Confirmar la ubicacion de mis barcos', 'set', '', true),
        );

        app.append(shipsBoard(this.player1), nav, dialog, confirmation);
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
