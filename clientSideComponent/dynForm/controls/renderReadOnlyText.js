// controls/renderReadOnlyText.js
import { createInputContainer } from './createInputContainer.js';
import { appendLabel } from './appendLabel.js';

export function renderReadOnlyText(oneUIControl, baseEl, labelPositionAtContainerLevel) {
    const inputContainerEl = createInputContainer(baseEl);

    appendLabel(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);

    if (oneUIControl.value && oneUIControl.value.length !== 0) {
        const readOnlyEl = $(`<div class="readOnlyText">${oneUIControl.value}</div>`);
        inputContainerEl.append(readOnlyEl);
    } else {
        console.warn(`Missing value attribute for renderReadOnlyText id: ${oneUIControl.id}`);
    }
}