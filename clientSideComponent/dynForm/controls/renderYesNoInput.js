// controls/renderYesNoInput.js
import { createInputContainer } from './createInputContainer.js';
import { appendLabel } from './appendLabel.js';

export function renderYesNoInput(oneUIControl, baseEl, labelPositionAtContainerLevel, language, type) {
    const inputContainerEl = createInputContainer(baseEl);

    let yes = 'Yes';
    if (language && language.toLowerCase() === 'italian') {
        yes = 'Si';
    }

    appendLabel(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);

    const yesValue = type === 'YesNo' ? 'yes' : 'T';
    const noValue = type === 'YesNo' ? 'no' : 'F';

    const yesNoEl = $(`<select id="${oneUIControl.id}">
        <option value="${yesValue}">${yes}</option>
        <option value="${noValue}">No</option>
    </select>`);

    if (oneUIControl.fieldName) {
        yesNoEl.data('fieldName', oneUIControl.fieldName);
    } else {
        console.warn(`Missing field name for ${oneUIControl.id}`);
    }

    inputContainerEl.append(yesNoEl);

    if (itsFlagRenderWithKui) {
        yesNoEl.kendoDropDownList();
    }
}