const Validation = require('.');

let reqObj = {
    name: "Ical survey-2019",
    first_name: "ireshan",
    age: 45,
    address: 'No234Knnimahara',
    obj: '{"name":"kalo"}',
    email: 'ireshandj2@gmail.com',
    barcode: 3454645,//522,
    is_enable: true,
    term: 'yes',
    frequency: 34,
    person: { name: "exress-validation", address: "github", validation: 45 },
    size: 20,
    amount: [5, 4, 3, 1],
    mobile: 724472890,
    birthDate: '1994-02-23',
    nic: 940552850,
    _id: "84155",
    backDate: '1994-02-22'
}
const messages = {
    first_name_required: "First name is required",
    //  is_enable_boolean: "is enable must be true or false",
    name_required: "This porparty is required",
    name_alpha: "Name must be include letters and numbers",
    mobile_digits: "mobile number should contain 9 digitas",
    //   nic_digits: "nic number should contain 10 digitas",
    birthDate_date_equals: "to day is not my birth day",
    barcode_exists: "Invalid user type"
    // _id_unique: "this is not uniue try another one"
}

//------------- mysql --------------------
// validation.initMongoDbConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "dhananjaya_treades"
// });

//------------- mongodb --------------------
// validation.initMongoDbConnection({
//     url: "mongodb+srv://ireshandj2:0724472890@cluster0-2dsaz.mongodb.net/dhananjayatrades",
// });

const validation = new Validation();
validation.initMongoDbConnection({
    url: "mongodb+srv://ireshandj2:0724472890@cluster0-2dsaz.mongodb.net/dhananjayatrades",
});
validation.check(reqObj, {
    first_name: 'required|string|max:8|regExp:[a-zA-Z ]',
    name: 'required|string|max:30|regExp:[a-zA-Z ]|alphaDash',
    age: 'required|integer',
    frequency: 'digitsBetween:34,50',
    address: 'required|string',
    person: 'max:3',
    obj: 'required|json',
    email: 'required|email|includes:@gmail.com,@hotmail.com',
    is_enable: 'boolean',
    term: 'in:yes,no,maybe',
    barcode: 'exists:orders,barcode',
    size: 'lt:40|gt:19',
    amount: 'distinct|gt:3',
    mobile: 'digits:9',
    nic: 'digits:9',
    birthDate: 'dateEquals:1994-02-23',
    backDate: "before:1994-02-23"
}, messages).then(result => {
    console.log(result);
});





