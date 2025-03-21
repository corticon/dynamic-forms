// controls/createAddDateTimeInput.js
import { createPlusButton } from './createPlusButton.js';
import { createOneDateTimeInput } from './createOneDateTimeInput.js';

export function createAddDateTimeInput(baseEl, oneUIControl, inputContainerEl, labelPositionAtContainerLevel) {
    const addContainerEl = createPlusButton(baseEl);
    addContainerEl.click(function () {
        createOneDateTimeInput(oneUIControl, inputContainerEl, labelPositionAtContainerLevel, true);
    });
}