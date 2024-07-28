import Player from './players';
import asciiArt from './asciiArt';
import {
    wrapper,
    inputText,
    button,
    attackBoard,
    replaceAttackCell,
    shipsBoard,
    clearApp,
    replaceBoard,
} from './DOMrender';
import Ship from './ships';

const app = document.querySelector('#app');

// TODO:
// 2. Implementar el dragDrop y el timer
// 2.a. conservar preferencias del radar y del dragndrop
// 3. Simplificar, limpiar y ordenar codigo (creo que en el gameflow solo quedan
//      los switcher los renders van para el dom, los ataques al player y las
//      recepciones al gameboard)
// 3.a. Revisar reinicio de partida
// 4. crear el Readme

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
        const header = wrapper('header');
        const headerTextWrapper = wrapper('h1', headerTXT);
        header.append(headerTextWrapper);
        const shipsPlacement = shipsBoard(player);
        const settings = wrapper('div', '', 'settings');

        if (!confirm) {
            const nav = wrapper('nav');
            const coordenatesBTN = button('Coordenadas', '', '');
            const dragNDropBTN = button('Arrastrar y soltar');
            nav.append(coordenatesBTN, dragNDropBTN);

            const { shipsLeft, ship, size } = shipsAvailable;
            const instructions = wrapper('div', '', 'settings__dialog');
            const shipInventory = wrapper(
                'p',
                `${ship} (${ship.slice(0, 2)}), quedan ${shipsLeft} barcos por ubicar.`,
                'dialog__ship',
            );
            //  drag o form
            const form = this.coordenatesDialog();
            form.classList.add('hidden');
            const drag = this.dragNdropDialog(player, ship, size);
            // fin drag o form
            instructions.append(shipInventory, form, drag);
            const resetBTN = button('Reiniciar', '', 'reset');

            settings.append(nav, instructions, resetBTN);
        } else {
            const resetBTN = button('No, volver a ubicar', 'set', 'reset');
            const confirmBTN = button('Sí', '', 'confirm');

            settings.append(resetBTN, confirmBTN);
        }

        app.append(header, shipsPlacement, settings);
    }

    coordenatesDialog() {
        const form = wrapper('form');
        const input = inputText(
            'Ingresa las coordenadas y presiona [Enter] para confirmar o, escribe <No sé> para ubicar aleatoriamente',
            '<A-B> <1-10> <(H)orizontal/(V)ertical>',
        );
        form.append(input);
        return form;
    }

    dragNdropDialog(player, ship, size) {
        const sectionTXT = ship.slice(0, 2);
        const dock = wrapper('div', '', 'dialog__dock');
        const shipDraggable = wrapper('div', '', 'dock__ship');
        shipDraggable.draggable = true;

        let currentSegment = undefined;
        let targetCell = undefined;

        for (let i = 0; i < size; i++) {
            const segment = wrapper('div', sectionTXT, 'ship__section', i);
            shipDraggable.append(segment);
            segment.addEventListener('pointerdown', () => {
                currentSegment = i;
            });
            segment.addEventListener('pointerup', () => {
                currentSegment = undefined;
            });
        }

        const dragSettings = wrapper('div', '', 'dialog__options');
        const rotateBtn = button('Girar');
        const randomBtn = button('Ubicación aleatoria');
        dragSettings.append(rotateBtn, randomBtn);

        rotateBtn.addEventListener('pointerdown', () => {
            shipDraggable.classList.toggle('dock__ship--vertical');
        });

        dock.append(shipDraggable);

        const dick = wrapper('div', '', 'dialog__drag');
        dick.append(dock, dragSettings);

        const dragHandler = (event) => {
            const boardCells = document.querySelectorAll('.board__ships');
            boardCells.forEach((cell) => {
                cell.addEventListener('dragenter', () => {
                    this.clearShipPreview();
                    targetCell = cell.getAttribute('data-cell');

                    const [rowBase, colBase] = targetCell.split('-');
                    let horizon = true;
                    if (document.querySelector('.dock__ship--vertical')) {
                        horizon = false;
                    }

            // const col = horizon && colBase + size > 10 ? 10 - size : colBase;
            // const row = !horizon && rowBase + size > 10 ? 10 - size : rowBase;

                    const col = horizon ? +colBase - +currentSegment : +colBase;
                    const row = !horizon ? +rowBase - +currentSegment : +rowBase;

                    console.log(colBase, col)

                    this.shipPreview(col, row, horizon, ship, size);
                });
            });
        };

        shipDraggable.addEventListener('dragstart', dragHandler);

        shipDraggable.addEventListener('dragend', () => {
            this.clearShipPreview();
            const [rowBase, colBase] = targetCell.split('-');

            const col = +colBase - +currentSegment;
            const row = +rowBase - +currentSegment;

            let horizon = true;
            if (document.querySelector('.dock__ship--vertical')) {
                horizon = false;
            }
            if (player.board.placeShip(col, row, horizon, ship)) {
                this.setShips(player);
            }
        });

        return dick;
    }

    setShips(player) {
        if (!player.name) {
            player.board.placeRemainignShipsRandom();
            this.switcher('shipsPlacement', player);
            return;
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
                this.switcher('shipsPlacement', player);
            });
            return;
        }

        const coordenates = document.querySelector('input');
        let setShipIn = null;

        coordenates.addEventListener('input', (event) => {
            this.clearShipPreview();

            const input = event.target;

            const allrandom = input.value.match(/\bRRRRR\b/);

            const randomRgx = input.value.match(/random|aleatorio|no s[eé]/i);
            const rowRgx = input.value.match(/(10|[1-9])/);
            const colRgx = input.value.match(/\b[a-j]\b/i);
            const dirRgx = input.value.match(/\b(hor|ver)/i);
            setShipIn = null;

            if (allrandom) {
                setShipIn = 'RRRRR';
                return;
            }

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
            } else if (setShipIn === 'RRRRR') {
                player.board.placeRemainignShipsRandom();
            } else if (setShipIn.ship) {
                const { col, row, horizon, ship } = setShipIn;
                player.board.placeShip(col, row, horizon, ship);
            }

            this.setShips(player); // carga pantalla de confirmación
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
        const col = dirValue && colValue + shipSize > 10 ? 10 - shipSize : colValue < 0 ? 0 : colValue
        const row = !dirValue && rowValue + shipSize > 10 ? 10 - shipSize : rowValue < 0 ? 0 : rowValue

        for (let l = 0; l < shipSize; l++) {
            const i = !dirValue ? row + l : row;
            const j = dirValue ? col + l : col;
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

    renderSendAttack(player) {
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
        const myAttacksBTN = button('Ver mis disparos', '', '');
        const myShipsBTN = button('Ver mis barcos', '', '');
        nav.append(myAttacksBTN, myShipsBTN);

        const instructions = wrapper('div', '', 'settings__dialog');
        const timer = wrapper('span', '00:15seg', 'counter warn');
        const coordinates = inputText(
            'Escribe las coordenadas de tu ataque y presiona [Enter] para disparar:',
            '<A-J> <1-10> / <Aleatorio/Random>',
        );
        const randomBTN = button('¡Disparo automático!', 'set', 'attackRND');
        instructions.append(timer, coordinates, randomBTN);

        settings.append(instructions);

        const boards = attackBoard(player);

        app.append(radar, header, nav, boards, settings);

        myAttacksBTN.addEventListener('pointerdown', () => {
            replaceBoard('attacks', player);
        });
        myShipsBTN.addEventListener('pointerdown', () => {
            replaceBoard('ships', player);
        });
    }

    renderReceiveAttack(player) {
        clearApp();

        const header = wrapper('header');
        const headerTXT = wrapper('h1', `¡${player.name}, te atacan!`);
        header.append(headerTXT);

        const myShips = shipsBoard(player);

        app.append(header, myShips);
    }

    delayFunction(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async receiveAttack(receiver, attacker) {
        this.renderReceiveAttack(receiver);
        document.body.classList.add('alarm');

        let attackResult;

        do {
            attackResult = attacker.attackAuto();
            await this.delayFunction(Math.random() * 2000 + 500);
            const newShipsBoard = shipsBoard(receiver);
            const oldShipsBoard = document.querySelector('.board');
            const boardParent = oldShipsBoard.parentNode;
            boardParent.replaceChild(newShipsBoard, oldShipsBoard);
            await this.delayFunction(1500);

            if (attackResult === 'No ships left') {
                this.switcher('winner', attacker);
                return;
            }
        } while (attackResult !== 'Water');

        document.body.classList.remove('alarm');
        this.switcher('attack', attacker);
    }

    playerAttack(player) {
        this.renderSendAttack(player);

        const radarBTN = document.querySelector('[data-cell="radar"]');
        const attackBTNs = document.querySelectorAll('.board__attack');
        const attackRndBTN = document.querySelector('[data-cell="attackRND"]');
        const attackInput = document.querySelector('input');
        let targetSet = null;

        radarBTN.addEventListener('pointerdown', () => {
            const radar = document.querySelector('.radar');
            radar.classList.toggle('hidden');
            radarBTN.textContent = radar.classList.contains('hidden')
                ? 'Encender radar'
                : 'Apagar radar';
        });

        const sendAttack = async (row, col) => {
            const buttons = document.querySelectorAll('button');
            const attackResult = player.attack(+col, +row);
            const cell = document.querySelector(`[data-cell="${row}-${col}"]`);

            buttons.forEach((btn) => {
                btn.disabled = true;
            });

            await this.delayFunction(Math.random() * 2000 + 500);
            document.body.classList.toggle('alarm', attackResult === 'Ship');
            replaceAttackCell(cell.getAttribute('data-cell'), attackResult);

            await this.delayFunction(500);
            if (attackResult === 'Water') {
                this.switcher('attack', player);
            } else if (attackResult === 'No ships left') {
                this.switcher('winner', player);
            }

            buttons.forEach((btn) => {
                btn.disabled = false;
            });

            attackInput.value = '';
        };

        attackBTNs.forEach((btn) => {
            btn.addEventListener('pointerdown', (event) => {
                event.target.classList.add('board__attack--aim');
                const [row, col] = btn.getAttribute('data-cell').split('-');
                sendAttack(row, col);
            });
        });

        attackRndBTN.addEventListener('pointerdown', () => {
            const { rRow, rCol } = player.getRandomCoordenates();
            const target = document.querySelector(
                `button[data-cell="${rRow}-${rCol}"]`,
            );
            target.classList.add('board__attack--aim');

            sendAttack(rRow, rCol);
        });

        attackInput.addEventListener('input', () => {
            targetSet = null;
            document
                .querySelector('.board__attack--aim')
                ?.classList.remove('board__attack--aim');

            const randomRgx = attackInput.value.match(/aleatorio|random/i);
            const colRgx = attackInput.value.match(/[a-j]/i);
            const rowRgx = attackInput.value.match(/(10|[1-9])/);

            if (randomRgx) {
                const { rRow, rCol } = player.getRandomCoordenates();
                const target = document.querySelector(
                    `button[data-cell="${rRow}-${rCol}"]`,
                );
                target.classList.add('board__attack--aim');
                targetSet = { row: rRow, col: rCol };
                return;
            }

            if (!rowRgx || !colRgx) {
                return;
            }

            const row = +rowRgx[0] - 1;
            const col = +colRgx[0].toLowerCase().charCodeAt(0) - 97;

            const target = document.querySelector(
                `button[data-cell="${row}-${col}"]`,
            );
            if (!target) {
                return;
            }
            target.classList.add('board__attack--aim');

            targetSet = { row, col };
        });

        attackInput.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' || !targetSet) {
                return;
            }

            const { row, col } = targetSet;
            sendAttack(row, col);
        });
    }

    switcher(type, fromPlayer) {
        const bothHumans = this.player1.name && this.player2.name;
        const onlyPlayer1 = this.player1.name && !this.player2.name;
        const onlyPlayer2 = !this.player1.name && this.player2.name;

        const from = fromPlayer;
        const to = fromPlayer === this.player1 ? this.player2 : this.player1;

        if (type === 'shipsPlacement') {
            if (bothHumans) {
                if (from === this.player1) {
                    this.switcherScreen(type, this.player1, this.player2);
                } else {
                    this.switcherScreen('attack', this.player2, this.player1);
                }
            } else if (onlyPlayer1) {
                if (from === this.player1) {
                    this.setShips(this.player2);
                } else {
                    this.playerAttack(to);
                }
            } else if (onlyPlayer2) {
                if (from === this.player2) {
                    this.receiveAttack(this.player2, this.player1);
                } else {
                    this.setShips(this.player2);
                }
            }
        } else if (type === 'attack') {
            if (bothHumans) {
                this.switcherScreen('attack', from, to);
            } else if (onlyPlayer1) {
                if (fromPlayer === this.player1) {
                    this.receiveAttack(this.player1, this.player2);
                } else {
                    this.playerAttack(this.player1);
                }
            } else if (onlyPlayer2) {
                if (fromPlayer === this.player1) {
                    this.playerAttack(this.player2);
                } else {
                    this.receiveAttack(this.player2, this.player1);
                }
            }
        } else if (type === 'winner') {
            if (bothHumans) {
                this.renderAftermath('winner', fromPlayer);
            } else if (onlyPlayer1) {
                if (fromPlayer === this.player1) {
                    this.renderAftermath('winner');
                } else {
                    this.renderAftermath('loser');
                }
            } else if (onlyPlayer2) {
                if (fromPlayer === this.player1) {
                    this.renderAftermath('loser');
                } else {
                    this.renderAftermath('winner');
                }
            }
        }
    }

    switcherScreen(type, from, to) {
        const artsTotal = 2;
        const msgTxt = `${from.name}, entrégale el dispositivo a ${to.name}`;
        const btnTxt =
            type === 'shipsPlacement'
                ? `${to.name}, haz clic aquí o presiona [Enter] para ubicar tus barcos`
                : `${to.name}, haz clic aquí o presiona [Enter] para realizar tu ataque`;
        const ascii = asciiArt[`ship${Math.floor(Math.random() * artsTotal)}`];

        clearApp();
        app.append(wrapper('p', msgTxt), wrapper('pre', ascii), button(btnTxt));

        const goto = (event) => {
            if (event.type !== 'pointerdown' && event.key !== 'Enter') {
                return;
            }
            document.removeEventListener('keydown', goto);

            return type === 'attack'
                ? this.playerAttack(to)
                : this.setShips(to);
        };
        document.querySelector('button').addEventListener('pointerdown', goto);
        document.addEventListener('keydown', goto);
    }

    renderAftermath(aftermath, winner = undefined) {
        clearApp();

        const ascii = asciiArt[aftermath];
        const msgTxt = winner
            ? `Así se hace ${winner.name}, ¿quieres jugar una nueva partida? (S)í / (N)o`
            : '¿Una nueva partida? (S)í / (N)o';

        app.append(wrapper('pre', ascii), wrapper('div', msgTxt));

        const newMatch = (event) => {
            const key = event.key.toLowerCase();
            if (key !== 's' && key !== 'n') {
                return;
            }

            document.body.removeEventListener('keydown', newMatch);
            if (key === 's') {
                location.reload();
            } else if (key === 'n') {
                window.location.href = 'https://cv.mmejia.com';
            }
        };

        document.body.addEventListener('keydown', newMatch);
    }
}
