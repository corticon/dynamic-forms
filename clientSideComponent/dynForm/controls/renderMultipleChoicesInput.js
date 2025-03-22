import { addOptions } from './addOptions.js';
import { addOptionsFromDataSource } from './addOptionsFromDataSource.js';


if (oneUIControl.options) {
    addOptions(oneUIControl.options, multipleChoicesEl, oneUIControl);
}

if (oneUIControl.dataSource) {
    addOptionsFromDataSource(oneUIControl.dataSource, multipleChoicesEl, inputContainerEl, oneUIControl, completionFct);
}