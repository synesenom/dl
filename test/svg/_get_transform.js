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
    var output = [];
    var input = "";
    for (var i=0; i<transforms.length; i++) {
        if (Math.random() < 0.5) {
            // Transformation
            var t = transforms[i];
            input += t + "(";
            output.push([t]);

            // First value
            var v = Math.random()*20 - 10;
            input += v;
            output[output.length-1].push(v);

            // Rest of the values
            var p = Math.floor(Math.random() * (parameters[t].max-parameters[t].min)) + parameters[t].min;
            for (var j=1; j<p; j++) {
                input += Math.random() < 0.5 ? "," : " ";
                v = Math.random()*20 - 10;
                input += v;
                output[output.length-1].push(v);
            }
            input += ") ";
        }
    }

    return {
        i: input,
        o: output
    };
}

describe('svg', function() {
    describe('_get_transform', function() {
        it('should parse SVG transform attribute', function() {
            for (var n=0; n<1000; n++) {
                var res = generate();
                d3.select("svg").html("");
                d3.select("svg").append("g")
                    .attr("transform", res.i);
                assert.deepEqual(test.SVG._get_transform(d3.select("g")), res.o);
            }
        });
    });
});