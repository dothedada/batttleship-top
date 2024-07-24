import Player from "./players"
import {
    wrapper,
    inputText,
    button,
    attackBoard,
    shipsBoard,
} from './DOMrender';

export default class Game {

    constructor(player_1, player_2) {
        this.player1 = new Player(player_1 !== '' ? player_1 : undefined)
        this.player2 = new Player(player_2 !== '' ? player_2 : undefined)

        this.player1.setAdversary(this.player2)
    }

    setShips(player){
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
