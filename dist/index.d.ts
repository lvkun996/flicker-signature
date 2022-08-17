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
    constructor(el: HTMLCanvasElement, options: FS.Options);
    initCanvas(): Promise<CanvasRenderingContext2D>;
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
