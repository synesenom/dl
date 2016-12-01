# description
Library for exporting SVG content from the DOM.

# requirements
`d3`

# API reference
- [png](#png)


### png
```
dl.png(svg, filename, options)
```
Exports a specific SVG content as a PNG image.

argument | description
--- | ---
`svg` | Selector for the SVG element to export, either the SVG element itself, its ID or class.
`filename` | Name of the exported PNG
`options` | Additional options for the PNG. Possible keys: `width`, `height`.

