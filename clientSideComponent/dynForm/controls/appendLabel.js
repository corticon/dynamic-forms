// controls/appendLabel.js
import { getLabelPositionForControl } from './getLabelPositionForControl.js';

export function appendLabel(oneUIControl, labelPositionAtContainerLevel, inputContainerEl) {
    if (oneUIControl.label) {
        const labelPosition = getLabelPositionForControl(oneUIControl, labelPositionAtContainerLevel);
        let labelEl;

        if (labelPosition === 'Above') {
            labelEl = $('<div class="inputLabelAbove"></div>').text(oneUIControl.label);
        } else {
            labelEl = $('<span class="inputLabelSide"></span>').text(oneUIControl.label);
        }

        if (oneUIControl.emphasize === true) {
            labelEl.css({
                'font-weight': 'bold',
                'color': 'red'
            });
        }

        inputContainerEl.append(labelEl);
    }
}