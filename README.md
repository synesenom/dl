# Description
Library for exporting SVG content from the DOM.


# Requirements
`d3`


# API reference
- [png](#png)
- [eps](#eps)


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
Exports a specific SVG content as an EPS image. Supported shapes: `line`, `circle`. Note that opacity is ignored during conversion.

argument | description
--- | ---
`svg` | Selector for the SVG element to export, either the SVG element itself, its ID or class.
`filename` | Name of the exported EPS.


# TODO
- missing shapes, text for EPS
- full styling in EPS
