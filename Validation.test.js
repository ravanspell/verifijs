const validation = require('./Validation');
Validation = new validation({}, {})
it("shoud validate pure string", () => {
    let res = Validation.string('dfgfdgdfg');
    if (res !== undefined)
        throw new Error(`expect true but got ${res}`);
});