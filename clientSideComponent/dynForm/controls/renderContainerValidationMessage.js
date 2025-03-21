// controls/renderContainerValidationMessage.js
export function renderContainerValidationMessage(validationMessage, baseEl) {
    if (validationMessage) {
        const msgEl = $(`<div class="containerValidationMessage">${validationMessage}</div>`);
        baseEl.append(msgEl);
    }
}