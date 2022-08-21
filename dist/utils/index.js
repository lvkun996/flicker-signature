/**
 *
 * @description 判断用户设备是桌面端还是移动端
 * @returns Mobile | Desktop
 *
 */
export function getPlatform() {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(|)|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)) {
        return 'Mobile';
    }
    else {
        return 'Desktop';
    }
}
/**
 * @description 获取不同平台对应的事件
 */
export function getHandlerKey() {
    const platform = getPlatform();
    if (platform === 'Mobile') {
        return {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend'
        };
    }
    else {
        return {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup'
        };
    }
}
