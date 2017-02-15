// Import document writer
if (typeof module != "undefined")
    var DocumentWriter = require('../src/document_writer').DocumentWriter;

/**
 * An EPS writer.
 */
var EPS = function(boundingBox) {
    DocumentWriter.apply(this, arguments);

    this.bbox = boundingBox;
    this._doc.header = "%!PS-Adobe-2.0 EPSF-2.0";
    this._doc.footer = "%%EOF";
};
EPS.prototype = Object.create(DocumentWriter.prototype);
EPS.prototype.constructor = EPS;
EPS.prototype.kw = {
    gs: " gsave ",
    gr: " grestore ",
    np: " newpath ",
    lw: " setlinewidth ",
    mt: " moveto ",
    lt: " lineto ",
    c: " setrgbcolor ",
    f: " fill ",
    s: " stroke ",
    a: " arc ",
    cp: " closepath "
};

EPS.prototype._drawLine = function (line) {
    var kw = EPS.prototype.kw;
    var res = kw.gs + kw.np;
    res += line.stroke.r/255 + " " + line.stroke.g/255 + " " + + line.stroke.b/255 + kw.c;
    res += line.strokeWidth + kw.lw;
    res += line.src.x + " " + line.src.y + kw.mt + line.dst.x + " " + line.dst.y + kw.lt + kw.s;
    res += kw.gr;
    return this._reduce(res) + "\n";
};

EPS.prototype._drawCircle = function(circle) {
    var kw = EPS.prototype.kw;
    var geometry = circle.pos.x + " " + circle.pos.y + " " + circle.radius + " 0 360" + kw.a;
    var res = kw.gs + kw.np;

    // Fill only
    if (!circle.stroke || !circle.strokeWidth) {
        res += circle.fill.r/255 + " " + circle.fill.g/255 + " " + circle.fill.b/255 + kw.c;
        res += geometry;
        res += kw.cp + kw.f;
    } else if (circle.fill == null) {
        // Stroke only
        res += circle.stroke.r/255 + " " + circle.stroke.g/255 + " " + circle.stroke.b/255 + kw.c;
        res += circle.strokeWidth + kw.lw;
        res += geometry;
        res += kw.cp + kw.s;
    } else {
        // Fill + stroke
        res += circle.fill.r/255 + " " + circle.fill.g/255 + " " + circle.fill.b/255 + kw.c;
        res += geometry;
        res += kw.cp;
        res += kw.gs + kw.f + kw.gr;
        res += circle.stroke.r/255 + " " + circle.stroke.g/255 + " " + circle.stroke.b/255 + kw.c;
        res += circle.strokeWidth + kw.lw + kw.s;
    }
    res += kw.gr;
    return this._reduce(res) + "\n";
};

EPS.prototype._drawPath = function(path) {
    var kw = EPS.prototype.kw;
    var geometry = path.corners[0].x + " " + path.corners[0].y + kw.mt;
    for (var i = 1; i < path.corners.length; i++) {
        geometry += path.corners[i].x + " " + path.corners[i].y + kw.lt;
    }
    if (path.closed)
        geometry += kw.cp;
    var res = kw.gs + kw.np;

    // Fill only
    if (path.stroke == null) {
        res += path.fill.r/255 + " " + path.fill.g/255 + " " + path.fill.b/255 + kw.c;
        res += geometry + kw.f;
    } else if (path.fill == null) {
        // Stroke only
        res += path.stroke.r/255 + " " + path.stroke.g/255 + " " + path.stroke.b/255 + kw.c;
        res += path.strokeWidth + kw.lw;
        res += geometry + kw.s;
    } else {
        // Fill + stroke
        res += path.fill.r/255 + " " + path.fill.g/255 + " " + path.fill.b/255 + kw.c;
        res += geometry + kw.gs + kw.f + kw.gr;
        res += path.stroke.r/255 + " " + path.stroke.g/255 + " " + path.stroke.b/255 + kw.c;
        res += path.strokeWidth + kw.lw + kw.s;
    }
    res += kw.gr;
    return this._reduce(res) + "\n";
};

EPS.prototype.make = function() {
    // Header
    var doc = this._doc.header + "\n% Generated by " + this._doc.author + "\n";
    doc += "%%BoundingBox: 0 0 " + this.bbox.width + " " + this.bbox.height + "\n";

    // Lines
    doc += "\n% Lines\n%\n";
    this._doc.elements.lines.forEach(function(l) {
        doc += EPS.prototype._drawLine(l);
    });

    // Circles
    doc += "\n% Circles\n%\n";
    this._doc.elements.circles.forEach(function(c) {
        doc += EPS.prototype._drawCircle(c);
    });

    // Paths
    doc += "\n% Paths\n%\n";
    this._doc.elements.paths.forEach(function(p) {
        doc += EPS.prototype._drawPath(p);
    });

    // Footer
    doc += this._doc.footer;

    // Return simplified document
    return this._reduce(doc);
};

// Export if we have module
if (typeof module != "undefined" && typeof module.exports == "object")
    module.exports.EPS = EPS;