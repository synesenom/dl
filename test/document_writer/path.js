var assert = require('assert');
var test = require('../../src/document_writer');

function run(i) {
    var DW = function() {
        test.DocumentWriter.apply(this, arguments);
    };
    DW.prototype = Object.create(test.DocumentWriter.prototype);
    DW.prototype.constructor = DW;
    var dw = new DW();

    var len = dw._doc.elements.paths.length;
    dw.path(i.corners, i.fill, i.stroke, i.strokeWidth);
    return dw._doc.elements.paths.length != len;
}

describe('document_writer', function() {
    describe('path', function() {
        it('should add path only if path is valid', function() {
            // valid
            assert.equal(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));

            // invalid corners
            assert.equal(false, run({
                corners: null,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                corners: [{x: 1, y: 2}],
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                corners: [{x: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                corners: [{x: 1, y: 1}, {y: 2}, {x: 1, y: 2}],
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                corners: [null, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, undefined],
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));

            // invalid fill
            assert.equal(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: null,
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.deepEqual(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.deepEqual(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {g: 1},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.deepEqual(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {b: 1},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.deepEqual(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));

            // invalid stroke
            assert.deepEqual(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1, g: 2, b: 3},
                stroke: null,
                strokeWidth: 1
            }));
            assert.deepEqual(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 1},
                strokeWidth: 1
            }));
            assert.deepEqual(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 1},
                strokeWidth: 1
            }));
            assert.deepEqual(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1, g: 2, b: 3},
                stroke: {g: 1},
                strokeWidth: 1
            }));
            assert.deepEqual(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1, g: 2, b: 3},
                stroke: {b: 1},
                strokeWidth: 1
            }));
            assert.deepEqual(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 0
            }));
            assert.deepEqual(true, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: -3
            }));

            // invalid fill + stroke
            assert.deepEqual(false, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1},
                stroke: null,
                strokeWidth: 0
            }));
            assert.deepEqual(false, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: {r: 1},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: -2
            }));
            assert.deepEqual(false, run({
                corners: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 1, y: 2}],
                fill: null,
                stroke: null,
                strokeWidth: -3
            }));
        });
    });
});