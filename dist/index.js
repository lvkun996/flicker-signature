// import { getBCR }  from './dom/index'
// console.log(getBCR);
export function getBCR(node) {
    return node.getBoundingClientRect();
}
class FlickerSignature {
    constructor(el, options) {
        this.options = {
            lineWidth: 2,
            lineColor: '#000',
            cancelStrokes: () => {
            }
        };
        if (!el) {
            throw new Error("canvas node cannot be empty");
        }
        this.el = el;
        this.options = Object.assign({}, this.options, options);
        this.BCR = getBCR(el);
        console.log("this.BCR:", this.BCR);
        this.ctx = this.initCanvas();
        return this;
    }
    initCanvas() {
        this.el.addEventListener('touchstart', this.touchstart.bind(this));
        this.el.addEventListener('touchmove', this.touchmove.bind(this));
        this.el.addEventListener('touchend', this.touchend.bind(this));
        const ctx = this.el.getContext('2d');
        ctx.lineWidth = this.options.lineWidth;
        ctx.strokeStyle = '#000';
        console.log('context:', ctx);
        return ctx;
    }
    touchstart(ev) {
        console.log('touchstart:', ev);
        const { clientX, clientY } = ev.targetTouches[0];
        console.log("this.ctx:", this.ctx);
        // 新建路径
        this.ctx.beginPath();
        this.ctx.moveTo(this.BCR.top - clientY, this.BCR.left - clientX);
    }
    touchmove(ev) {
        const { clientX, clientY } = ev.targetTouches[0];
        console.log('touchmove:', clientY);
        this.ctx.moveTo(clientY, clientX);
        this.ctx.lineTo(clientY, clientX);
        this.ctx.stroke();
    }
    touchend(ev) {
        console.log('touchend:', ev);
    }
    toBase64() {
    }
    toPng() {
    }
}
export default FlickerSignature;
