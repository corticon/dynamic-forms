// controls/addOptionsFromDataSource.js
export function addOptionsFromDataSource(dataSource, multipleChoicesEl, inputContainerEl, oneUIControl, completionFct) {
    if (dataSource) {
        inputContainerEl.hide(); // Hide until data is received

        $.get(dataSource, function (data) {
            if (data && data.length > 0) {
                data.forEach(item => {
                    multipleChoicesEl.append($('<option>', {
                        value: item.value,
                        text: item.displayName
                    }));
                });
            } else {
                console.warn(`Data source ${dataSource} returned empty list for control ${oneUIControl.id}.`);
            }
            if (completionFct) {
                completionFct();
            }
            inputContainerEl.show();
        }, "json")
            .done(function () {
                console.log(`Successfully fetched options from ${dataSource}`);
            })
            .fail(function (jqXHR, exception) {
                let msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connected. Verify Network.';
                } else if (jqXHR.status === 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status === 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Timeout error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Unknown Error.\n' + jqXHR.responseText;
                }
                console.error(`Error fetching options from ${dataSource}: ${msg}`);
                console.error(`HTTP Status: ${jqXHR.status}, Exception: ${exception}`);
            });
    }
}