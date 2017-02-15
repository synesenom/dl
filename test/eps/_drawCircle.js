var assert = require('assert');
var test = require('../../src/eps');

function run(i) {
    var eps = new test.EPS({width: 10, height: 10});
    return eps._drawCircle(i);
}

describe('eps', function() {
    describe('_drawCircle.get', function() {
        it('draws a valid postscript circle command', function() {
            // fill only
            assert.equal("gsave newpath 1 1 1 setrgbcolor 1 2 3 0 360 arc closepath fill grestore\n",
                run({pos: {x: 1, y: 2}, radius: 3, fill: {r: 255, g: 255, b: 255},
                    stroke: null, strokeWidth: 2}));
            assert.equal("gsave newpath 1 1 1 setrgbcolor 1 2 3 0 360 arc closepath fill grestore\n",
                run({pos: {x: 1, y: 2}, radius: 3, fill: {r: 255, g: 255, b: 255},
                    stroke: {r: 0, g: 0, b: 0}, strokeWidth: null}));

            // stroke only
            assert.equal("gsave newpath 1 1 1 setrgbcolor 2 setlinewidth 1 2 3 0 360 arc closepath stroke grestore\n",
                run({pos: {x: 1, y: 2}, radius: 3, fill: null,
                    stroke: {r: 255, g: 255, b: 255}, strokeWidth: 2}));

            // fill + stroke
            assert.equal("gsave newpath 1 1 1 setrgbcolor 1 2 3 0 360 arc closepath gsave fill grestore 1 1 1 setrgbcolor 2 setlinewidth stroke grestore\n",
                run({pos: {x: 1, y: 2}, radius: 3, fill: {r: 255, g: 255, b: 255},
                    stroke: {r: 255, g: 255, b: 255}, strokeWidth: 2}));
        });
    });
});
