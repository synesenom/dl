var assert = require('assert');
const test = require('../../src/svg');
const d3 = require('../../src/libs/d3.v4.min');
require('../init').init();

function generate() {
    var c1 = Math.random()*10-20;
    var c2 = Math.random()*10-20;
    var input = c1 + " " + c2;
    var output = [{x: c1, y: c2}];
    var length = Math.floor(Math.random()*100);
    for (var i=0; i<length; i++) {
        c1 = Math.random()*10-20;
        c2 = Math.random()*10-20;
        input += (Math.random() < 0.5 ? "," : " ") + c1;
        input += (Math.random() < 0.5 ? "," : " ") + c2;
        output.push({x: c1, y: c2});
    }

    return {
        i: input,
        o: output
    };
}

describe('svg', function() {
    describe('_get_points', function() {
        it('should parse SVG points attribute', function() {
            for (var n=0; n<1000; n++) {
                var res = generate();
                d3.select("svg").html("");
                d3.select("svg").append("polygon").attr("points", res.i);
                d3.select("svg").append("polyline").attr("points", res.i);
                assert.deepEqual(test.SVG._get_points(d3.select("polygon")), res.o);
                assert.deepEqual(test.SVG._get_points(d3.select("polyline")), res.o);
            }
        });
    });
});