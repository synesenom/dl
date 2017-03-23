var assert = require('assert');
var test = require('../../src/dl');

var testCases = [
    {i: null, o: null},
    {i: "", o: null},
    {i: "none", o: null},
    {i: "something", o: null},
    {i: "#rgba(123,234,56)", o: null},
    {i: "#123", o: {r: 17, g: 34, b: 51}},
    {i: "#abc", o: {r: 170, g: 187, b: 204}},
    {i: "#xyz", o: null},
    {i: "#123456", o: {r: 18, g: 52, b: 86}},
    {i: "#abcdef", o: {r: 171, g: 205, b: 239}},
    {i: "#x12y45", o: null},
    {i: "rgb(123,234,56)", o: {r: 123, g: 234, b: 56}},
    {i: "rgba(123,234,56,0.8)", o: {r: 123, g: 234, b: 56, a: 0.8}},
    {i: "rgb(  123 , 234, 56)", o: {r: 123, g: 234, b: 56}},
    {i: "rgb(abg,32s,123)", o: null},
];

describe('dl', function() {
    describe('_getColor.get', function() {
        it('should recognize color format and return in bytes', function() {
            testCases.forEach(function(t) {
                assert.deepEqual(test.dl._getColor(t.i), t.o);
            });
        });
    });
});
