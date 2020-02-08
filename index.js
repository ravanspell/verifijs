const Validation = require('./Validation');

let reqObj = {
    name: "Ical survey 2019@#$",
    age: 56,
    address: 'No234Knnimahara',
    obj: '{"name":"kalo"}',
    email: 'ireshandj2@gmail.com',
    id: 'f1277d16-5cb9-43f6-95ce-a5e22e12cdaa'
}
const messages = {
    name_required: "This porparty is required"
}
const validation = new Validation();

let status = validation.check(reqObj, {
    name: 'required|string|max:30|regExp:[a-zA-Z ]|alpha',
    age: 'required|integer',
    address: 'required|string',
    obj: 'required|json',
    email: 'required|email',
    id: 'unique'
}, messages).then(result => {
    console.log(result);
});

console.log('pkaya');




