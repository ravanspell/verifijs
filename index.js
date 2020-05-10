/**
 * Author: Ireshan M Pathirana 
 * Licence: GNU Public Licence
 * Usage: Node.js
 */
const Util = require('./util');
const MySql = require('./database/mysql');
const MongoDb = require('./database/mongodb');
class Validation {
    constructor() {
        this.bail = false;
    }
    async check(request, checkObj, messages = {}) {
        try {
            let errorArry = [];
            for (const property in checkObj) {
                this.bail = false;
                let check = checkObj[property].split('|');
                for (let type of check) {
                    if (type.includes(':')) {
                        let [func, amount] = type.split(':');
                        let customMessage = this.messageProcessor(messages, property, func);
                        //check validation rule        
                        this.validateValidationRules(func);
                        let validationState = await this[`${func}Validation`](amount, request, customMessage, property);
                        if (!validationState.status) {
                            errorArry.push(validationState.message);
                            // stop validation further if validation is failed.
                            if (this.bail) break;
                        }
                    }
                    if (!type.includes(':')) {
                        let customMessage = this.messageProcessor(messages, property, type);
                        //check validation rule        
                        this.validateValidationRules(type);
                        let validationState = await this[`${type}Validation`](request, property, customMessage);
                        if (!validationState.status) {
                            errorArry.push(validationState.message);
                            // stop validation further if validation is failed.
                            if (this.bail) break;
                        }
                    }
                }
            }
            return { validation: errorArry.length > 0 ? false : true, error: errorArry }
        } catch (error) {
            return { error: error.message };
        }
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
    async minValidation(amount, request, customMessage, property) {
        let size = 0;
        //get user input value from the request
        let value = request[property];
        amount = parseInt(amount);
        if (typeof value == 'object') {
            size = Object.keys(value).length;
        } else if (typeof value === 'number') {
            size = value;
        } else if (typeof value === 'string') {
            size = value.length;
        }
        if (amount > size) {
            let defaultErrorMessage = `Error: ${property} minimum length should be ${amount}`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }
    async maxValidation(amount, request, customMessage, property) {
        let size = 0;
        //get user input value from the request
        let value = request[property];
        amount = parseInt(amount);
        if (typeof value == 'object') {
            size = Object.keys(value).length;
        } else if (typeof value === 'number') {
            size = value;
        } else if (typeof value === 'string') {
            size = value.length;
        }
        if (amount < size) {
            let defaultErrorMessage = `Error: ${property} maximum length should be ${amount}`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }
    async inValidation(setOfTerms, request, customMessage, property) {
        //get user input value from the request
        let value = request[property];
        if (value != undefined) {
            let termsArray = setOfTerms.toLowerCase().split(',')
            if (!termsArray.includes(value.toLowerCase())) {
                let defaultErrorMessage = `Error: ${value} is not expect in ${property}`;
                return Util.validationErrorInjector(defaultErrorMessage, customMessage);
            }
        }
        return { status: true };
    }

    async notInValidation(setOfTerms, request, customMessage, property) {
        //get user input value from the request
        let value = request[property];
        if (value != undefined) {
            let termsArray = setOfTerms.toLowerCase().split(',')
            if (termsArray.includes(value.toLowerCase())) {
                let defaultErrorMessage = `Error: ${value} is not expect`;
                return Util.validationErrorInjector(defaultErrorMessage, customMessage);
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
            let defaultErrorMessage = `Error: ${property} has invalid boolean value`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async regExpValidation(regExpression, request, customMessage, property) {
        //get user input value from the request
        let value = request[property];
        const regExp = this.validateRegExp(regExpression);
        if (!regExp.test(value)) {
            let defaultErrorMessage = `Error: ${property} has invalid input`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async alphaDashValidation(request, property, customMessage) {
        const regExp = this.validateRegExp('[^A-Za-z0-9-_ ]+');
        if (regExp.test(request[property])) {
            let defaultErrorMessage = `Error: ${property} has special characters`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }
    async digitsBetweenValidation(amount, request, customMessage, property) {
        //get user input value from the request
        const value = request[property];
        const [from, to] = amount.split(',').map(Number);
        if (from > value || to < value) {
            let defaultErrorMessage = `Error: ${property} Number is out of range`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }
    async betweenValidation(amount, request, customMessage, property) {
        //get user input value from the request
        const value = request[property];
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
            let defaultErrorMessage = `Error: ${property} data is out of range`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async ltValidation(amount, request, customMessage, property) {
        //get user input value from the request
        const value = request[property];
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
            let defaultErrorMessage = `Error: ${property} value is not less than ${amount}`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async lteValidation(amount, request, customMessage, property) {
        //get user input value from the request
        const value = request[property];
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
            let defaultErrorMessage = `Error: ${property} value is not less than or equal to ${amount}`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async gtValidation(amount, request, customMessage, property) {
        //get user input value from the request
        const value = request[property];
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
            let defaultErrorMessage = `Error: ${property} value is not grater than to ${amount}`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async gteValidation(amount, request, customMessage, property) {
        //get user input value from the request
        let value = request[property];
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
            let defaultErrorMessage = `Error: ${property} value is not grater than or equal to ${amount}`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async sizeValidation(amount, request, customMessage, property) {
        //get user input value from the request
        let value = request[property];
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
            let defaultErrorMessage = `Error: ${property} value is not equal to ${value}`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async digitsValidation(amount, request, customMessage, property) {
        //get user input value from the request
        console.log(request)
        let value = request[property];
        amount = parseInt(amount);
        value = value.toString().length;
        console.log('amount', amount, 'length', value);
        if (amount != value) {
            let defaultErrorMessage = `Error: ${property} number does not have ${amount} digits`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async dateEqualsValidation(date, request, customMessage, property) {
        date = new Date(date);
        //get user input value from the request
        let value = new Date(request[property]);
        if (date.getTime() != value.getTime()) {
            let defaultErrorMessage = `Error: ${property} date not equal`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async beforeValidation(date, request, customMessage, property) {
        date = new Date(date);
        //get user input value from the request
        let value = new Date(request[property]);
        if (date.getTime() <= value.getTime()) {
            let defaultErrorMessage = `Error: ${property} date not before`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async beforeOrEqualValidation(date, request, customMessage, property) {
        date = new Date(date);
        //get user input value from the request
        let value = new Date(request[property]);
        if (date.getTime() < value.getTime()) {
            let defaultErrorMessage = `Error: ${property} date not before or equal`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        }
        return { status: true };
    }

    async distinctValidation(request, property, customMessage) {
        const userInput = request[property];
        if (new Set(userInput).size !== userInput.length) {
            let defaultErrorMessage = `Error: ${property} array contains duplicate values`;
            return Util.validationErrorInjector(defaultErrorMessage, customMessage);
        };
        return { status: true };
    }

    async includesValidation(setOfTerms, request, customMessage, property) {
        //get user input value from the request
        let value = request[property];
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
                return Util.validationErrorInjector(defaultErrorMessage, customMessage);
            }
        }
        return { status: true };
    }

    /**
     * function isLatitude(lat) {
        return isFinite(lat) && Math.abs(lat) <= 90;
        }

        function isLongitude(lng) {
        return isFinite(lng) && Math.abs(lng) <= 180;
        }
     *  
     * 
     */

    async bailValidation(date, value, customMessage) {
        this.bail = true;
        return { status: true };
    }

    validateValidationRules(rule) {
        const check = this.__proto__.hasOwnProperty(`${rule}Validation`);
        const check2 = this.hasOwnProperty(`${rule}Validation`);
        if (!(check || check2)) throw { message: `${rule} is an invalid validation rule` };
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

    // database validations
    /**
     * @param {Object} dbConnectionSettings mysql dbConnection settings 
     * {
     *   host: "host",
     *   user: "data base user",
     *   password: "*****",
     *   database: "data base name" 
     * }
     */
    initMysqlConnection(dbConnectionSettings = null) {
        try {
            if (dbConnectionSettings == null)
                throw { message: 'Mysql database connection settings not found' };
            const mysqlstuff = new MySql(dbConnectionSettings);
            //this.prototype = mysqlstuff;
            Object.assign(this, mysqlstuff);
        } catch (error) {
            console.log(error.message);
        }
    }
    /**
     * @param {Object} dbConnectionSettings mongodb dbConnection settings 
     * {
     * url: "*********"
     * }  
     */
    initMongoDbConnection(dbConnectionSettings = null) {
        try {
            if (dbConnectionSettings == null)
                throw { message: 'Mongodb database connection settings not found' };
            const mongoDbStuff = new MongoDb(dbConnectionSettings);
            Object.assign(this, mongoDbStuff);
        } catch (error) {
            console.log(error.message);
        }
    }
}
module.exports = Validation;