const d3 = require('../src/libs/d3.v4.min');

exports.init = function() {
    // Build DOM
    if (!global.document) {
        global.jsdom = require('jsdom').jsdom;
        global.document = jsdom('<html><body><svg></svg></body></html>');
        global.window = global.document.parentWindow;
    }

    // Clear SVG
    d3.select("svg").html("");
};

