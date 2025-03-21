// controls/createAddTextInput.js
import { createPlusButton } from './createPlusButton.js';
import { createOneTextInput } from './createOneTextInput.js';

export function createAddTextInput(baseEl, oneUIControl, inputContainerEl, labelPositionAtContainerLevel) {
    const addContainerEl = createPlusButton(baseEl);
    addContainerEl.click(function () {
        createOneTextInput(oneUIControl, inputContainerEl, labelPositionAtContainerLevel, true);
    });
}