(function(window) {

	// Utility

	var maskUrlDefault = 'data:image/png;base64,'
			+ 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAC7lBMVEUAAAABAQECAgIDAwMEBAQF'
			+ 'BQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcY'
			+ 'GBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKior'
			+ 'KyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+'
			+ 'Pj4/Pz9AQEBBQUFCQkJDQ0NERERGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBRUVFS'
			+ 'UlJTU1NUVFRVVVVWVlZXV1dYWFhZWVlaWlpbW1tcXFxdXV1eXl5fX19gYGBhYWFiYmJjY2NkZGRl'
			+ 'ZWVmZmZnZ2doaGhpaWlqampra2tsbGxtbW1ubm5vb29xcXFycnJzc3N0dHR1dXV2dnZ3d3d4eHh5'
			+ 'eXl6enp7e3t8fHx9fX1+fn5/f3+AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiKioqLi4uMjIyN'
			+ 'jY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+g'
			+ 'oKChoaGioqKkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0'
			+ 'tLS1tbW2tra3t7e4uLi5ubm6urq7u7u9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fI'
			+ 'yMjJycnKysrLy8vMzMzNzc3Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc'
			+ '3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v'
			+ '7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///9A5nLSAAAA'
			+ 'AWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB98FHBEuKjDLarAAAAAdaVRY'
			+ 'dENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAAAjNJREFUOMtjYEACjExMLCzMTIwM'
			+ '2AETK7eQhIyslAgvOzM2aU4xTbvAhMyspFAXPWkedCWM7GJGYVUz1+0+fGTfpvnNCdYynEwo8twq'
			+ 'fo1rTt978fbDh3evHl7c1hOty49kCCOPTtK8U08+fPvx4+fPnz++fXpxaXWhhRAzQr9O5uob7779'
			+ 'hIPvHx/sqLISgNnCrpK8+s6nHz+RwI8vT3aVGnJDPMwk5jfvBqo8SMWjDUkKrGAFnEYNJ9+hyQNV'
			+ 'fLo+zUUAZASTeNjaJ99+YoDvr/flKLEAFbBpVp368BML+HJzohU3UAG33Yy7X7Ep+P58XZAwEwOT'
			+ 'UOC65z+wKfj5/lCmLDMDk0T87rfYFXw6W6HGysAik3kYqxOAjrjcpM3GwCKbdQSXgivNOuwMTFLJ'
			+ '+95ht+Lz+Wp1VgYmkdBNL7Er+HA0V56FgZHXef7Db9jkf7zaEikGjC92vaYLn7Ap+HpvliMPMKyZ'
			+ 'peO3vfiOxYB3x8s02ECRxWPdc+kjpiu+3FvoKwJOESwy0asefEGX//Zid74GOyTBcOoW7njyFdWM'
			+ 'b6+Ot9rwQ3MIE79F9a5Hn74jJ5cXx3vcxeCJklnIqnTD9TdfoEp+fH13b3ebuxQrIlkzCxgmTdt3'
			+ '4/n7T1++fP7w6u6xhfk24qwo+YpbwSVn4rqDZy9fOX90y6wyXw1+tLzFyMqvZBWcUdHUXJ0b6agh'
			+ 'zI6ZgxlZuIRlVbW11eXFeFhxZHAmZlY2dlYWlPwPAD6nKPWk11d/AAAAAElFTkSuQmCC';

	var count = new Date().getTime();
	var $e = function(name, attr) {
		var id = "_leaflet_tilelayer_mask_" + (count++);
		if (document.getElementById(id) != null)
			return $e(name, attr);
		var e = document.createElementNS("http://www.w3.org/2000/svg", name);
		e.setAttribute("id", id);
		if (attr)
			for (key in attr)
				if (key == "href")
					e.setAttributeNS("http://www.w3.org/1999/xlink", key, attr[key]);
				else
					e.setAttribute(key, attr[key]);
		return e;
	};

	// Main

	L.TileLayer.Mask = L.TileLayer.extend({
		options : {
			maskWidth : 512,
			maskHeight : 512,
			maskUrl : maskUrlDefault
		},
		_tileEventHandler : {
			"tileload" : function(e) {
				if (this._e5) {
					var p = L.DomUtil.getPosition(e.tile);
					e.tile._svgimg = $e("image", {
						x : p.x,
						y : p.y,
						width : this.options.tileSize,
						height : this.options.tileSize,
						href : e.url
					});
					this._e5.appendChild(e.tile._svgimg);
				}
			},
			"tileunload" : function(e) {
				var img = e.tile._svgimg;
				if (img && img.parentNode)
					img.parentNode.removeChild(img);
			}
		},
		_mapEventHandler : {
			"move" : function(e) {
				if (this._e7 && this._map) {
					var p = this._map.containerPointToLayerPoint([ 0, 0 ]);
					this._e7.setAttribute("x", -p.x);
					this._e7.setAttribute("y", -p.y);
				}
			},
			"viewreset" : function(e) {
				if (this._e5)
					while (this._e5.firstChild)
						this._e5.removeChild(this._e5.firstChild);
			},
			"zoomstart" : function(e) {
				if (this._e1)
					this._e1.style.opacity = 0.5;
			},
			"zoomend" : function(e) {
				if (this._e1)
					this._e1.style.opacity = 1.0;
			}
		},
		onRemove : function(map) {
			L.TileLayer.prototype.onRemove.call(this, map);
			if (this._e1 && this._e1.parentNode)
				this._e1.parentNode.removeChild(this._e1);
			this.off(this._tileEventHandler, this);
			map.off(this._mapEventHandler, this);
		},
		onAdd : function(map) {
			L.TileLayer.prototype.onAdd.call(this, map);
			this.getContainer().style.display = "none";
			this.on(this._tileEventHandler, this);
			map.on(this._mapEventHandler, this);

			this._e1 = $e("svg", {
				width : "100%",
				height : "100%",
				style : "pointer-events:none;position:relative;"
			});
			this._e2 = $e("defs");
			this._e3 = $e("mask", {
				maskUnits : "userSpaceOnUse"
			});
			this._e4 = $e("image", {
				width : this.options.maskWidth,
				height : this.options.maskHeight,
				href : this.options.maskUrl,
				preserveAspectRatio : "none"
			});
			this._e5 = $e("g");
			this._e6 = $e("g", {
				mask : "url(#" + this._e3.getAttribute("id") + ")"
			});
			this._e7 = $e("use", {
				href : "#" + this._e5.getAttribute("id")
			});
			this._e1.appendChild(this._e2);
			this._e2.appendChild(this._e3);
			this._e3.appendChild(this._e4);
			this._e2.appendChild(this._e5);
			this._e1.appendChild(this._e6);
			this._e6.appendChild(this._e7);

			var cnt = map.getContainer();
			cnt.appendChild(this._e1);
			this.setCenter(cnt.clientWidth * 0.5, cnt.clientHeight * 0.5);
		},
		setCenter : function(x, y) {
			if (this._e4) {
				this._e4.setAttribute("x", x - this.options.maskWidth * 0.5);
				this._e4.setAttribute("y", y - this.options.maskHeight * 0.5);
			}
			return this;
		}
	});

	L.tileLayer.mask = function(url, options) {
		return new L.TileLayer.Mask(url, options);
	};
})(window);
