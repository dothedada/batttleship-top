const renderInDOM = (() => {
    const inputText = (labelText, placeholderText) => {
        const label = document.createElement('label');
        const inputElement = document.createElement('input');

        label.textContent = labelText;
        inputElement.type = 'text';
        inputElement.placeholder = placeholderText;

        label.append(inputElement);

        return label;
    };

    const button = (buttonText, css = '', attribute = '', disabled = false) => {
        const buttonElement = document.createElement('button');

        buttonElement.type = 'button';
        buttonElement.className = css;
        buttonElement.textContent = buttonText;

        if (attribute) {
            buttonElement.setAttribute('data-impact', attribute);
        }
        if (disabled) {
            buttonElement.disabled = true;
        }

        return buttonElement;
    };

    const wrapper = (type, css = '', text = '') => {
        const element = document.createElement(type);
        element.className = css;
        element.textContent = text;

        return element;
    };

    const boardFrame = () => {
        const board = wrapper('div', 'board');

        for (let i = 0; i < 11; i++) {
            const text = i === 0 ? '\\' : String.fromCharCode(64 + i);
            const boardHeader = wrapper('span', 'board__coordenates', text);
            board.append(boardHeader);
        }

        return board;
    };

    const attackBoard = (player) => {
        const board = boardFrame();
        let row = 1;

        player.myAttacks.flat().forEach((cell, index) => {
            if (index % 10 === 0) {
                board.append(wrapper('span', 'board__coordenates', row));
                row++;
            }

            if (cell) {
                let css = 'board__ships';

                if (cell === 'X') {
                    css += ' board__ships--occupied';
                }

                board.append(wrapper('span', css, cell));
                return;
            }

            board.append(button('', 'board__attack', '', false));
        });

        return board;
    };

    const shipsBoard = (player) => {
        const board = boardFrame();
        let row = 1;

        player.myShips.flat().forEach((cell, index) => {
            let text = !cell ? '' : cell;
            const css = /\s|X/i.test(cell)
                ? 'board__ships board__ships--occupied'
                : 'board__ships';

            if (index % 10 === 0) {
                board.append(wrapper('span', 'board__coordenates', row));
                row++;
            }

            if (typeof cell === 'object') {
                text = cell.type.slice(0, 2);
            }

            board.append(wrapper('span', css, text));
        });

        return board;
    };

    return { inputText, button, wrapper, attackBoard, shipsBoard };
})();

export default renderInDOM;
