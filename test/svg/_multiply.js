var assert = require('assert');
var test = require('../../src/svg');

function mult(x, y) {
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

describe('svg', function() {
    describe('_multiply', function() {
        it('multiplies two transformation matrices', function() {
            for (var i=0; i<1000; i++) {
                var x = [], y = [];
                for (var j=0; j<6; j++) {
                    x.push(Math.random()*20-10);
                    y.push(Math.random()*20-10);
                }
                var z = mult(
                    [x[0], x[2], x[4], x[1], x[3], x[5], 0, 0, 1],
                    [y[0], y[2], y[4], y[1], y[3], y[5], 0, 0, 1]
                );
                assert.deepEqual(test.SVG._multiply(x, y), [z[0], z[3], z[1], z[4], z[2], z[5]]);
            }
        });
    });
});
