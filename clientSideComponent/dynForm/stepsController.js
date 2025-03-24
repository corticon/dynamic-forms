import { History } from './history.js';
import UIControlsRenderer from './uiControlsRenderers.js';
import { customEvents, raiseEvent } from './customEvents.js';
const JSONPath = window.jsonpathPlus;

function _createEachTextEntity(outerArray, textFieldArray) {
    const convertedArray = [];
    for (let i = 0; i < outerArray.length; i++) {
        const oneItemAsAnArray = outerArray[i];
        const oneItemAsObjLit = {};
        for (let j = 0; j < oneItemAsAnArray.length; j++) {
            oneItemAsObjLit[textFieldArray[j]] = oneItemAsAnArray[j];
        }
        convertedArray.push(oneItemAsObjLit);
    }
    return convertedArray;
}

export class StepsController {
    constructor() {
        this.itsDecisionServiceInput = [{}, {}];
        this.itsPathToData;
        this.itsFormData;
        this.itsFlagAllDone;
        this.itsLabelPositionAtUILevel;
        this.itsQuestionnaireName;
        this.itsInitialLanguage;
        this.itsFlagRenderWithKui;

        this.itsHistory = new History();
        this.itsUIControlsRenderer = new UIControlsRenderer();
    }

    async startDynUI(baseDynamicUIEl, decisionServiceEngine, externalData, language, questionnaireName, useKui) {
        this.itsFlagRenderWithKui = useKui;
        this.itsQuestionnaireName = questionnaireName;
        this.itsInitialLanguage = language;
        this.itsHistory.setupHistory();

        const restartData = this.getRestartData(questionnaireName);
        if (restartData === null) {
            this.setStateForStartFromBeginning(language, externalData);
        } else {
            const dialog = confirm('Do you want to start from where you left last time?');
            if (dialog) {
                this.setStateFromRestartData(questionnaireName, restartData);
            } else {
                this.clearRestartData(questionnaireName);
                this.setStateForStartFromBeginning(language, externalData);
            }
        }

        raiseEvent(customEvents.BEFORE_START);

        await this._askDecisionServiceForNextUIElementsAndRender(decisionServiceEngine, this.itsDecisionServiceInput, baseDynamicUIEl);

        raiseEvent(customEvents.AFTER_START, { historyEmpty: this.itsHistory.isHistoryEmpty() });
    }

    setStateForStartFromBeginning(language, externalData) {
        this._resetDecisionServiceInput(language);

        this.itsFormData = null;
        this.itsFlagAllDone = false;
        this.itsPathToData = null;
        this.itsLabelPositionAtUILevel = 'Above'; // Default

        this.itsDecisionServiceInput[1] = JSON.parse(JSON.stringify(externalData));
    }

    async _processBackgroundData(backgroundData) {
        const {
            url,
            arrayToSet,
            arrayToCollection,
            collectionName,
            fieldName1,
            labelName1,
            pathToValue1,
            labelName2,
            pathToValue2,
            fieldName3,
            labelName3,
            pathToValue3,
            fieldName4,
            labelName4,
            pathToValue4,
            fieldName5,
            labelName5,
            pathToValue5,
            fieldName6,
            labelName6,
            pathToValue6,
            fieldName7,
            labelName7,
            pathToValue7,
            fieldName8,
            labelName8,
            pathToValue8,
            fieldName9,
            labelName9,
            pathToValue9,
            fieldName10,
            labelName10,
            pathToValue10,
        } = backgroundData;

        try {
            const response = await fetch(url);
            const data = await response.json();

            let value;
            if (arrayToSet) {
                value = data.map((item) => item[labelName1]).join(', ');
            } else if (arrayToCollection) {
                value = data.map((item) => {
                    const newObj = {};
                    for (let i = 1; i <= 10; i++) {
                        const fieldName = backgroundData[`fieldName${i}`];
                        const labelName = backgroundData[`labelName${i}`];
                        const pathToValue = backgroundData[`pathToValue${i}`];
                        if (fieldName && labelName) {
                            newObj[fieldName] = item[labelName];
                        }
                    }
                    return newObj;
                });
            } else if (fieldName1 && labelName1 && pathToValue1) {
                value = JSONPath.JSONPath(pathToValue1, data)[0];
                this._saveOneFormData(fieldName1, value);
            }

            if (arrayToCollection) {
                this._saveOneFormData(collectionName, value);
            } else if (!(fieldName1 && labelName1 && pathToValue1)) {
                this._saveOneFormData(fieldName1, value);
            }
        } catch (error) {
            console.error('Error processing background data:', error);
        }
    }

    setStateFromRestartData(questionnaireName, restartData) {
        this.itsLabelPositionAtUILevel = 'Above';
        this.itsPathToData = this.getPathToData(questionnaireName);
        this.setStateFromStepData(restartData);
        this.itsHistory.setRestartHistory(this.getRestartHistory(questionnaireName));
        this.itsHistory.getPreviousStageData();
    }

    getRestartHistory(decisionServiceName) {
        return window.localStorage.getItem('CorticonRestartHistory_' + decisionServiceName);
    }

    setStateFromStepData(data) {
        this.itsDecisionServiceInput = data;
        this.itsFormData = this.itsDecisionServiceInput[1];
    }

    async processPrevStep(baseDynamicUIEl, decisionServiceEngine, language) {
        if (this.itsFlagAllDone) return;

        const allData = this.itsHistory.getPreviousStageData();
        if (allData === undefined) return;

        const prevStageNbr = allData['stage'];
        this.itsDecisionServiceInput = allData['input'];
        this.itsDecisionServiceInput[0].nextStageNumber = prevStageNbr;
        await this.processNextStep(baseDynamicUIEl, decisionServiceEngine, language, false);

        if (prevStageNbr === 0) {
            raiseEvent(customEvents.BACK_AT_FORM_BEGINNING);
        }
    }

    async processNextStep(baseDynamicUIEl, decisionServiceEngine, language, saveInputToFormData = true) {
        if (saveInputToFormData) {
            const containers = baseDynamicUIEl.find('.inputContainer');
            let isValid = true;
            containers.each(function (index, container) {
                const requiredInputs = $(container).find('.required-input');
                requiredInputs.each(function (index, item) {
                    const inputEl = $(item);
                    if (inputEl.val() === '') {
                        const errorMessage = $('<span class="error-message">This field is required</span>');
                        inputEl.after(errorMessage);
                        isValid = false;
                        return false;
                    }
                });
                if (!isValid) return false;
            });

            if (!isValid) {
                return;
            }
            this._saveEnteredInputsToFormData(baseDynamicUIEl);
        }

        raiseEvent(customEvents.NEW_STEP);

        if (this.itsFlagAllDone) {
            this.clearRestartData(this.itsQuestionnaireName);
            raiseEvent(customEvents.AFTER_DONE);
        } else {
            this._preparePayloadForNextStage(this.itsDecisionServiceInput[0].nextStageNumber);
            const restartData = JSON.stringify(this.itsDecisionServiceInput);
            let nextUI = await this._askDecisionServiceForNextUIElementsAndRender(decisionServiceEngine, this.itsDecisionServiceInput, baseDynamicUIEl);

            while (nextUI.noUiToRenderContinue !== undefined && nextUI.noUiToRenderContinue) {
                this._preparePayloadForNextStage(nextUI.nextStageNumber);
                nextUI = await this._askDecisionServiceForNextUIElementsAndRender(decisionServiceEngine, this.itsDecisionServiceInput, baseDynamicUIEl);
                raiseEvent(customEvents.NEW_FORM_DATA_SAVED, this.itsFormData);
                if (nextUI.done) break;
            }

            this.saveRestartData(this.itsQuestionnaireName, restartData);

            if (nextUI.done) {
                this.itsFlagAllDone = nextUI.done;
                raiseEvent(customEvents.FORM