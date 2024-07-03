import Gameboard from './gameboard';
import Ship from './ships';

class Player {
    constructor(name = undefined) {
        this.board = new Gameboard();
        this.myShips = this.board.ships;
        this.myAttacks = Gameboard.boardGenerator();
        this.adversaryName = undefined;
        this.score = 0;

        if (name) {
            this.name = name;
        } else {
            this.nextAttack = { hits: [], queue: [], foundShips: 0 };
        }
    }

    #adversary = undefined;

    setAdversary(player) {
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

        this.score = this.#adversary.board.shipsInventory.sank.size;
        this.myAttacks[row][col] = typeOfHit === 'Water' ? '·' : 'X';

        if (!this.name) {
            this.#feedbackAutoplayer[typeOfHit](col, row);
        }

        return typeOfHit;
    }

    #feedbackAutoplayer = {
        Water: () => {
            if (this.nextAttack.hits.length > 1) {
                this.#suspect();
            }
        },

        Ship: (fromCol, fromRow) => {
            this.#setNextAttack(fromCol, fromRow);
        },

        Sunk: () => {
            this.nextAttack.foundShips--;

            if (!this.nextAttack.foundShips) {
                this.nextAttack.hits = [];
                this.nextAttack.queue = [];
            } else {
                const [dirIndex, dirValue] = this.#targetDirection();
                const filteredQueue = [
                    ...new Set(
                        this.nextAttack.queue.map((attack) => attack.join(',')),
                    ),
                ];

                this.nextAttack.hits = this.nextAttack.hits.filter((attack) => {
                    return attack[dirIndex] !== dirValue;
                });
                this.nextAttack.queue = filteredQueue.map((attack) =>
                    attack.split(',').map(Number),
                );
            }
        },
    };

    attackAuto() {
        if (!this.nextAttack?.foundShips || !this.nextAttack.queue) {
            return this.attackRandom();
        }

        return this.#attackQueued();
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

        return this.attack(rCol, rRow);
    }

    #setNextAttack(fromCol, fromRow) {
        const secuence = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1],
        ];

        const attackSecuence = secuence
            .map(([row, col]) => [fromRow + row, fromCol + col])
            .filter(([row, col]) => this.myAttacks[row]?.[col] === false);

        const nextAttack = this.nextAttack;
        nextAttack.hits.push([fromRow, fromCol]);

        if (nextAttack.hits.length === 1) {
            nextAttack.queue = attackSecuence;
            nextAttack.foundShips++;
            return;
        }

        const [dirIndex, dirValue] = this.#targetDirection();

        if (nextAttack.hits.length === 2) {
            nextAttack.queue.sort((a) => (a[dirIndex] === dirValue ? -1 : 0));
        }

        const [inAxis, offAxis] = attackSecuence.reduce(
            ([align, misalign], attack) => {
                attack[dirIndex] === dirValue
                    ? align.push(attack)
                    : misalign.push(attack);
                return [align, misalign];
            },
            [[], []],
        );

        nextAttack.queue.unshift(...inAxis);
        nextAttack.queue.push(...offAxis);
    }

    #attackQueued() {
        const [row, col] = this.nextAttack.queue.shift();
        return this.attack(col, row);
    }

    #targetDirection() {
        const impacts = this.nextAttack.hits;
        const dirIndex =
            impacts[0][1] === impacts[impacts.length - 1][1] ? 1 : 0;
        const dirValue = impacts[0][dirIndex];

        return [dirIndex, dirValue];
    }

    #suspect() {
        const attacksQueue = this.nextAttack.queue;
        const [dirIndex, dirValue] = this.#targetDirection();

        if (attacksQueue.filter((att) => att[dirIndex] === dirValue).length) {
            return;
        }

        this.nextAttack.foundShips = this.nextAttack.hits.length;
    }
}

export default Player;
