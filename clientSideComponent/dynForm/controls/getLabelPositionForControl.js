// controls/getLabelPositionForControl.js
export function getLabelPositionForControl(oneUIControl, labelPositionAtContainerLevel) {
    return oneUIControl.labelPosition || labelPositionAtContainerLevel;
}