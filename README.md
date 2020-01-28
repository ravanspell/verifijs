# js-validation

Agilent and light weight java script validation library for dummies.

### Installation

js-validation still under development thus installation is not possible so far.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change or new additions.

Please make sure to update tests as appropriate.

## Proposed Usage

js-validation is light weight java script validation library It can be use with Node js, express java script server less (AWS,Azure, etc).

```node
const Validation = require('./Validation');

let reqObj = {
     name: 'kalo',
    age: 45,
    email 'myemail@gmail.com',
    password: 'abc123',
    location: "{'lat':23.454545,'lgt':45.565565}",
}

const messages = {
    name_required: "This porparty is required"
}
const validation = new Validation();

let status = validation.check(reqObj, {
    name: 'required|string|max:2',
    age: 'required|integer',
    address: 'required|string',
    obj: 'required|json',
    email: 'required|email'
}, messages);
```

Above example shows the proposed example usage of js-validation.

```node
const Validation = require("./Validation");
```

import validation library 'the standerd way'

```node
let reqObj = {
    name: 'kalo',
    age: 45,
    email 'myemail@gmail.com',
    password: 'abc123',
    location: "{'lat':23.454545,'lgt':45.565565}",
}
```

'reqObj' is the object that include values that need to validate. this may be a 'post' request or your own reqObj.

```node
{
  name: 'required|string|min:1|max:20',
  age: 'required|integer',
  email: 'required|email',
  password: 'required|min:8|max:30',
  location: 'json'
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
  max: "you cannot use more than max value"
};
```

this messages will apply all "max" validation checks.

2. Apply some message to specific data field.

```node
const messages = {
  name_required: "This property is required"
};
```

here you need to specify data field (name) and criteria (required) then error
message will add only to that specific data field required criteria. data field and
criteria should separate by using "\_".

**This sample usage not only show all the validation parameters.**
