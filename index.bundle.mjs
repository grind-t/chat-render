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
class CanvasFont {
    constructor(ctx1){
        this.ctx = ctx1;
    }
    get height() {
        if (this.font !== this.ctx.font) {
            this.font = this.ctx.font;
            this.chachedHeight = this.ctx.measureText("W").actualBoundingBoxAscent;
        }
        return this.chachedHeight;
    }
    measureText(text) {
        return this.ctx.measureText(text);
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
    constructor(width3, lineHeight, itemsSpacing, itemsVerticalAlign = "center"){
        this.width = width3;
        this.lineHeight = lineHeight;
        this.itemsSpacing = itemsSpacing;
        this.itemsVerticalAlign = itemsVerticalAlign;
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
    static fromText(text, font, layout, emotes) {
        const content3 = emotes ? parseTextWithEmotes(text, font, layout.width, emotes) : parseText(text, font, layout.width);
        return setLayout(content3, layout);
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
function chatPropertiesFromFields(properties) {
    return {
        width: parseFloat(properties.width),
        height: parseFloat(properties.height),
        lineHeight: parseFloat(properties.lineHeight),
        messagesSpacing: parseFloat(properties.messagesSpacing),
        font: properties.font,
        style: new ChatStyle(properties.backgroundFillStyle, new MessageStyle(properties.authorFillStyle, properties.messageFillStyle))
    };
}
async function chatSettingsFromFields(settings) {
    const properties = chatPropertiesFromFields(settings.properties);
    const messages = await getRecords(settings.data.messages);
    const emotes = settings.data.emotes ? await downloadEmotes(settings.data.emotes, properties.lineHeight) : undefined;
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
function sampleMessage(font, layout, sampleEmote) {
    const sampleEmoteName = ":roflanChelik:";
    const emotesMap = new Map([
        [
            sampleEmoteName,
            sampleEmote
        ]
    ]);
    const emotes = new Emotes(emotesMap);
    const text = `\n    Author Lorem ipsum ${sampleEmoteName} dolor sit amet, consectetur adipiscing elit, \n    sed do eiusmod tempor incididunt ut labore et dolore magna ${sampleEmoteName} aliqua. \n    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex \n    ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse \n    cillum dolore eu fugiat nulla pariatur. Excepteur sint ${sampleEmoteName} occaecat \n    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n  `;
    return Message.fromText(text, font, layout, emotes);
}
async function drawChatSample(ctx2, properties) {
    ctx2.font = properties.font;
    const font = new CanvasFont(ctx2);
    const messageLayout = new MessageLayout(properties.width, properties.lineHeight, font.measureText(" ").width);
    const sampleEmote = new Image(properties.lineHeight, properties.lineHeight);
    const emoteLoading = new Promise((resolve)=>sampleEmote.onload = resolve
    );
    sampleEmote.crossOrigin = "anonymous";
    sampleEmote.src = "https://yt3.ggpht.com/DC086aBQNoxY0qcpdIKVTR7w9F0HxRe-OBREc74rr6PHogHaYUha9vDmkL3Pb8SrI108XNUz=w48-h48-c-k-nd";
    const chat = new Chat(properties.width, properties.height);
    let lastMessage = sampleMessage(font, messageLayout, sampleEmote);
    chat.push(lastMessage, properties.messagesSpacing);
    while(nextMessageFits(lastMessage, properties.messagesSpacing, properties.height)){
        lastMessage = new Message(lastMessage.content, lastMessage.width, lastMessage.height);
        chat.push(lastMessage, properties.messagesSpacing);
    }
    await emoteLoading;
    chat.draw(ctx2, 0, 0, properties.style);
}
var commonjsGlobal1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {
};
function createCommonjsModule1(fn, basedir, module) {
    return module = {
        path: basedir,
        exports: {
        },
        require: function(path, base) {
            return commonjsRequire2(path, base === void 0 || base === null ? module.path : base);
        }
    }, fn(module, module.exports), module.exports;
}
function commonjsRequire2() {
    throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}
var resolveUrl = createCommonjsModule1(function(module, exports) {
    void (function(root, factory) {
        {
            module.exports = factory();
        }
    })(commonjsGlobal1, function() {
        function resolveUrl2() {
            var numUrls = arguments.length;
            if (numUrls === 0) {
                throw new Error("resolveUrl requires at least one argument; got none.");
            }
            var base = document.createElement("base");
            base.href = arguments[0];
            if (numUrls === 1) {
                return base.href;
            }
            var head = document.getElementsByTagName("head")[0];
            head.insertBefore(base, head.firstChild);
            var a = document.createElement("a");
            var resolved;
            for(var index = 1; index < numUrls; index++){
                a.href = arguments[index];
                resolved = a.href;
                base.href = resolved;
            }
            head.removeChild(base);
            return resolved;
        }
        return resolveUrl2;
    });
});
var config = {
    defaultArgs: [
        "./ffmpeg",
        "-nostdin",
        "-y"
    ],
    baseOptions: {
        log: false,
        logger: ()=>{
        },
        progress: ()=>{
        },
        corePath: ""
    }
};
let logging = false;
let customLogger = ()=>{
};
const setLogging = (_logging)=>{
    logging = _logging;
};
const setCustomLogger = (logger)=>{
    customLogger = logger;
};
const log = (type, message)=>{
    customLogger({
        type,
        message
    });
    if (logging) {
        console.log(`[${type}] ${message}`);
    }
};
var log_1 = {
    logging,
    setLogging,
    setCustomLogger,
    log
};
let duration = 0;
const ts2sec = (ts)=>{
    const [h, m, s] = ts.split(":");
    return parseFloat(h) * 60 * 60 + parseFloat(m) * 60 + parseFloat(s);
};
var parseProgress = (message, progress)=>{
    if (typeof message === "string") {
        if (message.startsWith("  Duration")) {
            const ts = message.split(", ")[0].split(": ")[1];
            const d = ts2sec(ts);
            if (duration === 0 || duration > d) {
                duration = d;
            }
        } else if (message.startsWith("frame")) {
            const ts = message.split("time=")[1].split(" ")[0];
            const t = ts2sec(ts);
            progress({
                ratio: t / duration
            });
        } else if (message.startsWith("video:")) {
            progress({
                ratio: 1
            });
            duration = 0;
        }
    }
};
var parseArgs = (Core, args)=>{
    const argsPtr = Core._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);
    args.forEach((s, idx)=>{
        const buf = Core._malloc(s.length + 1);
        Core.writeAsciiToMemory(s, buf);
        Core.setValue(argsPtr + Uint32Array.BYTES_PER_ELEMENT * idx, buf, "i32");
    });
    return [
        args.length,
        argsPtr
    ];
};
function defaultSetTimout() {
    throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
    throw new Error("clearTimeout has not been defined");
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
var globalContext;
if (typeof window !== "undefined") {
    globalContext = window;
} else if (typeof self !== "undefined") {
    globalContext = self;
} else {
    globalContext = {
    };
}
if (typeof globalContext.setTimeout === "function") {
    cachedSetTimeout = setTimeout;
}
if (typeof globalContext.clearTimeout === "function") {
    cachedClearTimeout = clearTimeout;
}
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
    }
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e2) {
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
    }
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            return cachedClearTimeout.call(null, marker);
        } catch (e2) {
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}
function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while(len){
        currentQueue = queue;
        queue = [];
        while((++queueIndex) < len){
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for(var i = 1; i < arguments.length; i++){
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
var title = "browser";
var platform = "browser";
var browser = true;
var argv = [];
var version = "";
var versions = {
};
var release = {
};
var config$1 = {
};
function noop() {
}
var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;
function binding(name2) {
    throw new Error("process.binding is not supported");
}
function cwd() {
    return "/";
}
function chdir(dir) {
    throw new Error("process.chdir is not supported");
}
function umask() {
    return 0;
}
var performance = globalContext.performance || {
};
var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
    return new Date().getTime();
};
function hrtime(previousTimestamp) {
    var clocktime = performanceNow.call(performance) * 0.001;
    var seconds = Math.floor(clocktime);
    var nanoseconds = Math.floor(clocktime % 1 * 1000000000);
    if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0];
        nanoseconds = nanoseconds - previousTimestamp[1];
        if (nanoseconds < 0) {
            seconds--;
            nanoseconds += 1000000000;
        }
    }
    return [
        seconds,
        nanoseconds
    ];
}
var startTime = new Date();
function uptime() {
    var currentTime = new Date();
    var dif = currentTime - startTime;
    return dif / 1000;
}
var process = {
    nextTick,
    title,
    browser,
    env: {
        NODE_ENV: "production"
    },
    argv,
    version,
    versions,
    on,
    addListener,
    once,
    off,
    removeListener,
    removeAllListeners,
    emit,
    binding,
    cwd,
    chdir,
    umask,
    hrtime,
    platform,
    release,
    config: config$1,
    uptime
};
const name1 = "@ffmpeg/ffmpeg";
const version$1 = "0.9.6";
const description = "FFmpeg WebAssembly version";
const main = "src/index.js";
const types = "src/index.d.ts";
const directories = {
    example: "examples"
};
const scripts = {
    start: "node scripts/server.js",
    build: "rimraf dist && webpack --config scripts/webpack.config.prod.js",
    prepublishOnly: "npm run build",
    lint: "eslint src",
    wait: "rimraf dist && wait-on http://localhost:3000/dist/ffmpeg.dev.js",
    test: "npm-run-all -p -r start test:all",
    "test:all": "npm-run-all wait test:browser:ffmpeg test:node:all",
    "test:node": "node --experimental-wasm-threads --experimental-wasm-bulk-memory node_modules/.bin/_mocha --exit --bail --require ./scripts/test-helper.js",
    "test:node:all": "npm run test:node -- ./tests/*.test.js",
    "test:browser": "mocha-headless-chrome -a allow-file-access-from-files -a incognito -a no-sandbox -a disable-setuid-sandbox -a disable-logging -t 300000",
    "test:browser:ffmpeg": "npm run test:browser -- -f ./tests/ffmpeg.test.html"
};
const browser$1 = {
    "./src/node/index.js": "./src/browser/index.js"
};
const repository = {
    type: "git",
    url: "git+https://github.com/ffmpegwasm/ffmpeg.wasm.git"
};
const keywords = [
    "ffmpeg",
    "WebAssembly",
    "video"
];
const author = "Jerome Wu <jeromewus@gmail.com>";
const license = "MIT";
const bugs = {
    url: "https://github.com/ffmpegwasm/ffmpeg.wasm/issues"
};
const engines = {
    node: ">=12.16.1"
};
const homepage = "https://github.com/ffmpegwasm/ffmpeg.wasm#readme";
const dependencies = {
    "is-url": "^1.2.4",
    "node-fetch": "^2.6.1",
    "regenerator-runtime": "^0.13.7",
    "resolve-url": "^0.2.1"
};
const devDependencies = {
    "@babel/core": "^7.12.3",
    "@babel/preset-env": "^7.12.1",
    "@ffmpeg/core": "^0.8.5",
    "@types/emscripten": "^1.39.4",
    "babel-loader": "^8.1.0",
    chai: "^4.2.0",
    cors: "^2.8.5",
    eslint: "^7.12.1",
    "eslint-config-airbnb-base": "^14.1.0",
    "eslint-plugin-import": "^2.22.1",
    express: "^4.17.1",
    mocha: "^8.2.1",
    "mocha-headless-chrome": "^2.0.3",
    "npm-run-all": "^4.1.5",
    "wait-on": "^5.2.0",
    webpack: "^5.3.2",
    "webpack-cli": "^4.1.0",
    "webpack-dev-middleware": "^4.0.0"
};
var require$$3 = {
    name: name1,
    version: version$1,
    description,
    main,
    types,
    directories,
    scripts,
    browser: browser$1,
    repository,
    keywords,
    author,
    license,
    bugs,
    engines,
    homepage,
    dependencies,
    devDependencies
};
const { devDependencies: devDependencies$1  } = require$$3;
var defaultOptions = {
    corePath: typeof process !== "undefined" && process.env.FFMPEG_ENV === "development" ? resolveUrl("/node_modules/@ffmpeg/core/dist/ffmpeg-core.js") : `https://unpkg.com/@ffmpeg/core@${devDependencies$1["@ffmpeg/core"].substring(1)}/dist/ffmpeg-core.js`
};
const { log: log$1  } = log_1;
const toBlobURL = async (url, mimeType)=>{
    log$1("info", `fetch ${url}`);
    const buf = await (await fetch(url)).arrayBuffer();
    log$1("info", `${url} file size = ${buf.byteLength} bytes`);
    const blob = new Blob([
        buf
    ], {
        type: mimeType
    });
    const blobURL = URL.createObjectURL(blob);
    log$1("info", `${url} blob URL = ${blobURL}`);
    return blobURL;
};
var getCreateFFmpegCore = async ({ corePath: _corePath  })=>{
    if (typeof _corePath !== "string") {
        throw Error("corePath should be a string!");
    }
    const coreRemotePath = resolveUrl(_corePath);
    const corePath = await toBlobURL(coreRemotePath, "application/javascript");
    const wasmPath = await toBlobURL(coreRemotePath.replace("ffmpeg-core.js", "ffmpeg-core.wasm"), "application/wasm");
    const workerPath = await toBlobURL(coreRemotePath.replace("ffmpeg-core.js", "ffmpeg-core.worker.js"), "application/javascript");
    if (typeof createFFmpegCore === "undefined") {
        return new Promise((resolve)=>{
            const script = document.createElement("script");
            const eventHandler = ()=>{
                script.removeEventListener("load", eventHandler);
                log$1("info", "ffmpeg-core.js script loaded");
                resolve({
                    createFFmpegCore,
                    corePath,
                    wasmPath,
                    workerPath
                });
            };
            script.src = corePath;
            script.type = "text/javascript";
            script.addEventListener("load", eventHandler);
            document.getElementsByTagName("head")[0].appendChild(script);
        });
    }
    log$1("info", "ffmpeg-core.js script is loaded already");
    return Promise.resolve({
        createFFmpegCore,
        corePath,
        wasmPath,
        workerPath
    });
};
const readFromBlobOrFile = (blob)=>new Promise((resolve, reject)=>{
        const fileReader = new FileReader();
        fileReader.onload = ()=>{
            resolve(fileReader.result);
        };
        fileReader.onerror = ({ target: { error: { code  }  }  })=>{
            reject(Error(`File could not be read! Code=${code}`));
        };
        fileReader.readAsArrayBuffer(blob);
    })
;
var fetchFile = async (_data)=>{
    let data = _data;
    if (typeof _data === "undefined") {
        return new Uint8Array();
    }
    if (typeof _data === "string") {
        if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(_data)) {
            data = atob(_data.split(",")[1]).split("").map((c)=>c.charCodeAt(0)
            );
        } else {
            const res = await fetch(resolveUrl(_data));
            data = await res.arrayBuffer();
        }
    } else if (_data instanceof File || _data instanceof Blob) {
        data = await readFromBlobOrFile(_data);
    }
    return new Uint8Array(data);
};
var browser$2 = {
    defaultOptions,
    getCreateFFmpegCore,
    fetchFile
};
const { defaultArgs , baseOptions  } = config;
const { setLogging: setLogging$1 , setCustomLogger: setCustomLogger$1 , log: log$2  } = log_1;
const { defaultOptions: defaultOptions$1 , getCreateFFmpegCore: getCreateFFmpegCore$1  } = browser$2;
const { version: version$2  } = require$$3;
var createFFmpeg = (_options = {
})=>{
    const { log: logging2 , logger , progress: optProgress , ...options } = {
        ...baseOptions,
        ...defaultOptions$1,
        ..._options
    };
    let Core = null;
    let ffmpeg = null;
    let runResolve = null;
    let running = false;
    let progress = optProgress;
    const detectCompletion = (message)=>{
        if (message === "FFMPEG_END" && runResolve !== null) {
            runResolve();
            runResolve = null;
            running = false;
        }
    };
    const parseMessage = ({ type , message  })=>{
        log$2(type, message);
        parseProgress(message, progress);
        detectCompletion(message);
    };
    const load = async ()=>{
        log$2("info", "load ffmpeg-core");
        if (Core === null) {
            log$2("info", "loading ffmpeg-core");
            const { createFFmpegCore: createFFmpegCore2 , corePath , workerPath , wasmPath  } = await getCreateFFmpegCore$1(options);
            Core = await createFFmpegCore2({
                mainScriptUrlOrBlob: corePath,
                printErr: (message)=>parseMessage({
                        type: "fferr",
                        message
                    })
                ,
                print: (message)=>parseMessage({
                        type: "ffout",
                        message
                    })
                ,
                locateFile: (path, prefix)=>{
                    if (typeof window !== "undefined") {
                        if (typeof wasmPath !== "undefined" && path.endsWith("ffmpeg-core.wasm")) {
                            return wasmPath;
                        }
                        if (typeof workerPath !== "undefined" && path.endsWith("ffmpeg-core.worker.js")) {
                            return workerPath;
                        }
                    }
                    return prefix + path;
                }
            });
            ffmpeg = Core.cwrap("proxy_main", "number", [
                "number",
                "number"
            ]);
            log$2("info", "ffmpeg-core loaded");
        } else {
            throw Error("ffmpeg.wasm was loaded, you should not load it again, use ffmpeg.isLoaded() to check next time.");
        }
    };
    const isLoaded = ()=>Core !== null
    ;
    const run = (..._args)=>{
        log$2("info", `run ffmpeg command: ${_args.join(" ")}`);
        if (Core === null) {
            throw NO_LOAD;
        } else if (running) {
            throw Error("ffmpeg.wasm can only run one command at a time");
        } else {
            running = true;
            return new Promise((resolve)=>{
                const args = [
                    ...defaultArgs,
                    ..._args
                ].filter((s)=>s.length !== 0
                );
                runResolve = resolve;
                ffmpeg(...parseArgs(Core, args));
            });
        }
    };
    const FS = (method, ...args)=>{
        log$2("info", `run FS.${method} ${args.map((arg)=>typeof arg === "string" ? arg : `<${arg.length} bytes binary file>`
        ).join(" ")}`);
        if (Core === null) {
            throw NO_LOAD;
        } else {
            let ret = null;
            try {
                ret = Core.FS[method](...args);
            } catch (e) {
                if (method === "readdir") {
                    throw Error(`ffmpeg.FS('readdir', '${args[0]}') error. Check if the path exists, ex: ffmpeg.FS('readdir', '/')`);
                } else if (method === "readFile") {
                    throw Error(`ffmpeg.FS('readFile', '${args[0]}') error. Check if the path exists`);
                } else {
                    throw Error("Oops, something went wrong in FS operation.");
                }
            }
            return ret;
        }
    };
    const setProgress = (_progress)=>{
        progress = _progress;
    };
    const setLogger = (_logger)=>{
        setCustomLogger$1(_logger);
    };
    setLogging$1(logging2);
    setCustomLogger$1(logger);
    log$2("info", `use ffmpeg.wasm v${version$2}`);
    return {
        setProgress,
        setLogger,
        setLogging: setLogging$1,
        load,
        isLoaded,
        run,
        FS
    };
};
const { fetchFile: fetchFile$1  } = browser$2;
var src = {
    createFFmpeg,
    fetchFile: fetchFile$1
};
function save(content3, fileName, mimeType) {
    const a = document.createElement("a");
    const file = new Blob([
        content3
    ], {
        type: mimeType
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
}
async function renderChat(canvas, settings, mimeType) {
    const ctx2 = canvas.getContext("2d");
    const properties = settings.properties;
    const data = settings.data;
    ctx2.font = properties.font;
    const font = new CanvasFont(ctx2);
    const messageLayout = new MessageLayout(properties.width, properties.lineHeight, font.measureText(" ").width);
    const records = settings.data.messages;
    const chat = new Chat(properties.width, properties.height);
    const { createFFmpeg: createFFmpeg1 , fetchFile: fetchFile1  } = src;
    const ffmpeg = createFFmpeg1();
    await ffmpeg.load();
    const ffmpegScript = [
        "ffconcat version 1.0"
    ];
    records.push(records[records.length - 1]);
    for(let i = 0; i < records.length - 1; i++){
        const text = `${records[i].author} ${records[i].message}`;
        const message = Message.fromText(text, font, messageLayout, data.emotes);
        chat.push(message, properties.messagesSpacing);
        chat.draw(ctx2, 0, 0, properties.style);
        const blob = await new Promise((resolve)=>canvas.toBlob(resolve)
        );
        const fileName = `${i}.png`;
        ffmpeg.FS("writeFile", fileName, await fetchFile1(blob));
        ffmpegScript.push(`file ${fileName}`);
        const duration1 = (records[i + 1].timestamp - records[i].timestamp) / 1000000;
        ffmpegScript.push(`duration ${duration1}`);
    }
    records.pop();
    ffmpeg.FS("writeFile", "script.txt", ffmpegScript.join("\n"));
    const [type, subtype] = mimeType.split("/");
    const fileName = `out.${subtype}`;
    await ffmpeg.run("-f", "concat", "-i", "script.txt", "-vsync", "vfr", "-pix_fmt", "yuv420p", fileName);
    const result = ffmpeg.FS("readFile", fileName);
    save(result, fileName, mimeType);
}
function splitLongWord(word, font, lineWidth) {
    const items = [];
    const wordIter = word[Symbol.iterator]();
    let currentChunk = wordIter.next().value;
    let currentWidth = font.measureText(currentChunk).width;
    for (const __char of wordIter){
        const nextChunk = currentChunk + __char;
        const nextWidth = font.measureText(nextChunk).width;
        if (nextWidth > lineWidth) {
            items.push(new TextItem(currentChunk, currentWidth, font.height));
            currentChunk = __char;
            currentWidth = font.measureText(currentChunk).width;
        } else {
            currentChunk = nextChunk;
            currentWidth = nextWidth;
        }
    }
    items.push(new TextItem(currentChunk, currentWidth, font.height));
    return items;
}
function parseText(text, font, lineWidth) {
    const items = [];
    const words = text.match(/\S+/g);
    if (!words) return items;
    for (const word of words){
        const item = new TextItem(word, font.measureText(word).width, font.height);
        if (item.width <= lineWidth) items.push(item);
        else items.push(...splitLongWord(item.content, font, lineWidth));
    }
    return items;
}
function parseTextWithEmotes(text, font, lineWidth, emotes) {
    const items = [];
    const emotesMatches = text.matchAll(emotes.regexp);
    let textIdx = 0;
    for (const emoteMatch of emotesMatches){
        const textChunk = text.slice(textIdx, emoteMatch.index);
        const textItems = parseText(textChunk, font, lineWidth);
        if (textItems) items.push(...textItems);
        const emoteName = emoteMatch[0];
        const emoteImage = emotes.map.get(emoteName);
        items.push(new ImageItem(emoteImage));
        textIdx += textChunk.length + emoteName.length;
    }
    const lastChunk = text.slice(textIdx, text.length);
    const textItems = parseText(lastChunk, font, lineWidth);
    if (textItems) items.push(...textItems);
    return items;
}
function setLayout(items, layout) {
    let lineY = 0;
    let lineWidth = 0;
    for (const item of items){
        if (lineWidth + item.width > layout.width) {
            lineWidth = 0;
            lineY += layout.lineHeight;
        }
        item.x = lineWidth;
        item.y = lineY;
        if (layout.itemsVerticalAlign === "center") {
            item.y += layout.lineHeight / 2 - item.height / 2;
        } else if (layout.itemsVerticalAlign === "bottom") {
            item.y += layout.lineHeight - item.height;
        }
        lineWidth += item.width + layout.itemsSpacing;
    }
    return new Message(items, layout.width, lineY + layout.lineHeight);
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
function disableForm() {
    const settings = document.forms.namedItem("settings");
    const elements = settings.elements;
    for(let i = 0; i < elements.length; i++){
        elements[i].setAttribute("disabled", "");
    }
}
function enableForm() {
    const settings = document.forms.namedItem("settings");
    const elements = settings.elements;
    for(let i = 0; i < elements.length; i++){
        elements[i].removeAttribute("disabled");
    }
}
export async function updatePreview() {
    const fields = getPropertiesFields();
    const properties = chatPropertiesFromFields(fields);
    const canvas = document.querySelector("#chat");
    canvas.width = properties.width;
    canvas.height = properties.height;
    const ctx2 = canvas.getContext("2d");
    await drawChatSample(ctx2, properties);
}
export async function render() {
    const fields = getSettingsFields();
    const settings = await chatSettingsFromFields(fields);
    const canvas = document.querySelector("#chat");
    const submit = document.querySelector("#submit");
    const mimeTypes = document.querySelector("#mimeTypes");
    disableForm();
    submit.value = "rendering...";
    await renderChat(canvas, settings, mimeTypes.value);
    submit.value = "render";
    enableForm();
}
