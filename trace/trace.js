import { customEvents, raiseEvent } from './customEvents.js'; // Adjust path if needed

export class Tracer {
    constructor() {
        this.itsStagesTrace = [];
    }

    setupTracing() {
        raiseEvent(customEvents.BEFORE_START, this._clearTraceData.bind(this));
        raiseEvent(customEvents.NEW_FORM_DATA_SAVED, this._traceFormData.bind(this));
        raiseEvent(customEvents.BEFORE_DS_EXECUTION, this._traceDecisionServiceInputs.bind(this));
        raiseEvent(customEvents.NEW_DS_EXECUTION, this._traceDecisionServiceResults.bind(this));
        raiseEvent(Tracer.tracerCustomEvents.SWITCH_TO_SAVED_STAGE, this._switchToSavedStage.bind(this));
    }

    _clearTraceData() {
        document.getElementById("decisionServiceInputId").value = "";
        document.getElementById("decisionServiceResultId").value = "";
        document.getElementById("formDataId").value = "";

        this.itsStagesTrace = [];
        $("#traceHistoryId").empty();
    }

    _traceDecisionServiceInputs(event) {
        const theData = event.theData;
        const input = theData.input;
        const stage = theData.stage;
        const index = this.itsStagesTrace.length;
        const x = JSON.stringify(input, null, 2);
        this.itsStagesTrace[index] = { "input": x, "result": null, "formData": null };
        this._showDecisionServiceInputs(x);
        this._addStageInHistory(stage, index);
    }

    _traceDecisionServiceResults(event) {
        const theData = event.theData;
        const result = theData.output;
        const execTimeMs = theData.execTimeMs;

        let stageDescription;
        if (theData.stageDescription !== undefined && theData.stageDescription !== null)
            stageDescription = theData.stageDescription;
        else
            stageDescription = "no description provided";

        // we assume there was a call to trace the input and thus a new element in history
        const index = this.itsStagesTrace.length - 1;
        this.itsStagesTrace[index].result = JSON.stringify(result, null, 2);
        this.itsStagesTrace[index].timing = Math.round(execTimeMs);

        // add tooltip to the existing node created before we made call to DS
        const el = $("#traceNodeId_" + index);
        el.prop("title", stageDescription);

        this._showDecisionServiceResults(this.itsStagesTrace[index].result, this.itsStagesTrace[index].timing);
    }

    _showDecisionServiceInputs(newValue) {
        document.getElementById("decisionServiceInputId").value = newValue;
    }

    _removeHighlightedStage() {
        $(".stageInTrace").removeClass("activeStageInTrace");
    }

    _addStageInHistory(stage, index) {
        this._removeHighlightedStage();

        let html = `<span>`;
        if (index !== 0)
            html += `&rarr;`;

        html += `<a class="activeStageInTrace stageInTrace" id="traceNodeId_${index}"
href="#" onclick="Tracer.tracerClickStage(${index}, this)">&nbsp;${stage}&nbsp;</a></span>`;

        $("#traceHistoryId").append(html);

        const newTitle = "Stages History: " + this.itsStagesTrace.length + " stages";
        $("#traceHistorySummaryId").prop("title", newTitle);
    }

    _traceFormData(event) {
        const theData = event.theData;
        const index = this.itsStagesTrace.length - 1;
        const x = JSON.stringify(theData, null, 2);
        this.itsStagesTrace[index].formData = x;
        this._showSavedFormData(x);
    }

    _switchToSavedStage(event) {
        const index = event.theData.index;
        const theEl = event.theData.el;
        this._removeHighlightedStage();
        $(theEl).addClass("activeStageInTrace");
        const oneTrace = this.itsStagesTrace[index];
        this._showDecisionServiceInputs(oneTrace.input);
        this._showDecisionServiceResults(oneTrace.result, oneTrace.timing);
        this._showSavedFormData(oneTrace.formData);
    }

    _showDecisionServiceResults(newValue, execTimeMs) {
        document.getElementById("decisionServiceResultId").value = newValue;
        $("#execTimeId").html("(" + execTimeMs + "ms)");
    }

    _showSavedFormData(newValue) {
        if (newValue === null || newValue.length === 0)
            newValue = "Form Data was not saved at that step";

        document.getElementById("formDataId").value = newValue;
    }

    static tracerCustomEvents = {
        "SWITCH_TO_SAVED_STAGE": "switchToSavedStage",
    };

    static tracerClickStage(index, theEl) {
        raiseEvent(Tracer.tracerCustomEvents.SWITCH_TO_SAVED_STAGE, { "index": index, "el": theEl });
    }
}