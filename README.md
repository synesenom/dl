# Description
Library for exporting SVG content from the DOM.


# Requirements
`d3`


# API reference
- [png](#png)
- [eps](#eps)
- [graph](#graph)


## png
```
dl.png(svg, filename, options)
```
Exports a specific SVG content as a PNG image.

argument | description
--- | ---
`svg` | Selector for the SVG element to export, either the SVG element itself, its ID or class.
`filename` | Name of the exported PNG
`options` | Additional options for the PNG. Possible keys: `width`, `height`.


## eps
```
dl.eps(svg, filename)
```
Exports a specific SVG content as an EPS image. Supported shapes: `line`, `circle`. Note that opacity is converted to blending with white color, but no real transparency is implemented.

argument | description
--- | ---
`svg` | Selector for the SVG element to export, either the SVG element itself, its ID or class.
`filename` | Name of the exported EPS.


## graph
```
dl.graph(svg, filename)
```
Exports the specified SVG content to a graph JSON file. The SVG content is expected to be a network drawn with d3, that is, only `circle` and `line` elements are exported.

argument | description
--- | ---
`svg` | Selector for the SVG element to export, either the SVG itself, its ID or class.
`filename` | Name of the exported JSON.


# TODO
- eps: implement missing shapes, text
- eps: full styling in EPS