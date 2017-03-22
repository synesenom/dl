var assert = require('assert');
const test = require('../../src/svg');
const d3 = require('../../src/libs/d3.v4.min');
require('../init').init();


function generate() {
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

    // Create all combinations
    var res = [];
    tags.forEach(function(t) {
        // Attributes
        attributes[t].forEach(function(a) {
            var v = Math.random()*200 - 100;
            var vs = v + "px";
            var elem = d3.select("svg").append(t);
            elem.attr(a, vs);
            res.push({expected: v, i: {elem: elem, attr: a}});
        });

        // Styles
        styles[t].forEach(function(a) {
            var v = Math.random()*200 - 100;
            var elem = d3.select("svg").append(t);
            var vs = "" + v;
            if (a != "opacity")
                vs += "px";
            elem.style(a, vs);
            res.push({expected: v, i: {elem: elem, attr: a}});
        });
        // Empty
        attributes[t].forEach(function (a) {
            var v = Math.random() * 200 - 100;
            var elem = d3.select("svg").append(t);
            res.push({expected: v, i: {elem: elem, attr: a}});
        });
        styles[t].forEach(function (a) {
            var v = Math.random() * 200 - 100;
            var elem = d3.select("svg").append(t);
            res.push({expected: v, i: {elem: elem, attr: a}});
        });
    });
    return res;
}

function run(elem, attr, dv) {
    return test.SVG._get_number(elem, attr, dv);
}

describe('svg', function() {
    describe('_get_number', function() {
        it('should parse number from attribute', function() {
            var res = generate();
            res.forEach(function(r) {
                assert.deepEqual(r.expected, run(r.i.elem, r.i.attr, r.expected));
            });
        });
    });
});
