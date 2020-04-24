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
    person: { name: "exress-validation", address: "github", validation: 45 },
    size: 39,
    amount: [5, 4, 3, 1],
    mobile: 724472890,
    birthDate: '1994-02-23',
    nic: 940552850,
    _id: "84155",
    backDate: '1994-02-22'
}
const messages = {
    first_name_required: "First name is required",
    is_enable_boolean: "is enable must be true or false",
    name_required: "This porparty is required",
    name_alpha: "Name must be include letters and numbers",
    mobile_digits: "mobile number should contain 9 digitas",
    //   nic_digits: "nic number should contain 10 digitas",
    birthDate_date_equals: "to day is not my birth day"
    // _id_unique: "this is not uniue try another one"
}
//------------- mysql --------------------
// const validation = new Validation({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "dhananjaya_treades"
// }, 'mysql');

//------------- mongodb --------------------
// const validation = new Validation({
//     url: "mongodb+srv://ireshandj2:0724472890@cluster0-2dsaz.mongodb.net/dhananjayatrades",
// }, 'mongodb');
const validation = new Validation();

validation.check(reqObj, {
    first_name: 'required|string|max:8|regExp:[a-zA-Z ]',
    name: 'required|string|max:30|regExp:[a-zA-Z ]|alphaDash',
    age: 'required|integer',
    frequency: 'digitsBetween:34,50',
    address: 'required|string',
    person: 'max:4',
    obj: 'required|json',
    email: 'required|email',
    id: 'uuid',
    is_enable: 'boolean',
    term: 'in:yes,no,maybe',
    size: 'lt:40',
    amount: 'distinct|gt:3',
    mobile: 'digits:9',
    nic: 'digits:9',
    birthDate: 'dateEquals:1994-02-23',
    backDate: "before:1994-02-23"
}, messages).then(result => {
    console.log(result);
});





