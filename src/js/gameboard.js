import Ship from './ships';

class Gameboard {
    constructor() {
        this.ships = this.#boardGenerator();
        this.attacks = this.#boardGenerator();
    }

    #boardGenerator() {
        const board = [];

        for (let i = 0; i < 10; i++) {
            board.push([]);
            for (let j = 0; j < 10; j++) {
                board[i].push(false);
            }
        }

        return board;
    }

    #placedShips = new Set();

    shipsLeftToPlace() {
        return 5 - this.#placedShips.size;
    }

    #sankShips = new Set();

    shipsSunk() {
        return 5 - this.#sankShips.size;
    }

    placeShip(col, row, vertical, type) {
        if (this.#placedShips.has(type)) {
            return false;
        }
        const ship = new Ship(type);

        const cols =
            !vertical && col + ship.length >= 10 ? 10 - ship.length : col;
        const rows =
            vertical && row + ship.length >= 10 ? 10 - ship.length : row;

        for (let l = 0; l < ship.length; l++) {
            const i = vertical ? rows + l : rows;
            const j = !vertical ? cols + l : cols;

            if (this.ships[i][j]) {
                return false;
            }
        }

        this.#placedShips.add(type);

        for (let l = 0; l < ship.length; l++) {
            const i = vertical ? rows + l : rows;
            const j = !vertical ? cols + l : cols;

            this.ships[i][j] = ship;
        }

        return true;
    }

    placeShipRandom(type) {
        const col = Math.floor(Math.random() * 10);
        const row = Math.floor(Math.random() * 10);
        const dir = Math.floor(Math.random() * 2);

        if (!this.placeShip(col, row, dir, type)) {
            this.placeShipRandom(type);
        }

        return true;
    }

    receiveAttack(col, row) {
        if (this.ships[row][col] && typeof this.ships[row][col] !== 'object') {
            return null;
        }

        if (typeof this.ships[row][col] === 'object') {
            this.ships[row][col].hit();
            const isSunk = this.ships[row][col].sunk;

            if (isSunk) {
                this.#sankShips.add(this.ships[row][col].type);
            }

            this.ships[row][col] = 'X';

            return isSunk ? 'Sunk' : 'Hit';
        }

        this.ships[row][col] = '·';
        return 'Miss';
    }
}

export default Gameboard;
