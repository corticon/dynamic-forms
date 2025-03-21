import { History } from './history.js';
import UIControlsRenderer from './uiControlsRenderers.js';
import { customEvents, raiseEvent } from './customEvents.js';
import JSONPath from 'jsonpath';

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
    } async processNextStep(baseDynamicUIEl, decisionServiceEngine, language, saveInputToFormData = true) {
        if (saveInputToFormData) {
            const containers = baseDynamicUIEl.find('.inputContainer');
            let isValid = true;
            containers.each(function (index, container) {
                const requiredInputs = $(container).find('.required-input');
                requiredInputs.each(function (index, item) {
                    const inputEl = $(item);
                    if (inputEl.val() === '') {
                        const errorMessage = $('<span class class="error-message">This field is required</span>');
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
                raiseEvent(customEvents.FORM_DONE);
            }
        }
    }

    clearRestartData(decisionServiceName) {
        window.localStorage.removeItem('CorticonRestartPayload_' + decisionServiceName);
        window.localStorage.removeItem('CorticonRestartPathToData_' + decisionServiceName);
        window.localStorage.removeItem('CorticonRestartHistory_' + decisionServiceName);
    }

    saveRestartData(decisionServiceName, payload) {
        try {
            window.localStorage.setItem('CorticonRestartPayload_' + decisionServiceName, payload);
            window.localStorage.setItem('CorticonRestartPathToData_' + decisionServiceName, this.itsPathToData);
            window.localStorage.setItem('CorticonRestartHistory_' + decisionServiceName, this.itsHistory.getRestartHistory());
        } catch (e) {
        }
    }

    getRestartData(decisionServiceName) {
        const payload = window.localStorage.getItem('CorticonRestartPayload_' + decisionServiceName);
        if (payload !== null)
            return JSON.parse(payload);
        else
            return null;
    }

    getPathToData(decisionServiceName) {
        return window.localStorage.getItem('CorticonRestartPathToData_' + decisionServiceName);
    }

    _resetDecisionServiceInput(language) {
        this._preparePayloadForNextStage(0, language);

        for (const property in this.itsDecisionServiceInput[1])
            delete this.itsDecisionServiceInput[1][property];
    }

    _preparePayloadForNextStage(nextStage, language) {
        const nextPayload = {};
        const stateProperties = ['stageOnExit', 'language', 'labelPosition', 'pathToData'];
        for (let i = 0; i < stateProperties.length; i++) {
            const prop = stateProperties[i];
            if (this.itsDecisionServiceInput[0][prop] !== undefined)
                nextPayload[prop] = this.itsDecisionServiceInput[0][prop];
        }

        nextPayload.currentStageNumber = nextStage;

        if (language !== undefined) {
            nextPayload['language'] = language;
        }

        this.itsDecisionServiceInput[0] = nextPayload;
    }

    _processLabelPositionSetting(newLabelPosition) {
        if (newLabelPosition !== undefined && newLabelPosition !== null)
            this.itsLabelPositionAtUILevel = newLabelPosition;
    }

    async _askDecisionServiceForNextUIElementsAndRender(decisionServiceEngine, payload, baseEl) {
        const result = await this._runDecisionService(decisionServiceEngine, payload);
        if (result.corticon.status !== 'success')
            return;

        const nextUI = result.payload[0];

        if (nextUI.pathToData !== undefined && nextUI.pathToData !== null && nextUI.pathToData.length !== 0)
            this.itsPathToData = nextUI.pathToData;

        this._processLabelPositionSetting(nextUI.labelPosition);

        this.itsFormData = this.itsDecisionServiceInput[1];

        const backgroundDataArray = nextUI.backgroundData;
        if (backgroundDataArray) {
            for (const backgroundData of backgroundDataArray) {
                await this._processBackgroundData(backgroundData);
            }
        }

        if (nextUI.noUiToRenderContinue !== undefined && nextUI.noUiToRenderContinue)
            return nextUI;

        const containers = nextUI.containers;
        if (containers === undefined) {
            alert('Error: missing container');
            return nextUI;
        }

        this.itsUIControlsRenderer.renderUI(containers, baseEl, this.itsLabelPositionAtUILevel, nextUI.language, this.itsFlagRenderWithKui);

        const event = { "input": payload, "stage": payload[0].currentStageNumber };
        raiseEvent(customEvents.AFTER_UI_STEP_RENDERED, event);

        return nextUI;
    }

    _saveOneFormData(formDataFieldName, val) {
        if (val === undefined)
            return;

        if (this.itsPathToData === undefined || this.itsPathToData === null)
            this.itsFormData[formDataFieldName] = val;
        else {
            if (this.itsFormData[this.itsPathToData] === undefined)
                this.itsFormData[this.itsPathToData] = {};

            this.itsFormData[this.itsPathToData][formDataFieldName] = val;
        }
    }

    _saveNonArrayInputsToFormData(baseEl) {
        let allFormEls = baseEl.find('.nonarrayTypeControl :input').not(':checkbox').not('.markerFileUploadExpense');
        allFormEls.each(function (index, item) {
            const oneInputEl = $(item);
            const formDataFieldName = oneInputEl.data("fieldName");
            const val = oneInputEl.val();
            const type = oneInputEl.data("type");
            if (type !== undefined && type !== null && type === "decimal") {
                const converted = Number(val);
                if (isNaN(converted))
                    alert("you didn't enter a number in the field");
                else
                    this._saveOneFormData(formDataFieldName, converted);
            }
            else if (type !== undefined && type !== null && type === "datetimetag" || type === "datetag") {
                if (val !== undefined && val !== null && val !== "") {
                    const theDate = new Date(val);
                    let theDateISOString;
                    let theDateAsMsSinceEpoch;
                    if (type === "datetag") {
                        const tzOffsetMns = theDate.getTimezoneOffset();
                        const utcMs = theDate.getTime() + tzOffsetMns * 60 * 1000;
                        const utcDate = new Date(utcMs);
                        theDateISOString = utcDate.toISOString();
                        theDateAsMsSinceEpoch = utcDate.getTime();
                    }
                    else {
                        theDateISOString = theDate.toISOString();
                        theDateAsMsSinceEpoch = theDate.getTime();
                    }
                    this._saveOneFormData(formDataFieldName, theDateISOString);
                }
            }
            else {
                if (val !== undefined && val !== null && val !== "")
                    this._saveOneFormData(formDataFieldName, val);
            }
        }.bind(this));

        allFormEls = baseEl.find('.nonarrayTypeControl :checkbox');
        allFormEls.each(function (index, item) {
            const oneInputEl = $(item);
            const formDataFieldName = oneInputEl.data("fieldName");
            const val = oneInputEl.is(':checked');
            this._saveOneFormData(formDataFieldName, val);
        }.bind(this));

        this._saveFileUploadExpenses(baseEl);
    }

    _saveFileUploadExpenses(baseEl) {
        let allFormEls = baseEl.find('.nonarrayTypeControl .markerFileUploadExpense');

        allFormEls.each(function (index, item) {
            const oneInputEl = $(item);
            const formDataFieldName = oneInputEl.data("fieldName");
            const id = oneInputEl.attr('id')
            const val = oneInputEl.val();
            this._saveOneFileUploadExpenseData(formDataFieldName, val, id);
        }.bind(this));

    }

    _saveOneFileUploadExpenseData(formDataFieldName, val, id) {
        if (val === undefined)
            return;

        let theExpenses;
        if (this.itsPathToData === undefined || this.itsPathToData === null)
            theExpenses = this.itsFormData[formDataFieldName];
        else {
            if (this.itsFormData[this.itsPathToData] === undefined) {
                alert('Error: There should already be form data');
                return;
            }
            else
                theExpenses = this.itsFormData[this.itsPathToData][formDataFieldName];
        }

        for (let i = 0; i < theExpenses.length; i++) {
            const oneExpense = theExpenses[i];
            if (oneExpense.id === id)
                oneExpense['fileUpload'] = val;
        }
    }

    _saveArrayTypeInputsToFormData(baseEl) {
        this._processAllSimpleArrayControls(baseEl);
        this._processAllComplexArrayControls(baseEl, this.itsPathToData);
    } _processAllComplexArrayControls(baseEl, itsPathToData) {
        let outerArray = [];
        let formDataFieldName;
        let uiControlType;

        let allArrayEls = baseEl.find(".complexArrayTypeControl");

        if (allArrayEls.length === 0) {
            return;
        }

        allArrayEls.each(function (index, item) {
            const oneArrayEl = $(item);
            uiControlType = $(this).parent().data("uicontroltype");
            let allFormEls = oneArrayEl.find(":input").not(":checkbox");

            let innerArray = [];
            for (var i = 0; i < allFormEls.length; i++) {
                const oneFormEl = allFormEls[i];
                const oneInputEl = $(oneFormEl);
                formDataFieldName = oneInputEl.data("fieldName");
                const val = oneInputEl.val();
                innerArray.push(val);
            }

            outerArray.push(innerArray);
        });

        if (outerArray.length !== 0) {
            if (uiControlType === "MultiExpenses") {
                const expenseFieldArray = ["expenseCode", "amount", "currency"];
                const convertedArray = this._createEachExpenseEntity(outerArray, expenseFieldArray);
                this._saveArrayElFormData(formDataFieldName, convertedArray, itsPathToData);
            } else if (uiControlType === "MultiText") {
                const textFieldArray = ["textInput"];
                const convertedArray = this._createEachTextEntity(outerArray, textFieldArray);
                this._saveArrayElFormData(formDataFieldName, convertedArray, itsPathToData);
            } else {
                alert("This complex array type is not yet supported " + uiControlType);
            }
        }


        function _processAllSimpleArrayControls(baseEl) {
            const allSimpleUiControlsOfArrayType = _getAllSimpleArrayTypeInputsToFormData(baseEl);

            for (let j = 0; j < allSimpleUiControlsOfArrayType.length; j++) {
                const oneControlData = allSimpleUiControlsOfArrayType[j];
                const uiControlType = oneControlData['type'];
                const formDataFieldName = oneControlData['fieldName'];
                const valuesForOneControl = oneControlData['values'];
                if (uiControlType === 'Text' || uiControlType === 'Number' || uiControlType === 'DateTime') {
                    const convertedArray = _createEachItemEntity(valuesForOneControl, uiControlType);
                    _saveArrayElFormData(formDataFieldName, convertedArray);
                } else
                    alert('This simple array type is not yet supported ' + uiControlType);
            }
        }

        function _getAllSimpleArrayTypeInputsToFormData(baseEl) {
            // there can be more than one set of multi inputs per container -> we need to group them per field name
            let allUiControlsOfArrayType = [];

            let allArrayEls = baseEl.find('.simpleArrayTypeControl');
            allArrayEls.each(function (index, item) {
                let formDataFieldName;
                const oneArrayEl = $(item);
                const uiControlType = oneArrayEl.data("uicontroltype");
                const allFormEls = oneArrayEl.find(':input').not(':checkbox');

                let allValuesForOneControl = [];
                for (let i = 0; i < allFormEls.length; i++) {
                    const oneFormEl = allFormEls[i];
                    const oneInputEl = $(oneFormEl);
                    formDataFieldName = oneInputEl.data("fieldName");
                    const val = oneInputEl.val();
                    allValuesForOneControl.push(val);
                }

                const allDataForOneControl = {};
                allDataForOneControl['fieldName'] = formDataFieldName;
                allDataForOneControl['type'] = uiControlType;
                allDataForOneControl['values'] = allValuesForOneControl;

                allUiControlsOfArrayType.push(allDataForOneControl);
            });

            return allUiControlsOfArrayType;
        }

        function _createEachItemEntity(valuesForOneControl, uiControlType) {
            const convertedArray = [];
            let fieldName;
            if (uiControlType === 'Text')
                fieldName = 'itemText';
            else if (uiControlType === 'Number')
                fieldName = 'itemNumber';
            else if (uiControlType === 'DateTime')
                fieldName = 'itemDateTime';
            else {
                alert('This uicontrol type for simple array type is not yet supported ' + uiControlType);
                return convertedArray;
            }

            for (let i = 0; i < valuesForOneControl.length; i++) {
                const val = valuesForOneControl[i];
                if (val !== undefined && val !== null && val !== "") {
                    const oneItemAsObjLit = {};
                    oneItemAsObjLit[fieldName] = val;
                    convertedArray.push(oneItemAsObjLit);
                }
            }
            return convertedArray;
        }

        function _createEachExpenseEntity(outerArray, expenseFieldArray) {
            const convertedArray = [];
            for (let i = 0; i < outerArray.length; i++) {
                const oneItemAsAnArray = outerArray[i];
                const oneItemAsObjLit = {};
                for (let j = 0; j < oneItemAsAnArray.length; j++) {
                    oneItemAsObjLit[expenseFieldArray[j]] = oneItemAsAnArray[j];
                }
                const converted = Number(oneItemAsObjLit['amount']);
                if ($.isNumeric(converted))
                    oneItemAsObjLit['amount'] = converted;
                else
                    oneItemAsObjLit['amount'] = 0;

                oneItemAsObjLit['id'] = '' + i;  // add a unique id that can be used in other steps where we need to add data to an expense item (like a file upload doc)

                convertedArray.push(oneItemAsObjLit);
            }
            return convertedArray;
        }

        function _saveArrayElFormData(formDataFieldName, outerArray) {
            if (outerArray === undefined)
                return;

            if (itsPathToData === undefined || itsPathToData === null)
                itsFormData[formDataFieldName] = outerArray;
            else {
                if (itsFormData[itsPathToData] === undefined)
                    itsFormData[itsPathToData] = {};

                itsFormData[itsPathToData][formDataFieldName] = outerArray;
            }
        }

        async function _runDecisionService(decisionServiceEngine, payload) {
            try {
                const event = { "input": payload, "stage": payload[0].currentStageNumber };
                corticon.dynForm.raiseEvent(corticon.dynForm.customEvents.BEFORE_DS_EXECUTION, event);

                const configuration = { logLevel: 0 };
                // const configuration = { logLevel: 1 };
                const t1 = performance.now();
                // console.log("** About to call decision service");
                const result = await decisionServiceEngine.execute(payload, configuration);
                // console.log("** Done with call decision service");
                const t2 = performance.now();
                const event2 = {
                    "output": result,
                    "execTimeMs": t2 - t1,
                    "stage": payload[0].currentStageNumber
                };

                if (result.corticon !== undefined) {
                    if (result.corticon.status === 'success') {
                        const newStepUI = result.payload[0];
                        if (newStepUI.currentStageDescription !== undefined && newStepUI.currentStageDescription !== null)
                            event2["stageDescription"] = newStepUI.currentStageDescription;
                    }
                    else
                        alert('There was an error executing the rules.\n' + JSON.stringify(result, null, 2));

                    corticon.dynForm.raiseEvent(corticon.dynForm.customEvents.NEW_DS_EXECUTION, event2);
                    return result;
                }
                else
                    alert('There was an error executing the rules.\n' + JSON.stringify(result, null, 2));
            }
            catch (e) {
                alert('There was an exception executing the rules ' + e);
            }
        }

        // Public interface
        return {
            startDynUI: startDynUI,
            processNextStep: processNextStep,
            processPrevStep: processPrevStep
        }
        function _saveEnteredInputsToFormData(baseEl) {
            _saveNonArrayInputsToFormData(baseEl);
            _saveArrayTypeInputsToFormData(baseEl);
            corticon.dynForm.raiseEvent(corticon.dynForm.customEvents.NEW_FORM_DATA_SAVED, itsFormData);

            // Handle 'MultiText' controls
            let multiTextEls = baseEl.find('.multiTextInputContainer');

            multiTextEls.each(function (index, item) {
                const oneArrayEl = $(item);
                let allFormEls = oneArrayEl.find(':input').not(':checkbox');
                let formDataFieldName;
                let outerArray = [];
                let innerArray = [];
                for (let i = 0; i < allFormEls.length; i++) {
                    const oneFormEl = allFormEls[i];
                    const oneInputEl = $(oneFormEl);
                    formDataFieldName = oneInputEl.data("fieldName");
                    const val = oneInputEl.val();
                    innerArray.push(val);
                }
                outerArray.push(innerArray);

                if (outerArray.length !== 0) {
                    let uiControlType = $(this).find('input').data("uicontroltype"); if (uiControlType === 'MultiText') {
                        const textFieldArray = ['textInput'];
                        const convertedArray = _createEachTextEntity(outerArray, textFieldArray);
                        _saveArrayElFormData(formDataFieldName, convertedArray, itsPathToData); // Pass itsPathToData
                    }
                    //  else
                    //        alert('This complex array type is not yet supported ' + uiControlType);
                }
            });

        }

    }
}