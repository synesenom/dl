var assert = require('assert');
const test = require('../../src/svg');
const d3 = require('../../src/libs/d3.v4.min');
require('../init').init();


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

describe('svg', function() {
    describe('_get_number', function() {
        it('should parse number from attribute', function() {
            for (var i=0; i<100; i++) {
                var t = tags[Math.floor(Math.random()*tags.length)];
                var e = d3.select("svg").append(t);
                var v = Math.random() < 0.1 ? 0 : Math.random()*10;
                if (Math.random() < 0.333) {
                    var a = attributes[t][Math.floor(Math.random()*attributes[t].length)];
                    if (a != "r" && a != "rx" && a != "ry"
                        && a != "width" && a != "height"
                        && a != "stroke-width"
                        && a != "opacity" && a != "font-size")
                        v = (Math.random() < 0.5 ? -v : v);
                    e.attr(a, v);
                    assert.deepEqual(test.SVG._get_number(e, a, null), v);
                } else if (Math.random() < 0.5) {
                    var a = styles[t][Math.floor(Math.random()*styles[t].length)];
                    if (a != "r" && a != "rx" && a != "ry"
                        && a != "width" && a != "height"
                        && a != "stroke-width"
                        && a != "opacity" && a != "font-size")
                        v = (Math.random() < 0.5 ? -v : v);
                    e.style(a, v + (a != "opacity" ? "px" : ""));
                    assert.deepEqual(test.SVG._get_number(e, a, null), v);
                } else {
                    v = Math.random()*20 - 10;
                    assert.deepEqual(
                        test.SVG._get_number(e, attributes[t][Math.floor(Math.random()*attributes[t].length)], v),
                        v);
                }
            }
            d3.select("svg").html("");
        });
    });
});
