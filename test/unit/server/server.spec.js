var request = require('request');
var config = require('../../config');

describe('server', function() {

    it("should response form json", function(done) {
        request('http://' + config.host + ':' + config.port + '/form/1', function(error, response) {
            expect(response.body).toMatch(/nextFields":\["money\-toolittle\-submit"\]\},\{"label":"I\'ve got too much/);
            done();
        });
    });

    it("should response index page", function(done) {
        request('http://' + config.host + ':' + config.port + '/', function(error, response) {
            expect(response.body).toMatch(/Development/);
            expect(response.body).toMatch(/div ui-view/);
            done();
        });
    });

});
