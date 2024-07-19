import '../css/reset.css';
import '../css/styles.css';
import landingScreen from './landing';

const screen = (() => {
    const current = ['landing', 'setPlayers', 'encounter', 'aftermath'];
    let index = 0;

    const set = () => {
        index++;

        if (index > 3) {
            index = 0;
        }

    };

    const get = () => current[index];

    return { set, get };
})();

const renderPage = (page) => {
    if (page === 'landing') { landingScreen() };
}
renderPage(screen.get());
