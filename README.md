# leaflet-tilelayer-mask

Leaflet 1.x and 2.x plugin, Leaflet-tilelayer-mask adds mask effect to tilelayer. Older version for Leaflet 0.7.x is available [here](https://github.com/frogcat/leaflet-tilelayer-mask/tree/v0.7).

![Leaflet-tilelayer-mask](http://frogcat.github.io/leaflet-tilelayer-mask/misc/screenshot.jpg)

## Demo

- <https://frogcat.github.io/leaflet-tilelayer-mask/> (Leaflet 1.x)
- <https://frogcat.github.io/leaflet-tilelayer-mask/TileLayerWithMask.html> (Leaflet 2.x)

# for Leaflet 1.x

## Usage

```javascript
// Create map
var map = L.map("map", {
 zoom : ...,
 center : ...
});

// Add background tile layer
L.tileLayer(...).addTo(map);

// Create foreground tile layer with mask
var fg = L.tileLayer.mask('https://aginfo.cgk.affrc.go.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.jpg', {
  maskUrl : 'star.png', // optional
  maskSize : 1024  //optional
).addTo(map);

// Add event handler to update mask position
map.on("mousemove", function(e) {
 fg.setCenter(e.containerPoint);
});
```

## Options

| Option   | Type              | Default          | Description       |
| -------- | ----------------- | ---------------- | ----------------- |
| maskUrl  | String            | #1               | Url of mask image |
| maskSize | L.point or Number | L.point(512,512) | mask size         |

Note #1 : Built in image 'data:image/png;base64,...' (white circle with soft edge over transparent background)

## Methods

| Method                        | Returns | Description                                    |
| ----------------------------- | ------- | ---------------------------------------------- |
| setCenter(Number x, Number y) | this    | Set the mask center relative to map container. |
| setCenter(Point p)            | this    | Expects a L.Point object instead               |

## Notice

- Leaflet-tilelayer-mask depends on SVG mask.

# for Leaflet 2.x

[leaflet-tilelayer-mask.js](https://github.com/frogcat/leaflet-tilelayer-mask/blob/master/leaflet-tilelayer-mask.js)
has been rewritten as
[TileLayerWithMask.js](https://github.com/frogcat/leaflet-tilelayer-mask/blob/master/TileLayerWithMask.js),
an ES Module for Leaflet 2.0.

## Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>TileLayerWithMask for leaflet 2.0.0-alpha.1</title>
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0" />
    <link href="https://unpkg.com/leaflet@2.0.0-alpha.1/dist/leaflet.css" rel="stylesheet" />
    <script type="importmap">
      {
        "imports": {
          "leaflet": "https://unpkg.com/leaflet@2.0.0-alpha.1/dist/leaflet.js",
          "mask": "https://frogcat.github.io/leaflet-tilelayer-mask/TileLayerWithMask.js"
        }
      }
    </script>
  </head>
  <body>
    <div id="map" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0"></div>
    <script type="module">
      import { Map, TileLayer } from "leaflet";
      import TileLayerWithMask from "mask";

      const map = new Map("map").setView([35.6323, 139.768815], 15);

      new TileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html">GSI pale</a>',
      }).addTo(map);

      const mask = new TileLayerWithMask(
        "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg",
        {
          maxZoom: 18,
          attribution:
            '<a href="https://maps.gsi.go.jp/development/ichiran.html">GSI seamlessphoto</a>',
          maskSize: 800,
        }
      ).addTo(map);

      map.on("pointermove", function (e) {
        mask.setCenter(e.containerPoint);
      });
    </script>
  </body>
</html>
```
