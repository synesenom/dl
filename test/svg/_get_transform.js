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
    matrix: [6],
    translate: [1, 2],
    scale: [1, 2],
    rotate: [1, 3],
    skewX: [1],
    skewY: [1]
};

function mm(x, y) {
    return [
        x[0]*y[0]+x[1]*y[3]+x[2]*y[6],
        x[0]*y[1]+x[1]*y[4]+x[2]*y[7],
        x[0]*y[2]+x[1]*y[5]+x[2]*y[8],
        x[3]*y[0]+x[4]*y[3]+x[5]*y[6],
        x[3]*y[1]+x[4]*y[4]+x[5]*y[7],
        x[3]*y[2]+x[4]*y[5]+x[5]*y[8],
        x[6]*y[0]+x[7]*y[3]+x[8]*y[6],
        x[6]*y[1]+x[7]*y[4]+x[8]*y[7],
        x[6]*y[2]+x[7]*y[5]+x[8]*y[8]
    ];
}

function generate() {
    var output = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    var input = "";
    for (var i=0; i<6; i++) {
        if (Math.random() < 0.5) {
            var mi = [];

            // Transformation
            var t = transforms[i];
            input += t + "(";

            // First value
            var v = Math.random()*20 - 10;
            input += v;
            mi.push(v);

            // Rest of the values
            var p = parameters[t][Math.floor(Math.random() * parameters[t].length)];
            for (var j=1; j<p; j++) {
                input += Math.random() < 0.5 ? "," : " ";
                v = Math.random()*20 - 10;
                input += v;
                mi.push(v);
            }
            input += ") ";

            // Build matrix and multiply output
            var m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            switch (t) {
                case "matrix":
                    m = [mi[0], mi[2], mi[4], mi[1], mi[3], mi[5], 0, 0, 1];
                    break;
                case "translate":
                    m = [1, 0, mi[0], 0, 1, 0, 0, 0, 1];
                    if (mi.length == 2)
                        m[5] = mi[1];
                    break;
                case "scale":
                    m = [mi[0], 0, 0, 0, mi[0], 0, 0, 0, 1];
                    if (mi.length == 2)
                        m[4] = mi[1];
                    break;
                case "rotate":
                    m = [Math.cos(mi[0]), -Math.sin(mi[0]), 0, Math.sin(mi[0]), Math.cos(mi[0]), 0, 0, 0, 1];
                    if (mi.length == 3) {
                        var tl = [1, 0, mi[1], 0, 1, mi[2], 0, 0, 1];
                        var tr = [1, 0, -mi[1], 0, 1, -mi[2], 0, 0, 1];
                        m = mm(tl, mm(m, tr));
                    }
                    break;
                case "skewX":
                    m = [1, Math.tan(mi[0]), 0, 0, 1, 0, 0, 0, 1];
                    break;
                case "skewY":
                    m = [1, 0, 0, Math.tan(mi[0]), 1, 0, 0, 0, 1];
                    break;
                default:
                    m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            }

            // Update output
            output = mm(output, m);
        }
    }
    output = [
        output[0],
        output[3],
        output[1],
        output[4],
        output[2],
        output[5]
    ];

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