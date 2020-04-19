/**
 * Author: Ireshan M Pathirana 
 * Licence: GNU Public Licence
 * Usage: any java script framework 
 */
const Util = require('./util');
const dbFactory = require('./dbFactory');
class Validation {
    /**
     * 
     * @param {string} dbConnection dbConnection optional parameater
     * @param {string} dbType 
     * @param {string} dbName 
     */
    constructor(dbConnection = null, dbType = null) {
        Object.assign(this, dbFactory.InitDbService(dbType, dbConnection));
    }
    async check(request, checkObj, messages = {}) {
        let errorArry = [];
        for (const property in checkObj) {
            let check = checkObj[property].split('|');
            for (let type of check) {
                if (type.includes(':')) {
                    let [func, amount] = type.split(':');
                    let customMessage = this.messageProcessor(messages, property, func);
                    let validationState = await this[`${func}Validation`](amount, request[property], customMessage, property);
                    if (!validationState.status)
                        errorArry.push(validationState.message);
                }
                if (!type.includes(':')) {
                    let customMessage = this.messageProcessor(messages, property, type);
                    let validationState = await this[`${type}Validation`](request, property, customMessage);
                    if (!validationState.status)
                        errorArry.push(validationState.message);
                }
            }
        }
        return { validation: errorArry.length > 0 ? false : true, error: errorArry }
    }

    async stringValidation(request, property, customMessage) {
        if (!(typeof request[property] === 'string')) {
            let defaultErrorMessage = "Error: Invalid string";
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async alphaValidation(request, property, customMessage) {
        const regExp = this.validateRegExp('[^A-Za-z0-9 ]+');
        if (regExp.test(request[property])) {
            let defaultErrorMessage = "Error: Special characters included";
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async integerValidation(request, property, customMessage) {
        const regExp = this.validateRegExp('[^0-9]');
        if (regExp.test(`${request[property]}`)) {
            let defaultErrorMessage = "Error: Invalid integer";
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async minValidation(amount, value, customMessage) {
        let intValue = parseInt(amount);
        if (typeof value === 'string') {
            if (value.length < intValue) {
                let defaultErrorMessage = `Error: Minimum string length is ${intValue}`;
                return Util.validationErrorInjector(defaultErrorMessage, customMessage);
            }
        }
        return { status: true };
    }
    async maxValidation(amount, value, customMessage) {
        console.log(`amount is ${amount} value is ${value}`);
        let intValue = parseInt(amount);
        if (typeof value === 'string') {
            if (value.length >= intValue) {
                let defaultErrorMessage = `Error: Maximum string length is ${intValue}`;
                return Util.validationErrorInjector(defaultErrorMessage, customMessage);
            };
        }
        return { status: true };
    }
    async inValidation(setOfTerms, value, customMessage) {
        if (value != undefined) {
            let termsArray = setOfTerms.toLowerCase().split(',')
            if (!termsArray.includes(value.toLowerCase())) {
                let defaultErrorMessage = `Error: ${value} is not expect`;
                return this.validationErrorInjector(defaultErrorMessage, customMessage);
            }
        }
        return { status: true };
    }

    async requiredValidation(request, property, customMessage) {
        if (!Object.keys(request).includes(property) || request[property] == '') {
            let defaultErrorMessage = `Error: ${property} is required`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }
    async jsonValidation(request, property, customMessage) {
        try {
            let jsontext = JSON.stringify(request[property]);
            JSON.parse(jsontext);
            return { status: true };
        } catch (e) {
            let defaultErrorMessage = "Error: Invalid json string";
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
    }
    async emailValidation(request, property, customMessage) {
        var emailRegex = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
        if (!emailRegex.test(request[property])) {
            let defaultErrorMessage = "Error: Invalid email";
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async uuidValidation(request, property, customMessage) {
        const uuidRegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        if (!uuidRegExp.test(request[property])) {
            let defaultErrorMessage = "Error: Invalid uuid";
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async booleanValidation(request, property, customMessage) {
        let validationValue = request[property];
        console.log('is enable value is', !validationValue == true);
        if (!(validationValue === 1 || validationValue === 0 || validationValue === true || validationValue === false)) {
            let defaultErrorMessage = "Error: Invalid boolean value";
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async regExpValidation(regExpression, value, customMessage) {
        const regExp = this.validateRegExp(regExpression);
        if (!regExp.test(value)) {
            let defaultErrorMessage = "Error: Invalid input";
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    //Process custom error messages which user defined
    messageProcessor(messages, property, type) {
        let errorMessageField = Object.keys(messages).filter(messageKey => messageKey == `${property}_${type}` || messageKey == type);
        return messages[errorMessageField];
    }
    //Returns regular expression object for given reg exp string
    validateRegExp(regexp) {
        return new RegExp(regexp);
    }
}
module.exports = Validation;