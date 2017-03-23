var assert = require('assert');
var test = require('../../src/document_writer');

var testCases = [
    {i: undefined, o: ""},
    {i: null, o: ""},
    {i: "", o: ""},
    {i: "a b c d", o: "a b c d"},
    {i: "a   b   c  d", o: "a b c d"},
    {i: "a \n b \n   c  d", o: "a \nb \nc d"},
];

describe('document_writer', function() {
    describe('_reduce', function() {
        it('remove multiple spaces', function() {
            var DW = function() {
                test.DocumentWriter.apply(this, arguments);
            };
            DW.prototype = Object.create(test.DocumentWriter.prototype);
            DW.prototype.constructor = DW;
            var dw = new DW();

            testCases.forEach(function (t) {
                assert.equal(dw._reduce(t.i), t.o);
            });
        });
    });
});