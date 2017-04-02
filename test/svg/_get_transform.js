var assert = require('assert');
const test = require('../../src/svg');
const d3 = require('../../src/libs/d3.v4.min');
require('../init').init();

var transforms = [
    "matrix",
    "translate",
    "scale",
    "rotate",
    "skewX",
    "skewY"
];
var parameters = {
    matrix: {min: 6, max: 6},
    translate: {min: 1, max: 2},
    scale: {min: 1, max: 2},
    rotate: {min:1, max: 3},
    skewX: {min: 1, max: 1},
    skewY: {min: 1, max: 1}
};

function generate() {
    var transform = "";
    for (var i=0; i<transforms.length; i++) {
        var t = transforms[i];
        var p = Math.floor(Math.random() * (parameters[t].max-parameters[t].min)) + parameters[t].min;
        transform += transforms[i] + "(";
        transform += Math.random()*20 - 10;
        for (var j=1; j<p; j++) {
            transform += Math.random() < 0.5 ? "," : " ";
        }
        transform += ") ";
    }
    return {
        i: transform,
        o: null
    };
}

describe('svg', function() {
    describe('_get_transform', function() {
        it('should parse SVG transform attribute', function() {
            for (var n=0; n<10; n++) {
                var res = generate();
                d3.select("svg").html("");
                d3.select("svg").append("g")
                    .attr("transform", res.i);
                //assert.deepEqual(test.SVG._get_path(d3.select("path"), "d"),
                //    res.expected);
            }
        });
    });
});