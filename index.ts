import { getHandlerKey } from './src/utils/index' 

class FlickerSignature {

  protected el: HTMLCanvasElement

  protected options: FS.Options = {
    lineWidth: 3,
    lineColor: '#000',
    backgroundImg: 'board'
  }

  protected ctx!: CanvasRenderingContext2D

  protected points: {x: number, y: number}[] = []

  /** 绘图记录 */
  protected drawRecords: ImageData[] = []

  /**
   * 
   * @description 当前步数指针
   * @description 用来记录是当前 回退或者前进 到哪一步了
   * @description 初始值是0
   * 
   */
  protected trackIndex: number = 0

  /**
   * 
   * @description 指针 步数
   * 
   */
  protected trackStep: number = 1

  poslist: {x: number, y: number}[] = []

  /** 是否正在绘制中 */
  moveing: boolean = false

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
    this.bindHandler(this.el, 'end', this.touchend.bind(this))

  //  this.el.addEventListener('touchstart', this.touchstart.bind(this))
  
   //  this.el.addEventListener('touchmove' , (ev: TouchEvent) => {
  //   window.requestAnimationFrame(this.touchmove.bind(this, ev))
  //  })

  //  this.el.addEventListener('touchmove' , this.touchmove.bind(this))

  //  this.el.addEventListener('touchend' , this.touchend.bind(this))
  //  this.el.addEventListener('mouseleave')
  
   const ctx = this.el.getContext('2d')!

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

   ctx.lineWidth = this.options.lineWidth
   
   ctx.strokeStyle = this.options.lineColor

   ctx.imageSmoothingEnabled = false

   this.drawRecords.push(ctx.getImageData(0, 0, this.el.clientWidth, this.el.clientHeight))

   return ctx

  }

  /**
   * @description 绑定事件
   * @param ev 
   */
  protected bindHandler (
    node: HTMLCanvasElement, 
    eventKey: 'start' | 'move' | 'end' , 
    cb
  ) {
    
    node.addEventListener(getHandlerKey()[eventKey], cb, false)
  }

  protected touchstart ( ev: TouchEvent) {
    
    console.log('touchstart:', ev);
    const { clientX, clientY } = ev.targetTouches[0]

    console.log("this.ctx:", this.ctx);

    this.ctx.lineJoin = 'round'

    // 新建路径 
    this.ctx.beginPath()
    this.points.push({
      x: clientX,
      y: clientY
    })

  }

  protected touchmove ( ev: TouchEvent) {

    const { clientX, clientY } = ev.targetTouches[0]

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
        x: Math.floor(clientX),
        y: Math.floor(clientY)
      })
    }
  }

  protected touchend ( ev: TouchEvent) {

    this.points = []

    // 此时是回撤了绘制之后，再次绘制，需要在 drawRecords 中删除掉 被回撤的imageData
    if (this.drawRecords.length - this.trackIndex > 1) {
      this.drawRecords = this.drawRecords.splice(0, this.trackIndex + 1)
    }

    this.drawRecords.push(
      this.ctx.getImageData(0, 0, this.el.clientWidth, this.el.clientHeight)
    )
    
    this.trackIndex = this.drawRecords.length - 1

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

}

export default FlickerSignature



