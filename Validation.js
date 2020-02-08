/**
 * Author: Ireshan M Pathirana 
 * Licence: GNU Public Licence
 * Usage: any java script framework 
 */
const dbFactory = require('./dbFactory');
class Validation {
    constructor(dbConnection = null, dbType = null, dbName = null) {
        Object.assign(this, dbFactory.InitDbService(dbType, dbConnection, dbName));
    }
    async check(request, checkObj, messages = {}) {
        let errorArry = [];
        for (const property in checkObj) {
            let check = checkObj[property].split('|');
            for (let type of check) {
                if (type.includes(':')) {
                    let [func, amount] = type.split(':');
                    let customMessage = this.messageProcessor(messages, property, func);
                    let validationState = await this[`${func}Validation`](amount, request[property], customMessage);
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
        console.log(`${!(typeof request[property] === "string")} ${request[property]}`);
        if (!(typeof request[property] === 'string')) {
            let defaultErrorMessage = "Error: Invalid string";
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async alphaValidation(request, property, customMessage) {
        const regExp = this.validateRegExp('[^A-Za-z0-9 ]+');
        if (regExp.test(request[property])) {
            let defaultErrorMessage = "Error: Special characters included";
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async integerValidation(request, property, customMessage) {
        const regExp = this.validateRegExp('[^0-9]');
        if (regExp.test(`${request[property]}`)) {
            let defaultErrorMessage = "Error: Invalid integer";
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async minValidation(amount, value, customMessage) {
        let intValue = parseInt(amount);
        if (typeof value === 'string') {
            if (value.length >= intValue) {
                let defaultErrorMessage = `Error: Minimum string length is ${intValue}`;
                return this.validationErrorInjector(defaultErrorMessage, customMessage);
            }
        }
        return { status: true };
    }
    async maxValidation(amount, value, customMessage) {
        let intValue = parseInt(amount);
        if (typeof value === 'string') {
            if (value.length >= intValue) {
                let defaultErrorMessage = `Error: Maximum string length is ${intValue}`;
                return this.validationErrorInjector(defaultErrorMessage, customMessage);
            };
        }
        return { status: true };
    }
    async requiredValidation(request, property, customMessage) {
        if (!Object.keys(request).includes(property) || request[property] == '') {
            let defaultErrorMessage = `Error: ${property} is required`;
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }
    async jsonValidation(request, property, customMessage) {
        try {
            JSON.parse(request[property]);
            return { status: true };
        } catch (e) {
            let defaultErrorMessage = "Error: Invalid json string";
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        }
    }
    async emailValidation(request, property, customMessage) {
        var emailRegex = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
        if (!emailRegex.test(request[property])) {
            let defaultErrorMessage = "Error: Invalid email";
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async uuidValidation(request, property, customMessage) {
        const uuidRegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        if (!uuidRegExp.test(request[property])) {
            let defaultErrorMessage = "Error: Invalid uuid";
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async regExpValidation(regExpression, value, customMessage) {
        const regExp = this.validateRegExp(regExpression);
        if (!regExp.test(value)) {
            let defaultErrorMessage = "Error: Invalid input";
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
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
    //Inject the error message whether it is custom message or default error message
    validationErrorInjector(defaultErrorMessage, customMessage = undefined) {
        return {
            status: false,
            message: customMessage != undefined ? customMessage : defaultErrorMessage
        };
    }
}
module.exports = Validation;