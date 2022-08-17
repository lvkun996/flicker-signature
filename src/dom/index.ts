

/**
 * 
 * @description 获取dom节点
 * 
 */

function getDom () {

}


/**
 * 
 * @description 创建canvas节点
 * 
 */

export function createEmpteNode (): HTMLCanvasElement {
  return document.createElement('canvas')
}

/**
 * @description 获取元素的大小及其相对于视口的位置
 * @param node 
 * @returns 
 * 
 */

export function getBCR (node: HTMLCanvasElement ): DOMRect {
  return node.getBoundingClientRect()
}