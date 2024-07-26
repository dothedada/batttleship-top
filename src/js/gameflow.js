import Player from './players';
import asciiArt from './asciiArt';
import {
    wrapper,
    inputText,
    button,
    attackBoard,
    shipsBoard,
    clearApp,
} from './DOMrender';
import Ship from './ships';

// TODO: revisar la implementación del switcher

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

    renderShipsBoard(player, shipsAvailable, confirm = undefined) {
        clearApp();

        const headerTXT = !confirm
            ? `${player.name}, ubica tus barcos...`
            : `${player.name}, ¿Quieres esta disposición para tu flota?`;
        const header = wrapper('p', headerTXT);
        const shipsPlacement = shipsBoard(player);
        const settings = wrapper('div', '', 'settings');

        if (!confirm) {
            const nav = wrapper('nav');
            const coordenatesBTN = button('Coordenadas', '', '', true);
            const dragNDropBTN = button('Arrastrar y soltar');
            nav.append(coordenatesBTN, dragNDropBTN);

            const { shipsLeft, ship } = shipsAvailable;
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
            const resetBTN = button('Reiniciar', '', 'reset');

            settings.append(nav, instructions, resetBTN);
        } else {
            const resetBTN = button('No, volver a ubicar', 'set', 'reset');
            const confirmBTN = button('Sí', '', 'confirm');

            settings.append(resetBTN, confirmBTN);
        }

        app.append(header, shipsPlacement, settings);
    }

    setShips(player) {
        if (!player.name) {
            player.board.placeRemainignShipsRandom();

            if (this.player1 === player) {
                this.setShips(this.player2);
            } else {
                this.playerAttack(this.player1);
            }
        }

        const confirmation = player.board.shipsInventory.placed.size === 5;
        const { shipsLeft, ship, size } = this.getShips(player);
        this.renderShipsBoard(player, { shipsLeft, ship, size }, confirmation);

        const resetBTN = document.querySelector('[data-cell="reset"]');
        resetBTN.addEventListener('pointerdown', () => {
            player.board.resetShips();
            this.setShips(player);
        });

        if (confirmation) {
            const confirmBTN = document.querySelector('[data-cell="confirm"]');
            confirmBTN.addEventListener('pointerdown', () => {
                if (player === this.player1) {
                    this.switcher('shipPlacement', this.player1, this.player2);
                } else {
                    this.switcher('attack', this.player2, this.player1);
                }
            });
            return;
        }

        const coordenates = document.querySelector('input');
        let setShipIn = null;

        coordenates.addEventListener('input', (event) => {
            this.clearShipPreview();

            const input = event.target;

            const randomRgx = input.value.match(/random|aleatorio|no s[eé]/i);
            const rowRgx = input.value.match(/(10|[1-9])/);
            const colRgx = input.value.match(/\b[a-j]\b/i);
            const dirRgx = input.value.match(/\b(hor|ver)/i);
            setShipIn = null;

            if (randomRgx) {
                setShipIn = 'random';
                return;
            }

            if (!rowRgx || !colRgx || !dirRgx) {
                return;
            }

            const rowBase = +rowRgx[0] - 1;
            const colBase = +colRgx[0].toLowerCase().charCodeAt(0) - 97;
            const horizon = /hor/i.test(dirRgx[0]);

            const col = horizon && colBase + size > 10 ? 10 - size : colBase;
            const row = !horizon && rowBase + size > 10 ? 10 - size : rowBase;

            this.shipPreview(col, row, horizon, ship, size);

            setShipIn = document.querySelector('.board__ships--warn')
                ? null
                : { row, col, horizon, ship };
        });

        coordenates.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter') {
                return;
            }
            event.preventDefault();

            if (!setShipIn) {
                return;
            }

            if (setShipIn === 'random') {
                player.board.placeShipRandom(ship);
            } else if (setShipIn.ship) {
                const { col, row, horizon, ship } = setShipIn;
                player.board.placeShip(col, row, horizon, ship);
            }

            this.setShips(player);
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

    shipPreview(colValue, rowValue, dirValue, shipToPlace, shipSize) {
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

    renderAttackBoard(player) {
        clearApp();

        const radar = wrapper('div', '', 'radar');
        const radarSweep = wrapper('div', '', 'radar__sweep');
        radar.append(radarSweep);

        const header = wrapper('header');
        const headerTXT = wrapper('h1', `¡${player.name}, es hora de atacar!`);
        const headerBTN = button('apagar radar', '', 'radar');
        header.append(headerTXT, headerBTN);

        const settings = wrapper('div', '', 'settings');

        const nav = wrapper('nav');
        const myAttacksBTN = button('Ver mis disparos', '', '', true);
        const myShipsBTN = button('Ver mis barcos', '', '');
        nav.append(myAttacksBTN, myShipsBTN);

        const instructions = wrapper('div', '', 'settings__dialog');
        const timer = wrapper('span', '00:15seg', 'counter warn');
        const coordinates = inputText(
            'Escribe las coordenadas de tu ataque y presiona [Enter] para disparar:',
            '<A-J> <1-10> / <Aleatorio/Random>',
        );
        const randomBTN = button('¡Disparo automático!', 'set');
        instructions.append(timer, coordinates, randomBTN);

        settings.append(nav, instructions);

        const attacks = attackBoard(player);

        app.append(radar, header, attacks, settings);
    }

    playerAttack(player) {
        this.renderAttackBoard(player);

        const radarBTN = document.querySelector('[data-cell="radar"]')
        radarBTN.addEventListener('pointerdown', () => {
            const radar = document.querySelector('.radar')
            radar.classList.toggle('hidden')
            radarBTN.textContent = radar.classList.contains('hidden') ? 'Encender radar' : 'Apagar radar'
        })
    }

    switcher(type, playerFrom, playerTo) {
        clearApp();
        let btn;

        if (type === 'shipPlacement') {
            if (!playerTo.name) {
                this.playerAttack(playerFrom);
                return;
            }
            btn = button(`${playerTo.name}, clic aquí para ubicar tus barcos`);

            btn.addEventListener('pointerdown', () => {
                this.setShips(playerTo);
            });
        }

        if (type === 'attack') {
            btn = button(`${playerTo.name}, clic aquí para realizar tu ataque`);

            btn.addEventListener('pointerdown', () => {
                this.playerAttack(playerTo);
            });
        }

        const draw = wrapper(
            'pre',
            type === 'attack' ? asciiArt.ship1 : asciiArt.ship2,
        );
        const msg = wrapper(
            'p',
            `${playerFrom.name}, ahora le toca a ${playerFrom.adversaryName}...`,
        );
        app.append(msg, btn, draw);
    }

    afterMath() {
        //
    }
}
