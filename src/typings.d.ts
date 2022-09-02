declare namespace FS {

  /**
   * @description 初始化options配置项
   */
  type Options = {
    lineWidth: number
    lineColor: string
    backgroundImg?: 'grid' | 'white' | string
  }

  interface IFlickerSignature {
    
    /**
     * @description 恢复绘画
     */
    recoverStrokes: (count: number | string) => void

    /**
     * @description 撤销绘画
     */
    cancelStrokes: (count: number | string) => void
  }

}


