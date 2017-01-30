var request = require('request');

it("should respond with hello world", function(done) {
    request("http://localhost:3000/hello", function(error, response, body) {
        expect(body).toEqual("hello world");
        done();
    });
});