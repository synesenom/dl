var assert = require('assert');
var test = require('../../src/document_writer');

function run(i) {
    var DW = function() {
        test.DocumentWriter.apply(this, arguments);
    };
    DW.prototype = Object.create(test.DocumentWriter.prototype);
    DW.prototype.constructor = DW;
    var dw = new DW();

    return dw._reduce(i);
}

describe('document_writer', function() {
    describe('_reduce', function() {
        it('remove multiple spaces', function() {
            assert.equal("", run(undefined));
            assert.equal("", run(null));
            assert.equal("", run(""));
            assert.equal("a b c d", run("a b c d"));
            assert.equal("a b c d", run("a   b   c  d"));
            assert.equal("a \nb \nc d", run("a \n b \n   c  d"));
        });
    });
});