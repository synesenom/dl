/**
 * Class for exporting and downloading SVG graphics.
 * @todo get the original order of SVG elements and draw them in EPS following that order.
 */
const dl = {
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
     * Returns the color from a style attribute of an element.
     * Color must be given author rgb(...) format.
     *
     * @param {string} color Style describing the color to parse.
     * @param {number} opacity Optional opacity value to mix with the color.
     * @return {object} An object of the parsed color in various formats.
     * @private
     */
    _parseColor: function (color, opacity) {
        var c = {r: 255, g: 255, b: 255};

        // Empty color: white
        if (color === null || color == "" || color == "none") {
            return {
                rgbInt: null,
                rgbFloat: null,
                rgbHex: null
            };
        } else if (color[0] == "#") {
            if (color.length == 4) {
                c = {
                    r: parseInt(color[1], 16),
                    g: parseInt(color[2], 16),
                    b: parseInt(color[3], 16)
                };
            } else {
                c = {
                    r: parseInt(color[1]+color[2], 16),
                    g: parseInt(color[3]+color[4], 16),
                    b: parseInt(color[5]+color[6], 16)
                };
            }
        } else if (color[0] == "r") {
            var arr = color.split("(")[1].split(")")[0].replace(/,/g, "").split(" ");
            c = {
                r: parseInt(arr[0]),
                g: parseInt(arr[1]),
                b: parseInt(arr[2])
            }
        }

        // Blend with opacity
        if (opacity != null) {
            c.r = parseInt(opacity*c.r + (1-opacity)*255);
            c.g = parseInt(opacity*c.g + (1-opacity)*255);
            c.b = parseInt(opacity*c.b + (1-opacity)*255);
        }

        /**
         * Converts decimal integer to hexadecimal.
         * @param {number} i Decimal integer to convert.
         * @returns {string} Zero-padded string representation of hexadecimal form.
         */
        function toHex(i) {
            var hex = i.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        return {
            rgbInt: c,
            rgbFloat: {
                r: c.r / 255,
                g: c.g / 255,
                b: c.b / 255
            },
            rgbHex: "#" + toHex(c.r) + toHex(c.g) + toHex(c.b)
        };
    },

    /**
     * Builds an array of all elements of the specified type in the SVG.
     *
     * @todo get horizontal and vertical path movements as well.
     * @param {string} selector Selector for the SVG.
     * @param {string} type Type of the element (line, circle).
     * @returns {Array} Array of all elements found.
     * @private
     */
    _getElements: function(selector, type) {
        function ignore(e) {
            var fill = e.attr("fill") ? e.attr("fill") : e.style("fill");
            var stroke = e.attr("stroke") ? e.attr("stroke") : e.style("stroke");
            return (fill === null || fill == "none") && (stroke === null  || stroke == "none")
        }

        var svg = d3.select(selector);
        var h = svg.attr("height");

        var elements = [];
        switch (type) {
            case "line":
                svg.selectAll("line").nodes(0).forEach(function (line) {
                    var l = d3.select(line);
                    if (ignore(l))
                        return;
                    elements.push({
                        x1: +l.attr("x1"),
                        y1: h - l.attr("y1"),
                        x2: +l.attr("x2"),
                        y2: h - l.attr("y2"),
                        stroke: dl._parseColor(l.attr("stroke") ? l.attr("stroke") : l.style("stroke"),
                            l.style("stroke-opacity")).rgbFloat,
                        strokeWidth: 1
                    });
                });
                break;
            case "circle":
                svg.selectAll("circle").nodes(0).forEach(function (circle) {
                    var c = d3.select(circle);
                    if (ignore(c))
                        return;
                    elements.push({
                        x: +c.attr("cx"),
                        y: h - c.attr("cy"),
                        r: +c.attr("r"),
                        fill: dl._parseColor(c.attr("fill") ? c.attr("fill") : c.style("fill"),
                            c.style("opacity")).rgbFloat,
                        stroke: dl._parseColor(c.attr("stroke") ? c.attr("stroke") : c.style("stroke"),
                            c.style("stroke-opacity")).rgbFloat,
                        strokeWidth: +c.attr("stroke-width")
                    });
                });
                break;
            case "rect":
                svg.selectAll("rect").nodes(0).forEach(function (rect) {
                    var r = d3.select(rect);
                    if (ignore(r))
                        return;
                    elements.push({
                        x: +r.attr("x"),
                        y: h - r.attr("y"),
                        width: +r.attr("width"),
                        height: +r.attr("height"),
                        fill: dl._parseColor(r.attr("fill") ? r.attr("fill") : r.style("fill"),
                            r.style("opacity")).rgbFloat,
                        stroke: dl._parseColor(r.attr("stroke") ? r.attr("stroke") : r.style("stroke"),
                            r.style("stroke-opacity")).rgbFloat,
                        strokeWidth: +r.attr("stroke-width")
                    });
                });
                break;
            case "path":
                svg.selectAll("path").nodes(0).forEach(function (path) {
                    var p = d3.select(path);
                    if (ignore(p))
                        return;
                    if (p.attr("d").indexOf("H") > -1 || p.attr("d").indexOf("V") > -1)
                        return;

                    var segments = [];
                    p.attr("d").substring(1).split("L").forEach(function(s) {
                        var coords = s.split(",");
                        segments.push({x: +coords[0], y: h - coords[1]});
                    });
                    elements.push({
                        segments: segments,
                        fill: dl._parseColor(p.attr("fill") ? p.attr("fill") : p.style("fill"),
                            p.style("opacity")).rgbFloat,
                        stroke: dl._parseColor(p.attr("stroke") ? p.attr("stroke") : p.style("stroke"),
                            p.style("stroke-opacity")).rgbFloat,
                        strokeWidth: p.attr("stroke-width")
                            ? +p.attr("stroke-width").replace("px", "") : +p.style("stroke-width").replace("px", "")
                    });
                });
                break;
        }
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
     * @todo Implement rest of SVG elems.
     * @todo Get dimensions from <g> tags.
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
        var data = "data:text/EPS; charset=utf-8," + encodeURIComponent(eps.make());
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
        var data = "data:text/PDF; charset=utf-8," + encodeURIComponent(pdf.make());
        this._download(data, filename);
    },

    /**
     * Converts an SVG element to a JSON file.
     * Only works for graphs.
     *
     * @todo Implement further SVG elems.
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
