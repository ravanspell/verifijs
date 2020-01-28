/**
 * Auther: Ireshan M Pathirana
 * Licence: GNU Public Licence
 * Usage: any java script freamwork
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
    /**
     * 
     * @param {*} string string have to validate 
     */
    string(request, property, customMessage) {
        const regExp = this.validateRegExp('[^A-Za-z0-9]+');
        if (regExp.test(request[property])) {
            return { status: false, message: "Error: Invalid string" };
        };
        return { status: true };
    }
    integer(request, property, customMessage) {
        const regExp = this.validateRegExp('[^0-9]');
        if (regExp.test(`${request[property]}`)) {
            return { status: false, message: "Error: Invalid integer" };
        };
        return { status: true };
    }
    min(amount, value, customMessage) {
        let intValue = parseInt(amount);
        if (typeof value === 'string') {
            if (value.length >= intValue) {
                return { status: false, message: customMessage != undefined ? customMessage : `Error: minimum string length is ${intValue}` };
            }
        }
        return { status: true };
    }
    max(amount, value, customMessage) {
        let intValue = parseInt(amount);
        if (typeof value === 'string') {
            if (value.length >= intValue) {
                return { status: false, message: customMessage != undefined ? customMessage : `Error: maximum string length is ${intValue}` };
            };
        }
        return { status: true };
    }
    required(request, property, customMessage) {
        console.log(customMessage);
        if (!Object.keys(request).includes(property) || request[property] == '') {
            return { status: false, message: customMessage != undefined ? customMessage : `Error: ${property} is required` };
        }
        return { status: true };
    }
    json(request, property, customMessage) {
        try {
            JSON.parse(request[property]);
            return { status: true };
        } catch (e) {
            return { status: false, message: customMessage != undefined ? customMessage : "Error: Invalid json string" };
        }
    }
    email(request, property, customMessage) {
        var emailRegex = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
        if (!emailRegex.test(request[property])) {
            return { status: false, message: customMessage != undefined ? customMessage : "Error: Invalid email" };
        };
        return { status: true };
    }
    messageProcessor(messages, property, type) {
        let errorMessageField = Object.keys(messages).filter(messageKey => messageKey == `${property}_${type}` || messageKey == type);
        return messages[errorMessageField];
    }
    validateRegExp(regexp) {
        return new RegExp(regexp);
    }
}
module.exports = Validation;