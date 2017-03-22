var assert = require('assert');
const test = require('../../src/svg');
const d3 = require('../../src/libs/d3.v4.min');
global.jsdom = require('jsdom').jsdom;

global.document = jsdom('<html><body><svg></svg></body></html>');
global.window = global.document.parentWindow;

function run(i) {
    // Add SVG
    d3.select("path").remove();
    d3.select('svg').append('path')
        .attr("d", i);

    // Test unit
    var elem = d3.select("path");
    return test.SVG._get_path(elem, "d");
}

describe('svg', function() {
    describe('_get_path', function() {
        it('should parse SVG path d attribute', function() {
            assert.deepEqual(run("M1 2,L3 4, l-2 2.3 m 0.54 4 H 3 V 6"),
                [[{x: 1, y: 2}, {x: 3, y: 4}, {x: 1, y: 6.3}], [{x: 1.54, y: 10.3}, {x: 3, y: 10.3}, {x: 3, y: 6}]]);
            assert.deepEqual(run("M1,2 L3,4 l -2,2.3"), [[{x: 1, y: 2}, {x: 3, y: 4}, {x: 1, y: 6.3}]]);
            assert.deepEqual(run("M1 2 L3 4 l -2 2.3"), [[{x: 1, y: 2}, {x: 3, y: 4}, {x: 1, y: 6.3}]]);
        });
    });
});
