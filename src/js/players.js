import Gameboard from './gameboard';
import { typeOfShips } from './ships';

class Player {
    constructor(type) {
        this.board = new Gameboard();
        this.human = type === 'Human';
        if (!this.human) {
            this.nextAttack = { hits: [], queue: undefined };
        }
    }

    placeAllShips() {
        for (const ship of Object.keys(typeOfShips)) {
            this.board.placeShipRandom(ship);
        }
    }

    #adversary = undefined;

    setAdversary(player) {
        if (!(player instanceof Player) || this.#adversary) {
            return false;
        }
        this.#adversary = player;
        return true;
    }

    #hitOrMiss(col, row) {
        if (typeof this.#adversary.shipsBoard[row][col] === 'object') {
            this.#adversary.board.receiveAttack(col, row);
            return true;
        }
        return false;
    }

    attack(col, row) {
        if (col > 9 || row > 9 || this.board.attacks[row][col]) {
            return false;
        }

        const itsAHit = this.#hitOrMiss(col, row);
        this.board.attacks[row][col] = itsAHit ? 'X' : '·';

        if (!this.human && itsAHit) {
            const neighbors = [-10, 1, 10, -1];

        const lastHit = this.nextAttack.hits[this.nextAttack.hits.length - 1];

            this.nextAttack.hits.push(`${row}${col}`.padStart(2, '0'));
            this.nextAttack.queue =
                this.nextAttack.queue ??
                neighbors.reduce((availabe, position) => {
                    const [nRow, nCol] = `${+lastHit + position}`.padStart(
                        2,
                        '0',
                    );

                    if (!this.attacksBoard[nRow][nCol]) {
                        availabe.push(`${nRow}${nCol}`.padStart(2, '0'));
                    }

                    return availabe;
                }, []);
        }

        return true;
    }

    autoAtack() {
        if (!this.human && this.nextAttack.hits.length) {
            this.queueAttack();
        } else {
            this.randomAttack();
        }
    }

    randomAttack() {
        const availableShoots = this.attacksBoard
            .flat()
            .reduce((sum, cell, index) => {
                if (!cell) {
                    sum.push(`${index}`.padStart(2, 0));
                }

                return sum;
            }, []);

        const [randomRow, randomCol] =
            availableShoots[
                Math.floor(Math.random() * availableShoots.length)
            ].split('');

        this.attack(+randomCol, +randomRow);
    }

    queueAttack() {
        const lastHit = this.nextAttack.hits[this.nextAttack.hits.length - 1];
        const hitSecuence = this.nextAttack.hits;

        if (!this.nextAttack.queue && this.nextAttack.hits.length === 1) {
        } else {
            hitSecuence.sort((a, b) => a - b);

            const [first, second, previous, last] = [
                +hitSecuence[0],
                +hitSecuence[1],
                +hitSecuence[hitSecuence.length - 2],
                +hitSecuence[hitSecuence.length - 1],
            ];

            const follow = `${last + (last - previous)}`.padStart(2, '0');
            const fallback = `${first - (second - first)}`.padStart(2, '0');

            this.nextAttack.queue = [];

            if (this.attacksBoard[follow[0]][follow[1]] === false) {
                this.nextAttack.queue.push(follow);
            }
            if (this.attacksBoard[fallback[0]][fallback[1]] === false) {
                this.nextAttack.queue.push(fallback);
            }
        }
        //
    }

    get shipsBoard() {
        return this.board.ships;
    }

    get attacksBoard() {
        return this.board.attacks;
    }
}

export default Player;
