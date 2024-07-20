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
            buttonElement.setAttribute('data-cell', attribute);
        }
        if (disabled) {
            buttonElement.disabled = true;
        }

        return buttonElement;
    };

    const wrapper = (type, css = '', text = '', attribute = undefined) => {
        const element = document.createElement(type);
        element.className = css;
        element.textContent = text;

        if (attribute) {
            element.setAttribute('data-cell', attribute);
        }

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
        let rowHeader = 1;

        player.myAttacks.flat().forEach((cell, index) => {
            const row = index % 10 
            const col = Math.floor(index / 10)

            if (row === 0) {
                board.append(wrapper('span', 'board__coordenates', rowHeader));
                rowHeader++;
            }

            if (cell) {
                let css = 'board__ships';

                if (cell === 'X') {
                    css += ' board__ships--occupied';
                }

                board.append(wrapper('span', css, cell, `${col}-${row}`));
                return;
            }

            board.append(button('', 'board__attack', `${col}-${row}`, false));
        });

        return board;
    };

    const shipsBoard = (player) => {
        const board = boardFrame();
        let rowHeader = 1;

        player.myShips.flat().forEach((cell, index) => {
            const row = index % 10 
            const col = Math.floor(index / 10)
            let text = !cell ? '' : cell;
            const css = /\s|X/i.test(cell)
                ? 'board__ships board__ships--occupied'
                : 'board__ships';

            if (row === 0) {
                board.append(wrapper('span', 'board__coordenates', rowHeader));
                rowHeader++;
            }

            if (typeof cell === 'object') {
                text = cell.type.slice(0, 2);
            }

            board.append(wrapper('span', css, text, `${col}-${row}`));
        });

        return board;
    };

    return { inputText, button, wrapper, attackBoard, shipsBoard };
})();

export default renderInDOM;
