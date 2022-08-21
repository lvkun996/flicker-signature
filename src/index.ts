<<<<<<< HEAD:src/index.ts
import { getHandlerKey } from './utils/index' 
=======
import { getHandlerKey, getPlatform } from './utils/index'

// function getPlatform () {
  
//   if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(|)|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ) {
//     return 'Mobile'
//   }

//   else {
//     return 'Desktop'
//   }

// }

// export function getHandlerKey () {
//   const platform = getPlatform()
//   if (platform === 'Mobile') {
//     return {
//       start: 'touchstart',
//       move: 'touchmove',
//       end: 'touchend'
//     }
//   } else {
//     return {
//       start: 'mousedown',
//       move: 'mousemove',
//       end: 'mouseup'
//     }
//   }
// }
>>>>>>> 508c0bf64329542a2c327fac7d67cdb0c8eef5e3:index.ts

class FlickerSignature {

  private el: HTMLCanvasElement

  private options: FS.Options = {
    lineWidth: 3,
    lineColor: '#000',
    backgroundImg: 'board'
  }

  protected ctx!: CanvasRenderingContext2D

<<<<<<< HEAD:src/index.ts
  protected points: {x: number, y: number}[] = []
=======
  private points: {x: number, y: number}[] = [] 
>>>>>>> 508c0bf64329542a2c327fac7d67cdb0c8eef5e3:index.ts

  /** 绘图记录 */
  private drawRecords: ImageData[] = []

  /**
   * 
   * @description 当前步数指针
   * @description 用来记录是当前 回退或者前进 到哪一步了
   * @description 初始值是0
   * 
   */
  private trackIndex: number = 0

  /** 是否正在绘制中 */
  private isMoveing: boolean = false

  constructor (el: HTMLCanvasElement, options: FS.Options) {

    if ( !el ) {

      throw new Error("canvas node cannot be empty");
    
    }

    this.el = el

    this.options = Object.assign(
      {},
      this.options,
      options
    )

    this.initCanvas().then( _ => this.ctx = _ )
  
    return this

  }

  async initCanvas (): Promise<CanvasRenderingContext2D> {
    
    this.bindHandler(this.el, 'start', this.touchstart.bind(this))
    this.bindHandler(this.el, 'move', this.touchmove.bind(this))
<<<<<<< HEAD:src/index.ts
    this.bindHandler(this.el, 'end', this.touchend.bind(this))
  
=======
    this.bindHandler (this.el, 'end', this.touchend.bind(this))

   this.el.addEventListener('mousedown', this.touchstart.bind(this))

>>>>>>> 508c0bf64329542a2c327fac7d67cdb0c8eef5e3:index.ts
   const ctx = this.el.getContext('2d')!

   await this.setBackgroundImg(ctx)

   ctx.lineWidth = this.options.lineWidth
   
   ctx.strokeStyle = this.options.lineColor

   ctx.lineJoin = 'round'

   ctx.imageSmoothingEnabled = false

   this.drawRecords.push(ctx.getImageData(0, 0, this.el.clientWidth, this.el.clientHeight))

   return ctx

  }

  /**
   * 
   * @description 绑定事件
   * @param ev 
   * 
   */
  protected bindHandler (
    node: HTMLCanvasElement, 
    eventKey: 'start' | 'move' | 'end' , 
    cb
  ) {
    
    node.addEventListener(getHandlerKey()[eventKey], cb, false)

  }

  protected touchstart <T extends TouchEvent | MouseEvent >( ev: T) {
    
    const pos = this.getPos(ev)

    // 新建路径 
    this.ctx.beginPath()
    this.points.push({
      x: pos.x,
      y: pos.y
    })

    if (getPlatform() === 'Desktop') {
      this.isMoveing = true
    }
  }

  protected touchmove <T extends TouchEvent | MouseEvent>( ev: T) {
    
    if (getPlatform() === 'Desktop' && !this.isMoveing) return
    
    const pos = this.getPos(ev)
    
    if ( this.points.length === 3) {

      const [ startPos, middlePos, endPos ] = this.points

      this.ctx.beginPath()

      this.ctx.moveTo(startPos.x, startPos.y)

      const s = {
        x: (middlePos.x + endPos.x ) / 2,
        y: ( middlePos.y + endPos.y ) / 2
      }

      this.ctx.quadraticCurveTo(
        middlePos.x, middlePos.y,
        s.x, s.y
      )
      
      this.points = [s]
    
      this.ctx.stroke()

      this.ctx.closePath()

    } else {
      this.points.push({
        x: Math.floor(pos.x),
        y: Math.floor(pos.y)
      })
    }
  }

  protected touchend ( ev: TouchEvent | MouseEvent) {

    this.points = []

    // 此时是回撤了绘制之后，再次绘制，需要在 drawRecords 中删除掉 被回撤的imageData
    if (this.drawRecords.length - this.trackIndex > 1) {
      this.drawRecords = this.drawRecords.splice(0, this.trackIndex + 1)
    }

    this.drawRecords.push(
      this.ctx.getImageData(0, 0, this.el.clientWidth, this.el.clientHeight)
    )
    
    this.trackIndex = this.drawRecords.length - 1

    if (getPlatform() === 'Desktop') {
      this.isMoveing = false
    }

  }

  /** 撤销绘画 */
  public cancelStrokes  (count: number | string = 1)  {

    if (this.drawRecords.length && this.trackIndex >= 1) {

      const diffCount = this.trackIndex - Number(count)
      this.trackIndex = diffCount >= 0 ? diffCount : 0
      
      const imgData = this.drawRecords[this.trackIndex]
      
      this.ctx.putImageData(imgData, 0, 0)
    }
  }

  /**恢复绘画 */
  recoverStrokes (count: number | string = 1)  {
    if ( this.drawRecords.length - this.trackIndex > 1 ) {
      this.trackIndex += Number(count)
      const imgData = this.drawRecords[this.trackIndex]
      this.ctx.putImageData(imgData, 0, 0)
    }
  }

  /**设置背景图片 */
  async setBackgroundImg (ctx: CanvasRenderingContext2D) {
    if (this.options.backgroundImg === 'grid' ) {
    
      this.drawGrid(ctx, 10, 10, 'lightgray', 0.5)
  
     } else if ( this.options.backgroundImg === 'white' ) {
      
     } else {
      
      const img = new Image(this.el.clientWidth, this.el.clientHeight)
      
      img.src = this.options.backgroundImg!
      
      img.style.objectFit = 'cover'
  
      await new Promise( (resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, img.width, img.height)
          resolve(true)
        }
      })
     }
  }

  toBase64 (type?: string | undefined, quality?: any ) {
    return this.el.toDataURL(type, quality)
  }

  toBlob (type?: string, quality?: number): Promise<Blob | null> {
    return new Promise( (resolve) => {
      this.el.toBlob((blob) => {
        resolve(blob)
      }, type, quality)
    })
  }

  /**
   * @description 清除画布上的所有内容
   */
  clearCanvas () {
    this.ctx.clearRect(0, 0 , this.el.width, this.el.height)
  }

  drawGrid (ctx, stepX, stepY, color, lineWidth) {
    ctx.beginPath()
    // 创建垂直格网线路径
    for(let i = 0.5 + stepX; i < this.el.clientWidth; i += stepX){
        ctx.moveTo(i, 0);
        ctx.lineTo(i, this.el.clientHeight);
    }
    // 创建水平格网线路径
    for(let j = 0.5 + stepY; j < this.el.clientHeight; j += stepY){
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
<<<<<<< HEAD:src/index.ts
=======

  getPos (ev: TouchEvent | MouseEvent) {
    let pos: { x: number, y: number } = Object.create(null)

    if ( getPlatform() === 'Mobile') {
      const _ev: TouchEvent = ev as TouchEvent
      const { clientX, clientY } = _ev.targetTouches[0] 
      pos.x = Math.floor(clientX)
      pos.y = Math.floor(clientY)
    } else {
      const _ev: MouseEvent = ev as MouseEvent
      const { x, y } = _ev
      pos.x = Math.floor(x)
      pos.y = Math.floor(y)
    }

    return pos
  }

  // drawGrid(10, 10, 'lightgray', 0.5);
>>>>>>> 508c0bf64329542a2c327fac7d67cdb0c8eef5e3:index.ts

}

export default FlickerSignature



