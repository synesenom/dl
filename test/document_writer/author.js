var assert = require('assert');
var test = require('../../src/document_writer');

function run(i) {
    var DW = function() {
        test.DocumentWriter.apply(this, arguments);
    };
    DW.prototype = Object.create(test.DocumentWriter.prototype);
    DW.prototype.constructor = DW;
    var dw = new DW();

    var author = dw._doc.author;
    dw.author(i);
    return dw._doc.author != author;
}

describe('document_writer', function() {
    describe('author', function() {
        it('set author if valid', function() {
            // valid
            assert.equal(true, run("some author"));

            // invalid
            assert.equal(false, run(""));
            assert.equal(false, run(null));
            assert.equal(false, run(undefined));
        });
    });
});