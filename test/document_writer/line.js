var assert = require('assert');
var test = require('../../src/document_writer');

function run(i) {
    var DW = function() {
        test.DocumentWriter.apply(this, arguments);
    };
    DW.prototype = Object.create(test.DocumentWriter.prototype);
    DW.prototype.constructor = DW;
    var dw = new DW();

    var len = dw._doc.elements.lines.length;
    dw.line(i.src, i.dst, i.stroke, i.strokeWidth);
    return dw._doc.elements.lines.length != len;
}

// TODO simplify it
describe('document_writer', function() {
    describe('line', function() {
        it('should add line only if line is valid', function() {
            // valid
            assert.equal(true, run({
                src: {x: 1, y: 2},
                dst: {x: 3, y: 4},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: 1
            }));

            // invalid src
            assert.equal(false, run({
                src: null,
                dst: {x: 3, y: 4},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                src: undefined,
                dst: {x: 3, y: 4},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                src: {y: 2},
                dst: {x: 3, y: 4},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                src: {x: 2},
                dst: {x: 3, y: 4},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                src: {},
                dst: {x: 3, y: 4},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: 1
            }));

            // invalid dst
            assert.equal(false, run({
                src: {x: 1, y: 2},
                dst: null,
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                src: {x: 3, y: 2},
                dst: {x: 3},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                src: {x: 3, y: 2},
                dst: {y: 3},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                src: {x: 3, y: 2},
                dst: {g: 3},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: 1
            }));

            // src = dst
            assert.equal(false, run({
                src: {x: 3, y: 4},
                dst: {x: 3, y: 4},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: 1
            }));

            // invalid stroke
            assert.equal(false, run({
                src: {x: 1, y: 2},
                dst: {x: 3, y: 4},
                stroke: null,
                strokeWidth: 1
            }));
            assert.equal(false, run({
                src: {x: 1, y: 2},
                dst: {x: 3, y: 4},
                stroke: {r: 1},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                src: {x: 1, y: 2},
                dst: {x: 3, y: 4},
                stroke: {g: 1},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                src: {x: 1, y: 2},
                dst: {x: 3, y: 4},
                stroke: {b: 1},
                strokeWidth: 1
            }));

            // invalid stroke width
            assert.equal(true, run({
                src: {x: 1, y: 2},
                dst: {x: 3, y: 4},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: null
            }));
            assert.equal(true, run({
                src: {x: 1, y: 2},
                dst: {x: 3, y: 4},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: 0
            }));
            assert.equal(true, run({
                src: {x: 1, y: 2},
                dst: {x: 3, y: 4},
                stroke: {r: 1, g: 2, b: 3},
                strokeWidth: -1
            }));
        });
    });
});