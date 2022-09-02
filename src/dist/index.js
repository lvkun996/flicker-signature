"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var index_1 = require("./utils/index");
var FlickerSignature = /** @class */ (function () {
    function FlickerSignature(_a) {
        var _this = this;
        var el = _a.el, options = _a.options;
        this.options = {
            lineWidth: 3,
            lineColor: '#000',
            backgroundImg: 'board'
        };
        this.points = [];
        /** 绘图记录 */
        this.drawRecords = [];
        /**
         *
         * @description 当前步数指针
         * @description 用来记录是当前 回退或者前进 到哪一步了
         * @description 初始值是0
         *
         */
        this.trackIndex = 0;
        /** 是否正在绘制中 */
        this.isMoveing = false;
        if (!el) {
            throw new Error("canvas node cannot be empty");
        }
        if (!options) {
            console.warn("options not configured");
        }
        this.el = el;
        console.log("options:", options);
        this.options = Object.assign({}, this.options, options);
        this.initCanvas().then(function (_) { return _this.ctx = _; });
        return this;
    }
    FlickerSignature.prototype.initCanvas = function () {
        return __awaiter(this, void 0, Promise, function () {
            var ctx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.bindHandler(this.el, 'start', this.touchstart.bind(this));
                        this.bindHandler(this.el, 'move', this.touchmove.bind(this));
                        this.bindHandler(this.el, 'end', this.touchend.bind(this));
                        ctx = this.el.getContext('2d');
                        console.log("this.el:", this.el);
                        return [4 /*yield*/, this.setBackgroundImg(ctx)];
                    case 1:
                        _a.sent();
                        console.log();
                        ctx.lineWidth = this.options.lineWidth;
                        ctx.strokeStyle = this.options.lineColor;
                        ctx.lineJoin = 'round';
                        ctx.imageSmoothingEnabled = false;
                        this.drawRecords.push(ctx.getImageData(0, 0, this.el.clientWidth, this.el.clientHeight));
                        return [2 /*return*/, ctx];
                }
            });
        });
    };
    /**
     *
     * @description 绑定事件
     * @param ev
     *
     */
    FlickerSignature.prototype.bindHandler = function (node, eventKey, cb) {
        node.addEventListener(index_1.getHandlerKey()[eventKey], cb, false);
    };
    FlickerSignature.prototype.touchstart = function (ev) {
        var pos = this.getPos(ev);
        // 新建路径 
        this.ctx.beginPath();
        this.points.push({
            x: pos.x,
            y: pos.y
        });
        if (index_1.getPlatform() === 'Desktop') {
            this.isMoveing = true;
        }
    };
    FlickerSignature.prototype.touchmove = function (ev) {
        if (index_1.getPlatform() === 'Desktop' && !this.isMoveing)
            return;
        var pos = this.getPos(ev);
        if (this.points.length === 3) {
            var _a = this.points, startPos = _a[0], middlePos = _a[1], endPos = _a[2];
            this.ctx.beginPath();
            this.ctx.moveTo(startPos.x, startPos.y);
            var s = {
                x: (middlePos.x + endPos.x) / 2,
                y: (middlePos.y + endPos.y) / 2
            };
            this.ctx.quadraticCurveTo(middlePos.x, middlePos.y, s.x, s.y);
            this.points = [s];
            this.ctx.stroke();
            this.ctx.closePath();
        }
        else {
            this.points.push({
                x: Math.floor(pos.x),
                y: Math.floor(pos.y)
            });
        }
    };
    FlickerSignature.prototype.touchend = function (ev) {
        this.points = [];
        // 此时是回撤了绘制之后，再次绘制，需要在 drawRecords 中删除掉 被回撤的imageData
        if (this.drawRecords.length - this.trackIndex > 1) {
            this.drawRecords = this.drawRecords.splice(0, this.trackIndex + 1);
        }
        this.drawRecords.push(this.ctx.getImageData(0, 0, this.el.clientWidth, this.el.clientHeight));
        this.trackIndex = this.drawRecords.length - 1;
        if (index_1.getPlatform() === 'Desktop') {
            this.isMoveing = false;
        }
    };
    /** 撤销绘画 */
    FlickerSignature.prototype.cancelStrokes = function (count) {
        if (count === void 0) { count = 1; }
        if (this.drawRecords.length && this.trackIndex >= 1) {
            var diffCount = this.trackIndex - Number(count);
            this.trackIndex = diffCount >= 0 ? diffCount : 0;
            var imgData = this.drawRecords[this.trackIndex];
            this.ctx.putImageData(imgData, 0, 0);
        }
    };
    /**恢复绘画 */
    FlickerSignature.prototype.recoverStrokes = function (count) {
        if (count === void 0) { count = 1; }
        if (this.drawRecords.length - this.trackIndex > 1) {
            this.trackIndex += Number(count);
            var imgData = this.drawRecords[this.trackIndex];
            this.ctx.putImageData(imgData, 0, 0);
        }
    };
    FlickerSignature.prototype.clearCanvas = function () {
        this.drawRecords = this.drawRecords.splice(0, 1);
        this.ctx.putImageData(this.drawRecords[0], 0, 0);
        this.trackIndex = 0;
    };
    /**设置背景图片 */
    FlickerSignature.prototype.setBackgroundImg = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var img_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(this.options);
                        if (!(this.options.backgroundImg === 'grid')) return [3 /*break*/, 1];
                        this.drawGrid(ctx, 10, 10, 'lightgray', 0.5);
                        return [3 /*break*/, 4];
                    case 1:
                        if (!(this.options.backgroundImg === 'white')) return [3 /*break*/, 2];
                        return [3 /*break*/, 4];
                    case 2:
                        img_1 = new Image(this.el.clientWidth, this.el.clientHeight);
                        img_1.src = this.options.backgroundImg;
                        img_1.style.objectFit = 'cover';
                        return [4 /*yield*/, new Promise(function (resolve) {
                                img_1.onload = function () {
                                    ctx.drawImage(img_1, 0, 0, img_1.width, img_1.height);
                                    resolve(true);
                                };
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FlickerSignature.prototype.toBase64 = function (type, quality) {
        return this.el.toDataURL(type, quality);
    };
    FlickerSignature.prototype.toBlob = function (type, quality) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.el.toBlob(function (blob) {
                resolve(blob);
            }, type, quality);
        });
    };
    FlickerSignature.prototype.drawGrid = function (ctx, stepX, stepY, color, lineWidth) {
        ctx.beginPath();
        // 创建垂直格网线路径
        for (var i = 0.5 + stepX; i < this.el.clientWidth; i += stepX) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.el.clientHeight);
        }
        // 创建水平格网线路径
        for (var j = 0.5 + stepY; j < this.el.clientHeight; j += stepY) {
            ctx.moveTo(0, j);
            ctx.lineTo(this.el.clientWidth, j);
        }
        // 设置绘制颜色
        ctx.strokeStyle = color;
        // 设置绘制线段的宽度
        ctx.lineWidth = lineWidth;
        // 绘制格网
        ctx.stroke();
        // 清除路径
        ctx.closePath();
    };
    FlickerSignature.prototype.getPos = function (ev) {
        var pos = Object.create(null);
        if (index_1.getPlatform() === 'Mobile') {
            var _ev = ev;
            var _a = _ev.targetTouches[0], clientX = _a.clientX, clientY = _a.clientY;
            pos.x = Math.floor(clientX);
            pos.y = Math.floor(clientY);
        }
        else {
            var _ev = ev;
            var x = _ev.x, y = _ev.y;
            pos.x = Math.floor(x);
            pos.y = Math.floor(y);
        }
        return pos;
    };
    return FlickerSignature;
}());
exports["default"] = FlickerSignature;
