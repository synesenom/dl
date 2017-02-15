/**
 * Abstract class of a document writer.
 *
 * @constructor
 * @abstract
 */
var DocumentWriter = function() {
    this._doc = {
        header: "",
        author: "",
        primitives: {
            lines: [],
            circles: [],
            polygons: [],
            paths: []
        },
        footer: ""
    };

    if (this.constructor == DocumentWriter) {
        throw new Error("Cannot instantiate abstract class");
    }
};

/* Abstract methods */
/**
 * Draws a line in the document.
 * Abstract method, must be overloaded.
 *
 * @abstract
 * @param {object} line Line object.
 * @return {string} String representing the line element.
 * @private
 */
DocumentWriter.prototype._drawLine = function(line) {
    throw new Error("Abstract method _drawLine is not defined");
};

/**
 * Draws a line in the document.
 * Abstract method, must be overloaded.
 *
 * @abstract
 * @return {string} String representing the circle element.
 * @private
 */
DocumentWriter.prototype._drawCircle = function() {
    throw new Error("Abstract method _drawCircle is not defined");
};

/**
 * Draws a polygon in the document.
 * Abstract method, must be overloaded.
 *
 * @abstract
 * @return {string} String representing the polygon element.
 * @private
 */
DocumentWriter.prototype._drawPolygon = function() {
    throw new Error("Abstract method _drawPolygon is not defined");
};

/**
 * Draws a path in the document.
 * Abstract method, must be overloaded.
 *
 * @abstract
 * @return {string} String representing the path element.
 * @private
 */
DocumentWriter.prototype._drawPath = function() {
    throw new Error("Abstract method _drawPath is not defined");
};

/**
 * Builds the document content.
 * Abstract method, must be overloaded.

 * @abstract
 * @returns {string} Content of the document.
 */
DocumentWriter.prototype.make = function () {
    throw new Error("Abstract method make is not defined");
};


/* Private methods */
DocumentWriter.prototype._reduce = function (text) {
    return text ? text.trim().replace(/ +/g, " ").replace(/\n /g, "\n") : "";
};


/* Non-abstract methods */
/**
 * Sets author of the document.
 *
 * @param {string} author Author of the document.
 * @returns {DocumentWriter} This document writer.
 */
DocumentWriter.prototype.author = function(author) {
    if (author)
        this._doc.author = author;
    return this;
};

/**
 * Adds a line to the document.
 * If line is invalid, it is not added to the document.
 *
 * @param {object} src Source position, must have x and y keys.
 * @param {object} dst Destination position, must have x and y keys.
 * @param {object} stroke Stroke color, must have r, g and b keys, all values are between 0 and 1.
 * @param {number} strokeWidth Width of the line. If null, it is set to 1.
 * @returns {DocumentWriter} This document writer.
 */
DocumentWriter.prototype.line = function (src, dst, stroke, strokeWidth) {
    // Check if line is valid:
    // - src and dst are valid
    // - src is not equal to dst
    // - stroke is valid
    // - stroke width is positive
    if (src && 'x' in src && 'y' in src
        && dst && 'x' in dst && 'y' in dst
        && ((src.x != dst.x) || (src.y != dst.y))
        && stroke && 'r' in stroke && 'g' in stroke && 'b' in stroke) {
        this._doc.primitives.lines.push({
            src: src,
            dst: dst,
            stroke: stroke,
            strokeWidth: strokeWidth && strokeWidth > 0 ? strokeWidth : 1
        });
    }
    return this;
};

/**
 * Adds a circle to the document.
 * Only valid circle is stored.
 *
 * @param {object} pos Position, must have x and y keys.
 * @param {number} radius Radius of the circle.
 * @param {object} fill Fill color, must have r, g and b keys, all values are between 0 and 1.
 * @param {object} stroke Stroke color, must have r, g and b keys, all values are between 0 and 1.
 * @param {number} strokeWidth Width of the stroke around the circle.
 * @returns {DocumentWriter} This document writer.
 */
DocumentWriter.prototype.circle = function (pos, radius, fill, stroke, strokeWidth) {
    // Check if circle is valid:
    // - pos is valid
    // - radius is positive
    // - either fill or stroke is valid
    if (pos && 'x' in pos && 'y' in pos
        && radius && radius > 0) {
        var f = (fill && 'r' in fill && 'g' in fill && 'b' in fill);
        var s = (stroke && 'r' in stroke && 'g' in stroke && 'b' in stroke && strokeWidth && strokeWidth > 0);
        if (f || s) {
            this._doc.primitives.circles.push({
                pos: pos,
                radius: radius,
                fill: f ? fill : null,
                stroke: s ? stroke : null,
                strokeWidth: s ? strokeWidth : null
            });
        }
    }
    return this;
};

/**
 * Adds a path to the document.
 * Only valid path is stored.
 *
 * @param {Array} corners Coordinates of the corners, elements must have x and y keys.
 * @param {object} fill Fill color, must have r, g and b keys, all values are between 0 and 1.
 * @param {object} stroke Stroke color, must have r, g and b keys, all values are between 0 and 1.
 * @param {number} strokeWidth Width of the path stroke.
 * @param {boolean} closed Whether the path is closed or not.
 * @returns {DocumentWriter} This document writer.
 */
DocumentWriter.prototype.path = function(corners, fill, stroke, strokeWidth, closed) {
    // Check if path is valid:
    // - corners are valid and have at least 2 elements
    // - either fill or stroke is valid
    if (corners && corners.length > 1) {
        // check corners
        for (var i=0; i<corners.length; i++) {
            if (!corners[i] || !('x' in corners[i]) || !('y' in corners[i]))
                return this;
        }
        var f = (fill && 'r' in fill && 'g' in fill && 'b' in fill);
        var s = (stroke && 'r' in stroke && 'g' in stroke && 'b' in stroke && strokeWidth && strokeWidth > 0);
        if (f || s) {
            this._doc.primitives.paths.push({
                corners: corners,
                fill: f ? fill : null,
                stroke: s ? stroke : null,
                strokeWidth: s ? strokeWidth : null,
                closed: closed ? closed : false
            });
        }
    }
    return this;
};

// Export if we have module
if (typeof module != "undefined" && typeof module.exports == "object")
    module.exports.DocumentWriter = DocumentWriter;
