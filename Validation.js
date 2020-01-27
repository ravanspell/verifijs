class Validation {
    constructor(request, object) {
        this.request = request;
        this.object = object;
        // this.check(request, object);
    }
    check() {
        let errorArry = [];
        for (const property in this.object) {
            let check = this.object[property].split('|');
            check.forEach(type => {
                if (type.includes(':')) {
                    let [func, amount] = type.split(':');
                    let validationState = this[func](amount, this.request[property]);
                    if (!validationState.status)
                        errorArry.push(validationState.message);
                }
                if (!type.includes(':')) {
                    let validationState = this[type](this.request[property], property);
                    if (!validationState.status)
                        errorArry.push(validationState.message);
                }
            });
        }
        return { validation: errorArry.length > 0 ? false : true, error: errorArry }
    }
    string(string) {
        const regExp = this.validateRegExp('[^A-Za-z0-9]+');
        if (regExp.test(string)) {
            return { status: false, message: "Error: Invalid string" };
        };
        return { status: true };
    }
    integer(integer) {
        const regExp = this.validateRegExp('[^0-9]');
        if (regExp.test(`${integer}`)) {
            return { status: false, message: "Error: Invalid integer" };
        };
        return { status: true };
    }
    min(amount, value) {
        let intValue = parseInt(amount);
        if (typeof value === 'string') {
            if (value.length >= intValue) {
                return { status: false, message: `Error: minimum string length is ${intValue}` };
            }
        }
        return { status: true };
    }
    max(amount, value) {
        let intValue = parseInt(amount);
        if (typeof value === 'string') {
            if (value.length >= intValue) {
                return { status: false, message: `Error: maximum string length is ${intValue}` };
            };
        }
        return { status: true };
    }
    required(value, key) {
        if (!Object.keys(this.request).includes(key) || this.request[key] == '') {
            return { status: false, message: `Error: ${key} is required` };
        }
        return { status: true };
    }
    json(value) {
        try {
            JSON.parse(value);
            return { status: true };
        } catch (e) {
            return { status: false, message: "Error: Invalid json string" };
        }
    }
    email(email) {
        var emailRegex = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
        if (!emailRegex.test(email)) {
            return { status: false, message: "Error: Invalid email" };
        };
        return { status: true };
    }
    validateRegExp(regexp) {
        return new RegExp(regexp);
    }
}
module.exports = Validation;