import asciiArt from './asciiArt';

const app = document.querySelector('#app');

const clearApp = () => {
    app.textContent = '';
};

const wrapper = (type, textContent = '', css = '', data = undefined) => {
    const element = document.createElement(type);
    element.className = css;
    element.textContent = textContent;

    if (data) {
        element.setAttribute('data-cell', data);
    }

    return element;
};

const inputText = (labelText, placeholderText) => {
    const label = wrapper('label', labelText);
    const inputElement = document.createElement('input');

    inputElement.type = 'text';
    inputElement.placeholder = placeholderText;

    label.append(inputElement);

    return label;
};

const inputNumber = (labelText, placeholderText, max, min, defaultValue) => {
    const label = wrapper('label', labelText);
    const inputElement = document.createElement('input');

    inputElement.type = 'number';
    inputElement.max = max;
    inputElement.min = min;
    inputElement.defaultValue = defaultValue;
    inputElement.placeholder = placeholderText;

    label.append(inputElement);

    return label;
};

const button = (buttonText, css = '', attribute = '') => {
    const buttonElement = document.createElement('button');

    buttonElement.type = 'button';
    buttonElement.className = css;
    buttonElement.textContent = buttonText;

    if (attribute) {
        buttonElement.setAttribute('data-cell', attribute);
    }
    return buttonElement;
};

const boardFrame = () => {
    const board = wrapper('div', '', 'board');

    for (let i = 0; i < 11; i++) {
        const text = i === 0 ? '\\' : String.fromCharCode(64 + i);
        const boardHeader = wrapper('span', text, 'board__coordenates');
        board.append(boardHeader);
    }

    return board;
};

const attackBoard = (player) => {
    const board = boardFrame();
    let rowHeader = 1;

    player.myAttacks.flat().forEach((cell, index) => {
        const row = index % 10;
        const col = Math.floor(index / 10);

        if (row === 0) {
            board.append(wrapper('span', rowHeader, 'board__coordenates'));
            rowHeader++;
        }

        if (cell) {
            let css = 'board__ships';

            if (cell === 'X') {
                css += ' board__ships--occupied';
            }

            board.append(wrapper('span', cell, css, `${col}-${row}`));
            return;
        }

        board.append(button('', 'board__attack', `${col}-${row}`, false));
    });

    return board;
};

const replaceAttackCell = (coordenates, type) => {
    const [row, col] = coordenates.split('-');
    const char = type === 'Water' ? '~' : 'X';
    let css = 'board__ships';
    css += type === 'Water' ? ' board__ships--occupied' : ' board__ships--warn';

    const newSpan = wrapper('span', char, css, coordenates);
    const replaceBTN = document.querySelector(`[data-cell="${row}-${col}"]`);
    const parent = replaceBTN.parentNode;

    parent.replaceChild(newSpan, replaceBTN);
};

const shipsBoard = (player) => {
    const board = boardFrame();
    let rowHeader = 1;

    player.board.ships.flat().forEach((cell, index) => {
        const row = index % 10;
        const col = Math.floor(index / 10);
        let text = !cell ? '' : cell;
        const css = /\s|X/i.test(cell)
            ? 'board__ships board__ships--occupied'
            : 'board__ships';

        if (row === 0) {
            board.append(wrapper('span', rowHeader, 'board__coordenates'));
            rowHeader++;
        }

        if (typeof cell === 'object') {
            text = cell.type.slice(0, 2);
        }

        board.append(wrapper('span', text, css, `${col}-${row}`));
    });

    return board;
};

const replaceBoard = (shipsORattacks, player) => {
    const ships = shipsORattacks === 'ships';

    const newBoard = ships ? shipsBoard(player) : attackBoard(player);
    const oldBoard = document.querySelector('.board');
    const parentBoard = oldBoard.parentNode;

    parentBoard.replaceChild(newBoard, oldBoard);
};

const switcherScreen = (type, from, to, callback) => {
    clearApp();
    const artsTotal = 2;
    const msgTxt = `${from.name}, entrégale el dispositivo a ${to.name}`;
    const btnTxt =
        type === 'shipsPlacement'
            ? `${to.name}, haz clic aquí o presiona [Enter] para ubicar tus barcos`
            : `${to.name}, haz clic aquí o presiona [Enter] para realizar tu ataque`;
    const ascii = asciiArt[`ship${Math.floor(Math.random() * artsTotal)}`];

    const goto = (event) => {
        if (event.type !== 'pointerdown' && event.key !== 'Enter') {
            return;
        }
        document.removeEventListener('keydown', goto);
        console.log(callback)
        callback(to);
    };

    app.append(wrapper('p', msgTxt), wrapper('pre', ascii), button(btnTxt));
    document.querySelector('button').addEventListener('pointerdown', goto);
    document.addEventListener('keydown', goto);
};

const renderAftermath = (aftermath, winner = undefined) => {
    clearApp();
    const ascii = asciiArt[aftermath];
    const aftermathTXT = aftermath === 'winner' ? '¡Ganaste!,' : 'Perdiste,';
    const msgTxt = winner
        ? `Así se hace ${winner.name}, ¿quieres jugar una nueva partida? (S)í / (N)o`
        : `${aftermathTXT} ¿Una nueva partida? (S)í / (N)o`;

    const newMatch = (event) => {
        const key = event.key.toLowerCase();
        if (key !== 's' && key !== 'n') {
            return;
        }

        document.body.removeEventListener('keydown', newMatch);
        if (key === 's') {
            location.reload();
        } else if (key === 'n') {
            window.location.href = 'https://cv.mmejia.com';
        }
    };

    app.append(wrapper('pre', ascii), wrapper('div', msgTxt));
    document.body.addEventListener('keydown', newMatch);
};

export {
    clearApp,
    wrapper,
    inputText,
    inputNumber,
    button,
    attackBoard,
    replaceAttackCell,
    shipsBoard,
    replaceBoard,
    switcherScreen,
    renderAftermath,
};
