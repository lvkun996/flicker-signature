var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class FlickerSignature {
    constructor(el, options) {
        this.options = {
            lineWidth: 3,
            lineColor: '#000',
            backgroundImg: 'board'
        };
        // protected BCR: DOMRect
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
        /**
         *
         * @description 指针 步数
         *
         */
        this.trackStep = 1;
        if (!el) {
            throw new Error("canvas node cannot be empty");
        }
        this.el = el;
        this.options = Object.assign({}, this.options, options);
        this.initCanvas().then(_ => this.ctx = _);
        return this;
    }
    initCanvas() {
        return __awaiter(this, void 0, void 0, function* () {
            this.el.addEventListener('touchstart', this.touchstart.bind(this));
            //  this.el.addEventListener('touchmove' , (ev: TouchEvent) => {
            //   window.requestAnimationFrame(this.touchmove.bind(this, ev))
            //  })
            this.el.addEventListener('touchmove', this.touchmove.bind(this));
            this.el.addEventListener('touchend', this.touchend.bind(this));
            const ctx = this.el.getContext('2d');
            if (this.options.backgroundImg === 'grid') {
                this.drawGrid(ctx, 10, 10, 'lightgray', 0.5);
            }
            else if (this.options.backgroundImg === 'white') {
            }
            else {
                const img = new Image(this.el.clientWidth, this.el.clientHeight);
                img.src = this.options.backgroundImg;
                img.style.objectFit = 'cover';
                yield new Promise((resolve) => {
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        resolve(true);
                    };
                });
            }
            ctx.lineWidth = this.options.lineWidth;
            ctx.strokeStyle = this.options.lineColor;
            ctx.imageSmoothingEnabled = false;
            this.drawRecords.push(ctx.getImageData(0, 0, this.el.clientWidth, this.el.clientHeight));
            return ctx;
        });
    }
    touchstart(ev) {
        console.log('touchstart:', ev);
        const { clientX, clientY } = ev.targetTouches[0];
        console.log("this.ctx:", this.ctx);
        this.ctx.lineJoin = 'round';
        // 新建路径 
        this.ctx.beginPath();
        this.points.push({
            x: clientX,
            y: clientY
        });
    }
    touchmove(ev) {
        const { clientX, clientY } = ev.targetTouches[0];
        if (this.points.length === 3) {
            const [startPos, middlePos, endPos] = this.points;
            this.ctx.beginPath();
            this.ctx.moveTo(startPos.x, startPos.y);
            const s = {
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
                x: Math.floor(clientX),
                y: Math.floor(clientY)
            });
        }
    }
    touchend(ev) {
        this.points = [];
        // 此时是回撤了绘制之后，再次绘制，需要在 drawRecords 中删除掉 被回撤的imageData
        if (this.drawRecords.length - this.trackIndex > 1) {
            this.drawRecords = this.drawRecords.splice(0, this.trackIndex + 1);
        }
        this.drawRecords.push(this.ctx.getImageData(0, 0, this.el.clientWidth, this.el.clientHeight));
        this.trackIndex = this.drawRecords.length - 1;
    }
    /** 撤销绘画 */
    cancelStrokes(count = 1) {
        if (this.drawRecords.length && this.trackIndex >= 1) {
            const diffCount = this.trackIndex - Number(count);
            this.trackIndex = diffCount >= 0 ? diffCount : 0;
            const imgData = this.drawRecords[this.trackIndex];
            this.ctx.putImageData(imgData, 0, 0);
        }
    }
    /**恢复绘画 */
    recoverStrokes(count = 1) {
        if (this.drawRecords.length - this.trackIndex > 1) {
            this.trackIndex += Number(count);
            const imgData = this.drawRecords[this.trackIndex];
            this.ctx.putImageData(imgData, 0, 0);
        }
    }
    toBase64(type, quality) {
        return this.el.toDataURL(type, quality);
    }
    toBlob(type, quality) {
        return new Promise((resolve) => {
            this.el.toBlob((blob) => {
                resolve(blob);
            }, type, quality);
        });
    }
    drawGrid(ctx, stepX, stepY, color, lineWidth) {
        ctx.beginPath();
        // 创建垂直格网线路径
        for (let i = 0.5 + stepX; i < this.el.clientWidth; i += stepX) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.el.clientHeight);
        }
        // 创建水平格网线路径
        for (let j = 0.5 + stepY; j < this.el.clientHeight; j += stepY) {
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
    }
}
export default FlickerSignature;
