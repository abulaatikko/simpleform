var request = require('request');
var config = require('../../../test/server/config');

describe('server', function() {

    it("should response form json", function(done) {
        request.get('http://' + config.host + ':' + config.port + '/form/1', function(error, response) {
            expect(response.body).toMatch(/nextFields":\["money\-toolittle\-submit"\]\},\{"label":"I\'ve got too much/);
            done();
        });
    });

    it("should response index page", function(done) {
        request.get('http://' + config.host + ':' + config.port + '/', function(error, response) {
            expect(response.body).toMatch(/Test/);
            expect(response.body).toMatch(/div ui-view/);
            done();
        });
    });

    it("should email form data", function(done) {
        var formData = {
            name: 'Matti Kutonen',
            description: 'Dataa',
            something: 'else'
        };
        request.post({url: 'http://' + config.host + ':' + config.port + '/answer', formData: formData}, function(error, response) {
            done();
        });
    });

});
