var assert = require("assert");
const svg = require("../../src/pick").svg;

var LAPS = 10000;

describe("pick", function() {
    describe("svg", function() {
        describe("integer()", function () {
            it("should return a random <integer>", function () {
                for (var lap = 0; lap < LAPS; lap++) {
                    assert.equal(true, /^[+-]?[0-9]+$/.test(svg.integer()));
                }
            });
        });

        describe("number()", function () {
            it("should return a random <number>", function () {
                for (var lap = 0; lap < LAPS; lap++) {
                    assert.equal(true, /^[+-]?[0-9]*\.?[0-9]+([Ee][+-]?[0-9]+)?$/.test(svg.number()));
                }
            });
        });

        describe("length()", function () {
            it("should return a random <length>", function () {
                for (var lap = 0; lap < LAPS; lap++) {
                    assert.equal(true,
                        /^[+-]?[0-9]*\.?[0-9]+([Ee][+-]?[0-9]+)?(em|ex|px|in|cm|mm|pt|pc|%)?$/.test(
                            svg.length(Math.random() < 0.5)
                        ));
                }
            });
        });

        describe("coordinate()", function () {
            it("should return a random <coordinate>", function () {
                for (var lap = 0; lap < LAPS; lap++) {
                    assert.equal(true,
                        /^[+-]?[0-9]*\.?[0-9]+([Ee][+-]?[0-9]+)?(em|ex|px|in|cm|mm|pt|pc|%)?$/.test(
                            svg.coordinate()
                        ));
                }
            });
        });

        describe("color()", function () {
            it("should return a random <color>", function () {
                for (var lap = 0; lap < LAPS; lap++) {
                    var re = new RegExp("^(#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})" +
                        "|(red|green|blue)" +
                        "|rgb\\(\\d+%?,\\d+%?,\\d+%?(,\\d*.?\\d+)?\\))$");
                    assert.equal(true, re.test(svg.color()));
                }
            });
        });

        describe("opacityValue()", function () {
            it("should return a random <opacity-value>", function () {
                for (var lap = 0; lap < LAPS; lap++) {
                    assert.equal(true, /^[0-9]*\.?[0-9]+$/.test(svg.opacityValue()));
                }
            });
        });
    });
});
