import Ship, { typeOfShips } from './ships';

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

    placeShip(col, row, vertical, type) {
        
        const ship = new Ship(type)
        this.#shipsAvailable.add(type)
        // const cols = vertical && col + ship.length >= 10 ? 10 - ship.length : col
        // const rows = vertical && row + ship.length >= 10 ? 10 - ship.length : row
        for (let l = 0; l < ship.length; l++) {
            const i = vertical ? row + l : row
            const j = !vertical ? col + l : col

            if (this.ships[i][j]) return false
        }

        for (let l = 0; l < ship.length; l++) {
            const i = vertical ? row + l : row
            const j = !vertical ? col + l : col

            this.ships[i][j] = ship
        }
        
        return true
    }

    #shipsAvailable = new Set()

    shipsLeft() {
        return 5 - this.#shipsAvailable.size
    }

}

export default Gameboard;
