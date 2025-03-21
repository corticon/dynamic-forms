import { createOneMultiTextInput } from './createOneMultiTextInput.js';
import { createPlusButton } from './createPlusButton.js';

export function createAddMultiTextControl(baseEl, oneUIControl, multiTextContainerEl) {
    const addContainerEl = createPlusButton(baseEl);
    addContainerEl.click(function () {
        createOneMultiTextInput(oneUIControl, multiTextContainerEl);
    });
}