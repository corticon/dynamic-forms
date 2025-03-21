import { renderTextInput } from './controls/renderTextInput.js';
import { renderNumberInput } from './controls/renderNumberInput.js';
import { renderDateTimeInput } from './controls/renderDateTimeInput.js';
import { renderMultipleChoicesInput } from './controls/renderMultipleChoicesInput.js';
import { renderSingleChoiceInput } from './controls/renderSingleChoiceInput.js';
import { renderTextAreaInput } from './controls/renderTextAreaInput.js';
import { renderReadOnlyText } from './controls/renderReadOnlyText.js';
import { renderYesNoInput } from './controls/renderYesNoInput.js';
import { renderExpenseInput } from './controls/renderExpenseInput.js';
import { renderFileUploadInput } from './controls/renderFileUploadInput.js';
import { renderFileUploadExpenseInput } from './controls/renderFileUploadExpenseInput.js';
import { renderMultiTextInput } from './controls/renderMultiTextInput.js';
// Assuming you have a renderLocationControl.js file
import { renderLocationControl } from './controls/renderLocationControl.js';

export default class UIControlsRenderer {
    render(uiControls, baseEl, labelPositionAtUILevel, language, completionFct) {
        uiControls.forEach(oneUIControl => {
            const containerBaseEl = $(baseEl);
            switch (oneUIControl.type) {
                case 'Text':
                    renderTextInput(oneUIControl, containerBaseEl, labelPositionAtUILevel);
                    break;
                case 'Number':
                    renderNumberInput(oneUIControl, containerBaseEl, labelPositionAtUILevel);
                    break;
                case 'DateTime':
                    renderDateTimeInput(oneUIControl, containerBaseEl, labelPositionAtUILevel);
                    break;
                case 'MultipleChoices':
                    renderMultipleChoicesInput(oneUIControl, containerBaseEl, labelPositionAtUILevel, completionFct);
                    break;
                case 'SingleChoice':
                    renderSingleChoiceInput(oneUIControl, containerBaseEl);
                    break;
                case 'TextArea':
                    renderTextAreaInput(oneUIControl, containerBaseEl, labelPositionAtUILevel);
                    break;
                case 'ReadOnlyText':
                    renderReadOnlyText(oneUIControl, containerBaseEl, labelPositionAtUILevel);
                    break;
                case 'YesNo':
                case 'YesNoBoolean':
                    renderYesNoInput(oneUIControl, containerBaseEl, labelPositionAtUILevel, language, oneUIControl.type);
                    break;
                case 'Expense':
                    renderExpenseInput(oneUIControl, containerBaseEl, labelPositionAtUILevel);
                    break;
                case 'FileUpload':
                    renderFileUploadInput(oneUIControl, containerBaseEl, labelPositionAtUILevel);
                    break;
                case 'FileUploadExpense':
                    renderFileUploadExpenseInput(oneUIControl, containerBaseEl, labelPositionAtUILevel);
                    break;
                case 'MultiText':
                    renderMultiTextInput(oneUIControl, containerBaseEl, labelPositionAtUILevel);
                    break;
                case 'Location':
                    renderLocationControl(oneUIControl, containerBaseEl, labelPositionAtUILevel);
                    break;
                default:
                    console.error('Unknown UI control type:', oneUIControl.type);
                    break;
            }
        });

        const allFormEls = $(baseEl).find(':input');
        if (allFormEls !== null && allFormEls.length > 0) {
            allFormEls[0].focus();
        }
    }
}