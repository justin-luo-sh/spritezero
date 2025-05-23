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


this will take all the svg files in the input folder and create the sprite sheet data in the output folder. Then you will need to manually upload all these output files in the CDN in order to get it running.
## Installation

Requires [nodejs](http://nodejs.org/) v14.15.0 or greater.

```bash
$ npm install
```

## IMPORTANT: PLEASE READ:
1. the input folder should contain all the existing svgs + any new ones you want to add
2. the output folder should contain all the sprites to be used, look for all files marked as "markers.png/json"
3. running the script should generate these sprits locally as well as update them to the target QA CDN path in your .env file, testing on prod will require a manual resource sync.
4. When adding a new sprite for experimentation, please bump the version in the .env folder like v2,v3 so it doesn't override the existing folder.

## Usages

```
node build-sprite.js
```


## Testing:
on the Website side:  in initFunctions.js, change the customSpritePath to match your upload directory. 






