import Player from "./players"
import {
    wrapper,
    inputText,
    button,
    attackBoard,
    shipsBoard,
} from './DOMrender';

const app = document.querySelector('#app')

export default class Game {
    #clearScreen() {
        app.textContent = ''
    }

    constructor(player_1, player_2) {
        this.player1 = new Player(player_1 !== '' ? player_1 : undefined)
        this.player2 = new Player(player_2 !== '' ? player_2 : undefined)

        this.player1.setAdversary(this.player2)
    }

    setShips(player){
        this.#clearScreen()
        //
    }

    playerAttack(player){
        //
    }

    hangScreen(){
        //
    }

    afterMath(){
        //
    }
}
