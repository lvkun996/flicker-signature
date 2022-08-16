
// import { getBCR }  from './dom/index'
// console.log(getBCR);

export function getBCR (node: HTMLCanvasElement ): DOMRect {
  return node.getBoundingClientRect()
}

class FlickerSignature {

  protected el: HTMLCanvasElement

  protected options: FS.Options = {
    lineWidth: 2,
    lineColor: '#000',
    cancelStrokes: () => {

    }
  }

  protected ctx: CanvasRenderingContext2D

  protected BCR: DOMRect

  constructor (el: HTMLCanvasElement, options: FS.Options) {

    if ( !el ) {

      throw new Error("canvas node cannot be empty");
    
    }

    this.el = el

    this.options = Object.assign({}, this.options, options) 

    this.BCR = getBCR(el)

    console.log("this.BCR:", this.BCR);
    
    this.ctx = this.initCanvas()

    return this

  }

  initCanvas (): CanvasRenderingContext2D {
    
   this.el.addEventListener('touchstart', this.touchstart.bind(this))
   this.el.addEventListener('touchmove' , this.touchmove.bind(this))
   this.el.addEventListener('touchend' , this.touchend.bind(this))
  
   const ctx = this.el.getContext('2d')!

   ctx.lineWidth = this.options.lineWidth
   
   ctx.strokeStyle = '#000'

   console.log('context:', ctx);

   return ctx

  }

  touchstart ( ev: TouchEvent) {
    
    console.log('touchstart:', ev);
    const { clientX, clientY } = ev.targetTouches[0]

    console.log("this.ctx:", this.ctx);
    
    // 新建路径
    this.ctx.beginPath()

    this.ctx.moveTo(this.BCR.top - clientY, this.BCR.left - clientX)

  }

  touchmove ( ev: TouchEvent) {

    const { clientX, clientY } = ev.targetTouches[0]
    console.log('touchmove:', clientY);

    this.ctx.moveTo( clientY,  clientX)

    this.ctx.lineTo( clientY,  clientX)

    this.ctx.stroke()
  }

  touchend ( ev: TouchEvent) {
 
    console.log('touchend:', ev);

  }

  toBase64 () {

  }

  toPng () {

  }

}

export default FlickerSignature



