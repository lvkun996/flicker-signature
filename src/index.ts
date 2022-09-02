import { getHandlerKey, getPlatform } from './utils/index'

class FlickerSignature implements FS.IFlickerSignature {

  private el: HTMLCanvasElement

  private options: FS.Options = {

    lineWidth: 3,
    lineColor: '#000',
    backgroundImg: 'grid'

  }

  private ctx!: CanvasRenderingContext2D

  private points: {x: number, y: number}[] = []

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

  constructor ({
    el,
    options
  }: {
    el?: HTMLCanvasElement, 
    options?: FS.Options
  }) {

    if ( !el ) {
      throw new Error("canvas node cannot be empty");
    }

    if ( !options ) {
      console.warn("Flicker-signture: options not configured");
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

  /**暴露给用户 */
  get IsMoveing () {
    return this.isMoveing
  }

  async initCanvas (): Promise<CanvasRenderingContext2D> {
    
    this.bindHandler(this.el, 'start', this.touchstart.bind(this))
    this.bindHandler(this.el, 'move', this.touchmove.bind(this))
    this.bindHandler(this.el, 'end', this.touchend.bind(this))
  
    this.bindHandler (this.el, 'end', this.touchend.bind(this))

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
  private bindHandler (
    node: HTMLCanvasElement,
    eventKey: 'start' | 'move' | 'end' , 
    cb
  ) {
    
    node.addEventListener(getHandlerKey()[eventKey], cb, false)

  }

  private touchstart <T extends TouchEvent | MouseEvent >( ev: T) {
    
    const pos = this.getPos(ev)

    // 新建路径 
    this.ctx.beginPath()
    this.points.push({
      x: pos.x,
      y: pos.y
    })

    this.isMoveing = true

  }

  private touchmove <T extends TouchEvent | MouseEvent>( ev: T) {
    
    if (getPlatform() === 'Desktop' && !this.isMoveing) return
    
    const pos = this.getPos(ev)

    if ( this.points.length === 3) {

      const [ startPos, middlePos,  endPos ] = this.points

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

  private touchend ( ev: TouchEvent | MouseEvent) {

    this.points = []

    // 此时是回撤了绘制之后，再次绘制，需要在 drawRecords 中删除掉 被回撤的imageData
    if (this.drawRecords.length - this.trackIndex > 1) {
      this.drawRecords = this.drawRecords.splice(0, this.trackIndex + 1)
    }

    this.drawRecords.push(
      this.ctx.getImageData(0, 0, this.el.clientWidth, this.el.clientHeight)
    )
    
    this.trackIndex = this.drawRecords.length - 1

    this.isMoveing = false

  }

  /** 撤销绘画 */
  cancelStrokes  (count: number | string = 1)  {

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

  /**
   * @description 清除画布上的所有内容
   */
  clearCanvas () {

    this.drawRecords = this.drawRecords.splice(0, 1)

    this.ctx.putImageData(this.drawRecords[0], 0, 0)
    
    this.trackIndex = 0

  }

  /**设置背景图片 */
  private async setBackgroundImg (ctx: CanvasRenderingContext2D) {
    console.log(this.options);
    
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

  private drawGrid (ctx, stepX, stepY, color, lineWidth) {
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
  
  private getPos (ev: TouchEvent | MouseEvent) {
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

}

export default FlickerSignature



