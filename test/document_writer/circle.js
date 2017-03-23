var assert = require('assert');
var test = require('../../src/document_writer');

function run(i) {
    var DW = function() {
        test.DocumentWriter.apply(this, arguments);
    };
    DW.prototype = Object.create(test.DocumentWriter.prototype);
    DW.prototype.constructor = DW;
    var dw = new DW();

    var len = dw._doc.elements.circles.length;
    dw.circle(i.pos, i.radius, i.fill, i.stroke, i.strokeWidth);
    return dw._doc.elements.circles.length != len;
}

// TODO simplify it
describe('document_writer', function() {
    describe('circle', function() {
        it('should add circle only if circle is valid', function() {
            // valid
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));

            // invalid pos
            assert.equal(false, run({
                pos: null,
                radius: 10,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                pos: {y: 2},
                radius: 10,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                pos: {x: 1},
                radius: 10,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));

            // invalid radius
            assert.equal(false, run({
                pos: {x: 1, y: 2},
                radius: undefined,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                pos: {x: 1, y: 2},
                radius: 0,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(false, run({
                pos: {x: 1, y: 2},
                radius: -3,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));

            // invalid fill
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: null,
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {r: 1},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {g: 1},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {b: 1},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 1
            }));

            // invalid stroke
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {r: 1, g: 2, b: 3},
                stroke: null,
                strokeWidth: 1
            }));
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 1},
                strokeWidth: 1
            }));
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 1},
                strokeWidth: 1
            }));
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {r: 1, g: 2, b: 3},
                stroke: {g: 1},
                strokeWidth: 1
            }));
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {r: 1, g: 2, b: 3},
                stroke: {b: 1},
                strokeWidth: 1
            }));
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: undefined
            }));
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: 0
            }));
            assert.equal(true, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {r: 1, g: 2, b: 3},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: -3
            }));

            // invalid fill + stroke
            assert.equal(false, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {r: 1},
                stroke: null,
                strokeWidth: 0
            }));
            assert.equal(false, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: {r: 1},
                stroke: {r: 4, g: 5, b: 6},
                strokeWidth: -2
            }));
            assert.equal(false, run({
                pos: {x: 1, y: 2},
                radius: 10,
                fill: null,
                stroke: null,
                strokeWidth: -3
            }));
        });
    });
});