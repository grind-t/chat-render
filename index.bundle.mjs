var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {
};
class Rectangle {
    constructor(x1, y1, width, height){
        this.x = x1;
        this.y = y1;
        this.width = width;
        this.height = height;
    }
}
class ChatStyle {
    constructor(backgroundFillStyle, messageStyle){
        this.backgroundFillStyle = backgroundFillStyle;
        this.messageStyle = messageStyle;
    }
}
class Chat extends Rectangle {
    constructor(width1, height1){
        super(0, 0, width1, height1);
        this.messages = [];
    }
    scrollDown() {
        const messages = this.messages;
        const minY = this.y;
        const maxY = this.y + this.height;
        const last = messages[messages.length - 1];
        const offset = last.y + last.height - maxY;
        if (offset <= 0) return;
        let outOfBounds = 0;
        for (const message of messages){
            message.y -= offset;
            if (message.y + message.height <= minY) outOfBounds++;
        }
        messages.splice(0, outOfBounds);
    }
    push(message, messagesSpacing) {
        const messages = this.messages;
        messages.push(message);
        if (messages.length < 2) return;
        const prevMessage = messages[messages.length - 2];
        message.y = prevMessage.y + prevMessage.height + messagesSpacing;
        this.scrollDown();
    }
    draw(ctx, offsetX, offsetY, style) {
        const x1 = this.x + offsetX;
        const y1 = this.y + offsetY;
        ctx.fillStyle = style.backgroundFillStyle;
        ctx.fillRect(x1, y1, this.width, this.height);
        this.messages.forEach((m)=>m.draw(ctx, x1, y1, style.messageStyle)
        );
    }
}
class TextItem extends Rectangle {
    constructor(content, width2, height2){
        super(0, 0, width2, height2);
        this.content = content;
    }
    draw(ctx, offsetX, offsetY) {
        const x1 = this.x + offsetX;
        const y1 = this.y + offsetY + this.height;
        ctx.fillText(this.content, x1, y1);
    }
}
class ImageItem extends Rectangle {
    constructor(content1){
        super(0, 0, content1.width, content1.height);
        this.content = content1;
    }
    draw(ctx, offsetX, offsetY) {
        const x1 = this.x + offsetX;
        const y1 = this.y + offsetY;
        ctx.drawImage(this.content, x1, y1, this.width, this.height);
    }
}
class Emotes {
    constructor(map){
        this.map = map;
        let pattern = [];
        for (const name of map.keys()){
            pattern.push(name.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"));
        }
        this.regexp = new RegExp(pattern.join("|"), "g");
    }
}
class MessageLayout {
    constructor(ctx1, width3, linesSpacing, itemsVerticalAlign = "center"){
        this.width = width3;
        this.linesSpacing = linesSpacing;
        this.itemsVerticalAlign = itemsVerticalAlign;
        this.itemsSpacing = ctx1.measureText(" ").width;
        this.fontHeight = ctx1.measureText("W").actualBoundingBoxAscent;
    }
}
class MessageStyle {
    constructor(authorFillStyle, messageFillStyle){
        this.authorFillStyle = authorFillStyle;
        this.messageFillStyle = messageFillStyle;
    }
}
class Message extends Rectangle {
    constructor(content2, width4, height3){
        super(0, 0, width4, height3);
        this.content = content2;
    }
    static fromString(str, layout, ctx) {
        return setLayout(parseString(str, layout.width, layout.fontHeight, ctx), layout);
    }
    static fromStringWithEmotes(str, emotes, layout, ctx) {
        return setLayout(parseStringWithEmotes(str, emotes, layout.width, layout.fontHeight, ctx), layout);
    }
    static fromStringWithEmotesAndBadges() {
        throw new Error("Not implemented.");
    }
    draw(ctx, offsetX, offsetY, style) {
        if (!this.content) return;
        const x1 = this.x + offsetX;
        const y1 = this.y + offsetY;
        ctx.fillStyle = style.authorFillStyle;
        const author = this.content[0];
        author.draw(ctx, x1, y1);
        ctx.fillStyle = style.messageFillStyle;
        for(let i = 1; i < this.content.length; i++){
            this.content[i].draw(ctx, x1, y1);
        }
    }
}
function createCommonjsModule(fn, basedir, module) {
    return module = {
        path: basedir,
        exports: {
        },
        require: function(path, base) {
            return commonjsRequire1(path, base === undefined || base === null ? module.path : base);
        }
    }, fn(module, module.exports), module.exports;
}
function commonjsRequire1() {
    throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}
var papaparse_min = createCommonjsModule(function(module, exports) {
    !(function(e, t) {
        module.exports = t();
    })(commonjsGlobal, function s() {
        var f1 = "undefined" != typeof self ? self : "undefined" != typeof window ? window : (void 0) !== f1 ? f1 : {
        };
        var n = !f1.document && !!f1.postMessage, o = n && /blob:/i.test((f1.location || {
        }).protocol), a = {
        }, h = 0, b1 = {
            parse: function(e, t) {
                var i1 = (t = t || {
                }).dynamicTyping || !1;
                U(i1) && (t.dynamicTypingFunction = i1, i1 = {
                });
                if ((t.dynamicTyping = i1, t.transform = !!U(t.transform) && t.transform, t.worker && b1.WORKERS_SUPPORTED)) {
                    var r = function() {
                        if (!b1.WORKERS_SUPPORTED) return !1;
                        var e1 = (i2 = f1.URL || f1.webkitURL || null, r = s.toString(), b1.BLOB_URL || (b1.BLOB_URL = i2.createObjectURL(new Blob([
                            "(",
                            r,
                            ")();"
                        ], {
                            type: "text/javascript"
                        })))), t1 = new f1.Worker(e1);
                        var i2, r1;
                        return t1.onmessage = m, t1.id = h++, a[t1.id] = t1;
                    }();
                    return (r.userStep = t.step, r.userChunk = t.chunk, r.userComplete = t.complete, r.userError = t.error, t.step = U(t.step), t.chunk = U(t.chunk), t.complete = U(t.complete), t.error = U(t.error), delete t.worker, void r.postMessage({
                        input: e,
                        config: t,
                        workerId: r.id
                    }));
                }
                var n1 = null;
                "string" == typeof e ? n1 = t.download ? new l(t) : new p(t) : !0 === e.readable && U(e.read) && U(e.on) ? n1 = new g1(t) : (f1.File && e instanceof File || e instanceof Object) && (n1 = new c(t));
                return n1.stream(e);
            },
            unparse: function(e, t) {
                var n1 = !1, m = !0, _ = ",", v = "\r\n", s1 = '"', a1 = s1 + s1, i = !1, r = null, o1 = !1;
                !(function() {
                    if ("object" != typeof t) return;
                    "string" != typeof t.delimiter || b1.BAD_DELIMITERS.filter(function(e1) {
                        return -1 !== t.delimiter.indexOf(e1);
                    }).length || (_ = t.delimiter);
                    ("boolean" == typeof t.quotes || "function" == typeof t.quotes || Array.isArray(t.quotes)) && (n1 = t.quotes);
                    "boolean" != typeof t.skipEmptyLines && "string" != typeof t.skipEmptyLines || (i = t.skipEmptyLines);
                    "string" == typeof t.newline && (v = t.newline);
                    "string" == typeof t.quoteChar && (s1 = t.quoteChar);
                    "boolean" == typeof t.header && (m = t.header);
                    if (Array.isArray(t.columns)) {
                        if (0 === t.columns.length) throw new Error("Option columns is empty");
                        r = t.columns;
                    }
                    (void 0) !== t.escapeChar && (a1 = t.escapeChar + s1);
                    "boolean" == typeof t.escapeFormulae && (o1 = t.escapeFormulae);
                })();
                var h1 = new RegExp(q(s1), "g");
                "string" == typeof e && (e = JSON.parse(e));
                if (Array.isArray(e)) {
                    if (!e.length || Array.isArray(e[0])) return f2(null, e, i);
                    if ("object" == typeof e[0]) return f2(r || u(e[0]), e, i);
                } else if ("object" == typeof e) return ("string" == typeof e.data && (e.data = JSON.parse(e.data)), Array.isArray(e.data) && (e.fields || (e.fields = e.meta && e.meta.fields), e.fields || (e.fields = Array.isArray(e.data[0]) ? e.fields : u(e.data[0])), Array.isArray(e.data[0]) || "object" == typeof e.data[0] || (e.data = [
                    e.data
                ])), f2(e.fields || [], e.data || [], i));
                throw new Error("Unable to serialize unrecognized input");
                function u(e1) {
                    if ("object" != typeof e1) return [];
                    var t1 = [];
                    for(var i1 in e1)t1.push(i1);
                    return t1;
                }
                function f2(e1, t1, i1) {
                    var r1 = "";
                    "string" == typeof e1 && (e1 = JSON.parse(e1)), "string" == typeof t1 && (t1 = JSON.parse(t1));
                    var n2 = Array.isArray(e1) && 0 < e1.length, s2 = !Array.isArray(t1[0]);
                    if (n2 && m) {
                        for(var a2 = 0; a2 < e1.length; a2++)0 < a2 && (r1 += _), r1 += y2(e1[a2], a2);
                        0 < t1.length && (r1 += v);
                    }
                    for(var o2 = 0; o2 < t1.length; o2++){
                        var h2 = n2 ? e1.length : t1[o2].length, u1 = !1, f2 = n2 ? 0 === Object.keys(t1[o2]).length : 0 === t1[o2].length;
                        if ((i1 && !n2 && (u1 = "greedy" === i1 ? "" === t1[o2].join("").trim() : 1 === t1[o2].length && 0 === t1[o2][0].length), "greedy" === i1 && n2)) {
                            for(var d = [], l = 0; l < h2; l++){
                                var c = s2 ? e1[l] : l;
                                d.push(t1[o2][c]);
                            }
                            u1 = "" === d.join("").trim();
                        }
                        if (!u1) {
                            for(var p = 0; p < h2; p++){
                                0 < p && !f2 && (r1 += _);
                                var g = n2 && s2 ? e1[p] : p;
                                r1 += y2(t1[o2][g], p);
                            }
                            o2 < t1.length - 1 && (!i1 || 0 < h2 && !f2) && (r1 += v);
                        }
                    }
                    return r1;
                }
                function y2(e1, t1) {
                    if (null == e1) return "";
                    if (e1.constructor === Date) return JSON.stringify(e1).slice(1, 25);
                    !0 === o1 && "string" == typeof e1 && null !== e1.match(/^[=+\-@].*$/) && (e1 = "'" + e1);
                    var i1 = e1.toString().replace(h1, a1), r1 = "boolean" == typeof n1 && n1 || "function" == typeof n1 && n1(e1, t1) || Array.isArray(n1) && n1[t1] || function(e2, t2) {
                        for(var i2 = 0; i2 < t2.length; i2++)if (-1 < e2.indexOf(t2[i2])) return !0;
                        return !1;
                    }(i1, b1.BAD_DELIMITERS) || -1 < i1.indexOf(_) || " " === i1.charAt(0) || " " === i1.charAt(i1.length - 1);
                    return r1 ? s1 + i1 + s1 : i1;
                }
            }
        };
        if ((b1.RECORD_SEP = String.fromCharCode(30), b1.UNIT_SEP = String.fromCharCode(31), b1.BYTE_ORDER_MARK = "\ufeff", b1.BAD_DELIMITERS = [
            "\r",
            "\n",
            '"',
            b1.BYTE_ORDER_MARK
        ], b1.WORKERS_SUPPORTED = !n && !!f1.Worker, b1.NODE_STREAM_INPUT = 1, b1.LocalChunkSize = 10485760, b1.RemoteChunkSize = 5242880, b1.DefaultDelimiter = ",", b1.Parser = w, b1.ParserHandle = i, b1.NetworkStreamer = l, b1.FileStreamer = c, b1.StringStreamer = p, b1.ReadableStreamStreamer = g1, f1.jQuery)) {
            var d = f1.jQuery;
            d.fn.parse = function(o1) {
                var i = o1.config || {
                }, h1 = [];
                return this.each(function(e) {
                    if (!("INPUT" === d(this).prop("tagName").toUpperCase() && "file" === d(this).attr("type").toLowerCase() && f1.FileReader) || !this.files || 0 === this.files.length) return !0;
                    for(var t = 0; t < this.files.length; t++)h1.push({
                        file: this.files[t],
                        inputElem: this,
                        instanceConfig: d.extend({
                        }, i)
                    });
                }), e(), this;
                function e() {
                    if (0 !== h1.length) {
                        var e, t, i1, r, n1 = h1[0];
                        if (U(o1.before)) {
                            var s1 = o1.before(n1.file, n1.inputElem);
                            if ("object" == typeof s1) {
                                if ("abort" === s1.action) return e = "AbortError", t = n1.file, i1 = n1.inputElem, r = s1.reason, void (U(o1.error) && o1.error({
                                    name: e
                                }, t, i1, r));
                                if ("skip" === s1.action) return void u();
                                "object" == typeof s1.config && (n1.instanceConfig = d.extend(n1.instanceConfig, s1.config));
                            } else if ("skip" === s1) return void u();
                        }
                        var a1 = n1.instanceConfig.complete;
                        n1.instanceConfig.complete = function(e1) {
                            U(a1) && a1(e1, n1.file, n1.inputElem), u();
                        }, b1.parse(n1.file, n1.instanceConfig);
                    } else U(o1.complete) && o1.complete();
                }
                function u() {
                    h1.splice(0, 1), e();
                }
            };
        }
        function u(e) {
            this._handle = null, this._finished = !1, this._completed = !1, this._halted = !1, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = !0, this._completeResults = {
                data: [],
                errors: [],
                meta: {
                }
            }, (function(e1) {
                var t = E(e1);
                t.chunkSize = parseInt(t.chunkSize), e1.step || e1.chunk || (t.chunkSize = null);
                this._handle = new i(t), (this._handle.streamer = this)._config = t;
            }).call(this, e), this.parseChunk = function(e1, t) {
                if (this.isFirstChunk && U(this._config.beforeFirstChunk)) {
                    var i = this._config.beforeFirstChunk(e1);
                    (void 0) !== i && (e1 = i);
                }
                this.isFirstChunk = !1, this._halted = !1;
                var r = this._partialLine + e1;
                this._partialLine = "";
                var n1 = this._handle.parse(r, this._baseIndex, !this._finished);
                if (!this._handle.paused() && !this._handle.aborted()) {
                    var s1 = n1.meta.cursor;
                    this._finished || (this._partialLine = r.substring(s1 - this._baseIndex), this._baseIndex = s1), n1 && n1.data && (this._rowCount += n1.data.length);
                    var a1 = this._finished || this._config.preview && this._rowCount >= this._config.preview;
                    if (o) f1.postMessage({
                        results: n1,
                        workerId: b1.WORKER_ID,
                        finished: a1
                    });
                    else if (U(this._config.chunk) && !t) {
                        if (this._config.chunk(n1, this._handle), this._handle.paused() || this._handle.aborted()) return void (this._halted = !0);
                        n1 = void 0, this._completeResults = void 0;
                    }
                    return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(n1.data), this._completeResults.errors = this._completeResults.errors.concat(n1.errors), this._completeResults.meta = n1.meta), this._completed || !a1 || !U(this._config.complete) || n1 && n1.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = !0), a1 || n1 && n1.meta.paused || this._nextChunk(), n1;
                }
                this._halted = !0;
            }, this._sendError = function(e1) {
                U(this._config.error) ? this._config.error(e1) : o && this._config.error && f1.postMessage({
                    workerId: b1.WORKER_ID,
                    error: e1,
                    finished: !1
                });
            };
        }
        function l(e) {
            var r;
            (e = e || {
            }).chunkSize || (e.chunkSize = b1.RemoteChunkSize), u.call(this, e), this._nextChunk = n ? function() {
                this._readChunk(), this._chunkLoaded();
            } : function() {
                this._readChunk();
            }, this.stream = function(e1) {
                this._input = e1, this._nextChunk();
            }, this._readChunk = function() {
                if (this._finished) this._chunkLoaded();
                else {
                    if (r = new XMLHttpRequest, this._config.withCredentials && (r.withCredentials = this._config.withCredentials), n || (r.onload = y2(this._chunkLoaded, this), r.onerror = y2(this._chunkError, this)), r.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !n), this._config.downloadRequestHeaders) {
                        var e1 = this._config.downloadRequestHeaders;
                        for(var t in e1)r.setRequestHeader(t, e1[t]);
                    }
                    if (this._config.chunkSize) {
                        var i = this._start + this._config.chunkSize - 1;
                        r.setRequestHeader("Range", "bytes=" + this._start + "-" + i);
                    }
                    try {
                        r.send(this._config.downloadRequestBody);
                    } catch (e) {
                        this._chunkError(e.message);
                    }
                    n && 0 === r.status && this._chunkError();
                }
            }, this._chunkLoaded = function() {
                4 === r.readyState && (r.status < 200 || 400 <= r.status ? this._chunkError() : (this._start += this._config.chunkSize ? this._config.chunkSize : r.responseText.length, this._finished = !this._config.chunkSize || this._start >= (function(e1) {
                    var t = e1.getResponseHeader("Content-Range");
                    if (null === t) return -1;
                    return parseInt(t.substring(t.lastIndexOf("/") + 1));
                })(r), this.parseChunk(r.responseText)));
            }, this._chunkError = function(e1) {
                var t = r.statusText || e1;
                this._sendError(new Error(t));
            };
        }
        function c(e) {
            var r, n1;
            (e = e || {
            }).chunkSize || (e.chunkSize = b1.LocalChunkSize), u.call(this, e);
            var s1 = "undefined" != typeof FileReader;
            this.stream = function(e1) {
                this._input = e1, n1 = e1.slice || e1.webkitSlice || e1.mozSlice, s1 ? ((r = new FileReader).onload = y2(this._chunkLoaded, this), r.onerror = y2(this._chunkError, this)) : r = new FileReaderSync, this._nextChunk();
            }, this._nextChunk = function() {
                this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
            }, this._readChunk = function() {
                var e1 = this._input;
                if (this._config.chunkSize) {
                    var t = Math.min(this._start + this._config.chunkSize, this._input.size);
                    e1 = n1.call(e1, this._start, t);
                }
                var i = r.readAsText(e1, this._config.encoding);
                s1 || this._chunkLoaded({
                    target: {
                        result: i
                    }
                });
            }, this._chunkLoaded = function(e1) {
                this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e1.target.result);
            }, this._chunkError = function() {
                this._sendError(r.error);
            };
        }
        function p(e) {
            var i;
            u.call(this, e = e || {
            }), this.stream = function(e1) {
                return i = e1, this._nextChunk();
            }, this._nextChunk = function() {
                if (!this._finished) {
                    var e1, t = this._config.chunkSize;
                    return t ? (e1 = i.substring(0, t), i = i.substring(t)) : (e1 = i, i = ""), this._finished = !i, this.parseChunk(e1);
                }
            };
        }
        function g1(e) {
            u.call(this, e = e || {
            });
            var t = [], i = !0, r = !1;
            this.pause = function() {
                u.prototype.pause.apply(this, arguments), this._input.pause();
            }, this.resume = function() {
                u.prototype.resume.apply(this, arguments), this._input.resume();
            }, this.stream = function(e1) {
                this._input = e1, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
            }, this._checkIsFinished = function() {
                r && 1 === t.length && (this._finished = !0);
            }, this._nextChunk = function() {
                this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : i = !0;
            }, this._streamData = y2(function(e1) {
                try {
                    t.push("string" == typeof e1 ? e1 : e1.toString(this._config.encoding)), i && (i = !1, this._checkIsFinished(), this.parseChunk(t.shift()));
                } catch (e) {
                    this._streamError(e);
                }
            }, this), this._streamError = y2(function(e1) {
                this._streamCleanUp(), this._sendError(e1);
            }, this), this._streamEnd = y2(function() {
                this._streamCleanUp(), r = !0, this._streamData("");
            }, this), this._streamCleanUp = y2(function() {
                this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
            }, this);
        }
        function i(_) {
            var a1, o1, h1, r = Math.pow(2, 53), n1 = -r, s1 = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)(e[-+]?\d+)?\s*$/, u1 = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/, t = this, i1 = 0, f2 = 0, d = !1, e = !1, l1 = [], c1 = {
                data: [],
                errors: [],
                meta: {
                }
            };
            if (U(_.step)) {
                var p1 = _.step;
                _.step = function(e1) {
                    if (c1 = e1, m()) g2();
                    else {
                        if (g2(), 0 === c1.data.length) return;
                        i1 += e1.data.length, _.preview && i1 > _.preview ? o1.abort() : (c1.data = c1.data[0], p1(c1, t));
                    }
                };
            }
            function v(e1) {
                return "greedy" === _.skipEmptyLines ? "" === e1.join("").trim() : 1 === e1.length && 0 === e1[0].length;
            }
            function g2() {
                if ((c1 && h1 && (k("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + b1.DefaultDelimiter + "'"), h1 = !1), _.skipEmptyLines)) for(var e1 = 0; e1 < c1.data.length; e1++)v(c1.data[e1]) && c1.data.splice(e1--, 1);
                return (m() && function() {
                    if (!c1) return;
                    function e2(e3, t1) {
                        U(_.transformHeader) && (e3 = _.transformHeader(e3, t1)), l1.push(e3);
                    }
                    if (Array.isArray(c1.data[0])) {
                        for(var t1 = 0; m() && t1 < c1.data.length; t1++)c1.data[t1].forEach(e2);
                        c1.data.splice(0, 1);
                    } else c1.data.forEach(e2);
                }(), function() {
                    if (!c1 || !_.header && !_.dynamicTyping && !_.transform) return c1;
                    function e2(e3, t1) {
                        var i1, r1 = _.header ? {
                        } : [];
                        for(i1 = 0; i1 < e3.length; i1++){
                            var n2 = i1, s2 = e3[i1];
                            _.header && (n2 = i1 >= l1.length ? "__parsed_extra" : l1[i1]), _.transform && (s2 = _.transform(s2, n2)), s2 = y2(n2, s2), "__parsed_extra" === n2 ? (r1[n2] = r1[n2] || [], r1[n2].push(s2)) : r1[n2] = s2;
                        }
                        return _.header && (i1 > l1.length ? k("FieldMismatch", "TooManyFields", "Too many fields: expected " + l1.length + " fields but parsed " + i1, f2 + t1) : i1 < l1.length && k("FieldMismatch", "TooFewFields", "Too few fields: expected " + l1.length + " fields but parsed " + i1, f2 + t1)), r1;
                    }
                    var t1 = 1;
                    !c1.data.length || Array.isArray(c1.data[0]) ? (c1.data = c1.data.map(e2), t1 = c1.data.length) : c1.data = e2(c1.data, 0);
                    _.header && c1.meta && (c1.meta.fields = l1);
                    return f2 += t1, c1;
                }());
            }
            function m() {
                return _.header && 0 === l1.length;
            }
            function y2(e1, t1) {
                return (i6 = e1, _.dynamicTypingFunction && (void 0) === _.dynamicTyping[i6] && (_.dynamicTyping[i6] = _.dynamicTypingFunction(i6)), !0 === (_.dynamicTyping[i6] || _.dynamicTyping) ? "true" === t1 || "TRUE" === t1 || "false" !== t1 && "FALSE" !== t1 && (function(e2) {
                    if (s1.test(e2)) {
                        var t2 = parseFloat(e2);
                        if (n1 < t2 && t2 < r) return !0;
                    }
                    return !1;
                }(t1) ? parseFloat(t1) : u1.test(t1) ? new Date(t1) : "" === t1 ? null : t1) : t1);
                var i6;
            }
            function k(e1, t1, i6, r1) {
                var n2 = {
                    type: e1,
                    code: t1,
                    message: i6
                };
                (void 0) !== r1 && (n2.row = r1), c1.errors.push(n2);
            }
            this.parse = function(e1, t1, i6) {
                var r1 = _.quoteChar || '"';
                if (_.newline || (_.newline = (function(e2, t2) {
                    e2 = e2.substring(0, 1048576);
                    var i1 = new RegExp(q(t2) + "([^]*?)" + q(t2), "gm"), r2 = (e2 = e2.replace(i6, "")).split("\r"), n2 = e2.split("\n"), s2 = 1 < n2.length && n2[0].length < r2[0].length;
                    if (1 === r2.length || s2) return "\n";
                    for(var a2 = 0, o2 = 0; o2 < r2.length; o2++)"\n" === r2[o2][0] && a2++;
                    return a2 >= r2.length / 2 ? "\r\n" : "\r";
                })(e1, r1)), h1 = !1, _.delimiter) U(_.delimiter) && (_.delimiter = _.delimiter(e1), c1.meta.delimiter = _.delimiter);
                else {
                    var n2 = function(e2, t2, i7, r2, n3) {
                        var s2, a2, o2, h2;
                        n3 = n3 || [
                            ",",
                            "\t",
                            "|",
                            ";",
                            b1.RECORD_SEP,
                            b1.UNIT_SEP
                        ];
                        for(var u2 = 0; u2 < n3.length; u2++){
                            var f3 = n3[u2], d1 = 0, l2 = 0, c2 = 0;
                            o2 = void 0;
                            for(var p1 = new w({
                                comments: r2,
                                delimiter: f3,
                                newline: t2,
                                preview: 10
                            }).parse(e2), g3 = 0; g3 < p1.data.length; g3++)if (i7 && v(p1.data[g3])) c2++;
                            else {
                                var m1 = p1.data[g3].length;
                                l2 += m1, (void 0) !== o2 ? 0 < m1 && (d1 += Math.abs(m1 - o2), o2 = m1) : o2 = m1;
                            }
                            0 < p1.data.length && (l2 /= p1.data.length - c2), ((void 0) === a2 || d1 <= a2) && ((void 0) === h2 || h2 < l2) && 1.99 < l2 && (a2 = d1, s2 = f3, h2 = l2);
                        }
                        return {
                            successful: !!(_.delimiter = s2),
                            bestDelimiter: s2
                        };
                    }(e1, _.newline, _.skipEmptyLines, _.comments, _.delimitersToGuess);
                    n2.successful ? _.delimiter = n2.bestDelimiter : (h1 = !0, _.delimiter = b1.DefaultDelimiter), c1.meta.delimiter = _.delimiter;
                }
                var s2 = E(_);
                return _.preview && _.header && s2.preview++, a1 = e1, o1 = new w(s2), c1 = o1.parse(a1, t1, i6), g2(), d ? {
                    meta: {
                        paused: !0
                    }
                } : c1 || {
                    meta: {
                        paused: !1
                    }
                };
            }, this.paused = function() {
                return d;
            }, this.pause = function() {
                d = !0, o1.abort(), a1 = U(_.chunk) ? "" : a1.substring(o1.getCharIndex());
            }, this.resume = function() {
                t.streamer._halted ? (d = !1, t.streamer.parseChunk(a1, !0)) : setTimeout(t.resume, 3);
            }, this.aborted = function() {
                return e;
            }, this.abort = function() {
                e = !0, o1.abort(), c1.meta.aborted = !0, U(_.complete) && _.complete(c1), a1 = "";
            };
        }
        function q(e) {
            return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
        function w(e) {
            var O, D = (e = e || {
            }).delimiter, I = e.newline, T = e.comments, A = e.step, L = e.preview, F = e.fastMode, z = O = (void 0) === e.quoteChar ? '"' : e.quoteChar;
            if (((void 0) !== e.escapeChar && (z = e.escapeChar), ("string" != typeof D || -1 < b1.BAD_DELIMITERS.indexOf(D)) && (D = ","), T === D)) throw new Error("Comment character same as delimiter");
            !0 === T ? T = "#" : ("string" != typeof T || -1 < b1.BAD_DELIMITERS.indexOf(T)) && (T = !1), "\n" !== I && "\r" !== I && "\r\n" !== I && (I = "\n");
            var M = 0, j = !1;
            this.parse = function(a1, t, i2) {
                if ("string" != typeof a1) throw new Error("Input must be a string");
                var r = a1.length, e1 = D.length, n1 = I.length, s1 = T.length, o1 = U(A), h1 = [], u1 = [], f2 = [], d = M = 0;
                if (!a1) return R();
                if (F || !1 !== F && -1 === a1.indexOf(O)) {
                    for(var l1 = a1.split(I), c1 = 0; c1 < l1.length; c1++){
                        if (f2 = l1[c1], M += f2.length, c1 !== l1.length - 1) M += I.length;
                        else if (i2) return R();
                        if (!T || f2.substring(0, s1) !== T) {
                            if (o1) {
                                if (h1 = [], b2(f2.split(D)), S(), j) return R();
                            } else b2(f2.split(D));
                            if (L && L <= c1) return h1 = h1.slice(0, L), R(!0);
                        }
                    }
                    return R();
                }
                for(var p1 = a1.indexOf(D, M), g2 = a1.indexOf(I, M), m = new RegExp(q(z) + q(O), "g"), _ = a1.indexOf(O, M);;)if (a1[M] !== O) {
                    if (T && 0 === f2.length && a1.substring(M, M + s1) === T) {
                        if (-1 === g2) return R();
                        M = g2 + n1, g2 = a1.indexOf(I, M), p1 = a1.indexOf(D, M);
                    } else {
                        if (-1 !== p1 && (p1 < g2 || -1 === g2)) {
                            if (!(p1 < _)) {
                                f2.push(a1.substring(M, p1)), M = p1 + e1, p1 = a1.indexOf(D, M);
                                continue;
                            }
                            var v = x2(p1, _, g2);
                            if (v && (void 0) !== v.nextDelim) {
                                p1 = v.nextDelim, _ = v.quoteSearch, f2.push(a1.substring(M, p1)), M = p1 + e1, p1 = a1.indexOf(D, M);
                                continue;
                            }
                        }
                        if (-1 === g2) break;
                        if (f2.push(a1.substring(M, g2)), C(g2 + n1), o1 && (S(), j)) return R();
                        if (L && h1.length >= L) return R(!0);
                    }
                } else for(_ = M, M++;;){
                    if (-1 === (_ = a1.indexOf(O, _ + 1))) return i2 || u1.push({
                        type: "Quotes",
                        code: "MissingQuotes",
                        message: "Quoted field unterminated",
                        row: h1.length,
                        index: M
                    }), E();
                    if (_ === r - 1) return E(a1.substring(M, _).replace(m, O));
                    if (O !== z || a1[_ + 1] !== z) {
                        if (O === z || 0 === _ || a1[_ - 1] !== z) {
                            -1 !== p1 && p1 < _ + 1 && (p1 = a1.indexOf(D, _ + 1)), -1 !== g2 && g2 < _ + 1 && (g2 = a1.indexOf(I, _ + 1));
                            var y2 = w(-1 === g2 ? p1 : Math.min(p1, g2));
                            if (a1[_ + 1 + y2] === D) {
                                f2.push(a1.substring(M, _).replace(m, O)), a1[M = _ + 1 + y2 + e1] !== O && (_ = a1.indexOf(O, M)), p1 = a1.indexOf(D, M), g2 = a1.indexOf(I, M);
                                break;
                            }
                            var k = w(g2);
                            if (a1.substring(_ + 1 + k, _ + 1 + k + n1) === I) {
                                if (f2.push(a1.substring(M, _).replace(m, O)), C(_ + 1 + k + n1), p1 = a1.indexOf(D, M), _ = a1.indexOf(O, M), o1 && (S(), j)) return R();
                                if (L && h1.length >= L) return R(!0);
                                break;
                            }
                            u1.push({
                                type: "Quotes",
                                code: "InvalidQuotes",
                                message: "Trailing quote on quoted field is malformed",
                                row: h1.length,
                                index: M
                            }), _++;
                        }
                    } else _++;
                }
                return E();
                function b2(e2) {
                    h1.push(e2), d = M;
                }
                function w(e2) {
                    var t1 = 0;
                    if (-1 !== e2) {
                        var i6 = a1.substring(_ + 1, e2);
                        i6 && "" === i6.trim() && (t1 = i6.length);
                    }
                    return t1;
                }
                function E(e2) {
                    return i2 || ((void 0) === e2 && (e2 = a1.substring(M)), f2.push(e2), M = r, b2(f2), o1 && S()), R();
                }
                function C(e2) {
                    M = e2, b2(f2), f2 = [], g2 = a1.indexOf(I, M);
                }
                function R(e2) {
                    return {
                        data: h1,
                        errors: u1,
                        meta: {
                            delimiter: D,
                            linebreak: I,
                            aborted: j,
                            truncated: !!e2,
                            cursor: d + (t || 0)
                        }
                    };
                }
                function S() {
                    A(R()), h1 = [], u1 = [];
                }
                function x2(e2, t1, i6) {
                    var r1 = {
                        nextDelim: void 0,
                        quoteSearch: void 0
                    }, n2 = a1.indexOf(O, t1 + 1);
                    if (t1 < e2 && e2 < n2 && (n2 < i6 || -1 === i6)) {
                        var s2 = a1.indexOf(D, n2);
                        if (-1 === s2) return r1;
                        n2 < s2 && (n2 = a1.indexOf(O, n2 + 1)), r1 = x2(s2, n2, i6);
                    } else r1 = {
                        nextDelim: e2,
                        quoteSearch: t1
                    };
                    return r1;
                }
            }, this.abort = function() {
                j = !0;
            }, this.getCharIndex = function() {
                return M;
            };
        }
        function m(e) {
            var t = e.data, i2 = a[t.workerId], r = !1;
            if (t.error) i2.userError(t.error, t.file);
            else if (t.results && t.results.data) {
                var n1 = {
                    abort: function() {
                        r = !0, _(t.workerId, {
                            data: [],
                            errors: [],
                            meta: {
                                aborted: !0
                            }
                        });
                    },
                    pause: v,
                    resume: v
                };
                if (U(i2.userStep)) {
                    for(var s1 = 0; s1 < t.results.data.length && (i2.userStep({
                        data: t.results.data[s1],
                        errors: t.results.errors,
                        meta: t.results.meta
                    }, n1), !r); s1++);
                    delete t.results;
                } else U(i2.userChunk) && (i2.userChunk(t.results, n1, t.file), delete t.results);
            }
            t.finished && !r && _(t.workerId, t.results);
        }
        function _(e, t) {
            var i2 = a[e];
            U(i2.userComplete) && i2.userComplete(t), i2.terminate(), delete a[e];
        }
        function v() {
            throw new Error("Not implemented.");
        }
        function E(e) {
            if ("object" != typeof e || null === e) return e;
            var t = Array.isArray(e) ? [] : {
            };
            for(var i2 in e)t[i2] = E(e[i2]);
            return t;
        }
        function y2(e, t) {
            return function() {
                e.apply(t, arguments);
            };
        }
        function U(e) {
            return "function" == typeof e;
        }
        return (o && (f1.onmessage = function(e) {
            var t = e.data;
            (void 0) === b1.WORKER_ID && t && (b1.WORKER_ID = t.workerId);
            if ("string" == typeof t.input) f1.postMessage({
                workerId: b1.WORKER_ID,
                results: b1.parse(t.input, t.config),
                finished: !0
            });
            else if (f1.File && t.input instanceof File || t.input instanceof Object) {
                var i2 = b1.parse(t.input, t.config);
                i2 && f1.postMessage({
                    workerId: b1.WORKER_ID,
                    results: i2,
                    finished: !0
                });
            }
        }), (l.prototype = Object.create(u.prototype)).constructor = l, (c.prototype = Object.create(u.prototype)).constructor = c, (p.prototype = Object.create(p.prototype)).constructor = p, (g1.prototype = Object.create(u.prototype)).constructor = g1, b1);
    });
});
function readTextFile(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = ()=>resolve(reader.result)
        ;
        reader.onerror = reject;
        reader.readAsText(file);
    });
}
async function downloadEmotes(file, emotesSize) {
    const text = await readTextFile(file);
    const map1 = new Map();
    const lines = text.split("\n");
    const loading = [];
    for (const line of lines){
        const fields = line.match(/\S+/g);
        if (!fields) continue;
        const [name1, url] = fields;
        const img = new Image(emotesSize, emotesSize);
        loading.push(new Promise((resolve)=>img.onload = resolve
        ));
        img.crossOrigin = "anonymous";
        img.src = url;
        map1.set(name1, img);
    }
    await Promise.all(loading);
    return new Emotes(map1);
}
function getRecords(file) {
    return new Promise((resolve, reject)=>{
        const records = [];
        papaparse_min.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results)=>resolve(results.data)
            ,
            error: reject
        });
    });
}
function convertPropertiesFields(properties) {
    return {
        width: parseFloat(properties.width),
        height: parseFloat(properties.height),
        messagesSpacing: parseFloat(properties.messagesSpacing),
        linesSpacing: parseFloat(properties.linesSpacing),
        emotesSize: parseFloat(properties.emotesSize),
        font: properties.font,
        style: new ChatStyle(properties.backgroundFillStyle, new MessageStyle(properties.authorFillStyle, properties.messageFillStyle))
    };
}
async function convertSettingsFields(settings) {
    const properties = convertPropertiesFields(settings.properties);
    const messages = await getRecords(settings.data.messages);
    console.log(messages);
    const emotes = settings.data.emotes ? await downloadEmotes(settings.data.emotes, properties.emotesSize) : undefined;
    return {
        properties: properties,
        data: {
            messages: messages,
            emotes: emotes
        }
    };
}
function nextMessageFits(lastMessage, messagesSpacing, chatHeight) {
    const commonHeight = lastMessage.height;
    return lastMessage.y + commonHeight + messagesSpacing + commonHeight < chatHeight;
}
function sampleMessage(emotesSize, layout, ctx2) {
    const emoteName = ":slightly_smiling_face:";
    const emoteImage = new Image(emotesSize, emotesSize);
    const loading = new Promise((resolve)=>emoteImage.onload = resolve
    );
    emoteImage.crossOrigin = "anonymous";
    emoteImage.src = "../public/sample-emote.png";
    const emotesMap = new Map([
        [
            emoteName,
            emoteImage
        ]
    ]);
    const emotes = new Emotes(emotesMap);
    const str = `\n    Author Lorem ipsum dolor sit amet ${emoteName}, consectetur adipiscing elit, \n    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ${emoteName}. \n    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex \n    ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse \n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat ${emoteName}\n    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n  `;
    return [
        Message.fromStringWithEmotes(str, emotes, layout, ctx2),
        loading
    ];
}
async function drawChatSample(ctx2, properties) {
    ctx2.font = properties.font;
    const messageLayout = new MessageLayout(ctx2, properties.width, properties.linesSpacing);
    const chat = new Chat(properties.width, properties.height);
    let [lastMessage, emotesLoading] = sampleMessage(properties.emotesSize, messageLayout, ctx2);
    chat.push(lastMessage, properties.messagesSpacing);
    while(nextMessageFits(lastMessage, properties.messagesSpacing, properties.height)){
        lastMessage = new Message(lastMessage.content, lastMessage.width, lastMessage.height);
        chat.push(lastMessage, properties.messagesSpacing);
    }
    await emotesLoading;
    chat.draw(ctx2, 0, 0, properties.style);
}
var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {
};
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init() {
    inited = true;
    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for(var i = 0, len = code.length; i < len; ++i){
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
    }
    revLookup['-'.charCodeAt(0)] = 62;
    revLookup['_'.charCodeAt(0)] = 63;
}
function toByteArray(b64) {
    if (!inited) {
        init();
    }
    var i, j, l, tmp, placeHolders, arr;
    var len = b64.length;
    if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4');
    }
    placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
    arr = new Arr(len * 3 / 4 - placeHolders);
    l = placeHolders > 0 ? len - 4 : len;
    var L = 0;
    for(i = 0, j = 0; i < l; i += 4, j += 3){
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[L++] = tmp >> 16 & 255;
        arr[L++] = tmp >> 8 & 255;
        arr[L++] = tmp & 255;
    }
    if (placeHolders === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[L++] = tmp & 255;
    } else if (placeHolders === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[L++] = tmp >> 8 & 255;
        arr[L++] = tmp & 255;
    }
    return arr;
}
function tripletToBase64(num) {
    return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for(var i = start; i < end; i += 3){
        tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
        output.push(tripletToBase64(tmp));
    }
    return output.join('');
}
function fromByteArray(uint8) {
    if (!inited) {
        init();
    }
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3;
    var output = '';
    var parts = [];
    var maxChunkLength = 16383;
    for(var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength){
        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    }
    if (extraBytes === 1) {
        tmp = uint8[len - 1];
        output += lookup[tmp >> 2];
        output += lookup[tmp << 4 & 63];
        output += '==';
    } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        output += lookup[tmp >> 10];
        output += lookup[tmp >> 4 & 63];
        output += lookup[tmp << 2 & 63];
        output += '=';
    }
    parts.push(output);
    return parts.join('');
}
function read(buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for(; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8){
    }
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for(; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8){
    }
    if (e === 0) {
        e = 1 - eBias;
    } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}
function write(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
    } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
        }
        if (e + eBias >= 1) {
            value += rt / c;
        } else {
            value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
            e++;
            c /= 2;
        }
        if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
        } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
        }
    }
    for(; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8){
    }
    e = e << mLen | m;
    eLen += mLen;
    for(; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8){
    }
    buffer[offset + i - d] |= s * 128;
}
var toString = {
}.toString;
var isArray = Array.isArray || function(arr) {
    return toString.call(arr) == '[object Array]';
};
var INSPECT_MAX_BYTES = 50;
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined ? global$1.TYPED_ARRAY_SUPPORT : true;
function kMaxLength() {
    return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function createBuffer(that, length) {
    if (kMaxLength() < length) {
        throw new RangeError('Invalid typed array length');
    }
    if (Buffer.TYPED_ARRAY_SUPPORT) {
        that = new Uint8Array(length);
        that.__proto__ = Buffer.prototype;
    } else {
        if (that === null) {
            that = new Buffer(length);
        }
        that.length = length;
    }
    return that;
}
function Buffer(arg, encodingOrOffset, length) {
    if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
        return new Buffer(arg, encodingOrOffset, length);
    }
    if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
            throw new Error('If encoding is specified then the first argument must be a string');
        }
        return allocUnsafe(this, arg);
    }
    return from(this, arg, encodingOrOffset, length);
}
Buffer.poolSize = 8192;
Buffer._augment = function(arr) {
    arr.__proto__ = Buffer.prototype;
    return arr;
};
function from(that, value, encodingOrOffset, length) {
    if (typeof value === 'number') {
        throw new TypeError('"value" argument must not be a number');
    }
    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
        return fromArrayBuffer(that, value, encodingOrOffset, length);
    }
    if (typeof value === 'string') {
        return fromString(that, value, encodingOrOffset);
    }
    return fromObject(that, value);
}
Buffer.from = function(value, encodingOrOffset, length) {
    return from(null, value, encodingOrOffset, length);
};
if (Buffer.TYPED_ARRAY_SUPPORT) {
    Buffer.prototype.__proto__ = Uint8Array.prototype;
    Buffer.__proto__ = Uint8Array;
}
function assertSize(size) {
    if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be a number');
    } else if (size < 0) {
        throw new RangeError('"size" argument must not be negative');
    }
}
function alloc(that, size, fill, encoding) {
    assertSize(size);
    if (size <= 0) {
        return createBuffer(that, size);
    }
    if (fill !== undefined) {
        return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
    }
    return createBuffer(that, size);
}
Buffer.alloc = function(size, fill, encoding) {
    return alloc(null, size, fill, encoding);
};
function allocUnsafe(that, size) {
    assertSize(size);
    that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
    if (!Buffer.TYPED_ARRAY_SUPPORT) {
        for(var i = 0; i < size; ++i){
            that[i] = 0;
        }
    }
    return that;
}
Buffer.allocUnsafe = function(size) {
    return allocUnsafe(null, size);
};
Buffer.allocUnsafeSlow = function(size) {
    return allocUnsafe(null, size);
};
function fromString(that, string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8';
    }
    if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('"encoding" must be a valid string encoding');
    }
    var length = byteLength(string, encoding) | 0;
    that = createBuffer(that, length);
    var actual = that.write(string, encoding);
    if (actual !== length) {
        that = that.slice(0, actual);
    }
    return that;
}
function fromArrayLike(that, array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0;
    that = createBuffer(that, length);
    for(var i = 0; i < length; i += 1){
        that[i] = array[i] & 255;
    }
    return that;
}
function fromArrayBuffer(that, array, byteOffset, length) {
    array.byteLength;
    if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('\'offset\' is out of bounds');
    }
    if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('\'length\' is out of bounds');
    }
    if (byteOffset === undefined && length === undefined) {
        array = new Uint8Array(array);
    } else if (length === undefined) {
        array = new Uint8Array(array, byteOffset);
    } else {
        array = new Uint8Array(array, byteOffset, length);
    }
    if (Buffer.TYPED_ARRAY_SUPPORT) {
        that = array;
        that.__proto__ = Buffer.prototype;
    } else {
        that = fromArrayLike(that, array);
    }
    return that;
}
function fromObject(that, obj) {
    if (internalIsBuffer(obj)) {
        var len = checked(obj.length) | 0;
        that = createBuffer(that, len);
        if (that.length === 0) {
            return that;
        }
        obj.copy(that, 0, 0, len);
        return that;
    }
    if (obj) {
        if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
            if (typeof obj.length !== 'number' || isnan(obj.length)) {
                return createBuffer(that, 0);
            }
            return fromArrayLike(that, obj);
        }
        if (obj.type === 'Buffer' && isArray(obj.data)) {
            return fromArrayLike(that, obj.data);
        }
    }
    throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}
function checked(length) {
    if (length >= kMaxLength()) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
    }
    return length | 0;
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer(b) {
    return !!(b != null && b._isBuffer);
}
Buffer.compare = function compare(a, b) {
    if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
        throw new TypeError('Arguments must be Buffers');
    }
    if (a === b) return 0;
    var x2 = a.length;
    var y2 = b.length;
    for(var i = 0, len = Math.min(x2, y2); i < len; ++i){
        if (a[i] !== b[i]) {
            x2 = a[i];
            y2 = b[i];
            break;
        }
    }
    if (x2 < y2) return -1;
    if (y2 < x2) return 1;
    return 0;
};
Buffer.isEncoding = function isEncoding(encoding) {
    switch(String(encoding).toLowerCase()){
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return true;
        default:
            return false;
    }
};
Buffer.concat = function concat(list, length) {
    if (!isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
        return Buffer.alloc(0);
    }
    var i;
    if (length === undefined) {
        length = 0;
        for(i = 0; i < list.length; ++i){
            length += list[i].length;
        }
    }
    var buffer = Buffer.allocUnsafe(length);
    var pos = 0;
    for(i = 0; i < list.length; ++i){
        var buf = list[i];
        if (!internalIsBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
        }
        buf.copy(buffer, pos);
        pos += buf.length;
    }
    return buffer;
};
function byteLength(string, encoding) {
    if (internalIsBuffer(string)) {
        return string.length;
    }
    if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
        return string.byteLength;
    }
    if (typeof string !== 'string') {
        string = '' + string;
    }
    var len = string.length;
    if (len === 0) return 0;
    var loweredCase = false;
    for(;;){
        switch(encoding){
            case 'ascii':
            case 'latin1':
            case 'binary':
                return len;
            case 'utf8':
            case 'utf-8':
            case undefined:
                return utf8ToBytes(string).length;
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return len * 2;
            case 'hex':
                return len >>> 1;
            case 'base64':
                return base64ToBytes(string).length;
            default:
                if (loweredCase) return utf8ToBytes(string).length;
                encoding = ('' + encoding).toLowerCase();
                loweredCase = true;
        }
    }
}
Buffer.byteLength = byteLength;
function slowToString(encoding, start, end) {
    var loweredCase = false;
    if (start === undefined || start < 0) {
        start = 0;
    }
    if (start > this.length) {
        return '';
    }
    if (end === undefined || end > this.length) {
        end = this.length;
    }
    if (end <= 0) {
        return '';
    }
    end >>>= 0;
    start >>>= 0;
    if (end <= start) {
        return '';
    }
    if (!encoding) encoding = 'utf8';
    while(true){
        switch(encoding){
            case 'hex':
                return hexSlice(this, start, end);
            case 'utf8':
            case 'utf-8':
                return utf8Slice(this, start, end);
            case 'ascii':
                return asciiSlice(this, start, end);
            case 'latin1':
            case 'binary':
                return latin1Slice(this, start, end);
            case 'base64':
                return base64Slice(this, start, end);
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return utf16leSlice(this, start, end);
            default:
                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
                encoding = (encoding + '').toLowerCase();
                loweredCase = true;
        }
    }
}
Buffer.prototype._isBuffer = true;
function swap(b, n, m) {
    var i = b[n];
    b[n] = b[m];
    b[m] = i;
}
Buffer.prototype.swap16 = function swap16() {
    var len = this.length;
    if (len % 2 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 16-bits');
    }
    for(var i = 0; i < len; i += 2){
        swap(this, i, i + 1);
    }
    return this;
};
Buffer.prototype.swap32 = function swap32() {
    var len = this.length;
    if (len % 4 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 32-bits');
    }
    for(var i = 0; i < len; i += 4){
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
    }
    return this;
};
Buffer.prototype.swap64 = function swap64() {
    var len = this.length;
    if (len % 8 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 64-bits');
    }
    for(var i = 0; i < len; i += 8){
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
    }
    return this;
};
Buffer.prototype.toString = function toString() {
    var length = this.length | 0;
    if (length === 0) return '';
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
};
Buffer.prototype.equals = function equals(b) {
    if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer');
    if (this === b) return true;
    return Buffer.compare(this, b) === 0;
};
Buffer.prototype.inspect = function inspect() {
    var str = '';
    var max = INSPECT_MAX_BYTES;
    if (this.length > 0) {
        str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
        if (this.length > max) str += ' ... ';
    }
    return '<Buffer ' + str + '>';
};
Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (!internalIsBuffer(target)) {
        throw new TypeError('Argument must be a Buffer');
    }
    if (start === undefined) {
        start = 0;
    }
    if (end === undefined) {
        end = target ? target.length : 0;
    }
    if (thisStart === undefined) {
        thisStart = 0;
    }
    if (thisEnd === undefined) {
        thisEnd = this.length;
    }
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError('out of range index');
    }
    if (thisStart >= thisEnd && start >= end) {
        return 0;
    }
    if (thisStart >= thisEnd) {
        return -1;
    }
    if (start >= end) {
        return 1;
    }
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    var x2 = thisEnd - thisStart;
    var y2 = end - start;
    var len = Math.min(x2, y2);
    var thisCopy = this.slice(thisStart, thisEnd);
    var targetCopy = target.slice(start, end);
    for(var i = 0; i < len; ++i){
        if (thisCopy[i] !== targetCopy[i]) {
            x2 = thisCopy[i];
            y2 = targetCopy[i];
            break;
        }
    }
    if (x2 < y2) return -1;
    if (y2 < x2) return 1;
    return 0;
};
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    if (buffer.length === 0) return -1;
    if (typeof byteOffset === 'string') {
        encoding = byteOffset;
        byteOffset = 0;
    } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
    } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
    }
    byteOffset = +byteOffset;
    if (isNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
    }
    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
    if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
    }
    if (typeof val === 'string') {
        val = Buffer.from(val, encoding);
    }
    if (internalIsBuffer(val)) {
        if (val.length === 0) {
            return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === 'number') {
        val = val & 255;
        if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
            if (dir) {
                return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
                return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
        }
        return arrayIndexOf(buffer, [
            val
        ], byteOffset, encoding, dir);
    }
    throw new TypeError('val must be string, number or Buffer');
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    var indexSize = 1;
    var arrLength = arr.length;
    var valLength = val.length;
    if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase();
        if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
            if (arr.length < 2 || val.length < 2) {
                return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
        }
    }
    function read1(buf, i) {
        if (indexSize === 1) {
            return buf[i];
        } else {
            return buf.readUInt16BE(i * indexSize);
        }
    }
    var i;
    if (dir) {
        var foundIndex = -1;
        for(i = byteOffset; i < arrLength; i++){
            if (read1(arr, i) === read1(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                if (foundIndex === -1) foundIndex = i;
                if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
                if (foundIndex !== -1) i -= i - foundIndex;
                foundIndex = -1;
            }
        }
    } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for(i = byteOffset; i >= 0; i--){
            var found = true;
            for(var j = 0; j < valLength; j++){
                if (read1(arr, i + j) !== read1(val, j)) {
                    found = false;
                    break;
                }
            }
            if (found) return i;
        }
    }
    return -1;
}
Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    var remaining = buf.length - offset;
    if (!length) {
        length = remaining;
    } else {
        length = Number(length);
        if (length > remaining) {
            length = remaining;
        }
    }
    var strLen = string.length;
    if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');
    if (length > strLen / 2) {
        length = strLen / 2;
    }
    for(var i = 0; i < length; ++i){
        var parsed = parseInt(string.substr(i * 2, 2), 16);
        if (isNaN(parsed)) return i;
        buf[offset + i] = parsed;
    }
    return i;
}
function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function latin1Write(buf, string, offset, length) {
    return asciiWrite(buf, string, offset, length);
}
function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
Buffer.prototype.write = function write(string, offset, length, encoding) {
    if (offset === undefined) {
        encoding = 'utf8';
        length = this.length;
        offset = 0;
    } else if (length === undefined && typeof offset === 'string') {
        encoding = offset;
        length = this.length;
        offset = 0;
    } else if (isFinite(offset)) {
        offset = offset | 0;
        if (isFinite(length)) {
            length = length | 0;
            if (encoding === undefined) encoding = 'utf8';
        } else {
            encoding = length;
            length = undefined;
        }
    } else {
        throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
    }
    var remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError('Attempt to write outside buffer bounds');
    }
    if (!encoding) encoding = 'utf8';
    var loweredCase = false;
    for(;;){
        switch(encoding){
            case 'hex':
                return hexWrite(this, string, offset, length);
            case 'utf8':
            case 'utf-8':
                return utf8Write(this, string, offset, length);
            case 'ascii':
                return asciiWrite(this, string, offset, length);
            case 'latin1':
            case 'binary':
                return latin1Write(this, string, offset, length);
            case 'base64':
                return base64Write(this, string, offset, length);
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return ucs2Write(this, string, offset, length);
            default:
                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
                encoding = ('' + encoding).toLowerCase();
                loweredCase = true;
        }
    }
};
Buffer.prototype.toJSON = function toJSON() {
    return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
    };
};
function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
        return fromByteArray(buf);
    } else {
        return fromByteArray(buf.slice(start, end));
    }
}
function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    var res = [];
    var i = start;
    while(i < end){
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;
            switch(bytesPerSequence){
                case 1:
                    if (firstByte < 128) {
                        codePoint = firstByte;
                    }
                    break;
                case 2:
                    secondByte = buf[i + 1];
                    if ((secondByte & 192) === 128) {
                        tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                        if (tempCodePoint > 127) {
                            codePoint = tempCodePoint;
                        }
                    }
                    break;
                case 3:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                        tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                        if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                            codePoint = tempCodePoint;
                        }
                    }
                    break;
                case 4:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    fourthByte = buf[i + 3];
                    if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                        tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                        if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                            codePoint = tempCodePoint;
                        }
                    }
            }
        }
        if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
        } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
}
var MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(codePoints) {
    var len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
    }
    var res = '';
    var i = 0;
    while(i < len){
        res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }
    return res;
}
function asciiSlice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);
    for(var i = start; i < end; ++i){
        ret += String.fromCharCode(buf[i] & 127);
    }
    return ret;
}
function latin1Slice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);
    for(var i = start; i < end; ++i){
        ret += String.fromCharCode(buf[i]);
    }
    return ret;
}
function hexSlice(buf, start, end) {
    var len = buf.length;
    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;
    var out = '';
    for(var i = start; i < end; ++i){
        out += toHex(buf[i]);
    }
    return out;
}
function utf16leSlice(buf, start, end) {
    var bytes = buf.slice(start, end);
    var res = '';
    for(var i = 0; i < bytes.length; i += 2){
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res;
}
Buffer.prototype.slice = function slice(start, end) {
    var len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;
    if (start < 0) {
        start += len;
        if (start < 0) start = 0;
    } else if (start > len) {
        start = len;
    }
    if (end < 0) {
        end += len;
        if (end < 0) end = 0;
    } else if (end > len) {
        end = len;
    }
    if (end < start) end = start;
    var newBuf;
    if (Buffer.TYPED_ARRAY_SUPPORT) {
        newBuf = this.subarray(start, end);
        newBuf.__proto__ = Buffer.prototype;
    } else {
        var sliceLen = end - start;
        newBuf = new Buffer(sliceLen, undefined);
        for(var i = 0; i < sliceLen; ++i){
            newBuf[i] = this[i + start];
        }
    }
    return newBuf;
};
function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}
Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength1, noAssert) {
    offset = offset | 0;
    byteLength1 = byteLength1 | 0;
    if (!noAssert) checkOffset(offset, byteLength1, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while((++i) < byteLength1 && (mul *= 256)){
        val += this[offset + i] * mul;
    }
    return val;
};
Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength1, noAssert) {
    offset = offset | 0;
    byteLength1 = byteLength1 | 0;
    if (!noAssert) {
        checkOffset(offset, byteLength1, this.length);
    }
    var val = this[offset + --byteLength1];
    var mul = 1;
    while(byteLength1 > 0 && (mul *= 256)){
        val += this[offset + --byteLength1] * mul;
    }
    return val;
};
Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
};
Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
};
Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
};
Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
};
Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};
Buffer.prototype.readIntLE = function readIntLE(offset, byteLength1, noAssert) {
    offset = offset | 0;
    byteLength1 = byteLength1 | 0;
    if (!noAssert) checkOffset(offset, byteLength1, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while((++i) < byteLength1 && (mul *= 256)){
        val += this[offset + i] * mul;
    }
    mul *= 128;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength1);
    return val;
};
Buffer.prototype.readIntBE = function readIntBE(offset, byteLength1, noAssert) {
    offset = offset | 0;
    byteLength1 = byteLength1 | 0;
    if (!noAssert) checkOffset(offset, byteLength1, this.length);
    var i = byteLength1;
    var mul = 1;
    var val = this[offset + --i];
    while(i > 0 && (mul *= 256)){
        val += this[offset + --i] * mul;
    }
    mul *= 128;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength1);
    return val;
};
Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128)) return this[offset];
    return (255 - this[offset] + 1) * -1;
};
Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
};
Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
};
Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};
Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};
Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return read(this, offset, true, 23, 4);
};
Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return read(this, offset, false, 23, 4);
};
Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length);
    return read(this, offset, true, 52, 8);
};
Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length);
    return read(this, offset, false, 52, 8);
};
function checkInt(buf, value, offset, ext, max, min) {
    if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
}
Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength1, noAssert) {
    value = +value;
    offset = offset | 0;
    byteLength1 = byteLength1 | 0;
    if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength1) - 1;
        checkInt(this, value, offset, byteLength1, maxBytes, 0);
    }
    var mul = 1;
    var i = 0;
    this[offset] = value & 255;
    while((++i) < byteLength1 && (mul *= 256)){
        this[offset + i] = value / mul & 255;
    }
    return offset + byteLength1;
};
Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength1, noAssert) {
    value = +value;
    offset = offset | 0;
    byteLength1 = byteLength1 | 0;
    if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength1) - 1;
        checkInt(this, value, offset, byteLength1, maxBytes, 0);
    }
    var i = byteLength1 - 1;
    var mul = 1;
    this[offset + i] = value & 255;
    while((--i) >= 0 && (mul *= 256)){
        this[offset + i] = value / mul & 255;
    }
    return offset + byteLength1;
};
Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    this[offset] = value & 255;
    return offset + 1;
};
function objectWriteUInt16(buf, value, offset, littleEndian) {
    if (value < 0) value = 65535 + value + 1;
    for(var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i){
        buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
    }
}
Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
    } else {
        objectWriteUInt16(this, value, offset, true);
    }
    return offset + 2;
};
Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
    } else {
        objectWriteUInt16(this, value, offset, false);
    }
    return offset + 2;
};
function objectWriteUInt32(buf, value, offset, littleEndian) {
    if (value < 0) value = 4294967295 + value + 1;
    for(var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i){
        buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 255;
    }
}
Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
    } else {
        objectWriteUInt32(this, value, offset, true);
    }
    return offset + 4;
};
Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
    } else {
        objectWriteUInt32(this, value, offset, false);
    }
    return offset + 4;
};
Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength1, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength1 - 1);
        checkInt(this, value, offset, byteLength1, limit - 1, -limit);
    }
    var i = 0;
    var mul = 1;
    var sub = 0;
    this[offset] = value & 255;
    while((++i) < byteLength1 && (mul *= 256)){
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength1;
};
Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength1, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength1 - 1);
        checkInt(this, value, offset, byteLength1, limit - 1, -limit);
    }
    var i = byteLength1 - 1;
    var mul = 1;
    var sub = 0;
    this[offset + i] = value & 255;
    while((--i) >= 0 && (mul *= 256)){
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength1;
};
Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    if (value < 0) value = 255 + value + 1;
    this[offset] = value & 255;
    return offset + 1;
};
Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
    } else {
        objectWriteUInt16(this, value, offset, true);
    }
    return offset + 2;
};
Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
    } else {
        objectWriteUInt16(this, value, offset, false);
    }
    return offset + 2;
};
Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
    } else {
        objectWriteUInt32(this, value, offset, true);
    }
    return offset + 4;
};
Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
    if (value < 0) value = 4294967295 + value + 1;
    if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
    } else {
        objectWriteUInt32(this, value, offset, false);
    }
    return offset + 4;
};
function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
    if (offset < 0) throw new RangeError('Index out of range');
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
        checkIEEE754(buf, value, offset, 4);
    }
    write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
}
Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
};
Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
};
function writeDouble(buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
        checkIEEE754(buf, value, offset, 8);
    }
    write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
}
Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
};
Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
};
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;
    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;
    if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds');
    }
    if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
    if (end < 0) throw new RangeError('sourceEnd out of bounds');
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
    }
    var len = end - start;
    var i;
    if (this === target && start < targetStart && targetStart < end) {
        for(i = len - 1; i >= 0; --i){
            target[i + targetStart] = this[i + start];
        }
    } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
        for(i = 0; i < len; ++i){
            target[i + targetStart] = this[i + start];
        }
    } else {
        Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
    }
    return len;
};
Buffer.prototype.fill = function fill(val, start, end, encoding) {
    if (typeof val === 'string') {
        if (typeof start === 'string') {
            encoding = start;
            start = 0;
            end = this.length;
        } else if (typeof end === 'string') {
            encoding = end;
            end = this.length;
        }
        if (val.length === 1) {
            var code = val.charCodeAt(0);
            if (code < 256) {
                val = code;
            }
        }
        if (encoding !== undefined && typeof encoding !== 'string') {
            throw new TypeError('encoding must be a string');
        }
        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
            throw new TypeError('Unknown encoding: ' + encoding);
        }
    } else if (typeof val === 'number') {
        val = val & 255;
    }
    if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError('Out of range index');
    }
    if (end <= start) {
        return this;
    }
    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val) val = 0;
    var i;
    if (typeof val === 'number') {
        for(i = start; i < end; ++i){
            this[i] = val;
        }
    } else {
        var bytes = internalIsBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
        var len = bytes.length;
        for(i = 0; i < end - start; ++i){
            this[i + start] = bytes[i % len];
        }
    }
    return this;
};
var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
function base64clean(str) {
    str = stringtrim(str).replace(INVALID_BASE64_RE, '');
    if (str.length < 2) return '';
    while(str.length % 4 !== 0){
        str = str + '=';
    }
    return str;
}
function stringtrim(str) {
    if (str.trim) return str.trim();
    return str.replace(/^\s+|\s+$/g, '');
}
function toHex(n) {
    if (n < 16) return '0' + n.toString(16);
    return n.toString(16);
}
function utf8ToBytes(string, units) {
    units = units || Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];
    for(var i = 0; i < length; ++i){
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
                if (codePoint > 56319) {
                    if ((units -= 3) > -1) bytes.push(239, 191, 189);
                    continue;
                } else if (i + 1 === length) {
                    if ((units -= 3) > -1) bytes.push(239, 191, 189);
                    continue;
                }
                leadSurrogate = codePoint;
                continue;
            }
            if (codePoint < 56320) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                leadSurrogate = codePoint;
                continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
        } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
        } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else {
            throw new Error('Invalid code point');
        }
    }
    return bytes;
}
function asciiToBytes(str) {
    var byteArray = [];
    for(var i = 0; i < str.length; ++i){
        byteArray.push(str.charCodeAt(i) & 255);
    }
    return byteArray;
}
function utf16leToBytes(str, units) {
    var c, hi, lo;
    var byteArray = [];
    for(var i = 0; i < str.length; ++i){
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
    }
    return byteArray;
}
function base64ToBytes(str) {
    return toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
    for(var i = 0; i < length; ++i){
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
    }
    return i;
}
function isnan(val) {
    return val !== val;
}
function isBuffer(obj) {
    return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj));
}
function isFastBuffer(obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
}
function isSlowBuffer(obj) {
    return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0));
}
var commonjsGlobal1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {
};
function createCommonjsModule1(fn, basedir, module) {
    return module = {
        path: basedir,
        exports: {
        },
        require: function(path, base) {
            return commonjsRequire2(path, base === undefined || base === null ? module.path : base);
        }
    }, fn(module, module.exports), module.exports;
}
function commonjsRequire2() {
    throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}
var jszip_min = createCommonjsModule1(function(module, exports) {
    !(function(t) {
        module.exports = t();
    })(function() {
        return (function s(a, o, h) {
            function u(r, t) {
                if (!o[r]) {
                    if (!a[r]) {
                        var e = "function" == typeof commonjsRequire2 && commonjsRequire2;
                        if (!t && e) return e(r, !0);
                        if (l) return l(r, !0);
                        var i = new Error("Cannot find module '" + r + "'");
                        throw i.code = "MODULE_NOT_FOUND", i;
                    }
                    var n = o[r] = {
                        exports: {
                        }
                    };
                    a[r][0].call(n.exports, function(t1) {
                        var e = a[r][1][t1];
                        return u(e || t1);
                    }, n, n.exports, s, a, o, h);
                }
                return o[r].exports;
            }
            for(var l = "function" == typeof commonjsRequire2 && commonjsRequire2, t = 0; t < h.length; t++)u(h[t]);
            return u;
        })({
            1: [
                function(t, e, r) {
                    var c = t("./utils"), d = t("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                    r.encode = function(t1) {
                        for(var e1, r1, i, n, s1, a, o, h = [], u = 0, l = t1.length, f = l, d1 = "string" !== c.getTypeOf(t1); u < t1.length;)f = l - u, i = d1 ? (e1 = t1[u++], r1 = u < l ? t1[u++] : 0, u < l ? t1[u++] : 0) : (e1 = t1.charCodeAt(u++), r1 = u < l ? t1.charCodeAt(u++) : 0, u < l ? t1.charCodeAt(u++) : 0), n = e1 >> 2, s1 = (3 & e1) << 4 | r1 >> 4, a = 1 < f ? (15 & r1) << 2 | i >> 6 : 64, o = 2 < f ? 63 & i : 64, h.push(p.charAt(n) + p.charAt(s1) + p.charAt(a) + p.charAt(o));
                        return h.join("");
                    }, r.decode = function(t1) {
                        var e1, r1, i, n, s1, a, o = 0, h = 0, u = "data:";
                        if (t1.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
                        var l, f = 3 * (t1 = t1.replace(/[^A-Za-z0-9\+\/\=]/g, "")).length / 4;
                        if (t1.charAt(t1.length - 1) === p.charAt(64) && f--, t1.charAt(t1.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
                        for(l = d.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < t1.length;)e1 = p.indexOf(t1.charAt(o++)) << 2 | (n = p.indexOf(t1.charAt(o++))) >> 4, r1 = (15 & n) << 4 | (s1 = p.indexOf(t1.charAt(o++))) >> 2, i = (3 & s1) << 6 | (a = p.indexOf(t1.charAt(o++))), l[h++] = e1, 64 !== s1 && (l[h++] = r1), 64 !== a && (l[h++] = i);
                        return l;
                    };
                },
                {
                    "./support": 30,
                    "./utils": 32
                }
            ],
            2: [
                function(t, e, r) {
                    var i = t("./external"), n = t("./stream/DataWorker"), s1 = t("./stream/DataLengthProbe"), a = t("./stream/Crc32Probe");
                    s1 = t("./stream/DataLengthProbe");
                    function o(t1, e1, r1, i2, n1) {
                        this.compressedSize = t1, this.uncompressedSize = e1, this.crc32 = r1, this.compression = i2, this.compressedContent = n1;
                    }
                    o.prototype = {
                        getContentWorker: function() {
                            var t1 = new n(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new s1("data_length")), e1 = this;
                            return t1.on("end", function() {
                                if (this.streamInfo.data_length !== e1.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
                            }), t1;
                        },
                        getCompressedWorker: function() {
                            return new n(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
                        }
                    }, o.createWorkerFrom = function(t1, e1, r1) {
                        return t1.pipe(new a).pipe(new s1("uncompressedSize")).pipe(e1.compressWorker(r1)).pipe(new s1("compressedSize")).withStreamInfo("compression", e1);
                    }, e.exports = o;
                },
                {
                    "./external": 6,
                    "./stream/Crc32Probe": 25,
                    "./stream/DataLengthProbe": 26,
                    "./stream/DataWorker": 27
                }
            ],
            3: [
                function(t, e, r) {
                    var i = t("./stream/GenericWorker");
                    r.STORE = {
                        magic: "\0\0",
                        compressWorker: function(t1) {
                            return new i("STORE compression");
                        },
                        uncompressWorker: function() {
                            return new i("STORE decompression");
                        }
                    }, r.DEFLATE = t("./flate");
                },
                {
                    "./flate": 7,
                    "./stream/GenericWorker": 28
                }
            ],
            4: [
                function(t, e, r) {
                    var i = t("./utils");
                    var o = function() {
                        for(var t1, e1 = [], r1 = 0; r1 < 256; r1++){
                            t1 = r1;
                            for(var i2 = 0; i2 < 8; i2++)t1 = 1 & t1 ? 3988292384 ^ t1 >>> 1 : t1 >>> 1;
                            e1[r1] = t1;
                        }
                        return e1;
                    }();
                    e.exports = function(t1, e1) {
                        return (void 0) !== t1 && t1.length ? "string" !== i.getTypeOf(t1) ? (function(t2, e2, r1, i2) {
                            var n = o, s1 = i2 + r1;
                            t2 ^= -1;
                            for(var a = i2; a < s1; a++)t2 = t2 >>> 8 ^ n[255 & (t2 ^ e2[a])];
                            return -1 ^ t2;
                        })(0 | e1, t1, t1.length, 0) : (function(t2, e2, r1, i2) {
                            var n = o, s1 = i2 + r1;
                            t2 ^= -1;
                            for(var a = i2; a < s1; a++)t2 = t2 >>> 8 ^ n[255 & (t2 ^ e2.charCodeAt(a))];
                            return -1 ^ t2;
                        })(0 | e1, t1, t1.length, 0) : 0;
                    };
                },
                {
                    "./utils": 32
                }
            ],
            5: [
                function(t, e, r) {
                    r.base64 = !1, r.binary = !1, r.dir = !1, r.createFolders = !0, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
                },
                {
                }
            ],
            6: [
                function(t, e, r) {
                    var i = null;
                    i = "undefined" != typeof Promise ? Promise : t("lie"), e.exports = {
                        Promise: i
                    };
                },
                {
                    lie: 37
                }
            ],
            7: [
                function(t, e, r) {
                    var i = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, n = t("pako"), s1 = t("./utils"), a = t("./stream/GenericWorker"), o = i ? "uint8array" : "array";
                    function h(t1, e1) {
                        a.call(this, "FlateWorker/" + t1), this._pako = null, this._pakoAction = t1, this._pakoOptions = e1, this.meta = {
                        };
                    }
                    r.magic = "\b\0", s1.inherits(h, a), h.prototype.processChunk = function(t1) {
                        this.meta = t1.meta, null === this._pako && this._createPako(), this._pako.push(s1.transformTo(o, t1.data), !1);
                    }, h.prototype.flush = function() {
                        a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], !0);
                    }, h.prototype.cleanUp = function() {
                        a.prototype.cleanUp.call(this), this._pako = null;
                    }, h.prototype._createPako = function() {
                        this._pako = new n[this._pakoAction]({
                            raw: !0,
                            level: this._pakoOptions.level || -1
                        });
                        var e1 = this;
                        this._pako.onData = function(t1) {
                            e1.push({
                                data: t1,
                                meta: e1.meta
                            });
                        };
                    }, r.compressWorker = function(t1) {
                        return new h("Deflate", t1);
                    }, r.uncompressWorker = function() {
                        return new h("Inflate", {
                        });
                    };
                },
                {
                    "./stream/GenericWorker": 28,
                    "./utils": 32,
                    pako: 38
                }
            ],
            8: [
                function(t, e, r) {
                    function A(t1, e1) {
                        var r1, i = "";
                        for(r1 = 0; r1 < e1; r1++)i += String.fromCharCode(255 & t1), t1 >>>= 8;
                        return i;
                    }
                    function i(t1, e1, r1, i2, n, s1) {
                        var a, o, h = t1.file, u = t1.compression, l = s1 !== O.utf8encode, f = I.transformTo("string", s1(h.name)), d = I.transformTo("string", O.utf8encode(h.name)), c = h.comment, p = I.transformTo("string", s1(c)), m = I.transformTo("string", O.utf8encode(c)), _ = d.length !== h.name.length, g = m.length !== c.length, b = "", v = "", y2 = "", w = h.dir, k = h.date, x2 = {
                            crc32: 0,
                            compressedSize: 0,
                            uncompressedSize: 0
                        };
                        e1 && !r1 || (x2.crc32 = t1.crc32, x2.compressedSize = t1.compressedSize, x2.uncompressedSize = t1.uncompressedSize);
                        var S = 0;
                        e1 && (S |= 8), l || !_ && !g || (S |= 2048);
                        var z = 0, C = 0;
                        w && (z |= 16), "UNIX" === n ? (C = 798, z |= (function(t2, e2) {
                            var r2 = t2;
                            return t2 || (r2 = e2 ? 16893 : 33204), (65535 & r2) << 16;
                        })(h.unixPermissions, w)) : (C = 20, z |= (function(t2) {
                            return 63 & (t2 || 0);
                        })(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + d, b += "up" + A(v.length, 2) + v), g && (y2 = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y2.length, 2) + y2);
                        var E = "";
                        return (E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x2.crc32, 4), E += A(x2.compressedSize, 4), E += A(x2.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), {
                            fileRecord: R.LOCAL_FILE_HEADER + E + f + b,
                            dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(i2, 4) + f + b + p
                        });
                    }
                    var I = t("../utils"), n = t("../stream/GenericWorker"), O = t("../utf8"), B = t("../crc32"), R = t("../signature");
                    function s1(t1, e1, r1, i2) {
                        n.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = e1, this.zipPlatform = r1, this.encodeFileName = i2, this.streamFiles = t1, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
                    }
                    I.inherits(s1, n), s1.prototype.push = function(t1) {
                        var e1 = t1.meta.percent || 0, r1 = this.entriesCount, i2 = this._sources.length;
                        this.accumulate ? this.contentBuffer.push(t1) : (this.bytesWritten += t1.data.length, n.prototype.push.call(this, {
                            data: t1.data,
                            meta: {
                                currentFile: this.currentFile,
                                percent: r1 ? (e1 + 100 * (r1 - i2 - 1)) / r1 : 100
                            }
                        }));
                    }, s1.prototype.openedSource = function(t1) {
                        this.currentSourceOffset = this.bytesWritten, this.currentFile = t1.file.name;
                        var e1 = this.streamFiles && !t1.file.dir;
                        if (e1) {
                            var r1 = i(t1, e1, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                            this.push({
                                data: r1.fileRecord,
                                meta: {
                                    percent: 0
                                }
                            });
                        } else this.accumulate = !0;
                    }, s1.prototype.closedSource = function(t1) {
                        this.accumulate = !1;
                        var e1 = this.streamFiles && !t1.file.dir, r1 = i(t1, e1, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                        if (this.dirRecords.push(r1.dirRecord), e1) this.push({
                            data: function(t2) {
                                return R.DATA_DESCRIPTOR + A(t2.crc32, 4) + A(t2.compressedSize, 4) + A(t2.uncompressedSize, 4);
                            }(t1),
                            meta: {
                                percent: 100
                            }
                        });
                        else for(this.push({
                            data: r1.fileRecord,
                            meta: {
                                percent: 0
                            }
                        }); this.contentBuffer.length;)this.push(this.contentBuffer.shift());
                        this.currentFile = null;
                    }, s1.prototype.flush = function() {
                        for(var t1 = this.bytesWritten, e1 = 0; e1 < this.dirRecords.length; e1++)this.push({
                            data: this.dirRecords[e1],
                            meta: {
                                percent: 100
                            }
                        });
                        var r1 = this.bytesWritten - t1, i2 = function(t2, e2, r2, i6, n1) {
                            var s2 = I.transformTo("string", n1(i6));
                            return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(t2, 2) + A(t2, 2) + A(e2, 4) + A(r2, 4) + A(s2.length, 2) + s2;
                        }(this.dirRecords.length, r1, t1, this.zipComment, this.encodeFileName);
                        this.push({
                            data: i2,
                            meta: {
                                percent: 100
                            }
                        });
                    }, s1.prototype.prepareNextSource = function() {
                        this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
                    }, s1.prototype.registerPrevious = function(t1) {
                        this._sources.push(t1);
                        var e1 = this;
                        return t1.on("data", function(t2) {
                            e1.processChunk(t2);
                        }), t1.on("end", function() {
                            e1.closedSource(e1.previous.streamInfo), e1._sources.length ? e1.prepareNextSource() : e1.end();
                        }), t1.on("error", function(t2) {
                            e1.error(t2);
                        }), this;
                    }, s1.prototype.resume = function() {
                        return !!n.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
                    }, s1.prototype.error = function(t1) {
                        var e1 = this._sources;
                        if (!n.prototype.error.call(this, t1)) return !1;
                        for(var r1 = 0; r1 < e1.length; r1++)try {
                            e1[r1].error(t1);
                        } catch (t) {
                        }
                        return !0;
                    }, s1.prototype.lock = function() {
                        n.prototype.lock.call(this);
                        for(var t1 = this._sources, e1 = 0; e1 < t1.length; e1++)t1[e1].lock();
                    }, e.exports = s1;
                },
                {
                    "../crc32": 4,
                    "../signature": 23,
                    "../stream/GenericWorker": 28,
                    "../utf8": 31,
                    "../utils": 32
                }
            ],
            9: [
                function(t, e, r) {
                    var u = t("../compressions"), i = t("./ZipFileWorker");
                    r.generateWorker = function(t1, a, e1) {
                        var o = new i(a.streamFiles, e1, a.platform, a.encodeFileName), h = 0;
                        try {
                            t1.forEach(function(t2, e2) {
                                h++;
                                var r1 = function(t3, e3) {
                                    var r1 = t3 || e3, i2 = u[r1];
                                    if (!i2) throw new Error(r1 + " is not a valid compression method !");
                                    return i2;
                                }(e2.options.compression, a.compression), i2 = e2.options.compressionOptions || a.compressionOptions || {
                                }, n = e2.dir, s1 = e2.date;
                                e2._compressWorker(r1, i2).withStreamInfo("file", {
                                    name: t2,
                                    dir: n,
                                    date: s1,
                                    comment: e2.comment || "",
                                    unixPermissions: e2.unixPermissions,
                                    dosPermissions: e2.dosPermissions
                                }).pipe(o);
                            }), o.entriesCount = h;
                        } catch (t) {
                            o.error(t);
                        }
                        return o;
                    };
                },
                {
                    "../compressions": 3,
                    "./ZipFileWorker": 8
                }
            ],
            10: [
                function(t, e, r) {
                    function i() {
                        if (!(this instanceof i)) return new i;
                        if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
                        this.files = {
                        }, this.comment = null, this.root = "", this.clone = function() {
                            var t1 = new i;
                            for(var e1 in this)"function" != typeof this[e1] && (t1[e1] = this[e1]);
                            return t1;
                        };
                    }
                    (i.prototype = t("./object")).loadAsync = t("./load"), i.support = t("./support"), i.defaults = t("./defaults"), i.version = "3.5.0", i.loadAsync = function(t1, e1) {
                        return (new i).loadAsync(t1, e1);
                    }, i.external = t("./external"), e.exports = i;
                },
                {
                    "./defaults": 5,
                    "./external": 6,
                    "./load": 11,
                    "./object": 15,
                    "./support": 30
                }
            ],
            11: [
                function(t, e, r) {
                    var i = t("./utils"), n = t("./external"), o = t("./utf8"), h = (i = t("./utils"), t("./zipEntries")), s1 = t("./stream/Crc32Probe"), u = t("./nodejsUtils");
                    function l(i2) {
                        return new n.Promise(function(t1, e1) {
                            var r1 = i2.decompressed.getContentWorker().pipe(new s1);
                            r1.on("error", function(t2) {
                                e1(t2);
                            }).on("end", function() {
                                r1.streamInfo.crc32 !== i2.decompressed.crc32 ? e1(new Error("Corrupted zip : CRC32 mismatch")) : t1();
                            }).resume();
                        });
                    }
                    e.exports = function(t1, s2) {
                        var a = this;
                        return s2 = i.extend(s2 || {
                        }, {
                            base64: !1,
                            checkCRC32: !1,
                            optimizedBinaryString: !1,
                            createFolders: !1,
                            decodeFileName: o.utf8decode
                        }), u.isNode && u.isStream(t1) ? n.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : i.prepareContent("the loaded zip file", t1, !0, s2.optimizedBinaryString, s2.base64).then(function(t2) {
                            var e1 = new h(s2);
                            return (e1.load(t2), e1);
                        }).then(function(t2) {
                            var e1 = [
                                n.Promise.resolve(t2)
                            ], r1 = t2.files;
                            if (s2.checkCRC32) for(var i2 = 0; i2 < r1.length; i2++)e1.push(l(r1[i2]));
                            return n.Promise.all(e1);
                        }).then(function(t2) {
                            for(var e1 = t2.shift(), r1 = e1.files, i2 = 0; i2 < r1.length; i2++){
                                var n1 = r1[i2];
                                a.file(n1.fileNameStr, n1.decompressed, {
                                    binary: !0,
                                    optimizedBinaryString: !0,
                                    date: n1.date,
                                    dir: n1.dir,
                                    comment: n1.fileCommentStr.length ? n1.fileCommentStr : null,
                                    unixPermissions: n1.unixPermissions,
                                    dosPermissions: n1.dosPermissions,
                                    createFolders: s2.createFolders
                                });
                            }
                            return (e1.zipComment.length && (a.comment = e1.zipComment), a);
                        });
                    };
                },
                {
                    "./external": 6,
                    "./nodejsUtils": 14,
                    "./stream/Crc32Probe": 25,
                    "./utf8": 31,
                    "./utils": 32,
                    "./zipEntries": 33
                }
            ],
            12: [
                function(t, e, r) {
                    var i = t("../utils"), n = t("../stream/GenericWorker");
                    function s1(t1, e1) {
                        n.call(this, "Nodejs stream input adapter for " + t1), this._upstreamEnded = !1, this._bindStream(e1);
                    }
                    i.inherits(s1, n), s1.prototype._bindStream = function(t1) {
                        var e1 = this;
                        (this._stream = t1).pause(), t1.on("data", function(t2) {
                            e1.push({
                                data: t2,
                                meta: {
                                    percent: 0
                                }
                            });
                        }).on("error", function(t2) {
                            e1.isPaused ? this.generatedError = t2 : e1.error(t2);
                        }).on("end", function() {
                            e1.isPaused ? e1._upstreamEnded = !0 : e1.end();
                        });
                    }, s1.prototype.pause = function() {
                        return !!n.prototype.pause.call(this) && (this._stream.pause(), !0);
                    }, s1.prototype.resume = function() {
                        return !!n.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
                    }, e.exports = s1;
                },
                {
                    "../stream/GenericWorker": 28,
                    "../utils": 32
                }
            ],
            13: [
                function(t, e, r) {
                    var n = t("readable-stream").Readable;
                    function i(t1, e1, r1) {
                        n.call(this, e1), this._helper = t1;
                        var i = this;
                        t1.on("data", function(t2, e2) {
                            i.push(t2) || i._helper.pause(), r1 && r1(e2);
                        }).on("error", function(t2) {
                            i.emit("error", t2);
                        }).on("end", function() {
                            i.push(null);
                        });
                    }
                    t("../utils").inherits(i, n), i.prototype._read = function() {
                        this._helper.resume();
                    }, e.exports = i;
                },
                {
                    "../utils": 32,
                    "readable-stream": 16
                }
            ],
            14: [
                function(t, e, r) {
                    e.exports = {
                        isNode: "undefined" != typeof Buffer,
                        newBufferFrom: function(t1, e1) {
                            if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(t1, e1);
                            if ("number" == typeof t1) throw new Error('The "data" argument must not be a number');
                            return new Buffer(t1, e1);
                        },
                        allocBuffer: function(t1) {
                            if (Buffer.alloc) return Buffer.alloc(t1);
                            var e1 = new Buffer(t1);
                            return e1.fill(0), e1;
                        },
                        isBuffer: function(t1) {
                            return Buffer.isBuffer(t1);
                        },
                        isStream: function(t1) {
                            return t1 && "function" == typeof t1.on && "function" == typeof t1.pause && "function" == typeof t1.resume;
                        }
                    };
                },
                {
                }
            ],
            15: [
                function(t, e, r) {
                    function s1(t1, e1, r1) {
                        var i, n = u.getTypeOf(e1), s1 = u.extend(r1 || {
                        }, f);
                        s1.date = s1.date || new Date, null !== s1.compression && (s1.compression = s1.compression.toUpperCase()), "string" == typeof s1.unixPermissions && (s1.unixPermissions = parseInt(s1.unixPermissions, 8)), s1.unixPermissions && 16384 & s1.unixPermissions && (s1.dir = !0), s1.dosPermissions && 16 & s1.dosPermissions && (s1.dir = !0), s1.dir && (t1 = g(t1)), s1.createFolders && (i = _(t1)) && b.call(this, i, !0);
                        var a = "string" === n && !1 === s1.binary && !1 === s1.base64;
                        r1 && (void 0) !== r1.binary || (s1.binary = !a), (e1 instanceof d && 0 === e1.uncompressedSize || s1.dir || !e1 || 0 === e1.length) && (s1.base64 = !1, s1.binary = !0, e1 = "", s1.compression = "STORE", n = "string");
                        var o = null;
                        o = e1 instanceof d || e1 instanceof l ? e1 : p.isNode && p.isStream(e1) ? new m(t1, e1) : u.prepareContent(t1, e1, s1.binary, s1.optimizedBinaryString, s1.base64);
                        var h = new c(t1, o, s1);
                        this.files[t1] = h;
                    }
                    var n = t("./utf8"), u = t("./utils"), l = t("./stream/GenericWorker"), a = t("./stream/StreamHelper"), f = t("./defaults"), d = t("./compressedObject"), c = t("./zipObject"), o = t("./generate"), p = t("./nodejsUtils"), m = t("./nodejs/NodejsStreamInputAdapter"), _ = function(t1) {
                        "/" === t1.slice(-1) && (t1 = t1.substring(0, t1.length - 1));
                        var e1 = t1.lastIndexOf("/");
                        return 0 < e1 ? t1.substring(0, e1) : "";
                    }, g = function(t1) {
                        return ("/" !== t1.slice(-1) && (t1 += "/"), t1);
                    }, b = function(t1, e1) {
                        return (e1 = (void 0) !== e1 ? e1 : f.createFolders, t1 = g(t1), this.files[t1] || s1.call(this, t1, null, {
                            dir: !0,
                            createFolders: e1
                        }), this.files[t1]);
                    };
                    function h(t1) {
                        return "[object RegExp]" === Object.prototype.toString.call(t1);
                    }
                    var i = {
                        load: function() {
                            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
                        },
                        forEach: function(t1) {
                            var e1, r1, i;
                            for(e1 in this.files)this.files.hasOwnProperty(e1) && (i = this.files[e1], (r1 = e1.slice(this.root.length, e1.length)) && e1.slice(0, this.root.length) === this.root && t1(r1, i));
                        },
                        filter: function(r1) {
                            var i = [];
                            return (this.forEach(function(t1, e1) {
                                r1(t1, e1) && i.push(e1);
                            }), i);
                        },
                        file: function(t1, e1, r1) {
                            if (1 !== arguments.length) return (t1 = this.root + t1, s1.call(this, t1, e1, r1), this);
                            if (h(t1)) {
                                var i = t1;
                                return this.filter(function(t2, e2) {
                                    return !e2.dir && i.test(t2);
                                });
                            }
                            var n1 = this.files[this.root + t1];
                            return n1 && !n1.dir ? n1 : null;
                        },
                        folder: function(r1) {
                            if (!r1) return this;
                            if (h(r1)) return this.filter(function(t1, e1) {
                                return e1.dir && r1.test(t1);
                            });
                            var t1 = this.root + r1, e1 = b.call(this, t1), i = this.clone();
                            return (i.root = e1.name, i);
                        },
                        remove: function(r1) {
                            r1 = this.root + r1;
                            var t1 = this.files[r1];
                            if ((t1 || ("/" !== r1.slice(-1) && (r1 += "/"), t1 = this.files[r1]), t1 && !t1.dir)) delete this.files[r1];
                            else for(var e1 = this.filter(function(t2, e2) {
                                return e2.name.slice(0, r1.length) === r1;
                            }), i = 0; i < e1.length; i++)delete this.files[e1[i].name];
                            return this;
                        },
                        generate: function(t1) {
                            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
                        },
                        generateInternalStream: function(t1) {
                            var e1, r1 = {
                            };
                            try {
                                if (((r1 = u.extend(t1 || {
                                }, {
                                    streamFiles: !1,
                                    compression: "STORE",
                                    compressionOptions: null,
                                    type: "",
                                    platform: "DOS",
                                    comment: null,
                                    mimeType: "application/zip",
                                    encodeFileName: n.utf8encode
                                })).type = r1.type.toLowerCase(), r1.compression = r1.compression.toUpperCase(), "binarystring" === r1.type && (r1.type = "string"), !r1.type)) throw new Error("No output type specified.");
                                u.checkSupport(r1.type), "darwin" !== r1.platform && "freebsd" !== r1.platform && "linux" !== r1.platform && "sunos" !== r1.platform || (r1.platform = "UNIX"), "win32" === r1.platform && (r1.platform = "DOS");
                                var i = r1.comment || this.comment || "";
                                e1 = o.generateWorker(this, r1, i);
                            } catch (t) {
                                (e1 = new l("error")).error(t);
                            }
                            return new a(e1, r1.type || "string", r1.mimeType);
                        },
                        generateAsync: function(t1, e1) {
                            return this.generateInternalStream(t1).accumulate(e1);
                        },
                        generateNodeStream: function(t1, e1) {
                            return ((t1 = t1 || {
                            }).type || (t1.type = "nodebuffer"), this.generateInternalStream(t1).toNodejsStream(e1));
                        }
                    };
                    e.exports = i;
                },
                {
                    "./compressedObject": 2,
                    "./defaults": 5,
                    "./generate": 9,
                    "./nodejs/NodejsStreamInputAdapter": 12,
                    "./nodejsUtils": 14,
                    "./stream/GenericWorker": 28,
                    "./stream/StreamHelper": 29,
                    "./utf8": 31,
                    "./utils": 32,
                    "./zipObject": 35
                }
            ],
            16: [
                function(t, e, r) {
                    e.exports = t("stream");
                },
                {
                    stream: void 0
                }
            ],
            17: [
                function(t, e, r) {
                    var i = t("./DataReader");
                    function n(t1) {
                        i.call(this, t1);
                        for(var e1 = 0; e1 < this.data.length; e1++)t1[e1] = 255 & t1[e1];
                    }
                    t("../utils").inherits(n, i), n.prototype.byteAt = function(t1) {
                        return this.data[this.zero + t1];
                    }, n.prototype.lastIndexOfSignature = function(t1) {
                        for(var e1 = t1.charCodeAt(0), r1 = t1.charCodeAt(1), i2 = t1.charCodeAt(2), n1 = t1.charCodeAt(3), s1 = this.length - 4; 0 <= s1; --s1)if (this.data[s1] === e1 && this.data[s1 + 1] === r1 && this.data[s1 + 2] === i2 && this.data[s1 + 3] === n1) return s1 - this.zero;
                        return -1;
                    }, n.prototype.readAndCheckSignature = function(t1) {
                        var e1 = t1.charCodeAt(0), r1 = t1.charCodeAt(1), i2 = t1.charCodeAt(2), n1 = t1.charCodeAt(3), s1 = this.readData(4);
                        return e1 === s1[0] && r1 === s1[1] && i2 === s1[2] && n1 === s1[3];
                    }, n.prototype.readData = function(t1) {
                        if (this.checkOffset(t1), 0 === t1) return [];
                        var e1 = this.data.slice(this.zero + this.index, this.zero + this.index + t1);
                        return this.index += t1, e1;
                    }, e.exports = n;
                },
                {
                    "../utils": 32,
                    "./DataReader": 18
                }
            ],
            18: [
                function(t, e, r) {
                    var i = t("../utils");
                    function n(t1) {
                        this.data = t1, this.length = t1.length, this.index = 0, this.zero = 0;
                    }
                    n.prototype = {
                        checkOffset: function(t1) {
                            this.checkIndex(this.index + t1);
                        },
                        checkIndex: function(t1) {
                            if (this.length < this.zero + t1 || t1 < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + t1 + "). Corrupted zip ?");
                        },
                        setIndex: function(t1) {
                            this.checkIndex(t1), this.index = t1;
                        },
                        skip: function(t1) {
                            this.setIndex(this.index + t1);
                        },
                        byteAt: function(t1) {
                        },
                        readInt: function(t1) {
                            var e1, r1 = 0;
                            for(this.checkOffset(t1), e1 = this.index + t1 - 1; e1 >= this.index; e1--)r1 = (r1 << 8) + this.byteAt(e1);
                            return this.index += t1, r1;
                        },
                        readString: function(t1) {
                            return i.transformTo("string", this.readData(t1));
                        },
                        readData: function(t1) {
                        },
                        lastIndexOfSignature: function(t1) {
                        },
                        readAndCheckSignature: function(t1) {
                        },
                        readDate: function() {
                            var t1 = this.readInt(4);
                            return new Date(Date.UTC(1980 + (t1 >> 25 & 127), (t1 >> 21 & 15) - 1, t1 >> 16 & 31, t1 >> 11 & 31, t1 >> 5 & 63, (31 & t1) << 1));
                        }
                    }, e.exports = n;
                },
                {
                    "../utils": 32
                }
            ],
            19: [
                function(t, e, r) {
                    var i = t("./Uint8ArrayReader");
                    function n(t1) {
                        i.call(this, t1);
                    }
                    t("../utils").inherits(n, i), n.prototype.readData = function(t1) {
                        this.checkOffset(t1);
                        var e1 = this.data.slice(this.zero + this.index, this.zero + this.index + t1);
                        return this.index += t1, e1;
                    }, e.exports = n;
                },
                {
                    "../utils": 32,
                    "./Uint8ArrayReader": 21
                }
            ],
            20: [
                function(t, e, r) {
                    var i = t("./DataReader");
                    function n(t1) {
                        i.call(this, t1);
                    }
                    t("../utils").inherits(n, i), n.prototype.byteAt = function(t1) {
                        return this.data.charCodeAt(this.zero + t1);
                    }, n.prototype.lastIndexOfSignature = function(t1) {
                        return this.data.lastIndexOf(t1) - this.zero;
                    }, n.prototype.readAndCheckSignature = function(t1) {
                        return t1 === this.readData(4);
                    }, n.prototype.readData = function(t1) {
                        this.checkOffset(t1);
                        var e1 = this.data.slice(this.zero + this.index, this.zero + this.index + t1);
                        return this.index += t1, e1;
                    }, e.exports = n;
                },
                {
                    "../utils": 32,
                    "./DataReader": 18
                }
            ],
            21: [
                function(t, e, r) {
                    var i = t("./ArrayReader");
                    function n(t1) {
                        i.call(this, t1);
                    }
                    t("../utils").inherits(n, i), n.prototype.readData = function(t1) {
                        if (this.checkOffset(t1), 0 === t1) return new Uint8Array(0);
                        var e1 = this.data.subarray(this.zero + this.index, this.zero + this.index + t1);
                        return this.index += t1, e1;
                    }, e.exports = n;
                },
                {
                    "../utils": 32,
                    "./ArrayReader": 17
                }
            ],
            22: [
                function(t, e, r) {
                    var i = t("../utils"), n = t("../support"), s1 = t("./ArrayReader"), a = t("./StringReader"), o = t("./NodeBufferReader"), h = t("./Uint8ArrayReader");
                    e.exports = function(t1) {
                        var e1 = i.getTypeOf(t1);
                        return i.checkSupport(e1), "string" !== e1 || n.uint8array ? "nodebuffer" === e1 ? new o(t1) : n.uint8array ? new h(i.transformTo("uint8array", t1)) : new s1(i.transformTo("array", t1)) : new a(t1);
                    };
                },
                {
                    "../support": 30,
                    "../utils": 32,
                    "./ArrayReader": 17,
                    "./NodeBufferReader": 19,
                    "./StringReader": 20,
                    "./Uint8ArrayReader": 21
                }
            ],
            23: [
                function(t, e, r) {
                    r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\b";
                },
                {
                }
            ],
            24: [
                function(t, e, r) {
                    var i = t("./GenericWorker"), n = t("../utils");
                    function s1(t1) {
                        i.call(this, "ConvertWorker to " + t1), this.destType = t1;
                    }
                    n.inherits(s1, i), s1.prototype.processChunk = function(t1) {
                        this.push({
                            data: n.transformTo(this.destType, t1.data),
                            meta: t1.meta
                        });
                    }, e.exports = s1;
                },
                {
                    "../utils": 32,
                    "./GenericWorker": 28
                }
            ],
            25: [
                function(t, e, r) {
                    var i = t("./GenericWorker"), n = t("../crc32");
                    function s1() {
                        i.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
                    }
                    t("../utils").inherits(s1, i), s1.prototype.processChunk = function(t1) {
                        this.streamInfo.crc32 = n(t1.data, this.streamInfo.crc32 || 0), this.push(t1);
                    }, e.exports = s1;
                },
                {
                    "../crc32": 4,
                    "../utils": 32,
                    "./GenericWorker": 28
                }
            ],
            26: [
                function(t, e, r) {
                    var i = t("../utils"), n = t("./GenericWorker");
                    function s1(t1) {
                        n.call(this, "DataLengthProbe for " + t1), this.propName = t1, this.withStreamInfo(t1, 0);
                    }
                    i.inherits(s1, n), s1.prototype.processChunk = function(t1) {
                        if (t1) {
                            var e1 = this.streamInfo[this.propName] || 0;
                            this.streamInfo[this.propName] = e1 + t1.data.length;
                        }
                        n.prototype.processChunk.call(this, t1);
                    }, e.exports = s1;
                },
                {
                    "../utils": 32,
                    "./GenericWorker": 28
                }
            ],
            27: [
                function(t, e, r) {
                    var i = t("../utils"), n = t("./GenericWorker");
                    function s1(t1) {
                        n.call(this, "DataWorker");
                        var e1 = this;
                        this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, t1.then(function(t2) {
                            e1.dataIsReady = !0, e1.data = t2, e1.max = t2 && t2.length || 0, e1.type = i.getTypeOf(t2), e1.isPaused || e1._tickAndRepeat();
                        }, function(t2) {
                            e1.error(t2);
                        });
                    }
                    i.inherits(s1, n), s1.prototype.cleanUp = function() {
                        n.prototype.cleanUp.call(this), this.data = null;
                    }, s1.prototype.resume = function() {
                        return !!n.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, i.delay(this._tickAndRepeat, [], this)), !0);
                    }, s1.prototype._tickAndRepeat = function() {
                        this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (i.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
                    }, s1.prototype._tick = function() {
                        if (this.isPaused || this.isFinished) return !1;
                        var t1 = null, e1 = Math.min(this.max, this.index + 16384);
                        if (this.index >= this.max) return this.end();
                        switch(this.type){
                            case "string":
                                t1 = this.data.substring(this.index, e1);
                                break;
                            case "uint8array":
                                t1 = this.data.subarray(this.index, e1);
                                break;
                            case "array":
                            case "nodebuffer":
                                t1 = this.data.slice(this.index, e1);
                        }
                        return this.index = e1, this.push({
                            data: t1,
                            meta: {
                                percent: this.max ? this.index / this.max * 100 : 0
                            }
                        });
                    }, e.exports = s1;
                },
                {
                    "../utils": 32,
                    "./GenericWorker": 28
                }
            ],
            28: [
                function(t, e, r) {
                    function i(t1) {
                        this.name = t1 || "default", this.streamInfo = {
                        }, this.generatedError = null, this.extraStreamInfo = {
                        }, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = {
                            data: [],
                            end: [],
                            error: []
                        }, this.previous = null;
                    }
                    i.prototype = {
                        push: function(t1) {
                            this.emit("data", t1);
                        },
                        end: function() {
                            if (this.isFinished) return !1;
                            this.flush();
                            try {
                                this.emit("end"), this.cleanUp(), this.isFinished = !0;
                            } catch (t) {
                                this.emit("error", t);
                            }
                            return !0;
                        },
                        error: function(t1) {
                            return !this.isFinished && (this.isPaused ? this.generatedError = t1 : (this.isFinished = !0, this.emit("error", t1), this.previous && this.previous.error(t1), this.cleanUp()), !0);
                        },
                        on: function(t1, e1) {
                            return this._listeners[t1].push(e1), this;
                        },
                        cleanUp: function() {
                            this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
                        },
                        emit: function(t1, e1) {
                            if (this._listeners[t1]) for(var r1 = 0; r1 < this._listeners[t1].length; r1++)this._listeners[t1][r1].call(this, e1);
                        },
                        pipe: function(t1) {
                            return t1.registerPrevious(this);
                        },
                        registerPrevious: function(t1) {
                            if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
                            this.streamInfo = t1.streamInfo, this.mergeStreamInfo(), this.previous = t1;
                            var e1 = this;
                            return t1.on("data", function(t2) {
                                e1.processChunk(t2);
                            }), t1.on("end", function() {
                                e1.end();
                            }), t1.on("error", function(t2) {
                                e1.error(t2);
                            }), this;
                        },
                        pause: function() {
                            return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
                        },
                        resume: function() {
                            if (!this.isPaused || this.isFinished) return !1;
                            var t1 = this.isPaused = !1;
                            return this.generatedError && (this.error(this.generatedError), t1 = !0), this.previous && this.previous.resume(), !t1;
                        },
                        flush: function() {
                        },
                        processChunk: function(t1) {
                            this.push(t1);
                        },
                        withStreamInfo: function(t1, e1) {
                            return this.extraStreamInfo[t1] = e1, this.mergeStreamInfo(), this;
                        },
                        mergeStreamInfo: function() {
                            for(var t1 in this.extraStreamInfo)this.extraStreamInfo.hasOwnProperty(t1) && (this.streamInfo[t1] = this.extraStreamInfo[t1]);
                        },
                        lock: function() {
                            if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
                            this.isLocked = !0, this.previous && this.previous.lock();
                        },
                        toString: function() {
                            var t1 = "Worker " + this.name;
                            return this.previous ? this.previous + " -> " + t1 : t1;
                        }
                    }, e.exports = i;
                },
                {
                }
            ],
            29: [
                function(t, e, r) {
                    var h = t("../utils"), n = t("./ConvertWorker"), s1 = t("./GenericWorker"), u = t("../base64"), i = t("../support"), a = t("../external"), o = null;
                    if (i.nodestream) try {
                        o = t("../nodejs/NodejsStreamOutputAdapter");
                    } catch (t) {
                    }
                    function l(t1, o1) {
                        return new a.Promise(function(e1, r1) {
                            var i2 = [], n1 = t1._internalType, s2 = t1._outputType, a1 = t1._mimeType;
                            t1.on("data", function(t2, e2) {
                                i2.push(t2), o1 && o1(e2);
                            }).on("error", function(t2) {
                                i2 = [], r1(t2);
                            }).on("end", function() {
                                try {
                                    var t2 = function(t3, e2, r2) {
                                        switch(t3){
                                            case "blob":
                                                return h.newBlob(h.transformTo("arraybuffer", e2), r2);
                                            case "base64":
                                                return u.encode(e2);
                                            default:
                                                return h.transformTo(t3, e2);
                                        }
                                    }(s2, function(t3, e2) {
                                        var r2, i6 = 0, n2 = null, s3 = 0;
                                        for(r2 = 0; r2 < e2.length; r2++)s3 += e2[r2].length;
                                        switch(t3){
                                            case "string":
                                                return e2.join("");
                                            case "array":
                                                return Array.prototype.concat.apply([], e2);
                                            case "uint8array":
                                                for(n2 = new Uint8Array(s3), r2 = 0; r2 < e2.length; r2++)n2.set(e2[r2], i6), i6 += e2[r2].length;
                                                return n2;
                                            case "nodebuffer":
                                                return Buffer.concat(e2);
                                            default:
                                                throw new Error("concat : unsupported type '" + t3 + "'");
                                        }
                                    }(n1, i2), a1);
                                    e1(t2);
                                } catch (t) {
                                    r1(t);
                                }
                                i2 = [];
                            }).resume();
                        });
                    }
                    function f(t1, e1, r1) {
                        var i2 = e1;
                        switch(e1){
                            case "blob":
                            case "arraybuffer":
                                i2 = "uint8array";
                                break;
                            case "base64":
                                i2 = "string";
                        }
                        try {
                            this._internalType = i2, this._outputType = e1, this._mimeType = r1, h.checkSupport(i2), this._worker = t1.pipe(new n(i2)), t1.lock();
                        } catch (t) {
                            this._worker = new s1("error"), this._worker.error(t);
                        }
                    }
                    f.prototype = {
                        accumulate: function(t1) {
                            return l(this, t1);
                        },
                        on: function(t1, e1) {
                            var r1 = this;
                            return "data" === t1 ? this._worker.on(t1, function(t2) {
                                e1.call(r1, t2.data, t2.meta);
                            }) : this._worker.on(t1, function() {
                                h.delay(e1, arguments, r1);
                            }), this;
                        },
                        resume: function() {
                            return h.delay(this._worker.resume, [], this._worker), this;
                        },
                        pause: function() {
                            return this._worker.pause(), this;
                        },
                        toNodejsStream: function(t1) {
                            if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
                            return new o(this, {
                                objectMode: "nodebuffer" !== this._outputType
                            }, t1);
                        }
                    }, e.exports = f;
                },
                {
                    "../base64": 1,
                    "../external": 6,
                    "../nodejs/NodejsStreamOutputAdapter": 13,
                    "../support": 30,
                    "../utils": 32,
                    "./ConvertWorker": 24,
                    "./GenericWorker": 28
                }
            ],
            30: [
                function(t, e, r) {
                    if ((r.base64 = !0, r.array = !0, r.string = !0, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer)) r.blob = !1;
                    else {
                        var i = new ArrayBuffer(0);
                        try {
                            r.blob = 0 === new Blob([
                                i
                            ], {
                                type: "application/zip"
                            }).size;
                        } catch (t) {
                            try {
                                var n = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder);
                                n.append(i), r.blob = 0 === n.getBlob("application/zip").size;
                            } catch (t) {
                                r.blob = !1;
                            }
                        }
                    }
                    try {
                        r.nodestream = !!t("readable-stream").Readable;
                    } catch (t) {
                        r.nodestream = !1;
                    }
                },
                {
                    "readable-stream": 16
                }
            ],
            31: [
                function(t, e, s1) {
                    for(var o = t("./utils"), h = t("./support"), r = t("./nodejsUtils"), i = t("./stream/GenericWorker"), u = new Array(256), n = 0; n < 256; n++)u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
                    u[254] = u[254] = 1;
                    function a() {
                        i.call(this, "utf-8 decode"), this.leftOver = null;
                    }
                    function l() {
                        i.call(this, "utf-8 encode");
                    }
                    s1.utf8encode = function(t1) {
                        return h.nodebuffer ? r.newBufferFrom(t1, "utf-8") : (function(t2) {
                            var e1, r1, i2, n1, s2, a1 = t2.length, o1 = 0;
                            for(n1 = 0; n1 < a1; n1++)55296 == (64512 & (r1 = t2.charCodeAt(n1))) && n1 + 1 < a1 && 56320 == (64512 & (i2 = t2.charCodeAt(n1 + 1))) && (r1 = 65536 + (r1 - 55296 << 10) + (i2 - 56320), n1++), o1 += r1 < 128 ? 1 : r1 < 2048 ? 2 : r1 < 65536 ? 3 : 4;
                            for(e1 = h.uint8array ? new Uint8Array(o1) : new Array(o1), n1 = s2 = 0; s2 < o1; n1++)55296 == (64512 & (r1 = t2.charCodeAt(n1))) && n1 + 1 < a1 && 56320 == (64512 & (i2 = t2.charCodeAt(n1 + 1))) && (r1 = 65536 + (r1 - 55296 << 10) + (i2 - 56320), n1++), r1 < 128 ? e1[s2++] = r1 : (r1 < 2048 ? e1[s2++] = 192 | r1 >>> 6 : (r1 < 65536 ? e1[s2++] = 224 | r1 >>> 12 : (e1[s2++] = 240 | r1 >>> 18, e1[s2++] = 128 | r1 >>> 12 & 63), e1[s2++] = 128 | r1 >>> 6 & 63), e1[s2++] = 128 | 63 & r1);
                            return e1;
                        })(t1);
                    }, s1.utf8decode = function(t1) {
                        return h.nodebuffer ? o.transformTo("nodebuffer", t1).toString("utf-8") : (function(t2) {
                            var e1, r1, i2, n1, s2 = t2.length, a1 = new Array(2 * s2);
                            for(e1 = r1 = 0; e1 < s2;)if ((i2 = t2[e1++]) < 128) a1[r1++] = i2;
                            else if (4 < (n1 = u[i2])) a1[r1++] = 65533, e1 += n1 - 1;
                            else {
                                for(i2 &= 2 === n1 ? 31 : 3 === n1 ? 15 : 7; 1 < n1 && e1 < s2;)i2 = i2 << 6 | 63 & t2[e1++], n1--;
                                1 < n1 ? a1[r1++] = 65533 : i2 < 65536 ? a1[r1++] = i2 : (i2 -= 65536, a1[r1++] = 55296 | i2 >> 10 & 1023, a1[r1++] = 56320 | 1023 & i2);
                            }
                            return a1.length !== r1 && (a1.subarray ? a1 = a1.subarray(0, r1) : a1.length = r1), o.applyFromCharCode(a1);
                        })(t1 = o.transformTo(h.uint8array ? "uint8array" : "array", t1));
                    }, o.inherits(a, i), a.prototype.processChunk = function(t1) {
                        var e1 = o.transformTo(h.uint8array ? "uint8array" : "array", t1.data);
                        if (this.leftOver && this.leftOver.length) {
                            if (h.uint8array) {
                                var r1 = e1;
                                (e1 = new Uint8Array(r1.length + this.leftOver.length)).set(this.leftOver, 0), e1.set(r1, this.leftOver.length);
                            } else e1 = this.leftOver.concat(e1);
                            this.leftOver = null;
                        }
                        var i2 = function(t2, e2) {
                            var r1;
                            for((e2 = e2 || t2.length) > t2.length && (e2 = t2.length), r1 = e2 - 1; 0 <= r1 && 128 == (192 & t2[r1]);)r1--;
                            return r1 < 0 ? e2 : 0 === r1 ? e2 : r1 + u[t2[r1]] > e2 ? r1 : e2;
                        }(e1), n1 = e1;
                        i2 !== e1.length && (h.uint8array ? (n1 = e1.subarray(0, i2), this.leftOver = e1.subarray(i2, e1.length)) : (n1 = e1.slice(0, i2), this.leftOver = e1.slice(i2, e1.length))), this.push({
                            data: s1.utf8decode(n1),
                            meta: t1.meta
                        });
                    }, a.prototype.flush = function() {
                        this.leftOver && this.leftOver.length && (this.push({
                            data: s1.utf8decode(this.leftOver),
                            meta: {
                            }
                        }), this.leftOver = null);
                    }, s1.Utf8DecodeWorker = a, o.inherits(l, i), l.prototype.processChunk = function(t1) {
                        this.push({
                            data: s1.utf8encode(t1.data),
                            meta: t1.meta
                        });
                    }, s1.Utf8EncodeWorker = l;
                },
                {
                    "./nodejsUtils": 14,
                    "./stream/GenericWorker": 28,
                    "./support": 30,
                    "./utils": 32
                }
            ],
            32: [
                function(t, e, a) {
                    var o = t("./support"), h = t("./base64"), r = t("./nodejsUtils"), i = t("set-immediate-shim"), u = t("./external");
                    function n(t1) {
                        return t1;
                    }
                    function l(t1, e1) {
                        for(var r1 = 0; r1 < t1.length; ++r1)e1[r1] = 255 & t1.charCodeAt(r1);
                        return e1;
                    }
                    a.newBlob = function(e1, r1) {
                        a.checkSupport("blob");
                        try {
                            return new Blob([
                                e1
                            ], {
                                type: r1
                            });
                        } catch (t) {
                            try {
                                var i2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder);
                                return i2.append(e1), i2.getBlob(r1);
                            } catch (t) {
                                throw new Error("Bug : can't construct the Blob.");
                            }
                        }
                    };
                    var s1 = {
                        stringifyByChunk: function(t1, e1, r1) {
                            var i2 = [], n1 = 0, s1 = t1.length;
                            if (s1 <= r1) return String.fromCharCode.apply(null, t1);
                            for(; n1 < s1;)"array" === e1 || "nodebuffer" === e1 ? i2.push(String.fromCharCode.apply(null, t1.slice(n1, Math.min(n1 + r1, s1)))) : i2.push(String.fromCharCode.apply(null, t1.subarray(n1, Math.min(n1 + r1, s1)))), n1 += r1;
                            return i2.join("");
                        },
                        stringifyByChar: function(t1) {
                            for(var e1 = "", r1 = 0; r1 < t1.length; r1++)e1 += String.fromCharCode(t1[r1]);
                            return e1;
                        },
                        applyCanBeUsed: {
                            uint8array: function() {
                                try {
                                    return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
                                } catch (t) {
                                    return !1;
                                }
                            }(),
                            nodebuffer: function() {
                                try {
                                    return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
                                } catch (t) {
                                    return !1;
                                }
                            }()
                        }
                    };
                    function f(t1) {
                        var e1 = 65536, r1 = a.getTypeOf(t1), i2 = !0;
                        if (("uint8array" === r1 ? i2 = s1.applyCanBeUsed.uint8array : "nodebuffer" === r1 && (i2 = s1.applyCanBeUsed.nodebuffer), i2)) for(; 1 < e1;)try {
                            return s1.stringifyByChunk(t1, r1, e1);
                        } catch (t) {
                            e1 = Math.floor(e1 / 2);
                        }
                        return s1.stringifyByChar(t1);
                    }
                    function d(t1, e1) {
                        for(var r1 = 0; r1 < t1.length; r1++)e1[r1] = t1[r1];
                        return e1;
                    }
                    a.applyFromCharCode = f;
                    var c = {
                    };
                    c.string = {
                        string: n,
                        array: function(t1) {
                            return l(t1, new Array(t1.length));
                        },
                        arraybuffer: function(t1) {
                            return c.string.uint8array(t1).buffer;
                        },
                        uint8array: function(t1) {
                            return l(t1, new Uint8Array(t1.length));
                        },
                        nodebuffer: function(t1) {
                            return l(t1, r.allocBuffer(t1.length));
                        }
                    }, c.array = {
                        string: f,
                        array: n,
                        arraybuffer: function(t1) {
                            return new Uint8Array(t1).buffer;
                        },
                        uint8array: function(t1) {
                            return new Uint8Array(t1);
                        },
                        nodebuffer: function(t1) {
                            return r.newBufferFrom(t1);
                        }
                    }, c.arraybuffer = {
                        string: function(t1) {
                            return f(new Uint8Array(t1));
                        },
                        array: function(t1) {
                            return d(new Uint8Array(t1), new Array(t1.byteLength));
                        },
                        arraybuffer: n,
                        uint8array: function(t1) {
                            return new Uint8Array(t1);
                        },
                        nodebuffer: function(t1) {
                            return r.newBufferFrom(new Uint8Array(t1));
                        }
                    }, c.uint8array = {
                        string: f,
                        array: function(t1) {
                            return d(t1, new Array(t1.length));
                        },
                        arraybuffer: function(t1) {
                            return t1.buffer;
                        },
                        uint8array: n,
                        nodebuffer: function(t1) {
                            return r.newBufferFrom(t1);
                        }
                    }, c.nodebuffer = {
                        string: f,
                        array: function(t1) {
                            return d(t1, new Array(t1.length));
                        },
                        arraybuffer: function(t1) {
                            return c.nodebuffer.uint8array(t1).buffer;
                        },
                        uint8array: function(t1) {
                            return d(t1, new Uint8Array(t1.length));
                        },
                        nodebuffer: n
                    }, a.transformTo = function(t1, e1) {
                        if (e1 = e1 || "", !t1) return e1;
                        a.checkSupport(t1);
                        var r1 = a.getTypeOf(e1);
                        return c[r1][t1](e1);
                    }, a.getTypeOf = function(t1) {
                        return "string" == typeof t1 ? "string" : "[object Array]" === Object.prototype.toString.call(t1) ? "array" : o.nodebuffer && r.isBuffer(t1) ? "nodebuffer" : o.uint8array && t1 instanceof Uint8Array ? "uint8array" : o.arraybuffer && t1 instanceof ArrayBuffer ? "arraybuffer" : void 0;
                    }, a.checkSupport = function(t1) {
                        if (!o[t1.toLowerCase()]) throw new Error(t1 + " is not supported by this platform");
                    }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(t1) {
                        var e1, r1, i2 = "";
                        for(r1 = 0; r1 < (t1 || "").length; r1++)i2 += "\\x" + ((e1 = t1.charCodeAt(r1)) < 16 ? "0" : "") + e1.toString(16).toUpperCase();
                        return i2;
                    }, a.delay = function(t1, e1, r1) {
                        i(function() {
                            t1.apply(r1 || null, e1 || []);
                        });
                    }, a.inherits = function(t1, e1) {
                        function r1() {
                        }
                        r1.prototype = e1.prototype, t1.prototype = new r1;
                    }, a.extend = function() {
                        var t1, e1, r1 = {
                        };
                        for(t1 = 0; t1 < arguments.length; t1++)for(e1 in arguments[t1])arguments[t1].hasOwnProperty(e1) && (void 0) === r1[e1] && (r1[e1] = arguments[t1][e1]);
                        return r1;
                    }, a.prepareContent = function(r1, t1, i2, n1, s2) {
                        return u.Promise.resolve(t1).then(function(i6) {
                            return o.blob && (i6 instanceof Blob || -1 !== [
                                "[object File]",
                                "[object Blob]"
                            ].indexOf(Object.prototype.toString.call(i6))) && "undefined" != typeof FileReader ? new u.Promise(function(e1, r2) {
                                var t2 = new FileReader;
                                t2.onload = function(t3) {
                                    e1(t3.target.result);
                                }, t2.onerror = function(t3) {
                                    r2(t3.target.error);
                                }, t2.readAsArrayBuffer(i6);
                            }) : i6;
                        }).then(function(t2) {
                            var e1 = a.getTypeOf(t2);
                            return e1 ? ("arraybuffer" === e1 ? t2 = a.transformTo("uint8array", t2) : "string" === e1 && (s2 ? t2 = h.decode(t2) : i2 && !0 !== n1 && (t2 = function(t3) {
                                return l(t3, o.uint8array ? new Uint8Array(t3.length) : new Array(t3.length));
                            }(t2))), t2) : u.Promise.reject(new Error("Can't read the data of '" + r1 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
                        });
                    };
                },
                {
                    "./base64": 1,
                    "./external": 6,
                    "./nodejsUtils": 14,
                    "./support": 30,
                    "set-immediate-shim": 54
                }
            ],
            33: [
                function(t, e, r) {
                    var i = t("./reader/readerFor"), n = t("./utils"), s1 = t("./signature"), a = t("./zipEntry"), o = (t("./utf8"), t("./support"));
                    function h(t1) {
                        this.files = [], this.loadOptions = t1;
                    }
                    h.prototype = {
                        checkSignature: function(t1) {
                            if (!this.reader.readAndCheckSignature(t1)) {
                                this.reader.index -= 4;
                                var e1 = this.reader.readString(4);
                                throw new Error("Corrupted zip or bug: unexpected signature (" + n.pretty(e1) + ", expected " + n.pretty(t1) + ")");
                            }
                        },
                        isSignature: function(t1, e1) {
                            var r1 = this.reader.index;
                            this.reader.setIndex(t1);
                            var i2 = this.reader.readString(4) === e1;
                            return this.reader.setIndex(r1), i2;
                        },
                        readBlockEndOfCentral: function() {
                            this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
                            var t1 = this.reader.readData(this.zipCommentLength), e1 = o.uint8array ? "uint8array" : "array", r1 = n.transformTo(e1, t1);
                            this.zipComment = this.loadOptions.decodeFileName(r1);
                        },
                        readBlockZip64EndOfCentral: function() {
                            this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {
                            };
                            for(var t1, e1, r1, i2 = this.zip64EndOfCentralSize - 44; 0 < i2;)t1 = this.reader.readInt(2), e1 = this.reader.readInt(4), r1 = this.reader.readData(e1), this.zip64ExtensibleData[t1] = {
                                id: t1,
                                length: e1,
                                value: r1
                            };
                        },
                        readBlockZip64EndOfCentralLocator: function() {
                            if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
                        },
                        readLocalFiles: function() {
                            var t1, e1;
                            for(t1 = 0; t1 < this.files.length; t1++)e1 = this.files[t1], this.reader.setIndex(e1.localHeaderOffset), this.checkSignature(s1.LOCAL_FILE_HEADER), e1.readLocalPart(this.reader), e1.handleUTF8(), e1.processAttributes();
                        },
                        readCentralDir: function() {
                            var t1;
                            for(this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s1.CENTRAL_FILE_HEADER);)(t1 = new a({
                                zip64: this.zip64
                            }, this.loadOptions)).readCentralPart(this.reader), this.files.push(t1);
                            if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
                        },
                        readEndOfCentral: function() {
                            var t1 = this.reader.lastIndexOfSignature(s1.CENTRAL_DIRECTORY_END);
                            if (t1 < 0) throw !this.isSignature(0, s1.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
                            this.reader.setIndex(t1);
                            var e1 = t1;
                            if (this.checkSignature(s1.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === n.MAX_VALUE_16BITS || this.diskWithCentralDirStart === n.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === n.MAX_VALUE_16BITS || this.centralDirRecords === n.MAX_VALUE_16BITS || this.centralDirSize === n.MAX_VALUE_32BITS || this.centralDirOffset === n.MAX_VALUE_32BITS) {
                                if (this.zip64 = !0, (t1 = this.reader.lastIndexOfSignature(s1.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
                                if (this.reader.setIndex(t1), this.checkSignature(s1.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s1.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s1.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
                                this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s1.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
                            }
                            var r1 = this.centralDirOffset + this.centralDirSize;
                            this.zip64 && (r1 += 20, r1 += 12 + this.zip64EndOfCentralSize);
                            var i2 = e1 - r1;
                            if (0 < i2) this.isSignature(e1, s1.CENTRAL_FILE_HEADER) || (this.reader.zero = i2);
                            else if (i2 < 0) throw new Error("Corrupted zip: missing " + Math.abs(i2) + " bytes.");
                        },
                        prepareReader: function(t1) {
                            this.reader = i(t1);
                        },
                        load: function(t1) {
                            this.prepareReader(t1), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
                        }
                    }, e.exports = h;
                },
                {
                    "./reader/readerFor": 22,
                    "./signature": 23,
                    "./support": 30,
                    "./utf8": 31,
                    "./utils": 32,
                    "./zipEntry": 34
                }
            ],
            34: [
                function(t, e, r) {
                    var i = t("./reader/readerFor"), s1 = t("./utils"), n = t("./compressedObject"), a = t("./crc32"), o = t("./utf8"), h = t("./compressions"), u = t("./support");
                    function l(t1, e1) {
                        this.options = t1, this.loadOptions = e1;
                    }
                    l.prototype = {
                        isEncrypted: function() {
                            return 1 == (1 & this.bitFlag);
                        },
                        useUTF8: function() {
                            return 2048 == (2048 & this.bitFlag);
                        },
                        readLocalPart: function(t1) {
                            var e1, r1;
                            if (t1.skip(22), this.fileNameLength = t1.readInt(2), r1 = t1.readInt(2), this.fileName = t1.readData(this.fileNameLength), t1.skip(r1), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
                            if (null === (e1 = (function(t2) {
                                for(var e2 in h)if (h.hasOwnProperty(e2) && h[e2].magic === t2) return h[e2];
                                return null;
                            })(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s1.pretty(this.compressionMethod) + " unknown (inner file : " + s1.transformTo("string", this.fileName) + ")");
                            this.decompressed = new n(this.compressedSize, this.uncompressedSize, this.crc32, e1, t1.readData(this.compressedSize));
                        },
                        readCentralPart: function(t1) {
                            this.versionMadeBy = t1.readInt(2), t1.skip(2), this.bitFlag = t1.readInt(2), this.compressionMethod = t1.readString(2), this.date = t1.readDate(), this.crc32 = t1.readInt(4), this.compressedSize = t1.readInt(4), this.uncompressedSize = t1.readInt(4);
                            var e1 = t1.readInt(2);
                            if (this.extraFieldsLength = t1.readInt(2), this.fileCommentLength = t1.readInt(2), this.diskNumberStart = t1.readInt(2), this.internalFileAttributes = t1.readInt(2), this.externalFileAttributes = t1.readInt(4), this.localHeaderOffset = t1.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
                            t1.skip(e1), this.readExtraFields(t1), this.parseZIP64ExtraField(t1), this.fileComment = t1.readData(this.fileCommentLength);
                        },
                        processAttributes: function() {
                            this.unixPermissions = null, this.dosPermissions = null;
                            var t1 = this.versionMadeBy >> 8;
                            this.dir = !!(16 & this.externalFileAttributes), 0 == t1 && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == t1 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = !0);
                        },
                        parseZIP64ExtraField: function(t1) {
                            if (this.extraFields[1]) {
                                var e1 = i(this.extraFields[1].value);
                                this.uncompressedSize === s1.MAX_VALUE_32BITS && (this.uncompressedSize = e1.readInt(8)), this.compressedSize === s1.MAX_VALUE_32BITS && (this.compressedSize = e1.readInt(8)), this.localHeaderOffset === s1.MAX_VALUE_32BITS && (this.localHeaderOffset = e1.readInt(8)), this.diskNumberStart === s1.MAX_VALUE_32BITS && (this.diskNumberStart = e1.readInt(4));
                            }
                        },
                        readExtraFields: function(t1) {
                            var e1, r1, i2, n1 = t1.index + this.extraFieldsLength;
                            for(this.extraFields || (this.extraFields = {
                            }); t1.index + 4 < n1;)e1 = t1.readInt(2), r1 = t1.readInt(2), i2 = t1.readData(r1), this.extraFields[e1] = {
                                id: e1,
                                length: r1,
                                value: i2
                            };
                            t1.setIndex(n1);
                        },
                        handleUTF8: function() {
                            var t1 = u.uint8array ? "uint8array" : "array";
                            if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
                            else {
                                var e1 = this.findExtraFieldUnicodePath();
                                if (null !== e1) this.fileNameStr = e1;
                                else {
                                    var r1 = s1.transformTo(t1, this.fileName);
                                    this.fileNameStr = this.loadOptions.decodeFileName(r1);
                                }
                                var i2 = this.findExtraFieldUnicodeComment();
                                if (null !== i2) this.fileCommentStr = i2;
                                else {
                                    var n1 = s1.transformTo(t1, this.fileComment);
                                    this.fileCommentStr = this.loadOptions.decodeFileName(n1);
                                }
                            }
                        },
                        findExtraFieldUnicodePath: function() {
                            var t1 = this.extraFields[28789];
                            if (t1) {
                                var e1 = i(t1.value);
                                return 1 !== e1.readInt(1) ? null : a(this.fileName) !== e1.readInt(4) ? null : o.utf8decode(e1.readData(t1.length - 5));
                            }
                            return null;
                        },
                        findExtraFieldUnicodeComment: function() {
                            var t1 = this.extraFields[25461];
                            if (t1) {
                                var e1 = i(t1.value);
                                return 1 !== e1.readInt(1) ? null : a(this.fileComment) !== e1.readInt(4) ? null : o.utf8decode(e1.readData(t1.length - 5));
                            }
                            return null;
                        }
                    }, e.exports = l;
                },
                {
                    "./compressedObject": 2,
                    "./compressions": 3,
                    "./crc32": 4,
                    "./reader/readerFor": 22,
                    "./support": 30,
                    "./utf8": 31,
                    "./utils": 32
                }
            ],
            35: [
                function(t, e, r) {
                    function i(t1, e1, r1) {
                        this.name = t1, this.dir = r1.dir, this.date = r1.date, this.comment = r1.comment, this.unixPermissions = r1.unixPermissions, this.dosPermissions = r1.dosPermissions, this._data = e1, this._dataBinary = r1.binary, this.options = {
                            compression: r1.compression,
                            compressionOptions: r1.compressionOptions
                        };
                    }
                    var s1 = t("./stream/StreamHelper"), n = t("./stream/DataWorker"), a = t("./utf8"), o = t("./compressedObject"), h = t("./stream/GenericWorker");
                    i.prototype = {
                        internalStream: function(t1) {
                            var e1 = null, r1 = "string";
                            try {
                                if (!t1) throw new Error("No output type specified.");
                                var i2 = "string" === (r1 = t1.toLowerCase()) || "text" === r1;
                                "binarystring" !== r1 && "text" !== r1 || (r1 = "string"), e1 = this._decompressWorker();
                                var n1 = !this._dataBinary;
                                n1 && !i2 && (e1 = e1.pipe(new a.Utf8EncodeWorker)), !n1 && i2 && (e1 = e1.pipe(new a.Utf8DecodeWorker));
                            } catch (t) {
                                (e1 = new h("error")).error(t);
                            }
                            return new s1(e1, r1, "");
                        },
                        async: function(t1, e1) {
                            return this.internalStream(t1).accumulate(e1);
                        },
                        nodeStream: function(t1, e1) {
                            return this.internalStream(t1 || "nodebuffer").toNodejsStream(e1);
                        },
                        _compressWorker: function(t1, e1) {
                            if (this._data instanceof o && this._data.compression.magic === t1.magic) return this._data.getCompressedWorker();
                            var r1 = this._decompressWorker();
                            return this._dataBinary || (r1 = r1.pipe(new a.Utf8EncodeWorker)), o.createWorkerFrom(r1, t1, e1);
                        },
                        _decompressWorker: function() {
                            return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new n(this._data);
                        }
                    };
                    for(var u = [
                        "asText",
                        "asBinary",
                        "asNodeBuffer",
                        "asUint8Array",
                        "asArrayBuffer"
                    ], l = function() {
                        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
                    }, f = 0; f < u.length; f++)i.prototype[u[f]] = l;
                    e.exports = i;
                },
                {
                    "./compressedObject": 2,
                    "./stream/DataWorker": 27,
                    "./stream/GenericWorker": 28,
                    "./stream/StreamHelper": 29,
                    "./utf8": 31
                }
            ],
            36: [
                function(t, l, e) {
                    (function(e1) {
                        var r, i, t1 = e1.MutationObserver || e1.WebKitMutationObserver;
                        if (t1) {
                            var n = 0, s1 = new t1(u), a = e1.document.createTextNode("");
                            s1.observe(a, {
                                characterData: !0
                            }), r = function() {
                                a.data = n = (++n) % 2;
                            };
                        } else if (e1.setImmediate || (void 0) === e1.MessageChannel) r = "document" in e1 && "onreadystatechange" in e1.document.createElement("script") ? function() {
                            var t2 = e1.document.createElement("script");
                            t2.onreadystatechange = function() {
                                u(), t2.onreadystatechange = null, t2.parentNode.removeChild(t2), t2 = null;
                            }, e1.document.documentElement.appendChild(t2);
                        } : function() {
                            setTimeout(u, 0);
                        };
                        else {
                            var o = new e1.MessageChannel;
                            o.port1.onmessage = u, r = function() {
                                o.port2.postMessage(0);
                            };
                        }
                        var h = [];
                        function u() {
                            var t2, e2;
                            i = !0;
                            for(var r1 = h.length; r1;){
                                for(e2 = h, h = [], t2 = -1; (++t2) < r1;)e2[t2]();
                                r1 = h.length;
                            }
                            i = !1;
                        }
                        l.exports = function(t2) {
                            1 !== h.push(t2) || i || r();
                        };
                    }).call(this, "undefined" != typeof commonjsGlobal1 ? commonjsGlobal1 : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {
                    });
                },
                {
                }
            ],
            37: [
                function(t, e, r) {
                    var n = t("immediate");
                    function u() {
                    }
                    var l = {
                    }, s1 = [
                        "REJECTED"
                    ], a1 = [
                        "FULFILLED"
                    ], i = [
                        "PENDING"
                    ];
                    function o(t1) {
                        if ("function" != typeof t1) throw new TypeError("resolver must be a function");
                        this.state = i, this.queue = [], this.outcome = void 0, t1 !== u && c(this, t1);
                    }
                    function h1(t1, e1, r1) {
                        this.promise = t1, "function" == typeof e1 && (this.onFulfilled = e1, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r1 && (this.onRejected = r1, this.callRejected = this.otherCallRejected);
                    }
                    function f(e1, r1, i2) {
                        n(function() {
                            var t1;
                            try {
                                t1 = r1(i2);
                            } catch (t) {
                                return l.reject(e1, t);
                            }
                            t1 === e1 ? l.reject(e1, new TypeError("Cannot resolve promise with itself")) : l.resolve(e1, t1);
                        });
                    }
                    function d(t1) {
                        var e1 = t1 && t1.then;
                        if (t1 && ("object" == typeof t1 || "function" == typeof t1) && "function" == typeof e1) return function() {
                            e1.apply(t1, arguments);
                        };
                    }
                    function c(e1, t1) {
                        var r1 = !1;
                        function i2(t2) {
                            r1 || (r1 = !0, l.reject(e1, t2));
                        }
                        function n1(t2) {
                            r1 || (r1 = !0, l.resolve(e1, t2));
                        }
                        var s2 = p(function() {
                            t1(n1, i2);
                        });
                        "error" === s2.status && i2(s2.value);
                    }
                    function p(t1, e1) {
                        var r1 = {
                        };
                        try {
                            r1.value = t1(e1), r1.status = "success";
                        } catch (t) {
                            r1.status = "error", r1.value = t;
                        }
                        return r1;
                    }
                    (e.exports = o).prototype.finally = function(e1) {
                        if ("function" != typeof e1) return this;
                        var r1 = this.constructor;
                        return this.then(function(t1) {
                            return r1.resolve(e1()).then(function() {
                                return t1;
                            });
                        }, function(t1) {
                            return r1.resolve(e1()).then(function() {
                                throw t1;
                            });
                        });
                    }, o.prototype.catch = function(t1) {
                        return this.then(null, t1);
                    }, o.prototype.then = function(t1, e1) {
                        if ("function" != typeof t1 && this.state === a1 || "function" != typeof e1 && this.state === s1) return this;
                        var r1 = new this.constructor(u);
                        this.state !== i ? f(r1, this.state === a1 ? t1 : e1, this.outcome) : this.queue.push(new h1(r1, t1, e1));
                        return r1;
                    }, h1.prototype.callFulfilled = function(t1) {
                        l.resolve(this.promise, t1);
                    }, h1.prototype.otherCallFulfilled = function(t1) {
                        f(this.promise, this.onFulfilled, t1);
                    }, h1.prototype.callRejected = function(t1) {
                        l.reject(this.promise, t1);
                    }, h1.prototype.otherCallRejected = function(t1) {
                        f(this.promise, this.onRejected, t1);
                    }, l.resolve = function(t1, e1) {
                        var r1 = p(d, e1);
                        if ("error" === r1.status) return l.reject(t1, r1.value);
                        var i2 = r1.value;
                        if (i2) c(t1, i2);
                        else {
                            t1.state = a1, t1.outcome = e1;
                            for(var n1 = -1, s2 = t1.queue.length; (++n1) < s2;)t1.queue[n1].callFulfilled(e1);
                        }
                        return t1;
                    }, l.reject = function(t1, e1) {
                        t1.state = s1, t1.outcome = e1;
                        for(var r1 = -1, i2 = t1.queue.length; (++r1) < i2;)t1.queue[r1].callRejected(e1);
                        return t1;
                    }, o.resolve = function(t1) {
                        if (t1 instanceof this) return t1;
                        return l.resolve(new this(u), t1);
                    }, o.reject = function(t1) {
                        var e1 = new this(u);
                        return l.reject(e1, t1);
                    }, o.all = function(t1) {
                        var r1 = this;
                        if ("[object Array]" !== Object.prototype.toString.call(t1)) return this.reject(new TypeError("must be an array"));
                        var i2 = t1.length, n1 = !1;
                        if (!i2) return this.resolve([]);
                        var s2 = new Array(i2), a1 = 0, e1 = -1, o1 = new this(u);
                        for(; (++e1) < i2;)h2(t1[e1], e1);
                        return o1;
                        function h2(t2, e2) {
                            r1.resolve(t2).then(function(t3) {
                                s2[e2] = t3, (++a1) !== i2 || n1 || (n1 = !0, l.resolve(o1, s2));
                            }, function(t3) {
                                n1 || (n1 = !0, l.reject(o1, t3));
                            });
                        }
                    }, o.race = function(t1) {
                        var e1 = this;
                        if ("[object Array]" !== Object.prototype.toString.call(t1)) return this.reject(new TypeError("must be an array"));
                        var r1 = t1.length, i2 = !1;
                        if (!r1) return this.resolve([]);
                        var n1 = -1, s2 = new this(u);
                        for(; (++n1) < r1;)a2 = t1[n1], e1.resolve(a2).then(function(t2) {
                            i2 || (i2 = !0, l.resolve(s2, t2));
                        }, function(t2) {
                            i2 || (i2 = !0, l.reject(s2, t2));
                        });
                        var a2;
                        return s2;
                    };
                },
                {
                    immediate: 36
                }
            ],
            38: [
                function(t, e, r) {
                    var i = {
                    };
                    t("./lib/utils/common").assign(i, t("./lib/deflate"), t("./lib/inflate"), t("./lib/zlib/constants")), e.exports = i;
                },
                {
                    "./lib/deflate": 39,
                    "./lib/inflate": 40,
                    "./lib/utils/common": 41,
                    "./lib/zlib/constants": 44
                }
            ],
            39: [
                function(t, e, r) {
                    var a = t("./zlib/deflate"), o = t("./utils/common"), h = t("./utils/strings"), n = t("./zlib/messages"), s1 = t("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, d = 0, c = 8;
                    function p(t1) {
                        if (!(this instanceof p)) return new p(t1);
                        this.options = o.assign({
                            level: f,
                            method: c,
                            chunkSize: 16384,
                            windowBits: 15,
                            memLevel: 8,
                            strategy: d,
                            to: ""
                        }, t1 || {
                        });
                        var e1 = this.options;
                        e1.raw && 0 < e1.windowBits ? e1.windowBits = -e1.windowBits : e1.gzip && 0 < e1.windowBits && e1.windowBits < 16 && (e1.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new s1, this.strm.avail_out = 0;
                        var r1 = a.deflateInit2(this.strm, e1.level, e1.method, e1.windowBits, e1.memLevel, e1.strategy);
                        if (r1 !== l) throw new Error(n[r1]);
                        if ((e1.header && a.deflateSetHeader(this.strm, e1.header), e1.dictionary)) {
                            var i;
                            if ((i = "string" == typeof e1.dictionary ? h.string2buf(e1.dictionary) : "[object ArrayBuffer]" === u.call(e1.dictionary) ? new Uint8Array(e1.dictionary) : e1.dictionary, (r1 = a.deflateSetDictionary(this.strm, i)) !== l)) throw new Error(n[r1]);
                            this._dict_set = !0;
                        }
                    }
                    function i(t1, e1) {
                        var r1 = new p(e1);
                        if ((r1.push(t1, !0), r1.err)) throw r1.msg || n[r1.err];
                        return r1.result;
                    }
                    p.prototype.push = function(t1, e1) {
                        var r1, i2, n1 = this.strm, s2 = this.options.chunkSize;
                        if (this.ended) return !1;
                        i2 = e1 === ~~e1 ? e1 : !0 === e1 ? 4 : 0, "string" == typeof t1 ? n1.input = h.string2buf(t1) : "[object ArrayBuffer]" === u.call(t1) ? n1.input = new Uint8Array(t1) : n1.input = t1, n1.next_in = 0, n1.avail_in = n1.input.length;
                        do {
                            if (0 === n1.avail_out && (n1.output = new o.Buf8(s2), n1.next_out = 0, n1.avail_out = s2), 1 !== (r1 = a.deflate(n1, i2)) && r1 !== l) return this.onEnd(r1), !(this.ended = !0);
                            0 !== n1.avail_out && (0 !== n1.avail_in || 4 !== i2 && 2 !== i2) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(n1.output, n1.next_out))) : this.onData(o.shrinkBuf(n1.output, n1.next_out)));
                        }while ((0 < n1.avail_in || 0 === n1.avail_out) && 1 !== r1)
                        return 4 === i2 ? (r1 = a.deflateEnd(this.strm), this.onEnd(r1), this.ended = !0, r1 === l) : 2 !== i2 || (this.onEnd(l), !(n1.avail_out = 0));
                    }, p.prototype.onData = function(t1) {
                        this.chunks.push(t1);
                    }, p.prototype.onEnd = function(t1) {
                        t1 === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = t1, this.msg = this.strm.msg;
                    }, r.Deflate = p, r.deflate = i, r.deflateRaw = function(t1, e1) {
                        return (e1 = e1 || {
                        }).raw = !0, i(t1, e1);
                    }, r.gzip = function(t1, e1) {
                        return (e1 = e1 || {
                        }).gzip = !0, i(t1, e1);
                    };
                },
                {
                    "./utils/common": 41,
                    "./utils/strings": 42,
                    "./zlib/deflate": 46,
                    "./zlib/messages": 51,
                    "./zlib/zstream": 53
                }
            ],
            40: [
                function(t, e, r) {
                    var d = t("./zlib/inflate"), c = t("./utils/common"), p = t("./utils/strings"), m = t("./zlib/constants"), i = t("./zlib/messages"), n = t("./zlib/zstream"), s1 = t("./zlib/gzheader"), _ = Object.prototype.toString;
                    function a(t1) {
                        if (!(this instanceof a)) return new a(t1);
                        this.options = c.assign({
                            chunkSize: 16384,
                            windowBits: 0,
                            to: ""
                        }, t1 || {
                        });
                        var e1 = this.options;
                        e1.raw && 0 <= e1.windowBits && e1.windowBits < 16 && (e1.windowBits = -e1.windowBits, 0 === e1.windowBits && (e1.windowBits = -15)), !(0 <= e1.windowBits && e1.windowBits < 16) || t1 && t1.windowBits || (e1.windowBits += 32), 15 < e1.windowBits && e1.windowBits < 48 && 0 == (15 & e1.windowBits) && (e1.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new n, this.strm.avail_out = 0;
                        var r1 = d.inflateInit2(this.strm, e1.windowBits);
                        if (r1 !== m.Z_OK) throw new Error(i[r1]);
                        this.header = new s1, d.inflateGetHeader(this.strm, this.header);
                    }
                    function o(t1, e1) {
                        var r1 = new a(e1);
                        if ((r1.push(t1, !0), r1.err)) throw r1.msg || i[r1.err];
                        return r1.result;
                    }
                    a.prototype.push = function(t1, e1) {
                        var r1, i2, n1, s2, a1, o1, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = !1;
                        if (this.ended) return !1;
                        i2 = e1 === ~~e1 ? e1 : !0 === e1 ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof t1 ? h.input = p.binstring2buf(t1) : "[object ArrayBuffer]" === _.call(t1) ? h.input = new Uint8Array(t1) : h.input = t1, h.next_in = 0, h.avail_in = h.input.length;
                        do {
                            if (0 === h.avail_out && (h.output = new c.Buf8(u), h.next_out = 0, h.avail_out = u), (r1 = d.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o1 = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r1 = d.inflateSetDictionary(this.strm, o1)), r1 === m.Z_BUF_ERROR && !0 === f && (r1 = m.Z_OK, f = !1), r1 !== m.Z_STREAM_END && r1 !== m.Z_OK) return this.onEnd(r1), !(this.ended = !0);
                            h.next_out && (0 !== h.avail_out && r1 !== m.Z_STREAM_END && (0 !== h.avail_in || i2 !== m.Z_FINISH && i2 !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (n1 = p.utf8border(h.output, h.next_out), s2 = h.next_out - n1, a1 = p.buf2string(h.output, n1), h.next_out = s2, h.avail_out = u - s2, s2 && c.arraySet(h.output, h.output, n1, s2, 0), this.onData(a1)) : this.onData(c.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = !0);
                        }while ((0 < h.avail_in || 0 === h.avail_out) && r1 !== m.Z_STREAM_END)
                        return r1 === m.Z_STREAM_END && (i2 = m.Z_FINISH), i2 === m.Z_FINISH ? (r1 = d.inflateEnd(this.strm), this.onEnd(r1), this.ended = !0, r1 === m.Z_OK) : i2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
                    }, a.prototype.onData = function(t1) {
                        this.chunks.push(t1);
                    }, a.prototype.onEnd = function(t1) {
                        t1 === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = c.flattenChunks(this.chunks)), this.chunks = [], this.err = t1, this.msg = this.strm.msg;
                    }, r.Inflate = a, r.inflate = o, r.inflateRaw = function(t1, e1) {
                        return (e1 = e1 || {
                        }).raw = !0, o(t1, e1);
                    }, r.ungzip = o;
                },
                {
                    "./utils/common": 41,
                    "./utils/strings": 42,
                    "./zlib/constants": 44,
                    "./zlib/gzheader": 47,
                    "./zlib/inflate": 49,
                    "./zlib/messages": 51,
                    "./zlib/zstream": 53
                }
            ],
            41: [
                function(t, e, r) {
                    var i = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
                    r.assign = function(t1) {
                        for(var e1 = Array.prototype.slice.call(arguments, 1); e1.length;){
                            var r1 = e1.shift();
                            if (r1) {
                                if ("object" != typeof r1) throw new TypeError(r1 + "must be non-object");
                                for(var i2 in r1)r1.hasOwnProperty(i2) && (t1[i2] = r1[i2]);
                            }
                        }
                        return t1;
                    }, r.shrinkBuf = function(t1, e1) {
                        return t1.length === e1 ? t1 : t1.subarray ? t1.subarray(0, e1) : (t1.length = e1, t1);
                    };
                    var n = {
                        arraySet: function(t1, e1, r1, i2, n1) {
                            if (e1.subarray && t1.subarray) t1.set(e1.subarray(r1, r1 + i2), n1);
                            else for(var s1 = 0; s1 < i2; s1++)t1[n1 + s1] = e1[r1 + s1];
                        },
                        flattenChunks: function(t1) {
                            var e1, r1, i2, n, s1, a;
                            for((e1 = i2 = 0, r1 = t1.length); e1 < r1; e1++)i2 += t1[e1].length;
                            for((a = new Uint8Array(i2), e1 = n = 0, r1 = t1.length); e1 < r1; e1++)s1 = t1[e1], a.set(s1, n), n += s1.length;
                            return a;
                        }
                    }, s1 = {
                        arraySet: function(t1, e1, r1, i2, n1) {
                            for(var s1 = 0; s1 < i2; s1++)t1[n1 + s1] = e1[r1 + s1];
                        },
                        flattenChunks: function(t1) {
                            return [].concat.apply([], t1);
                        }
                    };
                    r.setTyped = function(t1) {
                        t1 ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, n)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s1));
                    }, r.setTyped(i);
                },
                {
                }
            ],
            42: [
                function(t, e, r) {
                    var h = t("./common"), n = !0, s1 = !0;
                    try {
                        String.fromCharCode.apply(null, [
                            0
                        ]);
                    } catch (t) {
                        n = !1;
                    }
                    try {
                        String.fromCharCode.apply(null, new Uint8Array(1));
                    } catch (t) {
                        s1 = !1;
                    }
                    for(var u = new h.Buf8(256), i = 0; i < 256; i++)u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
                    function l(t1, e1) {
                        if (e1 < 65537 && (t1.subarray && s1 || !t1.subarray && n)) return String.fromCharCode.apply(null, h.shrinkBuf(t1, e1));
                        for(var r1 = "", i2 = 0; i2 < e1; i2++)r1 += String.fromCharCode(t1[i2]);
                        return r1;
                    }
                    u[254] = u[254] = 1, r.string2buf = function(t1) {
                        var e1, r1, i2, n1, s2, a = t1.length, o = 0;
                        for(n1 = 0; n1 < a; n1++)55296 == (64512 & (r1 = t1.charCodeAt(n1))) && n1 + 1 < a && 56320 == (64512 & (i2 = t1.charCodeAt(n1 + 1))) && (r1 = 65536 + (r1 - 55296 << 10) + (i2 - 56320), n1++), o += r1 < 128 ? 1 : r1 < 2048 ? 2 : r1 < 65536 ? 3 : 4;
                        for(e1 = new h.Buf8(o), n1 = s2 = 0; s2 < o; n1++)55296 == (64512 & (r1 = t1.charCodeAt(n1))) && n1 + 1 < a && 56320 == (64512 & (i2 = t1.charCodeAt(n1 + 1))) && (r1 = 65536 + (r1 - 55296 << 10) + (i2 - 56320), n1++), r1 < 128 ? e1[s2++] = r1 : (r1 < 2048 ? e1[s2++] = 192 | r1 >>> 6 : (r1 < 65536 ? e1[s2++] = 224 | r1 >>> 12 : (e1[s2++] = 240 | r1 >>> 18, e1[s2++] = 128 | r1 >>> 12 & 63), e1[s2++] = 128 | r1 >>> 6 & 63), e1[s2++] = 128 | 63 & r1);
                        return e1;
                    }, r.buf2binstring = function(t1) {
                        return l(t1, t1.length);
                    }, r.binstring2buf = function(t1) {
                        for(var e1 = new h.Buf8(t1.length), r1 = 0, i2 = e1.length; r1 < i2; r1++)e1[r1] = t1.charCodeAt(r1);
                        return e1;
                    }, r.buf2string = function(t1, e1) {
                        var r1, i2, n1, s2, a = e1 || t1.length, o = new Array(2 * a);
                        for(r1 = i2 = 0; r1 < a;)if ((n1 = t1[r1++]) < 128) o[i2++] = n1;
                        else if (4 < (s2 = u[n1])) o[i2++] = 65533, r1 += s2 - 1;
                        else {
                            for(n1 &= 2 === s2 ? 31 : 3 === s2 ? 15 : 7; 1 < s2 && r1 < a;)n1 = n1 << 6 | 63 & t1[r1++], s2--;
                            1 < s2 ? o[i2++] = 65533 : n1 < 65536 ? o[i2++] = n1 : (n1 -= 65536, o[i2++] = 55296 | n1 >> 10 & 1023, o[i2++] = 56320 | 1023 & n1);
                        }
                        return l(o, i2);
                    }, r.utf8border = function(t1, e1) {
                        var r1;
                        for((e1 = e1 || t1.length) > t1.length && (e1 = t1.length), r1 = e1 - 1; 0 <= r1 && 128 == (192 & t1[r1]);)r1--;
                        return r1 < 0 ? e1 : 0 === r1 ? e1 : r1 + u[t1[r1]] > e1 ? r1 : e1;
                    };
                },
                {
                    "./common": 41
                }
            ],
            43: [
                function(t, e, r) {
                    e.exports = function(t1, e1, r1, i) {
                        for(var n = 65535 & t1 | 0, s1 = t1 >>> 16 & 65535 | 0, a = 0; 0 !== r1;){
                            for(r1 -= a = 2000 < r1 ? 2000 : r1; s1 = s1 + (n = n + e1[i++] | 0) | 0, --a;);
                            n %= 65521, s1 %= 65521;
                        }
                        return n | s1 << 16 | 0;
                    };
                },
                {
                }
            ],
            44: [
                function(t, e, r) {
                    e.exports = {
                        Z_NO_FLUSH: 0,
                        Z_PARTIAL_FLUSH: 1,
                        Z_SYNC_FLUSH: 2,
                        Z_FULL_FLUSH: 3,
                        Z_FINISH: 4,
                        Z_BLOCK: 5,
                        Z_TREES: 6,
                        Z_OK: 0,
                        Z_STREAM_END: 1,
                        Z_NEED_DICT: 2,
                        Z_ERRNO: -1,
                        Z_STREAM_ERROR: -2,
                        Z_DATA_ERROR: -3,
                        Z_BUF_ERROR: -5,
                        Z_NO_COMPRESSION: 0,
                        Z_BEST_SPEED: 1,
                        Z_BEST_COMPRESSION: 9,
                        Z_DEFAULT_COMPRESSION: -1,
                        Z_FILTERED: 1,
                        Z_HUFFMAN_ONLY: 2,
                        Z_RLE: 3,
                        Z_FIXED: 4,
                        Z_DEFAULT_STRATEGY: 0,
                        Z_BINARY: 0,
                        Z_TEXT: 1,
                        Z_UNKNOWN: 2,
                        Z_DEFLATED: 8
                    };
                },
                {
                }
            ],
            45: [
                function(t, e, r) {
                    var o = function() {
                        for(var t1, e1 = [], r1 = 0; r1 < 256; r1++){
                            t1 = r1;
                            for(var i = 0; i < 8; i++)t1 = 1 & t1 ? 3988292384 ^ t1 >>> 1 : t1 >>> 1;
                            e1[r1] = t1;
                        }
                        return e1;
                    }();
                    e.exports = function(t1, e1, r1, i) {
                        var n = o, s1 = i + r1;
                        t1 ^= -1;
                        for(var a = i; a < s1; a++)t1 = t1 >>> 8 ^ n[255 & (t1 ^ e1[a])];
                        return -1 ^ t1;
                    };
                },
                {
                }
            ],
            46: [
                function(t, e, r) {
                    var h, d = t("../utils/common"), u = t("./trees"), c = t("./adler32"), p = t("./crc32"), i = t("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, n = 2, v = 8, y2 = 9, s1 = 286, a = 30, o = 19, w = 2 * s1 + 1, k = 15, x2 = 3, S = 258, z = S + x2 + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
                    function R(t1, e1) {
                        return (t1.msg = i[e1], e1);
                    }
                    function T(t1) {
                        return (t1 << 1) - (4 < t1 ? 9 : 0);
                    }
                    function D(t1) {
                        for(var e1 = t1.length; 0 <= --e1;)t1[e1] = 0;
                    }
                    function F(t1) {
                        var e1 = t1.state, r1 = e1.pending;
                        r1 > t1.avail_out && (r1 = t1.avail_out), 0 !== r1 && (d.arraySet(t1.output, e1.pending_buf, e1.pending_out, r1, t1.next_out), t1.next_out += r1, e1.pending_out += r1, t1.total_out += r1, t1.avail_out -= r1, e1.pending -= r1, 0 === e1.pending && (e1.pending_out = 0));
                    }
                    function N(t1, e1) {
                        u._tr_flush_block(t1, 0 <= t1.block_start ? t1.block_start : -1, t1.strstart - t1.block_start, e1), t1.block_start = t1.strstart, F(t1.strm);
                    }
                    function U(t1, e1) {
                        t1.pending_buf[t1.pending++] = e1;
                    }
                    function P(t1, e1) {
                        t1.pending_buf[t1.pending++] = e1 >>> 8 & 255, t1.pending_buf[t1.pending++] = 255 & e1;
                    }
                    function L(t1, e1) {
                        var r1, i2, n1 = t1.max_chain_length, s2 = t1.strstart, a1 = t1.prev_length, o1 = t1.nice_match, h1 = t1.strstart > t1.w_size - z ? t1.strstart - (t1.w_size - z) : 0, u1 = t1.window, l1 = t1.w_mask, f1 = t1.prev, d1 = t1.strstart + S, c1 = u1[s2 + a1 - 1], p1 = u1[s2 + a1];
                        t1.prev_length >= t1.good_match && (n1 >>= 2), o1 > t1.lookahead && (o1 = t1.lookahead);
                        do {
                            if (u1[(r1 = e1) + a1] === p1 && u1[r1 + a1 - 1] === c1 && u1[r1] === u1[s2] && u1[++r1] === u1[s2 + 1]) {
                                s2 += 2, r1++;
                                do {
                                }while (u1[++s2] === u1[++r1] && u1[++s2] === u1[++r1] && u1[++s2] === u1[++r1] && u1[++s2] === u1[++r1] && u1[++s2] === u1[++r1] && u1[++s2] === u1[++r1] && u1[++s2] === u1[++r1] && u1[++s2] === u1[++r1] && s2 < d1)
                                if ((i2 = S - (d1 - s2), s2 = d1 - S, a1 < i2)) {
                                    if ((t1.match_start = e1, o1 <= (a1 = i2))) break;
                                    c1 = u1[s2 + a1 - 1], p1 = u1[s2 + a1];
                                }
                            }
                        }while ((e1 = f1[e1 & l1]) > h1 && 0 != --n1)
                        return a1 <= t1.lookahead ? a1 : t1.lookahead;
                    }
                    function j(t1) {
                        var e1, r1, i2, n1, s2, a1, o1, h1, u1, l1, f1 = t1.w_size;
                        do {
                            if ((n1 = t1.window_size - t1.lookahead - t1.strstart, t1.strstart >= f1 + (f1 - z))) {
                                for((d.arraySet(t1.window, t1.window, f1, f1, 0), t1.match_start -= f1, t1.strstart -= f1, t1.block_start -= f1, e1 = r1 = t1.hash_size); (i2 = t1.head[--e1], t1.head[e1] = f1 <= i2 ? i2 - f1 : 0, --r1););
                                for(e1 = r1 = f1; (i2 = t1.prev[--e1], t1.prev[e1] = f1 <= i2 ? i2 - f1 : 0, --r1););
                                n1 += f1;
                            }
                            if (0 === t1.strm.avail_in) break;
                            if ((a1 = t1.strm, o1 = t1.window, h1 = t1.strstart + t1.lookahead, u1 = n1, l1 = void 0, l1 = a1.avail_in, u1 < l1 && (l1 = u1), r1 = 0 === l1 ? 0 : (a1.avail_in -= l1, d.arraySet(o1, a1.input, a1.next_in, l1, h1), 1 === a1.state.wrap ? a1.adler = c(a1.adler, o1, l1, h1) : 2 === a1.state.wrap && (a1.adler = p(a1.adler, o1, l1, h1)), a1.next_in += l1, a1.total_in += l1, l1), t1.lookahead += r1, t1.lookahead + t1.insert >= x2)) for((s2 = t1.strstart - t1.insert, t1.ins_h = t1.window[s2], t1.ins_h = (t1.ins_h << t1.hash_shift ^ t1.window[s2 + 1]) & t1.hash_mask); t1.insert && (t1.ins_h = (t1.ins_h << t1.hash_shift ^ t1.window[s2 + x2 - 1]) & t1.hash_mask, t1.prev[s2 & t1.w_mask] = t1.head[t1.ins_h], t1.head[t1.ins_h] = s2, s2++, t1.insert--, !(t1.lookahead + t1.insert < x2)););
                        }while (t1.lookahead < z && 0 !== t1.strm.avail_in)
                    }
                    function Z(t1, e1) {
                        for(var r1, i2;;){
                            if (t1.lookahead < z) {
                                if ((j(t1), t1.lookahead < z && e1 === l)) return A;
                                if (0 === t1.lookahead) break;
                            }
                            if ((r1 = 0, t1.lookahead >= x2 && (t1.ins_h = (t1.ins_h << t1.hash_shift ^ t1.window[t1.strstart + x2 - 1]) & t1.hash_mask, r1 = t1.prev[t1.strstart & t1.w_mask] = t1.head[t1.ins_h], t1.head[t1.ins_h] = t1.strstart), 0 !== r1 && t1.strstart - r1 <= t1.w_size - z && (t1.match_length = L(t1, r1)), t1.match_length >= x2)) {
                                if ((i2 = u._tr_tally(t1, t1.strstart - t1.match_start, t1.match_length - x2), t1.lookahead -= t1.match_length, t1.match_length <= t1.max_lazy_match && t1.lookahead >= x2)) {
                                    for(t1.match_length--; (t1.strstart++, t1.ins_h = (t1.ins_h << t1.hash_shift ^ t1.window[t1.strstart + x2 - 1]) & t1.hash_mask, r1 = t1.prev[t1.strstart & t1.w_mask] = t1.head[t1.ins_h], t1.head[t1.ins_h] = t1.strstart, 0 != --t1.match_length););
                                    t1.strstart++;
                                } else t1.strstart += t1.match_length, t1.match_length = 0, t1.ins_h = t1.window[t1.strstart], t1.ins_h = (t1.ins_h << t1.hash_shift ^ t1.window[t1.strstart + 1]) & t1.hash_mask;
                            } else i2 = u._tr_tally(t1, 0, t1.window[t1.strstart]), t1.lookahead--, t1.strstart++;
                            if (i2 && (N(t1, !1), 0 === t1.strm.avail_out)) return A;
                        }
                        return (t1.insert = t1.strstart < x2 - 1 ? t1.strstart : x2 - 1, e1 === f ? (N(t1, !0), 0 === t1.strm.avail_out ? O : B) : t1.last_lit && (N(t1, !1), 0 === t1.strm.avail_out) ? A : I);
                    }
                    function W(t1, e1) {
                        for(var r1, i2, n1;;){
                            if (t1.lookahead < z) {
                                if ((j(t1), t1.lookahead < z && e1 === l)) return A;
                                if (0 === t1.lookahead) break;
                            }
                            if ((r1 = 0, t1.lookahead >= x2 && (t1.ins_h = (t1.ins_h << t1.hash_shift ^ t1.window[t1.strstart + x2 - 1]) & t1.hash_mask, r1 = t1.prev[t1.strstart & t1.w_mask] = t1.head[t1.ins_h], t1.head[t1.ins_h] = t1.strstart), t1.prev_length = t1.match_length, t1.prev_match = t1.match_start, t1.match_length = x2 - 1, 0 !== r1 && t1.prev_length < t1.max_lazy_match && t1.strstart - r1 <= t1.w_size - z && (t1.match_length = L(t1, r1), t1.match_length <= 5 && (1 === t1.strategy || t1.match_length === x2 && 4096 < t1.strstart - t1.match_start) && (t1.match_length = x2 - 1)), t1.prev_length >= x2 && t1.match_length <= t1.prev_length)) {
                                for((n1 = t1.strstart + t1.lookahead - x2, i2 = u._tr_tally(t1, t1.strstart - 1 - t1.prev_match, t1.prev_length - x2), t1.lookahead -= t1.prev_length - 1, t1.prev_length -= 2); ((++t1.strstart) <= n1 && (t1.ins_h = (t1.ins_h << t1.hash_shift ^ t1.window[t1.strstart + x2 - 1]) & t1.hash_mask, r1 = t1.prev[t1.strstart & t1.w_mask] = t1.head[t1.ins_h], t1.head[t1.ins_h] = t1.strstart), 0 != --t1.prev_length););
                                if ((t1.match_available = 0, t1.match_length = x2 - 1, t1.strstart++, i2 && (N(t1, !1), 0 === t1.strm.avail_out))) return A;
                            } else if (t1.match_available) {
                                if (((i2 = u._tr_tally(t1, 0, t1.window[t1.strstart - 1])) && N(t1, !1), t1.strstart++, t1.lookahead--, 0 === t1.strm.avail_out)) return A;
                            } else t1.match_available = 1, t1.strstart++, t1.lookahead--;
                        }
                        return (t1.match_available && (i2 = u._tr_tally(t1, 0, t1.window[t1.strstart - 1]), t1.match_available = 0), t1.insert = t1.strstart < x2 - 1 ? t1.strstart : x2 - 1, e1 === f ? (N(t1, !0), 0 === t1.strm.avail_out ? O : B) : t1.last_lit && (N(t1, !1), 0 === t1.strm.avail_out) ? A : I);
                    }
                    function M(t1, e1, r1, i2, n1) {
                        this.good_length = t1, this.max_lazy = e1, this.nice_length = r1, this.max_chain = i2, this.func = n1;
                    }
                    function H() {
                        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new d.Buf16(2 * w), this.dyn_dtree = new d.Buf16(2 * (2 * a + 1)), this.bl_tree = new d.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new d.Buf16(k + 1), this.heap = new d.Buf16(2 * s1 + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new d.Buf16(2 * s1 + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
                    }
                    function G(t1) {
                        var e1;
                        return t1 && t1.state ? (t1.total_in = t1.total_out = 0, t1.data_type = n, (e1 = t1.state).pending = 0, e1.pending_out = 0, e1.wrap < 0 && (e1.wrap = -e1.wrap), e1.status = e1.wrap ? C : E, t1.adler = 2 === e1.wrap ? 0 : 1, e1.last_flush = l, u._tr_init(e1), m) : R(t1, _);
                    }
                    function K(t1) {
                        var e1 = G(t1);
                        return (e1 === m && function(t2) {
                            t2.window_size = 2 * t2.w_size, D(t2.head), t2.max_lazy_match = h[t2.level].max_lazy, t2.good_match = h[t2.level].good_length, t2.nice_match = h[t2.level].nice_length, t2.max_chain_length = h[t2.level].max_chain, t2.strstart = 0, t2.block_start = 0, t2.lookahead = 0, t2.insert = 0, t2.match_length = t2.prev_length = x2 - 1, t2.match_available = 0, t2.ins_h = 0;
                        }(t1.state), e1);
                    }
                    function Y(t1, e1, r1, i2, n1, s2) {
                        if (!t1) return _;
                        var a1 = 1;
                        if ((e1 === g && (e1 = 6), i2 < 0 ? (a1 = 0, i2 = -i2) : 15 < i2 && (a1 = 2, i2 -= 16), n1 < 1 || y2 < n1 || r1 !== v || i2 < 8 || 15 < i2 || e1 < 0 || 9 < e1 || s2 < 0 || b < s2)) return R(t1, _);
                        8 === i2 && (i2 = 9);
                        var o1 = new H;
                        return ((t1.state = o1).strm = t1, o1.wrap = a1, o1.gzhead = null, o1.w_bits = i2, o1.w_size = 1 << o1.w_bits, o1.w_mask = o1.w_size - 1, o1.hash_bits = n1 + 7, o1.hash_size = 1 << o1.hash_bits, o1.hash_mask = o1.hash_size - 1, o1.hash_shift = ~~((o1.hash_bits + x2 - 1) / x2), o1.window = new d.Buf8(2 * o1.w_size), o1.head = new d.Buf16(o1.hash_size), o1.prev = new d.Buf16(o1.w_size), o1.lit_bufsize = 1 << n1 + 6, o1.pending_buf_size = 4 * o1.lit_bufsize, o1.pending_buf = new d.Buf8(o1.pending_buf_size), o1.d_buf = 1 * o1.lit_bufsize, o1.l_buf = 3 * o1.lit_bufsize, o1.level = e1, o1.strategy = s2, o1.method = r1, K(t1));
                    }
                    h = [
                        new M(0, 0, 0, 0, function(t1, e1) {
                            var r1 = 65535;
                            for(r1 > t1.pending_buf_size - 5 && (r1 = t1.pending_buf_size - 5);;){
                                if (t1.lookahead <= 1) {
                                    if ((j(t1), 0 === t1.lookahead && e1 === l)) return A;
                                    if (0 === t1.lookahead) break;
                                }
                                t1.strstart += t1.lookahead, t1.lookahead = 0;
                                var i2 = t1.block_start + r1;
                                if ((0 === t1.strstart || t1.strstart >= i2) && (t1.lookahead = t1.strstart - i2, t1.strstart = i2, N(t1, !1), 0 === t1.strm.avail_out)) return A;
                                if (t1.strstart - t1.block_start >= t1.w_size - z && (N(t1, !1), 0 === t1.strm.avail_out)) return A;
                            }
                            return (t1.insert = 0, e1 === f ? (N(t1, !0), 0 === t1.strm.avail_out ? O : B) : (t1.strstart > t1.block_start && (N(t1, !1), t1.strm.avail_out), A));
                        }),
                        new M(4, 4, 8, 4, Z),
                        new M(4, 5, 16, 8, Z),
                        new M(4, 6, 32, 32, Z),
                        new M(4, 4, 16, 16, W),
                        new M(8, 16, 32, 32, W),
                        new M(8, 16, 128, 128, W),
                        new M(8, 32, 128, 256, W),
                        new M(32, 128, 258, 1024, W),
                        new M(32, 258, 258, 4096, W)
                    ], r.deflateInit = function(t1, e1) {
                        return Y(t1, e1, v, 15, 8, 0);
                    }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function(t1, e1) {
                        return t1 && t1.state ? 2 !== t1.state.wrap ? _ : (t1.state.gzhead = e1, m) : _;
                    }, r.deflate = function(t1, e1) {
                        var r1, i2, n1, s2;
                        if (!t1 || !t1.state || 5 < e1 || e1 < 0) return t1 ? R(t1, _) : _;
                        if (i2 = t1.state, !t1.output || !t1.input && 0 !== t1.avail_in || 666 === i2.status && e1 !== f) return R(t1, 0 === t1.avail_out ? -5 : _);
                        if (i2.strm = t1, r1 = i2.last_flush, i2.last_flush = e1, i2.status === C) {
                            if (2 === i2.wrap) t1.adler = 0, U(i2, 31), U(i2, 139), U(i2, 8), i2.gzhead ? (U(i2, (i2.gzhead.text ? 1 : 0) + (i2.gzhead.hcrc ? 2 : 0) + (i2.gzhead.extra ? 4 : 0) + (i2.gzhead.name ? 8 : 0) + (i2.gzhead.comment ? 16 : 0)), U(i2, 255 & i2.gzhead.time), U(i2, i2.gzhead.time >> 8 & 255), U(i2, i2.gzhead.time >> 16 & 255), U(i2, i2.gzhead.time >> 24 & 255), U(i2, 9 === i2.level ? 2 : 2 <= i2.strategy || i2.level < 2 ? 4 : 0), U(i2, 255 & i2.gzhead.os), i2.gzhead.extra && i2.gzhead.extra.length && (U(i2, 255 & i2.gzhead.extra.length), U(i2, i2.gzhead.extra.length >> 8 & 255)), i2.gzhead.hcrc && (t1.adler = p(t1.adler, i2.pending_buf, i2.pending, 0)), i2.gzindex = 0, i2.status = 69) : (U(i2, 0), U(i2, 0), U(i2, 0), U(i2, 0), U(i2, 0), U(i2, 9 === i2.level ? 2 : 2 <= i2.strategy || i2.level < 2 ? 4 : 0), U(i2, 3), i2.status = E);
                            else {
                                var a1 = v + (i2.w_bits - 8 << 4) << 8;
                                a1 |= (2 <= i2.strategy || i2.level < 2 ? 0 : i2.level < 6 ? 1 : 6 === i2.level ? 2 : 3) << 6, 0 !== i2.strstart && (a1 |= 32), a1 += 31 - a1 % 31, i2.status = E, P(i2, a1), 0 !== i2.strstart && (P(i2, t1.adler >>> 16), P(i2, 65535 & t1.adler)), t1.adler = 1;
                            }
                        }
                        if (69 === i2.status) {
                            if (i2.gzhead.extra) {
                                for(n1 = i2.pending; i2.gzindex < (65535 & i2.gzhead.extra.length) && (i2.pending !== i2.pending_buf_size || (i2.gzhead.hcrc && i2.pending > n1 && (t1.adler = p(t1.adler, i2.pending_buf, i2.pending - n1, n1)), F(t1), n1 = i2.pending, i2.pending !== i2.pending_buf_size));)U(i2, 255 & i2.gzhead.extra[i2.gzindex]), i2.gzindex++;
                                i2.gzhead.hcrc && i2.pending > n1 && (t1.adler = p(t1.adler, i2.pending_buf, i2.pending - n1, n1)), i2.gzindex === i2.gzhead.extra.length && (i2.gzindex = 0, i2.status = 73);
                            } else i2.status = 73;
                        }
                        if (73 === i2.status) {
                            if (i2.gzhead.name) {
                                n1 = i2.pending;
                                do {
                                    if (i2.pending === i2.pending_buf_size && (i2.gzhead.hcrc && i2.pending > n1 && (t1.adler = p(t1.adler, i2.pending_buf, i2.pending - n1, n1)), F(t1), n1 = i2.pending, i2.pending === i2.pending_buf_size)) {
                                        s2 = 1;
                                        break;
                                    }
                                    s2 = i2.gzindex < i2.gzhead.name.length ? 255 & i2.gzhead.name.charCodeAt(i2.gzindex++) : 0, U(i2, s2);
                                }while (0 !== s2)
                                i2.gzhead.hcrc && i2.pending > n1 && (t1.adler = p(t1.adler, i2.pending_buf, i2.pending - n1, n1)), 0 === s2 && (i2.gzindex = 0, i2.status = 91);
                            } else i2.status = 91;
                        }
                        if (91 === i2.status) {
                            if (i2.gzhead.comment) {
                                n1 = i2.pending;
                                do {
                                    if (i2.pending === i2.pending_buf_size && (i2.gzhead.hcrc && i2.pending > n1 && (t1.adler = p(t1.adler, i2.pending_buf, i2.pending - n1, n1)), F(t1), n1 = i2.pending, i2.pending === i2.pending_buf_size)) {
                                        s2 = 1;
                                        break;
                                    }
                                    s2 = i2.gzindex < i2.gzhead.comment.length ? 255 & i2.gzhead.comment.charCodeAt(i2.gzindex++) : 0, U(i2, s2);
                                }while (0 !== s2)
                                i2.gzhead.hcrc && i2.pending > n1 && (t1.adler = p(t1.adler, i2.pending_buf, i2.pending - n1, n1)), 0 === s2 && (i2.status = 103);
                            } else i2.status = 103;
                        }
                        if (103 === i2.status && (i2.gzhead.hcrc ? (i2.pending + 2 > i2.pending_buf_size && F(t1), i2.pending + 2 <= i2.pending_buf_size && (U(i2, 255 & t1.adler), U(i2, t1.adler >> 8 & 255), t1.adler = 0, i2.status = E)) : i2.status = E), 0 !== i2.pending) {
                            if (F(t1), 0 === t1.avail_out) return i2.last_flush = -1, m;
                        } else if (0 === t1.avail_in && T(e1) <= T(r1) && e1 !== f) return R(t1, -5);
                        if (666 === i2.status && 0 !== t1.avail_in) return R(t1, -5);
                        if (0 !== t1.avail_in || 0 !== i2.lookahead || e1 !== l && 666 !== i2.status) {
                            var o1 = 2 === i2.strategy ? function(t2, e2) {
                                for(var r2;;){
                                    if (0 === t2.lookahead && (j(t2), 0 === t2.lookahead)) {
                                        if (e2 === l) return A;
                                        break;
                                    }
                                    if (t2.match_length = 0, r2 = u._tr_tally(t2, 0, t2.window[t2.strstart]), t2.lookahead--, t2.strstart++, r2 && (N(t2, !1), 0 === t2.strm.avail_out)) return A;
                                }
                                return t2.insert = 0, e2 === f ? (N(t2, !0), 0 === t2.strm.avail_out ? O : B) : t2.last_lit && (N(t2, !1), 0 === t2.strm.avail_out) ? A : I;
                            }(i2, e1) : 3 === i2.strategy ? function(t2, e2) {
                                for(var r2, i6, n2, s3, a1 = t2.window;;){
                                    if (t2.lookahead <= S) {
                                        if (j(t2), t2.lookahead <= S && e2 === l) return A;
                                        if (0 === t2.lookahead) break;
                                    }
                                    if (t2.match_length = 0, t2.lookahead >= x2 && 0 < t2.strstart && (i6 = a1[n2 = t2.strstart - 1]) === a1[++n2] && i6 === a1[++n2] && i6 === a1[++n2]) {
                                        s3 = t2.strstart + S;
                                        do {
                                        }while (i6 === a1[++n2] && i6 === a1[++n2] && i6 === a1[++n2] && i6 === a1[++n2] && i6 === a1[++n2] && i6 === a1[++n2] && i6 === a1[++n2] && i6 === a1[++n2] && n2 < s3)
                                        t2.match_length = S - (s3 - n2), t2.match_length > t2.lookahead && (t2.match_length = t2.lookahead);
                                    }
                                    if (t2.match_length >= x2 ? (r2 = u._tr_tally(t2, 1, t2.match_length - x2), t2.lookahead -= t2.match_length, t2.strstart += t2.match_length, t2.match_length = 0) : (r2 = u._tr_tally(t2, 0, t2.window[t2.strstart]), t2.lookahead--, t2.strstart++), r2 && (N(t2, !1), 0 === t2.strm.avail_out)) return A;
                                }
                                return t2.insert = 0, e2 === f ? (N(t2, !0), 0 === t2.strm.avail_out ? O : B) : t2.last_lit && (N(t2, !1), 0 === t2.strm.avail_out) ? A : I;
                            }(i2, e1) : h[i2.level].func(i2, e1);
                            if (o1 !== O && o1 !== B || (i2.status = 666), o1 === A || o1 === O) return 0 === t1.avail_out && (i2.last_flush = -1), m;
                            if (o1 === I && (1 === e1 ? u._tr_align(i2) : 5 !== e1 && (u._tr_stored_block(i2, 0, 0, !1), 3 === e1 && (D(i2.head), 0 === i2.lookahead && (i2.strstart = 0, i2.block_start = 0, i2.insert = 0))), F(t1), 0 === t1.avail_out)) return i2.last_flush = -1, m;
                        }
                        return e1 !== f ? m : i2.wrap <= 0 ? 1 : (2 === i2.wrap ? (U(i2, 255 & t1.adler), U(i2, t1.adler >> 8 & 255), U(i2, t1.adler >> 16 & 255), U(i2, t1.adler >> 24 & 255), U(i2, 255 & t1.total_in), U(i2, t1.total_in >> 8 & 255), U(i2, t1.total_in >> 16 & 255), U(i2, t1.total_in >> 24 & 255)) : (P(i2, t1.adler >>> 16), P(i2, 65535 & t1.adler)), F(t1), 0 < i2.wrap && (i2.wrap = -i2.wrap), 0 !== i2.pending ? m : 1);
                    }, r.deflateEnd = function(t1) {
                        var e1;
                        return t1 && t1.state ? (e1 = t1.state.status) !== C && 69 !== e1 && 73 !== e1 && 91 !== e1 && 103 !== e1 && e1 !== E && 666 !== e1 ? R(t1, _) : (t1.state = null, e1 === E ? R(t1, -3) : m) : _;
                    }, r.deflateSetDictionary = function(t1, e1) {
                        var r1, i2, n1, s2, a1, o1, h1, u1, l1 = e1.length;
                        if (!t1 || !t1.state) return _;
                        if (2 === (s2 = (r1 = t1.state).wrap) || 1 === s2 && r1.status !== C || r1.lookahead) return _;
                        for(1 === s2 && (t1.adler = c(t1.adler, e1, l1, 0)), r1.wrap = 0, l1 >= r1.w_size && (0 === s2 && (D(r1.head), r1.strstart = 0, r1.block_start = 0, r1.insert = 0), u1 = new d.Buf8(r1.w_size), d.arraySet(u1, e1, l1 - r1.w_size, r1.w_size, 0), e1 = u1, l1 = r1.w_size), a1 = t1.avail_in, o1 = t1.next_in, h1 = t1.input, t1.avail_in = l1, t1.next_in = 0, t1.input = e1, j(r1); r1.lookahead >= x2;){
                            for(i2 = r1.strstart, n1 = r1.lookahead - (x2 - 1); r1.ins_h = (r1.ins_h << r1.hash_shift ^ r1.window[i2 + x2 - 1]) & r1.hash_mask, r1.prev[i2 & r1.w_mask] = r1.head[r1.ins_h], r1.head[r1.ins_h] = i2, i2++, --n1;);
                            r1.strstart = i2, r1.lookahead = x2 - 1, j(r1);
                        }
                        return r1.strstart += r1.lookahead, r1.block_start = r1.strstart, r1.insert = r1.lookahead, r1.lookahead = 0, r1.match_length = r1.prev_length = x2 - 1, r1.match_available = 0, t1.next_in = o1, t1.input = h1, t1.avail_in = a1, r1.wrap = s2, m;
                    }, r.deflateInfo = "pako deflate (from Nodeca project)";
                },
                {
                    "../utils/common": 41,
                    "./adler32": 43,
                    "./crc32": 45,
                    "./messages": 51,
                    "./trees": 52
                }
            ],
            47: [
                function(t, e, r) {
                    e.exports = function() {
                        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
                    };
                },
                {
                }
            ],
            48: [
                function(t, e, r) {
                    e.exports = function(t1, e1) {
                        var r1, i, n, s1, a, o, h, u, l, f, d, c, p, m, _, g, b, v, y2, w, k, x2, S, z, C;
                        r1 = t1.state, i = t1.next_in, z = t1.input, n = i + (t1.avail_in - 5), s1 = t1.next_out, C = t1.output, a = s1 - (e1 - t1.avail_out), o = s1 + (t1.avail_out - 257), h = r1.dmax, u = r1.wsize, l = r1.whave, f = r1.wnext, d = r1.window, c = r1.hold, p = r1.bits, m = r1.lencode, _ = r1.distcode, g = (1 << r1.lenbits) - 1, b = (1 << r1.distbits) - 1;
                        t: do {
                            p < 15 && (c += z[i++] << p, p += 8, c += z[i++] << p, p += 8), v = m[c & g];
                            e: for(;;){
                                if (c >>>= y2 = v >>> 24, p -= y2, 0 === (y2 = v >>> 16 & 255)) C[s1++] = 65535 & v;
                                else {
                                    if (!(16 & y2)) {
                                        if (0 == (64 & y2)) {
                                            v = m[(65535 & v) + (c & (1 << y2) - 1)];
                                            continue e;
                                        }
                                        if (32 & y2) {
                                            r1.mode = 12;
                                            break t;
                                        }
                                        t1.msg = "invalid literal/length code", r1.mode = 30;
                                        break t;
                                    }
                                    w = 65535 & v, (y2 &= 15) && (p < y2 && (c += z[i++] << p, p += 8), w += c & (1 << y2) - 1, c >>>= y2, p -= y2), p < 15 && (c += z[i++] << p, p += 8, c += z[i++] << p, p += 8), v = _[c & b];
                                    r: for(;;){
                                        if (c >>>= y2 = v >>> 24, p -= y2, !(16 & (y2 = v >>> 16 & 255))) {
                                            if (0 == (64 & y2)) {
                                                v = _[(65535 & v) + (c & (1 << y2) - 1)];
                                                continue r;
                                            }
                                            t1.msg = "invalid distance code", r1.mode = 30;
                                            break t;
                                        }
                                        if (k = 65535 & v, p < (y2 &= 15) && (c += z[i++] << p, (p += 8) < y2 && (c += z[i++] << p, p += 8)), h < (k += c & (1 << y2) - 1)) {
                                            t1.msg = "invalid distance too far back", r1.mode = 30;
                                            break t;
                                        }
                                        if (c >>>= y2, p -= y2, (y2 = s1 - a) < k) {
                                            if (l < (y2 = k - y2) && r1.sane) {
                                                t1.msg = "invalid distance too far back", r1.mode = 30;
                                                break t;
                                            }
                                            if (S = d, (x2 = 0) === f) {
                                                if (x2 += u - y2, y2 < w) {
                                                    for(w -= y2; C[s1++] = d[x2++], --y2;);
                                                    x2 = s1 - k, S = C;
                                                }
                                            } else if (f < y2) {
                                                if (x2 += u + f - y2, (y2 -= f) < w) {
                                                    for(w -= y2; C[s1++] = d[x2++], --y2;);
                                                    if (x2 = 0, f < w) {
                                                        for(w -= y2 = f; C[s1++] = d[x2++], --y2;);
                                                        x2 = s1 - k, S = C;
                                                    }
                                                }
                                            } else if (x2 += f - y2, y2 < w) {
                                                for(w -= y2; C[s1++] = d[x2++], --y2;);
                                                x2 = s1 - k, S = C;
                                            }
                                            for(; 2 < w;)C[s1++] = S[x2++], C[s1++] = S[x2++], C[s1++] = S[x2++], w -= 3;
                                            w && (C[s1++] = S[x2++], 1 < w && (C[s1++] = S[x2++]));
                                        } else {
                                            for(x2 = s1 - k; C[s1++] = C[x2++], C[s1++] = C[x2++], C[s1++] = C[x2++], 2 < (w -= 3););
                                            w && (C[s1++] = C[x2++], 1 < w && (C[s1++] = C[x2++]));
                                        }
                                        break;
                                    }
                                }
                                break;
                            }
                        }while (i < n && s1 < o)
                        i -= w = p >> 3, c &= (1 << (p -= w << 3)) - 1, t1.next_in = i, t1.next_out = s1, t1.avail_in = i < n ? n - i + 5 : 5 - (i - n), t1.avail_out = s1 < o ? o - s1 + 257 : 257 - (s1 - o), r1.hold = c, r1.bits = p;
                    };
                },
                {
                }
            ],
            49: [
                function(t, e, r) {
                    var I = t("../utils/common"), O = t("./adler32"), B = t("./crc32"), R = t("./inffast"), T = t("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, i = 852, n = 592;
                    function L(t1) {
                        return (t1 >>> 24 & 255) + (t1 >>> 8 & 65280) + ((65280 & t1) << 8) + ((255 & t1) << 24);
                    }
                    function s1() {
                        this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
                    }
                    function a(t1) {
                        var e1;
                        return t1 && t1.state ? (e1 = t1.state, t1.total_in = t1.total_out = e1.total = 0, t1.msg = "", e1.wrap && (t1.adler = 1 & e1.wrap), e1.mode = P, e1.last = 0, e1.havedict = 0, e1.dmax = 32768, e1.head = null, e1.hold = 0, e1.bits = 0, e1.lencode = e1.lendyn = new I.Buf32(i), e1.distcode = e1.distdyn = new I.Buf32(n), e1.sane = 1, e1.back = -1, N) : U;
                    }
                    function o(t1) {
                        var e1;
                        return t1 && t1.state ? ((e1 = t1.state).wsize = 0, e1.whave = 0, e1.wnext = 0, a(t1)) : U;
                    }
                    function h(t1, e1) {
                        var r1, i2;
                        return t1 && t1.state ? (i2 = t1.state, e1 < 0 ? (r1 = 0, e1 = -e1) : (r1 = 1 + (e1 >> 4), e1 < 48 && (e1 &= 15)), e1 && (e1 < 8 || 15 < e1) ? U : (null !== i2.window && i2.wbits !== e1 && (i2.window = null), i2.wrap = r1, i2.wbits = e1, o(t1))) : U;
                    }
                    function u(t1, e1) {
                        var r1, i2;
                        return t1 ? (i2 = new s1, (t1.state = i2).window = null, (r1 = h(t1, e1)) !== N && (t1.state = null), r1) : U;
                    }
                    var l, f, d = !0;
                    function j(t1) {
                        if (d) {
                            var e1;
                            for((l = new I.Buf32(512), f = new I.Buf32(32), e1 = 0); e1 < 144;)t1.lens[e1++] = 8;
                            for(; e1 < 256;)t1.lens[e1++] = 9;
                            for(; e1 < 280;)t1.lens[e1++] = 7;
                            for(; e1 < 288;)t1.lens[e1++] = 8;
                            for((T(D, t1.lens, 0, 288, l, 0, t1.work, {
                                bits: 9
                            }), e1 = 0); e1 < 32;)t1.lens[e1++] = 5;
                            T(F, t1.lens, 0, 32, f, 0, t1.work, {
                                bits: 5
                            }), d = !1;
                        }
                        t1.lencode = l, t1.lenbits = 9, t1.distcode = f, t1.distbits = 5;
                    }
                    function Z(t1, e1, r1, i2) {
                        var n1, s2 = t1.state;
                        return (null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), i2 >= s2.wsize ? (I.arraySet(s2.window, e1, r1 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (i2 < (n1 = s2.wsize - s2.wnext) && (n1 = i2), I.arraySet(s2.window, e1, r1 - i2, n1, s2.wnext), (i2 -= n1) ? (I.arraySet(s2.window, e1, r1 - i2, i2, 0), s2.wnext = i2, s2.whave = s2.wsize) : (s2.wnext += n1, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += n1))), 0);
                    }
                    r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function(t1) {
                        return u(t1, 15);
                    }, r.inflateInit2 = u, r.inflate = function(t1, e1) {
                        var r1, i2, n1, s2, a1, o1, h1, u1, l1, f1, d1, c, p, m, _, g, b, v, y2, w, k, x2, S, z, C = 0, E = new I.Buf8(4), A = [
                            16,
                            17,
                            18,
                            0,
                            8,
                            7,
                            9,
                            6,
                            10,
                            5,
                            11,
                            4,
                            12,
                            3,
                            13,
                            2,
                            14,
                            1,
                            15
                        ];
                        if (!t1 || !t1.state || !t1.output || !t1.input && 0 !== t1.avail_in) return U;
                        12 === (r1 = t1.state).mode && (r1.mode = 13), a1 = t1.next_out, n1 = t1.output, h1 = t1.avail_out, s2 = t1.next_in, i2 = t1.input, o1 = t1.avail_in, u1 = r1.hold, l1 = r1.bits, f1 = o1, d1 = h1, x2 = N;
                        t: for(;;)switch(r1.mode){
                            case P:
                                if (0 === r1.wrap) {
                                    r1.mode = 13;
                                    break;
                                }
                                for(; l1 < 16;){
                                    if (0 === o1) break t;
                                    o1--, u1 += i2[s2++] << l1, l1 += 8;
                                }
                                if (2 & r1.wrap && 35615 === u1) {
                                    E[r1.check = 0] = 255 & u1, E[1] = u1 >>> 8 & 255, r1.check = B(r1.check, E, 2, 0), l1 = u1 = 0, r1.mode = 2;
                                    break;
                                }
                                if (r1.flags = 0, r1.head && (r1.head.done = !1), !(1 & r1.wrap) || (((255 & u1) << 8) + (u1 >> 8)) % 31) {
                                    t1.msg = "incorrect header check", r1.mode = 30;
                                    break;
                                }
                                if (8 != (15 & u1)) {
                                    t1.msg = "unknown compression method", r1.mode = 30;
                                    break;
                                }
                                if (l1 -= 4, k = 8 + (15 & (u1 >>>= 4)), 0 === r1.wbits) r1.wbits = k;
                                else if (k > r1.wbits) {
                                    t1.msg = "invalid window size", r1.mode = 30;
                                    break;
                                }
                                r1.dmax = 1 << k, t1.adler = r1.check = 1, r1.mode = 512 & u1 ? 10 : 12, l1 = u1 = 0;
                                break;
                            case 2:
                                for(; l1 < 16;){
                                    if (0 === o1) break t;
                                    o1--, u1 += i2[s2++] << l1, l1 += 8;
                                }
                                if (r1.flags = u1, 8 != (255 & r1.flags)) {
                                    t1.msg = "unknown compression method", r1.mode = 30;
                                    break;
                                }
                                if (57344 & r1.flags) {
                                    t1.msg = "unknown header flags set", r1.mode = 30;
                                    break;
                                }
                                r1.head && (r1.head.text = u1 >> 8 & 1), 512 & r1.flags && (E[0] = 255 & u1, E[1] = u1 >>> 8 & 255, r1.check = B(r1.check, E, 2, 0)), l1 = u1 = 0, r1.mode = 3;
                            case 3:
                                for(; l1 < 32;){
                                    if (0 === o1) break t;
                                    o1--, u1 += i2[s2++] << l1, l1 += 8;
                                }
                                r1.head && (r1.head.time = u1), 512 & r1.flags && (E[0] = 255 & u1, E[1] = u1 >>> 8 & 255, E[2] = u1 >>> 16 & 255, E[3] = u1 >>> 24 & 255, r1.check = B(r1.check, E, 4, 0)), l1 = u1 = 0, r1.mode = 4;
                            case 4:
                                for(; l1 < 16;){
                                    if (0 === o1) break t;
                                    o1--, u1 += i2[s2++] << l1, l1 += 8;
                                }
                                r1.head && (r1.head.xflags = 255 & u1, r1.head.os = u1 >> 8), 512 & r1.flags && (E[0] = 255 & u1, E[1] = u1 >>> 8 & 255, r1.check = B(r1.check, E, 2, 0)), l1 = u1 = 0, r1.mode = 5;
                            case 5:
                                if (1024 & r1.flags) {
                                    for(; l1 < 16;){
                                        if (0 === o1) break t;
                                        o1--, u1 += i2[s2++] << l1, l1 += 8;
                                    }
                                    r1.length = u1, r1.head && (r1.head.extra_len = u1), 512 & r1.flags && (E[0] = 255 & u1, E[1] = u1 >>> 8 & 255, r1.check = B(r1.check, E, 2, 0)), l1 = u1 = 0;
                                } else r1.head && (r1.head.extra = null);
                                r1.mode = 6;
                            case 6:
                                if (1024 & r1.flags && (o1 < (c = r1.length) && (c = o1), c && (r1.head && (k = r1.head.extra_len - r1.length, r1.head.extra || (r1.head.extra = new Array(r1.head.extra_len)), I.arraySet(r1.head.extra, i2, s2, c, k)), 512 & r1.flags && (r1.check = B(r1.check, i2, c, s2)), o1 -= c, s2 += c, r1.length -= c), r1.length)) break t;
                                r1.length = 0, r1.mode = 7;
                            case 7:
                                if (2048 & r1.flags) {
                                    if (0 === o1) break t;
                                    for(c = 0; k = i2[s2 + c++], r1.head && k && r1.length < 65536 && (r1.head.name += String.fromCharCode(k)), k && c < o1;);
                                    if (512 & r1.flags && (r1.check = B(r1.check, i2, c, s2)), o1 -= c, s2 += c, k) break t;
                                } else r1.head && (r1.head.name = null);
                                r1.length = 0, r1.mode = 8;
                            case 8:
                                if (4096 & r1.flags) {
                                    if (0 === o1) break t;
                                    for(c = 0; k = i2[s2 + c++], r1.head && k && r1.length < 65536 && (r1.head.comment += String.fromCharCode(k)), k && c < o1;);
                                    if (512 & r1.flags && (r1.check = B(r1.check, i2, c, s2)), o1 -= c, s2 += c, k) break t;
                                } else r1.head && (r1.head.comment = null);
                                r1.mode = 9;
                            case 9:
                                if (512 & r1.flags) {
                                    for(; l1 < 16;){
                                        if (0 === o1) break t;
                                        o1--, u1 += i2[s2++] << l1, l1 += 8;
                                    }
                                    if (u1 !== (65535 & r1.check)) {
                                        t1.msg = "header crc mismatch", r1.mode = 30;
                                        break;
                                    }
                                    l1 = u1 = 0;
                                }
                                r1.head && (r1.head.hcrc = r1.flags >> 9 & 1, r1.head.done = !0), t1.adler = r1.check = 0, r1.mode = 12;
                                break;
                            case 10:
                                for(; l1 < 32;){
                                    if (0 === o1) break t;
                                    o1--, u1 += i2[s2++] << l1, l1 += 8;
                                }
                                t1.adler = r1.check = L(u1), l1 = u1 = 0, r1.mode = 11;
                            case 11:
                                if (0 === r1.havedict) return t1.next_out = a1, t1.avail_out = h1, t1.next_in = s2, t1.avail_in = o1, r1.hold = u1, r1.bits = l1, 2;
                                t1.adler = r1.check = 1, r1.mode = 12;
                            case 12:
                                if (5 === e1 || 6 === e1) break t;
                            case 13:
                                if (r1.last) {
                                    u1 >>>= 7 & l1, l1 -= 7 & l1, r1.mode = 27;
                                    break;
                                }
                                for(; l1 < 3;){
                                    if (0 === o1) break t;
                                    o1--, u1 += i2[s2++] << l1, l1 += 8;
                                }
                                switch(r1.last = 1 & u1, l1 -= 1, 3 & (u1 >>>= 1)){
                                    case 0:
                                        r1.mode = 14;
                                        break;
                                    case 1:
                                        if (j(r1), r1.mode = 20, 6 !== e1) break;
                                        u1 >>>= 2, l1 -= 2;
                                        break t;
                                    case 2:
                                        r1.mode = 17;
                                        break;
                                    case 3:
                                        t1.msg = "invalid block type", r1.mode = 30;
                                }
                                u1 >>>= 2, l1 -= 2;
                                break;
                            case 14:
                                for(u1 >>>= 7 & l1, l1 -= 7 & l1; l1 < 32;){
                                    if (0 === o1) break t;
                                    o1--, u1 += i2[s2++] << l1, l1 += 8;
                                }
                                if ((65535 & u1) != (u1 >>> 16 ^ 65535)) {
                                    t1.msg = "invalid stored block lengths", r1.mode = 30;
                                    break;
                                }
                                if (r1.length = 65535 & u1, l1 = u1 = 0, r1.mode = 15, 6 === e1) break t;
                            case 15:
                                r1.mode = 16;
                            case 16:
                                if (c = r1.length) {
                                    if (o1 < c && (c = o1), h1 < c && (c = h1), 0 === c) break t;
                                    I.arraySet(n1, i2, s2, c, a1), o1 -= c, s2 += c, h1 -= c, a1 += c, r1.length -= c;
                                    break;
                                }
                                r1.mode = 12;
                                break;
                            case 17:
                                for(; l1 < 14;){
                                    if (0 === o1) break t;
                                    o1--, u1 += i2[s2++] << l1, l1 += 8;
                                }
                                if (r1.nlen = 257 + (31 & u1), u1 >>>= 5, l1 -= 5, r1.ndist = 1 + (31 & u1), u1 >>>= 5, l1 -= 5, r1.ncode = 4 + (15 & u1), u1 >>>= 4, l1 -= 4, 286 < r1.nlen || 30 < r1.ndist) {
                                    t1.msg = "too many length or distance symbols", r1.mode = 30;
                                    break;
                                }
                                r1.have = 0, r1.mode = 18;
                            case 18:
                                for(; r1.have < r1.ncode;){
                                    for(; l1 < 3;){
                                        if (0 === o1) break t;
                                        o1--, u1 += i2[s2++] << l1, l1 += 8;
                                    }
                                    r1.lens[A[r1.have++]] = 7 & u1, u1 >>>= 3, l1 -= 3;
                                }
                                for(; r1.have < 19;)r1.lens[A[r1.have++]] = 0;
                                if (r1.lencode = r1.lendyn, r1.lenbits = 7, S = {
                                    bits: r1.lenbits
                                }, x2 = T(0, r1.lens, 0, 19, r1.lencode, 0, r1.work, S), r1.lenbits = S.bits, x2) {
                                    t1.msg = "invalid code lengths set", r1.mode = 30;
                                    break;
                                }
                                r1.have = 0, r1.mode = 19;
                            case 19:
                                for(; r1.have < r1.nlen + r1.ndist;){
                                    for(; g = (C = r1.lencode[u1 & (1 << r1.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l1);){
                                        if (0 === o1) break t;
                                        o1--, u1 += i2[s2++] << l1, l1 += 8;
                                    }
                                    if (b < 16) u1 >>>= _, l1 -= _, r1.lens[r1.have++] = b;
                                    else {
                                        if (16 === b) {
                                            for(z = _ + 2; l1 < z;){
                                                if (0 === o1) break t;
                                                o1--, u1 += i2[s2++] << l1, l1 += 8;
                                            }
                                            if (u1 >>>= _, l1 -= _, 0 === r1.have) {
                                                t1.msg = "invalid bit length repeat", r1.mode = 30;
                                                break;
                                            }
                                            k = r1.lens[r1.have - 1], c = 3 + (3 & u1), u1 >>>= 2, l1 -= 2;
                                        } else if (17 === b) {
                                            for(z = _ + 3; l1 < z;){
                                                if (0 === o1) break t;
                                                o1--, u1 += i2[s2++] << l1, l1 += 8;
                                            }
                                            l1 -= _, k = 0, c = 3 + (7 & (u1 >>>= _)), u1 >>>= 3, l1 -= 3;
                                        } else {
                                            for(z = _ + 7; l1 < z;){
                                                if (0 === o1) break t;
                                                o1--, u1 += i2[s2++] << l1, l1 += 8;
                                            }
                                            l1 -= _, k = 0, c = 11 + (127 & (u1 >>>= _)), u1 >>>= 7, l1 -= 7;
                                        }
                                        if (r1.have + c > r1.nlen + r1.ndist) {
                                            t1.msg = "invalid bit length repeat", r1.mode = 30;
                                            break;
                                        }
                                        for(; c--;)r1.lens[r1.have++] = k;
                                    }
                                }
                                if (30 === r1.mode) break;
                                if (0 === r1.lens[256]) {
                                    t1.msg = "invalid code -- missing end-of-block", r1.mode = 30;
                                    break;
                                }
                                if (r1.lenbits = 9, S = {
                                    bits: r1.lenbits
                                }, x2 = T(D, r1.lens, 0, r1.nlen, r1.lencode, 0, r1.work, S), r1.lenbits = S.bits, x2) {
                                    t1.msg = "invalid literal/lengths set", r1.mode = 30;
                                    break;
                                }
                                if (r1.distbits = 6, r1.distcode = r1.distdyn, S = {
                                    bits: r1.distbits
                                }, x2 = T(F, r1.lens, r1.nlen, r1.ndist, r1.distcode, 0, r1.work, S), r1.distbits = S.bits, x2) {
                                    t1.msg = "invalid distances set", r1.mode = 30;
                                    break;
                                }
                                if (r1.mode = 20, 6 === e1) break t;
                            case 20:
                                r1.mode = 21;
                            case 21:
                                if (6 <= o1 && 258 <= h1) {
                                    t1.next_out = a1, t1.avail_out = h1, t1.next_in = s2, t1.avail_in = o1, r1.hold = u1, r1.bits = l1, R(t1, d1), a1 = t1.next_out, n1 = t1.output, h1 = t1.avail_out, s2 = t1.next_in, i2 = t1.input, o1 = t1.avail_in, u1 = r1.hold, l1 = r1.bits, 12 === r1.mode && (r1.back = -1);
                                    break;
                                }
                                for(r1.back = 0; g = (C = r1.lencode[u1 & (1 << r1.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l1);){
                                    if (0 === o1) break t;
                                    o1--, u1 += i2[s2++] << l1, l1 += 8;
                                }
                                if (g && 0 == (240 & g)) {
                                    for(v = _, y2 = g, w = b; g = (C = r1.lencode[w + ((u1 & (1 << v + y2) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l1);){
                                        if (0 === o1) break t;
                                        o1--, u1 += i2[s2++] << l1, l1 += 8;
                                    }
                                    u1 >>>= v, l1 -= v, r1.back += v;
                                }
                                if (u1 >>>= _, l1 -= _, r1.back += _, r1.length = b, 0 === g) {
                                    r1.mode = 26;
                                    break;
                                }
                                if (32 & g) {
                                    r1.back = -1, r1.mode = 12;
                                    break;
                                }
                                if (64 & g) {
                                    t1.msg = "invalid literal/length code", r1.mode = 30;
                                    break;
                                }
                                r1.extra = 15 & g, r1.mode = 22;
                            case 22:
                                if (r1.extra) {
                                    for(z = r1.extra; l1 < z;){
                                        if (0 === o1) break t;
                                        o1--, u1 += i2[s2++] << l1, l1 += 8;
                                    }
                                    r1.length += u1 & (1 << r1.extra) - 1, u1 >>>= r1.extra, l1 -= r1.extra, r1.back += r1.extra;
                                }
                                r1.was = r1.length, r1.mode = 23;
                            case 23:
                                for(; g = (C = r1.distcode[u1 & (1 << r1.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l1);){
                                    if (0 === o1) break t;
                                    o1--, u1 += i2[s2++] << l1, l1 += 8;
                                }
                                if (0 == (240 & g)) {
                                    for(v = _, y2 = g, w = b; g = (C = r1.distcode[w + ((u1 & (1 << v + y2) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l1);){
                                        if (0 === o1) break t;
                                        o1--, u1 += i2[s2++] << l1, l1 += 8;
                                    }
                                    u1 >>>= v, l1 -= v, r1.back += v;
                                }
                                if (u1 >>>= _, l1 -= _, r1.back += _, 64 & g) {
                                    t1.msg = "invalid distance code", r1.mode = 30;
                                    break;
                                }
                                r1.offset = b, r1.extra = 15 & g, r1.mode = 24;
                            case 24:
                                if (r1.extra) {
                                    for(z = r1.extra; l1 < z;){
                                        if (0 === o1) break t;
                                        o1--, u1 += i2[s2++] << l1, l1 += 8;
                                    }
                                    r1.offset += u1 & (1 << r1.extra) - 1, u1 >>>= r1.extra, l1 -= r1.extra, r1.back += r1.extra;
                                }
                                if (r1.offset > r1.dmax) {
                                    t1.msg = "invalid distance too far back", r1.mode = 30;
                                    break;
                                }
                                r1.mode = 25;
                            case 25:
                                if (0 === h1) break t;
                                if (c = d1 - h1, r1.offset > c) {
                                    if ((c = r1.offset - c) > r1.whave && r1.sane) {
                                        t1.msg = "invalid distance too far back", r1.mode = 30;
                                        break;
                                    }
                                    p = c > r1.wnext ? (c -= r1.wnext, r1.wsize - c) : r1.wnext - c, c > r1.length && (c = r1.length), m = r1.window;
                                } else m = n1, p = a1 - r1.offset, c = r1.length;
                                for(h1 < c && (c = h1), h1 -= c, r1.length -= c; n1[a1++] = m[p++], --c;);
                                0 === r1.length && (r1.mode = 21);
                                break;
                            case 26:
                                if (0 === h1) break t;
                                n1[a1++] = r1.length, h1--, r1.mode = 21;
                                break;
                            case 27:
                                if (r1.wrap) {
                                    for(; l1 < 32;){
                                        if (0 === o1) break t;
                                        o1--, u1 |= i2[s2++] << l1, l1 += 8;
                                    }
                                    if (d1 -= h1, t1.total_out += d1, r1.total += d1, d1 && (t1.adler = r1.check = r1.flags ? B(r1.check, n1, d1, a1 - d1) : O(r1.check, n1, d1, a1 - d1)), d1 = h1, (r1.flags ? u1 : L(u1)) !== r1.check) {
                                        t1.msg = "incorrect data check", r1.mode = 30;
                                        break;
                                    }
                                    l1 = u1 = 0;
                                }
                                r1.mode = 28;
                            case 28:
                                if (r1.wrap && r1.flags) {
                                    for(; l1 < 32;){
                                        if (0 === o1) break t;
                                        o1--, u1 += i2[s2++] << l1, l1 += 8;
                                    }
                                    if (u1 !== (4294967295 & r1.total)) {
                                        t1.msg = "incorrect length check", r1.mode = 30;
                                        break;
                                    }
                                    l1 = u1 = 0;
                                }
                                r1.mode = 29;
                            case 29:
                                x2 = 1;
                                break t;
                            case 30:
                                x2 = -3;
                                break t;
                            case 31:
                                return -4;
                            case 32:
                            default:
                                return U;
                        }
                        return t1.next_out = a1, t1.avail_out = h1, t1.next_in = s2, t1.avail_in = o1, r1.hold = u1, r1.bits = l1, (r1.wsize || d1 !== t1.avail_out && r1.mode < 30 && (r1.mode < 27 || 4 !== e1)) && Z(t1, t1.output, t1.next_out, d1 - t1.avail_out) ? (r1.mode = 31, -4) : (f1 -= t1.avail_in, d1 -= t1.avail_out, t1.total_in += f1, t1.total_out += d1, r1.total += d1, r1.wrap && d1 && (t1.adler = r1.check = r1.flags ? B(r1.check, n1, d1, t1.next_out - d1) : O(r1.check, n1, d1, t1.next_out - d1)), t1.data_type = r1.bits + (r1.last ? 64 : 0) + (12 === r1.mode ? 128 : 0) + (20 === r1.mode || 15 === r1.mode ? 256 : 0), (0 == f1 && 0 === d1 || 4 === e1) && x2 === N && (x2 = -5), x2);
                    }, r.inflateEnd = function(t1) {
                        if (!t1 || !t1.state) return U;
                        var e1 = t1.state;
                        return e1.window && (e1.window = null), t1.state = null, N;
                    }, r.inflateGetHeader = function(t1, e1) {
                        var r1;
                        return t1 && t1.state ? 0 == (2 & (r1 = t1.state).wrap) ? U : ((r1.head = e1).done = !1, N) : U;
                    }, r.inflateSetDictionary = function(t1, e1) {
                        var r1, i2 = e1.length;
                        return t1 && t1.state ? 0 !== (r1 = t1.state).wrap && 11 !== r1.mode ? U : 11 === r1.mode && O(1, e1, i2, 0) !== r1.check ? -3 : Z(t1, e1, i2, i2) ? (r1.mode = 31, -4) : (r1.havedict = 1, N) : U;
                    }, r.inflateInfo = "pako inflate (from Nodeca project)";
                },
                {
                    "../utils/common": 41,
                    "./adler32": 43,
                    "./crc32": 45,
                    "./inffast": 48,
                    "./inftrees": 50
                }
            ],
            50: [
                function(t, e, r) {
                    var D = t("../utils/common"), F = [
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9,
                        10,
                        11,
                        13,
                        15,
                        17,
                        19,
                        23,
                        27,
                        31,
                        35,
                        43,
                        51,
                        59,
                        67,
                        83,
                        99,
                        115,
                        131,
                        163,
                        195,
                        227,
                        258,
                        0,
                        0
                    ], N = [
                        16,
                        16,
                        16,
                        16,
                        16,
                        16,
                        16,
                        16,
                        17,
                        17,
                        17,
                        17,
                        18,
                        18,
                        18,
                        18,
                        19,
                        19,
                        19,
                        19,
                        20,
                        20,
                        20,
                        20,
                        21,
                        21,
                        21,
                        21,
                        16,
                        72,
                        78
                    ], U = [
                        1,
                        2,
                        3,
                        4,
                        5,
                        7,
                        9,
                        13,
                        17,
                        25,
                        33,
                        49,
                        65,
                        97,
                        129,
                        193,
                        257,
                        385,
                        513,
                        769,
                        1025,
                        1537,
                        2049,
                        3073,
                        4097,
                        6145,
                        8193,
                        12289,
                        16385,
                        24577,
                        0,
                        0
                    ], P = [
                        16,
                        16,
                        16,
                        16,
                        17,
                        17,
                        18,
                        18,
                        19,
                        19,
                        20,
                        20,
                        21,
                        21,
                        22,
                        22,
                        23,
                        23,
                        24,
                        24,
                        25,
                        25,
                        26,
                        26,
                        27,
                        27,
                        28,
                        28,
                        29,
                        29,
                        64,
                        64
                    ];
                    e.exports = function(t1, e1, r1, i, n, s1, a, o) {
                        var h, u, l, f, d, c, p, m, _, g = o.bits, b = 0, v = 0, y2 = 0, w = 0, k = 0, x2 = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0;
                        for(b = 0; b <= 15; b++)O[b] = 0;
                        for(v = 0; v < i; v++)O[e1[r1 + v]]++;
                        for(k = g, w = 15; 1 <= w && 0 === O[w]; w--);
                        if (w < k && (k = w), 0 === w) return n[s1++] = 20971520, n[s1++] = 20971520, o.bits = 1, 0;
                        for(y2 = 1; y2 < w && 0 === O[y2]; y2++);
                        for(k < y2 && (k = y2), b = z = 1; b <= 15; b++)if (z <<= 1, (z -= O[b]) < 0) return -1;
                        if (0 < z && (0 === t1 || 1 !== w)) return -1;
                        for(B[1] = 0, b = 1; b < 15; b++)B[b + 1] = B[b] + O[b];
                        for(v = 0; v < i; v++)0 !== e1[r1 + v] && (a[B[e1[r1 + v]]++] = v);
                        if (c = 0 === t1 ? (A = R = a, 19) : 1 === t1 ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y2, d = s1, S = v = E = 0, l = -1, f = (C = 1 << (x2 = k)) - 1, 1 === t1 && 852 < C || 2 === t1 && 592 < C) return 1;
                        for(;;){
                            for(p = b - S, _ = a[v] < c ? (m = 0, a[v]) : a[v] > c ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y2 = u = 1 << x2; n[d + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u;);
                            for(h = 1 << b - 1; E & h;)h >>= 1;
                            if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) {
                                if (b === w) break;
                                b = e1[r1 + a[v]];
                            }
                            if (k < b && (E & f) !== l) {
                                for(0 === S && (S = k), d += y2, z = 1 << (x2 = b - S); x2 + S < w && !((z -= O[x2 + S]) <= 0);)x2++, z <<= 1;
                                if (C += 1 << x2, 1 === t1 && 852 < C || 2 === t1 && 592 < C) return 1;
                                n[l = E & f] = k << 24 | x2 << 16 | d - s1 | 0;
                            }
                        }
                        return 0 !== E && (n[d + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
                    };
                },
                {
                    "../utils/common": 41
                }
            ],
            51: [
                function(t, e, r) {
                    e.exports = {
                        2: "need dictionary",
                        1: "stream end",
                        0: "",
                        "-1": "file error",
                        "-2": "stream error",
                        "-3": "data error",
                        "-4": "insufficient memory",
                        "-5": "buffer error",
                        "-6": "incompatible version"
                    };
                },
                {
                }
            ],
            52: [
                function(t, e, r) {
                    var n = t("../utils/common"), o = 0, h = 1;
                    function i(t1) {
                        for(var e1 = t1.length; 0 <= --e1;)t1[e1] = 0;
                    }
                    var s1 = 0, a = 29, u = 256, l = u + 1 + a, f = 30, d = 19, _ = 2 * l + 1, g = 15, c = 16, p = 7, m = 256, b = 16, v = 17, y2 = 18, w = [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        1,
                        1,
                        1,
                        1,
                        2,
                        2,
                        2,
                        2,
                        3,
                        3,
                        3,
                        3,
                        4,
                        4,
                        4,
                        4,
                        5,
                        5,
                        5,
                        5,
                        0
                    ], k = [
                        0,
                        0,
                        0,
                        0,
                        1,
                        1,
                        2,
                        2,
                        3,
                        3,
                        4,
                        4,
                        5,
                        5,
                        6,
                        6,
                        7,
                        7,
                        8,
                        8,
                        9,
                        9,
                        10,
                        10,
                        11,
                        11,
                        12,
                        12,
                        13,
                        13
                    ], x2 = [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        2,
                        3,
                        7
                    ], S = [
                        16,
                        17,
                        18,
                        0,
                        8,
                        7,
                        9,
                        6,
                        10,
                        5,
                        11,
                        4,
                        12,
                        3,
                        13,
                        2,
                        14,
                        1,
                        15
                    ], z = new Array(2 * (l + 2));
                    i(z);
                    var C = new Array(2 * f);
                    i(C);
                    var E = new Array(512);
                    i(E);
                    var A = new Array(256);
                    i(A);
                    var I = new Array(a);
                    i(I);
                    var O, B, R, T = new Array(f);
                    function D(t1, e1, r1, i2, n1) {
                        this.static_tree = t1, this.extra_bits = e1, this.extra_base = r1, this.elems = i2, this.max_length = n1, this.has_stree = t1 && t1.length;
                    }
                    function F(t1, e1) {
                        this.dyn_tree = t1, this.max_code = 0, this.stat_desc = e1;
                    }
                    function N(t1) {
                        return t1 < 256 ? E[t1] : E[256 + (t1 >>> 7)];
                    }
                    function U(t1, e1) {
                        t1.pending_buf[t1.pending++] = 255 & e1, t1.pending_buf[t1.pending++] = e1 >>> 8 & 255;
                    }
                    function P(t1, e1, r1) {
                        t1.bi_valid > c - r1 ? (t1.bi_buf |= e1 << t1.bi_valid & 65535, U(t1, t1.bi_buf), t1.bi_buf = e1 >> c - t1.bi_valid, t1.bi_valid += r1 - c) : (t1.bi_buf |= e1 << t1.bi_valid & 65535, t1.bi_valid += r1);
                    }
                    function L(t1, e1, r1) {
                        P(t1, r1[2 * e1], r1[2 * e1 + 1]);
                    }
                    function j(t1, e1) {
                        for(var r1 = 0; (r1 |= 1 & t1, t1 >>>= 1, r1 <<= 1, 0 < --e1););
                        return r1 >>> 1;
                    }
                    function Z(t1, e1, r1) {
                        var i2, n1, s2 = new Array(g + 1), a1 = 0;
                        for(i2 = 1; i2 <= g; i2++)s2[i2] = a1 = a1 + r1[i2 - 1] << 1;
                        for(n1 = 0; n1 <= e1; n1++){
                            var o1 = t1[2 * n1 + 1];
                            0 !== o1 && (t1[2 * n1] = j(s2[o1]++, o1));
                        }
                    }
                    function W(t1) {
                        var e1;
                        for(e1 = 0; e1 < l; e1++)t1.dyn_ltree[2 * e1] = 0;
                        for(e1 = 0; e1 < f; e1++)t1.dyn_dtree[2 * e1] = 0;
                        for(e1 = 0; e1 < d; e1++)t1.bl_tree[2 * e1] = 0;
                        t1.dyn_ltree[2 * m] = 1, t1.opt_len = t1.static_len = 0, t1.last_lit = t1.matches = 0;
                    }
                    function M(t1) {
                        8 < t1.bi_valid ? U(t1, t1.bi_buf) : 0 < t1.bi_valid && (t1.pending_buf[t1.pending++] = t1.bi_buf), t1.bi_buf = 0, t1.bi_valid = 0;
                    }
                    function H(t1, e1, r1, i2) {
                        var n1 = 2 * e1, s2 = 2 * r1;
                        return t1[n1] < t1[s2] || t1[n1] === t1[s2] && i2[e1] <= i2[r1];
                    }
                    function G(t1, e1, r1) {
                        for(var i2 = t1.heap[r1], n1 = r1 << 1; n1 <= t1.heap_len && (n1 < t1.heap_len && H(e1, t1.heap[n1 + 1], t1.heap[n1], t1.depth) && n1++, !H(e1, i2, t1.heap[n1], t1.depth));)t1.heap[r1] = t1.heap[n1], r1 = n1, n1 <<= 1;
                        t1.heap[r1] = i2;
                    }
                    function K(t1, e1, r1) {
                        var i2, n1, s2, a1, o1 = 0;
                        if (0 !== t1.last_lit) for(; (i2 = t1.pending_buf[t1.d_buf + 2 * o1] << 8 | t1.pending_buf[t1.d_buf + 2 * o1 + 1], n1 = t1.pending_buf[t1.l_buf + o1], o1++, 0 === i2 ? L(t1, n1, e1) : (L(t1, (s2 = A[n1]) + u + 1, e1), 0 !== (a1 = w[s2]) && P(t1, n1 -= I[s2], a1), L(t1, s2 = N(--i2), r1), 0 !== (a1 = k[s2]) && P(t1, i2 -= T[s2], a1)), o1 < t1.last_lit););
                        L(t1, m, e1);
                    }
                    function Y(t1, e1) {
                        var r1, i2, n1, s2 = e1.dyn_tree, a1 = e1.stat_desc.static_tree, o1 = e1.stat_desc.has_stree, h1 = e1.stat_desc.elems, u1 = -1;
                        for((t1.heap_len = 0, t1.heap_max = _, r1 = 0); r1 < h1; r1++)0 !== s2[2 * r1] ? (t1.heap[++t1.heap_len] = u1 = r1, t1.depth[r1] = 0) : s2[2 * r1 + 1] = 0;
                        for(; t1.heap_len < 2;)s2[2 * (n1 = t1.heap[++t1.heap_len] = u1 < 2 ? ++u1 : 0)] = 1, t1.depth[n1] = 0, t1.opt_len--, o1 && (t1.static_len -= a1[2 * n1 + 1]);
                        for((e1.max_code = u1, r1 = t1.heap_len >> 1); 1 <= r1; r1--)G(t1, s2, r1);
                        for(n1 = h1; (r1 = t1.heap[1], t1.heap[1] = t1.heap[t1.heap_len--], G(t1, s2, 1), i2 = t1.heap[1], t1.heap[--t1.heap_max] = r1, t1.heap[--t1.heap_max] = i2, s2[2 * n1] = s2[2 * r1] + s2[2 * i2], t1.depth[n1] = (t1.depth[r1] >= t1.depth[i2] ? t1.depth[r1] : t1.depth[i2]) + 1, s2[2 * r1 + 1] = s2[2 * i2 + 1] = n1, t1.heap[1] = n1++, G(t1, s2, 1), 2 <= t1.heap_len););
                        t1.heap[--t1.heap_max] = t1.heap[1], (function(t2, e2) {
                            var r2, i6, n2, s3, a2, o2, h2 = e2.dyn_tree, u2 = e2.max_code, l1 = e2.stat_desc.static_tree, f1 = e2.stat_desc.has_stree, d1 = e2.stat_desc.extra_bits, c1 = e2.stat_desc.extra_base, p1 = e2.stat_desc.max_length, m1 = 0;
                            for(s3 = 0; s3 <= g; s3++)t2.bl_count[s3] = 0;
                            for(h2[2 * t2.heap[t2.heap_max] + 1] = 0, r2 = t2.heap_max + 1; r2 < _; r2++)p1 < (s3 = h2[2 * h2[2 * (i6 = t2.heap[r2]) + 1] + 1] + 1) && (s3 = p1, m1++), h2[2 * i6 + 1] = s3, u2 < i6 || (t2.bl_count[s3]++, a2 = 0, c1 <= i6 && (a2 = d1[i6 - c1]), o2 = h2[2 * i6], t2.opt_len += o2 * (s3 + a2), f1 && (t2.static_len += o2 * (l1[2 * i6 + 1] + a2)));
                            if (0 !== m1) {
                                do {
                                    for(s3 = p1 - 1; 0 === t2.bl_count[s3];)s3--;
                                    t2.bl_count[s3]--, t2.bl_count[s3 + 1] += 2, t2.bl_count[p1]--, m1 -= 2;
                                }while (0 < m1)
                                for(s3 = p1; 0 !== s3; s3--)for(i6 = t2.bl_count[s3]; 0 !== i6;)u2 < (n2 = t2.heap[--r2]) || (h2[2 * n2 + 1] !== s3 && (t2.opt_len += (s3 - h2[2 * n2 + 1]) * h2[2 * n2], h2[2 * n2 + 1] = s3), i6--);
                            }
                        })(t1, e1), Z(s2, u1, t1.bl_count);
                    }
                    function X(t1, e1, r1) {
                        var i2, n1, s2 = -1, a1 = e1[1], o1 = 0, h1 = 7, u1 = 4;
                        for((0 === a1 && (h1 = 138, u1 = 3), e1[2 * (r1 + 1) + 1] = 65535, i2 = 0); i2 <= r1; i2++)n1 = a1, a1 = e1[2 * (i2 + 1) + 1], (++o1) < h1 && n1 === a1 || (o1 < u1 ? t1.bl_tree[2 * n1] += o1 : 0 !== n1 ? (n1 !== s2 && t1.bl_tree[2 * n1]++, t1.bl_tree[2 * b]++) : o1 <= 10 ? t1.bl_tree[2 * v]++ : t1.bl_tree[2 * y2]++, s2 = n1, u1 = (o1 = 0) === a1 ? (h1 = 138, 3) : n1 === a1 ? (h1 = 6, 3) : (h1 = 7, 4));
                    }
                    function V(t1, e1, r1) {
                        var i2, n1, s2 = -1, a1 = e1[1], o1 = 0, h1 = 7, u1 = 4;
                        for((0 === a1 && (h1 = 138, u1 = 3), i2 = 0); i2 <= r1; i2++)if ((n1 = a1, a1 = e1[2 * (i2 + 1) + 1], !((++o1) < h1 && n1 === a1))) {
                            if (o1 < u1) for(; (L(t1, n1, t1.bl_tree), 0 != --o1););
                            else 0 !== n1 ? (n1 !== s2 && (L(t1, n1, t1.bl_tree), o1--), L(t1, b, t1.bl_tree), P(t1, o1 - 3, 2)) : o1 <= 10 ? (L(t1, v, t1.bl_tree), P(t1, o1 - 3, 3)) : (L(t1, y2, t1.bl_tree), P(t1, o1 - 11, 7));
                            s2 = n1, u1 = (o1 = 0) === a1 ? (h1 = 138, 3) : n1 === a1 ? (h1 = 6, 3) : (h1 = 7, 4);
                        }
                    }
                    i(T);
                    var q = !1;
                    function J(t1, e1, r1, i2) {
                        P(t1, (s1 << 1) + (i2 ? 1 : 0), 3), (function(t2, e2, r2, i6) {
                            M(t2), i6 && (U(t2, r2), U(t2, ~r2)), n.arraySet(t2.pending_buf, t2.window, e2, r2, t2.pending), t2.pending += r2;
                        })(t1, e1, r1, !0);
                    }
                    r._tr_init = function(t1) {
                        q || ((function() {
                            var t2, e1, r1, i2, n1, s2 = new Array(g + 1);
                            for(i2 = r1 = 0; i2 < a - 1; i2++)for(I[i2] = r1, t2 = 0; t2 < 1 << w[i2]; t2++)A[r1++] = i2;
                            for(A[r1 - 1] = i2, i2 = n1 = 0; i2 < 16; i2++)for(T[i2] = n1, t2 = 0; t2 < 1 << k[i2]; t2++)E[n1++] = i2;
                            for(n1 >>= 7; i2 < f; i2++)for(T[i2] = n1 << 7, t2 = 0; t2 < 1 << k[i2] - 7; t2++)E[256 + n1++] = i2;
                            for(e1 = 0; e1 <= g; e1++)s2[e1] = 0;
                            for(t2 = 0; t2 <= 143;)z[2 * t2 + 1] = 8, t2++, s2[8]++;
                            for(; t2 <= 255;)z[2 * t2 + 1] = 9, t2++, s2[9]++;
                            for(; t2 <= 279;)z[2 * t2 + 1] = 7, t2++, s2[7]++;
                            for(; t2 <= 287;)z[2 * t2 + 1] = 8, t2++, s2[8]++;
                            for(Z(z, l + 1, s2), t2 = 0; t2 < f; t2++)C[2 * t2 + 1] = 5, C[2 * t2] = j(t2, 5);
                            O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x2, 0, d, p);
                        })(), q = !0), t1.l_desc = new F(t1.dyn_ltree, O), t1.d_desc = new F(t1.dyn_dtree, B), t1.bl_desc = new F(t1.bl_tree, R), t1.bi_buf = 0, t1.bi_valid = 0, W(t1);
                    }, r._tr_stored_block = J, r._tr_flush_block = function(t1, e1, r1, i2) {
                        var n1, s2, a1 = 0;
                        0 < t1.level ? (2 === t1.strm.data_type && (t1.strm.data_type = (function(t2) {
                            var e2, r2 = 4093624447;
                            for(e2 = 0; e2 <= 31; e2++, r2 >>>= 1)if (1 & r2 && 0 !== t2.dyn_ltree[2 * e2]) return o;
                            if (0 !== t2.dyn_ltree[18] || 0 !== t2.dyn_ltree[20] || 0 !== t2.dyn_ltree[26]) return h;
                            for(e2 = 32; e2 < u; e2++)if (0 !== t2.dyn_ltree[2 * e2]) return h;
                            return o;
                        })(t1)), Y(t1, t1.l_desc), Y(t1, t1.d_desc), a1 = (function(t2) {
                            var e2;
                            for(X(t2, t2.dyn_ltree, t2.l_desc.max_code), X(t2, t2.dyn_dtree, t2.d_desc.max_code), Y(t2, t2.bl_desc), e2 = d - 1; 3 <= e2 && 0 === t2.bl_tree[2 * S[e2] + 1]; e2--);
                            return t2.opt_len += 3 * (e2 + 1) + 5 + 5 + 4, e2;
                        })(t1), n1 = t1.opt_len + 3 + 7 >>> 3, (s2 = t1.static_len + 3 + 7 >>> 3) <= n1 && (n1 = s2)) : n1 = s2 = r1 + 5, r1 + 4 <= n1 && -1 !== e1 ? J(t1, e1, r1, i2) : 4 === t1.strategy || s2 === n1 ? (P(t1, 2 + (i2 ? 1 : 0), 3), K(t1, z, C)) : (P(t1, 4 + (i2 ? 1 : 0), 3), (function(t2, e2, r2, i6) {
                            var n2;
                            for(P(t2, e2 - 257, 5), P(t2, r2 - 1, 5), P(t2, i6 - 4, 4), n2 = 0; n2 < i6; n2++)P(t2, t2.bl_tree[2 * S[n2] + 1], 3);
                            V(t2, t2.dyn_ltree, e2 - 1), V(t2, t2.dyn_dtree, r2 - 1);
                        })(t1, t1.l_desc.max_code + 1, t1.d_desc.max_code + 1, a1 + 1), K(t1, t1.dyn_ltree, t1.dyn_dtree)), W(t1), i2 && M(t1);
                    }, r._tr_tally = function(t1, e1, r1) {
                        return t1.pending_buf[t1.d_buf + 2 * t1.last_lit] = e1 >>> 8 & 255, t1.pending_buf[t1.d_buf + 2 * t1.last_lit + 1] = 255 & e1, t1.pending_buf[t1.l_buf + t1.last_lit] = 255 & r1, t1.last_lit++, 0 === e1 ? t1.dyn_ltree[2 * r1]++ : (t1.matches++, e1--, t1.dyn_ltree[2 * (A[r1] + u + 1)]++, t1.dyn_dtree[2 * N(e1)]++), t1.last_lit === t1.lit_bufsize - 1;
                    }, r._tr_align = function(t1) {
                        P(t1, 2, 3), L(t1, m, z), (function(t2) {
                            16 === t2.bi_valid ? (U(t2, t2.bi_buf), t2.bi_buf = 0, t2.bi_valid = 0) : 8 <= t2.bi_valid && (t2.pending_buf[t2.pending++] = 255 & t2.bi_buf, t2.bi_buf >>= 8, t2.bi_valid -= 8);
                        })(t1);
                    };
                },
                {
                    "../utils/common": 41
                }
            ],
            53: [
                function(t, e, r) {
                    e.exports = function() {
                        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
                    };
                },
                {
                }
            ],
            54: [
                function(t, e, r) {
                    e.exports = "function" == typeof setImmediate ? setImmediate : function() {
                        var t1 = [].slice.apply(arguments);
                        t1.splice(1, 0, 0), setTimeout.apply(null, t1);
                    };
                },
                {
                }
            ]
        }, {
        }, [
            10
        ])(10);
    });
});
var commonjsGlobal2 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {
};
function createCommonjsModule2(fn, basedir, module) {
    return module = {
        path: basedir,
        exports: {
        },
        require: function(path, base) {
            return commonjsRequire3(path, base === undefined || base === null ? module.path : base);
        }
    }, fn(module, module.exports), module.exports;
}
function commonjsRequire3() {
    throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}
var FileSaver_min = createCommonjsModule2(function(module, exports) {
    (function(a, b) {
        b();
    })(commonjsGlobal2, function() {
        function b(a, b1) {
            return ("undefined" == typeof b1 ? b1 = {
                autoBom: !1
            } : "object" != typeof b1 && (console.warn("Deprecated: Expected third argument to be a object"), b1 = {
                autoBom: !b1
            }), b1.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type) ? new Blob([
                "\uFEFF",
                a
            ], {
                type: a.type
            }) : a);
        }
        function c(b1, c1, d) {
            var e = new XMLHttpRequest;
            e.open("GET", b1), e.responseType = "blob", e.onload = function() {
                a(e.response, c1, d);
            }, e.onerror = function() {
                console.error("could not download file");
            }, e.send();
        }
        function d(a) {
            var b1 = new XMLHttpRequest;
            b1.open("HEAD", a, !1);
            try {
                b1.send();
            } catch (a) {
            }
            return 200 <= b1.status && 299 >= b1.status;
        }
        function e(a) {
            try {
                a.dispatchEvent(new MouseEvent("click"));
            } catch (c) {
                var b1 = document.createEvent("MouseEvents");
                b1.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), a.dispatchEvent(b1);
            }
        }
        var f = "object" == typeof window && window.window === window ? window : "object" == typeof self && self.self === self ? self : "object" == typeof commonjsGlobal2 && commonjsGlobal2.global === commonjsGlobal2 ? commonjsGlobal2 : void 0, a = f.saveAs || ("object" != typeof window || window !== f ? function() {
        } : "download" in HTMLAnchorElement.prototype ? function(b1, g, h) {
            var i = f.URL || f.webkitURL, j = document.createElement("a");
            g = g || b1.name || "download", j.download = g, j.rel = "noopener", "string" == typeof b1 ? (j.href = b1, j.origin === location.origin ? e(j) : d(j.href) ? c(b1, g, h) : e(j, j.target = "_blank")) : (j.href = i.createObjectURL(b1), setTimeout(function() {
                i.revokeObjectURL(j.href);
            }, 40000), setTimeout(function() {
                e(j);
            }, 0));
        } : "msSaveOrOpenBlob" in navigator ? function(f1, g, h) {
            if ((g = g || f1.name || "download", "string" != typeof f1)) navigator.msSaveOrOpenBlob(b(f1, h), g);
            else if (d(f1)) c(f1, g, h);
            else {
                var i = document.createElement("a");
                i.href = f1, i.target = "_blank", setTimeout(function() {
                    e(i);
                });
            }
        } : function(a1, b1, d1, e1) {
            if ((e1 = e1 || open("", "_blank"), e1 && (e1.document.title = e1.document.body.innerText = "downloading..."), "string" == typeof a1)) return c(a1, b1, d1);
            var g = "application/octet-stream" === a1.type, h = /constructor/i.test(f.HTMLElement) || f.safari, i = /CriOS\/[\d]+/.test(navigator.userAgent);
            if ((i || g && h) && "object" == typeof FileReader) {
                var j = new FileReader;
                j.onloadend = function() {
                    var a2 = j.result;
                    a1 = i ? a1 : a1.replace(/^data:[^;]*;/, "data:attachment/file;"), e1 ? e1.location.href = a1 : location = a1, e1 = null;
                }, j.readAsDataURL(a1);
            } else {
                var k = f.URL || f.webkitURL, l = k.createObjectURL(a1);
                e1 ? e1.location = l : location.href = l, e1 = null, setTimeout(function() {
                    k.revokeObjectURL(l);
                }, 40000);
            }
        });
        f.saveAs = a.saveAs = a, module.exports = a;
    });
});
async function renderChat(canvas, settings) {
    const ctx2 = canvas.getContext("2d");
    const properties = settings.properties;
    const data = settings.data;
    ctx2.font = properties.font;
    const messageLayout = new MessageLayout(ctx2, properties.width, properties.linesSpacing);
    const records = settings.data.messages;
    const chat = new Chat(properties.width, properties.height);
    const zip = new jszip_min();
    const ffmpegScript = [
        "ffconcat version 1.0"
    ];
    let messageFrom;
    if (data.emotes) {
        messageFrom = (str)=>Message.fromStringWithEmotes(str, data.emotes, messageLayout, ctx2)
        ;
    } else {
        messageFrom = (str)=>Message.fromString(str, messageLayout, ctx2)
        ;
    }
    records.push(records[records.length - 1]);
    for(let i = 0; i < records.length - 1; i++){
        ctx2.clearRect(0, 0, properties.width, properties.height);
        const str = `${records[i].author} ${records[i].message}`;
        const message = messageFrom(str);
        chat.push(message, properties.messagesSpacing);
        chat.draw(ctx2, 0, 0, properties.style);
        const blob = await new Promise((resolve)=>canvas.toBlob(resolve)
        );
        const filepath = `img/${i}.png`;
        zip.file(filepath, blob);
        ffmpegScript.push(`file ${filepath}`);
        const duration = (records[i + 1].timestamp - records[i].timestamp) / 1000000;
        ffmpegScript.push(`duration ${duration}`);
    }
    records.pop();
    zip.file("script.txt", ffmpegScript.join("\n"));
    zip.generateAsync({
        type: "blob"
    }).then((content3)=>FileSaver_min(content3, "render.zip")
    );
}
function getPropertiesFields() {
    const settings = document.forms.namedItem("settings");
    const properties = settings.properties;
    const elements = properties.elements;
    const result = {
    };
    for(let i = 0; i < elements.length; i++){
        const element = elements[i];
        result[element.name] = element.value;
    }
    return result;
}
function getDataFields() {
    const settings = document.forms.namedItem("settings");
    const data = settings.data;
    const elements = data.elements;
    const result = {
    };
    for(let i = 0; i < elements.length; i++){
        const element = elements[i];
        result[element.name] = element.files[0];
    }
    return result;
}
function getSettingsFields() {
    return {
        properties: getPropertiesFields(),
        data: getDataFields()
    };
}
export async function updatePreview() {
    const fields = getPropertiesFields();
    const properties = convertPropertiesFields(fields);
    const canvas = document.querySelector("#chat");
    canvas.width = properties.width;
    canvas.height = properties.height;
    const ctx2 = canvas.getContext("2d");
    await drawChatSample(ctx2, properties);
}
export async function render() {
    const fields = getSettingsFields();
    const settings = await convertSettingsFields(fields);
    const canvas = document.querySelector("#chat");
    renderChat(canvas, settings);
}
function splitLongText(text, lineWidth, ctx2) {
    const chunks = [];
    const textFrom = (str)=>new TextItem(str, ctx2.measureText(str).width, text.height)
    ;
    const strIter = text.content[Symbol.iterator]();
    let current = textFrom(strIter.next().value);
    for (const c of strIter){
        let next = textFrom(current.content + c);
        if (next.width > lineWidth) {
            chunks.push(current);
            next = textFrom(c);
        }
        current = next;
    }
    chunks.push(current);
    return chunks;
}
function parseString(str, lineWidth, fontHeight, ctx2) {
    const items = [];
    const words = str.match(/\S+/g);
    if (!words) return items;
    for (const word of words){
        const item = new TextItem(word, ctx2.measureText(word).width, fontHeight);
        if (item.width <= lineWidth) items.push(item);
        else items.push(...splitLongText(item, lineWidth, ctx2));
    }
    return items;
}
function parseStringWithEmotes(str, emotes, lineWidth, fontHeight, ctx2) {
    const items = [];
    const emotesMatches = str.matchAll(emotes.regexp);
    let strIdx = 0;
    for (const emoteMatch of emotesMatches){
        const strChunk = str.slice(strIdx, emoteMatch.index);
        const textItems = parseString(strChunk, lineWidth, fontHeight, ctx2);
        if (textItems) items.push(...textItems);
        const emoteName = emoteMatch[0];
        const emoteImage = emotes.map.get(emoteName);
        items.push(new ImageItem(emoteImage));
        strIdx += strChunk.length + emoteName.length;
    }
    const lastChunk = str.slice(strIdx, str.length);
    const textItems = parseString(lastChunk, lineWidth, fontHeight, ctx2);
    if (textItems) items.push(...textItems);
    return items;
}
function setLayout(items, layout) {
    let lineY = 0;
    let lineWidth = 0;
    const lineHeight = layout.fontHeight;
    for (const item of items){
        if (lineWidth + item.width > layout.width) {
            lineWidth = 0;
            lineY += lineHeight + layout.linesSpacing;
        }
        item.x = lineWidth;
        item.y = lineY;
        if (layout.itemsVerticalAlign === "center") {
            item.y += lineHeight / 2 - item.height / 2;
        } else if (layout.itemsVerticalAlign === "bottom") {
            item.y += lineHeight - item.height;
        }
        lineWidth += item.width + layout.itemsSpacing;
    }
    return new Message(items, layout.width, lineY + lineHeight);
}
