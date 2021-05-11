(function() {

  var defaultMaskUrl = [
    'data:image/png;base64,',
    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEC0lEQVRYR7WX+YuVZRTHP09pZZot',
    'WpiamktpUWJGC6GEoLigRIo/CFr/WgtqGqREuKRptBCUQmkqKuMSU+mMy4zOlOPUK5/LeeT1eu/c',
    '9+rMAy/vMPfe53zP93zPlmjzFEWRAB/PA/EugNqTUvJd+eSLWv6gKAqNPQg8BDwc71EB5j9gALgR',
    '78GUkv9reVoCCMMafAyYADwNTAQeB8YEgH+Ba8Bl4CJwCegB/mkFpCmAoFpvNTQVmBPPDOAZYDzw',
    'SADQewF0A38Ap4GTwLkAcyOl9H8jOhoCCOOPAs8CLwOvA68AzwcLfjY6QuK9Xj6ox8DVAPE7cAj4',
    'FTgPXG/Exl0AwvhYQE/fBBYD84HJwLiIfRZf+feKLwPpj1AcB74HfghGeupB3AGg5LmeanhpGJdy',
    '6VaEVY5ADMsVQBAHgG+AY0BvORz1ABTbc8C7wCpgYcRbLbQUbB0yGTEshsRw7Ab2BhP9OV1vXxpq',
    'V91vA+8Di4L2ezGesWQQZscvwBfAfqAzpXTTL5UBmFLzgPeA1aF4xdau5/UhEoTh6AT2AdsDjHqo',
    'VTXCe/Nb6jcEC0+1EfNWulAT14HfgG3AV2ZGSmkwA5DmWcBaYB3wQhSZVhe387mUy4LGN5ueKaW+',
    'DMC0U3AbgeXAJMAyO5xHFhSkKfkRcNAsSUH/E0H/h8A7wJPDEPtG4K0PhuET4EvgzwzAPNdzAciE',
    'jNyv+BoBsFmdArYAnwNnBCDVUr4G2AS8OgLxz2DUwZnIBEGcygCs+RmANd+UHIkjgLP1AKzrMrAS',
    '+ABYAAxH/jdywHpgp9wa6diRNWDOLwkNWAltwSOhAbvlUeBTYGetIkYDssu9EQzYgCxKVRtP1VBZ',
    'EXuBn4CPoyp25zpgE3oRWB99YGaMXVUvr/I9G9MFYE8w8DNwuxDprTrQe0uxA4hhyH2/ioGhvqP3',
    '1oATkX47gI6U0kC5GRkGBw9L8QpgerAwHFpQ/c6K3wKfAT86PzoXlAHkemBDsh2/FcOno9f9HKdj',
    'Y28FVHi7agUoJYvSnUovisL8nw0si7S0JliWDdG9MKFxu6Cp93U0oiMxFdX2h/qJyJg7fjsXqAdT',
    '07/tFTJRVRN5ENF4B/BdiO+wU3J5Lmw0lOqtApwbU5GTkSBMzTwXNgOiYb2WXjufnpt2dj5D0JUn',
    'oRzTZmO5IGTC4fS1qBEvAVMCXD2QbDjvB3/H7OcYZrrZgBRdbQwrn6EWE71UE3quLmTBWjEtxCnA',
    'PC96cV9sRg4dGnQCdjn5q9lOcJcG6tFFlTQ77A2uZdYK9wNBKc7cM1zNXMXcjDTo0xUCHBhqYa2k',
    '7ACSF1NZ0bBhkAGPVU4Q1noLjhpwQW25KVcCUGYmJih/Z4jyqu64lTejtlb0W3sASziD1RhmAAAA',
    'AElFTkSuQmCC'
  ].join("");

  L.TileLayer.Mask = L.TileLayer.extend({
    options: {
      maskUrl: defaultMaskUrl,
      maskSize: 512
    },
    getMaskSize: function() {
      var s = this.options.maskSize;
      return s instanceof L.Point ? s : new L.Point(s, s);
    },
    setCenter: function(containerPoint) {
      if (arguments.length === 2) {
        this.setCenter(L.point(arguments[0], arguments[1]));
        return;
      }
      if (this._map) {
        var p = this._map.containerPointToLayerPoint(containerPoint);
        p = p.subtract(this.getMaskSize().divideBy(2));
        this._image.setAttribute("x", p.x);
        this._image.setAttribute("y", p.y);
      }
    },
    _initContainer: function() {
      if (this._container) return;
      var rootGroup = this._map.getRenderer(this)._rootGroup;
      var defs = rootGroup.appendChild(L.SVG.create("defs"));
      var container = rootGroup.appendChild(L.SVG.create("g"));
      var mask = defs.appendChild(L.SVG.create("mask"));
      var image = mask.appendChild(L.SVG.create("image"));
      var size = this.getMaskSize();
      mask.setAttribute("id", "leaflet-tilelayer-mask-" + L.stamp(this));
      mask.setAttribute("x", "-100%");
      mask.setAttribute("y", "-100%");
      mask.setAttribute("width", "300%");
      mask.setAttribute("height", "300%");
      image.setAttribute("width", size.x);
      image.setAttribute("height", size.y);
      image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", this.options.maskUrl);
      container.setAttribute("mask", "url(#" + mask.getAttribute("id") + ")");
      this._container = container;
      this._image = image;
      this.setCenter(this._map.getSize().divideBy(2));
    },
    _updateLevels: function() {

      var zoom = this._tileZoom;
      if (zoom === undefined)
        return undefined;

      for (var z in this._levels) {
        if (!this._levels[z].el.firstChild && z !== zoom) {
          L.DomUtil.remove(this._levels[z].el);
          this._removeTilesAtZoom(z);
          delete this._levels[z];
        }
      }

      var level = this._levels[zoom];
      if (!level) {
        var map = this._map;
        level = {
          el: this._container.appendChild(L.SVG.create("g")),
          origin: map.project(map.unproject(map.getPixelOrigin()), zoom).round(),
          zoom: zoom
        };
        this._setZoomTransform(level, map.getCenter(), map.getZoom());
        L.Util.falseFn(level.el.offsetWidth);
        this._levels[zoom] = level;
      }
      this._level = level;
      return level;
    },
    _addTile: function(coords, container) {
      var tilePos = this._getTilePos(coords);
      var tileSize = this.getTileSize();
      var key = this._tileCoordsToKey(coords);
      var url = this.getTileUrl(this._wrapCoords(coords));

      var tile = container.appendChild(L.SVG.create("image"));
      tile.setAttribute("width", tileSize.x);
      tile.setAttribute("height", tileSize.y);
      tile.setAttribute("x", tilePos.x);
      tile.setAttribute("y", tilePos.y);
      tile.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", url);

      this._tiles[key] = {
        el: tile,
        coords: coords,
        current: true
      };
    },
    _setZoomTransform: function(level, center, zoom) {
      var scale = this._map.getZoomScale(zoom, level.zoom),
        translate = level.origin.multiplyBy(scale)
        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();
      level.el.setAttribute("transform", "translate(" + translate.x + "," + translate.y + ")");
    }
  });

  L.tileLayer.mask = function(url, options) {
    return new L.TileLayer.Mask(url, options);
  };

})();
