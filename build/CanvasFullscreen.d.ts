import { default as EventEmitter } from 'event-emitter';
export default class CanvasFullscreen extends EventEmitter {
    constructor(canvas: any, canvasVideo: any, mainVideo: any);
    /**
     * Init canvas rendering video for fullscreen support
     * @param {*} canvas
     */
    init(canvas: any, canvasVideo: any, mainVideo: any): void;
    _video: any;
    _canvas: any;
    onPauseRef: (() => void) | undefined;
    isPaused: boolean | undefined;
    onPlayRef: (() => void) | undefined;
    onEnterFullScreenRef: (() => void) | undefined;
    onExitFullScreenRef: any;
    _legacyFullscreen: boolean | undefined;
    onFullscreenChangeRef: ((event: any) => void) | undefined;
    onLoadedMetadataRef: any;
    /**
     * Request canvas fullscreen for iPhone within a check.
     * Use requestFullscreen otherwise for html container.
     */
    requestFullscreen(): void;
    /**
     * Exit fullscreen
     */
    exitFullscreen(): void;
}
