export declare function getBCR(node: HTMLCanvasElement): DOMRect;
declare class FlickerSignature {
    protected el: HTMLCanvasElement;
    protected options: FS.Options;
    protected ctx: CanvasRenderingContext2D;
    protected BCR: DOMRect;
    constructor(el: HTMLCanvasElement, options: FS.Options);
    initCanvas(): CanvasRenderingContext2D;
    touchstart(ev: TouchEvent): void;
    touchmove(ev: TouchEvent): void;
    touchend(ev: TouchEvent): void;
    toBase64(): void;
    toPng(): void;
}
export default FlickerSignature;
