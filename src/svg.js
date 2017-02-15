// Imports
if (typeof module != "undefined") {
    var d3 = require('../src/libs/d3.v4.min');
}

/**
 * Class for parsing SVG elements.
 */
const SVG = {
    // Shapes
    _circle: function(elem) {

    },

    ellipse: function(elem) {

    },

    line: function(elem) {
        // TODO read attributes
    },

    path: function(elem) {

    },

    polygon: function () {

    },

    polyline: function () {

    },

    rect: function(elem) {

    },


    g: function(elem) {

    },

    children: function (elem) {
        return elem.selectAll(function(){ return this.childNodes; });
    },

    // TODO traverse the whole svg and parse
    parse: function(selector) {

    }
};

// Export if we have module
if (typeof module != "undefined" && typeof module.exports == "object")
    module.exports.SVG = SVG;