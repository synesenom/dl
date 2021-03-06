// Imports
if (typeof module != "undefined") {
    var d3 = require('../src/libs/d3.v4.min');
}


// TODO check if attributes are valid, return error if not
/**
 * Class for parsing SVG elements.
 */
const SVG = {
    // TODO: QTCSAZ
    PATH: [
        'M', 'm',
        'L', 'l',
        'H', 'h',
        'V', 'v'
    ],

    /**
     * Multiplies two transformation matrices.
     *
     * @param l Left matrix.
     * @param r Right matrix
     * @returns {Array} Array representing the result transformation.
     * @private
     */
    _multiply: function(l, r) {
        return [
            l[0]*r[0] + l[2]*r[1],
            l[1]*r[0] + l[3]*r[1],
            l[0]*r[2] + l[2]*r[3],
            l[1]*r[2] + l[3]*r[3],
            l[0]*r[4] + l[2]*r[5] + l[4],
            l[1]*r[4] + l[3]*r[5] + l[5]
        ];
    },

    /**
     * Transforms a pair of coordinates using a transformation matrix.
     *
     * @param m Matrix representing the transformation.
     * @param c Coordinates to transform.
     * @returns {Array} Array containing the new coordinates.
     * @private
     */
    _transform: function(m, c) {
        return [
            m[0]*c[0] + m[2]*c[1] + m[4],
            m[1]*c[0] + m[3]*c[1] + m[5]
        ];
    },

    /**
     * Tries to extract string from an attribute.
     * Both raw attribute and style content is read.
     *
     * @param elem Element to read string for.
     * @param attr Attribute name.
     * @param defaultValue Default value if attribute was not found.
     * @returns {string} Attribute value.
     * @private
     */
    _get_string: function (elem, attr, defaultValue) {
        var a = elem.attr(attr);
        var s = elem.style(attr);
        return (a != null && a != "") ? a
            : ((s != null && s != "") ? s : defaultValue);
    },

    /**
     * Tries to extract a number from an attribute.
     * Both raw attribute and style content is read.
     *
     * @param elem Element to read number for.
     * @param attr Attribute name.
     * @param defaultValue Default value if attribute was not found.
     * @returns {number} Attribute value.
     * @private
     */
    _get_number: function(elem, attr, defaultValue) {
        return parseFloat(this._get_string(elem, attr, defaultValue));
    },

    /**
     * Tries to extract transformations from an element.
     *
     * @param elem Element to read transformations for.
     * @returns object Object containing the transformations.
     * @private
     */
    _get_transform: function(elem) {
        // Collect transformations
        var attr = elem.attr("transform").trim().replace(/ /g, ",");
        var transforms = [];
        if (attr !== null && attr !== "") {
            attr.match(/(\w+\((-?\d+\.?\d*e?-?\d*,?)+\))+/g).forEach(function (t) {
                var c = t.match(/[\w.\-]+/g);
                var transform = [c.shift()];
                c.forEach(function(ci) {
                    transform.push(+ci);
                });
                transforms.push(transform);
            });
        }

        // Build matrices
        var matrices = [];
        transforms.forEach(function(t) {
            switch (t.shift()) {
                case "matrix":
                    if (t.length == 6)
                        matrices.push([t[0], t[1], t[2], t[3], t[4], t[5]]);
                    else
                        matrices.push([1, 0, 0, 1, 0, 0]);
                    break;
                case "translate":
                    if (t.length == 1)
                        matrices.push([1, 0, 0, 1, t[0], 0]);
                    else if (t.length == 2)
                        matrices.push([1, 0, 0, 1, t[0], t[1]]);
                    else
                        matrices.push([1, 0, 0, 1, 0, 0]);
                    break;
                case "scale":
                    if (t.length == 1)
                        matrices.push([t[0], 0, 0, t[0], 0, 0]);
                    else if (t.length == 2)
                        matrices.push([t[0], 0, 0, t[1], 0, 0]);
                    else
                        matrices.push([1, 0, 0, 1, 0, 0]);
                    break;
                case "rotate":
                    var rot = [Math.cos(t[0]), Math.sin(t[0]), -Math.sin(t[0]), Math.cos(t[0]), 0, 0];
                    if (t.length == 3) {
                        var tl = [1, 0, 0, 1, t[1], t[2]];
                        var tr = [1, 0, 0, 1, -t[1], -t[2]];
                        rot = SVG._multiply(tl, SVG._multiply(rot, tr));
                    }
                    matrices.push(rot);
                    break;
                case "skewX":
                    matrices.push([1, 0, Math.tan(t[0]), 1, 0, 0]);
                    break;
                case "skewY":
                    matrices.push([1, Math.tan(t[0]), 0, 1, 0, 0]);
                    break;
                default:
                    matrices.push([1, 0, 0, 1, 0, 0]);
            }
        });

        // Multiply transformations
        var transform = [1, 0, 0, 1, 0, 0];
        for (var i=0; i<matrices.length; i++) {
            transform = this._multiply(transform, matrices[i]);
        }
        return transform;
    },
    
    /**
     * Reads multiple coordinates from a polygon or polyline.
     *
     * @param elem Element to read coordinates from.
     * @returns {Array} Array of (x, y) coordinate pairs if attribute exists, empty Array otherwise.
     * @private
     */
    _get_points: function(elem) {
        var coordinates = elem.attr("points")
            .replace(/\s+/g, " ")
            .replace(/,/g, " ")
            .split(" ");
        var points = [];
        if (coordinates && coordinates.length > 0) {
            for (var i=0; i<coordinates.length; i+=2) {
                points.push({x: +coordinates[i], y: +coordinates[i+1]});
            }
        }
        return points;
    },

    /**
     * Reads an SVG path from an attribute.
     *
     * @param elem Element to read path from.
     * @param attr Attribute to use for the path.
     * @returns {Array} Array containing arrays of (x, y) coordinate pairs for each part of the path.
     * @private
     *
     * TODO simplify this method
     */
    _get_path: function(elem, attr) {
        //console.log(elem.attr("d"));
        if (!elem.attr(attr) || elem.attr(attr).trim() == "")
            return [];

        // Remove commas and multiple whitespace
        var attr_clean = elem.attr(attr).replace(/,/g, " ").replace(/\s+/g, " ");

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

    /**
     * Reads the attributes of a circle element.
     *
     * @param elem Circle element.
     * @returns object Object containing the circle attributes.
     */
    // TODO unit test
    circle: function(elem) {
        return {
            cx: this._get_number(elem, "cx", 0),
            cy: this._get_number(elem, "cy", 0),
            r: this._get_number(elem, "r", 0),
            stroke: this._get_string(elem, "stroke", null),
            strokeWidth: this._get_number(elem, "stroke-width", 1),
            fill: this._get_string(elem, "stroke", null),
            opacity: this._get_number(elem, "opacity", null)
        };
    },

    /**
     * Reads the attributes of an ellipse element.
     * @param elem Ellipse element.
     * @returns object Object containing the ellipse attributes.
     */
    // TODO unit test
    ellipse: function(elem) {
        return {
            cx: this._get_number(elem, "cx", 0),
            cy: this._get_number(elem, "cy", 0),
            rx: this._get_number(elem, "rx", 0),
            ry: this._get_number(elem, "ry", 0),
            stroke: this._get_string(elem, "stroke", null),
            strokeWidth: this._get_number(elem, "stroke-width", 1),
            fill: this._get_string(elem, "stroke", null),
            opacity: this._get_number(elem, "opacity", null)
        };
    },

    /**
     * Reads the attributes of a line element.
     * @param elem Line element.
     * @returns object Object containing the line attributes.
     */
    // TODO unit test
    line: function(elem) {
        return {
            x1: this._get_number(elem, "x1", 0),
            y1: this._get_number(elem, "y1", 0),
            x2: this._get_number(elem, "x2", 0),
            y2: this._get_number(elem, "y2", 0),
            stroke: this._get_string(elem, "stroke", null),
            strokeWidth: this._get_number(elem, "stroke-width", 1),
            opacity: this._get_number(elem, "opacity", null)
        };
    },

    /**
     * Reads the attributes of a path element.
     * @param elem Path element.
     * @returns object Object containing the path attributes.
     */
    // TODO unit test
    path: function(elem) {
        return {
            points: this._get_path(elem, "d"),
            stroke: this._get_string(elem, "stroke", null),
            strokeWidth: this._get_number(elem, "stroke-width", 1),
            fill: this._get_string(elem, "stroke", null),
            opacity: this._get_number(elem, "opacity", null)
        };
    },

    /**
     * Reads the attributes of a polygon element.
     * @param elem Polygon element.
     * @returns object Object containing the polygon attributes.
     */
    // TODO unit test
    polygon: function (elem) {
        return {
            points: this._get_points(elem),
            stroke: this._get_string(elem, "stroke", null),
            strokeWidth: this._get_number(elem, "stroke-width", 1),
            fill: this._get_string(elem, "stroke", null),
            opacity: this._get_number(elem, "opacity", null)
        };
    },

    /**
     * Reads the attributes of a polyline element.
     * @param elem Polyline element.
     * @returns object Object containing the polyline attributes.
     */
    // TODO unit test
    polyline: function (elem) {
        return {
            points: this._get_points(elem),
            stroke: this._get_string(elem, "stroke", null),
            strokeWidth: this._get_number(elem, "stroke-width", 1),
            opacity: this._get_number(elem, "opacity", null)
        };
    },

    /**
     * Reads the attributes of a rect element.
     * @param elem Rect element.
     * @returns object Object containing the rect attributes.
     */
    // TODO unit test
    rect: function(elem) {
        return {
            x: this._get_number(elem, "x", 0),
            y: this._get_number(elem, "y", 0),
            width: this._get_number(elem, "width", 1),
            height: this._get_number(elem, "height", 1),
            rx: this._get_number(elem, "rx", 0),
            ry: this._get_number(elem, "ry", 0),
            stroke: this._get_string(elem, "stroke", null),
            strokeWidth: this._get_number(elem, "stroke-width", 1),
            fill: this._get_string(elem, "stroke", null),
            opacity: this._get_number(elem, "opacity", null)
        };
    },

    /**
     * Reads the attributes of a text element.
     *
     * @param elem Text element.
     * @returns object Object containing the text attributes.
     */
    // TODO unit test
    text: function (elem) {
        return {
            x: this._get_number(elem, "x", 0),
            y: this._get_number(elem, "y", 0),
            textAnchor: this._get_string(elem, "text-anchor", null),
            fontFamily: this._get_string(elem, "font-family", null),
            fontSize: this._get_number(elem, "font-size", 10),
            fill: this._get_string(elem, "fill", null),
            opacity: this._get_number(elem, "opacity", null)
        };
    },

    /**
     * Reads the attributes of a group element.
     *
     * @param elem Group element.
     * @returns object Object containing the group attributes.
     */
    // TODO unit test
    g: function(elem) {
        return {
            opacity: this._get_number(elem, "opacity", null)
        };
    },

    /**
     * Reads the attributes of an SVG element.
     *
     * @param elem SVG element.
     * @returns object Object containing the SVG attributes.
     */
    // TODO unit test
    svg: function(elem) {
        return {
            width: this._get_number(elem, "width", null),
            height: this._get_number(elem, "height", null),
            backgroundColor: this._get_string(elem, "background-color", "white")
        };
    },

    // TODO unit test
    children: function (elem) {
        return elem.selectAll(function(){ return this.childNodes; });
    },

    // TODO traverse the whole svg and parse
    // TODO if <g> found, use it's attributes to the children
    // TODO unit test
    parse: function(selector) {
        var svgTree = {};

        // Init element stack
        var stack = [d3.select(selector)];
        while (stack.length > 0) {
            // Next element
            var node = stack.shift();
            console.log(node);

            // Get children
            var children = this.children(node);
            if (children != null) {
                children.each(function() {
                    if (this.tagName != "title")
                        stack.push(d3.select(this));
                });
            }
        }
    }
};

// Export if we have module
if (typeof module != "undefined" && typeof module.exports == "object")
    module.exports.SVG = SVG;