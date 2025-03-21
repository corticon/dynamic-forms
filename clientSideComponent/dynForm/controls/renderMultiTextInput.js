import { appendLabel } from './appendLabel.js';
import { createOneMultiTextInput } from './createOneMultiTextInput.js';
import { createAddMultiTextControl } from './createAddMultiTextControl.js';
import { addValidationMsgFromDecisionService } from './addValidationMsgFromDecisionService.js';

export function renderMultiTextInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
    const html = '<div class="multiTextInputContainer"></div>';
    const multiTextContainerEl = $(html);
    baseEl.append(multiTextContainerEl);
    multiTextContainerEl.data("uicontroltype", oneUIControl.type);
    appendLabel(oneUIControl, labelPositionAtContainerLevel, multiTextContainerEl);

    createOneMultiTextInput(oneUIControl, multiTextContainerEl);

    createAddMultiTextControl(baseEl, oneUIControl, multiTextContainerEl);

    addValidationMsgFromDecisionService(oneUIControl, multiTextContainerEl);
}