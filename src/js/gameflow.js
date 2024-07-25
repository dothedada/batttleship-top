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

    getShip(player) {
        const shipsLeft = player.board.shipsInventory.available.length;
        const shipToPlace = player.board.shipsInventory.available.shift();
        const shipSize = Ship.shipsAndSize[shipToPlace];
        return { shipsLeft, shipToPlace, shipSize };
    }

    renderShipPlacementScreen(player, shipsAvailable) {
        clearApp();

        const { shipsLeft, shipToPlace } = shipsAvailable;

        const header = wrapper('p', `${player.name}, ubica tus barcos...`);
        const shipsPlacement = shipsBoard(player);

        const settings = wrapper('div', '', 'settings');

        const nav = wrapper('nav');
        const coordenatesBTN = button('Coordenadas', '', '', true);
        const dragNDropBTN = button('Arrastrar y soltar');
        nav.append(coordenatesBTN, dragNDropBTN);

        const instructions = wrapper('div', '', 'settings__dialog');
        const ship = wrapper(
            'p',
            `${shipToPlace} (${shipToPlace.slice(0, 2)}), quedan ${shipsLeft} barcos por ubicar.`,
            'dialog__ship',
        );
        const form = wrapper('form');
        const input = inputText(
            'Ingresa las coordenadas y presiona [Enter] para confirmar o, escribe <No sé> para ubicar aleatoriamente',
            '<A-B> <1-10> <(H)orizontal/(V)ertical>',
        );
        form.append(input);
        instructions.append(ship, form);
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
        if (player.board.shipsInventory.placed.size === 5) {
            console.log('Inicio de método setShips, no quedan barcos por poner')
        }

        const { shipsLeft, shipToPlace, shipSize } = this.getShip(player);
        this.renderShipPlacementScreen(player, {
            shipsLeft,
            shipToPlace,
            shipSize,
        });

        if (!shipToPlace) {
            console.log('renderizado justo depues de obtener barcos')
        }

        const coordenates = document.querySelector('input');

        let setShipIn = null;

        coordenates.addEventListener('input', (event) => {
            this.clearShipPreview();
            const position = event.target;
            setShipIn = null;

            const rowRegex = position.value.match(/(10|[1-9])/);
            const colRegex = position.value.match(/\b[a-j]\b/i);
            const dirRegex = position.value.match(/\b(hor|ver)/i);

            if (!rowRegex || !colRegex || !dirRegex) {
                return;
            }

            const rowBase = +rowRegex[0] - 1;
            const colBase = +colRegex[0].toLowerCase().charCodeAt(0) - 97;
            const dirValue = dirRegex[0] === 'hor';

            const colValue =
                dirValue && colBase + shipSize > 10 ? 10 - shipSize : colBase;
            const rowValue =
                !dirValue && rowBase + shipSize > 10 ? 10 - shipSize : rowBase;

            setShipIn = this.renderShipPreview(
                rowValue,
                colValue,
                dirValue,
                shipSize,
                shipToPlace,
            );
        });

        coordenates.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && setShipIn) {
                const { colValue, rowValue, dirValue, shipToPlace } = setShipIn;
                player.board.placeShip(
                    colValue,
                    rowValue,
                    dirValue,
                    shipToPlace,
                );
                // if (shipsLeft > 0) {
                //     console.log('boton de siguiente')
                    this.setShips(player);
                // }
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

    renderShipPreview(rowValue, colValue, dirValue, shipSize, shipToPlace) {
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

        return document.querySelector('.board__ships--warn')
            ? null
            : { colValue, rowValue, dirValue, shipToPlace };
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
