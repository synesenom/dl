var assert = require('assert');
var test = require('../../src/svg');

function mult(m, v) {
    return [
        m[0]*v[0]+m[1]*v[1]+m[2]*v[2],
        m[3]*v[0]+m[4]*v[1]+m[5]*v[2],
        m[6]*v[0]+m[7]*v[1]+m[8]*v[2]
    ];
}

describe('svg', function() {
    describe('_transform', function() {
        it('multiplies a coordinate vector with a transformation matrix', function() {
            for (var i=0; i<1000; i++) {
                var m = [], v = [];
                for (var j=0; j<6; j++) {
                    m.push(Math.random()*20-10);
                }
                for (j=0; j<2; j++) {
                    v.push(Math.random()*20-10);
                }
                var u = mult(
                    [m[0], m[2], m[4], m[1], m[3], m[5], 0, 0, 1],
                    [v[0], v[1], 1]
                );
                assert.deepEqual(test.SVG._transform(m, v), [u[0], u[1]]);
            }
        });
    });
});
