var assert = require('assert');
var test = require('../../src/dl');

describe('dl', function() {
    describe('_getColor.get', function() {
        it('should recognize color format and return in bytes', function() {
            assert.deepEqual(null, test.dl._getColor(null));
            assert.deepEqual(null, test.dl._getColor(""));
            assert.deepEqual(null, test.dl._getColor("none"));
            assert.deepEqual(null, test.dl._getColor("something"));
            assert.deepEqual(null, test.dl._getColor("#rgba(123,234,56)"));
            assert.deepEqual({r: 17, g: 34, b: 51}, test.dl._getColor("#123"));
            assert.deepEqual({r: 170, g: 187, b: 204}, test.dl._getColor("#abc"));
            assert.deepEqual(null, test.dl._getColor("#xyz"));
            assert.deepEqual({r: 18, g: 52, b: 86}, test.dl._getColor("#123456"));
            assert.deepEqual({r: 171, g: 205, b: 239}, test.dl._getColor("#abcdef"));
            assert.deepEqual(null, test.dl._getColor("#x12y45"));
            assert.deepEqual({r: 123, g: 234, b: 56}, test.dl._getColor("rgb(123,234,56)"));
            assert.deepEqual({r: 123, g: 234, b: 56, a: 0.8}, test.dl._getColor("rgba(123,234,56,0.8)"));
            assert.deepEqual({r: 123, g: 234, b: 56}, test.dl._getColor("rgb(  123 , 234, 56)"));
            assert.deepEqual(null, test.dl._getColor("rgb(abg,32s,123)"));
        });
    });
});
