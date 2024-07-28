import Ship from './ships';

class Gameboard {
    static boardGenerator() {
        return Array.from({ length: 10 }, () => Array(10).fill(false));
    }

    constructor() {
        this.ships = Gameboard.boardGenerator();
    }

    shipsInventory = {
        available: Object.keys(Ship.shipsAndSize),
        placed: new Set(),
        sank: new Set(),
    };

    getShips() {
        const shipsLeft = this.shipsInventory.available.length;
        const ship = this.shipsInventory.available.shift();
        const size = Ship.shipsAndSize[ship];
        return { shipsLeft, ship, size };
    }

    placeShip(col, row, horizontal, type) {
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
                continue;
            }
            this.placeShipRandom(ship);
        }
    }

    resetShips() {
        this.ships = Gameboard.boardGenerator();
        this.shipsInventory.available = Object.keys(Ship.shipsAndSize);
        this.shipsInventory.placed = new Set();
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

        this.ships[row][col] = '~';

        return 'Water';
    }
}

export default Gameboard;
