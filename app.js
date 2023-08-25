! function(e) {
	"use strict";
	var t, n, r = function() {
			try {
				if (e.URLSearchParams && "bar" === new e.URLSearchParams("foo=bar").get("foo")) return e.URLSearchParams
			} catch (t) {}
			return null
		}(),
		i = r && "a=1" === new r({
			a: 1
		}).toString(),
		a = r && "+" === new r("s=%2B").get("s"),
		l = r && "size" in r.prototype,
		o = "__URLSearchParams__",
		s = !r || ((t = new r).append("s", " &"), "s=+%26" === t.toString()),
		p = u.prototype,
		c = !!(e.Symbol && e.Symbol.iterator);
	if (!r || !i || !a || !s || !l) {
		p.append = function(e, t) {
			y(this[o], e, t)
		}, p.delete = function(e) {
			delete this[o][e]
		}, p.get = function(e) {
			var t = this[o];
			return this.has(e) ? t[e][0] : null
		}, p.getAll = function(e) {
			var t = this[o];
			return this.has(e) ? t[e].slice(0) : []
		}, p.has = function(e) {
			return b(this[o], e)
		}, p.set = function e(t, n) {
			this[o][t] = ["" + n]
		}, p.toString = function() {
			var e, t, n, r, i = this[o],
				a = [];
			for (t in i)
				for (e = 0, n = g(t), r = i[t]; e < r.length; e++) a.push(n + "=" + g(r[e]));
			return a.join("&")
		};
		var m = e.Proxy && r && (!a || !s || !i || !l);
		m ? (n = new Proxy(r, {
			construct: function(e, t) {
				return new e(new u(t[0]).toString())
			}
		})).toString = Function.prototype.toString.bind(u) : n = u, Object.defineProperty(e, "URLSearchParams", {
			value: n
		});
		var h = e.URLSearchParams.prototype;
		h.polyfill = !0, !m && e.Symbol && (h[e.Symbol.toStringTag] = "URLSearchParams"), h.forEach = h.forEach || function(e, t) {
			var n = k(this.toString());
			Object.getOwnPropertyNames(n).forEach(function(r) {
				n[r].forEach(function(n) {
					e.call(t, n, r, this)
				}, this)
			}, this)
		}, h.sort = h.sort || function() {
			var e, t, n, r = k(this.toString()),
				i = [];
			for (e in r) i.push(e);
			for (i.sort(), t = 0; t < i.length; t++) this.delete(i[t]);
			for (t = 0; t < i.length; t++) {
				var a = i[t],
					l = r[a];
				for (n = 0; n < l.length; n++) this.append(a, l[n])
			}
		}, h.keys = h.keys || function() {
			var e = [];
			return this.forEach(function(t, n) {
				e.push(n)
			}), d(e)
		}, h.values = h.values || function() {
			var e = [];
			return this.forEach(function(t) {
				e.push(t)
			}), d(e)
		}, h.entries = h.entries || function() {
			var e = [];
			return this.forEach(function(t, n) {
				e.push([n, t])
			}), d(e)
		}, c && (h[e.Symbol.iterator] = h[e.Symbol.iterator] || h.entries), h.size || Object.defineProperty(h, "size", {
			get: function() {
				var e = k(this.toString());
				if (h === this) throw TypeError("Illegal invocation at URLSearchParams.invokeGetter");
				return Object.keys(e).reduce(function(t, n) {
					return t + e[n].length
				}, 0)
			}
		})
	}

	function u(e) {
		((e = e || "") instanceof URLSearchParams || e instanceof u) && (e = e.toString()), this[o] = k(e)
	}

	function g(e) {
		var t = {
			"!": "%21",
			"'": "%27",
			"(": "%28",
			")": "%29",
			"~": "%7E",
			"%20": "+",
			"%00": "\0"
		};
		return encodeURIComponent(e).replace(/[!'\(\)~]|%20|%00/g, function(e) {
			return t[e]
		})
	}

	function f(e) {
		return e.replace(/[ +]/g, "%20").replace(/(%[a-f0-9]{2})+/ig, function(e) {
			return decodeURIComponent(e)
		})
	}

	function d(t) {
		var n = {
			next: function() {
				var e = t.shift();
				return {
					done: void 0 === e,
					value: e
				}
			}
		};
		return c && (n[e.Symbol.iterator] = function() {
			return n
		}), n
	}

	function k(e) {
		var t = {};
		if ("object" == typeof e) {
			if ($(e))
				for (var n = 0; n < e.length; n++) {
					var r = e[n];
					if ($(r) && 2 === r.length) y(t, r[0], r[1]);
					else throw TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements")
				} else
					for (var i in e) e.hasOwnProperty(i) && y(t, i, e[i])
		} else {
			0 === e.indexOf("?") && (e = e.slice(1));
			for (var a = e.split("&"), l = 0; l < a.length; l++) {
				var o = a[l],
					s = o.indexOf("="); - 1 < s ? y(t, f(o.slice(0, s)), f(o.slice(s + 1))) : o && y(t, f(o), "")
			}
		}
		return t
	}

	function y(e, t, n) {
		var r = "string" == typeof n ? n : null != n && "function" == typeof n.toString ? n.toString() : JSON.stringify(n);
		b(e, t) ? e[t].push(r) : e[t] = [r]
	}

	function $(e) {
		return !!e && "[object Array]" === Object.prototype.toString.call(e)
	}

	function b(e, t) {
		return Object.prototype.hasOwnProperty.call(e, t)
	}
}("undefined" != typeof global ? global : "undefined" != typeof window ? window : this);
{
	let e = document.head;
	var t = new URLSearchParams(window.location.search),
		n = t.get("p"),
		r = t.get("id");
	fetch("/site.webmanifest").then(e => e.json()).then(t => {
		if (null !== n) var i = t.filter(e => e.permalink === n)[0];
		else if (null !== r) var i = t.filter(e => e.id === parseInt(r))[0];
		else var i = t.filter(e => 1 === e.id)[0];
		var a = i.title + ": Slot Gacor Link Alternatif Terpercaya - " + i.upper,
			l = i.title + " adalah situs judi slot online gacor terbaik hari ini dan terpercaya terbaru 2023. " + i.title + " menyediakan link alternatif resmi dan Rtp live.",
			o = {
				title: a,
				meta_name: [{
					name: "description",
					content: l
				}, {
					name: "keywords",
					content: i.lower + ", slot online"
				}, {
					name: "author",
					content: i.title
				}, {
					name: "robots",
					content: "all"
				}, {
					name: "rating",
					content: "general"
				}, {
					name: "geo.region",
					content: "id_ID"
				}, {
					name: "googlebot",
					content: "all"
				}, {
					name: "geo.country",
					content: "id"
				}, {
					name: "language",
					content: "Id-ID"
				}, {
					name: "distribution",
					content: "global"
				}, {
					name: "geo.placename",
					content: "Indonesia"
				}, {
					name: "robots",
					content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
				}, {
					name: "apple-mobile-web-app-title",
					content: i.title
				}, {
					name: "application-name",
					content: i.title
				}, {
					name: "msapplication-TileColor",
					content: "#770000"
				}, {
					name: "msapplication-TileImage",
					content: "/images/icons/mstile-144x144.png?v=" + i.id + "&s=" + i.title
				}, {
					name: "msapplication-config",
					content: "/images/icons/browserconfig.xml?v=" + i.id + "&s=" + i.title
				}, {
					name: "theme-color",
					content: "#770000"
				}],
				meta_property: [{
					property: "og:type",
					content: "website"
				}, {
					property: "og:locale",
					content: "id_ID"
				}, {
					property: "og:locale:alternate",
					content: "en_US"
				}, {
					property: "og:title",
					content: a
				}, {
					property: "og:description",
					content: l
				}, {
					property: "og:url",
					content: "?p=" + i.permalink
				}, {
					property: "og:site_name",
					content: i.title
				}, {
					property: "og:image",
					content: "/images/icons/slot-gacor-hari-ini-banner.webp?v=" + i.id + "&s=" + i.title
				}, {
					property: "thumbnail",
					content: "/images/icons/thumbnail.webp?v=" + i.id + "&s=" + i.title
				}],
				link_rel: [{
					rel: "canonical",
					href: "?p=" + i.permalink
				}, {
					rel: "manifest",
					href: "/images/icons/site.webmanifest?v=" + i.id + "&s=" + i.title
				}, {
					rel: "shortcut icon",
					href: "/images/icons/favicon.ico?v=" + i.id + "&s=" + i.title
				}],
				link_rel2: [{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/images/icons/apple-touch-icon.png?v=" + i.id + "&s=" + i.title
				}],
				link_rel3: [{
					rel: "icon",
					type: "image/png",
					sizes: "16x16",
					href: "/images/icons/favicon-16x16.png?v=" + i.id + "&s=" + i.title
				}, {
					rel: "icon",
					type: "image/png",
					sizes: "32x32",
					href: "/images/icons/favicon-32x32.png?v=" + i.id + "&s=" + i.title
				}, {
					rel: "icon",
					type: "image/png",
					sizes: "194x194",
					href: "/images/icons/favicon-194x194.png?v=" + i.id + "&s=" + i.title
				}, {
					rel: "icon",
					type: "image/png",
					sizes: "192x192",
					href: "/images/icons/android-chrome-192x192.png?v=" + i.id + "&s=" + i.title
				}],
				link_rel4: [{
					rel: "mask-icon",
					href: "/images/icons/safari-pinned-tab.svg?v=" + i.id + "&s=" + i.title,
					color: "#990000"
				}]
			};
		document.title = a, o.meta_name.forEach(t => {
			var n = document.querySelector('meta[name="' + t.name + '"]');
			if (n) n.setAttribute("content", o.meta_name.filter(function(e) {
				return RegExp(t.name, "i").test(e.name)
			})[0].content);
			else {
				var r = document.createElement("meta");
				r.setAttribute("name", t.name), r.setAttribute("content", t.content), e.innerHTML += r
			}
		}), o.meta_property.forEach(t => {
			var n = document.querySelector('meta[property="' + t.property + '"]');
			if (n) n.setAttribute("content", o.meta_property.filter(function(e) {
				return RegExp(t.property, "i").test(e.property)
			})[0].content);
			else {
				var r = document.createElement("meta");
				r.setAttribute("property", t.property), r.setAttribute("content", t.content), e.innerHTML += r
			}
		}), o.link_rel.forEach(t => {
			var n = document.querySelector('link[rel="' + t.rel + '"]');
			if (n) n.setAttribute("href", o.link_rel.filter(function(e) {
				return RegExp(t.rel, "i").test(e.rel)
			})[0].href);
			else {
				var r = document.createElement("link");
				r.setAttribute("rel", t.rel), r.setAttribute("href", t.href), e.innerHTML += r
			}
		}), o.link_rel2.forEach(t => {
			var n = document.querySelector('link[rel="' + t.rel + '"][sizes="' + t.sizes + '"]');
			if (n) n.setAttribute("href", o.link_rel2.filter(function(e) {
				return RegExp(t.rel, "i").test(e.rel) && RegExp(t.sizes, "i").test(e.sizes)
			})[0].href);
			else {
				var r = document.createElement("link");
				r.setAttribute("rel", t.rel), r.setAttribute("sizes", t.sizes), r.setAttribute("href", t.href), e.innerHTML += r
			}
		}), o.link_rel3.forEach(t => {
			var n = document.querySelector('link[rel="' + t.rel + '"][type="' + t.type + '"][sizes="' + t.sizes + '"]');
			if (n) n.setAttribute("href", o.link_rel3.filter(function(e) {
				return RegExp(t.rel, "i").test(e.rel) && RegExp(t.type, "i").test(e.type) && RegExp(t.sizes, "i").test(e.sizes)
			})[0].href);
			else {
				var r = document.createElement("link");
				r.setAttribute("rel", t.rel), r.setAttribute("type", t.type), r.setAttribute("sizes", t.sizes), r.setAttribute("href", t.href), e.innerHTML += r
			}
		}), o.link_rel4.forEach(t => {
			var n = document.querySelector('link[rel="' + t.rel + '"]');
			if (n) n.setAttribute("href", o.link_rel4.filter(function(e) {
				return RegExp(t.rel, "i").test(e.rel)
			})[0].href);
			else {
				var r = document.createElement("link");
				r.setAttribute("rel", t.rel), r.setAttribute("href", t.href), r.setAttribute("color", t.color), e.innerHTML += r
			}
		});
		var s = '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","name":"' + i.title + '","alternateName":"' + i.lower + '","url":"https://link88.raganwald.com/?p=' + i.permalink + '","logo":"https://link88.raganwald.com/images/images/thumbnail.webp"},{"@type":"Organization","@id":"https://link88.raganwald.com/?p=' + i.permalink + '#organization","name":"' + i.title + '","alternateName":"' + i.lower + '","url":"https://link88.raganwald.com/?p=' + i.permalink + '"},{"@type":"WebSite","@id":"https://link88.raganwald.com/?p=' + i.permalink + '#website","name":"' + i.title + '","alternateName":"' + i.lower + '","url":"https://link88.raganwald.com/?p=' + i.permalink + '","potentialAction":{"@type":"SearchAction","target":"https://link88.raganwald.com/?p=' + i.permalink + '#s={search_term_string}","query-input":"required name=search_term_string"}},{"@type":"BreadcrumbList","@id":"https://link88.raganwald.com/?p=' + i.permalink + '#breadcrumblist","itemListElement":[{"@type":"ListItem","@id":"https://link88.raganwald.com/?p=' + i.permalink + '#listItem","position":"1","name":"HOME","url":"https://link88.raganwald.com/?p=' + i.permalink + '"},{"@type":"ListItem","@id":"https://link88.raganwald.com/?p=' + i.permalink + '#listItem","position":"2","name":"' + i.upper + '","url":"https://link88.raganwald.com/?p=' + i.permalink + '"},{"@type":"ListItem","@id":"https://link88.raganwald.com/?p=' + i.permalink + '#listItem","position":"3","name":"' + a + '"}]},{"@type":"WebPage","@id":"https://link88.raganwald.com/?p=' + i.permalink + '#webpage","url":"https://link88.raganwald.com/?p=' + i.permalink + '","name":"' + a + '","description":"' + l + '","inLanguage":"id-ID","isPartOf":{"@id":"https://link88.raganwald.com/?p=' + i.permalink + '#website"},"breadcrumb":{"@id":"https://link88.raganwald.com/?p=' + i.permalink + '#breadcrumblist"},"datePublished":"2023-08-22T01:15:20+07:00","dateModified":"2023-08-22T01:15:20+07:00"},{"@type":"Article","mainEntityOfPage":{"@id":"https://link88.raganwald.com/?p=' + i.permalink + '#webpage"},"headline":"' + a + '","description":"' + l + '","image":"https://link88.raganwald.com/images/images/thumbnail.webp","datePublished":"2023-08-22T01:15:20+07:00","dateModified":"2023-08-22T01:15:20+07:00","author":{"@id":"https://link88.raganwald.com/?p=' + i.permalink + '#organization"},"publiser":{"@id":"https://link88.raganwald.com/?p=' + i.permalink + '#organization"}}]}</script>';
		e.innerHTML += s;
		var p = ["SCRIPT", "META", "TITLE", "STYLE"];
		let c = Array.prototype.filter.call(document.querySelectorAll("body *"), function(e) {
				return -1 === p.indexOf(e.nodeName)
			}),
			m = /Hoki88/g,
			h = /slot hoki/g,
			u = /HOKI88/g,
			g = /hoki88/g,
			f = /\.\/\?p=hoki88/g,
			d = /v=999/g;
		c.forEach(e => {
			e.innerHTML = e.innerHTML.replace(m, i.title), e.innerHTML = e.innerHTML.replace(h, i.title2), e.innerHTML = e.innerHTML.replace(u, i.upper), e.innerHTML = e.innerHTML.replace(g, i.lower), e.innerHTML = e.innerHTML.replace(f, "./?p" + i.permalink), e.innerHTML = e.innerHTML.replace(d, "v=" + i.id)
		});
		for (let k = 1; k < 10; k++) {
			let y = t[Math.floor(3900 * Math.random()) + 1],
				$ = y.permalink,
				b = '<a href="/?p=' + $ + '">' + y.title + "</a> | ",
				v = document.getElementById("permalink");
			v && (v.innerHTML += b)
		}
		let w = document.getElementById("permalink");
		w && (w.innerHTML += '<a href="/sitemap.xml">Sitemap</a>')
	}).catch(e => {
		console.error("Error fetching data:", e)
	})
}
