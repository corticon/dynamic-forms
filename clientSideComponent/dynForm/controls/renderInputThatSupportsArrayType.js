// controls/renderInputThatSupportsArrayType.js
import { isArrayType } from './isArrayType.js';
import { createInputContainer } from './createInputContainer.js';
import { appendLabel } from './appendLabel.js';
import { createOneTextInput } from './createOneTextInput.js';
import { createAddTextInput } from './createAddTextInput.js';
import { createOneNumberInput } from './createOneNumberInput.js';
import { createAddNumberInput } from './createAddNumberInput.js';
import { createOneDateTimeInput } from './createOneDateTimeInput.js';
import { createAddDateTimeInput } from './createAddDateTimeInput.js';
import { addValidationMsgFromDecisionService } from './addValidationMsgFromDecisionService.js';

export function renderInputThatSupportsArrayType(oneUIControl, baseEl, labelPositionAtContainerLevel) {
    const arrayTypeControl = isArrayType(oneUIControl);
    const inputContainerEl = createInputContainer(baseEl, arrayTypeControl, false);
    inputContainerEl.data('uicontroltype', oneUIControl.type);

    appendLabel(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);

    switch (oneUIControl.type) {
        case 'Text':
            createOneTextInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);
            if (arrayTypeControl) {
                createAddTextInput(baseEl, oneUIControl, inputContainerEl, labelPositionAtContainerLevel);
            }
            break;
        case 'Number':
            createOneNumberInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);
            if (arrayTypeControl) {
                createAddNumberInput(baseEl, oneUIControl, inputContainerEl, labelPositionAtContainerLevel);
            }
            break;
        case 'DateTime':
            createOneDateTimeInput(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);
            if (arrayTypeControl) {
                createAddDateTimeInput(baseEl, oneUIControl, inputContainerEl, labelPositionAtContainerLevel);
            }
            break;
        default:
            console.error('Unsupported ui control type as an array type control: ' + oneUIControl.type);
            return;
    }

    addValidationMsgFromDecisionService(oneUIControl, inputContainerEl);
}