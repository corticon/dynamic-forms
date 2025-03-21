// controls/createOneTextInput.js
import { getNextUniqueId } from './getNextUniqueId.js';
import { appendLabel } from './appendLabel.js';
import { createInputContainer } from './createInputContainer.js';
import { addValidationMsgFromDecisionService } from './addValidationMsgFromDecisionService.js';

export function createOneTextInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl, addBreak = false) {
    const theAttributes = { "type": "text", "id": oneUIControl.id + getNextUniqueId() };
    if (oneUIControl.tooltip) {
        theAttributes["title"] = oneUIControl.tooltip;
    }

    const textInputEl = $('<input/>').attr(theAttributes);

    const containerDiv = createInputContainer(inputContainerEl, false, false);
    containerDiv.data("uicontroltype", oneUIControl.type);

    appendLabel(oneUIControl, labelPositionAtContainerLevel, containerDiv);

    textInputEl.appendTo(containerDiv);

    if (oneUIControl.fieldName) {
        textInputEl.data("fieldName", oneUIControl.fieldName);
    } else {
        console.warn('Missing field name for ' + oneUIControl.id);
    }

    if (oneUIControl.value) {
        textInputEl.val(oneUIControl.value);
    }

    if (addBreak) {
        const breakEl = $('<div>');
        breakEl.append(textInputEl);
        containerDiv.append(breakEl);
    } else {
        containerDiv.append(textInputEl);
    }

    if (itsFlagRenderWithKui) {
        textInputEl.kendoTextBox();
    }

    addValidationMsgFromDecisionService(oneUIControl, containerDiv);
}