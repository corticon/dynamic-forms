// Assumption: jquery has been included and is defined.

export function copyToClipboard(selector) {
    const text = $(selector).val();

    navigator.clipboard.writeText(text).then(function (result) {
        /* clipboard successfully set */
    }, function (result) {
        console.log("Could not copy to clipboard - probably no privs to do that in this browser !" + result);
    });
}