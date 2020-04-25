/**
 * Author: Ireshan M Pathirana 
 * Licence: GNU Public Licence
 * Usage: Node Js 
 */
const Util = require('./util');
const dbFactory = require('./dbFactory');
class Validation {
    /**
     * @param {object} dbConnectionSettings dbConnection settings optional
     * @param {string} dbType mongodb mysql postgresql  optional
     * -----normal usage (without db validation)
     * const validation = new Validation();
     * -----mysql------
     * const validation = new Validation({
     *         host: "host",
     *         user: "data base user",
     *         password: "*****",
     *         database: "data base name" 
     * }, 
     * 'mysql');  // type of dbms 
     * -----mongodb-----
     * const validation = new Validation({
     * url: "mongo db connection url",
     * }, 
     * 'mongodb');  // type of dbms
     */
    constructor(dbConnectionSettings = null, dbType = null) {
        Object.assign(this, dbFactory.InitDbService(dbConnectionSettings, dbType));
        this.bail = false;
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
        let size = 0;
        amount = parseInt(amount);
        if (typeof value == 'object') {
            size = Object.keys(value).length;
        } else if (typeof value === 'number') {
            size = value;
        } else if (typeof value === 'string') {
            size = value.length;
        }
        if (amount > size) {
            let defaultErrorMessage = `Error: Minimum length is ${amount}`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }
    async maxValidation(amount, value, customMessage) {
        let size = 0;
        amount = parseInt(amount);
        if (typeof value == 'object') {
            size = Object.keys(value).length;
        } else if (typeof value === 'number') {
            size = value;
        } else if (typeof value === 'string') {
            size = value.length;
        }
        if (amount < size) {
            let defaultErrorMessage = `Error: Maximum length is ${amount}`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
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

    async notInValidation(setOfTerms, value, customMessage) {
        if (value != undefined) {
            let termsArray = setOfTerms.toLowerCase().split(',')
            if (termsArray.includes(value.toLowerCase())) {
                let defaultErrorMessage = `Error: ${value} is not expect`;
                return this.validationErrorInjector(defaultErrorMessage, customMessage);
            }
        }
        return { status: true };
    }

    async requiredValidation(request, property, customMessage) {
        let defaultErrorMessage = `Error: ${property} is required`;
        let value = request[property];
        if (!Object.keys(request).includes(property) || value == null) {
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        } else if (typeof value == 'string') {
            if (!value.trim().length > 0) {
                return Util.validationErrorInjector(defaultErrorMessage, customMessage);
            }
        } else if (typeof value == 'object') {
            if (!Object.keys(value).length > 0) {
                return Util.validationErrorInjector(defaultErrorMessage, customMessage);
            }
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
    async alphaDashValidation(request, property, customMessage) {
        const regExp = this.validateRegExp('[^A-Za-z0-9-_ ]+');
        if (regExp.test(request[property])) {
            let defaultErrorMessage = "Error: Special characters included";
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async digitsBetweenValidation(amount, value, customMessage) {
        const [from, to] = amount.split(',').map(Number);
        if (from > value || to < value) {
            let defaultErrorMessage = `Error: Number is out of range`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }
    async betweenValidation(amount, value, customMessage) {
        let size = 0;
        const [from, to] = amount.split(',').map(Number);
        if (typeof value == 'object') {
            size = Object.keys(value).length;
        } else if (typeof value === 'number') {
            size = value;
        } else if (typeof value === 'string') {
            size = value.length;
        }
        if (from > size || to < size) {
            let defaultErrorMessage = `Error: data is out of range`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async ltValidation(amount, value, customMessage) {
        let size = 0;
        amount = parseInt(amount);
        if (typeof value == 'object') {
            size = Object.keys(value).length;
        } else if (typeof value === 'number') {
            size = value;
        } else if (typeof value === 'string') {
            size = value.length;
        }
        if (amount <= size) {
            let defaultErrorMessage = `Error: value is not less than`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async lteValidation(amount, value, customMessage) {
        let size = 0;
        amount = parseInt(amount);
        if (typeof value == 'object') {
            size = Object.keys(value).length;
        } else if (typeof value === 'number') {
            size = value;
        } else if (typeof value === 'string') {
            size = value.length;
        }
        if (amount < size) {
            let defaultErrorMessage = `Error: value is not less than or equal`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async gtValidation(amount, value, customMessage) {
        let size = 0;
        amount = parseInt(amount);
        if (typeof value == 'object') {
            size = Object.keys(value).length;
        } else if (typeof value === 'number') {
            size = value;
        } else if (typeof value === 'string') {
            size = value.length;
        }
        if (amount >= size) {
            let defaultErrorMessage = `Error: value is not grater than`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async gteValidation(amount, value, customMessage) {
        let size = 0;
        amount = parseInt(amount);
        if (typeof value == 'object') {
            size = Object.keys(value).length;
        } else if (typeof value === 'number') {
            size = value;
        } else if (typeof value === 'string') {
            size = value.length;
        }
        if (amount > size) {
            let defaultErrorMessage = `Error: value is not grater than or equal`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async sizeValidation(amount, value, customMessage) {
        let size = 0;
        amount = parseInt(amount);
        if (typeof value == 'object') {
            size = Object.keys(value).length;
        } else if (typeof value === 'number') {
            size = value;
        } else if (typeof value === 'string') {
            size = value.length;
        }
        console.log('size', size, 'amount', amount);
        if (amount != size) {
            let defaultErrorMessage = `Error: value is not equal`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async digitsValidation(amount, value, customMessage) {
        amount = parseInt(amount);
        value = value.toString().length;
        console.log('amount', amount, 'length', value);
        if (amount != value) {
            let defaultErrorMessage = `Error: Number does not have ${amount} digits`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async dateEqualsValidation(date, value, customMessage) {
        date = new Date(date);
        value = new Date(value);
        if (date.getTime() != value.getTime()) {
            let defaultErrorMessage = `Error: Date not equal`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async beforeValidation(date, value, customMessage) {
        date = new Date(date);
        value = new Date(value);
        if (date.getTime() <= value.getTime()) {
            let defaultErrorMessage = `Error: Date not before`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async beforeOrEqualValidation(date, value, customMessage) {
        date = new Date(date);
        value = new Date(value);
        if (date.getTime() < value.getTime()) {
            let defaultErrorMessage = `Error: Date not before or equal`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async distinctValidation(request, property, customMessage) {
        const userInput = request[property];
        if (new Set(userInput).size !== userInput.length) {
            let defaultErrorMessage = "Error: Array contains duplicate values";
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }

    async includesValidation(setOfTerms, value, customMessage) {
        if (value != undefined) {
            let isItemIncludes = false;
            let termsArray = setOfTerms.toLowerCase().split(',')
            for (const tearm of termsArray) {
                if (value.toLowerCase().includes(tearm)) {
                    isItemIncludes = true;
                }
            }
            if (!isItemIncludes) {
                let defaultErrorMessage = `Error: ${value} is not expect`;
                return this.validationErrorInjector(defaultErrorMessage, customMessage);
            }
        }
        return { status: true };
    }

    async bailValidation(date, value, customMessage) {
        this.bail = true;
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