class Validation {
    constructor(request, object) {
        this.request = request;
        this.object = object;
        // this.check(request, object);
    }
    check() {
        for (const property in this.object) {
            let check = this.object[property].split('|');
            let errors = check.map(type => {
                if (type.includes(':')) {
                    let [func, amount] = type.split(':');
                    return this[func](amount, this.request[property]);
                }
                if (!type.includes(':')) {
                    return this[type](this.request[property], property);
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
    }
    integer(integer) {
        const regExp = this.validateRegExp('[^0-9]');
        if (regExp.test(`${integer}`)) {
            console.log('integer validation failded');
            return false;

        };
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
    required(value, key) {
        if (!Object.keys(this.request).includes(key) || this.request[key] == '')
            console.log(`${key} required`);
    }
    json(value) {
        try {
            JSON.parse(value);
        } catch (e) {
            console.log(e.message);
        }
    }
    email(email) {
        var emailRegex = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
        if (!emailRegex.test(email)) {
            console.log('email validation failded');
            return false;
        };
    }
    validateRegExp(regexp) {
        return new RegExp(regexp);
    }
}
module.exports = Validation;