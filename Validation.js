const Validation = require('.');

let reqObj = {
    name: "Ical survey-2019",
    first_name: "ireshan",
    age: 45,
    address: 'No234Knnimahara',
    obj: '{"name":"kalo"}',
    email: 'ireshandj2@gmail.com',
    id: 'f1277d16-5cb9-43f6-95ce-a5e22e12cdaa',
    is_enable: true,
    term: 'Yes',
    frequency: 34,
    size: 39,
    amount: [5, 4, 3, 5],
    mobile: 072447289000,
    birthDate: '1994-02-24',
    nic: 94055285000
}
const messages = {
    first_name_required: "First name is required",
    is_enable_boolean: "is enable must be true or false",
    name_required: "This porparty is required",
    name_alpha: "Name must be include letters and numbers",
    mobile_digits: "mobile number should contain 10 digitas",
    //   nic_digits: "nic number should contain 10 digitas",
    birthDate_date_equals: "to day is not my birth day"
    // _id_unique: "this is not uniue try another one"
}

const validation = new Validation();

validation.check(reqObj, {
    first_name: 'required|string|max:30|regExp:[a-zA-Z ]',
    name: 'required|string|max:30|regExp:[a-zA-Z ]|alpha_dash',
    age: 'required|integer',
    frequency: 'digits_between:34,50',
    address: 'required|string',
    obj: 'required|json',
    email: 'required|email',
    id: 'uuid',
    is_enable: 'boolean',
    term: 'in:yes,no,maybe',
    size: 'lt:40',
    amount: 'gt:3',
    mobile: 'digits:10',
    nic: 'digits:10',
    birthDate: 'date_equals:1994-02-23'
    //_id: 'unique:status'
}, messages).then(result => {
    console.log(result);
});





