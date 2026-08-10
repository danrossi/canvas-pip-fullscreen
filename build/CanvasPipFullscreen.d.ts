import { default as EventEmitter } from 'event-emitter';
import { default as CanvasPictureInPicture } from './CanvasPictureInPicture';
import { default as CanvasFullscreen } from './CanvasFullscreen';
export default class CanvasPipFullscreen extends EventEmitter {
    static get pipSupported(): any;
    static get fullScreenAvailable(): any;
    constructor(canvas: any, video: any, forceFs?: boolean);
    _canvas: any;
    _video: any;
    _requiresDom: boolean;
    _forceFs: boolean;
    init(): Promise<any>;
    get requiresDom(): boolean;
    initCanvasVideo(): void;
    _canvasVideo: HTMLVideoElement | undefined;
    /**
     * Init pip and fullscreen support
     * @param {*} canvas
     * @param {*} video
     */
    initPip(): void;
    canvasPip: CanvasPictureInPicture | undefined;
    initFullscreen(): void;
    canvasFullScreen: CanvasFullscreen | undefined;
    /**
     * Update the video for the pip manager
     */
    set video(video: any);
    /**
     * Get the canvas rendering video to add to the dom
     */
    get canvasVideo(): HTMLVideoElement | undefined;
    /**
     * Toggle
     * @param {*} hasVR in a canvas render state or use normal video pip.
     */
    togglePictureInPicture(hasVR?: any): Promise<void>;
    /**
     * iPhone request fullscreen for canvas support
     */
    requestFullscreen(): void;
    /**
     * Exit iPhone fullscreen
     */
    exitFullscreen(): void;
}
