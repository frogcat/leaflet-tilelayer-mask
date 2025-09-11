import { TileLayer, Point, Util } from "leaflet";

function $svg(name, attributes) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [k, v] of Object.entries(attributes || {}))
    if (k.startsWith("xlink:")) e.setAttributeNS("http://www.w3.org/1999/xlink", k, v);
    else e.setAttribute(k, v);
  return e;
}

const defaultMaskUrl = [
  "data:image/png;base64,",
  "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEC0lEQVRYR7WX+YuVZRTHP09pZZot",
  "WpiamktpUWJGC6GEoLigRIo/CFr/WgtqGqREuKRptBCUQmkqKuMSU+mMy4zOlOPUK5/LeeT1eu/c",
  "9+rMAy/vMPfe53zP93zPlmjzFEWRAB/PA/EugNqTUvJd+eSLWv6gKAqNPQg8BDwc71EB5j9gALgR",
  "78GUkv9reVoCCMMafAyYADwNTAQeB8YEgH+Ba8Bl4CJwCegB/mkFpCmAoFpvNTQVmBPPDOAZYDzw",
  "SADQewF0A38Ap4GTwLkAcyOl9H8jOhoCCOOPAs8CLwOvA68AzwcLfjY6QuK9Xj6ox8DVAPE7cAj4",
  "FTgPXG/Exl0AwvhYQE/fBBYD84HJwLiIfRZf+feKLwPpj1AcB74HfghGeupB3AGg5LmeanhpGJdy",
  "6VaEVY5ADMsVQBAHgG+AY0BvORz1ABTbc8C7wCpgYcRbLbQUbB0yGTEshsRw7Ab2BhP9OV1vXxpq",
  "V91vA+8Di4L2ezGesWQQZscvwBfAfqAzpXTTL5UBmFLzgPeA1aF4xdau5/UhEoTh6AT2AdsDjHqo",
  "VTXCe/Nb6jcEC0+1EfNWulAT14HfgG3AV2ZGSmkwA5DmWcBaYB3wQhSZVhe387mUy4LGN5ueKaW+",
  "DMC0U3AbgeXAJMAyO5xHFhSkKfkRcNAsSUH/E0H/h8A7wJPDEPtG4K0PhuET4EvgzwzAPNdzAciE",
  "jNyv+BoBsFmdArYAnwNnBCDVUr4G2AS8OgLxz2DUwZnIBEGcygCs+RmANd+UHIkjgLP1AKzrMrAS",
  "+ABYAAxH/jdywHpgp9wa6diRNWDOLwkNWAltwSOhAbvlUeBTYGetIkYDssu9EQzYgCxKVRtP1VBZ",
  "EXuBn4CPoyp25zpgE3oRWB99YGaMXVUvr/I9G9MFYE8w8DNwuxDprTrQe0uxA4hhyH2/ioGhvqP3",
  "1oATkX47gI6U0kC5GRkGBw9L8QpgerAwHFpQ/c6K3wKfAT86PzoXlAHkemBDsh2/FcOno9f9HKdj",
  "Y28FVHi7agUoJYvSnUovisL8nw0si7S0JliWDdG9MKFxu6Cp93U0oiMxFdX2h/qJyJg7fjsXqAdT",
  "07/tFTJRVRN5ENF4B/BdiO+wU3J5Lmw0lOqtApwbU5GTkSBMzTwXNgOiYb2WXjufnpt2dj5D0JUn",
  "oRzTZmO5IGTC4fS1qBEvAVMCXD2QbDjvB3/H7OcYZrrZgBRdbQwrn6EWE71UE3quLmTBWjEtxCnA",
  "PC96cV9sRg4dGnQCdjn5q9lOcJcG6tFFlTQ77A2uZdYK9wNBKc7cM1zNXMXcjDTo0xUCHBhqYa2k",
  "7ACSF1NZ0bBhkAGPVU4Q1noLjhpwQW25KVcCUGYmJih/Z4jyqu64lTejtlb0W3sASziD1RhmAAAA",
  "AElFTkSuQmCC",
].join("");

export default class TileLayerWithMask extends TileLayer {
  static {
    this.setDefaultOptions({
      maskUrl: defaultMaskUrl,
      maskSize: 512,
    });
  }
  getMaskSize() {
    const s = this.options.maskSize;
    return s instanceof Point ? s : new Point(s, s);
  }
  setCenter(containerPoint) {
    if (arguments.length === 2) {
      this.setCenter(new Point(arguments[0], arguments[1]));
      return;
    }
    if (this._map && this._image) {
      const p = this._map
        .containerPointToLayerPoint(containerPoint)
        .subtract(this.getMaskSize().divideBy(2));
      this._image.setAttribute("x", p.x);
      this._image.setAttribute("y", p.y);
    }
  }
  _initContainer() {
    if (this._container) return;
    const id = "leaflet-tilelayer-mask-" + Util.stamp(this);
    const size = this.getMaskSize();
    const image = $svg("image", {
      width: size.x,
      height: size.y,
      "xlink:href": this.options.maskUrl,
    });
    const mask = $svg("mask", {
      id: id,
      x: "-100%",
      y: "-100%",
      width: "300%",
      height: "300%",
    });
    const defs = $svg("defs");
    const container = $svg("g", {
      mask: `url(#${id})`,
    });
    const rootGroup = this._map.getRenderer(this)._rootGroup;

    mask.appendChild(image);
    defs.appendChild(mask);
    rootGroup.appendChild(defs);
    rootGroup.appendChild(container);

    this._container = container;
    this._image = image;
    this.setCenter(this._map.getSize().divideBy(2));
  }
  _updateLevels() {
    const zoom = this._tileZoom;
    if (zoom === undefined) return undefined;

    for (const z in this._levels) {
      if (!this._levels[z].el.firstChild && z !== zoom) {
        this._levels[z].el.parentNode.removeChild(this._levels[z].el);
        this._removeTilesAtZoom(z);
        delete this._levels[z];
      }
    }

    let level = this._levels[zoom];
    if (!level) {
      const map = this._map;
      level = {
        el: this._container.appendChild($svg("g")),
        origin: map.project(map.unproject(map.getPixelOrigin()), zoom).round(),
        zoom: zoom,
      };

      const translate = level.origin
        .multiplyBy(map.getZoomScale(map.getZoom(), level.zoom))
        .subtract(map._getNewPixelOrigin(map.getCenter(), zoom))
        .round();
      level.el.setAttribute("transform", `translate(${translate.x},${translate.y})`);

      Util.falseFn(level.el.offsetWidth);
      this._levels[zoom] = level;
    }
    this._level = level;
    return level;
  }
  _addTile(coords, container) {
    const tilePos = this._getTilePos(coords);
    const tileSize = this.getTileSize();
    const key = this._tileCoordsToKey(coords);
    const url = this.getTileUrl(this._wrapCoords(coords));

    const tile = $svg("image", {
      width: tileSize.x,
      height: tileSize.y,
      x: tilePos.x,
      y: tilePos.y,
      "xlink:href": url,
    });
    container.appendChild(tile);

    this._tiles[key] = {
      el: tile,
      coords: coords,
      current: true,
    };
  }
}
