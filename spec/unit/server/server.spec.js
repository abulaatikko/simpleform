var request = require('request');
var fs = require('fs');

var config = require('../../../test/server/config');
var server = require(config.basePath + '/test/server/server.js');

describe('server', function() {

    var baseUrl = 'http://' + config.host + ':' + config.port;

    it("should response form json", function(done) {
        request.get(baseUrl + '/form/1', function(error, response) {
            expect(response.body).toMatch(/nextFields":\["money\-toolittle\-submit"\]\},\{"label":"I\'ve got too much/);
            done();
        });
    });

    it("should response index page", function(done) {
        request.get(baseUrl + '/', function(error, response) {
            expect(response.body).toMatch(/Test/);
            expect(response.body).toMatch(/div ui-view/);
            done();
        });
    });

    it("should email form data", function(done) {
        var formData = {
            name: 'Matti Kutonen',
            description: 'Dataa',
            something: 'else',
            file: fs.createReadStream(config.basePath + 'spec/data/sample1.txt'),
        };

        request.post({url: baseUrl + '/answer', formData: formData}, function(error, response) {
            done();
        });
    });

});
