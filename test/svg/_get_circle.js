var assert = require('assert');
const test = require('../../src/svg');
const d3 = require('../../src/libs/d3.v4.min');
require('../init').init();

var attributes = [
    "cx", "cy", "r", "stroke", "strokeWidth", "fill", "opacity"
];

/*
TODO
describe('svg', function() {
    describe('_get_circle', function() {
        it('should retrieve circle attributes', function() {
            for (var i=0; i<100; i++) {
                d3.select("svg").html("");
                var e = d3.select("svg").append("circle");
                var output = {};
                for (var j=0; j<7; j++) {
                    if (Math.random() < 0.5) {
                        var a = attributes[j];
                        var v = "";
                        switch (a) {
                            case "cx":
                            case "cy":
                                v = Math.random() < 0.5 ? Math.random()*10 - 20 : 0;
                                break;
                            case "r":
                            case "strokeWidth":
                                v = Math.random()*10;
                                break;
                            case "stroke":
                            case "fill":
                                if (Math.random() < 0.5) {
                                }
                        }
                    }
                }
            }

            for (var n=0; n<10; n++) {
                d3.select("svg").html("");
                d3.select("svg").append("path")
                    .attr("d", res.d);
                assert.deepEqual(test.SVG._get_path(d3.select("path"), "d"),
                    res.expected);
            }
        });
    });
});
*/