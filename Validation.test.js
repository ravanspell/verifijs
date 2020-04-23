const validation = require('.');
Validation = new validation()
let reqObj = {
    name: 567,
    id: null,
    first_name: "ireshan",
    age: 45,
    address: '34/st mary street, washington dc',
    obj: '{"name":"kalo"}',
    email: 'ghtjnkl@gmail.com',
    id: 'f1277d16-5cb9-43f6-95ce-a5e22e12cdaa',
    is_enable: true,
    term: 'Yes',
    frequency: 34,
    size: 39,
    amount: [5, 4, 3, 5],
    mobile: 724472890,
    birthDate: '1994-02-23',
    nic: 940552850,
    _id: "84155",
}


let reuireDataSet = {
    name: 567,
    id: [4],
    first_name: "g",
    last_name: { name: "kalow" },
    age: 45,
    address: '34/st mary street, washington dc'
}
it("shoud validate pure string", async () => {

    let res = await Validation.stringValidation(reqObj, "first_name")
    console.log(res);
    if (!res.status)
        throw new Error(`expect true but got ${res.message}`);

});


it("shoud validate require", async () => {
    for (const input in reuireDataSet) {
        let res = await Validation.requiredValidation(reuireDataSet, input)
        console.log(res);
        if (!res.status) {
            throw new Error(`expect true but got ${res.message}`);
        }
    }
});