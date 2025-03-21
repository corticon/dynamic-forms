import { createInputContainer } from './createInputContainer.js';
import { getNextUniqueId } from './getNextUniqueId.js';
import { appendLabel } from './appendLabel.js';
import { addValidationMsgFromDecisionService } from './addValidationMsgFromDecisionService.js';

export function createOneNumberInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl, addBreak = false) {
    const html3 = '<span style="display: none;" class="fieldValidationLabel">Enter a number between ' + oneUIControl.min + ' and ' + oneUIControl.max + '</span>';
    const validationEl = $(html3);

    const theAttributes = { "type": "text", "id": oneUIControl.id + getNextUniqueId() };
    if (oneUIControl.tooltip !== undefined && oneUIControl.tooltip !== null) {
        theAttributes["title"] = oneUIControl.tooltip;
    }

    const textInputEl = $('<input/>').attr(theAttributes);

    const containerDiv = createInputContainer(inputContainerEl, false, false); // Create input container
    containerDiv.data("uicontroltype", oneUIControl.type);

    appendLabel(oneUIControl, labelPositionAtContainerLevel, containerDiv); // Append label

    textInputEl.appendTo(containerDiv);

    if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null) {
        textInputEl.data("fieldName", oneUIControl.fieldName);
        textInputEl.data("type", "decimal");
    }
    else
        console.warn('Missing field name for ' + oneUIControl.id);

    // there may be a value (default value or when validation fails we re-render with entered data)
    if (oneUIControl.value !== undefined && oneUIControl.value !== null) {
        textInputEl.val(oneUIControl.value);
    }

    textInputEl.on("input", function () {
        const input = $(this).val();
        const converted = Number(input);
        if (isNaN(converted))
            alert("Please enter a number");
        else {
            if (converted < oneUIControl.min || converted > oneUIControl.max)
                validationEl.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        }
    });

    if (oneUIControl.min !== undefined)
        validationEl.show();

    if (addBreak) {
        const breakEl = $('<div>');
        breakEl.append(textInputEl);
        containerDiv.append(breakEl);
    }
    else {
        containerDiv.append(textInputEl);
    }

    if (itsFlagRenderWithKui) {
        textInputEl.kendoNumericTextBox({
            min: oneUIControl.min,
            max: oneUIControl.max,
            required: true,
            value: typeof oneUIControl.value === 'number' ? oneUIControl.value : undefined
        });
    }

    addValidationMsgFromDecisionService(oneUIControl, containerDiv);
}