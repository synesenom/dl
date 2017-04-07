var assert = require('assert');
var test = require('../../src/eps');

var testCases = [
    {i: {src: {x: 1, y: 2}, dst: {x: 3, y: 4}, stroke: {r: 255, g: 255, b: 0}, strokeWidth: 1},
    o: "gsave newpath 1 1 0 setrgbcolor 1 setlinewidth 1 2 moveto 3 4 lineto stroke grestore\n"}
];

describe('eps', function() {
    describe('_drawLine', function() {
        it('draws a valid postscript line command', function() {
            var eps = new test.EPS({width: 10, height: 10});

            testCases.forEach(function (t) {
                assert.equal(eps._drawLine(t.i), t.o);
            });
        });
    });
});
