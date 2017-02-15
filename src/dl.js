/**
 * Class for exporting and downloading SVG graphics.
 */
var dl = {
    /**
     * Container of all temporarily created elems.
     *
     * @private
     */
    _junk: {
        content: {},

        /**
         * Removes all junk.
         */
        clear: function () {
            for (var elem in this.content) {
                if (this.content.hasOwnProperty(elem))
                    this.content[elem].remove();
            }
            this.content = {};
        }
    },

    /**
     * Generates a 32-character identifier to access the canvas
     * and not to mess up existing elems.
     *
     * @return {string} The generated identifier.
     * @private
     */
    _getId: function () {
        var id = "";
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 32; i++)
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        return id;
    },

    /**
     * Reads metric options and creates a metrics object used for
     * setting up the canvas.
     *
     * @param {object} svgElem SVG element to convert.
     * @param {object} options Options including canvas settings.
     * @return {object} The metrics describing the canvas.
     * @private
     */
    _getMetrics: function (svgElem, options) {
        // Read SVG dimensions
        var svgW = svgElem.attr("width");
        var svgH = svgElem.attr("height");

        // Update metrics
        var m = {
            canvas: {w: svgW, h: svgH},
            scale: {w: 1.0, h: 1.0}
        };
        if (options) {
            if (options.width && options.height) {
                m.canvas.w = options.width;
                m.scale.w = m.canvas.w / svgW;
                m.canvas.h = options.height;
                m.scale.h = m.canvas.h / svgH;
            } else if (options.width) {
                m.canvas.w = options.width;
                m.scale.w = m.canvas.w / svgW;
                m.canvas.h = m.scale.w * svgH;
                m.scale.h = m.scale.w;
            } else if (options.height) {
                m.canvas.h = options.height;
                m.scale.h = m.canvas.h / svgH;
                m.canvas.w = m.scale.h * svgW;
                m.scale.w = m.scale.h;
            }
        }

        return m;
    },

    /**
     * Recognizes color format and returns in the range [0, 255].
     *
     * @param {string, null} color Color in string format.
     * @returns {object} Color with R, G and B components if recognized, null otherwise.
     */
    _getColor: function (color) {
        if (color == null)
            return null;

        // clean string
        var c = color.replace(/\s+/g, "");
        if (c.length == 0 || c == "")
            return null;

        // hexadecimal format
        var r, g, b, a;
        if (c[0] == "#") {
            switch (c.length) {
                case 4:
                    return !isNaN(r = parseInt(c[1], 16))
                    && !isNaN(g = parseInt(c[2], 16))
                    && !isNaN(b = parseInt(c[3], 16)) ? {r: 17 * r, g: 17 * g, b: 17 * b} : null;
                case 7:
                    return !isNaN(r = parseInt(c[1] + c[2], 16))
                    && !isNaN(g = parseInt(c[3] + c[4], 16))
                    && !isNaN(b = parseInt(c[5] + c[6], 16)) ? {r: r, g: g, b: b} : null;
                default:
                    return null;
            }
        }

        // rgb format
        if (c.substring(0, 3) == "rgb") {
            var ca = c.match(/(\d+(\.\d+)?)/g);
            switch (c[3]) {
                case "(":
                    return !isNaN(r = +ca[0])
                    && !isNaN(g = +ca[1])
                    && !isNaN(b = +ca[2]) ? {r: r, g: g, b: b} : null;
                    break;
                case "a":
                    return !isNaN(r = +ca[0])
                    && !isNaN(g = +ca[1])
                    && !isNaN(b = +ca[2])
                    && !isNaN(a = +ca[3]) ? {r: r, g: g, b: b, a: a} : null;
                    break;
                default:
                    return null;
            }
        }

        // unknown
        return null;
    },

    /**
     * Builds an array of all elements of the specified type in the SVG.
     *
     * @param {string} selector Selector for the SVG.
     * @param {string} type Type of the element (line, circle, rect, path).
     * @returns {Array} Array of all elements found.
     * @private
     */
    _getElements: function(selector, type) {
        var svg = d3.select(selector);
        var h = svg.attr("height");
        var elements = [];

        svg.selectAll(type).nodes(0).forEach(function (elem) {
            var e = d3.select(elem);
            var segments = [];
            if (type == "path") {
                e.attr("d").substring(1).split("L").forEach(function (s) {
                    var coords = s.split(",");
                    segments.push({x: +coords[0], y: h - coords[1]});
                });
            } else {
                segments = null;
            }

            var sw = e.attr("stroke-width");
            var nElem = {
                x: +e.attr("x") ? +e.attr("x") : +e.attr("cx"),
                x1: +e.attr("x1"),
                x2: +e.attr("x2"),
                y: +e.attr("y") ? h - e.attr("y") : h - e.attr("cy"),
                y1: h - e.attr("y1"),
                y2: h - e.attr("y2"),
                r: +e.attr("r"),
                width: +e.attr("width"),
                height: +e.attr("height"),
                segments: segments,
                fill: dl._getColor(e.attr("fill") ? e.attr("fill") : e.style("fill")),
                stroke: dl._getColor(e.attr("stroke") ? e.attr("stroke") : e.style("stroke")),
                strokeWidth: sw != null ? sw.replace("px", "") : +e.style("stroke-width").replace("px", "")
            };
            if (nElem.fill != null || nElem.stroke != null)
                elements.push(nElem);
        });
        return elements;
    },

    /**
     * Triggers a download of the data with the specified filename.
     *
     * @param {string} data Data to download.
     * @param {string} filename Name of the file to download.
     * @private
     */
    _download: function (data, filename) {
        var a = document.createElement("a");
        a.download = filename;
        a.href = data;
        a.click();
    },

    /**
     * Converts an SVG element to PNG and triggers the download right away.
     *
     * @param {string} selector Selector for the SVG element to convert.
     * @param {string} filename Name of the file to download.
     * @param {object} options Optional settings for the converted image.
     */
    png: function (selector, filename, options) {
        // Get SVG element and get options
        var svg = d3.select(selector);
        var metrics = this._getMetrics(svg, options);
        var junk = this._junk;

        // Copy SVG content to a temporary div to make sure we only have the graphics
        junk.content.div = d3.select("body").append("div");
        junk.content.svg = junk.content.div.append("svg")
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("width", svg.attr("width"))
            .attr("height", svg.attr("height"))
            .html(svg.html());

        // Create rescaled canvas
        var id = "dl-png-" + this._getId();
        d3.select("canvas").remove();
        junk.content.canvas = d3.select("body").append("canvas")
            .attr("id", id)
            .attr("width", metrics.canvas.w)
            .attr("height", metrics.canvas.h)
            .style("display", "none").node(0);
        var context = junk.content.canvas.getContext("2d");
        context.scale(metrics.scale.w, metrics.scale.h);

        // Create image source from clean SVG
        var html = junk.content.svg.node().parentNode.innerHTML;
        var imgsrc = "data:image/svg+xml;base64," + btoa(html);

        // Put image in canvas
        var image = new Image;
        image.onload = function () {
            // Draw image in canvas
            context.drawImage(image, 0, 0);
            var canvasData = junk.content.canvas.toDataURL("image/png");

            // Create blob from canvas and fill with data
            // Deprecated
            /*var byteString = atob(document.querySelector("#" + id)
             .toDataURL()
             .replace(/^data:image\/(png|jpg);base64,/, ""));
             var ab = new ArrayBuffer(byteString.length);
             var ia = new Uint8Array(ab);
             for (var i=0; i<byteString.length; i++)
             ia[i] = byteString.charCodeAt(i);
             var dataView = new DataView(ab);
             var blob = new Blob([dataView], {type: "image/png"});
             var DOMURL = self.URL || self.webkitURL || self;
             var newurl = DOMURL.createObjectURL(blob);*/

            // Create link with the image and trigger the click right away
            dl._download(canvasData, filename);

            // Clean up DOM
            junk.clear();
        };
        image.src = imgsrc;
    },

    /**
     * Converts an SVG element to EPS and triggers the download right away.
     * Only works for graphs
     *
     * @param {string} selector Selector for the SVG element to convert.
     * @param {string} filename Name of the file to download.
     * @param {string} meta Name of the creator.
     */
    eps: function (selector, filename, meta) {
        // Get dimensions
        var svg = d3.select(selector);
        var w = svg.attr("width");
        var h = svg.attr("height");

        // Build document
        var eps = new EPS({width: w, height: h}).author("dl version 0.1");
        if (meta != null && meta != "")
            eps.author(meta);
        this._getElements(selector, "line").forEach(function(l) {
            eps.line(
                {x: l.x1, y: l.y1},
                {x: l.x2, y: l.y2},
                l.stroke,
                l.strokeWidth
            );
        });
        // TODO error with stroke color
        this._getElements(selector, "circle").forEach(function(n) {
            eps.circle(
                {x: n.x, y: n.y},
                n.r,
                n.fill,
                n.stroke,
                n.strokeWidth
            );
        });
        /*this._getElements(selector, "rect").forEach(function(r) {
            eps.polygon(
                [{x: r.x, y: r.y},
                    {x: r.x + r.width, y: r.y},
                    {x: r.x + r.width, y: r.y + r.height},
                    {x: r.x, y: r.y + r.height}],
                r.fill,
                r.stroke,
                r.strokeWidth
            );
        });
        this._getElements(selector, "path").forEach(function(p) {
            eps.path(
                p.segments,
                p.fill,
                p.stroke,
                p.strokeWidth
            );
        });*/

        // Write it
        var data = "data:application/postscript; charset=utf-8," + encodeURIComponent(eps.make());
        this._download(data, filename);
    },

    pdf: function (selector, filename, meta) {
        // Get dimensions
        var svg = d3.select(selector);
        var w = svg.attr("width");
        var h = svg.attr("height");

        // Build document
        var pdf = new PDF({width: w, height: h}).author("dl version 0.1");
        if (meta != null && meta != "")
            pdf.author(meta);
        this._getElements(selector, "line").forEach(function(l) {
            pdf.line(
                {x: l.x1, y: l.y1},
                {x: l.x2, y: l.y2},
                l.stroke,
                l.strokeWidth
            );
        });
        this._getElements(selector, "circle").forEach(function(n) {
            pdf.circle(
                {x: n.x, y: n.y},
                n.r,
                n.fill,
                n.stroke,
                n.strokeWidth
            );
        });

        //alert(pdf.make());
        var data = "data:application/pdf; charset=utf-8," + encodeURIComponent(pdf.make());
        this._download(data, filename);
    },

    /**
     * Converts an SVG element to a JSON file.
     * Only works for graphs.
     *
     * @param {string} selector Selector for the SVG element to convert.
     * @param {string} filename Name of the file to download.
     */
    json: function (selector, filename) {
        // Get coordinates
        var svg = d3.select(selector);
        var g = {
            nodes: this._getElements(selector, "circle"),
            links: this._getElements(selector, "line")
        };

        // Find source/target ids
        /*function r(x1, y1, x2, y2) {
            var dx = x1 - x2;
            var dy = y1 - y2;
            return dx * dx + dy * dy;
        }

        function find(link, dir) {
            var x = dir == "source" ? link.x1 : link.x2;
            var y = dir == "source" ? link.y1 : link.y2;
            var n = g.nodes[0];
            var m = {r: r(n.x, n.y, x, y), id: n.id};
            for (var i = 1; i < g.nodes.length; i++) {
                n = g.nodes[i];
                var r1 = r(n.x, n.y, x, y);
                if (r1 < m.r)
                    m = {r: r1, id: n.id};
            }
            return m.id;
        }

        g.links.forEach(function (link) {
            link.source = find(link, "source");
            link.target = find(link, "target");
        });*/
        var data = "data:text/json; charset=utf-8," + encodeURIComponent(JSON.stringify(g, null, 2));
        this._download(data, filename);
    }
};

// Export if we have module
if (typeof module != "undefined" && typeof module.exports == "object")
    module.exports.dl = dl;
