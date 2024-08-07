import Player from './players';
import {
    shipsBoard,
    shipPreview,
    clearShipPreview,
    renderShipsBoard,
    replaceAttackCell,
    replaceBoard,
    renderMakeAttack,
    renderReceiveAttack,
    switcherScreen,
    renderAftermath,
} from './DOMrender';

const app = document.querySelector('#app');

// TODO:
// 3. Simplificar, limpiar y ordenar codigo (los ataques al player y las
//      recepciones al gameboard)
// 3.b. Revisar secuencia de ataques del compu
// 4. crear el Readme

export default class Game {
    constructor(player_1, player_2, time) {
        this.player1 = new Player(player_1 !== '' ? player_1 : undefined);
        this.player2 = new Player(player_2 !== '' ? player_2 : undefined);

        this.timerSec = +time;

        this.AttackDelaySec = 0.5;
        this.underAttackDelaySec = 1;
        this.rndBaseMs = 500;
        this.evalAttackFeedback = 1.5;

        this.player1.setAdversary(this.player2);
    }

    dragNDropHandler(player, ship, size) {
        const shipToDrag = document.querySelector('.dock__ship');
        const shipSections = document.querySelectorAll('.ship__section');
        const receiverCells = document.querySelectorAll('.board__ships');
        let section = undefined;
        let target = undefined;

        shipSections.forEach((shipSection) => {
            shipSection.addEventListener('pointerdown', () => {
                section = +shipSection.getAttribute('data-cell');
            });

            shipSection.addEventListener('pointerup', () => {
                section = undefined;
            });
        });

        const getPosition = (targetCell, shipSection) => {
            if (!targetCell) {
                return undefined;
            }

            const [rowBase, colBase] = targetCell.split('-');
            const horizontal = !document.querySelector('.dock__ship--vertical');
            const col = horizontal ? +colBase - +shipSection : +colBase;
            const row = !horizontal ? +rowBase - +shipSection : +rowBase;

            return { col, row, horizontal };
        };

        receiverCells.forEach((cell) => {
            cell.addEventListener('dragenter', () => {
                clearShipPreview();
                target = cell.getAttribute('data-cell');
                const { col, row, horizontal } = getPosition(target, section);

                shipPreview(col, row, horizontal, ship, size);
            });
        });

        shipToDrag.addEventListener('dragend', () => {
            clearShipPreview();
            if (!getPosition(target, section)) {
                return;
            }

            const { col, row, horizontal } = getPosition(target, section);

            if (player.board.placeShip(col, row, horizontal, ship)) {
                this.setShips(player);
            }
        });
    }

    setShips(player) {
        if (!player.name) {
            player.board.placeRemainignShipsRandom();
            this.switcher('shipsPlacement', player);
            return;
        }

        const confirmation = player.board.shipsInventory.placed.size === 5;
        const { shipsLeft, ship, size } = player.board.getShips();
        renderShipsBoard(player, { shipsLeft, ship, size }, confirmation);

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

        const byInputBTN = document.querySelector('[data-cell="byInput"]');
        const byDnDropBTN = document.querySelector('[data-cell="byDragDrop"]');
        const byInputSection = document.querySelector('form');
        const byDragDropSection = document.querySelector('.dialog__drag');
        const coordenates = document.querySelector('input');
        const randomBTN = document.querySelector(
            '[data-cell="randomPosition"]',
        );
        let setShipIn = null;

        byInputBTN.addEventListener('pointerdown', () => {
            byDragDropSection.classList.add('hidden');
            byInputSection.classList.remove('hidden');
            player.preferences.drag = false;
        });
        byDnDropBTN.addEventListener('pointerdown', () => {
            byDragDropSection.classList.remove('hidden');
            byInputSection.classList.add('hidden');
            player.preferences.drag = true;
        });
        randomBTN.addEventListener('pointerdown', () => {
            player.board.placeShipRandom(ship);
            this.setShips(player);
        });

        this.dragNDropHandler(player, ship, size);

        coordenates.addEventListener('input', (event) => {
            clearShipPreview();

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

            shipPreview(col, row, horizon, ship, size);

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

    async receiveAttack(defender, attacker) {
        renderReceiveAttack(defender);
        document.body.classList.add('alarm');

        let attackResult;

        do {
            attackResult = attacker.attackAuto();
            await this.delayActions(this.underAttackDelaySec, true);
            const newShipsBoard = shipsBoard(defender);
            const oldShipsBoard = document.querySelector('.board');
            const boardParent = oldShipsBoard.parentNode;
            boardParent.replaceChild(newShipsBoard, oldShipsBoard);
            await this.delayActions(this.evalAttackFeedback);

            if (attackResult === 'No ships left') {
                this.switcher('winner', attacker);
                return;
            }
        } while (attackResult !== 'Water');

        document.body.classList.remove('alarm');
        this.switcher('attack', attacker);
    }

    playerAttack(player) {
        renderMakeAttack(player, this.timerSec);
        this.createCountdown(player);

        const radarBTN = document.querySelector('[data-cell="radar"]');
        const radar = document.querySelector('.radar');
        const myAttacksBTN = document.querySelector('[data-cell="myAttacks"]');
        const myShipsBTN = document.querySelector('[data-cell="myShips"]');

        radarBTN.addEventListener('pointerdown', () => {
            player.preferences.radar = !player.preferences.radar;
            radar.classList.toggle(
                'hidden',
                player.preferences.radar === false,
            );

            radarBTN.textContent = radar.classList.contains('hidden')
                ? 'Encender radar'
                : 'Apagar radar';
        });

        myAttacksBTN.addEventListener('pointerdown', () => {
            replaceBoard('attacks');
        });

        myShipsBTN.addEventListener('pointerdown', () => {
            replaceBoard('ships');
        });

        const attackBTNs = document.querySelectorAll('.board__attack');
        const attackRndBTN = document.querySelector('[data-cell="attackRND"]');
        const attackInput = document.querySelector('input');
        let targetSet = null;

        const sendAttack = async (row, col) => {
            this.purgeCountdowns();
            const buttons = document.querySelectorAll('button');
            const attackResult = player.attack(+col, +row);
            const cell = document.querySelector(`[data-cell="${row}-${col}"]`);

            buttons.forEach((btn) => {
                btn.disabled = true;
            });

            await this.delayActions(this.AttackDelaySec);
            document.body.classList.toggle('alarm', attackResult === 'Ship');
            replaceAttackCell(cell.getAttribute('data-cell'), attackResult);

            await this.delayActions(this.evalAttackFeedback);
            if (attackResult === 'Water') {
                this.switcher('attack', player);
            } else if (attackResult === 'No ships left') {
                this.switcher('winner', player);
            }

            buttons.forEach((btn) => {
                btn.disabled = false;
            });

            attackInput.value = '';
            this.createCountdown(player);
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

    delayActions(sec) {
        const time = sec * 1000 + Math.floor(Math.random() * this.rndBaseMs);
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    activeCountdowns = [];

    purgeCountdowns() {
        this.activeCountdowns.forEach(clearInterval);
        this.activeCountdowns.length = 0;
    }

    countdown(callbackToUpdate) {
        return new Promise((resolve) => {
            let timeAvailable = this.timerSec;

            const timer = setInterval(() => {
                timeAvailable -= 1;
                callbackToUpdate(timeAvailable);
                if (timeAvailable <= 0) {
                    clearInterval(timer);
                    resolve(timeAvailable);
                }
            }, 1000);

            this.activeCountdowns.push(timer);
        });
    }

    createCountdown(player) {
        this.purgeCountdowns();
        const clock = document.querySelector('.counter.warn');

        if (!clock) {
            return;
        }
        clock.textContent = `00:${String(this.timerSec).padStart(2, '0')}`;

        this.countdown((timeLeft) => {
            clock.textContent = `00:${String(timeLeft).padStart(2, '0')}`;
            const warnTime = Math.max(this.timerSec / 4, 3);

            if (timeLeft < warnTime) {
                document.body.classList.add('alarm');
            }
        }).then(() => {
            document.body.classList.remove('alarm');
            this.switcher('attack', player);
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
                const callback =
                    from === this.player1
                        ? this.setShips.bind(this)
                        : this.playerAttack.bind(this);
                switcherScreen(type, from, to, callback);
            } else if (onlyPlayer1) {
                from === this.player1
                    ? this.setShips(to)
                    : this.playerAttack(to);
            } else if (onlyPlayer2) {
                from === this.player2
                    ? this.receiveAttack(from, to)
                    : this.setShips(to);
            }
        } else if (type === 'attack') {
            if (bothHumans) {
                switcherScreen(type, from, to, this.playerAttack.bind(this));
            } else if (onlyPlayer1) {
                from === this.player1
                    ? this.receiveAttack(from, to)
                    : this.playerAttack(to);
            } else if (onlyPlayer2) {
                from === this.player1
                    ? this.playerAttack(to)
                    : this.receiveAttack(from, to);
            }
        } else if (type === 'winner') {
            if (bothHumans) {
                renderAftermath('winner', from);
            } else if (onlyPlayer1) {
                from === this.player1
                    ? renderAftermath('winner')
                    : renderAftermath('loser');
            } else if (onlyPlayer2) {
                from === this.player1
                    ? renderAftermath('loser')
                    : renderAftermath('winner');
            }
        }
    }
}
