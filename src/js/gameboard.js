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

    #shipsAvailable = new Set();

    placeShip(col, row, vertical, type) {
        const ship = new Ship(type);
        this.#shipsAvailable.add(type);
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

    shipsLeft() {
        return 5 - this.#shipsAvailable.size;
    }

    receiveAttack(col, row) {
        if (this.ships[row][col] && typeof this.ships[row][col] !== 'object') {
            return false;
        }
        if (typeof this.ships[row][col] === 'object') {
            this.ships[row][col].hit();
            this.ships[row][col] = 'X'
            return true
        }
        this.ships[row][col] = '·';
        return true;
    }
}

export default Gameboard;
