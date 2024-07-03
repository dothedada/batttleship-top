import Ship from './ships';

class Gameboard {
    static boardGenerator() {
        return Array.from({ length: 10 }, () => Array(10).fill(false));
    }

    constructor() {
        this.ships = Gameboard.boardGenerator();
    }

    shipsInventory = {
        placed: new Set(),
        sank: new Set(),
    };

    placeShip(col, row, horizontal, type) {
        if (this.shipsInventory.placed.has(type)) {
            return false;
        }

        const ship = new Ship(type);
        const maxPosition = 10 - ship.length;
        const startCol = horizontal && col > maxPosition ? maxPosition : col;
        const startRow = !horizontal && row > maxPosition ? maxPosition : row;

        for (let l = 0; l < ship.length; l++) {
            const i = !horizontal ? startRow + l : startRow;
            const j = horizontal ? startCol + l : startCol;

            if (this.ships[i][j]) {
                return false;
            }
        }

        for (let l = 0; l < ship.length; l++) {
            const i = !horizontal ? startRow + l : startRow;
            const j = horizontal ? startCol + l : startCol;

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

    placeRemainignShipsRandom() {
        for (const ship of Object.keys(Ship.shipsAndSize)) {
            if (this.shipsInventory.placed.has(ship)) {
                continue
            }
            this.placeShipRandom(ship);
        }
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
