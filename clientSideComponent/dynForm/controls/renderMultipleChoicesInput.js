import { addOptions } from './addOptions.js';
import { addOptionsFromDataSource } from './addOptionsFromDataSource.js';

export function renderMultipleChoicesInput(oneUIControl, baseEl, labelPositionAtContainerLevel, completionFct) {
    const inputContainerEl = $('<div class="multipleChoicesContainer"></div>');
    baseEl.append(inputContainerEl);

    if (oneUIControl.options) {
        addOptions(oneUIControl.options, inputContainerEl, oneUIControl);
    }

    if (oneUIControl.dataSource) {
        addOptionsFromDataSource(oneUIControl.dataSource, inputContainerEl, inputContainerEl, oneUIControl, completionFct);
    }
}