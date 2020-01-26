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

new Validation(reqObj, {
    name: 'required|string|min:1|max:20',
    age: 'required|integer',
    email: 'required|email',
    password: 'required|min:8|max:30',
    location: 'json'
});
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

**This sample usage not only show all the validation parameters.**
