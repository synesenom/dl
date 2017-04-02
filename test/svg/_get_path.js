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
        var c1 = Math.random()*200 - 100;
        var c2 = Math.random()*200 - 100;
        d += s[0] + p + s[1] + c1;
        if ("MmLl".indexOf(p) > -1)
            d += s[2] + c2;

        switch (p) {
            case "M":
                point = {x: c1, y: c2};
                part = [{x: c1, y: c2}];
                expected.push(part);
                break;
            case "m":
                part = [{x: point.x+c1, y: point.y+c2}];
                expected.push(part);
                point = {x: point.x+c1, y: point.y+c2};
                break;
            case "L":
                part.push({x: c1, y: c2});
                point = {x: c1, y: c2};
                break;
            case "l":
                part.push({x: point.x+c1, y: point.y+c2});
                point = {x: point.x+c1, y: point.y+c2};
                break;
            case "H":
                part.push({x: c1, y: point.y});
                point = {x: c1, y: point.y};
                break;
            case "h":
                part.push({x: point.x+c1, y: point.y});
                point = {x: point.x+c1, y: point.y};
                break;
            case "V":
                part.push({x: point.x, y: c1});
                point = {x: point.x, y: c1};
                break;
            case "v":
                part.push({x: point.x, y: point.y+c1});
                point = {x: point.x, y: point.y+c1};
                break;
        }
    }

    return {
        expected: expected,
        d: d
    };
}

describe('svg', function() {
    describe('_get_path', function() {
        it('should parse SVG path d attribute', function() {
            for (var n=0; n<10; n++) {
                var res = generate();
                d3.select("svg").html("");
                d3.select("svg").append("path")
                    .attr("d", res.d);
                assert.deepEqual(test.SVG._get_path(d3.select("path"), "d"),
                    res.expected);
            }
        });
    });
});
