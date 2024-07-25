import Player from './players';
import {
    wrapper,
    inputText,
    button,
    attackBoard,
    shipsBoard,
    clearApp,
} from './DOMrender';
import Ship from './ships';

const app = document.querySelector('#app');

export default class Game {
    constructor(player_1, player_2) {
        this.player1 = new Player(player_1 !== '' ? player_1 : undefined);
        this.player2 = new Player(player_2 !== '' ? player_2 : undefined);

        this.player1.setAdversary(this.player2);
    }

    getShips(player) {
        const shipsLeft = player.board.shipsInventory.available.length;
        const ship = player.board.shipsInventory.available.shift();
        const size = Ship.shipsAndSize[ship];
        return { shipsLeft, ship, size };
    }

    renderShipsPositioningScreen(player, shipsAvailable) {
        clearApp();

        const { shipsLeft, ship } = shipsAvailable;

        const header = wrapper('p', `${player.name}, ubica tus barcos...`);
        const shipsPlacement = shipsBoard(player);

        const settings = wrapper('div', '', 'settings');

        const nav = wrapper('nav');
        const coordenatesBTN = button('Coordenadas', '', '', true);
        const dragNDropBTN = button('Arrastrar y soltar');
        nav.append(coordenatesBTN, dragNDropBTN);

        const instructions = wrapper('div', '', 'settings__dialog');
        const shipInventory = wrapper(
            'p',
            `${ship} (${ship.slice(0, 2)}), quedan ${shipsLeft} barcos por ubicar.`,
            'dialog__ship',
        );
        const form = wrapper('form');
        const input = inputText(
            'Ingresa las coordenadas y presiona [Enter] para confirmar o, escribe <No sé> para ubicar aleatoriamente',
            '<A-B> <1-10> <(H)orizontal/(V)ertical>',
        );
        form.append(input);
        instructions.append(shipInventory, form);
        settings.append(nav, instructions);

        const confirmation = wrapper('div', '', 'settings__confirmation');
        const resetBTN = button('Reiniciar', 'set');
        const confirmBTN = button('Confirmar', 'set', '', true);
        confirmation.append(resetBTN, confirmBTN);

        app.append(header, shipsPlacement, settings, confirmation);
    }

    setShips(player) {
        // TODO:
        // 3, drag n' drop
        //
        if (!player.name) {
            player.board.placeRemainignShipsRandom();
        }

        if (player.board.shipsInventory.placed.size === 5) {
            // TODO: activar el botón de confirmación si es persona, saltar a siguiente si no
            if (player === this.player1) {
                this.switcher('shipPlacement', this.player1, this.player2);
            } else {
                clearApp();
                this.playerAttack(this.player1);
            }
            return;
        }

        const { shipsLeft, ship, size } = this.getShips(player);
        this.renderShipsPositioningScreen(player, { shipsLeft, ship, size });
        const coordenates = document.querySelector('input');
        let setShipIn = null;

        coordenates.addEventListener('input', (event) => {
            this.clearShipPreview();

            const input = event.target;
            const rowRegex = input.value.match(/(10|[1-9])/);
            const colRegex = input.value.match(/\b[a-j]\b/i);
            const dirRegex = input.value.match(/\b(hor|ver)/i);
            setShipIn = null;

            if (!rowRegex || !colRegex || !dirRegex) {
                return;
            }

            const rowBase = +rowRegex[0] - 1;
            const colBase = +colRegex[0].toLowerCase().charCodeAt(0) - 97;
            const hor = /hor/i.test(dirRegex[0]);

            const col = hor && colBase + size > 10 ? 10 - size : colBase;
            const row = !hor && rowBase + size > 10 ? 10 - size : rowBase;

            this.shipPreview(row, col, hor, ship, size);

            setShipIn = document.querySelector('.board__ships--warn')
                ? null
                : { row, col, hor, ship };
        });

        coordenates.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && setShipIn) {
                const { col, row, hor, ship } = setShipIn;
                player.board.placeShip(col, row, hor, ship);
                this.setShips(player);
            } else if (event.key === 'Enter') {
                event.preventDefault();
            }
        });
    }

    clearShipPreview() {
        if (document.querySelector('[data-current]')) {
            document.querySelectorAll('[data-current]').forEach((cell) => {
                cell.removeAttribute('data-current');
                cell.className = 'board__ships';
                cell.textContent = '';
            });
        }
        if (document.querySelectorAll('.board__ships--warn')) {
            document.querySelectorAll('.board__ships--warn').forEach((cell) => {
                cell.classList.remove('board__ships--warn');
            });
        }
    }

    shipPreview(rowValue, colValue, dirValue, shipToPlace, shipSize) {
        for (let l = 0; l < shipSize; l++) {
            const i = !dirValue ? rowValue + l : rowValue;
            const j = dirValue ? colValue + l : colValue;
            const cell = document.querySelector(`[data-cell="${i}-${j}"]`);

            if (!cell.textContent) {
                cell.setAttribute('data-current', true);
                cell.className += ' board__ships--occupied';
                cell.textContent = `${shipToPlace.slice(0, 2)}`;
            } else {
                cell.classList.add('board__ships--warn');
            }
        }
    }

    playerAttack(player) {
        console.log(player.name ?? 'compu', ' al ataque');
        //
    }

    switcher(type, playerFrom, playerTo) {
        if (type === 'shipPlacement') {
            clearApp();
            const mensaje = wrapper(
                'p',
                `${playerFrom.name}, entrégale el dispositivo a ${playerFrom.adversaryName}...`,
            );
            const btn = button(
                `${playerTo.name}, clic aquí para ubicar tus barcos`,
            );
            app.append(mensaje, btn);

            btn.addEventListener('pointerdown', () => {
                this.setShips(playerTo);
            });
        }
    }

    afterMath() {
        //
    }
}
