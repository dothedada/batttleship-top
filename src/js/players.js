import Gameboard from "./gameboard"
import { typeOfShips } from "./ships"

class Player {
    constructor(type) {
        this.board = new Gameboard()
        this.type = type
    }
    
    attack(col, row) {
        if (col > 9 || row > 9 || this.board.attacks[row][col]) return false
        this.board.attacks[row][col] = '·'

        return true
    }

    
}

export default Player
