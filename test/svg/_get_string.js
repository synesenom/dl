var assert = require('assert');
const test = require('../../src/svg');
const d3 = require('../../src/libs/d3.v4.min');
require('../init').init();


var tags = ["circle", "ellipse", "line", "path", "polygon", "polyline", "rect"];
var attributes = {
    circle: ["stroke", "fill"],
    ellipse: ["stroke", "fill"],
    line: ["stroke"],
    path: ["stroke", "fill"],
    polygon: ["stroke", "fill"],
    polyline: ["stroke"],
    rect: ["stroke", "fill"],
    text: ["test-anchor", "font-family", "fill"]
};
var values = {
    stroke: ["rgb(1, 2, 3)", "white", "#fff"],
    fill: ["rgb(1, 2, 3)", "white", "#fff"],
    "test-anchor": ["begin"],
    "font-family": ["'Arial'"]
};

describe('svg', function() {
    describe('_get_string', function() {
        it('should parse string from attribute', function() {
            this.timeout(5000);
            tags.forEach(function(t) {
                attributes[t].forEach(function(a) {
                    values[a].forEach(function(v) {
                        // attribute
                        var e1 = d3.select("svg").append(t);
                        e1.attr(a, v);
                        assert.deepEqual(test.SVG._get_string(e1, a, null), v);

                        // style
                        var e2 = d3.select("svg").append(t);
                        e2.style(a, v);
                        assert.deepEqual(test.SVG._get_string(e2, a, null), v);

                        // empty
                        var e3 = d3.select("svg").append(t);
                        assert.deepEqual(test.SVG._get_string(e3, a, "string"), "string");
                    });
                });
            });
            d3.select("svg").html("");
        });
    });
});
