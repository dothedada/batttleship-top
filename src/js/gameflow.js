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

    setShips(player) {
        // TODO:
        // 2, secuencia de ubicacion de barcos
        // revisar el enter cuando no es una coordenada válida
        // 3, drag n' drop
        //
        clearApp();

        if (!player.name) {
            player.board.placeRemainignShipsRandom();

            if (player === this.player1) {
                this.setShips(this.player2);
            } else {
                // TODO:
                // puente a la etapa de ataques
                console.log('listo pa arrancar');
            }
            return;
        }

        const remainingShips = player.board.shipsInventory.available.length;
        const shipToPlace = player.board.shipsInventory.available.shift();
        const shipToPlaceLength = Ship.shipsAndSize[shipToPlace];

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
            `${shipToPlace} (${shipToPlace.slice(0, 2)}), quedan ${remainingShips} barcos por ubicar.`,
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

        const coordenates = document.querySelector('input');
        coordenates.addEventListener('input', () => {
            if (document.querySelector('[data-current]')) {
                const cellRemove = document.querySelectorAll('[data-current]');
                cellRemove.forEach((cell) => {
                    cell.removeAttribute('data-current');
                    cell.className = 'board__ships';
                    cell.textContent = '';
                });
            }
            if (document.querySelectorAll('.board__ships--warn')) {
                document
                    .querySelectorAll('.board__ships--warn')
                    .forEach((cell) => {
                        cell.classList.remove('board__ships--warn');
                    });
            }
            const rowRegex = coordenates.value.match(/(10|[1-9])/);
            const colRegex = coordenates.value.match(/[a-j]/i);
            const dirRegex = coordenates.value.match(/(hor|ver)/i);

            if (rowRegex && colRegex && dirRegex) {
                const dirValue = dirRegex[0] === 'hor';

                const colBase = +colRegex[0].toLowerCase().charCodeAt(0) - 97;
                const rowBase = +rowRegex[0] - 1;

                const colValue =
                    dirValue && colBase + shipToPlaceLength > 10
                        ? 10 - shipToPlaceLength
                        : colBase;
                const rowValue =
                    !dirValue && rowBase + shipToPlaceLength > 10
                        ? 10 - shipToPlaceLength
                        : rowBase;

                for (let l = 0; l < shipToPlaceLength; l++) {
                    const i = !dirValue ? rowValue + l : rowValue;
                    const j = dirValue ? colValue + l : colValue;
                    const cell = document.querySelector(
                        `[data-cell="${i}-${j}"]`,
                    );

                    if (!cell.textContent) {
                        cell.setAttribute('data-current', true);
                        cell.className += ' board__ships--occupied';
                        cell.textContent = `${shipToPlace.slice(0, 2)}`;
                    } else {
                        cell.classList.add('board__ships--warn');
                    }
                }

                coordenates.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' && !document.querySelector('.board__ships--warn')) {
                        player.board.placeShip(
                            colValue,
                            rowValue,
                            dirValue,
                            shipToPlace,
                        );
                        if (remainingShips > 0) {
                            this.setShips(player);
                        }
                    } else {
                        console.log('carajo')
                    }
                });
            }
        });
    }

    renderPosition(col, row, horizontal, ship) {

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
