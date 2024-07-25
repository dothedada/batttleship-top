import Gameboard from './gameboard';

class Player {
    constructor(name = undefined) {
        this.board = new Gameboard();
        this.myAttacks = Gameboard.boardGenerator();
        this.adversaryName = undefined;
        this.score = 0;

        if (name) {
            this.name = name;
        } else {
            this.nextAttack = { hits: [], queue: [], suspicious: 0 };
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

    attack(col, row) {
        if (col > 9 || row > 9 || this.myAttacks[row][col]) {
            return false;
        }

        const typeOfHit = this.#adversary.board.receiveAttack(col, row);

        this.score = this.#adversary.board.shipsInventory.sank.size;
        this.myAttacks[row][col] = typeOfHit === 'Water' ? '~' : 'X';

        if (!this.name && typeOfHit !== 'No ships left') {
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

        Sunk: (fromCol, fromRow) => {
            this.nextAttack.suspicious--;

            if (!this.nextAttack.suspicious) {
                this.nextAttack.hits = [];
                this.nextAttack.queue = [];
            } else {
                this.nextAttack.hits.push([fromRow, fromCol]);
                const [dirIndex, dirValue] = this.#targetDirection();
                const nonRedundantQueue = [
                    ...new Set(
                        this.nextAttack.queue.map((attack) => attack.join(',')),
                    ),
                ].map((attack) => attack.split(',').map(Number));

                this.nextAttack.hits = this.nextAttack.hits.filter((attack) => {
                    return attack[dirIndex] !== dirValue;
                });
                this.nextAttack.queue = nonRedundantQueue.filter((attack) => {
                    return attack[dirIndex] !== dirValue;
                });
            }
        },
    };

    attackAuto() {
        if (!this.nextAttack?.suspicious || !this.nextAttack.queue) {
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
            nextAttack.suspicious++;
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

        this.nextAttack.suspicious = this.nextAttack.hits.length;
    }
}

export default Player;
