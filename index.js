'use strict';

//dependencies
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var xls2xform = require('xls2xform');
var multer = require('multer');
var tmp = require('tmp');
tmp.setGracefulCleanup();

module.exports = exports = function(options) {
    //normalize options
    options = options || {};

    //default options
    var defaults = {
        //field name to be used to extract xlsform from multiparty request
        fieldName: 'xlsform',

        //file uploading destination to be used with multer
        dest: tmp.dirSync({
            //enable recursively removes the created temporary directory, 
            //even when it's not empty
            //@see https://www.npmjs.com/package/tmp#options
            unsafeCleanup: true
        }).name
    };

    //merge options with defaults
    options = _.merge(defaults, options);

    //prepare multer upload middleware
    var upload = multer(options);


    /**
     * @description parse request for the xlsform
     * @param  {Object}   request  valid http request
     * @param  {Object}   response valid http response
     * @param  {Function} next     next middleware to invoke
     */
    function xlsFormBodyParser(request, response, next) {
        //parse xlsform content from request body
        //if sent as base64 encode
        var isBase64 =
            _.isPlainObject(request.body[options.fieldName]) && !request.file;

        if (isBase64) {
            var file = request.body[options.fieldName];
            //normalize request file
            request.file = {};

            //set full path of generated file
            if (!request.file.path) {
                request.file.path =
                    path.join(options.dest, file.name);
            }

            //write file to path for convertion
            var data = new Buffer(file.base64, 'base64');

            //write file in temp
            fs.writeFile(request.file.path, data, next);

        }

        //handle multiparty request
        else {
            async.waterfall([
                function readFile(after) {
                    fs.readFile(request.file.path, after);
                },
                function updateFileDetails(buffer, after) {
                    //extend request body with xlsform file details 
                    var file = {};
                    file.base64 = buffer.toString('base64');
                    file.name = request.file.originalname;
                    file.type = request.file.mimetype;
                    file.size = request.file.size;

                    //extend request body with file details
                    request.body[options.fieldName] = file;

                    //reset file path
                    request.file.path =
                        path.join(request.file.destination, request.file.originalname);

                    fs.writeFile(request.file.path, buffer, after);
                }
            ], next);
        }
    }


    /**
     * @description extend request with xls2xform convertor
     * @param  {Object}   request  valid http request
     * @param  {Object}   response valid http response
     * @param  {Function} next     next middleware to invoke
     */
    function xform(request, response, next) {
        //obtain custom python settings
        var settings = _.pick(options, ['pythonPath']);

        //convert xls form to xform
        xls2xform(request.file.path, settings, function(error, xform) {
            if (error) {
                next(error);
            } else {
                //extend request body with xform
                request.body[options.fieldName] =
                    _.merge(request.body[options.fieldName], {
                        xform: xform
                    });

                next();
            }
        });
    }


    //return middlwares stack to be used
    //to parse and extend request
    return [
        upload.single(options.fieldName),
        xlsFormBodyParser,
        xform
    ];

};