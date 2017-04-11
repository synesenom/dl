var assert = require('assert');
const draw = require('../../src/draw');

var LAPS = 10000;

describe('draw', function() {
    describe('svg', function() {
        describe('integer()', function () {
            it('should return a random content of type integer', function () {
                for (var lap = 0; lap < LAPS; lap++) {
                    assert.equal(true, /^[+-]?[0-9]+$/.test(draw.svg.integer()));
                }
            });
        });

        describe('number()', function () {
            it('should return a random content of type number', function () {
                for (var lap = 0; lap < LAPS; lap++) {
                    assert.equal(true, /^[+-]?[0-9]*\.?[0-9]+([Ee][+-]?[0-9]+)?$/.test(draw.svg.number()));
                }
            });
        });

        describe('length()', function () {
            it('should return a random content of type length', function () {
                for (var lap = 0; lap < LAPS; lap++) {
                    assert.equal(true,
                        /^[+-]?[0-9]*\.?[0-9]+([Ee][+-]?[0-9]+)?(em|ex|px|in|cm|mm|pt|pc|%)?$/.test(
                            draw.svg.length(Math.random() < 0.5)
                        ));
                }
            });
        });

        describe('coordinate()', function () {
            it('should return a random content of type coordinate', function () {
                for (var lap = 0; lap < LAPS; lap++) {
                    assert.equal(true,
                        /^[+-]?[0-9]*\.?[0-9]+([Ee][+-]?[0-9]+)?(em|ex|px|in|cm|mm|pt|pc|%)?$/.test(
                            draw.svg.coordinate()
                        ));
                }
            });
        });
    });
});
