class Util {
    //Inject the error message whether it is custom message or default error message
    static validationErrorInjector(defaultErrorMessage, customMessage = undefined) {
        return {
            status: false,
            message: customMessage != undefined ? customMessage : defaultErrorMessage
        };
    }
}
module.exports = Util;