/**
 * A very simple object to download an SVG as PNG.
 */
var dl = {
	// We collect all the junk elements we create with dl.
	_junk: {},

	/**
	 * Generates a 32-character identifier to access the canvas
	 * and not to mess up existing elements.
	 *
	 * @return {number} The generated identifier.
	 */
	_tmpId: function() {
		var id = "";
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i=0; i<32; i++)
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
	 */
	_getMetrics: function(svgElem, options) {
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
				m.canvas.w = scaleH * svgW;
				m.scale.w = m.scale.h;
			}
		}

	return m;
	},

	/**
	 * Cleans up DOM by removing all the elements we
	 * created.
	 */
	_clean: function() {
		if (this._junk) {
			for (var elem in this._junk) {
				this._junk[elem].remove();
			}
		}
	},

	/**
	 * Returns the color from a style attribute of an element.
	 *
	 * @param {string} style Style describing the color to parse.
	 * @param {number} opacity Optional opacity value to mix with the color.
	 * @return {object} An object of the parsed color in various formats.
	 */
	_parseColor: function(color, opacity) {
		// TODO recognize format

		// RGB integer
		var arr = color.split("(")[1].split(")")[0].replace(/,/g, "").split(" ");
		var c = {
			r: parseInt(arr[0]),
			g: parseInt(arr[1]),
			b: parseInt(arr[2])
		};

		// Blend with opacity
		if (opacity != null) {
			c.r = parseInt((255 - c.r) * opacity + c.r);
			c.g = parseInt((255 - c.g) * opacity + c.g);
			c.b = parseInt((255 - c.b) * opacity + c.b);
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
				r: c.r/255,
				g: c.g/255,
				b: c.b/255
			},
			rgbHex: "#" + toHex(c.r) + toHex(c.g) + toHex(c.b)
		};
	},

	/**
	 * Triggers a download of the data with the specified filename.
	 *
	 * @param {string} data Data to download.
	 * @param {string} filename Name of the file to download.
	 */
	_trigger: function(data, filename) {
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
	png: function(selector, filename, options) {
		// Get SVG element and get options
		var svgElem = d3.select(selector);
		var metrics = this._getMetrics(svgElem, options);

		// Copy SVG content to a temporary div to make sure we only have the graphics
		dl._junk.div = d3.select("body").append("div");
		dl._junk.svg = dl._junk.div.append("svg")
						.attr("version", 1.1)
						.attr("xmlns", "http://www.w3.org/2000/svg")
						.attr("width", svgElem.attr("width"))
						.attr("height", svgElem.attr("height"))
						.html(svgElem.html());

		// Create rescaled canvas
		var id = "dl-png-" + this._tmpId();
		d3.select("canvas").remove();
		dl._junk.canvas = d3.select("body").append("canvas")
							.attr("id", id)
							.attr("width", metrics.canvas.w)
							.attr("height", metrics.canvas.h)
							.style("display", "none").node(0);
		var context = dl._junk.canvas.getContext("2d");
		context.scale(metrics.scale.w, metrics.scale.h);

		// Create image source from clean SVG
		var html = this._junk.svg.node().parentNode.innerHTML;
		var imgsrc = "data:image/svg+xml;base64," + btoa(html);

		// Put image in canvas
		var image = new Image;
		image.onload = function() {
			// Draw image in canvas
			context.drawImage(image, 0, 0);
			var canvasData = dl._junk.canvas.toDataURL("image/png");

			// Create blob from canvas and fill with data
			var byteString = atob(document.querySelector("#" + id)
								.toDataURL()
								.replace(/^data:image\/(png|jpg);base64,/, ""));
			var ab = new ArrayBuffer(byteString.length);
			var ia = new Uint8Array(ab);
			for (var i=0; i<byteString.length; i++)
			ia[i] = byteString.charCodeAt(i);
			var dataView = new DataView(ab);
			var blob = new Blob([dataView], {type: "image/png"});
			var DOMURL = self.URL || self.webkitURL || self;
			var newurl = DOMURL.createObjectURL(blob);

			// Create link with the image and trigger the click right away
			this._trigger(canvasData, filename);

			// Clean up DOM
			dl._clean();
		};
		image.src = imgsrc;
	},

	/**
	 * Converts an SVG element to EPS and triggers the download right away.
	 *
	 * @param {string} selector Selector for the SVG element to convert.
	 * @param {string} filename Name of the file to download.
	 */
	eps: function(selector, filename) {
		// Get dimensions
		var svgElem = d3.select(selector);
		var w = svgElem.attr("width");
		var h = svgElem.attr("height");

		// Get links and nodes
		var links = [];
		svgElem.selectAll("line").nodes(0).forEach(function(line) {
			var l = d3.select(line);
			var stroke = dl._parseColor(l.style("stroke"), l.style("opacity"));
			links.push("["
				+ l.attr("x1")
				+ " " + (h-l.attr("y1"))
				+ " " + l.attr("x2")
				+ " " + (h-l.attr("y2"))
				+ " " + stroke.rgbFloat.r + " " + stroke.rgbFloat.g + " " + stroke.rgbFloat.b
				+ "]");
		});
		var nodes = [];
		svgElem.selectAll("circle").nodes(0).forEach(function(circle) {
			var c = d3.select(circle);
			var fill = dl._parseColor(c.style("fill"));
			nodes.push("["
				+ c.attr("cx")
				+ " " + (h-c.attr("cy"))
				+ " " + c.attr("r")
				+ " " + fill.rgbFloat.r + " " + fill.rgbFloat.g + " " + fill.rgbFloat.b
				+ "]");
		});

		// Write header
		var eps = "%!PS-Adobe-2.0 EPSF-2.0\n% Generated by perceive 0.1\n";
		eps += "%%BoundingBox: 0 0 " + w + " " + h + "\n";

		// Style
		eps += "/nodeStroke [ 1 1 1 ] def\n";
		eps += "/nodeStrokeWidth 2 def\n";
		eps += "/linkStrokeWidth 1 def\n";

		// Define link
		eps += "/link {\n7 dict begin\n/b exch def/g exch def/r exch def/y2 exch def/x2 exch def/y1 exch def/x1 exch def\n";
		eps += "gsave\nnewpath\n";
		eps += "r g b setrgbcolor\n";
		eps += "linkStrokeWidth setlinewidth\n";
		eps += "x1 y1 moveto x2 y2 lineto stroke\n";
		eps += "grestore end\n} def\n";

		// Draw links
		eps += "/links [" + links.join(" ") + "] def\n";
		eps += "0 1 links length 1 sub {\n";
		eps += "gsave\n";
		eps += "/args exch links exch get def\n";
		eps += "args 0 get args 1 get args 2 get args 3 get args 4 get args 5 get args 6 get link\n"
		eps += "grestore\n} for\n";

		// Define node
		eps += "/node {\n6 dict begin\n/b exch def/g exch def/r exch def/radius exch def/y exch def/x exch def\n";
		eps += "gsave\nnewpath\n";
		eps += "r g b setrgbcolor\n";
		eps += "x y radius 0 360 arc\n";
		eps += "gsave fill grestore\n";
		eps += "nodeStroke 0 get nodeStroke 1 get nodeStroke 2 get setrgbcolor\n";
		eps += "nodeStrokeWidth setlinewidth\n";
		eps += "stroke\n";
		eps += "grestore end\n} def\n";

		// Draw nodes
		eps += "/nodes [" + nodes.join(" ") + "] def\n";
		eps += "0 1 nodes length 1 sub {\n";
		eps += "gsave\n";
		eps += "/args exch nodes exch get def\n";
		eps += "args 0 get args 1 get args 2 get args 3 get args 4 get args 5 get node\n"
		eps += "grestore\n} for\n";

		// Write end of file
		eps += "%%EOF";

		var data = "data:text/eps; charset=utf-8," + encodeURIComponent(eps);
		this._trigger(data, filename);
	},

	/**
	 * Converts an SVG element containing a graph into a JSON file.
	 *
	 * @param {string} selector Selector for the SVG element to convert.
	 * @param {string} filename Name of the file to download.
	 */
	graph: function(selector, filename) {
		// Get coordinates
		var svgElem = d3.select(selector);
		var g = {nodes: [], links: []};
		svgElem.selectAll("circle").nodes(0).forEach(function(circle) {
			var c = d3.select(circle);
			g.nodes.push({
				id: +c.attr("id"),
				r: +c.attr("r"),
				x: +c.attr("cx"),
				y: +c.attr("cy")
			});
		});
		svgElem.selectAll("line").nodes(0).forEach(function(line) {
			var l = d3.select(line);
			g.links.push({
				value: +l.attr("stroke-width"),
				x1: +l.attr("x1"),
				y1: +l.attr("y1"),
				x2: +l.attr("x2"),
				y2: +l.attr("y2")
			});
		});

		function r(x1, y1, x2, y2) {
			var dx = x1 - x2;
			var dy = y1 - y2;
			return dx*dx + dy*dy;
		}

		function find(link, dir) {
			var x = dir == "source" ? link.x1 : link.x2;
			var y = dir == "source" ? link.y1 : link.y2;
			var n = g.nodes[0];
			var m = {r: r(n.x, n.y, x, y), id: n.id};
			for (var i=1; i<g.nodes.length; i++) {
				n = g.nodes[i];
				var r1 = r(n.x, n.y, x, y);
				if (r1 < m.r)
					m = {r: r1, id: n.id};
			}
			return m.id;
		}

		g.links.forEach(function(link) {
			link.source = find(link, "source");
			link.target = find(link, "target");
		});
		var data = "data:text/json; charset=utf-8," + encodeURIComponent(JSON.stringify(g, null, 2));
		this._trigger(data, filename);
	}
};
