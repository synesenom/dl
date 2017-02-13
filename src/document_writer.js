/**
 * Abstract class of a document writer.
 *
 * @constructor
 * @abstract
 */
var DocumentWriter = function() {
    this.kw = {};

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


/* Non-abstract methods */
/**
 * Sets author of the document.
 *
 * @param {string} author Author of the document.
 * @returns {DocumentWriter} This document writer.
 */
DocumentWriter.prototype.author = function(author) {
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
 * @param {number} strokeWidth Width of the line.
 * @returns {DocumentWriter} This document writer.
 */
DocumentWriter.prototype.line = function (src, dst, stroke, strokeWidth) {
    // Check if line is valid:
    // - src and dst are valid
    // - src is not equal to dst
    // - stroke is valid
    // - stroke width is positive
    if (src != null
        && dst != null
        && ('x' in src
        && 'y' in src)
        && ('x' in dst
        && 'y' in dst)
        && ((src.x != dst.x) || (src.y != dst.y))
        && stroke != null
        && strokeWidth > 0) {
        this._doc.primitives.lines.push({
            src: src,
            dst: dst,
            stroke: stroke,
            strokeWidth: strokeWidth
        });
    }
    return this;
};

/**
 * Adds a circle to the document.
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
    // - it has fill or stroke
    // - if stroke is given, stroke width is positive
    if (pos != null
        && 'x' in pos
        && 'y' in pos
        && radius > 0
        && (fill != null || (stroke != null && strokeWidth > 0))) {
        this._doc.primitives.circles.push({
            pos: pos,
            radius: radius,
            fill: fill,
            stroke: stroke,
            strokeWidth: strokeWidth
        });
    }
    return this;
};

/**
 * Adds a polygon to the document.
 *
 * @param {Array} corners Coordinates of the corners, elements must have x and y keys.
 * @param {object} fill Fill color, must have r, g and b keys, all values are between 0 and 1.
 * @param {object} stroke Stroke color, must have r, g and b keys, all values are between 0 and 1.
 * @param {number} strokeWidth Width of the stroke around the polygon.
 * @returns {DocumentWriter} This document writer.
 */
DocumentWriter.prototype.polygon = function(corners, fill, stroke, strokeWidth) {
    // Check if polygon is valid:
    // - corners are valid and has at least 3 elements
    // - it has fill or stroke
    // - if stroke is given, stroke width is positive
    if (corners != null
        && corners.length > 2
        && (fill != null || (stroke != null && strokeWidth > 0))) {
        this._doc.primitives.polygons.push({
            corners: corners,
            fill: fill,
            stroke: stroke,
            strokeWidth: strokeWidth
        });
    }
    return this;
};

/**
 * Adds a path to the document.
 *
 * @todo implement filled path
 * @param {Array} segments Coordinates of the segments, elements must have x and y keys.
 * @param {object} fill Fill color, must have r, g and b keys, all values are between 0 and 1.
 * @param {object} stroke Stroke color, must have r, g and b keys, all values are between 0 and 1.
 * @param {number} strokeWidth Width of the path stroke.
 * @returns {DocumentWriter} This document writer.
 */
DocumentWriter.prototype.path = function(segments, fill, stroke, strokeWidth) {
    // Check if path is valid:
    // - segments are valid and have at least 2 elements
    // - it has fill or stroke
    // - if stroke is given, stroke width is positive
    if (segments != null
        && segments.length > 2
        && (fill != null || stroke != null)
        && (stroke == null || strokeWidth > 0)) {
        this._doc.primitives.paths.push({
            segments: segments,
            fill: fill,
            stroke: stroke,
            strokeWidth: strokeWidth
        });
    }
    return this;
};

