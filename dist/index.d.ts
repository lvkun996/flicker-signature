declare class FlickerSignature {
    protected el: HTMLCanvasElement;
    protected options: FS.Options;
    protected ctx: CanvasRenderingContext2D;
    protected points: {
        x: number;
        y: number;
    }[];
    /** 绘图记录 */
    protected drawRecords: ImageData[];
    /**
     *
     * @description 当前步数指针
     * @description 用来记录是当前 回退或者前进 到哪一步了
     * @description 初始值是0
     *
     */
    protected trackIndex: number;
    /**
     *
     * @description 指针 步数
     *
     */
    protected trackStep: number;
    poslist: {
        x: number;
        y: number;
    }[];
    /** 是否正在绘制中 */
    moveing: boolean;
    constructor(el: HTMLCanvasElement, options: FS.Options);
    initCanvas(): Promise<CanvasRenderingContext2D>;
    /**
     * @description 绑定事件
     * @param ev
     */
    protected bindHandler(node: HTMLCanvasElement, eventKey: 'start' | 'move' | 'end', cb: any): void;
    protected touchstart(ev: TouchEvent): void;
    protected touchmove(ev: TouchEvent): void;
    protected touchend(ev: TouchEvent): void;
    /** 撤销绘画 */
    cancelStrokes(count?: number | string): void;
    /**恢复绘画 */
    recoverStrokes(count?: number | string): void;
    toBase64(type?: string | undefined, quality?: any): string;
    toBlob(type?: string, quality?: number): Promise<Blob | null>;
    drawGrid(ctx: any, stepX: any, stepY: any, color: any, lineWidth: any): void;
}
export default FlickerSignature;
