// controls/createAddNumberInput.js
import { createPlusButton } from './createPlusButton.js';
import { createOneNumberInput } from './createOneNumberInput.js';

export function createAddNumberInput(baseEl, oneUIControl, inputContainerEl, labelPositionAtContainerLevel) {
    const addContainerEl = createPlusButton(baseEl);
    addContainerEl.click(function () {
        createOneNumberInput(oneUIControl, inputContainerEl, labelPositionAtContainerLevel, true);
    });
}