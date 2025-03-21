// controls/createOneDateTimeInput.js
import { getNextUniqueId } from './getNextUniqueId.js';

export function createOneDateTimeInput(oneUIControl, inputContainerEl, labelPositionAtContainerLevel, addBreak = false) {
    const showTime = oneUIControl.showTime === true;
    const controlType = showTime ? 'datetime-local' : 'date';
    const tag = showTime ? 'datetimetag' : 'datetag';

    const attributes = {
        type: controlType,
        id: oneUIControl.id + getNextUniqueId()
    };

    if (oneUIControl.minDT) {
        attributes.min = oneUIControl.minDT;
    }
    if (oneUIControl.maxDT) {
        attributes.max = oneUIControl.maxDT;
    }

    if (oneUIControl.value) {
        const localDate = new Date(Number(oneUIControl.value));
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        let value = `${localDate.getFullYear()}-${month}-${day}`;

        if (showTime) {
            const hours = String(localDate.getHours()).padStart(2, '0');
            const minutes = String(localDate.getMinutes()).padStart(2, '0');
            value += ` ${hours}:${minutes}`;
        }
        attributes.value = value;
    }

    const textInputEl = $('<input/>').attr(attributes).data('type', tag);
    inputContainerEl.append(addBreak ? $('<div>').append(textInputEl) : textInputEl);

    if (oneUIControl.fieldName) {
        textInputEl.data('fieldName', oneUIControl.fieldName);
    } else {
        console.warn(`Missing field name for ${oneUIControl.id}`);
    }

    if (itsFlagRenderWithKui) {
        if (showTime) {
            textInputEl.kendoDateTimePicker({ ...attributes, format: 'u' });
        } else {
            textInputEl.kendoDatePicker({ ...attributes, format: 'yyyy-MM-dd' });
        }
    }

    if (oneUIControl.minDT || oneUIControl.maxDT) {
        let validationMsg = '';
        if (oneUIControl.minDT && oneUIControl.maxDT) {
            validationMsg = `Enter a date between ${oneUIControl.minDT.substr(0, 10)} and ${oneUIControl.maxDT.substr(0, 10)}`;
        } else if (oneUIControl.minDT) {
            validationMsg = `Enter a date greater than ${oneUIControl.minDT.substr(0, 10)}`;
        } else {
            validationMsg = `Enter a date less than ${oneUIControl.maxDT.substr(0, 10)}`;
        }
        inputContainerEl.append($(`<span class="fieldValidationLabel">${validationMsg}</span>`));
    }
}