/**
 * Class for exporting and downloading SVG graphics.
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
     * Color must be given by rgb(...) format.
     *
     * @todo Recognize color input format.
     * @param {string} color Style describing the color to parse.
     * @param {number} opacity Optional opacity value to mix with the color.
     * @return {object} An object of the parsed color in various formats.
     * @private
     */
    _parseColor: function (color, opacity) {
        // RGB integer
        var arr = color.split("(")[1].split(")")[0].replace(/,/g, "").split(" ");
        var c = {
            r: parseInt(arr[0]),
            g: parseInt(arr[1]),
            b: parseInt(arr[2])
        };

        // Blend with opacity
        if (opacity != null) {
            c.r = parseInt(opacity*c.r + (1-opacity)*255);
            c.g = parseInt(opacity*c.g + (1-opacity)*255);
            c.b = parseInt(opacity*c.b + (1-opacity)*255);
        }

        // Converts integer to hex
        function toHex(i) {
            var hex = i.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        // Make color object
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
     * @param {string} selector Selector for the SVG.
     * @param {string} type Type of the element (line, circle).
     * @returns {Array} Array of all elements found.
     * @private
     */
    _getElements: function(selector, type) {
        var svg = d3.select(selector);
        var h = svg.attr("height");

        var elements = [];
        switch (type) {
            case "line":
                svg.selectAll("line").nodes(0).forEach(function (line) {
                    var l = d3.select(line);
                    elements.push({
                        x1: +l.attr("x1"),
                        y1: h - l.attr("y1"),
                        x2: +l.attr("x2"),
                        y2: h - l.attr("y2"),
                        stroke: dl._parseColor(l.style("stroke"), l.style("stroke-opacity")).rgbFloat,
                        strokeWidth: 1
                    });
                });
                break;
            case "circle":
                svg.selectAll("circle").nodes(0).forEach(function (circle) {
                    var c = d3.select(circle);
                    elements.push({
                        x: +c.attr("cx"),
                        y: h - c.attr("cy"),
                        r: +c.attr("r"),
                        color: dl._parseColor(c.style("fill"), c.style("opacity")).rgbFloat,
                        stroke: dl._parseColor(c.style("stroke"), c.style("stroke-opacity")).rgbFloat,
                        strokeWidth: +c.attr("stroke-width")
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
        var svgElem = d3.select(selector);
        var metrics = this._getMetrics(svgElem, options);
        var junk = this._junk;

        // Copy SVG content to a temporary div to make sure we only have the graphics
        junk.content.div = d3.select("body").append("div");
        junk.content.svg = junk.content.div.append("svg")
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("width", svgElem.attr("width"))
            .attr("height", svgElem.attr("height"))
            .html(svgElem.html());

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
     * @param {string} selector Selector for the SVG element to convert.
     * @param {string} filename Name of the file to download.
     */
    eps: function (selector, filename) {
        // Get dimensions
        var svgElem = d3.select(selector);
        var w = svgElem.attr("width");
        var h = svgElem.attr("height");

        // Get links and nodes
        var links = this._getElements(selector, "line");
        var nodes = this._getElements(selector, "circle");

        // Build document
        var eps = new EPS({width: w, height: h})
            .by("dl version 0.1");
        links.forEach(function(l) {
            eps.line(
                {x: l.x1, y: l.y1},
                {x: l.x2, y: l.y2},
                l.stroke,
                l.strokeWidth
            );
        });
        nodes.forEach(function(n) {
            eps.circle(
                {x: n.x, y: n.y},
                n.r,
                n.color,
                n.stroke,
                n.strokeWidth
            );
        });

        // Write it
        var data = "data:text/EPS; charset=utf-8," + encodeURIComponent(eps.make());
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
