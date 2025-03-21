// controls/addOptions.js
export function addOptions(theOptions, multipleChoicesEl, oneUIControl) {
    if (theOptions && theOptions.length > 0) {
        theOptions.forEach(option => {
            multipleChoicesEl.append($('<option>', {
                value: option.value,
                text: option.displayName
            }));
        });
    } else {
        console.warn(`List of options is empty for multiple choices control ${oneUIControl.id}.`);
    }
}