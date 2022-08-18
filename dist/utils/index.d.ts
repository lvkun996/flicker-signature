/**
 *
 * @description 判断用户设备是桌面端还是移动端
 * @returns Mobile | Desktop
 *
 */
export declare function getPlatform(): "Mobile" | "Desktop";
/**
 * @description 获取不同平台对应的事件
 */
export declare function getHandlerKey(): {
    start: string;
    move: string;
    end: string;
};
