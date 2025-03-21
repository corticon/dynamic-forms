import { customEvents, raiseEvent } from './customEvents.js'; // Adjust the path if needed

export class History {
    constructor() {
        this.itsHistory = [];
    }

    setupHistory() {
        raiseEvent(customEvents.AFTER_UI_STEP_RENDERED, this.storeDecisionServiceInputs2.bind(this));
    }

    storeDecisionServiceInputs2(event) {
        const theData = event.theData;
        // We do a deep Copy of the input. We need it otherwise we get a reference to current input
        const input = JSON.parse(JSON.stringify(theData.input));
        const stage = theData.stage;
        if (stage === 0) // Take care of restart the form after all done (By convention on stage 0 we are restarting)
            this.itsHistory = [];

        const index = this.itsHistory.length;
        this.itsHistory[index] = { "input": input, "stage": stage };
        // - console.log(`History: Stored stage ${stage} at ${index}`);
    }

    isHistoryEmpty() {
        return this.itsHistory.length <= 1;
    }

    getPreviousStageData() {
        // We are maintaining the data about all stages as soon as they are rendered. This means that the
        // current stage corresponds to the UI currently displayed. We could have stored the stages in history only
        // when moving onto the next stage but it would have complicated the controller as it would have had to maintain
        // the data about that stage until the next button was clicked. It is just easier to pop twice to get to the
        // previous stage.

        let currentStage;
        if (this.itsHistory.length === 1) // Trying to do previous when on the very first step.
            currentStage = this.itsHistory[0];
        else
            currentStage = this.itsHistory.pop();

        if (currentStage === undefined) {
            console.log('Internal error in history.getPreviousStageData: there should be a current stage');
            return;
        }

        const prevStage = this.itsHistory.pop();
        if (prevStage === undefined) {
            console.log('error in history.getPreviousStageData: there should be a previous stage');
            return;
        }

        return prevStage;
    }

    getRestartHistory() {
        return JSON.stringify(this.itsHistory);
    }

    setRestartHistory(savedHistory) {
        this.itsHistory = JSON.parse(savedHistory);
    }
}