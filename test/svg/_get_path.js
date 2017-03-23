var assert = require('assert');
const test = require('../../src/svg');
const d3 = require('../../src/libs/d3.v4.min');
require('../init').init();


function generate() {
    var point = {x: 0, y: 0};
    var part = [{x: 0, y: 0}];
    var expected = [part];
    var d = "M 0 0";
    var pen = "MmLlHhVv";
    var sep = " ,";
    for (var k=0; k<100; k++) {
        var p = pen.charAt(Math.floor(Math.random() * pen.length));
        var s = [
            sep.charAt(Math.floor(Math.random() * sep.length)),
            sep.charAt(Math.floor(Math.random() * sep.length)),
            sep.charAt(Math.floor(Math.random() * sep.length))
        ];
        var x = Math.random()*200 - 100;
        var y = Math.random()*200 - 100;
        d += s[0] + p + s[1] + x;
        if ("MmLl".indexOf(p) > -1)
            d += s[2] + y;

        switch (p) {
            case "M":
                point = {x: x, y: y};
                part = [{x: x, y: y}];
                expected.push(part);
                break;
            case "m":
                part = [{x: point.x+x, y: point.y+y}];
                expected.push(part);
                point = {x: point.x+x, y: point.y+y};
                break;
            case "L":
                part.push({x: x, y: y});
                point = {x: x, y: y};
                break;
            case "l":
                part.push({x: point.x+x, y: point.y+y});
                point = {x: point.x+x, y: point.y+y};
                break;
            case "H":
                part.push({x: x, y: point.y});
                point = {x: x, y: point.y};
                break;
            case "h":
                part.push({x: point.x+x, y: point.y});
                point = {x: point.x+x, y: point.y};
                break;
            case "V":
                part.push({x: point.x, y: x});
                point = {x: point.x, y: x};
                break;
            case "v":
                part.push({x: point.x, y: point.y+x});
                point = {x: point.x, y: point.y+x};
                break;
        }
    }

    return {
        expected: expected,
        d: d
    };
}

function run(d) {
    d3.select("svg").html("");
    d3.select("svg").append("path")
        .attr("d", d);
    return test.SVG._get_path(d3.select("path"), "d");
}

// TODO simplify code
describe('svg', function() {
    describe('_get_path', function() {
        it('should parse SVG path d attribute', function() {
            for (var n=0; n<10; n++) {
                var res = generate();
                assert.deepEqual(run(res.d), res.expected);
            }
        });
    });
});
