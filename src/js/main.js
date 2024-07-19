import '../css/reset.css';
import '../css/styles.css';
import landingScreen from './landing';
import Player from './players';
import setPlayers from './setPlayers';

const screen = (() => {
    const current = ['landing', 'setPlayers', 'encounter', 'aftermath'];
    let index = 0;

    const next = () => {
        index++;

        if (index > 1) {
            index = 0;
        }
    };

    const get = () => current[index];

    const clear = () => {
        document.querySelector('#header').textContent = '';
        document.querySelector('#app').textContent = '';
        document.body.removeEventListener('keydown', clear);
        document.body.removeEventListener('pointerdown', clear);

        renderPage(get());
    };

    return { next, get, clear };
})();

const renderPage = (page) => {
    let player1;
    let player2;

    if (page === 'landing') {
        landingScreen();

        document.body.addEventListener('pointerdown', screen.clear);
        document.body.addEventListener('keydown', screen.clear);

        screen.next();

        console.log(player1);
    }

    if (page === 'setPlayers') {
        setPlayers();

        document.querySelector('button').addEventListener('pointerdown', () => {
            const [player1Name, player2Name] =
                document.querySelectorAll('input');
            player1 = new Player(player1Name);
            player2 = new Player(player2Name);
            player1.setAdversary(player2);
            screen.clear();
        });

        screen.next();
    }
};
renderPage(screen.get());
