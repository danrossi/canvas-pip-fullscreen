import { default as EventEmitter } from 'event-emitter';
import { default as CanvasPictureInPicture } from './CanvasPictureInPicture';
import { default as CanvasFullscreen } from './CanvasFullscreen';
export default class CanvasPipFullscreen extends EventEmitter {
    static get pipSupported(): boolean;
    static get fullScreenAvailable(): any;
    /**
     *
     * @param {HTMLCanvasElement} canvas - the rendering canvas
     * @param {HTMLVideoElement} video - the video element
     * @param {boolean} forceFs - force fullscreen
     */
    constructor(canvas: HTMLCanvasElement, video: HTMLVideoElement, forceFs?: boolean);
    _canvas: HTMLCanvasElement;
    _video: HTMLVideoElement;
    _requiresDom: boolean;
    _forceFs: boolean;
    init(): Promise<any>;
    get requiresDom(): boolean;
    initCanvasVideo(): void;
    _canvasVideo: HTMLVideoElement | undefined;
    /**
     * Init pip and fullscreen support
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
     * Set new rendering canvas
     *
     * @param {HTMLCanvasElement} canvas - the rendering canvas
     */
    set renderingCanvas(canvas: HTMLCanvasElement);
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
