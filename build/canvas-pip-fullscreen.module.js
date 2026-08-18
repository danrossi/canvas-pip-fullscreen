import EventEmitter from "event-emitter";
import IOSUtils from "ios-detection-utils";
//#region node_modules/pip-manager/build/pip-manager.module.js
var _chromeSupport = false;
var _webkitSupport = false;
var PictureInPictureUtil = class {
	static get supported() {
		_chromeSupport = "pictureInPictureEnabled" in document;
		_webkitSupport = "webkitSupportsPresentationMode" in HTMLVideoElement.prototype;
		return _chromeSupport || _webkitSupport;
	}
	static get webkitSupport() {
		return _webkitSupport;
	}
	static get chromeSupport() {
		return _chromeSupport;
	}
};
var _pipWindow;
var PictureInPictureManager = class extends EventEmitter {
	constructor() {
		super();
		this.pictureInPictureElement = false;
	}
	initVideo() {
		const onPipReady = () => {
			this.emit("disabled", this.videoEl.readyState === 0 || this.videoEl.disablePictureInPicture);
		};
		onPipReady();
		this.videoEl.addEventListener("loadedmetadata", onPipReady);
		this.videoEl.addEventListener("emptied", onPipReady);
	}
	set video(value) {
		this.videoEl = value;
		this.initVideo();
	}
	init(video) {
		this.video = video;
		if (PictureInPictureUtil.webkitSupport) this.initWebkitEvents();
		else this.initChromeEvents();
	}
	initWebkitEvents() {
		document.addEventListener("webkitpresentationmodechanged", (e) => this.onWebkitPresentationChanged(e), true);
	}
	initChromeEvents() {
		this.videoEl.addEventListener("enterpictureinpicture", (event) => {
			_pipWindow = event.pictureInPictureWindow;
			this.emit("enterpictureinpicture", _pipWindow);
			this.onPipWindowResizeRef = () => this.onPipWindowResize();
			_pipWindow.addEventListener("resize", this.onPipWindowResizeRef);
		});
		this.videoEl.addEventListener("leavepictureinpicture", (event) => {
			this.emit("leavepictureinpicture");
			_pipWindow.removeEventListener("resize", this.onPipWindowResizeRef);
		});
	}
	onWebkitPresentationChanged(e) {
		const element = e.target;
		if (element.webkitPresentationMode == "picture-in-picture") this.emit("enterpictureinpicture", element);
		else if (document.pictureInPictureElement == element) this.emit("leavepictureinpicture");
	}
	onPipWindowResize(e) {
		this.emit("resize", e);
	}
	async toggleChromePip() {
		if (!document.pictureInPictureElement) await this.videoEl.requestPictureInPicture().catch((error) => {
			this.emit("failed", error);
		});
		else await document.exitPictureInPicture().catch((error) => {
			this.emit("failed", error);
		});
	}
	async toggleWebkitPip() {
		if (!document.pictureInPictureElement && this.videoEl.webkitSupportsPresentationMode("picture-in-picture")) await this.videoEl.webkitSetPresentationMode("picture-in-picture");
		else await this.videoEl.webkitSetPresentationMode("inline");
	}
	async togglePictureInPicture() {
		if (PictureInPictureUtil.webkitSupport) await this.toggleWebkitPip();
		else await this.toggleChromePip();
	}
};
//#endregion
//#region src/CanvasPictureInPicture.js
var CanvasPictureInPicture = class extends EventEmitter {
	constructor(canvas, video, canvasVideo) {
		super();
		this._renderingCanvas = canvas;
		this._video = video;
		this._canvasVideo = canvasVideo;
		this.pipEnabled = false;
	}
	set video(video) {
		if (this.pipManager) this.pipManager.video = video;
	}
	init() {
		const pipVRVideo = this.pipVRVideo = this._canvasVideo, vrPipManager = new PictureInPictureManager(pipVRVideo);
		this.onPipMetadata = async () => {
			pipVRVideo.removeEventListener("loadedmetadata", this.onPipMetadata);
			if (this.pipEnabled) await vrPipManager.togglePictureInPicture();
			this.pipVRVideo.play().catch((e) => {
				console.log(e);
			});
		};
		const eventCallback = (e, ...args) => {
			this.emit(e.type, args[0], args[1]);
		};
		vrPipManager.on("enterpictureinpicture", (e) => {
			eventCallback(e, true);
		}).on("leavepictureinpicture", (e) => {
			if (this.pipEnabled) {
				eventCallback(e, true);
				pipVRVideo.classList.remove("show");
				pipVRVideo.srcObject.getTracks().forEach((track) => track.stop());
				this.pipEnabled = false;
			}
		}).on("failed", (e, error) => {
			eventCallback(e, true, error);
			this.pipEnabled = false;
		});
		if (this._video) {
			const pipManager = this.pipManager = new PictureInPictureManager(this._video);
			pipManager.on("enterpictureinpicture", (e) => {
				if (!this.pipEnabled) eventCallback(e, false);
			}).on("leavepictureinpicture", (e) => {
				if (!this.pipEnabled) eventCallback(e, false);
			}).on("failed", (e, error) => {
				eventCallback(e, false, error);
			}).on("disabled", (e, disabled) => {
				eventCallback(e, false, disabled);
			});
			pipManager.init(this._video);
		}
		vrPipManager.init(pipVRVideo);
	}
	async requestVRPip() {
		return new Promise((accept) => {
			this.pipEnabled = true;
			this.pipVRVideo.classList.add("show");
			this.pipVRVideo.addEventListener("loadedmetadata", this.onPipMetadata);
			this.pipVRVideo.srcObject = this._renderingCanvas.captureStream(30);
			this.pipVRVideo.play().catch((e) => {
				console.log(e);
			});
			accept();
		});
	}
	async togglePictureInPicture(hasVR = true) {
		if (hasVR) await this.requestVRPip();
		else if (this.pipManager) await this.pipManager.togglePictureInPicture();
	}
	set renderingCanvas(canvas) {
		this._renderingCanvas = canvas;
	}
};
//#endregion
//#region src/util/VideoPatcher.js
var VideoPatcher = class {
	static patchApi(api, video) {
		Object.defineProperty(video, "duration", { get: () => {
			return api.duration;
		} });
		Object.defineProperty(video, "currentTime", {
			get: () => {
				return api.currentTime;
			},
			set: (val) => {
				api.currentTime = val;
			},
			configurable: true,
			enumerable: true
		});
		console.log("patch api ", video);
	}
	static unPatchApi(video) {
		let descriptor;
		["duration", "currentTime"].forEach((desc) => {
			descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, desc);
			Object.defineProperty(video, desc, descriptor);
		});
	}
};
//#endregion
//#region src/VideoController.js
var VideoController = class {
	constructor(canvasVideo, mainVideo) {
		this.mainVideo = mainVideo;
		VideoPatcher.patchApi(this, canvasVideo);
	}
	get currentTime() {
		return this.mainVideo.currentTime;
	}
	set currentTime(value) {
		this.mainVideo.currentTime = value;
	}
	get duration() {
		console.log("duration ", this.mainVideo.duration);
		return this.mainVideo.duration;
	}
};
//#endregion
//#region src/CanvasFullscreen.js
var CanvasFullscreen = class extends EventEmitter {
	constructor(canvas, canvasVideo, mainVideo) {
		super();
		this.init(canvas, canvasVideo, mainVideo);
	}
	init(canvas, canvasVideo, mainVideo) {
		const video = this._video = canvasVideo;
		this._canvas = canvas;
		new VideoController(canvasVideo, mainVideo);
		this.onPauseRef = () => {
			if (this._legacyFullscreen) {
				this.emit("fspause");
				this.isPaused = true;
			}
		};
		this.onPlayRef = () => {
			if (this.isPaused && this._legacyFullscreen) {
				this.emit("fsplay");
				this.isPaused = false;
			}
		};
		this.onEnterFullScreenRef = () => {
			if (this._legacyFullscreen) {
				video.classList.add("show");
				this.emit("webkitbeginfullscreen");
			}
		};
		this.onExitFullScreenRef = () => {
			if (this._legacyFullscreen) {
				video.classList.remove("show");
				if (video.srcObject) video.srcObject.getTracks().forEach((track) => track.stop());
				document.removeEventListener("webkitfullscreenchange", this.onFullscreenChangeRef);
				video.removeEventListener("play", this.onPlayRef);
				video.removeEventListener("pause", this.onPauseRef);
				video.removeEventListener("webkitbeginfullscreen", this.onEnterFullScreenRef);
				video.removeEventListener("webkitendfullscreen", this.onExitFullScreenRef);
				this.emit("webkitendfullscreen");
				this._legacyFullscreen = false;
			}
		};
		this.onFullscreenChangeRef = (event) => {
			if (video.webkitDisplayingFullscreen) this.onEnterFullScreenRef();
			else this.onExitFullScreenRef();
		};
		this.onLoadedMetadataRef = () => {
			video.play().catch((e) => {
				console.log(e);
			});
			setTimeout(() => {}, 100);
			video.removeEventListener("loadedmetadata", this.onLoadedMetadataRef);
		};
	}
	requestFullscreen() {
		this._legacyFullscreen = true;
		document.addEventListener("webkitfullscreenchange", this.onFullscreenChangeRef);
		this._video.addEventListener("play", this.onPlayRef);
		this._video.addEventListener("pause", this.onPauseRef);
		this._video.addEventListener("webkitbeginfullscreen", this.onEnterFullScreenRef);
		this._video.addEventListener("webkitendfullscreen", this.onExitFullScreenRef);
		this._video.addEventListener("loadedmetadata", this.onLoadedMetadataRef);
		this._video.classList.add("show");
		this._video.srcObject = this._canvas.captureStream(30);
		this._video.play().catch((e) => {
			console.log(e);
		});
	}
	exitFullscreen() {
		this._video.webkitExitFullScreen();
	}
};
//#endregion
//#region src/util/CanvasPipFullscreenUtil.js
var CanvasPipFullscreenUtil = class {
	static get fullScreenAvailable() {
		return document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
	}
	static get isIOS() {
		return IOSUtils.isIOS;
	}
	static get IOSFullscreenAvailable() {
		return IOSUtils.isIOS && this.fullScreenAvailable;
	}
	static get pipSupported() {
		return PictureInPictureUtil.supported;
	}
	static get webkitSupported() {
		return PictureInPictureUtil.webkitSupport;
	}
};
//#endregion
//#region src/CanvasPipFullscreen.js
var CanvasPipFullscreen = class extends EventEmitter {
	constructor(canvas, video, forceFs = false) {
		super();
		this._canvas = canvas;
		this._video = video;
		this._requiresDom = false;
		this._forceFs = forceFs;
	}
	async init() {
		return new Promise((accept) => {
			this.initCanvasVideo();
			const isIOS = CanvasPipFullscreenUtil.isIOS, _pipSupported = CanvasPipFullscreenUtil.pipSupported, _webkitSupported = CanvasPipFullscreenUtil.webkitSupported;
			if (_pipSupported) this.initPip();
			this._requiresDom = _webkitSupported;
			if (isIOS && !CanvasPipFullscreenUtil.fullScreenAvailable || this._forceFs) {
				this._requiresDom = true;
				this._canvasVideo.setAttribute("webkit-playsinline", "");
				this._canvasVideo.setAttribute("playsinline", "");
				this._canvasVideo.classList.add("ios");
				this.initFullscreen();
			}
			accept(this._requiresDom);
		});
	}
	static get pipSupported() {
		return CanvasPipFullscreenUtil.pipSupported;
	}
	static get fullScreenAvailable() {
		return CanvasPipFullscreenUtil.fullScreenAvailable;
	}
	get requiresDom() {
		return this._requiresDom;
	}
	initCanvasVideo() {
		const canvasVideo = this._canvasVideo = document.createElement("video");
		canvasVideo.setAttribute("autoplay", true);
		canvasVideo.classList.add("vr-fs");
		canvasVideo.controls = true;
	}
	initPip() {
		this.canvasPip = new CanvasPictureInPicture(this._canvas, this._video, this._canvasVideo);
		const eventCallback = (e, ...args) => {
			this.emit(e.type, args[0], args[1]);
		};
		this.canvasPip.on("enterpictureinpicture", eventCallback).on("leavepictureinpicture", eventCallback).on("failed", eventCallback).on("disabled", eventCallback);
		this.canvasPip.init();
	}
	initFullscreen() {
		const eventCallback = (e, ...args) => {
			this.emit(e.type, args[0], args[1]);
		};
		this.canvasFullScreen = new CanvasFullscreen(this._canvas, this._canvasVideo, this._video);
		this.canvasFullScreen.on("webkitbeginfullscreen", eventCallback).on("webkitendfullscreen", eventCallback).on("fsplay", eventCallback).on("fspause", eventCallback);
	}
	set video(video) {
		if (this.canvasPip) this.canvasPip.video = video;
	}
	get canvasVideo() {
		return this._canvasVideo;
	}
	set renderingCanvas(canvas) {
		if (this.canvasFullScreen) this.canvasFullScreen.renderingCanvas = canvas;
	}
	async togglePictureInPicture(hasVR = true) {
		await this.canvasPip.togglePictureInPicture(hasVR);
	}
	requestFullscreen() {
		this.canvasFullScreen && this.canvasFullScreen.requestFullscreen();
	}
	exitFullscreen() {
		this.canvasFullScreen && this.canvasFullScreen.exitFullscreen();
	}
};
//#endregion
//#region src/util/VideoAnimation.js
var supportsFrameCallback = "requestVideoFrameCallback" in HTMLVideoElement.prototype;
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var lastTime;
var VideoAnimation = class {
	constructor(callback, video) {
		this.callback = callback, this.video = video, this.animationID = null, this.running = false;
	}
	setCallback(callback) {
		this.callback = callback;
	}
	async animateLegacy() {
		const now = this.video.currentTime;
		if (now > lastTime) {
			(1 / (now - lastTime)).toFixed();
			await this.callback(now, {
				width: this.video.videoWidth,
				height: this.video.videoHeight
			});
		}
		lastTime = now;
		this.animationID = requestAnimationFrame(async () => await this.animateLegacy());
	}
	async animate(now, metadata) {
		await this.callback(now, metadata);
		this.video.requestVideoFrameCallback(this.animateRef);
	}
	initAnimate() {
		this.animateRef = async (now, metadata) => await this.animate(now, metadata);
		this.video.requestVideoFrameCallback(this.animateRef);
	}
	initLegacyAnimate() {
		this.animateLegacy();
	}
	start() {
		this.stop();
		if (supportsFrameCallback) this.initAnimate();
		else {
			lastTime = new Date();
			this.initLegacyAnimate();
		}
		this.running = true;
	}
	stop() {
		this.running = false;
		if (supportsFrameCallback) this.animateRef = () => {};
		else cancelAnimationFrame(this.animationID && this.animationID.data && this.animationID.data.handleId || this.animationID);
	}
};
//#endregion
export { CanvasFullscreen, CanvasPictureInPicture, CanvasPipFullscreen, CanvasPipFullscreenUtil, VideoAnimation };
