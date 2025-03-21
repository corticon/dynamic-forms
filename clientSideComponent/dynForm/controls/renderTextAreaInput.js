// controls/renderTextAreaInput.js
import { createInputContainer } from './createInputContainer.js';
import { appendLabel } from './appendLabel.js';
import { addValidationMsgFromDecisionService } from './addValidationMsgFromDecisionService.js';

export function renderTextAreaInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
    const inputContainerEl = createInputContainer(baseEl);

    appendLabel(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);

    const textAreaEl = $(`<textarea class="textAreaControl" id="${oneUIControl.id}"
        ${oneUIControl.rows ? `rows="${oneUIControl.rows}"` : ''}
        ${oneUIControl.cols ? `cols="${oneUIControl.cols}"` : ''}
        ${oneUIControl.min ? `minlength="${oneUIControl.min}"` : ''}
        ${oneUIControl.max ? `maxlength="${oneUIControl.max}"` : ''}></textarea>`);

    textAreaEl.appendTo(inputContainerEl);

    if (oneUIControl.fieldName) {
        textAreaEl.data('fieldName', oneUIControl.fieldName);
    } else {
        console.warn(`Missing field name for ${oneUIControl.id}`);
    }

    if (itsFlagRenderWithKui) {
        textAreaEl.kendoTextArea();
    }

    addValidationMsgFromDecisionService(oneUIControl, inputContainerEl);
}