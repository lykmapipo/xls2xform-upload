xlsform-upload
=================

[![Build Status](https://travis-ci.org/lykmapipo/xlsform-upload.svg?branch=master)](https://travis-ci.org/lykmapipo/xlsform-upload)

Upload and convert [XLSForm](http://xlsform.org/) into [XForm](http://opendatakit.github.io/odk-xform-spec/) in [nodejs](https://github.com/nodejs)

It support both `multiparty` request and normal http request where `xlsform` is send as `base64` encoded content


## Installation
```sh
$ npm install --save xlsform-upload
```

## Usage
```js
var app = require('express');
var xlsformUpload = require('xlsform-upload');

//use xlsform in your middlewares chain 
app.get('/xform', xlsformUpload(), function(request, response) {
    
    //obtain xform details from request body
    //by using fieldName or default to `xlsform`
    request.body.xlsform;

});

//or with options supplied
app.get('/xform', xlsformUpload({
    fieldName: 'form'
}), function(request, response) {

    //obtain xform details from request body
    //by using fieldName or default to `xlsform`
    request.body.form;

});
```

## Options
`xlsform-upload` accept the following options

- `fieldName` a name of the field used to extract xlsform details from `multiparty` or normal http request default to `xlsform`


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