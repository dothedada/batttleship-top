import '../css/reset.css';
import '../css/styles.css';
import renderInDOM from './DOMrender';
import asciiArt from './asciiArt';
import Player from './players';

class Game {
    #stage = ['start', 'setUpPlayers', 'placeShips', 'attack', 'passOver', 'end'];
    #currentIndex = 0;
    #player1 = undefined;
    #player2 = undefined;
    header = document.querySelector('#header');
    app = document.querySelector('#app');

    constructor() {
        this.start()
    }

    #nextStage() {
        this.#currentIndex = ++this.#currentIndex % this.#stage.length;
    }

    #nextTurn() {
        this.#currentIndex = 3;
    }

    get #currentStage() {
        return this.#stage[this.#currentIndex];
    }

    startGame() {
        console.log(this.#currentStage)
        // this.#nextStage();
        // document.body.removeEventListener('keydown', game.#startGame);
        // document.body.removeEventListener('pointerdown', game.#startGame);
        // this[this.#currentStage]();
    };

    start() {
        this.header.innerHTML = `<pre>${asciiArt.submarine}</pre><pre>${asciiArt.name}</pre>`;
        this.app.innerHTML = `<p>Presiona cualquier tecla o haz clic para empezar</p><pre>${asciiArt.sea}</pre>`;
        
        // document.body.addEventListener('keydown', this.startGame);
        // document.body.addEventListener('pointerdown', this.startGame);
    };

    // setUpPlayers() {
    //     this.header.innerHTML = '';
    //     this.app.textContent = '';
    //     this.app.append(
    //         renderInDOM.inputText(
    //             '¿Quién arranca el juego?, deja vacío para que sea la computadora',
    //             'Escibe el nombre',
    //         ),
    //         renderInDOM.inputText(
    //             '¿Quién sigue?, deja vacío para que sea la computadora',
    //             'Escibe el nombre',
    //         ),
    //         renderInDOM.wrapper('h2', '', 'Debe haber al menos un nombre'),
    //         renderInDOM.button('¡Iniciar el encuentro!'),
    //     );
    //
    //     document.querySelector('button').addEventListener('pointerdown', () => {
    //         const [name1, name2] = document.querySelectorAll('input');
    //         this.#player1 = new Player(!name1.value ? undefined : name1.value)
    //         this.#player2 = new Player(!name2.value ? undefined : name2.value)
    //         this.#player1.setAdversary(this.#player2)
    //     });
    // }
    //
    // placeShips() {
    //     this.header.innerHTML = '';
    //     this.app.textContent = '';
    //
    // }
}

const game = new Game();

