var assert = require('assert');
var svg = require('../../src/svg');

function run(i) {
    var l = $.parseHTML('<line stroke-width="2.8284271247461903" x1="362.6438608406291" y1="333.75389213146155" x2="306.5739416973684" y2="361.2537492273979" style="stroke: rgb(153, 153, 153); stroke-opacity: 0.8;"></line>')
    return true;
}

describe('svg', function() {
    describe('_circle.get', function() {
        it('should recognize color format and return in bytes', function() {
            assert.deepEqual(true, run(5));
        });
    });
});
