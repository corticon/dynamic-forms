// controls/createInputContainer.js
export function createInputContainer(baseEl, arrayTypeControl = false, complexArrayType = false) {
    let containerClass = 'nonarrayTypeControl';

    if (arrayTypeControl) {
        containerClass = complexArrayType ? 'complexArrayTypeControl' : 'simpleArrayTypeControl';
    }

    const inputContainerEl = $(`<div class="${containerClass} inputContainer"></div>`);
    baseEl.append(inputContainerEl);
    return inputContainerEl;
}