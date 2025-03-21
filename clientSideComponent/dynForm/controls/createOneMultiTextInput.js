import { createInputContainer } from './createInputContainer.js';
import { getNextUniqueId } from './getNextUniqueId.js';

let nextTextId = 0;

export function createOneMultiTextInput(oneUIControl, multiTextContainerEl) {
    nextTextId++;
    const inputContainerEl = createInputContainer(multiTextContainerEl, true, true);
    inputContainerEl.data("uicontroltype", oneUIControl.type);

    const theAttributes = { "type": "text", "id": `${oneUIControl.id}_text_${nextTextId}` };
    const textInputEl = $('<input/>').attr(theAttributes);
    textInputEl.appendTo(inputContainerEl);

    if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null) {
        textInputEl.data("fieldName", oneUIControl.fieldName); // Set the fieldName directly
        textInputEl.data("type", "array");
    } else {
        console.warn('Missing field name for ' + oneUIControl.id);
    }
}
// end milti text