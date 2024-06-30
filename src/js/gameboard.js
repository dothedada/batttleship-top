import Ship from './ships';

class Gameboard {
    static boardGenerator() {
        const board = [];

        for (let i = 0; i < 10; i++) {
            board.push([]);
            for (let j = 0; j < 10; j++) {
                board[i].push(false);
            }
        }

        return board;
    }

    constructor() {
        this.ships = Gameboard.boardGenerator() 
    }

    shipsInventory = {
        placed: new Set(),
        sank: new Set() 
    }

    placeShip(col, row, hor, type) {
        if (this.shipsInventory.placed.has(type)) {
            return false;
        }

        const ship = new Ship(type);
        const maxShipIndex = 10 - ship.length
        const cols = hor && col > maxShipIndex ? maxShipIndex : col;
        const rows = !hor && row >maxShipIndex ? maxShipIndex : row;

        for (let l = 0; l < ship.length; l++) {
            const i = !hor ? rows + l : rows;
            const j = hor ? cols + l : cols;

            if (this.ships[i][j]) {
                return false;
            }
        }

        for (let l = 0; l < ship.length; l++) {
            const i = !hor ? rows + l : rows;
            const j = hor ? cols + l : cols;

            this.ships[i][j] = ship;
        }

        this.shipsInventory.placed.add(type);
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
                this.shipsInventory.sank.add(cell.type);
            }

            this.ships[row][col] = 'X';

            return isSunk ? 'Sunk' : 'Hit';
        }

        this.ships[row][col] = '·';
        return 'Miss';
    }
}

export default Gameboard;
