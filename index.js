const Validation = require('./Validation');

let reqObj = {
    name: "Ical survey 2019@#$",
    age: 56,
    address: 'No234Knnimahara',
    obj: '{"name":"kalo"}',
    email: 'ireshandj2@gmail.com',
    id: 'f1277d16-5cb9-43f6-95ce-a5e22e12cdaa',
    is_enable: true,
    term: 'Yes'
}
const messages = {
    first_name_required: "First name is required",
    is_enable_boolean: "is enable must be true or false",
    _id: "18870"
}
const messages = {
    name_required: "This porparty is required",
    _id_unique: "this is not uniue try another one"
}
const validation = new Validation();

let status = validation.check(reqObj, {
    first_name: 'required|string|max:30|regExp:[a-zA-Z ]',
    name: 'required|string|max:30|regExp:[a-zA-Z ]|alpha',
    age: 'required|integer',
    address: 'required|string',
    obj: 'required|json',
    email: 'required|email',
    id: 'uuid',
    is_enable: 'boolean',
    term: 'in:yes,no,maybe',
    _id: 'unique:status'
}, messages).then(result => {
    console.log(result);
});





