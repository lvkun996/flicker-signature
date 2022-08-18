declare class FlickerSignature {
    private el;
    private options;
    protected ctx: CanvasRenderingContext2D;
    private points;
    /** 绘图记录 */
    private drawRecords;
    /**
     *
     * @description 当前步数指针
     * @description 用来记录是当前 回退或者前进 到哪一步了
     * @description 初始值是0
     *
     */
    private trackIndex;
    /** 是否正在绘制中 */
    private isMoveing;
    constructor(el: HTMLCanvasElement, options: FS.Options);
    initCanvas(): Promise<CanvasRenderingContext2D>;
    /**
     *
     * @description 绑定事件
     * @param ev
     *
     */
    protected bindHandler(node: HTMLCanvasElement, eventKey: 'start' | 'move' | 'end', cb: any): void;
    protected touchstart<T extends TouchEvent | MouseEvent>(ev: T): void;
    protected touchmove<T extends TouchEvent | MouseEvent>(ev: T): void;
    protected touchend(ev: TouchEvent | MouseEvent): void;
    /** 撤销绘画 */
    cancelStrokes(count?: number | string): void;
    /**恢复绘画 */
    recoverStrokes(count?: number | string): void;
    /**设置背景图片 */
    setBackgroundImg(ctx: CanvasRenderingContext2D): Promise<void>;
    toBase64(type?: string | undefined, quality?: any): string;
    toBlob(type?: string, quality?: number): Promise<Blob | null>;
    drawGrid(ctx: any, stepX: any, stepY: any, color: any, lineWidth: any): void;
    getPos(ev: TouchEvent | MouseEvent): {
        x: number;
        y: number;
    };
}
export default FlickerSignature;
