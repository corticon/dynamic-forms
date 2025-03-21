import { addOptions } from './addOptions.js';
import { addOptionsFromDataSource } from './addOptionsFromDataSource.js';

// ... inside your renderMultipleChoicesInput function ...

if (oneUIControl.options) {
    addOptions(oneUIControl.options, multipleChoicesEl, oneUIControl);
}

if (oneUIControl.dataSource) {
    addOptionsFromDataSource(oneUIControl.dataSource, multipleChoicesEl, inputContainerEl, oneUIControl, completionFct);
}