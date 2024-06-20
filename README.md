# spritezero

[![npm version](https://badge.fury.io/js/%40jutaz%2Fspritezero.svg)](https://badge.fury.io/js/%40jutaz%2Fspritezero)

## Overview

Small opinionated sprites.

Why is this different than sprite generation libraries like [spritesmith](https://github.com/Ensighten/spritesmith)?
spritezero was initially created to power a sprite API, and thus is geared towards _performance_, as well as an ability to work with image data in _buffers_ rather than on disk. Also, since version 2.0, spritezero generates sprites based on SVG graphics alone, therefore making it possible to support @2x and higher-dpi sprites from the same source.

## Fork Information

This project was forked from `@mapbox/spritezero`.

### Reasons for Forking

1. **Compatibility Issues with New Node Versions**: The original package relies on `mapnik`, which does not work with the latest versions of Node.js. This dependency created compatibility issues that hindered development and use on modern systems.
2. **Lack of Updates**: The original package was not being actively maintained or updated. This stagnation meant missing out on performance improvements and bug fixes.
3. **Switching to Sharp**: By switching to `sharp`, a more modern and efficient image processing library, we've been able to render more complex and efficient sprites. `sharp` provides better performance, leading to faster sprite generation and reduced resource usage.

## Usage

```js
var spritezero = require('@jutaz/spritezero');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

[1, 2, 4].forEach(function(pxRatio) {
    var svgs = glob.sync(path.resolve(path.join(__dirname, 'input/*.svg')))
        .map(function(f) {
            return {
                svg: fs.readFileSync(f),
                id: path.basename(f).replace('.svg', '')
            };
        });
    var pngPath = path.resolve(path.join(__dirname, 'output/sprite@' + pxRatio + '.png'));
    var jsonPath = path.resolve(path.join(__dirname, 'output/sprite@' + pxRatio + '.json'));

    // Pass `true` in the layout parameter to generate a data layout
    // suitable for exporting to a JSON sprite manifest file.
    spritezero.generateLayout({ imgs: svgs, pixelRatio: pxRatio, format: true }, function(err, dataLayout) {
        if (err) return;
        fs.writeFileSync(jsonPath, JSON.stringify(dataLayout));
    });

    // Pass `false` in the layout parameter to generate an image layout
    // suitable for exporting to a PNG sprite image file.
    spritezero.generateLayout({ imgs: svgs, pixelRatio: pxRatio, format: false }, function(err, imageLayout) {
        spritezero.generateImage(imageLayout, function(err, image) {
            if (err) return;
            fs.writeFileSync(pngPath, image);
        });
    });

});
```

## Installation

Requires [nodejs](http://nodejs.org/) v14.15.0 or greater.

```bash
$ npm install @jutaz/spritezero
```
