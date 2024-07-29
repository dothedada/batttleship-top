import asciiArt from './asciiArt';
import Gameboard from './gameboard';

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

const shipsBoard = (player) => {
    const board = boardFrame();
    board.setAttribute('data-board', 'myShips');
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

const coordenatesDialog = () => {
    const form = wrapper('form');
    const input = inputText(
        'Ingresa las coordenadas y presiona [Enter] para confirmar o, escribe <No sé> para ubicar aleatoriamente',
        '<A-J> <1-10> <(H)orizontal/(V)ertical>',
    );
    form.append(input);
    return form;
};

const dragNdropDialog = (ship, size) => {
    const sectionTXT = ship.slice(0, 2);
    const dock = wrapper('div', '', 'dialog__dock');
    const shipDraggable = wrapper('div', '', 'dock__ship');
    shipDraggable.draggable = true;

    for (let i = 0; i < size; i++) {
        const segment = wrapper('div', sectionTXT, 'ship__section', i);
        shipDraggable.append(segment);
    }

    const dragSettings = wrapper('div', '', 'dialog__options');
    const rotateBtn = button('Girar');
    const randomBtn = button('Ubicación aleatoria');
    dragSettings.append(rotateBtn, randomBtn);

    rotateBtn.addEventListener('pointerdown', () => {
        shipDraggable.classList.toggle('dock__ship--vertical');
    });

    dock.append(shipDraggable);
    const container = wrapper('div', '', 'dialog__drag');
    container.append(dock, dragSettings);

    return container;
};

const shipPreview = (colValue, rowValue, horizontal, ship, size) => {
    const col = horizontal ? Gameboard.fixSpace(colValue, size) : colValue;
    const row = !horizontal ? Gameboard.fixSpace(rowValue, size) : rowValue;

    for (let l = 0; l < size; l++) {
        const j = horizontal ? col + l : col;
        const i = !horizontal ? row + l : row;
        const cell = document.querySelector(`[data-cell="${i}-${j}"]`);

        if (!cell.textContent) {
            cell.setAttribute('data-current', true);
            cell.classList.add('board__ships--occupied');
            cell.textContent = `${ship.slice(0, 2)}`;
        } else {
            cell.classList.add('board__ships--warn');
        }
    }
};
const clearShipPreview = () => {
    if (document.querySelector('[data-current]')) {
        document.querySelectorAll('[data-current]').forEach((cell) => {
            cell.removeAttribute('data-current');
            cell.className = 'board__ships';
            cell.textContent = '';
        });
    }
    if (document.querySelectorAll('.board__ships--warn')) {
        document.querySelectorAll('.board__ships--warn').forEach((cell) => {
            cell.classList.remove('board__ships--warn');
        });
    }
};

const renderShipsBoard = (player, shipsAvailable, confirm = undefined) => {
    clearApp();

    const headerTXT = !confirm
        ? `${player.name}, ubica tus barcos...`
        : `${player.name}, ¿Quieres esta disposición para tu flota?`;
    const header = wrapper('header');
    const headerTextWrapper = wrapper('h1', headerTXT);
    header.append(headerTextWrapper);
    const shipsPlacement = shipsBoard(player);
    const settings = wrapper('div', '', 'settings');

    if (!confirm) {
        const nav = wrapper('nav');
        const coordenatesBTN = button('Coordenadas', '', 'byInput');
        const dragNDropBTN = button('Arrastrar y soltar', '', 'byDragDrop');
        nav.append(coordenatesBTN, dragNDropBTN);

        const { shipsLeft, ship, size } = shipsAvailable;
        const instructions = wrapper('div', '', 'settings__dialog');
        const shipInventory = wrapper(
            'p',
            `${ship} (${ship.slice(0, 2)}), quedan ${shipsLeft} barcos por ubicar.`,
            'dialog__ship',
        );

        const form = coordenatesDialog();
        const drag = dragNdropDialog(ship, size);
        player.preferences.drag
            ? form.classList.add('hidden')
            : drag.classList.add('hidden');

        instructions.append(shipInventory, form, drag);
        const resetBTN = button('Reiniciar', '', 'reset');

        settings.append(nav, instructions, resetBTN);
    } else {
        const resetBTN = button('No, volver a ubicar', 'set', 'reset');
        const confirmBTN = button('Sí', '', 'confirm');

        settings.append(resetBTN, confirmBTN);
    }

    app.append(header, shipsPlacement, settings);
};

const attackBoard = (player) => {
    const board = boardFrame();
    board.setAttribute('data-board', 'myAttacks');
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

const replaceBoard = (shipsORattacks) => {
    const myShips = document.querySelector('[data-board="myShips"]');
    const myAttacks = document.querySelector('[data-board="myAttacks"]');

    myShips.classList.toggle('hidden', shipsORattacks !== 'ships');
    myAttacks.classList.toggle('hidden', shipsORattacks !== 'attacks');
};

const renderMakeAttack = (player, time) => {
    const radar = wrapper('div', '', 'radar');
    const radarSweep = wrapper('div', '', 'radar__sweep');
    if (!player.preferences.radar) {
        radar.classList.add('hidden');
    }
    const header = wrapper('header');
    const headerTXT = wrapper('h1', `¡${player.name}, es hora de atacar!`);
    const radarTXT = player.preferences.radar
        ? 'Apagar el radar'
        : 'Encender el radar';
    const radarBTN = button(radarTXT, '', 'radar');
    const settings = wrapper('div', '', 'settings');
    const nav = wrapper('nav');
    const myAttacksBTN = button('Ver mis disparos', '', 'myAttacks');
    const myShipsBTN = button('Ver mis barcos', '', 'myShips');
    const instructions = wrapper('div', '', 'settings__dialog');
    const timer = wrapper(
        'span',
        `00:${String(time).padStart(2, '0')}`,
        'counter warn',
    );
    const coordinates = inputText(
        'Escribe las coordenadas de tu ataque y presiona [Enter] para disparar:',
        '<A-J> <1-10> / <Aleatorio/Random>',
    );
    const randomBTN = button('¡Disparo automático!', 'set', 'attackRND');
    const myAttacks = attackBoard(player);
    const myShips = shipsBoard(player);
    myShips.classList.add('hidden');

    clearApp();
    radar.append(radarSweep);
    header.append(headerTXT, radarBTN);
    nav.append(myAttacksBTN, myShipsBTN);
    instructions.append(timer, coordinates, randomBTN);
    settings.append(instructions);
    app.append(radar, header, nav, myAttacks, myShips, settings);
};

const renderReceiveAttack = (defender) => {
    const header = wrapper('header');
    const headerTXT = wrapper('h1', `¡${defender.name}, te atacan!`);
    const myShips = shipsBoard(defender);

    clearApp();
    header.append(headerTXT);
    app.append(header, myShips);
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
    shipsBoard,
    shipPreview,
    clearShipPreview,
    renderShipsBoard,
    replaceAttackCell,
    replaceBoard,
    renderMakeAttack,
    renderReceiveAttack,
    switcherScreen,
    renderAftermath,
};
