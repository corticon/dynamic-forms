import UIControlsRenderer from './uiControlsRenderers.js';
import { StepsController } from './stepsController.js';
import { Tracer } from '../trace/trace.js'; // Corrected path
// import { customEvents, addCustomEventHandler } from './customEvents.js';

let currentDecisionServiceEngine;
let allInputData = [];
let inputData;
let itsCurrentLanguage = 'english';
let itsQuestionnaireKey = '0';
let itsFlagRenderWithKui = false;

const itsTracer = new Tracer();
const itsStepsController = new StepsController();

window.processSwitchSample = processSwitchSample;
window.setDataForCurrentSample = setDataForCurrentSample;
window.processSwitchLanguage = processSwitchLanguage;
window.processClickStart = processClickStart;
window.processClickNext = processClickNext;
window.processClickPrev = processClickPrev;
window.saveStateToLocalStorage = saveStateToLocalStorage;
window.processShowTrace = processShowTrace;
window.processHideTrace = processHideTrace;
window.processUseHtml = processUseHtml;
window.processUseKui = processUseKui;

function processSwitchSample(selectObject) {
    const index = selectObject.value;
    setDataForCurrentSample(index);
    saveStateToLocalStorage('CorticonSelectedSample', index);
}

function setDataForCurrentSample(index) {
    currentDecisionServiceEngine = window.corticonEngines[index];
    inputData = allInputData[index];
    itsQuestionnaireKey = index;

    if (index === '4' || index === '5') {
        $('#languageSelectId').html('');
        $('#languageSelectId').append('<option value="english">English</option>');
        if (index === '4') {
            $('#languageSelectId').append('<option value="italian">Italiano</option>');
        } else {
            $('#languageSelectId').append('<option value="french">French</option>');
        }
        $('#languageContainerId').show();
    } else {
        $('#languageContainerId').hide();
    }
}

function processSwitchLanguage(selectObject) {
    itsCurrentLanguage = selectObject.value;
}

function processClickStart() {
    const baseDynamicUIEl = $('#dynUIContainerId');
    itsStepsController.startDynUI(baseDynamicUIEl, currentDecisionServiceEngine, inputData, itsCurrentLanguage, itsQuestionnaireKey, itsFlagRenderWithKui);
}

function processClickNext() {
    const baseDynamicUIEl = $('#dynUIContainerId');
    itsStepsController.processNextStep(baseDynamicUIEl, currentDecisionServiceEngine, itsCurrentLanguage);
}

function processClickPrev() {
    const baseDynamicUIEl = $('#dynUIContainerId');
    itsStepsController.processPrevStep(baseDynamicUIEl, currentDecisionServiceEngine, itsCurrentLanguage);
}

function saveStateToLocalStorage(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch (e) {
    }
}

function processShowTrace() {
    $('.allTracesContainer').show();
    $('#hideTraceId').show();
    $('#showTraceId').hide();
    saveStateToLocalStorage('CorticonShowDSTrace', true);
}

function processHideTrace() {
    $('.allTracesContainer').hide();
    $('#showTraceId').show();
    $('#hideTraceId').hide();
    saveStateToLocalStorage('CorticonShowDSTrace', false);
}

function processUseHtml() {
    $('#useHtmlId').hide();
    $('#useKuiId').show();
    saveStateToLocalStorage('CorticonUseKui', false);
    itsFlagRenderWithKui = false;
}

function processUseKui() {
    $('#useHtmlId').show();
    $('#useKuiId').hide();
    saveStateToLocalStorage('CorticonUseKui', true);
    itsFlagRenderWithKui = true;
}

function setupInitialInputData() {
    const inDataEmpty = {};
    const inDataCanonical = inDataEmpty;
    const inDataReuseSubflow = {};
    const inMulticontainer = inDataEmpty;
    const inDataValidation = inDataEmpty;
    const inJobApplication = inDataEmpty;
    const inI18N = inDataEmpty;
    const inKitchenSink = inDataEmpty;
    const inCountry = inDataEmpty;
    const inVehicleSelection = inDataEmpty;
    const inPropertyInsurance = inDataEmpty;
    const inGardenPlantDisease = inDataEmpty;
    const inT2DB = inDataEmpty;
    const inForeignRisk = inDataEmpty;
    const inHomeowners = inDataEmpty;
    const inCrossing = inDataEmpty;

    allInputData.push(inDataCanonical);
    allInputData.push(inDataReuseSubflow);
    allInputData.push(inMulticontainer);
    allInputData.push(inDataValidation);
    allInputData.push(inJobApplication);
    allInputData.push(inI18N);
    allInputData.push(inKitchenSink);
    allInputData.push(inCountry);
    allInputData.push(inVehicleSelection);
    allInputData.push(inPropertyInsurance);
    allInputData.push(inGardenPlantDisease);
    allInputData.push(inT2DB);
    allInputData.push(inForeignRisk);
    allInputData.push(inHomeowners);
    allInputData.push(inCrossing);

    inputData = allInputData[0];
}

function restoreUIState() {
    const show = window.localStorage.getItem('CorticonShowDSTrace');
    if (show !== null) {
        if (show === 'true') {
            processShowTrace();
        } else if (show === 'false') {
            processHideTrace();
        }
    }

    const useKui = window.localStorage.getItem('CorticonUseKui');
    if (useKui !== null) {
        if (useKui === 'true') {
            processUseKui();
        } else if (useKui === 'false') {
            processUseHtml();
        }
    }

    const selectedSample = window.localStorage.getItem('CorticonSelectedSample');
    if (selectedSample !== null) {
        $(`#sampleSelectId option[value='${selectedSample}']`).prop('selected', true);
        setDataForCurrentSample(selectedSample);
    }
}

$(document).ready(function () {
    currentDecisionServiceEngine = window.corticonEngines[0];

    setupInitialInputData();

    itsTracer.setupTracing();

    restoreUIState();

    addCustomEventHandler(customEvents.AFTER_START, (event) => {
        $('#nextActionId').show();
        $('#startActionId').hide();
        $('#sampleSelectId').attr('disabled', true);
        $('#useHtmlId').hide();
        $('#useKuiId').hide();

        if (event && event.theData && event.theData.historyEmpty) {
            $('#prevActionId').hide();
        } else {
            $('#prevActionId').show();
        }
    });

    addCustomEventHandler(customEvents.NEW_STEP, () => {
        $('#prevActionId').show();
    });

    addCustomEventHandler(customEvents.FORM_DONE, () => {
        $('#prevActionId').hide();
    });

    addCustomEventHandler(customEvents.BACK_AT_FORM_BEGINNING, () => {
        $('#prevActionId').hide();
    });

    addCustomEventHandler(customEvents.AFTER_DONE, () => {
        $('#nextActionId').hide();
        $('#prevActionId').hide();
        $('#startActionId').show();
        $('#dynUIContainerId').html('<div style="margin: 2em; font-size: larger;">&nbsp;<i class="bi bi-check-circle"></i>All Done</div>');
        $('#sampleSelectId').attr('disabled', false);
        if (itsFlagRenderWithKui) {
            $('#useHtmlId').show();
        } else {
            $('#useKuiId').show();
        }
    });
});