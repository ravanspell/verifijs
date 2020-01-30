/**
 * Author: Ireshan M Pathirana 
 * Licence: GNU Public Licence
 * Usage: any java script framework 
 */
class Validation {

    check(request, checkObj, messages = {}) {
        let errorArry = [];
        for (const property in checkObj) {
            let check = checkObj[property].split('|');
            check.forEach(type => {
                if (type.includes(':')) {
                    let [func, amount] = type.split(':');
                    let customMessage = this.messageProcessor(messages, property, func);
                    let validationState = this[func](amount, request[property], customMessage);
                    if (!validationState.status)
                        errorArry.push(validationState.message);
                }
                if (!type.includes(':')) {
                    let customMessage = this.messageProcessor(messages, property, type);
                    let validationState = this[type](request, property, customMessage);
                    if (!validationState.status)
                        errorArry.push(validationState.message);
                }
            });
        }
        return { validation: errorArry.length > 0 ? false : true, error: errorArry }
    }
    string(request, property, customMessage) {
        const regExp = this.validateRegExp('[^A-Za-z0-9]+');
        if (regExp.test(request[property])) {
            let defaultErrorMessage = "Error: Invalid string";
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    integer(request, property, customMessage) {
        const regExp = this.validateRegExp('[^0-9]');
        if (regExp.test(`${request[property]}`)) {
            let defaultErrorMessage = "Error: Invalid integer";
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    min(amount, value, customMessage) {
        let intValue = parseInt(amount);
        if (typeof value === 'string') {
            if (value.length >= intValue) {
                let defaultErrorMessage = `Error: minimum string length is ${intValue}`;
                return this.validationErrorInjector(defaultErrorMessage, customMessage);
            }
        }
        return { status: true };
    }
    max(amount, value, customMessage) {
        let intValue = parseInt(amount);
        if (typeof value === 'string') {
            if (value.length >= intValue) {
                let defaultErrorMessage = `Error: maximum string length is ${intValue}`;
                return this.validationErrorInjector(defaultErrorMessage, customMessage);
            };
        }
        return { status: true };
    }
    required(request, property, customMessage) {
        if (!Object.keys(request).includes(property) || request[property] == '') {
            let defaultErrorMessage = `Error: ${property} is required`;
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }
    json(request, property, customMessage) {
        try {
            JSON.parse(request[property]);
            return { status: true };
        } catch (e) {
            let defaultErrorMessage = "Error: Invalid json string";
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        }
    }
    email(request, property, customMessage) {
        var emailRegex = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
        if (!emailRegex.test(request[property])) {
            let defaultErrorMessage = "Error: Invalid email";
            return this.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    uuid(request, property, customMessage) {
        const uuidRegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        if (!uuidRegExp.test(request[property])) {
            let defaultErrorMessage = "Error: Invalid uuid";
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