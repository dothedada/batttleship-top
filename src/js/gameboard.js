import Ship from './ships';

class Gameboard {
    constructor() {
        this.ships = this.#boardGenerator();
        this.attacks = this.#boardGenerator();
    }

    resetAttacksBoard() {
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

    placeShip(col, row, vert, type) {
        if (this.#placedShips.has(type)) {
            return false;
        }

        const ship = new Ship(type);
        const maxShipIndex = 10 - ship.length
        const cols = !vert && col > maxShipIndex ? maxShipIndex : col;
        const rows = vert && row >maxShipIndex ? maxShipIndex : row;

        for (let l = 0; l < ship.length; l++) {
            const i = vert ? rows + l : rows;
            const j = !vert ? cols + l : cols;

            if (this.ships[i][j]) {
                return false;
            }
        }

        for (let l = 0; l < ship.length; l++) {
            const i = vert ? rows + l : rows;
            const j = !vert ? cols + l : cols;

            this.ships[i][j] = ship;
        }

        this.#placedShips.add(type);
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
        const cell = this.ships[row][col]
        if (cell && typeof cell !== 'object') {
            return null;
        }

        if (typeof cell === 'object') {
            cell.hit();
            const isSunk = cell.sunk;

            if (isSunk) {
                this.#sankShips.add(cell.type);
            }

            this.ships[row][col] = 'X';

            return isSunk ? 'Sunk' : 'Hit';
        }

        this.ships[row][col] = '·';
        return 'Miss';
    }
}

export default Gameboard;
