// controls/createPlusButton.js
export function createPlusButton(baseEl) {
    const addContainerEl = $('<div title="Add another one" class="addTextContainer">&nbsp;+&nbsp;</div>');
    baseEl.append(addContainerEl);
    return addContainerEl;
}