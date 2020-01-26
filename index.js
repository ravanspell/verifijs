const Validation = require('./Validation');

//const validationObj = new Validation();
//try {
let reqObj = {
    name: 'kalo',
    age: 45,
    address: 'No234Knnimahara',
    obj: '{"name":"kalo"'
}
new Validation(reqObj, {
    name: 'required|string|max:34',
    age: 'required|integer',
    address: 'required|string',
    obj: 'required|json',
});
//} catch (error) {
    //console.log(error);
//}



