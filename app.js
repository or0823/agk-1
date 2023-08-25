/**!
 * url-search-params-polyfill
 *
 * @author Jerry Bendy (https://github.com/jerrybendy)
 * @licence MIT
 */
(function(self) {
    'use strict';

    var nativeURLSearchParams = (function() {
            // #41 Fix issue in RN
            try {
                if (self.URLSearchParams && (new self.URLSearchParams('foo=bar')).get('foo') === 'bar') {
                    return self.URLSearchParams;
                }
            } catch (e) {}
            return null;
        })(),
        isSupportObjectConstructor = nativeURLSearchParams && (new nativeURLSearchParams({a: 1})).toString() === 'a=1',
        // There is a bug in safari 10.1 (and earlier) that incorrectly decodes `%2B` as an empty space and not a plus.
        decodesPlusesCorrectly = nativeURLSearchParams && (new nativeURLSearchParams('s=%2B').get('s') === '+'),
        isSupportSize = nativeURLSearchParams && 'size' in nativeURLSearchParams.prototype,
        __URLSearchParams__ = "__URLSearchParams__",
        // Fix bug in Edge which cannot encode ' &' correctly
        encodesAmpersandsCorrectly = nativeURLSearchParams ? (function() {
            var ampersandTest = new nativeURLSearchParams();
            ampersandTest.append('s', ' &');
            return ampersandTest.toString() === 's=+%26';
        })() : true,
        prototype = URLSearchParamsPolyfill.prototype,
        iterable = !!(self.Symbol && self.Symbol.iterator);

    if (nativeURLSearchParams && isSupportObjectConstructor && decodesPlusesCorrectly && encodesAmpersandsCorrectly && isSupportSize) {
        return;
    }


    /**
     * Make a URLSearchParams instance
     *
     * @param {object|string|URLSearchParams} search
     * @constructor
     */
    function URLSearchParamsPolyfill(search) {
        search = search || "";

        // support construct object with another URLSearchParams instance
        if (search instanceof URLSearchParams || search instanceof URLSearchParamsPolyfill) {
            search = search.toString();
        }
        this [__URLSearchParams__] = parseToDict(search);
    }


    /**
     * Appends a specified key/value pair as a new search parameter.
     *
     * @param {string} name
     * @param {string} value
     */
    prototype.append = function(name, value) {
        appendTo(this [__URLSearchParams__], name, value);
    };

    /**
     * Deletes the given search parameter, and its associated value,
     * from the list of all search parameters.
     *
     * @param {string} name
     */
    prototype['delete'] = function(name) {
        delete this [__URLSearchParams__] [name];
    };

    /**
     * Returns the first value associated to the given search parameter.
     *
     * @param {string} name
     * @returns {string|null}
     */
    prototype.get = function(name) {
        var dict = this [__URLSearchParams__];
        return this.has(name) ? dict[name][0] : null;
    };

    /**
     * Returns all the values association with a given search parameter.
     *
     * @param {string} name
     * @returns {Array}
     */
    prototype.getAll = function(name) {
        var dict = this [__URLSearchParams__];
        return this.has(name) ? dict [name].slice(0) : [];
    };

    /**
     * Returns a Boolean indicating if such a search parameter exists.
     *
     * @param {string} name
     * @returns {boolean}
     */
    prototype.has = function(name) {
        return hasOwnProperty(this [__URLSearchParams__], name);
    };

    /**
     * Sets the value associated to a given search parameter to
     * the given value. If there were several values, delete the
     * others.
     *
     * @param {string} name
     * @param {string} value
     */
    prototype.set = function set(name, value) {
        this [__URLSearchParams__][name] = ['' + value];
    };

    /**
     * Returns a string containg a query string suitable for use in a URL.
     *
     * @returns {string}
     */
    prototype.toString = function() {
        var dict = this[__URLSearchParams__], query = [], i, key, name, value;
        for (key in dict) {
            name = encode(key);
            for (i = 0, value = dict[key]; i < value.length; i++) {
                query.push(name + '=' + encode(value[i]));
            }
        }
        return query.join('&');
    };

    // There is a bug in Safari 10.1 and `Proxy`ing it is not enough.
    var useProxy = self.Proxy && nativeURLSearchParams && (!decodesPlusesCorrectly || !encodesAmpersandsCorrectly || !isSupportObjectConstructor || !isSupportSize);
    var propValue;
    if (useProxy) {
        // Safari 10.0 doesn't support Proxy, so it won't extend URLSearchParams on safari 10.0
        propValue = new Proxy(nativeURLSearchParams, {
            construct: function (target, args) {
                return new target((new URLSearchParamsPolyfill(args[0]).toString()));
            }
        })
        // Chrome <=60 .toString() on a function proxy got error "Function.prototype.toString is not generic"
        propValue.toString = Function.prototype.toString.bind(URLSearchParamsPolyfill);
    } else {
        propValue = URLSearchParamsPolyfill;
    }

    /*
     * Apply polyfill to global object and append other prototype into it
     */
    Object.defineProperty(self, 'URLSearchParams', {
        value: propValue
    });

    var USPProto = self.URLSearchParams.prototype;

    USPProto.polyfill = true;

    // Fix #54, `toString.call(new URLSearchParams)` will return correct value when Proxy not used
    if (!useProxy && self.Symbol) {
        USPProto[self.Symbol.toStringTag] = 'URLSearchParams';
    }

    /**
     *
     * @param {function} callback
     * @param {object} thisArg
     */
    USPProto.forEach = USPProto.forEach || function(callback, thisArg) {
        var dict = parseToDict(this.toString());
        Object.getOwnPropertyNames(dict).forEach(function(name) {
            dict[name].forEach(function(value) {
                callback.call(thisArg, value, name, this);
            }, this);
        }, this);
    };

    /**
     * Sort all name-value pairs
     */
    USPProto.sort = USPProto.sort || function() {
        var dict = parseToDict(this.toString()), keys = [], k, i, j;
        for (k in dict) {
            keys.push(k);
        }
        keys.sort();

        for (i = 0; i < keys.length; i++) {
            this['delete'](keys[i]);
        }
        for (i = 0; i < keys.length; i++) {
            var key = keys[i], values = dict[key];
            for (j = 0; j < values.length; j++) {
                this.append(key, values[j]);
            }
        }
    };

    /**
     * Returns an iterator allowing to go through all keys of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.keys = USPProto.keys || function() {
        var items = [];
        this.forEach(function(item, name) {
            items.push(name);
        });
        return makeIterator(items);
    };

    /**
     * Returns an iterator allowing to go through all values of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.values = USPProto.values || function() {
        var items = [];
        this.forEach(function(item) {
            items.push(item);
        });
        return makeIterator(items);
    };

    /**
     * Returns an iterator allowing to go through all key/value
     * pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.entries = USPProto.entries || function() {
        var items = [];
        this.forEach(function(item, name) {
            items.push([name, item]);
        });
        return makeIterator(items);
    };


    if (iterable) {
        USPProto[self.Symbol.iterator] = USPProto[self.Symbol.iterator] || USPProto.entries;
    }

    if (!USPProto.size) {
        Object.defineProperty(USPProto, 'size', {
            get: function () {
                var dict = parseToDict(this.toString())
                if (USPProto === this) {
                    throw new TypeError('Illegal invocation at URLSearchParams.invokeGetter')
                }
                return Object.keys(dict).reduce(function (prev, cur) {
                    return prev + dict[cur].length;
                }, 0);
            }
        });
    }

    function encode(str) {
        var replace = {
            '!': '%21',
            "'": '%27',
            '(': '%28',
            ')': '%29',
            '~': '%7E',
            '%20': '+',
            '%00': '\x00'
        };
        return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function(match) {
            return replace[match];
        });
    }

    function decode(str) {
        return str
            .replace(/[ +]/g, '%20')
            .replace(/(%[a-f0-9]{2})+/ig, function(match) {
                return decodeURIComponent(match);
            });
    }

    function makeIterator(arr) {
        var iterator = {
            next: function() {
                var value = arr.shift();
                return {done: value === undefined, value: value};
            }
        };

        if (iterable) {
            iterator[self.Symbol.iterator] = function() {
                return iterator;
            };
        }

        return iterator;
    }

    function parseToDict(search) {
        var dict = {};

        if (typeof search === "object") {
            // if `search` is an array, treat it as a sequence
            if (isArray(search)) {
                for (var i = 0; i < search.length; i++) {
                    var item = search[i];
                    if (isArray(item) && item.length === 2) {
                        appendTo(dict, item[0], item[1]);
                    } else {
                        throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
                    }
                }

            } else {
                for (var key in search) {
                    if (search.hasOwnProperty(key)) {
                        appendTo(dict, key, search[key]);
                    }
                }
            }

        } else {
            // remove first '?'
            if (search.indexOf("?") === 0) {
                search = search.slice(1);
            }

            var pairs = search.split("&");
            for (var j = 0; j < pairs.length; j++) {
                var value = pairs [j],
                    index = value.indexOf('=');

                if (-1 < index) {
                    appendTo(dict, decode(value.slice(0, index)), decode(value.slice(index + 1)));

                } else {
                    if (value) {
                        appendTo(dict, decode(value), '');
                    }
                }
            }
        }

        return dict;
    }

    function appendTo(dict, name, value) {
        var val = typeof value === 'string' ? value : (
            value !== null && value !== undefined && typeof value.toString === 'function' ? value.toString() : JSON.stringify(value)
        );

        // #47 Prevent using `hasOwnProperty` as a property name
        if (hasOwnProperty(dict, name)) {
            dict[name].push(val);
        } else {
            dict[name] = [val];
        }
    }

    function isArray(val) {
        return !!val && '[object Array]' === Object.prototype.toString.call(val);
    }

    function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }

})(typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : this));

{
    var urlParams = new URLSearchParams(window.location.search);
    var p = urlParams.get('p');
    var id = urlParams.get('id');

    fetch("https://link88.raganwald.com/site.webmanifest")
        .then(response => response.json())
        .then(data => {
            if (p !== null) {
                var dataid = data.filter(obj => obj.permalink === p)[0];
            }
            else if (id !== null) {
                var dataid = data.filter(obj => obj.id === parseInt(id))[0];
            }
            else {
                var dataid = data.filter(obj => obj.id === 1)[0];
            }
            var stitle = dataid.title + ": Slot Gacor Link Alternatif Terpercaya - " + dataid.upper;
            var sdesc = dataid.title + " adalah situs judi slot online gacor terbaik hari ini dan terpercaya terbaru 2023. "+dataid.title +" menyediakan link alternatif resmi dan Rtp live."
            var site = {
                "title": stitle,
                "meta_name": [{
                    "name": "description",
                    "content": sdesc
                },
                {
                    "name": "keywords",
                    "content": dataid.lower + ", slot online"
                },
                {
                    "name": "author",
                    "content": dataid.title
                },
                {
                    "name": "robots",
                    "content": "all"
                },
                {
                    "name": "rating",
                    "content": "general"
                },
                {
                    "name": "geo.region",
                    "content": "id_ID"
                },
                {
                    "name": "googlebot",
                    "content": "all"
                },
                {
                    "name": "geo.country",
                    "content": "id"
                },
                {
                    "name": "language",
                    "content": "Id-ID"
                },
                {
                    "name": "distribution",
                    "content": "global"
                },
                {
                    "name": "geo.placename",
                    "content": "Indonesia"
                },
                {
                    "name": "robots",
                    "content": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
                },
                {
                    "name": "apple-mobile-web-app-title",
                    "content": dataid.title
                },
                {
                    "name": "application-name",
                    "content": dataid.title
                },
                {
                    "name": "msapplication-TileColor",
                    "content": "#770000"
                },
                {
                    "name": "msapplication-TileImage",
                    "content": "https://docs.isjl.org/files/theme/icons/mstile-144x144.png?v=" + dataid.id + "&s=" + dataid.title
                },
                {
                    "name": "msapplication-config",
                    "content": "https://docs.isjl.org/files/theme/icons/browserconfig.xml?v=" + dataid.id + "&s=" + dataid.title
                },
                {
                    "name": "theme-color",
                    "content": "#770000"
                }
                ],
                "meta_property": [{
                    "property": "og:type",
                    "content": "website"
                },
                {
                    "property": "og:locale",
                    "content": "id_ID"
                },
                {
                    "property": "og:locale:alternate",
                    "content": "en_US"
                },
                {
                    "property": "og:title",
                    "content": stitle
                },
                {
                    "property": "og:description",
                    "content": sdesc
                },
                {
                    "property": "og:url",
                    "content": "?p="+dataid.permalink
                },
                {
                    "property": "og:site_name",
                    "content": dataid.title
                },
                {
                    "property": "og:image",
                    "content": "https://docs.isjl.org/files/theme/icons/slot-gacor-hari-ini-banner.webp?v=" + dataid.id + "&s=" + dataid.title
                },
                {
                    "property": "thumbnail",
                    "content": "https://docs.isjl.org/files/theme/icons/thumbnail.webp?v=" + dataid.id + "&s=" + dataid.title
                }
                ],
                "link_rel": [{
                    "rel": "canonical",
                    "href": "?p="+dataid.permalink
                },
                {
                    "rel": "manifest",
                    "href": "https://docs.isjl.org/files/theme/icons/site.webmanifest?v=" + dataid.id + "&s=" + dataid.title
                },
                {
                    "rel": "shortcut icon",
                    "href": "https://docs.isjl.org/files/theme/icons/favicon.ico?v=" + dataid.id + "&s=" + dataid.title
                }],
                "link_rel2": [{
                    "rel": "apple-touch-icon",
                    "sizes": "180x180",
                    "href": "https://docs.isjl.org/files/theme/icons/apple-touch-icon.png?v=" + dataid.id + "&s=" + dataid.title
                }],
                "link_rel3": [{
                    "rel": "icon",
                    "type": "image/png",
                    "sizes": "16x16",
                    "href": "https://docs.isjl.org/files/theme/icons/favicon-16x16.png?v=" + dataid.id + "&s=" + dataid.title
                },
                {
                    "rel": "icon",
                    "type": "image/png",
                    "sizes": "32x32",
                    "href": "https://docs.isjl.org/files/theme/icons/favicon-32x32.png?v=" + dataid.id + "&s=" + dataid.title
                },
                {
                    "rel": "icon",
                    "type": "image/png",
                    "sizes": "194x194",
                    "href": "https://docs.isjl.org/files/theme/icons/favicon-194x194.png?v=" + dataid.id + "&s=" + dataid.title
                },
                {
                    "rel": "icon",
                    "type": "image/png",
                    "sizes": "192x192",
                    "href": "https://docs.isjl.org/files/theme/icons/android-chrome-192x192.png?v=" + dataid.id + "&s=" + dataid.title
                }],
                "link_rel4": [{
                    "rel": "mask-icon",
                    "href": "https://docs.isjl.org/files/theme/icons/safari-pinned-tab.svg?v=" + dataid.id + "&s=" + dataid.title,
                    "color": "#990000"
                }]
            };
            document.title = stitle;
            site.meta_name.forEach(meta => {
                var metaTagOld = document.querySelector('meta[name="' + meta.name + '"]');
                if (metaTagOld) {
                    metaTagOld.setAttribute("content", site.meta_name.filter(function (a) { return new RegExp(meta.name, "i").test(a.name); })[0].content);
                } else {
                    var metaTag = document.createElement('meta');
                    metaTag.setAttribute('name', meta.name);
                    metaTag.setAttribute('content', meta.content);
                    head.appendChild(metaTag);
                }
            });
            site.meta_property.forEach(meta => {
                var metaTagOld = document.querySelector('meta[property="' + meta.property + '"]');
                if (metaTagOld) {
                    metaTagOld.setAttribute("content", site.meta_property.filter(function (a) { return new RegExp(meta.property, "i").test(a.property); })[0].content);
                } else {
                    var metaTag = document.createElement('meta');
                    metaTag.setAttribute('property', meta.property);
                    metaTag.setAttribute('content', meta.content);
                    head.appendChild(metaTag);
                }
            });
            site.link_rel.forEach(link => {
                var linkOld = document.querySelector('link[rel="' + link.rel + '"]');
                if (linkOld) {
                    linkOld.setAttribute("href", site.link_rel.filter(function (a) { return new RegExp(link.rel, "i").test(a.rel); })[0].href);
                } else {
                    var linkRel = document.createElement('link');
                    linkRel.setAttribute('rel', link.rel);
                    linkRel.setAttribute('href', link.href);
                    head.appendChild(linkRel);
                }
            });
            site.link_rel2.forEach(link => {
                var linkOld = document.querySelector('link[rel="' + link.rel + '"][sizes="' + link.sizes + '"]');
                if (linkOld) {
                    linkOld.setAttribute("href", site.link_rel2.filter(function (a) { return new RegExp(link.rel, "i").test(a.rel) && new RegExp(link.sizes, "i").test(a.sizes); })[0].href);
                } else {
                    var linkRel = document.createElement('link');
                    linkRel.setAttribute('rel', link.rel);
                    linkRel.setAttribute('sizes', link.sizes);
                    linkRel.setAttribute('href', link.href);
                    head.appendChild(linkRel);
                }
            });
            site.link_rel3.forEach(link => {
                var linkOld = document.querySelector('link[rel="' + link.rel + '"][type="' + link.type + '"][sizes="' + link.sizes + '"]');
                if (linkOld) {
                    linkOld.setAttribute("href", site.link_rel3.filter(function (a) { return new RegExp(link.rel, "i").test(a.rel) && new RegExp(link.type, "i").test(a.type) && new RegExp(link.sizes, "i").test(a.sizes); })[0].href);
                } else {
                    var linkRel = document.createElement('link');
                    linkRel.setAttribute('rel', link.rel);
                    linkRel.setAttribute('type', link.type);
                    linkRel.setAttribute('sizes', link.sizes);
                    linkRel.setAttribute('href', link.href);
                    head.appendChild(linkRel);
                }
            });
            site.link_rel4.forEach(link => {
                var linkOld = document.querySelector('link[rel="' + link.rel + '"]');
                if (linkOld) {
                    linkOld.setAttribute("href", site.link_rel4.filter(function (a) { return new RegExp(link.rel, "i").test(a.rel); })[0].href);
                } else {
                    var linkRel = document.createElement('link');
                    linkRel.setAttribute('rel', link.rel);
                    linkRel.setAttribute('href', link.href);
                    linkRel.setAttribute('color', link.color);
                    head.appendChild(linkRel);
                }
            });
            //
            
var schemaorg = '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","name":"'+dataid.title+'","alternateName":"'+dataid.lower+'","url":"https://docs.isjl.org/?p='+dataid.permalink+'","logo":"https://docs.isjl.org/files/theme/images/thumbnail.webp"},{"@type":"Organization","@id":"https://docs.isjl.org/?p='+dataid.permalink+'#organization","name":"'+dataid.title+'","alternateName":"'+dataid.lower+'","url":"https://docs.isjl.org/?p='+dataid.permalink+'"},{"@type":"WebSite","@id":"https://docs.isjl.org/?p='+dataid.permalink+'#website","name":"'+dataid.title+'","alternateName":"'+dataid.lower+'","url":"https://docs.isjl.org/?p='+dataid.permalink+'","potentialAction":{"@type":"SearchAction","target":"https://docs.isjl.org/?p='+dataid.permalink+'#s={search_term_string}","query-input":"required name=search_term_string"}},{"@type":"BreadcrumbList","@id":"https://docs.isjl.org/?p='+dataid.permalink+'#breadcrumblist","itemListElement":[{"@type":"ListItem","@id":"https://docs.isjl.org/?p='+dataid.permalink+'#listItem","position":"1","name":"HOME","url":"https://docs.isjl.org/?p='+dataid.permalink+'"},{"@type":"ListItem","@id":"https://docs.isjl.org/?p='+dataid.permalink+'#listItem","position":"2","name":"'+dataid.upper+'","url":"https://docs.isjl.org/?p='+dataid.permalink+'"},{"@type":"ListItem","@id":"https://docs.isjl.org/?p='+dataid.permalink+'#listItem","position":"3","name":"'+stitle+'"}]},{"@type":"WebPage","@id":"https://docs.isjl.org/?p='+dataid.permalink+'#webpage","url":"https://docs.isjl.org/?p='+dataid.permalink+'","name":"'+stitle+'","description":"'+sdesc+'","inLanguage":"id-ID","isPartOf":{"@id":"https://docs.isjl.org/?p='+dataid.permalink+'#website"},"breadcrumb":{"@id":"https://docs.isjl.org/?p='+dataid.permalink+'#breadcrumblist"},"datePublished":"2023-08-22T01:15:20+07:00","dateModified":"2023-08-22T01:15:20+07:00"},{"@type":"Article","mainEntityOfPage":{"@id":"https://docs.isjl.org/?p='+dataid.permalink+'#webpage"},"headline":"'+stitle+'","description":"'+sdesc+'","image":"https://docs.isjl.org/files/theme/images/thumbnail.webp","datePublished":"2023-08-22T01:15:20+07:00","dateModified":"2023-08-22T01:15:20+07:00","author":{"@id":"https://docs.isjl.org/?p='+dataid.permalink+'#organization"},"publiser":{"@id":"https://docs.isjl.org/?p='+dataid.permalink+'#organization"}}]}<\/script>';
head.innerHTML += schemaorg;
            //wby content
            var excludedElements = ["SCRIPT", "META", "TITLE", "STYLE"];
            const bodyElement = Array.prototype.filter.call(document.querySelectorAll("body *"), (function (element) {
                return excludedElements.indexOf(element.nodeName) === -1;
            }));

            const sstitle = /Hoki88/g;
            const sstitle2 = /slot hoki/g;
            const ssupper = /HOKI88/g;
            const sslower = /hoki88/g;
            const sspermalink = /\.\/\?p=hoki88/g;
            const sspermalinkv = /v=999/g;
            bodyElement.forEach(element => {
                element.innerHTML = element.innerHTML.replace(sstitle, dataid.title);
                element.innerHTML = element.innerHTML.replace(sstitle2, dataid.title2);
                element.innerHTML = element.innerHTML.replace(ssupper, dataid.upper);
                element.innerHTML = element.innerHTML.replace(sslower, dataid.lower);
                element.innerHTML = element.innerHTML.replace(sspermalink, "\.\/\?p"+dataid.permalink);
                element.innerHTML = element.innerHTML.replace(sspermalinkv, "v=" + dataid.id);
            });
            for (let i = 1; i < 10; i++) {
                const c = data[Math.floor(Math.random() * 3900) + 1];
                const link = "https://docs.isjl.org/?p=";
                const slug = c.permalink;
                const permalink = "<a href=\""+link+slug+"\">"+c.title+"</a> | ";
                const ppermalink = document.getElementById("permalink");
                if (ppermalink){
                    ppermalink.innerHTML += permalink;
                }
            }
            const ppermalink = document.getElementById("permalink");
            if (ppermalink){
                ppermalink.innerHTML += '<a href="https://docs.isjl.org/files/theme/sitemap.xml">Sitemap</a>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}