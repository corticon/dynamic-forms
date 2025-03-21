// controls/createOneExpenseInput.js
import { createInputContainer } from './createInputContainer.js';
import { getNextUniqueId } from './getNextUniqueId.js';

let nextExpenseId = 0;

export function createOneExpenseInput(oneUIControl, expenseContainerEl) {
    nextExpenseId++;
    const inputContainerEl = createInputContainer(expenseContainerEl, true, true);
    inputContainerEl.data('uicontroltype', oneUIControl.type);

    // Expense Type Select
    const expenseTypeSelect = $('<select/>').attr({
        id: `${oneUIControl.id}_expType_${nextExpenseId}`
    }).data('uicontroltype', oneUIControl.type);

    if (oneUIControl.option && oneUIControl.option.length > 0) {
        oneUIControl.option.forEach(option => {
            expenseTypeSelect.append($('<option/>', {
                value: option.value,
                text: option.displayName
            }));
        });
    } else {
        console.warn(`Missing or empty options for expense control ${oneUIControl.id}`);
    }

    inputContainerEl.append(expenseTypeSelect);

    // Expense Amount Input
    const amountInput = $('<input class="expenseAmount"/>').attr({
        type: 'number',
        id: `${oneUIControl.id}_expAmount_${nextExpenseId}`
    }).data('uicontroltype', oneUIControl.type);

    if (oneUIControl.fieldName) {
        amountInput.data('fieldName', oneUIControl.fieldName).data('type', 'array');
    } else {
        console.warn(`Missing field name for ${oneUIControl.id}`);
    }

    inputContainerEl.append(amountInput);

    // Currency Select
    const currencySelect = $('<select class="currencySelector"/>').attr({
        id: `${oneUIControl.id}_Currency_${nextExpenseId}`
    }).data('uicontroltype', oneUIControl.type).data('fieldName', oneUIControl.fieldName);

    currencySelect.append($('<option/>', { value: 'USD', text: '$ US Dollars' }));
    currencySelect.append($('<option/>', { value: 'EUR', text: '€ Euro' }));

    inputContainerEl.append(currencySelect);
}