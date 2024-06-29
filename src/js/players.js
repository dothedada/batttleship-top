import Gameboard from './gameboard';
import { typeOfShips } from './ships';

class Player {
    #adversary = undefined;

    constructor(type) {
        this.board = new Gameboard();
        this.type = type;
    }

    setAdversary(player) {
        if (!(player instanceof Player) || this.#adversary) {
            return false;
        }
        this.#adversary = player;
        return true;
    }

    #hitOrMiss(col, row) {
        if (this.#adversary.shipsBoard[row][col]) {
            this.#adversary.board.receiveAttack(col, row);
            return true;
        }
        return false;
    }

    attack(col, row) {
        if (col > 9 || row > 9 || this.board.attacks[row][col]) {
            return false;
        }
        this.board.attacks[row][col] = this.#hitOrMiss(col, row) ? 'X' : '·';

        return true;
    }

    randomAttack() {
        const availableShoots = this.attacksBoard
            .flat()
            .reduce((sum, cell, index) => {
                if (!cell) {
                    sum.push(`${index}`.padStart(2, 0));
                }
                return sum;
            }, []);

        const [row, col] =
            availableShoots[
                Math.floor(Math.random() * (availableShoots.length - 1))
            ];

        this.attack(col, row);

        return true;
    }

    get shipsBoard() {
        return this.board.ships;
    }

    get attacksBoard() {
        return this.board.attacks;
    }

    placeAllShips() {
        for (const ship of Object.keys(typeOfShips)) {
            this.board.placeShipRandom(ship);
        }
    }
}

export default Player;
