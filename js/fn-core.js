(function (l) {
    var c = l.__ = l.__ || {}, p = /^[a-z0-9\-\.:_]+$/, q = /^http(s)?:\/\/|^\.|^\//, o = Array.prototype.slice;
    c.global = l;
    c.doc = l.document;
    c.topLayer = 1;
    (function () {
        var a = c.global.navigator && navigator.userAgent;
        c.ua = {};
        if (a) {
            c.ua.browser = true;
            if (/MSIE \d+/.test(a))c.ua.ie = a.match(/MSIE (\d)/)[1]; else if (/KHTML/.test(a))c.ua.webkit = true; else if (/Gecko/.test(a))c.ua.gecko = true; else if (/Opera/.test(a))c.ua.opera = a.match(/Opera\/([0-9.]+)/)[1]
        }
    })();
    c._isDebug = false;
    c.debug = function (a) {
        this._isDebug = a === false ?
            false : true
    };
    c.isDebug = function () {
        return this._isDebug
    };
    c.each = function (a, b, d) {
        var e;
        if (a)if (d)for (e in a)a.hasOwnProperty(e) && b(a[e], e); else {
            if (typeof a === "string" || typeof a.length !== "number" || a.tagName || a === this.global)a = [a];
            e = 0;
            for (d = a.length; e < d; ++e)b(a[e], e)
        }
    };
    c.extend = function (a, b, d) {
        var e;
        d = d === false ? false : true;
        for (e in b)if (b.hasOwnProperty(e) && (d || a[e] === void 0))a[e] = b[e]
    };
    c._uIdx = 0;
    c.getUid = function (a) {
        var b;
        if (!a)return a;
        b = a.uniqueID && a.nodeType && a.nodeType !== 9 ? a.uniqueID : typeof a === "string" ?
            a : a._duid;
        if (!b) {
            b = "_duid_" + ++c._uIdx;
            try {
                a._duid = b
            } catch (d) {
                b = null
            }
        }
        return b
    };
    c.set = function (a, b, d) {
        var e, f;
        a = a.split(".");
        d = d || c.global;
        e = 0;
        for (f = a.length - 1; e < f; ++e) {
            d[a[e]] = d[a[e]] || {};
            d = d[a[e]]
        }
        a = a[a.length - 1];
        d[a] = b === void 0 ? d[a] === void 0 ? {} : d[a] : b;
        return d[a]
    };
    c.get = function (a, b) {
        var d, e, f = a.split("."), g = b || c.global;
        d = 0;
        for (e = f.length; d < e; ++d) {
            if (!g)return;
            g = g[f[d]]
        }
        return g
    };
    c.exportPath = function (a, b, d) {
        c.set(a, b, d)
    };
    c.inherits = function (a, b) {
        function d() {
        }

        d.prototype = b.prototype;
        a._super =
            b.prototype;
        a.prototype = new d;
        a.prototype.constructor = a
    };
    c.preLoadJs = function (a) {
        c.ua.ie || c.ua.opera ? c.downloadScriptImage(a) : c.downloadScriptObject(a)
    };
    c.downloadScriptImage = function (a) {
        (new Image).src = a
    };
    c.downloadScriptObject = function (a) {
        var b;
        if (c.doc.body) {
            b = c.doc.createElement("object");
            b.data = a;
            b.width = 0;
            b.height = 0;
            c.doc.body.appendChild(b)
        } else setTimeout(function () {
            c.downloadScriptObject(a)
        }, 50)
    };
    c.loadJs = function (a, b) {
        var d = c.doc, e = d.getElementsByTagName("head")[0] || d.documentElement, f,
            g, h = false;
        g = b.onSuccess;
        if (b.cache === false || c.isDebug() && b.cache !== true)a += (a.indexOf("?") > 0 ? "&" : "?") + "_du_r_t=" + Math.random();
        f = d.createElement("script");
        f.type = "text/javascript";
        f.src = a;
        if (b.charset)f.charset = b.charset;
        f.onload = f.onreadystatechange = function () {
            if (!h && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                h = true;
                g && g();
                g = f.onload = f.onreadystatechange = null;
                e && f.parentNode && e.removeChild(f)
            }
        };
        e.appendChild(f)
    };
    c.BasicModule = function (a, b) {
        b = b || {};
        this.mname = a;
        this.detailObj = b
    };
    c.BasicModule.modules = {};
    c.BasicModule.waitingReg = [];
    c.BasicModule.loadingMods = {};
    c.BasicModule.loadedMods = {};
    c.BasicModule.add = function (a, b) {
        var d = new c.BasicModule(a, b);
        return this.modules[":" + a] = d
    };
    c.BasicModule.load = function (a, b) {
        var d, e, f, g, h;
        (d = this.modules[":" + a]) || (d = this.add(a));
        d = d.getURI(b);
        if (b.preload)c.preLoadJs(d, b); else {
            h = b.onSuccess;
            g = this.loadingMods;
            e = this.waitingReg;
            f = this.loadedMods;
            h && e.push(["_", false, b.dependency, h]);
            if (!g[a])if (f[a] !== void 0)c.BasicModule.register("_",
                false); else {
                g[a] = b;
                c.loadJs(d, {cache: b.cache})
            }
        }
    };
    c.BasicModule.register = function (a, b, d, e) {
        var f, g, h, i, k, m, n = false;
        h = this.loadedMods;
        if (h[a] === void 0) {
            d = d || [];
            g = this.waitingReg;
            i = this.loadingMods;
            f = this.getMissingMods(a, d);
            if (i[a] !== void 0)k = i[a];
            if (f.length) {
                m = o.call(arguments);
                n = true;
                c.each(f, function (j) {
                    if (h[j] === void 0) {
                        n = false;
                        i[j] === void 0 && c.BasicModule.load(j, {version: k && k.version})
                    }
                });
                n || g.push(m)
            } else {
                delete i[a];
                e && e();
                if (a !== "_")h[a] = b;
                c.each(g, function (j, r) {
                    if (j && j != m) {
                        g[r] = false;
                        c.BasicModule.register.apply(c.BasicModule,
                            j)
                    }
                })
            }
        }
    };
    c.BasicModule.getMissingMods = function (a, b) {
        var d, e = [];
        b = b || [];
        d = this.loadedMods;
        c.each(b, function (f, g) {
            if (f === a) {
                f = "_";
                b[g] = f
            }
            f !== "_" && d[f] === void 0 && e.push(f)
        });
        return e
    };
    (function () {
        var a = c.doc.getElementsByTagName("script");
        a = a[a.length - 1].src;
        c.BasicModule.prototype.baseURI = a.substr(0, a.lastIndexOf("/"))
    })();
    c.BasicModule.prototype.getURI = function (a) {
        var b, d, e = this.detailObj, f, g;
        a = a || {};
        b = e.base || this.baseURI;
        if (e.fullPath)b = e.fullPath; else if (e.afterBasePath)b = [b, e.afterBasePath].join("/");
        else {
            f = this.mname.split(":");
            g = f[1];
            f = f[0].split(".");
            d = e.dirName == void 0 ? f.join("/") : e.dirName;
            if (e.dynamic) {
                a = a.version ? a.version : e.dynamic;
                b = [b, d, this.mname].join("/");
                b += "_" + a + ".js"
            } else {
                a = c.isDebug() ? "0" : a.version ? a.version : "0";
                if (a !== "0")b += "/" + a;
                b = [b, d, (g || f[f.length - 1]) + ".js"].join("/")
            }
        }
        return b
    };
    c._loadOne = function (a, b) {
        if (b._isMod)c.BasicModule.load(a, b); else {
            a.match(q) || (a = "http://" + a);
            b.preload ? c.preLoadJs(a, b) : c.loadJs(a, b)
        }
    };
    c.load = function (a, b, d) {
        var e, f, g, h = false;
        b = b || {};
        if (typeof b ===
            "function") {
            e = d || {};
            e.onSuccess = b;
            b = e
        }
        b.onSuccess = b.onSuccess || function () {
        };
        g = typeof a === "string" ? a.split(" ") : o.call(a);
        if (a = b._isMod === void 0)b._isMod = p.test(g[0]);
        if (b._isMod) {
            b._isMod = true;
            if (b.onSuccess) {
                e = b.onSuccess;
                f = false;
                b.onSuccess = function () {
                    if (!f) {
                        f = true;
                        e()
                    }
                }
            }
        } else if (b.onSuccess) {
            if (a) {
                b.onAllLoad = b.onSuccess;
                h = b.preload === true ? true : false
            }
            b.onSuccess = function () {
                g.shift();
                if (g.length === 0)b.onAllLoad(); else c.load(g, b)
            }
        }
        b.dependency = b.dependency || g;
        c.each(g, function (i, k) {
            if (k > 0)h && c._loadOne(i,
                {preload: true, version: b.version}); else setTimeout(function () {
                c._loadOne(i, b)
            }, 0)
        })
    };
    c.each("load widget app jslog".split(" "), function (a) {
        c.exportPath("__." + a)
    });
    c.jslog.error = c.jslog.iferror = function () {
    }
})(this);
__.BasicModule.register("lang", "0.4.0", [], function () {
    __.exportPath("__.lang");
    __.lang.OPER = {"+": function (a, b) {
        return a + b
    }, "-": function (a, b) {
        return a - b
    }, "*": function (a, b) {
        return a * b
    }, "/": function (a, b) {
        return a / b
    }, "%": function (a, b) {
        return a % b
    }, "-2": function (a, b) {
        return b - a
    }, "/2": function (a, b) {
        return b / a
    }, "%2": function (a, b) {
        return b % a
    }, ">": function (a, b) {
        return a > b
    }, "<": function (a, b) {
        return a < b
    }, ">=": function (a, b) {
        return a >= b
    }, "<=": function (a, b) {
        return a <= b
    }, "==": function (a, b) {
        return a == b
    }, "===": function (a, b) {
        return a === b
    }, "&&": function (a, b) {
        return a && b
    }, "||": function (a, b) {
        return a || b
    }, "&": function (a, b) {
        return a & b
    }, "|": function (a, b) {
        return a | b
    }, "^": function (a, b) {
        return a ^ b
    }, "++": function (a) {
        return a + 1
    }, "--": function (a) {
        return a - 1
    }, "!": function (a) {
        return!a
    }};
    __.lang.NODE_TYPE = {ELEMENT_NODE: 1, ATTRIBUTE_NODE: 2, TEXT_NODE: 3, CDATA_SECTION_NODE: 4, ENTITY_REFERENCE_NODE: 5, ENTITY_NODE: 6, PROCESSING_INSTRUCTION_NODE: 7, COMMENT_NODE: 8, DOCUMENT_NODE: 9, DOCUMENT_TYPE_NODE: 10, DOCUMENT_FRAGMENT_NODE: 11, NOTATION_NODE: 12};
    __.lang.EF = function () {
    };
    __.lang.K = function (a) {
        return a
    };
    __.lang.isArray = function (a) {
        return Object.prototype.toString.apply(a) === "[object Array]"
    };
    __.lang.isUndefined = function (a) {
        return a === void 0
    };
    __.lang.isNull = function (a) {
        return a === null
    };
    __.lang.isBoolean = function (a) {
        return typeof a === "boolean"
    };
    __.lang.isFunction = function (a) {
        return typeof a === "function"
    };
    __.lang.isNumber = function (a) {
        return typeof a === "number" && isFinite(a)
    };
    __.lang.isInt = function (a) {
        var b = parseInt(a, 10);
        if (isNaN(b))return false;
        return a === b
    };
    __.lang.isFloat = function (a) {
        var b = parseFloat(a);
        if (isNaN(b))return false;
        return a === b
    };
    __.lang.isObject = function (a) {
        return a && (typeof a === "object" || __.lang.isFunction(a)) || false
    };
    __.lang.isString = function (a) {
        return typeof a === "string"
    };
    __.lang.isEmpty = function (a) {
        return a === null || typeof a === "undefined" || a === 0 || a === false || a === "" || typeof a.length === "number" && a.length === 0
    };
    __.lang.isNode = function (a, b) {
        return __.lang.isObject(a) && (!b && (a === __.global || a === __.doc) || a.nodeType === __.lang.NODE_TYPE.ELEMENT_NODE)
    };
    __.lang.range = function (a, b, c) {
        var d = [];
        c = c || 1;
        if (b === void 0) {
            b = a;
            a = 0
        }
        for (; b > a;) {
            d[d.length] = a;
            a += c
        }
        return d
    };
    __.lang.each = __.each;
    __.lang.all = function (a, b, c) {
        var d;
        if (!a)return true;
        if (c)for (d in a) {
            if (a.hasOwnProperty(d) && !b(a[d], d))return false
        } else {
            if (typeof a === "string" || typeof a.length !== "number" || a.tagName || a === __.global)a = [a];
            d = 0;
            for (c = a.length; d < c; ++d)if (!b(a[d], d))return false
        }
        return true
    };
    __.lang.find = function (a, b, c) {
        var d;
        if (!a)return-1;
        if (c)for (d in a) {
            if (a.hasOwnProperty(d) && b(a[d], d))return d
        } else {
            if (typeof a ===
                "string" || typeof a.length !== "number" || a.tagName || a === __.global)a = [a];
            d = 0;
            for (c = a.length; d < c; ++d)if (b(a[d], d))return d
        }
        return-1
    };
    __.lang.findByAttr = function (a, b, c, d) {
        return __.lang.find(a, function (e) {
            return e && e[b] === c
        }, d)
    };
    __.lang.any = function (a, b, c) {
        var d;
        if (!a)return false;
        if (c)for (d in a) {
            if (a.hasOwnProperty(d) && b(a[d], d))return true
        } else {
            if (typeof a === "string" || typeof a.length !== "number" || a.tagName || a === __.global)a = [a];
            d = 0;
            for (c = a.length; d < c; ++d)if (b(a[d], d))return true
        }
        return false
    };
    __.lang.reduce =
        function (a, b, c, d) {
            __.each(a, function (e, f) {
                c = b(c, e, f)
            }, d);
            return c
        };
    __.lang.map = function (a, b, c) {
        var d = [];
        __.each(a, function (e, f) {
            d[f] = b(e)
        }, c);
        return d
    };
    __.lang.a = function (a) {
        var b, c;
        if (!a)return[];
        b = a.length || 0;
        for (c = Array(b); b--;)c[b] = a[b];
        return c
    };
    __.lang.w = function (a) {
        if (!__.lang.isString(a))return[];
        return(a = __.lang.trim(a)) ? a.split(__.lang.getReg("\\s+")) : []
    };
    __.lang.unique = function (a, b) {
        return __.lang.reduce(a, function (c, d, e) {
            if (0 === e || (b ? c[c.length - 1] !== d : !__.lang.inArray(d, c, true)))c.push(d);
            return c
        }, [])
    };
    __.lang.inArray = function (a, b) {
        var c = false;
        __.each(b, function (d, e) {
            if (d === a) {
                c = c === false ? [] : c;
                c.push(e)
            }
        });
        return c
    };
    __.lang.arrayRemove = function (a, b, c) {
        var d = a.length;
        b = a < 0 ? parseInt(b, 10) + d : b;
        c = c < 0 ? parseInt(c, 10) + d : c;
        if (c < b || b >= d || c >= d)return false;
        c = a.slice((c || b) + 1 || a.length);
        a.length = b < 0 ? a.length + b : b;
        return a.push.apply(a, c)
    };
    __.lang.absorb = function (a, b) {
        var c = [];
        __.each(a, function (d) {
            c.push(d[b])
        });
        return c
    };
    __.lang.curry = function (a) {
        var b;
        a = typeof a === "string" && __.lang.OPER[a] ?
            __.lang.OPER[a] : a;
        b = __.lang.a(arguments);
        b.shift();
        return function () {
            return a.apply(null, b.concat(__.lang.a(arguments)))
        }
    };
    __.lang.compose = function (a, b) {
        return function () {
            return a(b.apply(null, arguments))
        }
    };
    __.lang.negate = function (a) {
        return function () {
            return!a.apply(null, arguments)
        }
    };
    __.lang.keys = function (a) {
        var b = [];
        __.each(a, function (c, d) {
            b.push(d)
        }, true);
        return b
    };
    __.lang.values = function (a) {
        var b = [];
        __.each(a, function (c) {
            b.push(c)
        }, true);
        return b
    };
    __.lang.clone = function (a) {
        var b, c;
        if (a === null ||
            typeof a !== "object")return a;
        b = new a.constructor;
        for (c in a)if (a.hasOwnProperty(c))b[c] = __.lang.clone(a[c]);
        return b
    };
    __.lang.mergeObj = function () {
        var a, b, c, d = {};
        for (c = __.lang.a(arguments); (b = c.shift()) !== void 0;)for (a in b)if (b.hasOwnProperty(a))d[a] = b[a];
        return d
    };
    __.lang.trim = function (a) {
        var b, c;
        a = a.replace(__.lang.getReg("^\\s\\s*"), "");
        b = __.lang.getReg("\\s");
        for (c = a.length - 1; b.test(a.charAt(c));)c--;
        return a.slice(0, c + 1)
    };
    __.lang.truncate = function (a, b, c, d) {
        var e, f = a.length, g = 0;
        b = b || 30;
        c = c === void 0 ? "..." : c;
        if (d !== void 0 && f > b / 2) {
            d = 0;
            for (e = c.length; d < e; d++)g += c.charCodeAt(d) > 255 ? 2 : 1;
            for (d = 0; d < f; d++) {
                g += a.charCodeAt(d) > 255 ? 2 : 1;
                if (g > b)break
            }
            a = a.substring(0, d) + c
        } else a = a.length > b ? a.slice(0, b - c.length) + c : String(a);
        return a
    };
    __.lang.strRepeat = function (a, b) {
        var c = [];
        __.each(__.lang.range(b), function () {
            c.push(a)
        });
        return c.join("")
    };
    __.lang.baseConvert = function (a, b, c) {
        if (!a || !b)return false;
        a = String(a).toLowerCase();
        if (c === void 0)c = __.lang.startWith(a, "0x") ? 16 : __.lang.startWith(a, "0") ? 8 : 10;
        a =
            parseInt(a, c);
        return a.toString(b)
    };
    __.lang.stripTags = function (a) {
        return a.replace(__.lang.getReg("<\\/?[^>]+>", "gi"), "")
    };
    __.lang.camelize = function (a) {
        var b, c = a.split("_"), d = c.length;
        if (d === 1)return c[0];
        b = a.charAt(0) === "_" ? c[0].charAt(0).toUpperCase() + c[0].substring(1) : c[0];
        for (a = 1; a < d; ++a)b += c[a].charAt(0).toUpperCase() + c[a].substring(1);
        return b
    };
    __.lang.underscore = function (a) {
        return a.replace(__.lang.getReg("([A-Z]+)([A-Z][a-z])", "g"), "$1_$2").replace(__.lang.getReg("([a-z\\d])([A-Z])", "g"),
            "$1_$2").toLowerCase()
    };
    __.lang.capitalize = function (a) {
        return a.charAt(0).toUpperCase() + a.substring(1).toLowerCase()
    };
    __.lang.sprintf = function (a) {
        for (var b = 1; arguments[b] !== void 0;)a = a.replace(__.lang.getReg("%s"), arguments[b++]);
        return a
    };
    __.lang.startWith = function (a, b) {
        return a.indexOf(b) === 0
    };
    __.lang.beginWith = __.lang.startWith;
    __.lang.endWith = function (a, b) {
        var c = a.length - b.length;
        return c >= 0 && a.lastIndexOf(b) === c
    };
    __.lang.greplace = function (a, b, c) {
        var d, e = __.lang.getReg(b, "g"), f = __.lang.getReg(b),
            g = "";
        __.each(a.match(e), function (h, i) {
            d = a.indexOf(h) + h.length;
            g += a.substring(0, d).replace(f, c(h, i));
            a = a.substring(d)
        });
        return g + a
    };
    __.lang.rand = function (a, b) {
        if (b === void 0) {
            b = a;
            a = 0
        }
        return Math.round(Math.random() * (b - a)) + a
    };
    __.lang.getReg = function () {
        var a = {}, b;
        b = function (c, d) {
            var e = c + (d || "");
            a[e] || (a[e] = RegExp(c, d));
            return a[e]
        };
        b.purge = function () {
            a = {}
        };
        return b
    }();
    __.lang.log = function () {
        var a = 0, b = 0;
        return __.global.console ? function () {
            var c, d, e;
            if (__.isDebug()) {
                c = (new Date).getTime();
                e = __.global.console;
                d = a || c;
                a = c;
                c = ++b + ",(" + c + ",+" + (c - d) + "ms): ";
                d = __.lang.a(arguments);
                d.unshift(c);
                e.log.apply ? e.log.apply(e, d) : e.log(d.join(" "))
            }
        } : __.lang.EF
    }();
    __.lang.toCall = function (a, b, c) {
        var d, e, f = false;
        c = c || 1E3;
        e = typeof b === "function" ? b : function () {
            var g = false;
            if (__.get(b) !== void 0)g = true;
            return g
        };
        if (!f && e()) {
            f = true;
            a()
        } else d = setInterval(function () {
            if (!f && e()) {
                f = true;
                clearInterval(d);
                a()
            }
        }, c)
    }
});
__.BasicModule.register("dom", "0.4.0", ["lang"], function () {
    __.exportPath("__.dom");
    __.dom.id = function (a) {
        return typeof a === "string" ? __.doc.getElementById(a) : a
    };
    __.dom.$ = function (a) {
        return(a = __.dom.id(a)) ? [a] : []
    };
    __.dom.f = __.dom.id;
    __.dom.hasClass = function (a, b) {
        return __.lang.getReg("(?:^|\\s+)" + b + "(?:\\s+|$)").test(a.className)
    };
    __.dom.addClass = function (a, b) {
        if (!__.dom.hasClass(a, b))a.className = __.lang.trim([a.className, b].join(" "))
    };
    __.dom.remClass = function (a, b) {
        if (b && __.dom.hasClass(a, b)) {
            a.className =
                __.lang.trim(a.className.replace(__.lang.getReg("(?:^|\\s+)" + b + "(?:\\s+|$)"), " "));
            __.dom.hasClass(a, b) && __.dom.remClass(a, b)
        }
    };
    __.dom.getElementsByClassName = function () {
        return __.doc.getElementsByClassName ? function (a, b) {
            return a.getElementsByClassName(b)
        } : function (a, b) {
            var d, e, c, g;
            c = b.split(" ");
            var f = [], h = a.all ? a.all : a.getElementsByTagName("*"), j, i = [], k;
            d = 0;
            for (e = c.length; d < e; d += 1)f.push(__.lang.getReg("(^|\\s)" + c[d] + "(\\s|$)"));
            d = 0;
            for (e = h.length; d < e; d += 1) {
                j = h[d];
                k = false;
                c = 0;
                for (g = f.length; c < g; c +=
                    1) {
                    k = f[c].test(j.className);
                    if (!k)break
                }
                k && i.push(j)
            }
            return i
        }
    }();
    __.dom.insertBefore = function (a, b) {
        b.parentNode && b.parentNode.insertBefore && b.parentNode.insertBefore(a, b)
    };
    __.dom.insertAfter = function (a, b) {
        b.nextSibling ? b.parentNode.insertBefore(a, b.nextSibling) : b.parentNode.appendChild(a)
    };
    __.dom.addEl = function (a, b, d) {
        var e, c, g, f, h, j;
        if (!a)return false;
        h = function (i) {
            __.dom.addClass(e, i)
        };
        j = function (i) {
            __.dom.addEl(i, e)
        };
        if (__.lang.isArray(a)) {
            f = __.doc.createDocumentFragment();
            __.each(a, function (i) {
                __.dom.addEl(i,
                    f)
            });
            if (b = __.dom.id(b)) {
                if (d)b.innerHTML = "";
                f = b.appendChild(f)
            }
            return f
        }
        if (a._t) {
            a.tag = "_text";
            a.text = a._t
        }
        c = a.tag;
        if (!c && b && b.tagName)switch (b.tagName.toLowerCase()) {
            case "table":
            case "tbody":
                c = "tr";
                break;
            case "tr":
                c = "td";
                break;
            case "ul":
                c = "li";
                break;
            case "select":
                c = "option"
        }
        c = c || "div";
        if (__.ua.ie && (c === "input" || c === "select") && a.name)e = __.doc.createElement("<input name=" + a.name + ">"); else if (c === "_text") {
            e = __.doc.createTextNode(a.text);
            a = {}
        } else e = __.doc.createElement(c);
        if (!e)return false;
        for (g in a)if (a.hasOwnProperty(g)) {
            c =
                a[g];
            switch (g) {
                case "cls":
                    __.each(c, h);
                    break;
                case "child":
                    __.each(c, j);
                    break;
                case "text":
                    e.appendChild(__.doc.createTextNode(c));
                    break;
                case "css":
                    e.style.cssText = c;
                    break;
                case "html":
                    e.innerHTML = c;
                    break;
                case "attrs":
                    __.each(c, function (i, k) {
                        e.setAttribute(k, i)
                    }, true);
                    break;
                default:
                    e[g] = c
            }
        }
        if ((b = __.dom.f(b)) && b.appendChild) {
            if (d)b.innerHTML = "";
            e = b.appendChild(e)
        }
        return e
    };
    __.dom.remEl = function (a) {
        var b, d = function (e) {
            e = __.dom.$(e);
            __.each(e, function (c) {
                c && c.parentNode && c.parentNode.removeChild(c)
            })
        };
        if (__.lang.isArray(a))for (b = a.length - 1; b > -1; b--)d(a[b]); else d(a)
    };
    __.dom.addText = function (a, b) {
        a.appendChild(__.doc.createTextNode(b))
    };
    __.dom.fillText = function (a, b) {
        a.innerHTML = "";
        __.dom.addText(a, b)
    };
    __.dom.addStyle = function (a) {
        var b;
        if (__.doc.createStyleSheet) {
            b = __.doc.createStyleSheet("");
            b.cssText = a
        } else __.dom.addEl({tag: "style", textContent: a}, __.doc.getElementsByTagName("head")[0]);
        a = __.doc.styleSheets;
        return a[a.length - 1]
    };
    __.dom.addRules = function (a, b) {
        var d;
        if (!b) {
            if (!__.dom._style)__.dom._style =
                __.dom.addStyle("");
            b = __.dom._style
        }
        d = b.insertRule ? function (e) {
            var c = b, g = [];
            __.each(e, function (f, h) {
                g[h] = [c.cssRules.length];
                try {
                    c.insertRule(f, c.cssRules.length)
                } catch (j) {
                }
            });
            return g
        } : b.addRule ? function (e) {
            var c = b, g = [];
            __.each(e, function (f, h) {
                f = f.split(__.lang.getReg("[{}]"));
                g[h] = [];
                __.each(f[0].split(/\s*,\s*/), function (j) {
                    g[h].push(c.rules.length);
                    c.addRule(j, f[1], c.rules.length)
                })
            });
            return g
        } : __.lang.EF;
        __.dom.addRules = d;
        return d(a)
    };
    __.dom.remRules = function (a, b) {
        var d = b || __.dom._style || __.doc.styleSheets[0],
            e;
        if (d.deleteRule)e = true; else if (d.removeRule)e = false; else return;
        __.each(a, function (c) {
            e ? d.deleteRule(c) : d.removeRule(c)
        })
    };
    __.dom.getScrollXY = function () {
        var a = function (b) {
            b = "scroll" + b;
            return Math.max(__.doc.documentElement[b], __.doc.body[b])
        };
        return[a("Left"), a("Top")]
    };
    __.dom.getPosition = function (a, b) {
        for (var d = 0; a && !__.lang.isEmpty(a.offsetParent);) {
            d += a[b];
            a = a.offsetParent
        }
        d += parseInt(__.doc.body[b], 10);
        return d
    };
    __.dom.v = function (a) {
        if (a = __.dom.f(a))return a.value;
        return false
    };
    __.dom.getWindowXY =
        function () {
            var a = __.global.innerHeight, b = __.global.innerWidth, d = __.doc.compatMode;
            if (d || __.ua.ie)if (d === "CSS1Compat") {
                a = __.ua.opera ? a : __.doc.documentElement.clientHeight;
                b = __.doc.documentElement.clientWidth
            } else {
                a = __.ua.opera ? a : __.doc.body.clientHeight;
                b = __.doc.body.clientWidth
            }
            return[b, a]
        };
    __.dom.getDocumentXY = function () {
        var a, b, d;
        if (__.doc.compatMode !== "CSS1Compat" || __.ua.webkit) {
            a = __.doc.body.scrollWidth;
            b = __.doc.body.scrollHeight
        } else {
            a = __.doc.documentElement.scrollWidth;
            b = __.doc.documentElement.scrollHeight
        }
        d =
            __.dom.getWindowXY();
        return[Math.max(a, d[0]), Math.max(b, d[1])]
    };
    __.dom.setCenter = function (a) {
        a.style.position = "absolute";
        var b = __.dom.getWindowXY(), d = __.dom.getScrollXY(), e = a.offsetWidth || a.clientWidth || parseInt(a.style.width, 10), c = a.offsetHeight || a.clientHeight || parseInt(a.style.height, 10);
        a.style.left = (b[0] - e) / 2 + d[0] + "px";
        b = (b[1] - c) / 2 + d[1];
        a.style.top = (b < 50 ? 50 : b) + "px"
    };
    __.dom.getOpacity = function (a) {
        var b;
        if (__.lang.isUndefined(a.style.opacity)) {
            b = 100;
            try {
                b = a.filters["DXImageTransform.Microsoft.Alpha"].opacity
            } catch (d) {
                try {
                    b =
                        a.filters("alpha").opacity
                } catch (e) {
                }
            }
            b /= 100
        } else {
            b = a.style.opacity;
            b = b === "" ? "1" : b
        }
        return b
    };
    __.dom.setOpacity = function (a, b) {
        if (!__.lang.isUndefined(a.style.opacity))a.style.opacity = b;
        if (__.lang.isString(a.style.filter)) {
            a.style.filter = "alpha(opacity=" + (b * 100).toFixed(0) + ")";
            if (!a.currentStyle || !a.currentStyle.hasLayout)a.style.zoom = 1
        }
    };
    __.dom.contains = function (a, b) {
        if (a.contains && b.nodeType == __.lang.NODE_TYPE.ELEMENT_NODE)return a == b || a.contains(b);
        if (typeof a.compareDocumentPosition != "undefined")return a ==
            b || Boolean(a.compareDocumentPosition(b) & 16);
        for (; b && a != b;)b = b.parentNode;
        return b == a
    }
});
__.BasicModule.register("event", "0.4.0", ["lang"], function () {
    __.exportPath("__.event");
    __.event.listeners = 0;
    __.event._allEvents = {};
    __.event._getEl = function (a) {
        return __.lang.isString(a) ? __.dom ? __.dom.$(a) : __.doc.getElementById(a) : a
    };
    __.event.on = function (a, c, f, d) {
        var b, g, h, i;
        if (a = __.event._getEl(a))if (__.lang.isArray(a))__.each(a, function (e) {
            __.event.on(e, c, f, d)
        }); else if (__.lang.isArray(c))__.each(c, function (e) {
            __.event.on(a, e, f, d)
        }); else {
            h = __.getUid(a);
            b = __.event._allEvents;
            b[c] = b[c] || {};
            b = b[c];
            b[h] =
                b[h] || [];
            h = b[h];
            for (b = 0; b < h.length; b++)if (h[b].listener == f)return;
            if (c.indexOf(":") > -1) {
                g = "dataavailable";
                b = function (e) {
                    e = e || __.global.event;
                    if (!e.target)e.target = e.srcElement;
                    if (e.eventName === c)return f(e);
                    return true
                }
            } else {
                g = c;
                b = function (e) {
                    e = e || __.global.event;
                    if (!e.target)e.target = e.srcElement;
                    return f(e)
                }
            }
            i = {type: g, listener: f, proxy: b};
            if (a.addEventListener)a.addEventListener(g, b, !!d); else a.attachEvent && a.attachEvent("on" + g, b);
            h.push(i);
            __.event.listeners++
        }
    };
    __.event.off = function (a, c, f, d) {
        var b,
            g, h;
        if (a = __.event._getEl(a))if (__.lang.isArray(a))__.each(a, function (i) {
            __.event.off(i, c, f, d)
        }); else {
            b = __.getUid(a);
            if (h = (__.event._allEvents[c] || {})[b])for (b = 0; b < h.length; b++)if (h[b].listener == f) {
                g = h[b];
                h.splice(b, 1);
                break
            }
            if (g) {
                if (a.removeEventListener)a.removeEventListener(g.type, g.proxy, !!d); else a.detachEvent && a.detachEvent("on" + g.type, g.proxy);
                __.event.listeners--
            }
        }
    };
    __.event.fire = function (a, c, f) {
        var d, b = __.event._getEl(a);
        if (__.lang.isArray(b))__.each(b, function (g) {
            __.event.fire(g, c, f)
        }); else {
            b =
                b || __.doc;
            if (b === __.doc && __.doc.createEvent && !b.dispatchEvent)b = __.doc.documentElement;
            if (b.dispatchEvent || b.fireEvent) {
                if (__.doc.createEvent) {
                    d = __.doc.createEvent("HTMLEvents");
                    d.initEvent("dataavailable", true, true)
                } else {
                    d = __.doc.createEventObject();
                    d.eventType = "ondataavailable"
                }
                d.eventName = c;
                d.memo = f || {};
                __.doc.createEvent ? b.dispatchEvent(d) : b.fireEvent(d.eventType, d)
            } else if (b = __.event._allEvents[c])if (b = b[__.getUid(a)]) {
                d = {eventType: c, eventName: c, target: a, memo: f};
                for (a = 0; a < b.length; a++)b[a].listener(d)
            }
            return d
        }
    };
    __.event.stopPropagation = function (a) {
        if (a.stopPropagation)a.stopPropagation(); else a.cancelBubble = true
    };
    __.event.preventDefault = function (a) {
        if (a.preventDefault)a.preventDefault(); else a.returnValue = false
    };
    __.event.stopEvent = function (a) {
        __.event.preventDefault(a);
        __.event.stopPropagation(a)
    };
    __.event.bind = function (a, c) {
        return function () {
            a.apply(c, __.lang.a(arguments))
        }
    };
    __.event.onReady = function (a) {
        var c = __.event.onReady;
        c._bindReady();
        c._isReady ? a.call(__.global) : c._readyList.push(function () {
            return a.call(__.global)
        })
    };
    __.event.onReady._readyList = [];
    __.event.onReady._isReady = false;
    __.event.onReady._isBound = false;
    __.event.onReady._hlReady = function () {
        var a = __.event.onReady;
        if (!a._isReady) {
            a._isReady = true;
            __.each(a._readyList, function (c) {
                c()
            });
            a._readyList = null
        }
    };
    __.event.onReady._bindReady = function () {
        var a = this, c;
        if (!a._isBound) {
            a._isBound = true;
            if (__.doc.readyState)if (__.doc.readyState === "complete") {
                a._hlReady();
                return
            }
            if (__.ua.ie)a._domReadyId = setInterval(function () {
                try {
                    __.doc.documentElement.doScroll("left");
                    clearInterval(a._domReadyId);
                    a._domReadyId = null;
                    a._hlReady()
                } catch (f) {
                }
            }, 50); else __.doc.addEventListener("DOMContentLoaded", a._hlReady, false);
            c = __.global.onload;
            __.global.onload = typeof c !== "function" ? a._hlReady : function () {
                a._hlReady();
                c()
            }
        }
    }
});
__.BasicModule.register("cookie", "0.4.0", [], function () {
    __.exportPath("__.cookie");
    __.cookie.get = function (b) {
        var a = __.doc.cookie, c = b + "=", d = a.indexOf("; " + c), e;
        if (d === -1) {
            d = a.indexOf(c);
            if (d !== 0)return""
        } else d += 2;
        b = a.indexOf(";", d);
        if (b === -1)b = a.length;
        a = a.substring(d + c.length, b);
        try {
            e = decodeURIComponent(a)
        } catch (f) {
            e = a
        }
        return e
    };
    __.cookie.del = function (b, a, c) {
        var d = b + "=";
        if (__.cookie.get(b)) {
            if (a)d += "; path=" + a;
            if (c)d += "; domain=" + c;
            d += "; expires=Thu, 01-Jan-70 00:00:01 GMT";
            __.doc.cookie = d
        }
    };
    __.cookie.set =
        function (b, a, c) {
            c = c || {};
            b = b + "=" + encodeURIComponent(a);
            if (c.expires) {
                a = c.expires;
                a.toGMTString || (a = new Date(a));
                b += "; expires=" + a.toGMTString()
            }
            if (c.path)b += "; path=" + c.path;
            if (c.domain)b += "; domain=" + c.domain;
            if (c.secure)b += "; secure";
            __.doc.cookie = b
        }
});
__.BasicModule.register("selector", "0.4.0", ["lang", "dom"], function () {
    __.exportPath("__.selector");
    __.dom.$ = function (a, b, e) {
        var c;
        if (a)if (a.nodeType)c = [a]; else if (a.item) {
            c = [];
            b = 0;
            for (e = a.length; b < e; ++b)c.push(a[b])
        } else if (__.lang.isString(a))c = (c = b ? null : __.dom.id(a)) ? [c] : __.selector.query(a, b, e); else c = [a]; else c = [];
        return c
    };
    __.dom.f = function () {
        return __.dom.$.apply(__.dom, __.lang.a(arguments))[0]
    };
    __.selector.query = function () {
        return __.doc.querySelectorAll ? function (a, b, e) {
            var c = [];
            if (b && !b.nodeName) {
                b =
                    __.dom.f(b);
                if (!b)return c
            }
            b = b || __.doc;
            if (e)c[0] = b.querySelector(a); else {
                e = b.querySelectorAll(a);
                a = 0;
                for (b = e.length; a < b; ++a)c.push(e[a])
            }
            return c
        } : function (a, b, e) {
            var c, d, h, g, f, i, j, k, l, m, n;
            c = [];
            if (!a)return c;
            a = __.lang.trim(a);
            d = __.lang.trim(a).split(",");
            if (d.length > 1) {
                a = 0;
                for (g = d.length; a < g; ++a) {
                    h = __.selector.query(d[a], b, e);
                    if (e && h.length > 1) {
                        c[0] = h[0];
                        break
                    } else c = c.concat(h)
                }
                return c
            }
            if (b && !b.nodeName) {
                b = __.dom.f(b);
                if (!b)return c
            }
            b = b || __.doc;
            b = [b];
            e = a.split(" ");
            k = false;
            d = 0;
            for (h = e.length; d <
                h; d++) {
                a = e[d];
                if (a === ">")k = true; else {
                    c = [];
                    f = a.match(__.lang.getReg("^([^.#]+)"));
                    i = a.match(__.lang.getReg("#([^.#]+)"));
                    j = (a = a.match(__.lang.getReg("\\.[^.#]+", "g"))) ? a.join(" ").replace(__.lang.getReg("\\.", "g"), "") : "";
                    if (i) {
                        c = (c = __.dom.id(i[1])) ? [c] : [];
                        f = f ? f[1] : null
                    } else if (f || a) {
                        a = 0;
                        for (g = b.length; a < g; ++a) {
                            l = f ? b[a].getElementsByTagName(f[1]) : __.dom.getElementsByClassName(b[a], j);
                            if (k) {
                                m = 0;
                                for (n = l.length; m < n; m++)l[m].parentNode === b[a] && c.push(l[m])
                            } else c = c.concat(__.lang.a(l))
                        }
                        j = f ? j : null;
                        f = null
                    }
                    c =
                        __.selector._nodeFilter(c, {tagname: f, classname: j});
                    if (i && c[0]) {
                        i = false;
                        a = 0;
                        for (g = b.length; a < g; ++a) {
                            f = b[a];
                            if (k ? c[0].parentNode === f : f === __.doc || __.dom.contains(c[0], f)) {
                                i = true;
                                break
                            }
                        }
                        i || (c = [])
                    }
                    k = false;
                    b = c;
                    if (b.length === 0)break
                }
            }
            return b
        }
    }();
    __.selector._nodeFilter = function (a, b) {
        var e, c, d, h, g, f, i, j;
        a = __.lang.unique(a);
        if (b.tagname) {
            e = [];
            c = __.lang.getReg("\\b" + b.tagname + "\\b", "i");
            d = 0;
            for (h = a.length; d < h; ++d)c.test(a[d].tagName) && e.push(a[d]);
            a = e
        }
        if (b.classname) {
            e = [];
            g = b.classname.split(" ");
            c = [];
            d = 0;
            for (h = g.length; d < h; ++d)c.push(__.lang.getReg("(^|\\s)" + g[d] + "(\\s|$)"));
            d = 0;
            for (h = a.length; d < h; ++d) {
                j = a[d];
                i = false;
                g = 0;
                for (f = c.length; g < f; g++) {
                    i = c[g].test(j.className);
                    if (!i)break
                }
                i && e.push(j)
            }
            a = e
        }
        return a
    }
});
if (!this.JSON)this.JSON = {};
(function () {
    function j(c) {
        return c < 10 ? "0" + c : c
    }

    function o(c) {
        p.lastIndex = 0;
        return p.test(c) ? '"' + c.replace(p, function (f) {
            var b = r[f];
            return typeof b === "string" ? b : "\\u" + ("0000" + f.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + c + '"'
    }

    function m(c, f) {
        var b, d, g, k, i = h, e, a = f[c];
        if (a && typeof a === "object" && typeof a.toJSON === "function")a = a.toJSON(c);
        if (typeof l === "function")a = l.call(f, c, a);
        switch (typeof a) {
            case "string":
                return o(a);
            case "number":
                return isFinite(a) ? String(a) : "null";
            case "boolean":
            case "null":
                return String(a);
            case "object":
                if (!a)return"null";
                h += n;
                e = [];
                if (Object.prototype.toString.apply(a) === "[object Array]") {
                    k = a.length;
                    for (b = 0; b < k; b += 1)e[b] = m(b, a) || "null";
                    g = e.length === 0 ? "[]" : h ? "[\n" + h + e.join(",\n" + h) + "\n" + i + "]" : "[" + e.join(",") + "]";
                    h = i;
                    return g
                }
                if (l && typeof l === "object") {
                    k = l.length;
                    for (b = 0; b < k; b += 1) {
                        d = l[b];
                        if (typeof d === "string")if (g = m(d, a))e.push(o(d) + (h ? ": " : ":") + g)
                    }
                } else for (d in a)if (Object.hasOwnProperty.call(a, d))if (g = m(d, a))e.push(o(d) + (h ? ": " : ":") + g);
                g = e.length === 0 ? "{}" : h ? "{\n" + h + e.join(",\n" + h) +
                    "\n" + i + "}" : "{" + e.join(",") + "}";
                h = i;
                return g
        }
    }

    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function () {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + j(this.getUTCMonth() + 1) + "-" + j(this.getUTCDate()) + "T" + j(this.getUTCHours()) + ":" + j(this.getUTCMinutes()) + ":" + j(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
            return this.valueOf()
        }
    }
    var q = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        p = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, h, n, r = {"": "\\b", "\t": "\\t", "\n": "\\n", "": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"}, l;
    if (typeof JSON.stringify !== "function")JSON.stringify = function (c, f, b) {
        var d;
        n = h = "";
        if (typeof b === "number")for (d = 0; d < b; d += 1)n += " "; else if (typeof b === "string")n = b;
        if ((l = f) && typeof f !== "function" && (typeof f !== "object" || typeof f.length !== "number"))throw Error("JSON.stringify");
        return m("", {"": c})
    };
    if (typeof JSON.parse !== "function")JSON.parse = function (c, f) {
        function b(g, k) {
            var i, e, a = g[k];
            if (a && typeof a === "object")for (i in a)if (Object.hasOwnProperty.call(a, i)) {
                e = b(a, i);
                if (e !== undefined)a[i] = e; else delete a[i]
            }
            return f.call(g, k, a)
        }

        var d;
        q.lastIndex = 0;
        if (q.test(c))c = c.replace(q, function (g) {
            return"\\u" + ("0000" + g.charCodeAt(0).toString(16)).slice(-4)
        });
        if (/^[\],:{}\s]*$/.test(c.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
            d = eval("(" + c + ")");
            return typeof f === "function" ? b({"": d}, "") : d
        }
        throw new SyntaxError("JSON.parse");
    }
})();
typeof __ != "undefined" && !__.Json && function () {
    __.json = {toJson: function (j) {
        return JSON.stringify(j)
    }, fromJson: function (j) {
        return JSON.parse(j)
    }}
}();
__.BasicModule.register("io", "0.4.0", ["lang"], function () {
    __.exportPath("__.io");
    __.io.Ajax = function (a, b) {
        b = b || {};
        this.base = a;
        this.timeout = b.timeout || 6E4;
        this.onOk = b.onOk;
        this.onFail = b.onFail;
        this.async = __.lang.isBoolean(b.async) ? b.async : true;
        if (b.post) {
            this.method = "POST";
            this.post = b.post
        } else this.method = "GET";
        this.id = ++__.io.Ajax.uidCount;
        this.headers = __.lang.mergeObj(this.defaultHeaders, b.headers || {})
    };
    __.io.Ajax.uidCount = 0;
    __.io.Ajax.pollingWait = 50;
    __.io.Ajax.prototype.defaultHeaders = {"Content-Type": "application/x-www-form-urlencoded"};
    __.io.Ajax.prototype.getTransport = function () {
        var a, b, c, d = [function () {
            return new XMLHttpRequest
        }, function () {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }, function () {
            return new ActiveXObject("Msxml2.XMLHTTP")
        }];
        a = 0;
        for (b = d.length; a < b; ++a)try {
            if (c = d[a]()) {
                __.io.Ajax.prototype.getTransport = d[a];
                return c
            }
        } catch (e) {
        }
    };
    __.io.Ajax.prototype.setupPolling = function () {
        var a = this, b = 0;
        this.iid = setInterval(function () {
            b++;
            if (b * __.io.Ajax.pollingWait > a.timeout) {
                a.stop();
                a.xhr.isTimeout = true;
                a.onFail(a.xhr)
            } else if (a.xhr.readyState ===
                4) {
                a.stop();
                if (a.xhr.status === 200)a.onOk(a.xhr); else a.onFail(a.xhr)
            }
        }, __.io.Ajax.pollingWait)
    };
    __.io.Ajax.prototype.setHeaders = function () {
        var a = this.xhr;
        __.each(this.headers, function (b, c) {
            a.setRequestHeader(c, b)
        }, true)
    };
    __.io.Ajax.prototype.prepare = function () {
        var a = this.post;
        if (a)this.post = __.lang.isString(a) || !JSON ? a : JSON.stringify(a);
        this.xhr = this.getTransport();
        this.xhr.open(this.method, this.base, this.async);
        this.setHeaders()
    };
    __.io.Ajax.prototype.send = function () {
        this.xhr.send(this.post);
        this.setupPolling()
    };
    __.io.Ajax.prototype.stop = function () {
        if (this.iid) {
            clearInterval(this.iid);
            this.iid = null
        }
    };
    __.io.Ajax.prototype.abort = function () {
        this.stop();
        this.xhr.abort && this.xhr.abort()
    };
    __.io._ajaxManager = {_uidCount: 0, _maxThread: __.ua.ie && __.ua.ie < 8 ? 2 : 4, _waiting: [], _requesting: [], push: function (a) {
        a.cache = __.lang.isBoolean(a.cache) ? a.cache : true;
        a._duAmUid = ++this._uidCount;
        this._waiting.push(a);
        this._try2Send();
        return a._duAmUid
    }, abort: function (a) {
        var b = false, c;
        c = __.find(this._waiting, function (d) {
            return d._duAmUid ===
                a
        });
        if (c > -1) {
            __.lang.arrayRemove(this._waiting, c);
            b = true
        } else __.each(this._requesting, function (d) {
            if (d._duAmUid === a) {
                d.abort();
                b = true
            }
        });
        return b
    }, _try2Send: function () {
        var a;
        if (!(this._requesting.length >= this._maxThread))for (; this._waiting.length;)if (a = this._waiting.shift()) {
            a = this._send(a);
            this._requesting.push(a);
            break
        }
    }, _send: function (a) {
        var b, c = a.onOk, d = a.onFail;
        a.onOk = a.onFail = __.io._ajaxManager._finish;
        b = this._makeUrl(a.sUrl, a.oGet, a.cache);
        b = new __.io.Ajax(b, a);
        b.onOk2 = c;
        b.onFail2 = d;
        b.target =
            a.target;
        b._duAmUid = a._duAmUid;
        b.prepare();
        b.send();
        return b
    }, _finish: function (a) {
        var b = __.io._ajaxManager, c, d;
        d = __.lang.find(b._requesting, function (e) {
            return e.xhr === a
        });
        if (d !== -1) {
            c = b._requesting[d];
            __.lang.arrayRemove(b._requesting, d)
        }
        if (a.readyState === 4 && a.status === 200) {
            d = a.responseText;
            if (c.target)if (__.dom)__.dom.fillText(__.dom.f(c.target), d); else {
                c.target.innerHTML = "";
                c.target.appendChild(__.doc.createTextNode(d))
            }
            if (c.onOk2)c.onOk2(d, a)
        } else {
            __.lang.log("xmlhttp request #" + c.id + " failed");
            if (c.onFail2)c.onFail2(a)
        }
        b._try2Send();
        b = c = a = null
    }, _makeUrl: function (a, b, c) {
        if (b || !c) {
            if (a.indexOf("?") < 0)a += "?";
            c || (a += "&_durd=" + Math.random());
            b && __.each(b, function (d, e) {
                a += ["&", encodeURIComponent(e), "=", encodeURIComponent(d)].join("")
            }, true)
        }
        return a
    }};
    __.io.ajax = function (a, b, c) {
        c = c || {};
        if (__.lang.isFunction(b))c.onOk = b; else if (__.lang.isObject(b))c = b;
        if (__.lang.isObject(a))c = a; else if (__.lang.isString(a))c.sUrl = a;
        __.io._ajaxManager.push(c)
    }
});
__.BasicModule.register("anim", "0.4.0", ["lang"], function () {
    __.Anim = function (a, c, b) {
        if (typeof b !== "object")b = {to: b};
        if (__.lang.isString(a))if (__.dom)a = __.dom.f(a);
        this.el = a;
        this.attr = c;
        this.from = __.lang.isUndefined(b.from) ? false : b.from;
        this.to = b.to;
        this.unit = __.lang.isUndefined(b.unit) ? "" : b.unit;
        this.lasttime = __.lang.isUndefined(b.lasttime) ? 300 : b.lasttime;
        this.interval = __.lang.isUndefined(b.interval) ? 15 : b.interval;
        this.max = __.lang.isUndefined(b.max) ? this.lasttime * 2 / this.interval : b.max;
        this.onOver =
            __.lang.isUndefined(b.onOver) ? __.lang.EF : b.onOver;
        this.onSet = __.lang.isUndefined(b.onSet) ? __.lang.EF : b.onSet;
        this.isStyle = b.isStyle === false ? false : true;
        this.paused = false;
        this.iid = null;
        this.running = false
    };
    __.Anim.prototype._get = function () {
        var a = this.el;
        if (this.isStyle)a = a.style;
        a = this.attr === "opacity" ? __.dom.getOpacity(this.el) : a[this.attr];
        return parseFloat(a) || 0
    };
    __.Anim.prototype._set = function (a) {
        var c = this.el;
        if (this.isStyle)c = c.style;
        this.attr === "opacity" ? __.dom.setOpacity(this.el, a) : c[this.attr] =
            a + this.unit;
        this.onSet((a - this.from) / this.range)
    };
    __.Anim.prototype._begin = function () {
        var a = this;
        this.count = 0;
        return setInterval(function () {
            var c = a._get();
            if (a.count++ >= a.max || a.piece > 0 && c + a.piece >= a.to || a.piece < 0 && c + a.piece <= a.to) {
                a._stop();
                a._set(a.to);
                if (a.onOver)a.onOver()
            } else a._set(c + a.piece)
        }, a.interval)
    };
    __.Anim.prototype._stop = function () {
        this.running = false;
        clearInterval(this.iid)
    };
    __.Anim.prototype.run = function () {
        var a;
        if (!this.running) {
            this.running = true;
            if (!this.paused) {
                a = this.from;
                this.from =
                    a === false ? this._get() : a;
                this.range = this.to - this.from;
                this.piece = this.range * (this.interval + 1) / this.lasttime;
                this._set(this.from + this.piece);
                this.from = a
            }
            if (this.piece === 0) {
                this.running = false;
                if (this.onOver)this.onOver()
            } else this.iid = this._begin()
        }
    };
    __.Anim.prototype.pause = function () {
        this.paused = true;
        this.running = false;
        clearInterval(this.iid)
    };
    __.Anim.prototype.stop = function () {
        this.running && this._stop()
    }
});
__.BasicModule.register("drag", "0.4.0", ["lang", "dom", "event"], function () {
    __.exportPath("__.drag");
    __.drag.aElInfo = {};
    __.drag.disableSelection = function () {
        if (__.ua.gecko) {
            __.drag.oldSsHl = __.doc.onmousedown;
            __.doc.onmousedown = function (a) {
                a.preventDefault()
            }
        } else {
            __.drag.oldSsHl = __.doc.onselectstart;
            __.doc.onselectstart = function () {
                return false
            }
        }
    };
    __.drag.enableSelection = function () {
        if (__.drag.oldSsHl) {
            if (__.ua.gecko)__.doc.onmousedown = __.drag.oldSsHl; else __.doc.onselectstart = __.drag.oldSsHl;
            __.drag.oldSsHl = void 0
        }
    };
    __.drag._hlMouseup = function () {
        var a = __.drag.el, c = __.drag.aElInfo[__.getUid(a)];
        __.drag.withFade && __.dom.setOpacity(a, __.drag.opacity);
        a.style.zIndex = c.oriZ;
        __.topLayer--;
        __.drag.fnUp && __.drag.fnUp(parseInt(a.style.left, 10), parseInt(a.style.top, 10), c.zone);
        __.drag._purge()
    };
    __.drag._hlOnMove = function (a) {
        var c, b, f, e, i, g = __.drag.el, d = __.drag.aElInfo[__.getUid(g)];
        c = a.clientX - __.drag.deltaX;
        a = a.clientY - __.drag.deltaY;
        i = __.drag.winXY;
        if (d.zone) {
            b = d.zone;
            c = Math.max(b.left, c);
            c = Math.min(b.right,
                c);
            a = Math.max(b.top, a);
            a = Math.min(b.bottom, a)
        }
        if (__.drag.autoScroll) {
            f = __.drag.autoScroll;
            b = __.dom.getScrollXY();
            if (!__.lang.isUndefined(f.height)) {
                e = f.height;
                if (a - b[1] - i[1] + e > f.bottomBorder) {
                    a += e;
                    b[1] += e;
                    __.global.scrollTo(b[0], b[1]);
                    __.drag.deltaY -= e
                } else if (a - b[1] < f.topBorder) {
                    a -= e;
                    b[1] -= e;
                    __.global.scrollTo(b[0], b[1]);
                    __.drag.deltaY += e
                }
            }
            if (!__.lang.isUndefined(f.width)) {
                e = f.width;
                if (c - b[0] - i[0] + e > f.rightBorder) {
                    c += e;
                    b[0] += e;
                    __.global.scrollTo(b[0], b[1]);
                    __.drag.deltaX -= e
                } else if (a - b[1] < f.topBorder) {
                    a -=
                        e;
                    b[0] -= e;
                    __.global.scrollTo(b[0], b[1]);
                    __.drag.deltaX += e
                }
            }
        }
        g.style.left = c + "px";
        g.style.top = a + "px";
        __.drag.fnMove && __.drag.fnMove(c, a, d.zone);
        return false
    };
    __.drag._purge = function () {
        __.drag.autoScroll = __.drag.el = __.drag.fnUp = __.drag.fnMove = void 0;
        __.event.off(__.doc, "mousemove", __.drag._hlOnMove);
        __.event.off(__.doc, "mouseup", __.drag._hlMouseup);
        __.drag.enableSelection()
    };
    __.drag._attachEvent = function () {
        __.drag.disableSelection();
        __.event.on(__.doc, "mousemove", __.drag._hlOnMove);
        __.event.on(__.doc,
            "mouseup", __.drag._hlMouseup)
    };
    __.drag.begin = function (a, c, b, f, e, i, g) {
        var d, j, h;
        b = b === false ? false : true;
        g = g || {};
        __.drag._purge();
        h = c.style;
        j = __.getUid(c);
        d = __.drag.aElInfo[j];
        if (d === void 0)d = __.drag.aElInfo[j] = {};
        d.oriZ = __.lang.isEmpty(c.style.zIndex) ? 1 : c.style.zIndex;
        if (!d.moved) {
            d.moved = true;
            if (h.position.toLowerCase().indexOf("absolute") === -1)h.position = "relative"
        }
        if (h.left)d.oriL = parseInt(h.left, 10); else {
            d.oriL = 0;
            h.left = "0px"
        }
        if (h.top)d.oriT = parseInt(h.top, 10); else {
            d.oriT = 0;
            h.top = "0px"
        }
        if (f)d.zone =
        {top: d.oriT - f.t, right: d.oriL + f.r, bottom: d.oriT + f.b, left: d.oriL - f.l};
        __.drag.withFade = b;
        __.drag.el = c;
        __.drag.deltaX = a.clientX - d.oriL;
        __.drag.deltaY = a.clientY - d.oriT;
        __.drag.oldOpacity = __.dom.getOpacity(c);
        __.drag.fnUp = e;
        __.drag.fnMove = i;
        __.drag.autoScroll = g.autoScroll ? true : false;
        __.drag.winXY = __.dom.getWindowXY();
        c.style.zIndex = ++__.topLayer;
        if (b)__.dom.setOpacity(c, g.opacity || 0.7);
        __.drag._attachEvent()
    };
    __.drag.bind = function (a, c, b, f, e, i) {
        a = __.dom.f(a);
        __.event.on(a, "mousedown", function (g) {
            __.drag.begin(g,
                a, c, b, f, e, i)
        })
    }
});
__.BasicModule.register("history", "0.4.0", ["lang", "event"], function () {
    __.History = function (a) {
        if (__.History._theInstance)return __.History._theInstance;
        __.History._theInstance = this;
        a = a || {};
        this._initEvents();
        __.History.useIframe && this._initIframe();
        this._resolveChanges(a.initState || this._parseHash())
    };
    __.History.nativeHashChange = (!__.lang.isUndefined(__.global.onhashchange) || __.doc.onhashchange) && (!__.doc.documentMode || __.doc.documentMode > 7);
    __.History.useIframe = __.ua.ie && !__.History.nativeHashChange;
    __.History.prototype._iframe = null;
    __.History.prototype._globalPollingId = null;
    __.History.prototype.state = {};
    __.History.prototype._parseHash = function () {
        var a, b, c = this.decode;
        a = this.getHash().split(__.lang.getReg("&(?!amp;)"));
        b = {};
        __.each(a, function (d) {
            d = d.split("=");
            if (d.length === 2)b[c(d[0])] = c(d[1])
        });
        return b
    };
    __.History.prototype._resolveChanges = function (a, b) {
        var c, d = this.state, e = {}, h = {};
        a || (a = {});
        __.each(a, function (g, f) {
            var i = d[f];
            if (g !== i) {
                e[f] = {newVal: g, oldVal: i};
                c = true
            }
        }, true);
        __.each(d, function (g, f) {
            if (__.lang.isUndefined(a[f]) || a === null) {
                h[f] = g;
                c = true
            }
        }, true);
        c && this._trigger({changed: e, removed: h, newState: a, oldState: d}, b)
    };
    __.History.prototype._trigger = function (a, b) {
        this.state = a.newState;
        b || this.setHash(this.createHash(a.newState));
        this._fire(a)
    };
    __.History.prototype._handleChange = function () {
        this._resolveChanges(this._parseHash(), true)
    };
    __.History.prototype._fire = function (a) {
        __.event.fire(__.doc, "du-history:change", {changed: a.changed, newVal: a.newState, oldVal: a.prevState, removed: a.removed})
    };
    __.History.prototype._updateIframe = __.History.useIframe ? function (a) {
        var b, c;
        if (this._iframe) {
            b = this._iframe.contentWindow.document;
            c = b.location;
            b.open().close();
            c.hash = a
        }
    } : null;
    __.History.prototype.createHash = function (a) {
        var b = this.encode, c = [];
        __.each(a, function (d, e) {
            c.push(b(e) + "=" + b(d))
        }, true);
        return c.join("&")
    };
    __.History.prototype.setHash = function (a) {
        if (a.charAt(0) === "#")a = a.substr(1);
        location.hash = a;
        __.History.useIframe && this._updateIframe(a)
    };
    __.History.prototype.getHash = __.ua.gecko ? function () {
        var a =
            location.href.match(__.lang.getReg("#(.*)$"));
        return a && a[1] || ""
    } : function () {
        return(this._iframe ? this._iframe.contentWindow.location : location).hash.substr(1)
    };
    __.History.prototype.getUrl = __.History.useIframe ? function () {
        var a = this.getHash();
        return a && a !== location.hash.substr(1) ? location.href.replace(__.lang.getReg("#.*$"), "") + "#" + a : location.href
    } : function () {
        return location.href
    };
    __.History.prototype.decode = function (a) {
        return decodeURIComponent(a.replace(/\+/g, " "))
    };
    __.History.prototype.encode = function (a) {
        return encodeURIComponent(a).replace(/%20/g,
            "+")
    };
    __.History.prototype.addEntry = function (a, b) {
        var c = {};
        __.each(this.state, function (d, e) {
            c[e] = d
        }, true);
        c[a] = String(b);
        this._resolveChanges(c)
    };
    __.History.prototype.setStat = function (a) {
        var b = {};
        __.each(a, function (c, d) {
            b[d] = c
        }, true);
        this._resolveChanges(b)
    };
    __.History.prototype._initIframe = function () {
        var a = this;
        if (!this._iframe)__.event.onReady(function () {
            this._iframe = __.doc.createElement('<iframe src="javascript:0" style="display:none" height="0" width="0" tabindex="-1" title="empty"/>');
            __.doc.documentElement.appendChild(this._iframe);
            a._updateIframe(location.hash.substr(1))
        })
    };
    __.History.prototype._initEvents = function () {
        var a, b = this;
        a = this.getHash();
        if (__.History.nativeHashChange)__.event.on(__.global, "hashchange", __.event.bind(this._handleChange, this)); else if (!this._globalPollingId) {
            if (__.ua.webkit && navigator.userAgent.indexOf("Chrome") === -1 && navigator.vendor.indexOf("Apple") !== -1)__.event.on(__.global, "unload", function () {
            });
            this._globalPollingId = setInterval(function () {
                var c = b.getHash();
                if (c !== a) {
                    a = c;
                    b._handleChange()
                }
            }, 50)
        }
    }
});
__.BasicModule.register("disposable", "0.4.0", [], function () {
    __.Disposable = function () {
        __.Disposable._instances[__.getUid(this)] = this
    };
    __.Disposable._instances = {};
    __.Disposable.getUndisposedObjects = function () {
        var a = [];
        __.each(__.Disposable._instances, function (c, b) {
            a.push(__.Disposable._instances[b])
        }, true);
        return a
    };
    __.Disposable.disposeAll = function () {
        __.each(__.Disposable._instances, function (a) {
            a.dispose()
        }, true)
    };
    __.Disposable.prototype._disposed = false;
    __.Disposable.prototype.isDisposed = function () {
        return this._disposed
    };
    __.Disposable.prototype.dispose = function () {
        if (!this._disposed) {
            this._disposed = true;
            this.disposeInternal();
            delete __.Disposable._instances[__.getUid(this)]
        }
    };
    __.Disposable.prototype.disposeInternal = function () {
    }
});
__.BasicModule.register("clientstore", "0.4.0", ["lang"], function () {
    __.exportPath("__.clientStore");
    __.clientStore._inited = false;
    __.clientStore._store = null;
    __.clientStore._searchOrder = ["localStorage", "userData", "globalStorage"];
    __.clientStore._engines = {localStorage: {test: function () {
        return __.global.localStorage ? true : false
    }, init: function () {
        __.clientStore._store = __.global.localStorage
    }, get: function (a) {
        return __.clientStore._store.getItem(a)
    }, set: function (a, b) {
        return __.clientStore._store.setItem(a, b)
    },
        del: function (a) {
            return __.clientStore._store.removeItem(a)
        }}, globalStorage: {test: function () {
        return __.global.globalStorage ? true : false
    }, init: function () {
        __.clientStore._store = __.global.globalStorage[__.doc.domain]
    }, get: function (a) {
        return __.clientStore._store.getItem(a).value
    }, set: function (a, b) {
        return __.clientStore._store.setItem(a, b)
    }, del: function (a) {
        return __.clientStore._store.removeItem(a)
    }}, userData: {test: function () {
        return __.global.ActiveXObject ? true : false
    }, init: function () {
        try {
            __.clientStore._store =
                __.doc.documentElement;
            __.clientStore._store.addBehavior("#default#userdata")
        } catch (a) {
        }
    }, get: function (a) {
        var b;
        try {
            __.clientStore._store.load(a);
            b = __.clientStore._store.getAttribute(a)
        } catch (c) {
            b = ""
        }
        return b
    }, set: function (a, b) {
        try {
            __.clientStore._store.load(a);
            __.clientStore._store.setAttribute(a, b);
            __.clientStore._store.save(a)
        } catch (c) {
        }
    }, del: function (a) {
        try {
            __.clientStore._store.load(a);
            __.clientStore._store.expires = (new Date(315532799E3)).toUTCString();
            __.clientStore._store.save(a)
        } catch (b) {
        }
    }}};
    __.clientStore._init = function () {
        var a;
        __.clientStore._inited = true;
        if (__.lang.find(__.clientStore._searchOrder, function (c) {
            a = __.clientStore._engines[c];
            return a.test()
        }) !== -1)try {
            a.init();
            delete a.test;
            delete a.init;
            __.extend(__.clientStore, a, true)
        } catch (b) {
        }
    };
    __.clientStore.set = function () {
        if (!__.clientStore._inited) {
            __.clientStore._init();
            return __.clientStore.set.apply(__.clientStore, __.lang.a(arguments))
        }
    };
    __.clientStore.get = function () {
        if (!__.clientStore._inited) {
            __.clientStore._init();
            return __.clientStore.get.apply(__.clientStore,
                __.lang.a(arguments))
        }
    };
    __.clientStore.del = function () {
        if (!__.clientStore._inited) {
            __.clientStore._init();
            return __.clientStore.del.apply(__.clientStore, __.lang.a(arguments))
        }
    }
});
__.BasicModule.register("widget", "2.0.0", ["disposable"], function () {
    __.exportPath("__.widget");
    __.widget.Base = function () {
        __.Disposable.call(this);
        this.cssRules && this._addCssRules(this.cssRules)
    };
    __.inherits(__.widget.Base, __.Disposable);
    __.widget.Base.prototype.cssRules = "";
    __.widget.Base.prototype.disposeInternal = function () {
        __.widget.Base._super.disposeInternal.call(this);
        if (this.cssRules) {
            __.dom.remRules(this.cssRules);
            delete this.cssRules
        }
    };
    __.widget.Base.prototype._addCssRules = function (a) {
        this._cssRuleIds =
            __.dom.addRules(a)
    };
    __.widget.Base.prototype._READYSTATE = 1;
    __.widget.Base.prototype._EVENT_READYSTATE_CHANGE = "readystatechange";
    __.widget.Base.prototype._readystate_ = 0;
    __.widget.Base.prototype._changeReadyState = function (a) {
        if (this._readystate_ != a) {
            __.event.fire(this, this._EVENT_READYSTATE_CHANGE, {oldState: this._readystate_, newState: a});
            this._readystate_ = a;
            if (this._readystate_ == this._READYSTATE)this.onReady()
        }
    };
    __.widget.Base.prototype._onReady_ = [];
    __.widget.Base.prototype.onReady = function (a) {
        __.lang.isFunction(a) &&
        this._onReady_.push(a);
        this._readystate_ == this._READYSTATE && __.each(this._onReady_, function (b) {
            b()
        })
    }
});
__.BasicModule.register("jst", "0.4.0", [], function () {
    __.exportPath("__.jst.Template");
    if (typeof Array.prototype.pop != "function")Array.prototype.pop = function () {
        if (this.length !== 0)return this[--this.length]
    };
    if (typeof Array.prototype.push != "function")Array.prototype.push = function () {
        for (var a = 0; a < arguments.length; ++a)this[this.length] = arguments[a];
        return this.length
    };
    __.jst.Template = function (a) {
        this.sourceFunc = __.jst.Template._parse(a);
        this.source = a;
        this.toString = function () {
            return"Template [" + a + "]"
        };
        this._func = __.jst.Template.evalEx(this.sourceFunc)
    };
    __.jst.Template.prototype.process = function (a, c) {
        var b, e = [], h = {write: function (g) {
            e.push(g)
        }}, f = {};
        for (b in a)f[b] = a[b];
        c = c || {};
        f._MODIFIERS_ = f._MODIFIERS_ || {};
        for (b in __.jst.Template.modifierDef)f._MODIFIERS_[b] = f._MODIFIERS_[b] || __.jst.Template.modifierDef[b];
        for (b in this._MODIFIERS_)f._MODIFIERS_[b] = f._MODIFIERS_[b] || this._MODIFIERS_[b];
        try {
            this._func(h, f, c)
        } catch (d) {
            if (c.throwExceptions === true)throw d;
            b = String(e.join(""));
            b.exception = d;
            return b
        }
        return e.join("")
    };
    __.jst.Template.prototype._MODIFIERS_ = {};
    __.jst.Template.prototype.register_modifier = function (a, c) {
        this._MODIFIERS_[a] = c
    };
    __.jst.Template.prototype.unregister_modifier = function (a) {
        delete this._MODIFIERS_[a]
    };
    __.jst.Template.statementTag = "forelse|for|if|elseif|else|var|macro";
    __.jst.Template.statementDef = {"if": {delta: 1, prefix: "if (", suffix: ") {", paramMin: 1}, "else": {delta: 0, prefix: "} else {"}, elseif: {delta: 0, prefix: "} else if (", suffix: ") {", paramDefault: "true"}, "/if": {delta: -1, prefix: "}"}, "for": {delta: 1,
        paramMin: 3, prefixFunc: function (a, c, b) {
            if (a[2] != "in")throw new __.jst.Template.ParseError(b, c.line, "bad for loop statement: " + a.join(" "));
            c = a[1];
            b = "__LIST__" + c;
            return["var ", b, " = ", a[3], ";var __LENGTH_STACK__;if (typeof(__LENGTH_STACK__) == 'undefined' || !__LENGTH_STACK__.length) __LENGTH_STACK__ = new Array();__LENGTH_STACK__[__LENGTH_STACK__.length] = 0;if ((", b, ") != null) { var ", c, "_ct = 0;for (var ", c, "_index in ", b, ") { ", c, "_ct++;if (typeof(", b, "[", c, "_index]) == 'function') {continue;}__LENGTH_STACK__[__LENGTH_STACK__.length - 1]++;var ",
                c, " = ", b, "[", c, "_index];"].join("")
        }}, forelse: {delta: 0, prefix: "} } if (__LENGTH_STACK__[__LENGTH_STACK__.length - 1] == 0) { if (", suffix: ") {", paramDefault: "true"}, "/for": {delta: -1, prefix: "} }; delete __LENGTH_STACK__[__LENGTH_STACK__.length - 1];"}, "var": {delta: 0, prefix: "var ", suffix: ";"}, macro: {delta: 1, prefixFunc: function (a) {
        var c = a[1].split("(")[0];
        return["var ", c, " = function", a.slice(1).join(" ").substring(c.length), "{ var _OUT_arr = []; var _OUT = { write: function(m) { if (m) _OUT_arr.push(m); } }; "].join("")
    }},
        "/macro": {delta: -1, prefix: " return _OUT_arr.join(''); };"}};
    __.jst.Template.modifierDef = {eat: function () {
        return""
    }, escape: function (a) {
        return String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }, capitalize: function (a) {
        return String(a).toUpperCase()
    }, "default": function (a, c) {
        return a != null ? a : c
    }};
    __.jst.Template.modifierDef.h = __.jst.Template.modifierDef.escape;
    __.jst.Template.ParseError = function (a, c, b) {
        this.name = a;
        this.line = c;
        this.message = b
    };
    __.jst.Template.ParseError.prototype.toString =
        function () {
            return" template ParseError in " + this.name + ": line " + this.line + ", " + this.message
        };
    __.jst.Template._parse = function (a, c, b) {
        a = __.jst.Template.cleanWhiteSpace(a);
        for (var e = ["var _Template_TEMP = function(_OUT, _CONTEXT, _FLAGS) { with (_CONTEXT) {"], h = {stack: [], line: 1}, f = -1; f + 1 < a.length;) {
            var d = f;
            for (d = a.indexOf("{", d + 1); d >= 0;) {
                var g = a.indexOf("}", d + 1);
                if (g = a.substring(d, g).match(/^\{(cdata|minify|eval)/)) {
                    g = g[1];
                    var i = d + g.length + 1, j = a.indexOf("}", i);
                    if (j >= 0) {
                        i = j - i <= 0 ? "{/" + g + "}" : a.substring(i +
                            1, j);
                        var k = a.indexOf(i, j + 1);
                        if (k >= 0) {
                            __.jst.Template.emitSectionText(a.substring(f + 1, d), e);
                            f = a.substring(j + 1, k);
                            if (g == "cdata")__.jst.Template.emitText(f, e); else if (g == "minify")__.jst.Template.emitText(__.jst.Template.scrubWhiteSpace(f), e); else g == "eval" && f != null && f.length > 0 && e.push("_OUT.write( (function() { " + f + " })() );");
                            d = f = k + i.length - 1
                        }
                    }
                } else if (a.charAt(d - 1) != "$" && a.charAt(d - 1) != "\\") {
                    g = a.charAt(d + 1) == "/" ? 2 : 1;
                    if (a.substring(d + g, d + 10 + g).search(__.jst.Template.statementTag) == 0)break
                }
                d = a.indexOf("{",
                    d + 1)
            }
            if (d < 0)break;
            g = a.indexOf("}", d + 1);
            if (g < 0)break;
            __.jst.Template.emitSectionText(a.substring(f + 1, d), e);
            __.jst.Template.emitStatement(a.substring(d, g + 1), h, e, c, b);
            f = g
        }
        __.jst.Template.emitSectionText(a.substring(f + 1), e);
        if (h.stack.length !== 0)throw new __.jst.Template.ParseError(c, h.line, "unclosed, unmatched statement(s): " + h.stack.join(","));
        e.push("}}; _Template_TEMP");
        return e.join("")
    };
    __.jst.Template.emitStatement = function (a, c, b, e, h) {
        var f = a.slice(1, -1).split(" "), d = __.jst.Template.statementDef[f[0]];
        if (d == null)__.jst.Template.emitSectionText(a, b); else {
            if (d.delta < 0) {
                if (c.stack.length <= 0)throw new __.jst.Template.ParseError(e, c.line, "close tag does not match any previous statement: " + a);
                c.stack.pop()
            }
            d.delta > 0 && c.stack.push(a);
            if (d.paramMin != null && d.paramMin >= f.length)throw new __.jst.Template.ParseError(e, c.line, "statement needs more parameters: " + a);
            typeof d.prefixFunc == "function" ? b.push(d.prefixFunc(f, c, e, h)) : b.push(d.prefix);
            if (d.suffix != null) {
                if (f.length <= 1)d.paramDefault != null && b.push(d.paramDefault);
                else for (a = 1; a < f.length; a++) {
                    a > 1 && b.push(" ");
                    b.push(f[a])
                }
                b.push(d.suffix)
            }
        }
    };
    __.jst.Template.emitSectionText = function (a, c) {
        var b;
        if (!(a.length <= 0)) {
            for (var e = 0, h = a.length - 1; e < a.length && a.charAt(e) == "\n";)e++;
            for (; h >= 0 && (a.charAt(h) == " " || a.charAt(h) == "\t");)h--;
            if (h < e)h = e;
            if (e > 0) {
                c.push('if (_FLAGS.keepWhitespace == true) _OUT.write("');
                b = a.substring(0, e).replace("\n", "\\n");
                if (b.charAt(b.length - 1) == "\n")b = b.substring(0, b.length - 1);
                c.push(b);
                c.push('");')
            }
            b = a.substring(e, h + 1).split("\n");
            for (e =
                     0; e < b.length; e++) {
                for (var f = b[e], d = c, g = "}", i = -1; i + g.length < f.length;) {
                    var j = "${",k="}", l = f.indexOf(j, i + g.length);
                    if (l < 0)break;
                    if (f.charAt(l + 2) == "%") {
                        j = "${%";
                        k = "%}"
                    }
                    var m = f.indexOf(k, l + j.length);
                    if (m < 0)break;
                    __.jst.Template.emitText(f.substring(i + g.length, l), d);
                    g = f.substring(l + j.length, m).replace(/\|\|/g, "#@@#").split("|");
                    for (var n in g)if (g[n].replace)g[n] = g[n].replace(/#@@#/g, "||");
                    d.push("_OUT.write(");
                    __.jst.Template.emitExpression(g, g.length - 1, d);
                    d.push(");");
                    i = m;
                    g = k
                }
                __.jst.Template.emitText(f.substring(i +
                    g.length), d);
                e < b.length - 1 && c.push('_OUT.write("\\n");\n')
            }
            if (h + 1 < a.length) {
                c.push('if (_FLAGS.keepWhitespace == true) _OUT.write("');
                b = a.substring(h + 1).replace("\n", "\\n");
                if (b.charAt(b.length - 1) == "\n")b = b.substring(0, b.length - 1);
                c.push(b);
                c.push('");')
            }
        }
    };
    __.jst.Template.emitText = function (a, c) {
        if (!(a == null || a.length <= 0)) {
            a = a.replace(/\\/g, "\\\\");
            a = a.replace(/\n/g, "\\n");
            a = a.replace(/"/g, '\\"');
            c.push('_OUT.write("');
            c.push(a);
            c.push('");')
        }
    };
    __.jst.Template.emitExpression = function (a, c, b) {
        var e =
            a[c];
        if (c <= 0)b.push(e); else {
            e = e.split(":");
            b.push('_MODIFIERS_["');
            b.push(e[0]);
            b.push('"](');
            __.jst.Template.emitExpression(a, c - 1, b);
            if (e.length > 1) {
                b.push(",");
                b.push(e[1])
            }
            b.push(")")
        }
    };
    __.jst.Template.cleanWhiteSpace = function (a) {
        a = a.replace(/\t/g, "    ");
        a = a.replace(/\r\n/g, "\n");
        a = a.replace(/\r/g, "\n");
        return a = a.replace(/^(\s*\S*(\s+\S+)*)\s*$/, "$1")
    };
    __.jst.Template.scrubWhiteSpace = function (a) {
        a = a.replace(/^\s+/g, "");
        a = a.replace(/\s+$/g, "");
        a = a.replace(/\s+/g, " ");
        return a = a.replace(/^(\s*\S*(\s+\S+)*)\s*$/,
            "$1")
    };
    __.jst.Template.evalEx = function (a) {
        return eval(a)
    }
});
__.BasicModule.register("fn-boss", "0.4.0", ["disposable"], function () {
    __.FnBoss = function (a, b, c) {
        this.baseUri += b + "&sBiz=" + (c || "") + "&sOp=";
        this.uri2 = "&iSta=0&iTy=" + a + "&iFlow="
    };
    __.inherits(__.FnBoss, __.Disposable);
    __.FnBoss.prototype.baseUri = "http://btrace.qq.com/collect?sIp=&iQQ=";
    __.FnBoss.count = 0;
    __.FnBoss.prototype.imgs = {};
    __.FnBoss.prototype.rand = function (a) {
        return Math.round(Math.random() * a)
    };
    __.FnBoss.prototype._get = function (a, b) {
        return[this.baseUri, a, this.uri2, (new Date).valueOf() % 1E4 * 1E4 + this.rand(9999),
            b ? "&" + b : "", "&iRand=", this.rand(99999999)].join("")
    };
    __.FnBoss.prototype.log = function (a, b, c, e) {
        var g, d, h = [], f;
        if (!__.isDebug())if (a) {
            b = b || {};
            for (f in b)b.hasOwnProperty(f) && h.push(encodeURIComponent(f) + "=" + encodeURIComponent(b[f]));
            g = this._get(a, h.join("&"));
            a = ++__.FnBoss.count;
            if (a >= 100) {
                a = __.FnBoss.count = 1;
                b = {};
                __.FnBoss.prototype.imgs = b
            } else b = this.imgs;
            d = new Image;
            b[a] = d;
            c = c || 500;
            e = e || null;
            d.onload = e;
            d.onerror = e;
            if (c === true || c <= 0)d.src = g; else setTimeout(function () {
                d.src = g
            }, c)
        }
    };
    __.FnBoss.prototype.disposeInternal =
        function () {
            var a = this.imgs;
            __.each(a, function (b, c) {
                delete a[c]
            }, true);
            this.imgs = a = null
        }
});
__.BasicModule.register("fn-table", "2.0.0", ["lang", "dom"], function () {
    __.exportPath("__.fnTable");
    __.fnTable.mapNumMarket = {0: "jj", 1: "sh", 51: "sz", 100: "hk", 200: "us"};
    __.fnTable.findNextEl = function (a) {
        for (; ;) {
            a = a.nextSibling;
            if (!a || a.nodeType === 1)break
        }
        return a
    };
    __.fnTable.getPageUrl = function (a, b) {
        var f = "";
        a = String(a);
        switch (String(b)) {
            case "":
            case "0":
                if (a.length > 5)f = "http://stockhtm.finance.qq.com/fund/djj_jjcx/" + a + ".htm";
                break;
            case "1":
                f = a.substr(0, 3) === "000" ? "http://stockhtm.finance.qq.com/hqing/zhishu/" +
                    a + ".htm" : "http://stockhtm.finance.qq.com/sstock/ggcx/" + a + ".shtml";
                break;
            case "51":
                f = a.substr(0, 2) === "39" ? "http://stockhtm.finance.qq.com/hqing/zhishu/" + a + ".htm" : "http://stockhtm.finance.qq.com/sstock/ggcx/" + a + ".shtml";
                break;
            case "100":
                if (a.length <= 5)f = "http://stockhtm.finance.qq.com/hk/ggcx/" + a + ".htm";
                break;
            case "200":
                if (a.substr(0, 1) === ".")a = a.substr(1);
                f = "http://stockhtm.finance.qq.com/astock/ggcx/" + a.toUpperCase() + ".htm";
                break;
            case "300":
                f = "http://stockhtm.finance.qq.com/if/ggcx/" + a.toUpperCase() +
                    ".shtml";
                break;
            case "350":
                f = "http://stockhtm.finance.qq.com/money/future/quotpage/f/" + a.toUpperCase() + ".htm"
        }
        return f || "http://finance.qq.com/"
    };
    __.fnTable.fill = function (a, b, f, c) {
        var d, e, g, n, j, m, o, i, k;
        c = c || {};
        m = __.lang.isBoolean(c.cloneTr) ? c.cloneTr : true;
        o = __.lang.isInt(c.lineCount) ? c.lineCount : Infinity;
        b = __.dom.f(b);
        if (m) {
            i = b.cloneNode(true);
            i.id = ""
        }
        e = b;
        if (__.lang.isObject(a))a = __.lang.values(a);
        k = [];
        if (__.lang.isString(a))__.each(a.split(","), function (h) {
            var l = __.global["v_" + h];
            k.push(l ? l.split("~") :
                h)
        }); else if (__.lang.isArray(a))__.each(a, function (h) {
            if (__.lang.isString(h))h = (h = __.global["v_" + h] || h) && h.split("~");
            k.push(h)
        }); else return;
        a = k;
        b = 0;
        for (d = a.length; b < d && b < o; b++) {
            n = true;
            if (!__.lang.isObject(a[b]) && (!__.lang.isArray(a[b]) || a[b].length < 2))if (c.showError)a[b] = []; else n = false;
            if (n) {
                if (!e)if (m) {
                    e = i.cloneNode(true);
                    g.parentNode.insertBefore(e, g.nextSibling)
                } else break;
                g = e;
                n = a[b];
                if (b % 2 === 0 && (c.evenTr || c.evenTr === ""))e.style.cssText = c.evenTr; else if (b % 2 === 1 && (c.oddTr || c.oddTr === ""))e.style.cssText =
                    c.oddTr;
                j = g.firstChild;
                j = j.nodeType === 1 ? j : __.fnTable.findNextEl(j);
                for (e = 0; j;) {
                    j.innerHTML = __.fnTable.process(f[e], n, e, j, b);
                    j = __.fnTable.findNextEl(j);
                    e++
                }
                e = __.fnTable.findNextEl(g)
            }
        }
    };
    __.fnTable.clear = function (a) {
        var b, f, c;
        if (a) {
            if (a.tagName === "TABLE")a = a.getElementsByTagName("tr")[0];
            for (f = a; f;) {
                b = f;
                f = __.fnTable.findNextEl(b);
                if (b !== a)__.dom.remEl(b); else {
                    b = b.firstChild;
                    b = b.nodeType === 1 ? b : __.fnTable.findNextEl(b);
                    for (c = 0; b;) {
                        b.innerHTML = "";
                        b = __.fnTable.findNextEl(b);
                        c++
                    }
                }
            }
        }
    };
    __.fnTable.fastFill =
        function (a, b, f, c) {
            var d, e, g, n, j, m, o, i, k, h = [];
            g = false;
            c = c || {};
            __.lang.isUndefined(c.cloneTr);
            o = __.lang.isUndefined(c.lineCount) ? Infinity : c.lineCount;
            k = __.lang.isUndefined(c.trProcessor) ? false : c.trProcessor;
            d = b.parentNode.innerHTML.toLowerCase();
            d = d.substring(d.indexOf("<tr"), d.indexOf("</tr>") + 5);
            j = [];
            i = d.indexOf("<td");
            e = d.indexOf("<th");
            if (e < i && e > -1) {
                i = e;
                g = true
            }
            for (j.push(d.substr(0, i)); i >= 0;) {
                d = d.substr(i);
                i = d.indexOf(">");
                j.push(d.substr(0, i + 1));
                i = d.indexOf(g ? "</th>" : "</td>");
                if (i === -1)break;
                d =
                    d.substr(i + 5);
                i = d.indexOf("<td");
                e = d.indexOf("<th");
                if (e > -1 && (e < i || i === -1)) {
                    i = e;
                    g = true
                } else g = false
            }
            if (__.lang.isObject(a))a = __.lang.values(a);
            i = [];
            if (__.lang.isString(a))__.each(a.split(","), function (l) {
                var p = __.global["v_" + l];
                i.push(p ? p.split("~") : l)
            }); else if (__.lang.isArray(a))__.each(a, function (l) {
                if (__.lang.isString(l))l = (l = __.global["v_" + l] || l) && l.split("~");
                i.push(l)
            }); else return;
            a = i;
            d = 0;
            for (e = a.length; d < e && d < o; d++) {
                g = true;
                if (!__.lang.isArray(a[d]) || a[d].length < 2)if (c.showError)a[d] = []; else g =
                    false;
                if (g) {
                    m = a[d];
                    g = 0;
                    for (n = j.length; g < n; ++g)if (g === 0)h.push(k ? k(d) : j[g]); else {
                        h.push(j[g]);
                        i = __.fnTable.process(f[g - 1], m, g - 1, void 0, d);
                        h.push((i === void 0 ? "" : i) + "</td>")
                    }
                }
            }
            b.parentNode.parentNode.parentNode.innerHTML = "<table><tbody>" + h.join("") + "</tbody></table>";
            f = b = null
        };
    __.fnTable.process = function (a, b, f, c, d) {
        var e;
        if (b.length === 1) {
            e = "--";
            if (__.lang.isFunction(a))try {
                e = a(b, f, c, d)
            } catch (g) {
            } else if (__.lang.isString(a) && !__.lang.isFunction(__.fnTable.processors[a]))e = a
        } else {
            e = __.lang.isFunction(a) ?
                a(b, f, c, d) : __.lang.isFunction(__.fnTable.processors[a]) ? __.fnTable.processors[a](b, f, c) : !__.lang.isUndefined(b[a]) ? b[a] : __.lang.isString(a) ? a : b[f];
            if (e === "" || e === void 0 || e === null)e = "--"
        }
        return e
    };
    __.fnTable.processors = {R_PRICE: function (a, b) {
        return __.fnTable.processors.GET_COLOR(a[3], a[2], b)
    }, S_PRICE: function (a, b) {
        return __.fnTable.processors.GET_COLOR(a[3], a[4], b)
    }, L_PRICE: function (a, b) {
        return __.fnTable.processors.GET_COLOR(a[3], a[32], b)
    }, L_CHANGE: function (a) {
        return __.fnTable.processors.GET_SIGNED_COLOR(a[31],
            a[31])
    }, S_PERCENT: function (a) {
        return __.fnTable.processors.GET_PERCENT(a[5])
    }, L_PERCENT: function (a) {
        return __.fnTable.processors.GET_PERCENT(a[32])
    }, TITLE: function (a) {
        return __.fnTable.processors.GET_TITLE(a[2], a[0], a[1], false, "_blank")
    }, GET_COLOR: function (a, b, f) {
        return b > 0 ? '<span style="color:#fe0002">' + a + "</span>" : b < 0 ? '<span style="color:#009900">' + a + "</span>" : f !== false ? '<span style="color:#000">' + a + "</span>" : a
    }, GET_SIGNED_COLOR: function (a, b, f) {
        return __.fnTable.processors.GET_COLOR((b > 0 ? "+" : "") +
            a, b, f)
    }, GET_PERCENT: function (a, b) {
        return __.lang.isNumber(Number(a)) && a !== "" && a !== "-" ? __.fnTable.processors.GET_COLOR((a > 0 ? "+" : "") + a + "%", a, b) : "--"
    }, GET_TITLE: function (a, b, f, c, d) {
        var e, g;
        f = f.replace(__.lang.getReg("[\\s\u3000]*", "ig"), "");
        c = c ? Math.ceil(c / 2) * 2 : 8;
        d = d || "";
        e = c / 2;
        g = f;
        if (f.length > e) {
            for (g = 0; g < c; g++)f.charCodeAt(g) > 255 && c > e && c--;
            g = f.substring(0, c)
        }
        return'<a href="' + __.fnTable.getPageUrl(a, b) + '" title="' + f + "(" + a + ')"' + (d ? ' target="' + d + '"' : "") + ">" + g + "</a>"
    }};
    __.fnTable.sort = function (a, b, f, c) {
        var d =
            __.dom.f(a), e = __.dom.$("tr", d), g = [], n = __.lang.getReg("^\\s+$"), j = {}, m, o = null, i = function (k) {
            k = k.cloneNode(true);
            var h = [];
            if (k && k.nodeType === __.lang.NODE_TYPE.TEXT_NODE)n.test(k.nodeValue) || h.push(k.nodeValue); else k && k.nodeType === __.lang.NODE_TYPE.ELEMENT_NODE && k.hasChildNodes() && __.each(k.childNodes, function (l) {
                h.push(i(l))
            });
            return h.join("")
        };
        f = f === false ? false : true;
        __.each(e, function (k, h) {
            var l;
            if (c)g[h] = c[h]; else {
                l = i(k.childNodes[b]).replace("%", "");
                l = parseFloat(l);
                g[h] = isNaN(l) ? 0 : l
            }
            if (j[g[h]])j[g[h]].push(h);
            else j[g[h]] = [h];
            __.dom.addClass(k, "du-table-sort-" + h)
        });
        __.each(g.sort(f ? __.lang.OPER["-"] : __.lang.OPER["-2"]), function (k) {
            try {
                var h = "du-table-sort-" + j[k].pop();
                m = __.dom.f("." + h, d);
                o ? __.dom.insertAfter(m, o) : __.dom.insertBefore(m, e[0].parentNode.firstChild);
                __.dom.remClass(m, h);
                o = m
            } catch (l) {
            }
        })
    };
    __.fnTable.load = function (a, b) {
        var f = "http://qt.gtimg.cn/r=" + Math.random() + "q=";
        a = __.lang.isArray(a) ? a.join(",") : a;
        __.load(f + a, b, {charset: "gbk", cache: true})
    };
    __.fnTable.pFill = function (a, b, f) {
        var c, d;
        __.lang.isString(a) &&
        __.each(a.split(","), function (e) {
            if (__.global["v_" + e])if (__.lang.isString(a))a = [__.global["v_" + e]]; else a.push(__.global["v_" + e])
        });
        __.each(a, function (e, g) {
            e = e.split("~");
            __.each(f, function (n, j) {
                if (c = __.dom.f([b, g, j].join("-"))) {
                    try {
                        d = __.fnTable.process(n, e, j, c)
                    } catch (m) {
                        d = "--"
                    }
                    c.innerHTML = d
                }
            })
        })
    };
    __.fnTable.getFloatByLength = function (a, b) {
        var f, c, d = parseFloat(a);
        a = String(a);
        f = a.length;
        c = a.indexOf(".");
        return f <= b ? a : c <= 0 || c >= b ? d.toFixed(0) : d.toFixed(b - c - 1)
    }
});
__.BasicModule.register("fn-cronloader", "2.0.0", ["lang", "dom", "fn-table", "clientstore"], function () {
    __.FnCronLoader = function (a) {
        a = a || {};
        if (a.pushBases)__.FnCronLoader.pushBases = a.pushBases;
        if (a.pushDummy)__.FnCronLoader.pushDummy = a.pushDummy;
        this._maxCount = a.max || 172800;
        this._autoCache = a.autoCache === true ? true : false;
        this._idIntv = null;
        this.stop()
    };
    __.FnCronLoader.version = "2.0.0";
    __.FnCronLoader.QT_LIMIT = 60;
    __.FnCronLoader.PUSH_LIMIT = 60;
    __.FnCronLoader.NO_MATCH = "pv_none_match";
    __.FnCronLoader.TIME_OUT =
        "pv_timeout";
    __.FnCronLoader.defaultInterval = 5;
    __.FnCronLoader.pushDummy = "./pushiframe.html";
    __.FnCronLoader.pushBases = ["http://push1.gtimg.cn/q=", "http://push2.gtimg.cn/q=", "http://push3.gtimg.cn/q="];
    __.FnCronLoader._pushInited = false;
    __.FnCronLoader._pushIfrCtn = null;
    __.FnCronLoader._aIframes = [];
    __.FnCronLoader.prototype._jobUidIdx = 0;
    __.FnCronLoader.prototype._fastCount = 0;
    __.FnCronLoader.prototype._defSendDelay = 100;
    __.FnCronLoader.prototype.pushSessions = [];
    __.FnCronLoader._initPush = function () {
        this._pushInited =
            true;
        this._pushIfrCtn = __.dom.addEl({css: "position:absolute;visibility:hidden;top:0;left:0;height:0;width:0;"}, __.doc.body)
    };
    __.FnCronLoader._createIfr = function () {
        var a = __.dom.addEl({tag: "iframe", id: "du-push-ifr" + this._aIframes.length, css: "height:0;width:0;border:0;"}, this._pushIfrCtn);
        this._aIframes.push(a);
        return a
    };
    __.FnCronLoader._getIframe = function (a) {
        var d, b = this._aIframes;
        d = __.lang.findByAttr(b, "className", "");
        d = d === -1 ? this._createIfr() : b[d];
        if (a || !d.src)d.src = this._getDummySrc();
        d.className =
            "active";
        return d
    };
    __.FnCronLoader._getDummySrc = function () {
        return this.pushDummy + "?_u=" + new Date % 1E5 + Math.random()
    };
    __.FnCronLoader._purgeIframe = function (a, d) {
        if (a) {
            a.className = "";
            if (d) {
                if (a.contentWindow)a.contentWindow.__ = null;
                a.src = this._getDummySrc()
            }
        }
    };
    __.FnCronLoader.setCache = function (a) {
        var d = +new Date;
        __.each(a, function (b, c) {
            __.clientStore.set("du-cl~" + c, d + "~" + b)
        }, true)
    };
    __.FnCronLoader.getCache = function (a, d) {
        var b, c, f, g = {};
        d = parseInt(d, 10);
        if (!__.lang.isInt(d) || d < 0)d = 0;
        b = +new Date;
        __.each(a,
            function (e) {
                f = null;
                if (c = __.clientStore.get("du-cl~" + e)) {
                    c = c.split("~");
                    if (d === 0 || b - c[0] <= d) {
                        c.shift();
                        f = c.join("~")
                    }
                }
                g[e] = f
            });
        return g
    };
    __.FnCronLoader.prototype._getPushBase = function () {
        var a = __.FnCronLoader.pushBases.length, d = parseInt(__.clientStore.get("du_push_id"), 10);
        a = __.lang.isInt(d) ? (d + 1) % a : __.lang.rand(a);
        __.clientStore.set("du_push_id", String(a));
        return __.FnCronLoader.pushBases[a]
    };
    __.FnCronLoader.prototype.getJobById = function (a, d) {
        var b, c;
        if (d === true) {
            b = this.jobs[0];
            c = __.lang.isArray(b) ?
                __.lang.findByAttr(b, "id", a) : -1;
            if (c === -1)return null
        } else {
            b = this.jobs[a.split("-")[1]];
            c = __.lang.isArray(b) ? __.lang.findByAttr(b, "id", a) : -1;
            if (c === -1)return this.getJobById(a, true)
        }
        return b[c]
    };
    __.FnCronLoader.prototype._doPolling = function (a) {
        var d = this, b = [], c, f = true, g = this.pollingCount, e = [], j = [], l = [], m = {}, k = function () {
            if (b.length > 0) {
                c = b.splice(__.FnCronLoader.QT_LIMIT, b.length);
                __.fnTable.load(b.join(","), k);
                b = c
            } else {
                __.each(e, function (h) {
                    var i;
                    i = __.global["v_" + h];
                    if (i !== void 0 && i !== null)m[h] = i
                });
                d._onDataLoaded(m, l)
            }
        };
        a ? __.each(this.jobs[a.split("-")[1]], function (h) {
            var i;
            if (h.id === a) {
                i = h.judge(0);
                if (h && (i & 1) === 1 && h.keys) {
                    f = false;
                    e = e.concat(h.keys)
                }
                (i & 2) === 2 && l.push(a)
            }
        }) : __.each(this.jobs, function (h, i) {
            i > 0 && g % i === 0 && __.each(h, function (n) {
                var o;
                o = n.judge(g);
                if ((o & 1) === 1 && n.keys) {
                    f = false;
                    e = e.concat(n.keys)
                }
                (o & 2) === 2 && l.push(n.id)
            })
        }, true);
        if (!f || j.length > 0)if (e.length === 0)k(); else {
            e = __.lang.unique(e);
            b = e.slice(0);
            c = b.splice(__.FnCronLoader.QT_LIMIT, b.length);
            __.fnTable.load(b.join(","), k);
            b = c
        }
    };
    __.FnCronLoader.prototype._consumePushJob = function () {
        var a, d, b = [], c = __.FnCronLoader.PUSH_LIMIT, f, g;
        for (__.each(this.jobs[0], function (e) {
            __.lang.isUndefined(e.sessionId) && b.push(e.id)
        }); b.length;) {
            a = [];
            for (d = []; b.length;) {
                g = this.getJobById(b[0], true);
                if (g.keys.length >= c) {
                    if (a.length)break;
                    f || (f = __.lang.a(g.keys));
                    d.push(g.id);
                    if (f.length > c) {
                        a = f.splice(0, c);
                        break
                    } else {
                        a = f;
                        f = null;
                        b.shift()
                    }
                } else if (g.keys.length + a.length <= c) {
                    b.shift();
                    a = a.concat(g.keys);
                    d.push(g.id)
                } else break
            }
            this._updateSession(this._assignSession(a,
                d))
        }
    };
    __.FnCronLoader.prototype._assignSession = function (a, d) {
        var b, c, f, g = this;
        b = __.lang.find(this.pushSessions, function (e) {
            c = [];
            c = __.lang.unique(c.concat(e.keys).concat(a));
            return c.length <= __.FnCronLoader.PUSH_LIMIT
        });
        if (b === -1) {
            b = this.pushSessions.length;
            this.pushSessions.push({keys: a, ids: d, id: b})
        } else {
            f = this.pushSessions[b];
            f.ids = f.ids.concat(d);
            f.keys = c
        }
        __.each(d, function (e) {
            e = g.getJobById(e);
            if (e.sessionId)e.sessionId.push(b); else e.sessionId = [b]
        });
        return b
    };
    __.FnCronLoader.prototype._updateSession =
        function (a, d) {
            var b, c, f;
            f = this.jobs[0];
            c = this.pushSessions[a];
            if (d) {
                b = [];
                __.each(c.ids, function (g) {
                    b.push(f[g].keys)
                });
                b = __.lang.unique(b);
                c.keys = b
            } else b = c.keys;
            c.running = true;
            c.iframe = null;
            c.url = this._getPushBase() + b.join(",") + "&m=push&r=" + +new Date % 1E5 + __.lang.rand(1E4);
            this._sendPushReq(a)
        };
    __.FnCronLoader.prototype._sendPushReq = function (a) {
        var d, b, c = this, f = __.FnCronLoader.NO_MATCH, g = __.FnCronLoader.TIME_OUT;
        b = this.pushSessions[a];
        if (!(this._paused || !b || !b.running || this.pushCount > this._maxCount)) {
            if (__.ua.webkit) {
                d =
                    b.iframe;
                delete b.iframe
            }
            if (!b.iframe)b.iframe = __.FnCronLoader._getIframe();
            b.pushCount = ++this.pushCount;
            __.lang.toCall(function () {
                var e = b.iframe.contentWindow, j, l;
                if (!e || !e.__) {
                    c._paused || c._delayPushReq(a);
                    c = b = e = null
                } else {
                    j = +new Date;
                    e.reqCount = b.pushCount;
                    l = e.__;
                    l.load(b.url, function () {
                        var m = {}, k;
                        if (!(c._paused || !b || !b.running))if (e[f] === 1) {
                            e[f] = 0;
                            throw Error("No data for:" + b.keys.join(","));
                        } else if (e[g] === 1) {
                            e[g] = 0;
                            c._delayPushReq(a)
                        } else if (e.reqCount === b.pushCount) {
                            if (new Date - j < 1E3)c._fastCount++;
                            else c._fastCount = 0;
                            __.each(b.keys, function (h) {
                                k = "pv_" + h;
                                if (e[k] !== void 0 && e[k] !== null) {
                                    m[h] = e[k];
                                    e[k] = void 0
                                }
                            });
                            c._onDataLoaded(m, b.ids, b.id);
                            c._delayPushReq(a);
                            c = b = m = l = e = null
                        }
                    }, {charset: "gbk", cache: true});
                    if (d) {
                        __.FnCronLoader._purgeIframe(d, true);
                        d = null
                    }
                }
            }, function () {
                var e;
                try {
                    e = b.iframe.contentWindow && b.iframe.contentWindow.__
                } catch (j) {
                }
                return!!e
            }, 100)
        }
    };
    __.FnCronLoader.prototype._delayPushReq = function (a) {
        var d = this, b = this._defSendDelay;
        b *= Math.pow(2, Math.floor(this._fastCount / 2));
        try {
            setTimeout(function () {
                    d._sendPushReq(a)
                },
                b)
        } catch (c) {
        }
    };
    __.FnCronLoader.prototype._onDataLoaded = function (a, d, b) {
        var c, f, g = this, e = __.lang.isInt(b);
        f = e ? g.pushCount : g.pollingCount;
        this._autoCache && __.FnCronLoader.setCache(a);
        __.each(d, function (j) {
            if (c = g.getJobById(j, e))if (c && c.onData)if (!c.__created || e && !c.__created[b]) {
                c.onData(a, f);
                if (e)c.__created[b] = true; else c.__created = true;
                c.runOnce && g.remJob(c.id)
            } else if (c.onUpdate)c.onUpdate(a, f); else c.onData(a, f)
        })
    };
    __.FnCronLoader.prototype._addPolling = function (a) {
        var d = a && a.judge, b, c = this;
        if (__.lang.isUndefined(a.judge)) {
            d =
                a.interval;
            a.judge = d
        }
        if (d && __.lang.isInt(a.judge) && d > 0)a.judge = function (f) {
            if (f % d === 0)return 3;
            return 0
        };
        b = parseInt(a.interval, 10);
        this.jobs[b] || (this.jobs[b] = []);
        this.jobs[b].push(a);
        a.noWait && setTimeout(function () {
            c._doPolling(a.id)
        }, 0)
    };
    __.FnCronLoader.prototype._addPush = function (a) {
        this.jobs[0] || (this.jobs[0] = []);
        a.__created = [];
        this.jobs[0].push(a);
        this._paused || this._consumePushJob()
    };
    __.FnCronLoader.prototype._remPushJob = function (a) {
        var d, b, c, f;
        d = false;
        var g = this;
        if (this.jobs[0]) {
            b = __.lang.findByAttr(this.jobs[0],
                "id", a);
            if (b > -1) {
                d = this.jobs[0][b];
                __.lang.arrayRemove(this.jobs[0], b);
                __.lang.isArray(d.sessionId) && __.each(d.sessionId, function (e) {
                    c = g.pushSessions[e];
                    f = __.lang.find(c.ids, function (j) {
                        return j === a
                    });
                    if (f > -1) {
                        __.lang.arrayRemove(c.ids, f);
                        if (c.ids.length === 0) {
                            c.running = false;
                            c.keys = [];
                            __.FnCronLoader._purgeIframe(c.iframe)
                        } else g._updateSession(e, true)
                    }
                });
                delete d.onData;
                delete d.onUpdate;
                d = true
            }
        }
        return d
    };
    __.FnCronLoader.prototype.isPushUsable = function () {
        return true
    };
    __.FnCronLoader.prototype.addJob =
        function (a) {
            var d;
            if (a.keys) {
                if (__.lang.isString(a.keys))a.keys = a.keys.split(",");
                a.keys = __.lang.unique(a.keys)
            }
            if (__.lang.isUndefined(a.interval))a.interval = __.FnCronLoader.defaultInterval;
            d = ++this._jobUidIdx;
            a.id = d + "-" + a.interval;
            if (a.type === 2 || !this.isPushUsable() || !a.keys || a.keys.length === 0)this._addPolling(a); else {
                __.FnCronLoader._pushInited || __.FnCronLoader._initPush();
                this._addPush(a)
            }
            return a.id
        };
    __.FnCronLoader.prototype.remJob = function (a) {
        var d, b;
        b = false;
        d = a.split("-")[1];
        if (this.jobs[d]) {
            b =
                __.lang.findByAttr(this.jobs[d], "id", a);
            if (b > -1) {
                __.lang.arrayRemove(this.jobs[d], b);
                b = true
            } else b = this._remPushJob(a)
        }
        return b
    };
    __.FnCronLoader.prototype.start = function () {
        if (this.pollingCount === -1) {
            this._paused = false;
            this.pollingCount++;
            this._doPolling();
            this._consumePushJob()
        }
        this.resume()
    };
    __.FnCronLoader.prototype.pause = function () {
        if (this._idIntv !== null) {
            clearInterval(this._idIntv);
            this._idIntv = null
        }
        this._paused = true
    };
    __.FnCronLoader.prototype.resume = function () {
        var a = this;
        if (this._idIntv === null)this._idIntv =
            setInterval(function () {
                a.pollingCount++;
                a._doPolling()
            }, 1E3);
        this._paused = false
    };
    __.FnCronLoader.prototype.stop = function () {
        this.pause();
        this.jobs = {};
        this.pushCount = this.pollingCount = -1;
        this._jobUidIdx = 0;
        __.dom.remEl(this._aIframes)
    }
});
__.BasicModule.register("compat", "0.0.0", ["dom", "event", "lang", "selector", "cookie", "fn-table"], function () {
    __.load = function () {
        var a = __.load;
        return function (d, b, c) {
            b = b || {};
            if (typeof b === "function") {
                c = c || {};
                c.onSuccess = b;
                b = c
            }
            b.charset = b.charset || "gbk";
            a(d, b)
        }
    }();
    __.Dom = __.dom;
    __.Event = __.event;
    __.onReady = __.event.onReady;
    __.Lang = __.lang;
    __.Lang.e = __.lang.each;
    __.Lang.getMergedObj = __.lang.mergeObj;
    __.Lang.objExtend = __.extend;
    __.log = __.lang.log;
    __.Selector = __.selector;
    __.Cookie = __.cookie;
    __.config = {doc: __.doc,
        win: __.global, ua: __.ua};
    __.Table = __.fnTable;
    __.Table.MAP_STOCKTYPE = __.fnTable.mapNumMarket;
    __.Table._getUrlByType = __.fnTable.getPageUrl;
    __.Class = function () {
        var a, d = false, b = __.lang.getReg("xyz").test(function () {
        }) ? __.lang.getReg("\\b_super\\b") : __.lang.getReg(".*");
        a = function () {
        };
        a.extend = function (c) {
            function e() {
                !d && this.init && this.init.apply(this, arguments)
            }

            var g = this.prototype, h, i, f;
            d = true;
            h = new this;
            d = false;
            i = function (k, l) {
                return function () {
                    var m = this._super, j;
                    this._super = g[k];
                    j = l.apply(this, arguments);
                    this._super = m;
                    return j
                }
            };
            for (f in c)if (c.hasOwnProperty(f))h[f] = typeof c[f] === "function" && typeof g[f] === "function" && b.test(c[f]) ? i(f, c[f]) : c[f];
            e.prototype = h;
            e.constructor = e;
            e.extend = arguments.callee;
            return e
        };
        return a
    }();
    __.CronLoader = function () {
        this._cron = new __.FnCronLoader;
        this.jobs = this._cron.jobs;
        this.count = 0
    };
    __.CronLoader.prototype.start = function () {
        this._cron.start();
        this.count = this._cron.pollingCount
    };
    __.CronLoader.prototype.stop = function () {
        this._cron.stop()
    };
    __.CronLoader.prototype.pause =
        function () {
            this._cron.pause()
        };
    __.CronLoader.prototype.resume = function () {
        this._cron.resume()
    };
    __.CronLoader.prototype._run = function (a) {
        this._cron._doPolling(a)
    };
    __.CronLoader.prototype.subscribe = function (a) {
        var d = this;
        return this._cron.addJob({type: 2, keys: a.qtName && a.qtName.split(",") || [], judge: typeof a.judge == "function" ? function (b) {
            d.count = d._cron.pollingCount;
            this.qtName = this.qtName || this.keys.join(",");
            b = a.judge.call(this, b);
            this.keys = this.qtName.split(",");
            return b
        } : function (b) {
            d.count = d._cron.pollingCount;
            this.qtName = this.qtName || this.keys.join(",");
            this.keys = this.qtName.split(",");
            return b % (a.judge || a.interval) == 0 ? 3 : 0
        }, interval: a.interval, runOnce: a.runOnce, noWait: a.noWait, onData: function (b, c) {
            __.each(b, function (e, g) {
                __.global["v_" + g] = e
            }, true);
            a.onOk.call(this, c)
        }, onUpdate: function (b, c) {
            __.each(b, function (e, g) {
                __.global["v_" + g] = e
            }, true);
            a.onOk.call(this, c)
        }})
    };
    __.CronLoader.prototype.unsubscribe = function (a) {
        this._cron.remJob(a)
    };
    __.BasicModule.register("fn-base", "0.0.0", ["dom", "event", "lang", "selector",
        "cookie", "fn-table"], function () {
    });
    __.BasicModule.add("fn-dataproxy", {fullPath: "http://mat1.gtimg.com/finance/st/g/fn-dataproxy/fn-dataproxy_1.3.js"});
    __.BasicModule.add("fn-pushloader", {fullPath: "http://mat1.gtimg.com/finance/st/g/fn-pushloader/fn-pushloader_1.0h.js"});
    __.BasicModule.add("fn-pricebox", {fullPath: "http://mat1.gtimg.com/finance/st/g/fn-pricebox/fn-pricebox_1.9.js"});
    __.BasicModule.add("fn-msgpopup", {fullPath: "http://mat1.gtimg.com/finance/st/g/fn-msgpopup/fn-msgpopup_1.1.js"});
    __.BasicModule.add("stock-diy",
        {fullPath: "http://mat1.gtimg.com/finance/st/p/stock-diy/stock-diy_1.38.js"});
    __.BasicModule.add("stock-diyb", {fullPath: "http://mat1.gtimg.com/finance/st/p/stock-diy/stock-diy_1.39a.js"});
    __.BasicModule.add("stock-diyc", {fullPath: "http://mat1.gtimg.com/finance/st/p/stock-diy/stock-diy_1.37.js"})
});
__.BasicModule.register("data", "0.4.0", [], function () {
    __.exportPath("__.data");
    __.data.Quote = function (a) {
        if (!this instanceof __.data.Quote)return new __.data.Quote(a);
        this.data = a.split("~");
        this.isLong = this.data.length > 48;
        this.MARKET = this.data[0];
        this.CODE = this.data[2];
        this.NAME = this.data[1];
        this.PRICE = this.data[3];
        if (this.isLong) {
            this.VOLUME = this.data[36];
            this.AMOUNT = this.data[37];
            this.CHANGE = this.data[31];
            this.PRECENT = this.data[32];
            this.STATUS = this.data[40]
        } else {
            this.VOLUME = this.data[6];
            this.AMOUNT =
                this.data[7];
            this.CHANGE = this.data[4];
            this.PRECENT = this.data[5];
            this.STATUS = this.data[8]
        }
    }
});
__.BasicModule.register("jslog", "0.4.0", ["lang", "cookie", "fn-boss", "event"], function () {
    __.set("__.jslog");
    __.jslog.getEnv = function () {
        var a = {}, e = __.global, b = e.navigator, c = new Date;
        try {
            var d = b && b.userAgent;
            if (d) {
                var f = "", g = "";
                if (d.indexOf("MSIE") > 0) {
                    f = "ie";
                    g = d.match(/MSIE (\d+(\.\d+)?)/)[1]
                } else if (d.indexOf("KHTML") > 0)if (d.indexOf("Chrome") > 0) {
                    f = "chrome";
                    g = d.match(/Chrome\/(\d+(\.\d+)*)/)[1]
                } else if (d.indexOf("Safari") > -1 && d.match(/Version(\/)(\d+(\.\d+)?)/)) {
                    f = "safari";
                    g = d.match(/Version(\/)(\d+(\.\d+)?)/)[2]
                } else {
                    f =
                        "webkit";
                    g = d.match(/WebKit\/(\d+(\.\d+)?)/)[1]
                } else if (d.indexOf("Gecko") > -1)if (b.vendor == "Netscape") {
                    f = "netscape";
                    g = d.match(/Netscape(\s|\/)(\d+(\.\d+)?)/)[2]
                } else if (d.indexOf("Firefox") > 0) {
                    f = "firefox";
                    g = d.match(/Firefox(\s|\/)(\d+(\.\d+)?)/)[2]
                } else {
                    if (b.product == "Gecko") {
                        f = "mozilla";
                        g = d.match(/rv(\:)(\d+(\.\d+)?)/)[2]
                    }
                } else if (typeof e.opera == "object") {
                    f = "opera";
                    g = d.match(/Opera(\s|\/)(\d+(\.\d+)?)/)[2]
                }
                a.br = f;
                a.vr = g
            }
            if (e.screen) {
                a.scr = screen.width + "x" + screen.height;
                a.scl = screen.colorDepth + "-bit"
            }
            if (b.language)a.lang =
                b.language.toLowerCase(); else if (b.browserLanguage)a.lang = b.browserLanguage.toLowerCase();
            a.java = b.javaEnabled() ? 1 : 0;
            a.cpuc = b.cpuClass;
            a.pf = b.platform;
            a.tz = c.getTimezoneOffset() / 60
        } catch (h) {
        } finally {
            return a
        }
    };
    __.jslog.getFlash = function () {
        var a = false;
        try {
            var e = navigator.plugins, b = e.length;
            if (e && b)for (var c = 0; c < b; c++) {
                if (e[c].name.indexOf("Shockwave Flash") != -1) {
                    a = e[c].description.split("Shockwave Flash ")[1];
                    break
                }
            } else if (window.ActiveXObject)for (c = 10; c >= 2; c--)try {
                if (eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." +
                    c + "');")) {
                    a = c + ".0";
                    break
                }
            } catch (d) {
            }
        } catch (f) {
        }
        return a
    };
    __.jslog.getEnvEx = function () {
        var a = {};
        try {
            a.flash = this.getFlash();
            var e = location.href, b = false;
            if (__.doc.body.addBehavior && __.doc.body.isHomePage) {
                __.doc.body.addBehavior("#default#homePage");
                b = __.doc.body.isHomePage(e) ? true : false
            }
            a.hp = b;
            e = null;
            if (__.doc.body.addBehavior) {
                __.doc.body.addBehavior("#default#clientCaps");
                e = __.doc.body.connectionType
            }
            a.ct = e
        } catch (c) {
        } finally {
            return a
        }
    };
    __.jslog.boss = new __.FnBoss(1230, (__.cookie.get("uin") || __.cookie.get("luin")).replace(/o0*/,
        ""), "");
    __.jslog.ifboss = new __.FnBoss(1212, (__.cookie.get("uin") || __.cookie.get("luin")).replace(/o0*/, ""), "");
    __.jslog._envstr = function () {
        var a = [];
        __.each(__.jslog.getEnv(), function (e, b) {
            a.push(b + "=" + e)
        }, true);
        __.each(__.jslog.getEnvEx(), function (e, b) {
            a.push(b + "=" + e)
        }, true);
        return a.join("&")
    }();
    __.jslog.stack = function (a) {
        var e = "other";
        if (a.arguments && a.stack)e = "chrome"; else if (a.message && typeof window !== "undefined" && window.opera)e = a.stacktrace ? "opera10" : "opera"; else if (a.stack)e = "firefox";
        return __.jslog.stack[e](a)
    };
    __.jslog.stack.chrome = function (a) {
        a = (a.stack + "\n").replace(/^\S[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^([^\(]+?)([\n$])/gm, "{anonymous}()@$1$2").replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, "{anonymous}()@$1").split("\n");
        a.pop();
        return a
    };
    __.jslog.stack.firefox = function (a) {
        return a.stack.replace(/(?:\n@:0)?\s+$/m, "").replace(/^\(/gm, "{anonymous}(").split("\n")
    };
    __.jslog.stack.opera10 = function (a) {
        a = a.stacktrace.split("\n");
        var e = /.*line (\d+), column (\d+) in ((<anonymous function\:?\s*(\S+))|([^\(]+)\([^\)]*\))(?: in )?(.*)\s*$/i,
            b, c, d;
        b = 2;
        c = 0;
        for (d = a.length; b < d - 2; b++)if (e.test(a[b])) {
            var f = RegExp.$6 + ":" + RegExp.$1 + ":" + RegExp.$2, g = RegExp.$3;
            g = g.replace(/<anonymous function\:?\s?(\S+)?>/g, "{anonymous}");
            a[c++] = g + "@" + f
        }
        a.splice(c, a.length - c);
        return a
    };
    __.jslog.stack.opera = function (a) {
        a = a.message.split("\n");
        var e = /Line\s+(\d+).*script\s+(http\S+)(?:.*in\s+function\s+(\S+))?/i, b, c, d;
        b = 4;
        c = 0;
        for (d = a.length; b < d; b += 2)if (e.test(a[b]))a[c++] = (RegExp.$3 ? RegExp.$3 + "()@" + RegExp.$2 + RegExp.$1 : "{anonymous}()@" + RegExp.$2 + ":" + RegExp.$1) + " -- " +
            a[b + 1].replace(/^\s+/, "");
        a.splice(c, a.length - c);
        return a
    };
    __.jslog.stack.other = function (a) {
        for (var e = __.jslog.stack, b = /function\s*([\w\-$]+)?\s*\(/i, c = [], d, f; a && c.length < 10;) {
            d = b.test(a.toString()) ? RegExp.$1 || "{anonymous}" : "{anonymous}";
            f = Array.prototype.slice.call(a.arguments || []);
            c[c.length] = d + "(" + e.stringifyArguments(f) + ")";
            a = a.caller
        }
        return c
    };
    __.jslog.stack.stringifyArguments = function (a) {
        for (var e = Array.prototype.slice, b = __.jslog.stack, c = 0; c < a.length; ++c) {
            var d = a[c];
            if (d === undefined)a[c] = "undefined";
            else if (d === null)a[c] = "null"; else if (d.constructor)if (d.constructor === Array)a[c] = d.length < 3 ? "[" + b.stringifyArguments(d) + "]" : "[" + b.stringifyArguments(e.call(d, 0, 1)) + "..." + b.stringifyArguments(e.call(d, -1)) + "]"; else if (d.constructor === Object)a[c] = "#object"; else if (d.constructor === Function)a[c] = "#function"; else if (d.constructor === String)a[c] = '"' + d + '"'
        }
        return a.join(",")
    };
    __.jslog.iferror = function (a, e, b, c) {
        __.jslog.ifboss.log(c || 1, {file: location.href, url: a, code: e, msg: b})
    };
    __.jslog.error = function (a, e) {
        a =
            a || {};
        if (!a.stack && !a.stacktrace) {
            var b = Error();
            b.fileName = a.fileName;
            b.lineNumber = a.lineNumber;
            b.message = a.message;
            a = b
        }
        __.jslog.boss.log(e || 1, {file: location.href, js: a.fileName, line: a.lineNumber, msg: a.message, env: __.jslog._envstr, stack: __.jslog.stack(a).join("\n")})
    };
    window.onerror = function (a, e, b) {
        __.jslog.error({fileName: e, lineNumber: b, message: a});
        return __.isDebug() ? true : false
    }
});
__.BasicModule.register("tools", "0.0.0", [], function () {
    __.exportPath("__.tools");
    __.tools.ifLoad = function (b, a, d) {
        if (typeof a == "function") {
            a = {onOk: a};
            if (typeof d == "function")a.onError = d
        }
        if (!a.id) {
            d = __.tools.ifLoad._gPrefix + __.tools.ifLoad._gId++;
            b = b.split("?");
            b[1] = b[1] ? b[1] + "&_var=" + d : "&_var=" + d;
            b = b.join("?");
            a.id = d
        }
        __.load(b, function () {
            if (window[a.id]) {
                var c = window[a.id];
                a = a || {onError: function () {
                }, onOk: function () {
                }};
                a.onError = a.onError || function () {
                };
                a.onOk = a.onOk || function () {
                };
                if (c && c.code == "0")try {
                    a.onOk(c.data)
                } catch (e) {
                    c.msg =
                        e.message || e;
                    __.jslog.error(e);
                    a.onError(c)
                } else {
                    __.jslog.iferror(b, c.code, c.msg);
                    a.onError(c)
                }
                try {
                    delete window[a.id];
                    window[a.id] = null
                } catch (f) {
                }
            } else __.jslog.iferror(b, -1, "[" + a.id + "] is not defined")
        })
    };
    __.tools.ifLoad._gPrefix = "_IFLOAD_";
    __.tools.ifLoad._gId = 1
});
/*  |xGv00|18fb1c045dddde91f1c1ac239c92f652 */