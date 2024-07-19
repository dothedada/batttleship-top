import '../css/reset.css';
import '../css/styles.css';

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

console.log(screen.get());
screen.set();
console.log(screen.get());
screen.set();
console.log(screen.get());
screen.set();
console.log(screen.get());
screen.set();
console.log(screen.get());
