// controls/renderSingleChoiceInput.js
import { createInputContainer } from './createInputContainer.js';

export function renderSingleChoiceInput(oneUIControl, baseEl) {
    const inputContainerEl = createInputContainer(baseEl);

    if (oneUIControl.label) {
        const checkboxInputEl = $('<input/>').attr({
            type: 'checkbox',
            id: oneUIControl.id,
            name: oneUIControl.id
        });
        const checkboxLabelEl = $(`<label for="${oneUIControl.id}">&nbsp;${oneUIControl.label}</label>`);

        checkboxInputEl.appendTo(inputContainerEl);
        checkboxLabelEl.appendTo(inputContainerEl);

        if (oneUIControl.fieldName) {
            checkboxInputEl.data('fieldName', oneUIControl.fieldName);
        } else {
            console.warn(`Missing field name for ${oneUIControl.id}`);
        }

        if (itsFlagRenderWithKui) {
            checkboxInputEl.kendoCheckBox();
        }
    } else {
        console.warn(`Missing label for checkbox ${oneUIControl.id}`);
    }
}