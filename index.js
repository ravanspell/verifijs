const Validation = require('./Validation');

//const validationObj = new Validation();
//try {
let reqObj = {
    name: 'kalo',
    age: 45,
    address: 'No234Knnimahara',
    obj: '{"name":"kalo"}',
    email: 'ireshandj2@gmail.com'
}
const v = new Validation(reqObj, {
    name: 'required|string|max:34',
    age: 'required|integer',
    address: 'required|string',
    obj: 'required|json',
    email: 'required|email'
});

v.check();
//} catch (error) {
    //console.log(error);
//}



