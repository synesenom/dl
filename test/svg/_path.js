var assert = require('assert');
var test = require('../../src/svg');

function run(i) {
    return test.SVG._path(i);
}

describe('svg', function() {
    describe('_path', function() {
        it('should parse SVG path d attribute', function() {
            assert.deepEqual(run("M1 2,L3 4, l-2 2.3 m 0.54 4 H 3 V 6"),
                [[{x: 1, y: 2}, {x: 3, y: 4}, {x: 1, y: 6.3}], [{x: 1.54, y: 10.3}, {x: 3, y: 10.3}, {x: 3, y: 6}]]);
            assert.deepEqual(run("M1,2 L3,4 l -2,2.3"), [[{x: 1, y: 2}, {x: 3, y: 4}, {x: 1, y: 6.3}]]);
            assert.deepEqual(run("M1 2 L3 4 l -2 2.3"), [[{x: 1, y: 2}, {x: 3, y: 4}, {x: 1, y: 6.3}]]);
        });
    });
});
