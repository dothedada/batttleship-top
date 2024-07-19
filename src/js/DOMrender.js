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

    const attackBoard = (player) => {
        const board = wrapper('div', 'board');

        for (let i = 0; i < 11; i++) {
            const text = i === 0 ? '\\' : String.fromCharCode(64 + i);
            const boardHeader = wrapper('span', 'board__coordenates', text);
            board.append(boardHeader);
        }

        let row = 1;
        player.myAttacks.flat().forEach((cell, index) => {

            if (index % 10 === 0) {
                board.append(wrapper('span', 'board__coordenates', row));
                row++;
            }

            let dataImpact = '';
            let disabled = false;
            let buttonText = '';

            if (cell === 'X') {
                dataImpact = 'ship';
                disabled = true;
                buttonText = ' X ';
            }
            if (cell === '~') {
                dataImpact = 'water';
                disabled = true;
                buttonText = ' ~ ';
            }

            board.append(button(buttonText, 'board__attack', dataImpact, disabled));
        });

        return board


    };

    return { inputText, button, wrapper, attackBoard };
})();

export default renderInDOM;
