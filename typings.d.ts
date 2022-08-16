declare namespace FS {

  /**
   * @description 初始化options配置项
   */
  type Options = {
    lineWidth: number = 2
    lineColor: string = '#000'
    backgroundImg?: string
    cancelStrokes?: ( cancelCount: number = 1 ) => void
  }

}

