var assert = require('assert');
const test = require('../../src/svg');
const d3 = require('../../src/libs/d3.v4.min');
require('../init').init();


// TODO make this unit test more realistic (much more values and formats!)
var tags = ["circle", "ellipse", "line", "path", "polygon", "polyline", "rect", "text"];
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
var values = {
    cx: [-1.2, 0],
    cy: [-1.2, 0],
    x: [-1.2, 0],
    x1: [-1.2, 0],
    x2: [-1.2, 0],
    y: [-1.2, 0],
    y1: [-1.2, 0],
    y2: [-1.2, 0],
    r: [10.2],
    rx: [10.2],
    ry: [10.2],
    width: [10.2],
    height: [10.2],
    "stroke-width": [10.2],
    opacity: [0.3, 0],
    "font-size": [10]
};

describe('svg', function() {
    describe('_get_number', function() {
        it('should parse number from attribute', function() {
            tags.forEach(function(t) {
                attributes[t].forEach(function(a) {
                    values[a].forEach(function(v) {
                        // valid attribute
                        var e1 = d3.select("svg").append(t);
                        e1.attr(a, v);
                        assert.deepEqual(test.SVG._get_number(e1, a, null), v);

                        // empty attribute
                        var e2 = d3.select("svg").append(t);
                        assert.deepEqual(test.SVG._get_number(e2, a, 2*v), 2*v);
                    });
                });

                styles[t].forEach(function(a) {
                    values[a].forEach(function(v) {
                        // valid attribute
                        var e1 = d3.select("svg").append(t);
                        e1.style(a, a != "opacity" ? v + "px" : v);
                        assert.deepEqual(test.SVG._get_number(e1, a, null), v);

                        // empty attribute
                        var e2 = d3.select("svg").append(t);
                        assert.deepEqual(test.SVG._get_number(e2, a, 2*v), 2*v);
                    });
                });
            });
            d3.select("svg").html("");
        });
    });
});
