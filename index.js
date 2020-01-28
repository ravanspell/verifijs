const Validation = require('./Validation');

//const validationObj = new Validation();
//try {
let reqObj = {
    name: 'Klao',
    age: '',
    address: 'No234Knnimahara',
    obj: '{"name":"kalo"}',
    email: 'ireshandj2@gmail.com'
}

let messages = {
    name_required: "This porparty is required man!"
}
const v = new Validation();

console.log(v.check(reqObj, {
    name: 'required|string|max:2',
    age: 'required|integer',
    address: 'required|string',
    obj: 'required|json',
    email: 'required|email'
}, messages));
//} catch (error) {
    //console.log(error);
//}



