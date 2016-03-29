xls2xform-upload
=================

[![Build Status](https://travis-ci.org/lykmapipo/xls2xform-upload.svg?branch=master)](https://travis-ci.org/lykmapipo/xls2xform-upload)

Upload and convert [XLSForm](http://xlsform.org/) into [XForm](http://opendatakit.github.io/odk-xform-spec/) in [nodejs](https://github.com/nodejs)

It support both `multiparty` request and normal http request where `xlsform` is send as `base64` encoded content


## Installation
```sh
$ npm install --save xls2xform-upload
```

## Usage
```js
var app = require('express');
var xlsformUpload = require('xls2xform-upload');

//use xlsform in your middlewares chain 
app.get('/xform', xlsformUpload(), function(request, response) {
    
    //obtain xlsform and xform details from request body
    //by using `xlsform` key by default
    request.body.xlsform;

});

//or with options supplied
app.get('/xform', xlsformUpload({
    fieldName: 'form',
    pythonPath:<custom_pathon_path>
}), function(request, response) {

    //obtain xlsform and xform details from request body
    //by using provided fieldName `form`
    request.body.form;

});
```

## Options
`xls2xform-upload` accept the following options

- `fieldName` a name of the field used to extract xlsform details from `multiparty` or normal http request default to `xlsform`
- `pythonPath` path to custom python installation

## Result
`xls2xform-upload` will accept, parse and convert submitted `XLSForm` into `XForm`. The structure of result is as bellow:

```js
{
    name: '<name of the file of xlsform uploaded>',
    type: '<mime type of the file of uploaded xlsform>',
    size: '<size of uploaded xlsform>',
    base64:'<xlsform in base64>',
    xform:'<xform>'
}
```

## Base64 Convertion
In `base64` convertion you will have to prepare a json payload as below:
```js
{
    `<fieldName>`: {
        name: 'simple.xls',
        type: 'application/vnd.ms-excel',
        size: 8704,
        base64: //xlsform encoded as base64
    }
}
```
`<fieldName>` must match the `fieldName` options supplied when configure middleware stack.

- `name` is the name of xlsform
- `type` mime type of xlsform
- `size` size in bytes of the xlsform
- `base64` base64 encoded xlsform

## Multiparty Convertion
In `multiparty` convertion your have to make sure file field is single upload and its `name` match the `fieldName` options supplied when configure middleware stack.

```html
<input type="file" name="xlsform">
```

## Literature Reviewed
- [XLSForm](http://xlsform.org/)
- [XForm](http://opendatakit.github.io/odk-xform-spec/)