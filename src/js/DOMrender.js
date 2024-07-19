const createInputDOM = (labelText, placeholderText) => {
    const label = document.createElement('span')
    const input = document.createElement('input')

    label.textContent = labelText
    input.type = 'text'
    input.placeholder = placeholderText

    label.append(input)

    return label
}

const createButtonDOM = (buttonText, cssClass = '') => {
    const button = document.createElement('button')

    button.type = 'button'
    button.className = cssClass
    button.textContent = buttonText

    return button
}
