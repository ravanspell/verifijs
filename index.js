const Validation = require('./Validation');

let reqObj = {
    first_name: "Ical survey 2019",
    age: 56,
    address: 'No234Knnimahara',
    obj: '{"name":"kalo"}',
    email: 'ireshandj2@gmail.com',
    id: 'f1277d16-5cb9-43f6-95ce-a5e22e12cdaa'
}
const messages = {
    first_name_required: "First name is required"
}
const validation = new Validation();

let status = validation.check(reqObj, {
    first_name: 'required|string|max:30|regExp:[a-zA-Z ]',
    age: 'required|integer',
    address: 'required|string',
    obj: 'required|json',
    email: 'required|email',
    id: 'uuid'
}, messages);

console.log(status);


