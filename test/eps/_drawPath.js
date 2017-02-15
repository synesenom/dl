var assert = require('assert');
var test = require('../../src/eps');

function run(i) {
    var eps = new test.EPS({width: 10, height: 10});
    return eps._drawPath(i);
}

describe('eps', function() {
    describe('_drawPath.get', function() {
        it('draws a valid postscript path command', function() {
            // fill only
            assert.equal("gsave newpath 1 1 1 setrgbcolor 1 2 moveto 3 4 lineto 5 6 lineto closepath fill grestore\n",
                run({corners: [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
                    fill: {r: 255, g: 255, b: 255}, stroke: null, strokeWidth: 2, closed: true}));
            assert.equal("gsave newpath 1 1 1 setrgbcolor 1 2 moveto 3 4 lineto 5 6 lineto closepath fill grestore\n",
                run({corners: [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
                    fill: {r: 255, g: 255, b: 255}, stroke: null, strokeWidth: null, closed: true}));
            assert.equal("gsave newpath 1 1 1 setrgbcolor 1 2 moveto 3 4 lineto 5 6 lineto fill grestore\n",
                run({corners: [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
                    fill: {r: 255, g: 255, b: 255}, stroke: null, strokeWidth: 2, closed: false}));
            assert.equal("gsave newpath 1 1 1 setrgbcolor 1 2 moveto 3 4 lineto 5 6 lineto fill grestore\n",
                run({corners: [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
                    fill: {r: 255, g: 255, b: 255}, stroke: null, strokeWidth: null, closed: false}));

            // stroke only
            assert.equal("gsave newpath 1 1 1 setrgbcolor 2 setlinewidth 1 2 moveto 3 4 lineto 5 6 lineto closepath stroke grestore\n",
                run({corners: [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
                    fill: null, stroke: {r: 255, g: 255, b: 255}, strokeWidth: 2, closed: true}));
            assert.equal("gsave newpath 1 1 1 setrgbcolor 2 setlinewidth 1 2 moveto 3 4 lineto 5 6 lineto stroke grestore\n",
                run({corners: [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
                    fill: null, stroke: {r: 255, g: 255, b: 255}, strokeWidth: 2, closed: false}));

            // fill + stroke
            assert.equal("gsave newpath 1 1 1 setrgbcolor 1 2 moveto 3 4 lineto 5 6 lineto closepath gsave fill grestore 1 1 1 setrgbcolor 2 setlinewidth stroke grestore\n",
                run({corners: [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
                    fill: {r: 255, g: 255, b: 255}, stroke: {r: 255, g: 255, b: 255}, strokeWidth: 2, closed: true}));
            assert.equal("gsave newpath 1 1 1 setrgbcolor 1 2 moveto 3 4 lineto 5 6 lineto gsave fill grestore 1 1 1 setrgbcolor 2 setlinewidth stroke grestore\n",
                run({corners: [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}],
                    fill: {r: 255, g: 255, b: 255}, stroke: {r: 255, g: 255, b: 255}, strokeWidth: 2, closed: false}));
        });
    });
});
