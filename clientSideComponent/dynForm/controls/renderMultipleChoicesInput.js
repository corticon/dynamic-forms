function renderMultipleChoicesInput(oneUIControl, baseEl, labelPositionAtContainerLevel) {
    const inputContainerEl = createInputContainer(baseEl);
    appendLabel(oneUIControl, labelPositionAtContainerLevel, inputContainerEl);

    let html3 = `<select id="${oneUIControl.id + getNextUniqueId()}"`;
    if (oneUIControl.type === 'MultipleChoicesMultiSelect')
        html3 += ' multiple';

    html3 += '></select>';
    const multipleChoicesEl = $(html3);
    if (oneUIControl.fieldName !== undefined && oneUIControl.fieldName !== null)
        multipleChoicesEl.data("fieldName", oneUIControl.fieldName);
    else
        console.warn('Missing field name for ' + oneUIControl.id);

    inputContainerEl.append(multipleChoicesEl);

    const completionFct = () => {
        if (itsFlagRenderWithKui) {
            multipleChoicesEl.kendoDropDownList();
        }
    };

    addOptions(oneUIControl.option, oneUIControl.dataSource, multipleChoicesEl, inputContainerEl, oneUIControl, completionFct);
    addValidationMsgFromDecisionService(oneUIControl, inputContainerEl);
}