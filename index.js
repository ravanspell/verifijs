const Validation = require('./Validation');

let reqObj = {
    name: "Ical survey 2019@#$",
    age: 56,
    address: 'No234Knnimahara',
    obj: '{"name":"kalo"}',
    email: 'ireshandj2@gmail.com',
    _id: "18870"
}
const messages = {
    name_required: "This porparty is required",
    _id_unique: "this is not uniue try another one"
}
const validation = new Validation('mongodb://127.0.0.1:27017', 'mongodb', 'dhananjayatrades');

let status = validation.check(reqObj, {
    name: 'required|string|max:30|regExp:[a-zA-Z ]|alpha',
    age: 'required|integer',
    address: 'required|string',
    obj: 'required|json',
    email: 'required|email',
    _id: 'unique:status'
}, messages).then(result => {
    console.log(result);
});





