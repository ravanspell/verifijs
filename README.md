# verifijs v1.0.0

Light weight node js validation library.

## Why verifijs?

verifijs is validation library that inspired by laravel freamwork.

- verifijs is very light weight node.js validation library written in java script.
- verifijs use very limited number of dependencies. (It is useing database driver packges such as mysql,mongodb only) The good news is you only need to install either of this database driver which means if you use mysql database you only need to install mysql npm driver.
- verifijs define validation enable defined chained validation rule schema.It allow use multiple validations to single input.

- It allow use even database based validations. For instance : If you want to check some data wether already in the database or not verifijs allow check value by simply define a schema.
- It currantly support only mongodb database validations. But as soon as possible it will support other database manamagent systems as well.

## Sample Usage

verifijs is light weight java script/Node js validation library It can be use with Node js, express , server less (AWS,Azure, etc).

```node
const Validation = require("verifijs");
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

//verifijs allows to defined your own validation error messages.
const messages = {
  first_name_required: "First name is required",
  is_enable_boolean: "is enable must be true or false",
  name_required: "This porparty is required",
  name_alpha: "Name must be include letters and numbers",
};
//create validation object.
const validation = new Validation();

//defined validation rules. This is asynchronous method.
//or reqObj.body
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

Above example shows the proposed example usage of verifijs.

```node
const Validation = require("verifijs");
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

'reqObj' is the object that include values that need to validate. this may be a 'post' request or your own reqObj(sometimes this can be req.body).

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

## Validation Rules

[alpha](#alpha) | [alphaNum](#alphanum) | [alphaDash](#alphadash) | [array](#array) | [bail](#bail) | [bailAll](#bailall) | [before(date)](#beforedate)| [beforeOrEqual(date)](#beforeorequaldate) | [boolean](#boolean) | [between](#betweenminmax) | [distinct](#distinct) | [database_validation_rules](#database-validation-rules-uniqueexists) | [dateEquals](#dateequalsdate) | [digits](#digitsvalue) | [digits](#digitsvalue) | [digitsBetween](#digitsbetweenminmax) | [dateEquals](#dateequalsdate)| [email](#email) | [graterThan](#gtfield) | [graterThanOrEqual](#gtefield) | [in](#invalue1valie2...)| [includes](#includes) | [json](#json) | [lessThanOrEqual](#ltefield) | [min](#minvalue) | [max](#maxvalue) | [lessThan](#ltfield) | [notIn](#notinvalue1valie2...) | [required](#required) | [regExp](#regexppattern) | [string](#string) | [size](#sizevalue) | [uuid](#uuid)

#### required

The field under validation must be present in the input data and not empty. A field is considered "empty" if one of the following conditions are true:

- The value is null.
- The value is an empty string.
- The value is an empty array or empty Countable object.

#### size:value

The field under validation must have a size matching the given value. For string data, value corresponds to the number of characters. For numeric data, value corresponds to a given integer value (the attribute must also have the numeric or integer rule). For an array, size corresponds to the count of the array. Let's look at some examples:

```node
// Validate that a string is exactly 12 characters long...
'title': 'size:12';

// Validate that a provided integer equals 10...
'seats': 'integer|size:10';

// Validate that an array has exactly 5 elements...
'tags' : 'array|size:5';
```

#### min:value

The field under validation must have a minimum value. Strings, numerics, arrays are evaluated in the same fashion as the [size](#sizevalue) rule.

#### max:value

The field under validation must be less than or equal to a maximum value. Strings, numerics, arrays are evaluated in the same fashion as the [size](#sizevalue) rule.

#### string

The field under validation must be a string.

### Database Validation rules (unique,exists)

Database validation rules helps to validate your input data against data that stored in your application's database. for that you need to install node js database drivers that supports your particular database.

if you are using mysql database, you need to install manually mysql node.js drivers using below npm command.

`npm i mysql@2.18.1`

if you are using mongodb, you need to install manually mongodb node.js drivers using below npm command.

`npm i mongodb@3.5.7`

**_NOTE: If you don't intend to use below validations (unique,exists) You don't need to install any theired party library._**

Now you need to initiate database connection.

```node
// Validation object creation
const validation = new Validation();
```

if you use mongo db

```node
validation.initMongoDbConnection({
  url: "url to your mongodb",
});
```

if you use mysql

```node
validation.initMysqlConnection({
  host: "host",
  user: "username",
  password: "password",
  database: "database name",
});
```

This configurations will make a database connection.

#### unique:table,column

The field under validation must not exist within the given database table.
The `column` option may be used to specify the field's corresponding database `column`. If the column option is not specified, the field name will be used.

**Currently supports Mongodb and MySql only**

```node
//validation rule
email: "unique:users,email_address";
```

#### exists:table,column

The field under validation must exist on a given database table.
If the column option is not specified, the field name will be used.

**Currently supports Mongodb and MySql only**

```node
//validation rule
email: 'exists:users,email_address
```

#### alpha

The field under validation must be entirely alphabetic characters.

#### alphaDash

The field under validation may have alpha-numeric characters, as well as dashes and underscores.

#### alphaNum

The field under validation must be entirely alpha-numeric characters.

#### boolean

The field under validation must be able to be cast as a boolean. Accepted input are `true, false, 1, 0, "1",`and `"0"`.

#### dateEquals:date

The field under validation must be equal to the given date.

#### digits:value

The field under validation must be numeric and must have an exact length of value.

#### digitsBetween:min,max

The field under validation must be numeric and must have a length between the given min and max.

#### email

The field under validation must be formatted as an e-mail address.

#### gt:field

The field under validation must be greater than the given field. The two fields must be of the same type. Strings, numerics, arrays, and files are evaluated using the same conventions as the size rule.

#### gte:field

The field under validation must be greater than or equal to the given field. The two fields must be of the same type. Strings, numerics, arrays, and files are evaluated using the same conventions as the size rule.

#### in:value1,valie2,...

The field under validation must be included in the given list of values.

```node
 term: 'in:yes,no,maybe',
```

#### not_in:value1,valie2,...

The field under validation must not be included in the given list of values.

#### json

The field under validation must be a valid JSON string.

#### lt:field

The field under validation must be less than the given field. The two fields must be of the same type. Strings, numerics, arrays, and files are evaluated using the same conventions as the size rule.

#### regExp:pattern

The field under validation must match the given regular expression.

#### lte:field

The field under validation must be less than or equal to the given field. The two fields must be of the same type. Strings, numerics, arrays, and files are evaluated using the same conventions as the size rule.

#### dateEquals:date

The field under validation must be equal to the given date.

```node
date: 'dateEquals:1994-02-24',
```

#### before:date

The field under validation must be a value preceding the given date.

#### beforeOrEqual:date

The field under validation must be a value preceding or equal to the given date.

#### bail

Stop running validation rules after the first validation failure. Suppose you have defined sevaral validations for each data property.

```node
 name: 'bail|required|string|max:30|regExp:[a-zA-Z ]|alphaDash',
 age: 'bail|required|integer',
```

normally, verifijs gives all validation error messages at once.but when you specifiy `bail` for each property first validation falier stop evaluate other validation rules for each property.then it will move to next property to validation.
Example: when `name` property's `max` validation fails, bail stop validate rest of validation rules and jump to `age` property.

#### bailAll

bail all is not a validation rule. It's a method.If you set bailAll property value as `true`, verifijs stop validation when one validation fails and give you the error message.default value is `false`.

```node
const validation = new Validation();
validation.setBailAll(true);
```

#### distinct

When working with arrays, the field under validation must not have any duplicate values.

#### includes

includes evauate strings has spesific phase.for instance you want to allow mail addresses such as gmail,yahoo only `includes` able to use specify them.

```node
 email: 'required|email|includes:@gmail.com,@hotmail.com',
```

#### between:min,max

The field under validation must have a size between the given min and max. Strings, numerics, arrays are evaluated in the same fashion as the [size](#size) rule.

#### uuid

The field under validation must be a valid RFC 4122 (version 1, 3, 4, or 5) universally unique identifier (UUID).

#### array

The field under validation must be a java script `array`.

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
