"use strict";
/**
 *
 * @description 创建canvas节点
 *
 */
exports.__esModule = true;
exports.getBCR = exports.createEmpteNode = void 0;
function createEmpteNode() {
    return document.createElement('canvas');
}
exports.createEmpteNode = createEmpteNode;
/**
 * @description 获取元素的大小及其相对于视口的位置
 * @param node
 * @returns
 *
 */
function getBCR(node) {
    return node.getBoundingClientRect();
}
exports.getBCR = getBCR;
