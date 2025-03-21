// controls/renderExpenseInput.js
import { appendLabel } from './appendLabel.js';
import { createOneExpenseInput } from './createOneExpenseInput.js';
import { createAddExpenseControl } from './createAddExpenseControl.js';
import { addValidationMsgFromDecisionService } from './addValidationMsgFromDecisionService.js';

export function renderExpenseInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
    const expenseContainerEl = $('<div class="expenseInputContainer"></div>');
    baseEl.append(expenseContainerEl);

    appendLabel(oneUIControl, labelPositionAtContainerLevel, expenseContainerEl);
    createOneExpenseInput(oneUIControl, expenseContainerEl);
    createAddExpenseControl(baseEl, oneUIControl, expenseContainerEl);
    addValidationMsgFromDecisionService(oneUIControl, expenseContainerEl);
}