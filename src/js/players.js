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

        if (!this.name && typeOfHit !== 'Water') {
            this.#setNextAttack(col, row);
        }

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
            this.#attackQueued();
        }
    }

    attackRandom() {
        const target = this.myAttacks.flatMap((row, rowNumber) => {
            return row
                .map((cell, colNumber) =>
                    !cell ? [rowNumber, colNumber] : null,
                )
                .filter((e) => e);
        });

        const [rRow, rCol] = target[Math.floor(Math.random() * target.length)];

        this.attack(rCol, rRow);
    }

    #setNextAttack(fromCol, fromRow) {
        this.nextAttack.hits.push([fromCol, fromRow]);

        if (this.nextAttack.hits.length === 1) {
            const attackSecuence = [
                [-1, 0],
                [0, 1],
                [1, 0],
                [0, -1],
            ];

            this.nextAttack.queue = attackSecuence.map((attack) => {
                return [fromRow + attack[0], fromCol + attack[1]];
            });
        }
    }

    #attackQueued() {
        const [row, col] = this.nextAttack.queue.shift()
        this.attack(col, row)
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
