(function(window) {

	var NS_SVG = "http://www.w3.org/2000/svg";
	var NS_XLINK = "http://www.w3.org/1999/xlink";

	var $e = function(name, attr) {
		var e = document.createElementNS(NS_SVG, name);
		if (attr)
			for (key in attr)
				if (key == "href")
					e.setAttributeNS(NS_XLINK, key, attr[key]);
				else
					e.setAttribute(key, attr[key]);
		return e;
	};

	L.TileLayer.Mask = L.TileLayer.extend({
		initialize : function(url, options, mask, width, height) {
			L.TileLayer.prototype.initialize.call(this, url, options);
			this._mask = mask;
			this._width = width;
			this._height = height;
		},
		_onTileLoad : function(e) {
			if (this._e5) {
				var p = L.DomUtil.getPosition(e.tile);
				e.tile.img = $e("image", {
					x : p.x,
					y : p.y,
					width : 256,
					height : 256,
					href : e.url
				});
				this._e5.appendChild(e.tile.img);
			}
		},
		_onTileUnload : function(e) {
			var img = e.tile.img;
			if (img && img.parentNode)
				img.parentNode.removeChild(img);
		},
		_onMove : function(e) {
			if (this._e7 && this._map) {
				var p = this._map.containerPointToLayerPoint([ 0, 0 ]);
				this._e7.setAttribute("x", -p.x);
				this._e7.setAttribute("y", -p.y);
			}
		},
		_onViewReset : function(e) {
			if (this._e5)
				while (this._e5.firstChild)
					this._e5.removeChild(this._e5.firstChild);
		},
		_onZoomStart : function(e) {
			if (this._e1)
				this._e1.style.opacity = 0.5;
		},
		_onZoomEnd : function(e) {
			if (this._e1)
				this._e1.style.opacity = 1.0;
		},
		onRemove : function(map) {
			L.TileLayer.prototype.onRemove.call(this, map);
			if (this._e1 && this._e1.parentNode)
				this._e1.parentNode.removeChild(this._e1);
			this.off({
				"tileload" : this._onTileLoad,
				"tileunload" : this._onTileUnload
			}, this);
			map.off({
				"move" : this._onMove,
				"viewreset" : this._onViewReset,
				"zoomstart" : this._onZoomStart,
				"zoomend" : this._onZoomEnd
			}, this);
		},
		onAdd : function(map) {

			L.TileLayer.prototype.onAdd.call(this, map);
			this.getContainer().style.display = "none";
			this.on({
				"tileload" : this._onTileLoad,
				"tileunload" : this._onTileUnload
			}, this);
			map.on({
				"move" : this._onMove,
				"viewreset" : this._onViewReset,
				"zoomstart" : this._onZoomStart,
				"zoomend" : this._onZoomEnd
			}, this);

			this._map = map;

			this._e1 = $e("svg", {
				width : "100%",
				height : "100%",
				style : "pointer-events:none;position:relative;"
			});
			this._e2 = $e("defs");
			this._e3 = $e("mask", {
				"id" : "e3",
				"maskUnits" : "userSpaceOnUse"
			});
			this._e4 = $e("image", {
				x : -0.5 * this._width,
				y : -0.5 * this._height,
				width : this._width,
				height : this._height,
				href : this._mask,
				preserveAspectRatio : "none"
			});
			this._e5 = $e("g", {
				"id" : "e5"
			});
			this._e6 = $e("g", {
				"mask" : "url(#e3)"
			});
			this._e7 = $e("use", {
				"x" : 0,
				"y" : 0,
				href : "#e5"
			});
			this._e1.appendChild(this._e2);
			this._e2.appendChild(this._e3);
			this._e3.appendChild(this._e4);
			this._e2.appendChild(this._e5);
			this._e1.appendChild(this._e6);
			this._e6.appendChild(this._e7);

			map.getContainer().appendChild(this._e1);
		},
		setCenter : function(x, y) {
			if (this._e4) {
				this._e4.setAttribute("x", x - this._width * 0.5);
				this._e4.setAttribute("y", y - this._height * 0.5);
			}
			return this;
		}
	});

	L.tileLayer.mask = function(url, options, a, b, c) {
		return new L.TileLayer.Mask(url, options, a, b, c);
	};
})(window);
