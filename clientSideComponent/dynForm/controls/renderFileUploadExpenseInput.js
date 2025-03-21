// controls/renderFileUploadExpenseInput.js
import { createInputContainer } from './createInputContainer.js';

export function renderFileUploadExpenseInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
    const inputContainerEl = createInputContainer(baseEl);

    if (!oneUIControl.id) {
        console.error('Missing id for file upload.');
        return;
    }

    if (!oneUIControl.label || oneUIControl.label.length === 0) {
        console.error(`Missing label for file upload ${oneUIControl.id}.`);
        return;
    }

    const fileUpEl = $(`<label htmlFor="${oneUIControl.id}">${oneUIControl.label}:</label><input class="markerFileUploadExpense" type="file" id="${oneUIControl.id}">`);
    inputContainerEl.append(fileUpEl);

    if (oneUIControl.fieldName) {
        fileUpEl.data('fieldName', oneUIControl.fieldName);
    } else {
        console.warn(`Missing field name for ${oneUIControl.id}.`);
    }
}