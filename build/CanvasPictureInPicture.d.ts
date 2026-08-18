import { default as EventEmitter } from 'event-emitter';
import { PictureInPictureManager } from 'pip-manager';
export default class CanvasPictureInPicture extends EventEmitter {
    constructor(canvas: any, video: any, canvasVideo: any);
    _renderingCanvas: any;
    _video: any;
    _canvasVideo: any;
    pipEnabled: boolean;
    set video(video: any);
    /**
     * Init canvas video and normal video pip
     * @param {*} canvas
     * @param {*} video
     */
    init(): void;
    pipVRVideo: any;
    onPipMetadata: any;
    pipManager: PictureInPictureManager | undefined;
    /**
     * Request VR picture in picture
     */
    requestVRPip(): Promise<any>;
    /**
     * Toggle canvas or video pip
     * @param {*} hasVR
     */
    togglePictureInPicture(hasVR?: any): Promise<void>;
    /**
     * Set new rendering canvas
     *
     * @param {HTMLCanvasElement} canvas - the rendering canvas
     */
    set renderingCanvas(canvas: HTMLCanvasElement);
}
