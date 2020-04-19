# express-validation

Agilent and light weight java script/node js validation library.

### Installation

express-validation still under development thus installation is not possible so far as a npm library. But you can clone this repository and use it anyway.Try it is open source.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change or new additions.

Please make sure to update tests as appropriate.

## Why express-validation?

express-validation is aligant validation library that inpired by laravel freamwork.

- Express validation is very light weight validation library.
- Express validation use very limited number of dependencies. (It is useig database driver packges such as mysql,mongodb,postgresql only).
- Express validation define validation enable defined chained validation rule schema.It allow use multiple validations to single input.

- It allow use even database based validations. For instance : If you want to check some data wether already in the database or not express validation allow check value by simply define a schema.
- It currantly support only mongodb database validations. But as soon as possible it will support other database manamagent systems as well.

## Proposed Usage

express-validation is light weight java script/Node js validation library It can be use with Node js, express java script server less (AWS,Azure, etc).

```node
const Validation = require("./express-validation");
// the request object that include data which submitted by the user.
let reqObj = {
  name: "kalo",
  age: 56,
  address: "No234Knnimahara",
  obj: '{"name":"kalo"}',
  email: "ireshandj2@gmail.com",
  id: "f1277d16-5cb9-43f6-95ce-a5e22e12cdaa",
  is_enable: true,
  term: "Yes",
};

//express-validation allows to defined your own validation error messages.
const messages = {
  first_name_required: "First name is required",
  is_enable_boolean: "is enable must be true or false",
  name_required: "This porparty is required",
  name_alpha: "Name must be include letters and numbers",
};
//create validation object.
const validation = new Validation();

//------------database validation -----------

//With creation validation object you can pass your database connection with //database type such as 'mongodb' or 'mysql' or etc.
// const validation = new Validation(conn,'mongodb');
//then express validation now ready to validate with database as well.

//defined validation rules. This is asynchronous method.
validation
  .check(
    reqObj,
    {
      first_name: "required|string|max:30|regExp:[a-zA-Z ]",
      name: "required|string|max:30|regExp:[a-zA-Z ]|alpha",
      age: "required|integer",
      address: "required|string",
      obj: "required|json",
      email: "required|email",
      id: "uuid",
      is_enable: "boolean",
      term: "in:yes,no,maybe",
    },
    messages
  )
  .then((result) => {
    console.log(result);
  });
```

Above example shows the proposed example usage of js-validation.

```node
const Validation = require("./express-validation");
```

import validation library 'the standerd way'

```node
let reqObj = {
  name: "kalo",
  age: 56,
  address: "No234Knnimahara",
  obj: '{"name":"kalo"}',
  email: "ireshandj2@gmail.com",
  id: "f1277d16-5cb9-43f6-95ce-a5e22e12cdaa",
  is_enable: true,
  term: "Yes",
};
```

'reqObj' is the object that include values that need to validate. this may be a 'post' request or your own reqObj.

```node
{
    first_name: 'required|string|max:30|regExp:[a-zA-Z ]',
    name: 'required|string|max:30|regExp:[a-zA-Z ]|alpha',
    age: 'required|integer',
    address: 'required|string',
    obj: 'required|json',
    email: 'required|email',
    id: 'uuid',
    is_enable: 'boolean',
    term: 'in:yes,no,maybe',
}
```

You can specify validation parameters separated by '|'. Remember you have to use same key values that used in reqObj that you already defined.

### Customizing The Error Messages

You can define your own error messages instead of existing messages.
pass the message object into check method just like above.here you have tow options

1. Apply some message effect to all criteria

```node
const messages = {
  // max is the criteria
  max: "you cannot use more than max value",
};
```

this messages will apply all "max" validation checks.

2. Apply some message to specific data field.

```node
const messages = {
  name_required: "This property is required",
};
```

here you need to specify data field (name) and criteria (required) then error
message will add only to that specific data field required criteria. data field and
criteria should separate by using "\_".

**This sample usage not only show all the validation parameters. We are working on full documentation.**
