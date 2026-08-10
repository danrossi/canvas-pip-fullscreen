export default class VideoAnimation {
    constructor(callback: any, video: any);
    callback: any;
    video: any;
    animationID: number | null;
    running: boolean;
    setCallback(callback: any): void;
    animateLegacy(): Promise<void>;
    animate(now: any, metadata: any): Promise<void>;
    initAnimate(): void;
    animateRef: ((now: any, metadata: any) => Promise<void>) | (() => void) | undefined;
    initLegacyAnimate(): void;
    start(): void;
    stop(): void;
}
