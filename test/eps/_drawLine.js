var assert = require('assert');
var test = require('../../src/eps');

function run(i) {
    var eps = new test.EPS({width: 10, height: 10});
    return eps._drawLine(i);
}

describe('eps', function() {
    describe('_drawLine.get', function() {
        it('draws a valid postscript line command', function() {
            assert.equal("gsave newpath 1 1 0 setrgbcolor 1 setlinewidth 1 2 moveto 3 4 lineto stroke grestore\n",
                run({src: {x: 1, y: 2}, dst: {x: 3, y: 4}, stroke: {r: 255, g: 255, b: 0}, strokeWidth: 1}));
        });
    });
});
