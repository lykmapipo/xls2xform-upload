'use strict';

//dependencies
var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var express = require('express');
var bodyParser = require('body-parser');
var xlsformUpload = require(path.join(__dirname, '..'));
var simpleXForm = path.join(__dirname, 'fixtures', 'simple.xml');
var simpleXlsForm = path.join(__dirname, 'fixtures', 'simple.xls');


//express app
var app = express();

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.post('/xform', xlsformUpload(), function(request, response) {
    //access xform details using fieldName as a key
    //defult to xlsform
    response.json(request.body.xlsform);
});

app.post('/xform_custom', xlsformUpload({
    pythonPath: '/usr/bin/python'
}), function(request, response) {
    //access xform details using fieldName as a key
    //defult to xlsform
    response.json(request.body.xlsform);
});

describe('xlsform upload', function() {

    describe('unit', function() {
        it('should be a function', function() {
            expect(xlsformUpload).to.be.a('function');
        });

        it('should return middleware stack', function() {
            var middlewares = xlsformUpload();

            expect(middlewares).to.be.an('array');
            expect(middlewares).to.have.length(3);
            expect(middlewares[0]).to.be.a('function');
            expect(middlewares[1]).to.be.a('function');
            expect(middlewares[2]).to.be.a('function');
        });
    });

    describe('intergration', function() {

        it('should be able to convert attached xlsform into xform', function(done) {
            request(app)
                .post('/xform')
                .attach('xlsform', path.join(__dirname, 'fixtures', 'simple.xls'))
                .end(function(error, response) {

                    expect(error).to.not.exist;

                    expect(response.body.xform.substring(0, 14))
                        .to.be.equal(fs.readFileSync(simpleXForm, 'utf-8').substring(0, 14));

                    done(error, response);
                });
        });

        it('should be able to convert attached xlsform into xform using custom python path', function(done) {
            request(app)
                .post('/xform_custom')
                .attach('xlsform', path.join(__dirname, 'fixtures', 'simple.xls'))
                .end(function(error, response) {

                    expect(error).to.not.exist;

                    expect(response.body.xform.substring(0, 14))
                        .to.be.equal(fs.readFileSync(simpleXForm, 'utf-8').substring(0, 14));

                    done(error, response);
                });
        });

        it('should be able to convert base64 xlsform into xform', function(done) {
            request(app)
                .post('/xform')
                .send({
                    xlsform: {
                        name: 'simple.xls',
                        type: 'application/vnd.ms-excel',
                        size: 8704,
                        base64: fs.readFileSync(simpleXlsForm).toString('base64')
                    }
                })
                .end(function(error, response) {

                    expect(error).to.not.exist;

                    expect(response.body.xform.substring(0, 14))
                        .to.be.equal(fs.readFileSync(simpleXForm, 'utf-8').substring(0, 14));

                    done(error, response);
                });
        });

    });

});