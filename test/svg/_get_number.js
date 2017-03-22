var assert = require('assert');
const test = require('../../src/svg');
const d3 = require('../../src/libs/d3.v4.min');
require('../init').init();


var tags = ["circle", "ellipse", "line", "path", "polygon", "polyline", "rect"];
var attributes = {
    circle: ["cx", "cy", "r", "stroke-width"],
    ellipse: ["cx", "cy", "rx", "ry", "stroke-width"],
    line: ["x1", "x2", "y1", "y2", "stroke-width"],
    path: ["stroke-width"],
    polygon: ["stroke-width"],
    polyline: ["stroke-width"],
    rect: ["x", "y", "width", "height", "rx", "ry", "stroke-width"],
    text: ["x", "y"]
};
var styles = {
    circle: ["stroke-width", "opacity"],
    ellipse: ["stroke-width", "opacity"],
    line: ["stroke-width", "opacity"],
    path: ["stroke-width", "opacity"],
    polygon: ["stroke-width", "opacity"],
    polyline: ["stroke-width", "opacity"],
    rect: ["stroke-width", "opacity"],
    text: ["font-size", "opacity"]
};

function generate() {
    var t = tags[Math.floor(Math.random() * tags.length)];
    var a = attributes[t][Math.floor(Math.random() * attributes[t].length)];
    var s = styles[t][Math.floor(Math.random() * styles[t].length)];
    var v = Math.random()*200 - 100;
    var vs = "" + v;
    if (a != "opacity")
        vs += "px";
    var elem = d3.select("svg").append(t);
    if (Math.random() < 0.5) {
        if (Math.random() < 0.5)
            elem.attr(a, vs);
    } else {
        if (Math.random() < 0.5)
            elem.style(s, vs);
    }
    return {expected: v, i: {elem: elem, attr: a}};
}

function run(elem, attr, dv) {
    return test.SVG._get_number(elem, attr, dv);
}

describe('svg', function() {
    describe('_get_number', function() {
        it('should parse number from attribute', function() {
            this.timeout(5000);
            for (var k=0; k<100; k++) {
                var res = generate();
                assert.deepEqual(res.expected, run(res.i.elem, res.i.attr, res.expected));
                d3.select("svg").html("");
            }
        });
    });
});
