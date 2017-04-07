var assert = require('assert');
var test = require('../../src/eps');

var testCases = [
    {i: {pos: {x: 1, y: 2}, radius: 3, fill: {r: 255, g: 255, b: 255}, stroke: null, strokeWidth: 2},
    o: "gsave newpath 1 1 1 setrgbcolor 1 2 3 0 360 arc closepath fill grestore\n"},
    {i: {pos: {x: 1, y: 2}, radius: 3, fill: {r: 255, g: 255, b: 255}, stroke: {r: 0, g: 0, b: 0}, strokeWidth: null},
    o: "gsave newpath 1 1 1 setrgbcolor 1 2 3 0 360 arc closepath fill grestore\n"},
    {i: {pos: {x: 1, y: 2}, radius: 3, fill: null, stroke: {r: 255, g: 255, b: 255}, strokeWidth: 2},
    o: "gsave newpath 1 1 1 setrgbcolor 2 setlinewidth 1 2 3 0 360 arc closepath stroke grestore\n"},
    {i: {pos: {x: 1, y: 2}, radius: 3, fill: {r: 255, g: 255, b: 255}, stroke: {r: 255, g: 255, b: 255}, strokeWidth: 2},
    o: "gsave newpath 1 1 1 setrgbcolor 1 2 3 0 360 arc closepath gsave fill grestore 1 1 1 setrgbcolor 2 setlinewidth stroke grestore\n"}
];

describe('eps', function() {
    describe('_drawCircle', function() {
        it('draws a valid postscript circle command', function() {
            var eps = new test.EPS({width: 10, height: 10});

            testCases.forEach(function (t) {
                assert.equal(eps._drawCircle(t.i), t.o);
            });
        });
    });
});
