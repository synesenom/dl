var assert = require('assert');
var test = require('../../src/document_writer');

var testCases = [
    {i: "", o: false},
    {i: null, o: false},
    {i: undefined, o: false},
    {i: "some author", o: true}
];

describe('document_writer', function() {
    describe('author', function() {
        it('set author if valid', function() {
            var DW = function() {
                test.DocumentWriter.apply(this, arguments);
            };
            DW.prototype = Object.create(test.DocumentWriter.prototype);
            DW.prototype.constructor = DW;
            var dw = new DW();

            testCases.forEach(function (t) {
                assert.equal((function(x) {
                    var author = dw._doc.author;
                    dw.author(x);
                    return dw._doc.author != author;
                })(t.i), t.o);
            })
        });
    });
});