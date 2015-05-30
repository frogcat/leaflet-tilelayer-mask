# leaflet-tilelayer-mask

Leaflet-tilelayer-mask adds mask effect to tilelayer.


![Leaflet-tilelayer-mask](http://frogcat.github.io/leaflet-tilelayer-mask/screenshot.jpg)



## Demo

http://frogcat.github.io/leaflet-tilelayer-mask/

## Usage

    // Create background tile layer
      var bg  L.tileLayer(...);
      
      // Create foreground tile layer with mask
      var fg = L.tileLayer.mask('http://www.finds.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png', {
        	  maskUrl : 'star.png', // optional
        	  maskWidth : 800,  //optional
        	  maskHeight : 800 //optional
          });
          
      // Create map with layers and bind listener to update center of mask
      var map = L.map("map", {
     	          zoom : ...,
     	  center : ...,
     	  layers : [ bg, fg ]
       }).on("mousemove", function(e) {
     	  fg.setCenter(e.containerPoint.x, e.containerPoint.y);
       });

## Options

Option  | Type | Default | Description
--------|------|---------|-------------
maskUrl  | String | #1 |  Url of mask image
maskWidth  | Number | 512 | mask width
maskHeight  | Number | 512 | mask height

Note #1 : Built in image 'data:image/png;base64,...' (white circle with soft edge) 

## Methods

Mthod  | Returns | Description
----- | -------------|------
setCenter(x,y)  | this | Set the mask center relative to map container.




## Important notice

* Leaflet-tilelayer-mask depends on SVG mask.
* To improve rendering performance, tile layer container is added as a child of map container.
* Other layers (include Marker, Popup, Vector) will be shown behind the masked tile layer.
