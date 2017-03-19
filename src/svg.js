// Imports
if (typeof module != "undefined") {
    var d3 = require('../src/libs/d3.v4.min');
}


/**
 * Class for parsing SVG elements.
 */
const SVG = {
    // MLVHQTCSAZ
    PATH: [
        'M', 'm',
        'L', 'l',
        'H', 'h',
        'V', 'v'
    ],

    _coord: function(e, attr) {
        return e.attr(attr) ? e.attr(attr) : 0;
    },

    _points: function(e) {
        var points = e.attr("points").replace(/\s+/g, " ").split(" ");
        var coords = [];
        if (points && points.length > 0) {
            points.forEach(function(p) {
                var c = p.split(",");
                coords.push({x: +c[0], y: +c[1]});
            });
        }
        return coords;
    },

    _path: function(attr) {
        // Remove commas and multiple whitespace
        var attr_clean = attr.replace(/,/g, " ").replace(/\s+/g, " ");

        // Remove space from around commands
        this.PATH.forEach(function (c) {
            var re = new RegExp("\\s*" + c + "\\s*", "g");
            attr_clean = attr_clean.replace(re, c);
        });

        // Break command line into individual commands
        var commands = attr_clean.match(/([MmLlHhVv])([^MmLlHhVv]*)/gi);

        // Perform commands
        var p = {x: 0, y: 0};
        var segments = [];
        if (commands && commands.length > 0) {
            var piece = [];
            commands.forEach(function(comm) {
                // Get pen
                var c = comm.trim().split(' ');
                var pen = c[0].charAt(0);

                // Get coordinates
                var c1 = +c[0].substr(1);
                var c2;
                if ('MmLl'.indexOf(pen) > -1) {
                    c2 = +c[1];
                }

                // Update pen
                switch (pen) {
                    // Move to
                    case 'M':
                    case 'm':
                        if (pen == 'm') {
                            p.x += c1;
                            p.y += c2;
                        } else {
                            p.x = c1;
                            p.y = c2;
                        }
                        piece = [];
                        piece.push({x: p.x, y: p.y});
                        segments.push(piece);
                        break;
                    // Line to
                    case 'L':
                    case 'l':
                        if (pen == 'l') {
                            p.x += c1;
                            p.y += c2;
                        } else {
                            p.x = c1;
                            p.y = c2;
                        }
                        piece.push({x: p.x, y: p.y});
                        break;
                    // Horizontal line to
                    case 'H':
                    case 'h':
                        if (pen == 'h') {
                            p.x += c1;
                        } else {
                            p.x = c1;
                        }
                        piece.push({x: p.x, y: p.y});
                        break;
                    // Vertical line to
                    case 'V':
                    case 'v':
                        if (pen == 'v') {
                            p.y += c1;
                        } else {
                            p.y = c1;
                        }
                        piece.push({x: p.x, y: p.y});
                        break;
                }
            });
        }
        return segments;
    },

    _color: function(e, attr) {
        return e.attr(attr) ? e.attr(attr) : e.style(attr);
    },

    _strokeWidth: function(e) {
        var value = e.attr("stroke-width") != null ? e.attr("stroke-width") : e.style("stroke-width");
        var strokeWidth = value.match(/(\d+(\.\d+)?)/g);
        if (strokeWidth.length > 0)
            return strokeWidth;
        else
            return 0;
    },

    // Shapes
    circle: function(elem) {
        return {
            cx: this._coord(elem, "cx"),
            cy: this._coord(elem, "cy"),
            r: this._coord(elem, "r"),
            stroke: this._color(elem, "stroke"),
            strokeWidth: this._strokeWidth(elem),
            fill: this._color(elem, "fill")
        };
    },

    ellipse: function(elem) {
        return {
            cx: this._coord(elem, "cx"),
            cy: this._coord(elem, "cy"),
            rx: this._coord(elem, "rx"),
            ry: this._coord(elem, "ry"),
            stroke: this._color(elem, "stroke"),
            strokeWidth: this._strokeWidth(elem),
            fill: this._color(elem, "fill")
        };
    },

    line: function(elem) {
        return {
            x1: this._coord(elem, "x1"),
            y1: this._coord(elem, "y1"),
            x2: this._coord(elem, "x2"),
            y2: this._coord(elem, "y2"),
            stroke: this._color(elem, "stroke"),
            strokeWidth: this._strokeWidth(elem)
        };
    },

    path: function(elem) {
        return {
            points: 0,
            stroke: this._color(elem, "stroke"),
            strokeWidth: this._strokeWidth(elem),
            fill: this._color(elem, "fill")
        };
    },

    polygon: function (elem) {
        return {
            points: this._points(elem),
            stroke: this._color(elem, "stroke"),
            strokeWidth: this._strokeWidth(elem),
            fill: this._color(elem, "fill")
        };
    },

    polyline: function (elem) {
        return {
            points: this._points(elem),
            stroke: this._color(elem, "stroke"),
            strokeWidth: this._strokeWidth(elem)
        };
    },

    rect: function(elem) {
        return {
            x: this._coord(elem, "x"),
            y: this._coord(elem, "y"),
            width: this._coord(elem, "width"),
            height: this._coord(elem, "height"),
            rx: this._coord(elem, "rx"),
            ry: this._coord(elem, "ry"),
            stroke: this._color(elem, "stroke"),
            strokeWidth: this._strokeWidth(elem),
            fill: this._color(elem, "fill")
        };
    },

    g: function(elem) {

    },

    children: function (elem) {
        return elem.selectAll(function(){ return this.childNodes; });
    },

    // TODO traverse the whole svg and parse
    // TODO if <g> found, use it's attributes to the children
    parse: function(selector) {

    }
};

// Export if we have module
if (typeof module != "undefined" && typeof module.exports == "object")
    module.exports.SVG = SVG;