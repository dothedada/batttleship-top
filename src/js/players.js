import Gameboard from './gameboard';
import Ship from './ships';

class Player {
    constructor(name = undefined) {
        this.board = new Gameboard();
        this.myShips = this.board.ships;
        this.myAttacks = Gameboard.boardGenerator();
        this.adversaryName = undefined;

        if (name) {
            this.name = name;
        } else {
            this.nextAttack = { hits: [], queue: undefined };
        }
    }

    #adversary = undefined;

    setAdversary(player) {
        if (!(player instanceof Player) || this.adversaryName) {
            return;
        }

        this.#adversary = player;
        this.adversaryName = this.#adversary.name ?? 'AutoPlayer';

        if (!player.adversaryName) {
            player.setAdversary(this);
        }
    }

    placeAllShips() {
        for (const ship of Object.keys(Ship.shipsAndSize)) {
            if (!this.board.shipsInventory.placed.has(ship)) {
                this.board.placeShipRandom(ship);
            }
        }
    }

    attack(col, row) {
        if (col > 9 || row > 9 || this.myAttacks[row][col]) {
            return false;
        }

        const typeOfHit = this.#adversary.board.receiveAttack(col, row);

        this.myAttacks[row][col] = typeOfHit === 'Water' ? '·' : 'X';

        if (typeOfHit === 'Sunk') {
            this.score = this.#adversary.board.shipsInventory.sank.size;
            return 'Sunk';
        }

        return true;
    }

    attackAuto() {
        if (this.name || !this.nextAttack.queue) {
            this.attackRandom();
        } else {
            // this.queueAttack();
        }
    }

    attackRandom() {
        const target = [];

        for (let i = 0; i < 100; i++) {
            const row = Math.floor(i / 10);
            const col = i % 10;

            if (!this.myAttacks[row][col]) {
                target.push([row, col]);
            }
        }

        const [rRow, rCol] = target[Math.floor(Math.random() * target.length)];

        this.attack(rCol, rRow);
        this.#setNextAttack(rCol, rRow)

    }

    #setNextAttack(fromCol, fromRow) {
        if (this.name || this.myAttacks[fromRow][fromCol] !== 'X') {
            return;
        }
    }

    // queueAttack() {
    //     const lastHit = this.nextAttack.hits[this.nextAttack.hits.length - 1];
    //     const hitSecuence = this.nextAttack.hits;
    //
    //     if (!this.nextAttack.queue && this.nextAttack.hits.length === 1) {
    //     } else {
    //         hitSecuence.sort((a, b) => a - b);
    //
    //         const [first, second, previous, last] = [
    //             +hitSecuence[0],
    //             +hitSecuence[1],
    //             +hitSecuence[hitSecuence.length - 2],
    //             +hitSecuence[hitSecuence.length - 1],
    //         ];
    //
    //         const follow = `${last + (last - previous)}`.padStart(2, '0');
    //         const fallback = `${first - (second - first)}`.padStart(2, '0');
    //
    //         this.nextAttack.queue = [];
    //
    //         if (this.attacksBoard[follow[0]][follow[1]] === false) {
    //             this.nextAttack.queue.push(follow);
    //         }
    //         if (this.attacksBoard[fallback[0]][fallback[1]] === false) {
    //             this.nextAttack.queue.push(fallback);
    //         }
    //     }
    //     //
    // }
}

export default Player;
