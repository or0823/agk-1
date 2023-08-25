
{
    const head = document.head;
    var urlParams = new URLSearchParams(window.location.search);
    var p = urlParams.get('p');
    var id = urlParams.get('id');

    fetch(`./site.webmanifest`)
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
            
var schemaorg = '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","name":"'+dataid.title+'","alternateName":"'+dataid.lower+'","url":"https://docs.isjl.org/?p='+dataid.permalink+'","logo":"https://docs.isjl.org/files/theme/images/thumbnail.webp"},{"@type":"Organization","@id":"https://docs.isjl.org/?p='+dataid.permalink+'#organization","name":"'+dataid.title+'","alternateName":"'+dataid.lower+'","url":"https://docs.isjl.org/?p='+dataid.permalink+'"},{"@type":"WebSite","@id":"https://docs.isjl.org/?p='+dataid.permalink+'#website","name":"'+dataid.title+'","alternateName":"'+dataid.lower+'","url":"https://docs.isjl.org/?p='+dataid.permalink+'","potentialAction":{"@type":"SearchAction","target":"https://docs.isjl.org/?p='+dataid.permalink+'#s={search_term_string}","query-input":"required name=search_term_string"}},{"@type":"BreadcrumbList","@id":"https://docs.isjl.org/?p='+dataid.permalink+'#breadcrumblist","itemListElement":[{"@type":"ListItem","@id":"https://docs.isjl.org/?p='+dataid.permalink+'#listItem","position":"1","item":{"@type":"WebPage","@id":"https://docs.isjl.org/?p='+dataid.permalink+'","name":"'+dataid.title+'","description":"'+sdesc+'","url":"https://docs.isjl.org/?p='+dataid.permalink+'"}}]},{"@type":"WebPage","@id":"https://docs.isjl.org/?p='+dataid.permalink+'#webpage","url":"https://docs.isjl.org/?p='+dataid.permalink+'","name":"'+stitle+'","description":"'+sdesc+'","inLanguage":"id-ID","isPartOf":{"@id":"https://docs.isjl.org/?p='+dataid.permalink+'#website"},"breadcrumb":{"@id":"https://docs.isjl.org/?p='+dataid.permalink+'#breadcrumblist"},"datePublished":"2023-08-22T01:15:20+07:00","dateModified":"2023-08-22T01:15:20+07:00"},{"@type":"Article","mainEntityOfPage":{"@id":"https://docs.isjl.org/?p='+dataid.permalink+'#webpage"},"headline":"'+stitle+'","description":"'+sdesc+'","image":"https://docs.isjl.org/files/theme/images/thumbnail.webp","datePublished":"2023-08-22T01:15:20+07:00","dateModified":"2023-08-22T01:15:20+07:00","author":{"@id":"https://docs.isjl.org/?p='+dataid.permalink+'#organization"},"publiser":{"@id":"https://docs.isjl.org/?p='+dataid.permalink+'#organization"}}]}<\/script>';
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
                document.getElementById("pemalink").innerHTML += permalink;
            }
                document.getElementById("pemalink").innerHTML += '<a href="https://docs.isjl.org/files/theme/sitemap.xml">Sitemap</a>';
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}