const Validation = require('./Validation');

//const validationObj = new Validation();
//try {
let reqObj = {
    name: 'kalo',
    age: 45
}
new Validation(reqObj, {
    name: 'string|max:1',
    age: 'integer'
});
//} catch (error) {
    //console.log(error);
//}



