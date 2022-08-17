
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

  poslist: {x: number, y: number}[] = []

  /** 是否正在绘制中 */
  moveing: boolean = false

  constructor (el: HTMLCanvasElement, options: FS.Options) {

    if ( !el ) {

      throw new Error("canvas node cannot be empty");
    
    }

    this.el = el

    this.options = Object.assign({}, this.options, options) 

    this.BCR = getBCR(el)

    console.log("this.BCR:", this.BCR);
    
    this.ctx = this.initCanvas()

    this.ctx.beginPath()

    this.ctx.moveTo(50, 50)

    this.ctx.quadraticCurveTo(60, 100, 80, 100)

    this.ctx.stroke()

    this.ctx.moveTo(80, 100)

    this.ctx.quadraticCurveTo(90, 100, 100, 110)

    this.ctx.stroke()

    return this

  }

  initCanvas (): CanvasRenderingContext2D {
    
   this.el.addEventListener('touchstart', this.touchstart.bind(this))
   this.el.addEventListener('touchmove' , this.touchmove.bind(this))
   this.el.addEventListener('touchend' , this.touchend.bind(this))
  
   const ctx = this.el.getContext('2d')!

   ctx.lineWidth = this.options.lineWidth
   
   ctx.strokeStyle = '#000'

   return ctx

  }

  touchstart ( ev: TouchEvent) {
    
    console.log('touchstart:', ev);
    const { clientX, clientY } = ev.targetTouches[0]

    console.log("this.ctx:", this.ctx);
    
    // 新建路径
    this.ctx.beginPath() 

    // this.ctx.moveTo(clientX, clientY)

    this.poslist.push(
      {
        x: clientX,
        y: clientY
      }
    )

  }

  touchmove ( ev: TouchEvent) {

    const { clientX, clientY, pageY, screenY } = ev.targetTouches[0]

    console.log('touchmove:', clientY, pageY, screenY );

   
    // 取整数 有利于canvas的优化
    // this.ctx.lineTo( Math.floor(clientX),  Math.floor(clientY) )

    if ( this.poslist.length === 3 ) {
      console.log("this.poslist:", this.poslist);
      
      const [ startPos, middelPos, endPos ] = this.poslist

      this.ctx.moveTo( startPos.x, startPos.y )

      const s = {
        x: (endPos.x + middelPos.x) / 2,
        y: (endPos.y + middelPos.y) / 2
      }
      
      this.ctx.quadraticCurveTo(
        startPos.x, startPos.y,
        s.x, s.y
      )

      this.poslist = []

    } else {
      this.poslist.push({
        x: Math.floor(clientX),
        y: Math.floor(clientY)
      })
    }

    this.ctx.stroke()
  }

  touchend ( ev: TouchEvent) {
    this.poslist = []
    this.ctx.closePath()
    console.log('touchend:', ev);

  }

  toBase64 () {

  }

  toPng () {

  }

}

export default FlickerSignature



