class Validation {
    constructor(request, object) {
        for (const property in object) {
            let check = object[property].split('|');
            let errors = check.map(type => {
                if (type.includes(':')) {
                    let [func, amount] = type.split(':');
                    return this[func](amount, request[property]);
                }
                if (!type.includes(':')) {
                    return this[type]();
                }
            });
        }
    }
    string(string) {
        const regExp = this.validateRegExp('[^A-Za-z0-9]+');
        if (regExp.test(string)) {
            console.log('string validation failded');
            return false;
        };
        console.log('string validation passed');
        return true;
    }
    integer(integer) {
        const regExp = this.validateRegExp('[^0-9]');
        if (regExp.test(`${integer}`)) {
            console.log('integer validation failded');
            return false;

        };
        console.log('integer validation passed');
        return true;
    }
    min(amount, value) {
        let intValue = parseInt(amount);
        if (typeof value === 'string') {
            if (value.length >= intValue) console.log('minimum');
        }
    }
    max(amount, value) {
        let intValue = parseInt(amount);
        if (typeof value === 'string') {
            if (value.length >= intValue) console.log('maximum length exceeded');
        }
    }
    // email() {
    //     emailValidationRegEx = '^\S+@\S+$';
    // }
    // json() {
    //     try {
    //         var dataObj = JSON.parse(data);
    //         if (dataObj instanceof Object) data = dataObj;
    //     } catch (e) {
    //     }
    // }

    validateRegExp(regexp) {
        return new RegExp(regexp);
    }
}
module.exports = Validation;