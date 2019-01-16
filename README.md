# leaflet-tilelayer-mask (v1.0)

Leaflet 1.0.x plugin, Leaflet-tilelayer-mask adds mask effect to tilelayer. Older version for Leaflet 0.7.x is available [here](https://github.com/frogcat/leaflet-tilelayer-mask/tree/v0.7).

![Leaflet-tilelayer-mask](http://frogcat.github.io/leaflet-tilelayer-mask/misc/screenshot.jpg)

## Demo

<http://frogcat.github.io/leaflet-tilelayer-mask/>

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
var fg = L.tileLayer.mask('http://www.finds.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png', {
  maskUrl : 'star.png', // optional
  maskSize : 1024  //optional
).addTo(map);

// Add event handler to update mask position
map.on("mousemove", function(e) {
 fg.setCenter(e.containerPoint);
});
```

## Options

Option   | Type              | Default          | Description
-------- | ----------------- | ---------------- | -----------------
maskUrl  | String            | #1               | Url of mask image
maskSize | L.point or Number | L.point(512,512) | mask size

Note #1 : Built in image 'data:image/png;base64,...' (white circle with soft edge)

## Methods

Method                        | Returns | Description
----------------------------- | ------- | ----------------------------------------------
setCenter(Number x, Number y) | this    | Set the mask center relative to map container.
setCenter(Point p)            | this    | Expects a L.Point object instead

## Notice

- Leaflet-tilelayer-mask depends on SVG mask.
