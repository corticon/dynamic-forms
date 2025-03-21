// controls/addValidationMsgFromDecisionService.js
export function addValidationMsgFromDecisionService(oneUIControl, inputContainerEl) {
    if (oneUIControl.validationErrorMsg) {
        const validationMsgEl = $(`<span class="controlValidationMessage">${oneUIControl.validationErrorMsg}</span>`);
        validationMsgEl.appendTo(inputContainerEl);
    }
}