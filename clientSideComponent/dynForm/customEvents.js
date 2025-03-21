//https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events

export const customEvents = {
    "BEFORE_START": "beforeStart",
    "AFTER_START": "afterStart",
    "FORM_DONE": "formDone",
    "AFTER_DONE": "afterDone",
    "BACK_AT_FORM_BEGINNING": "backAtFormBeginning",
    "NEW_STEP": "newStep",
    "NEW_FORM_DATA_SAVED": "newFormDataSaved",
    "NEW_DS_EXECUTION": "newDSExecution",
    "BEFORE_DS_EXECUTION": "beforeDSExecution",
    "AFTER_UI_STEP_RENDERED": "afterUIStepRendered",
};

export function addCustomEventHandler(name, fct) {
    // Listen for the event on the body element for the lack of a better element !.
    document.body.addEventListener(name, fct, false);
}

export function raiseEvent(name, data) {
    const event = new Event(name);
    // I found that on some browsers, I couldn't get at detail as documented const event = new CustomEvent('build', { detail: elem.dataset.time });
    // So using my own field to store the data
    event.theData = data;
    document.body.dispatchEvent(event);
}