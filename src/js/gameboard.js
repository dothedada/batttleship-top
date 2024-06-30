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
        this.ships = Gameboard.boardGenerator();
    }

    shipsInventory = {
        placed: new Set(),
        sank: new Set(),
    };

    placeShip(column, row, horizontal, type) {
        if (this.shipsInventory.placed.has(type)) {
            return false;
        }

        const ship = new Ship(type);
        const maxPosition = 10 - ship.length;
        const cols = horizontal && column > maxPosition ? maxPosition : column;
        const rows = !horizontal && row > maxPosition ? maxPosition : row;

        for (let l = 0; l < ship.length; l++) {
            const i = !horizontal ? rows + l : rows;
            const j = horizontal ? cols + l : cols;

            if (this.ships[i][j]) {
                return false;
            }
        }

        for (let l = 0; l < ship.length; l++) {
            const i = !horizontal ? rows + l : rows;
            const j = horizontal ? cols + l : cols;

            this.ships[i][j] = ship;
        }

        this.shipsInventory.placed.add(type);
        return true;
    }

    placeShipRandom(type) {
        const col = Math.floor(Math.random() * 10);
        const row = Math.floor(Math.random() * 10);
        const horizontal = Boolean(Math.floor(Math.random() * 2));

        if (!this.placeShip(col, row, horizontal, type)) {
            this.placeShipRandom(type);
        }
        return true;
    }

    receiveAttack(col, row) {
        const cell = this.ships[row][col];
        if (cell && typeof cell !== 'object') {
            return null;
        }

        if (typeof cell === 'object') {
            this.ships[row][col] = 'X';
            cell.hit();

            if (cell.sunk) {
                this.shipsInventory.sank.add(cell.type);

                return this.shipsInventory.sank.size === 5
                    ? 'No ships left'
                    : 'Sunk';
            }

            return 'Ship';
        }

        this.ships[row][col] = '·';
        return 'Water';
    }
}

export default Gameboard;
