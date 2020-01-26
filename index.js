const Validation = require('./Validation');

//const validationObj = new Validation();
//try {
let reqObj = {
    name: 'kalo',
    age: '',
    address: ''
}
new Validation(reqObj, {
    name: 'required|string|max:1',
    age: 'required|integer',
    address: 'required|string'
});
//} catch (error) {
    //console.log(error);
//}



