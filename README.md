# leaflet-tilelayer-mask

Leaflet-tilelayer-mask adds mask effect to tilelayer.


![Leaflet-tilelayer-mask](http://frogcat.github.io/leaflet-tilelayer-mask/misc/screenshot.jpg)



## Demo

<http://frogcat.github.io/leaflet-tilelayer-mask/>

## Usage

    // Create background tile layer
      var bg  L.tileLayer(...);

      // Create foreground tile layer with mask
      var fg = L.tileLayer.mask('http://www.finds.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png', {
        	  maskUrl : 'star.png', // optional
        	  maskSize : 1024  //optional
          });

      // Create map with layers and bind listener to update center of mask
      var map = L.map("map", {
     	          zoom : ...,
     	  center : ...,
     	  layers : [ bg, fg ]
       }).on("mousemove", function(e) {
     	  fg.setCenter(e.containerPoint);
       });

## Options

Option  | Type | Default | Description
--------|------|---------|-------------
maskUrl  | String | #1 |  Url of mask image
maskSize  | L.point or Number | L.point(512,512) | mask size

Note #1 : Built in image 'data:image/png;base64,...' (white circle with soft edge)

## Methods

Method  | Returns | Description
----- | -------------|------
setCenter(Number x, Number y)  | this | Set the mask center relative to map container.
setCenter(Point p)  | this | Expects a L.Point object  instead


## Notice

* Leaflet-tilelayer-mask depends on SVG mask.
