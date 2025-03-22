import { createOneExpenseInput } from './createOneExpenseInput.js';

export function createAddExpenseControl(baseEl, oneUIControl, expenseContainerEl) {
    const html = '<div title="Add another expense" class="addExpenseContainer">&nbsp;+&nbsp;</div>';
    const addContainerEl = $(html);
    baseEl.append(addContainerEl);
    addContainerEl.click(function () {
        createOneExpenseInput(oneUIControl, expenseContainerEl);
    });
}