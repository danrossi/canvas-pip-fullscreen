
/**
 * @license
 * canvas-pip-fullscreen
 * @author danrossi / https://github.com/danrossi
 * Copyright (c) 2017 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Event Emitter
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2016 Electroteque Media
 */
/**
 * Creates a new instance of Emitter.
 * @class
 * @returns {Object} emitter - An instance of Emitter.
 * @example
 * var emitter = new Emitter();
 */

const objectToEvents$1 = new WeakMap();

class EventEmitter$1 {

    constructor() {
        objectToEvents$1.set(this, {});
    }

    /**
     * Adds a listener to the collection for a specified event.
     * @public
     * @function
     * @name Emitter#on
     * @param {String} event - Event name.
     * @param {Function} listener - Listener function.
     * @returns {Object} emitter
     * @example
     * emitter.on('ready', listener);
     */
    on(type, callback) {

        const events = objectToEvents$1.get(this);

        if (!events[type]) {
            events[type] = [];
        }
        events[type].push(callback);

        return this;
    }

    /**
     * Adds a one time listener to the collection for a specified event. It will execute only once.
     * @public
     * @function
     * @name Emitter#once
     * @param {String} event - Event name.
     * @param {Function} listener - Listener function.
     * @returns {Object} emitter
     * @example
     * me.once('contentLoad', listener);
     */
    once(type, callback) {

        const fn = (...args) => {
            this.off(type, fn);
            callback(...args);
        };

        this.on(type, fn);

        return this;
    }

    /**
     * Removes a listener from the collection for a specified event.
     * @public
     * @function
     * @name Emitter#off
     * @param {String} event - Event name.
     * @param {Function} listener -  Listener function.
     * @returns {Object} emitter
     * @example
     * me.off('ready', listener);
     */
    off(type, callback) {

        const events = objectToEvents$1.get(this)[type];

        if (events) {
            if (callback === null) {
                events.length = 0;
            } else {
                events.splice(events.indexOf(callback), 1);
            }
        }


        /*let index = 0;

        function isFunction(obj) {
            return typeof obj === 'function' || false;
        }

        if (listeners && listeners.length) {

            index = listeners.reduce((lastIndex, listener, currentIndex) => {
                return isFunction(listener) && listener === callback ? lastIndex = currentIndex : lastIndex;
            }, -1);


            if (index > -1) {
                listeners.splice(index, 1);
                this.listeners.set(event, listeners);
            }
        }*/
        return this;
    }

    /**
     * Returns all listeners from the collection for a specified event.
     * @public
     * @function
     * @name Emitter#listeners
     * @param {String} event - Event name.
     * @returns {Array}
     * @example
     * me.listeners('ready');
     */
    listeners(type) {
        try {
            return objectToEvents$1.get(this)[type];
        } catch (error) {
            return null;
        }
    }

    /**
     * Execute each item in the listener collection in order with the specified data.
     * @name Emitter#emit
     * @public
     * @function
     * @param {String} event - The name of the event you want to emit.
     * @param {...args} [args] - Data to pass to the listeners.
     * @example
     * me.emit('ready', 'param1', {..}, [...]);
     */
    emit(type, ...args) {

        //const event, events;

        //events = (objectToEvents.get(this)[type] || []).slice();

        const events = objectToEvents$1.get(this)[type];

        if (events && events.length) {
            events.forEach((listener) => {
                listener({ type: type, target: this}, ...args);
            });
            return true;
        }

        return this;
    }

    emitAsync(type, ...args) {
        //const listeners = this.listeners.get(event),
        const events = objectToEvents$1.get(this)[type],
            promises = [];


        if (events && events.length) {
            events.forEach((listener) => {
                promises.push(listener({ type: type, target: this}, ...args));
            });
        }

        return Promise.all(promises);
    }

}

/**
 * @license
 * pip-manager
 * @author danrossi / https://github.com/danrossi
 * Copyright (c) 2017 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Event Emitter
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2016 Electroteque Media
 */
/**
 * Creates a new instance of Emitter.
 * @class
 * @returns {Object} emitter - An instance of Emitter.
 * @example
 * var emitter = new Emitter();
 */

const objectToEvents = new WeakMap();

class EventEmitter {

    constructor() {
        objectToEvents.set(this, {});
    }

    /**
     * Adds a listener to the collection for a specified event.
     * @public
     * @function
     * @name Emitter#on
     * @param {String} event - Event name.
     * @param {Function} listener - Listener function.
     * @returns {Object} emitter
     * @example
     * emitter.on('ready', listener);
     */
    on(type, callback) {

        const events = objectToEvents.get(this);

        if (!events[type]) {
            events[type] = [];
        }
        events[type].push(callback);

        return this;
    }

    /**
     * Adds a one time listener to the collection for a specified event. It will execute only once.
     * @public
     * @function
     * @name Emitter#once
     * @param {String} event - Event name.
     * @param {Function} listener - Listener function.
     * @returns {Object} emitter
     * @example
     * me.once('contentLoad', listener);
     */
    once(type, callback) {

        const fn = (...args) => {
            this.off(type, fn);
            callback(...args);
        };

        this.on(type, fn);

        return this;
    }

    /**
     * Removes a listener from the collection for a specified event.
     * @public
     * @function
     * @name Emitter#off
     * @param {String} event - Event name.
     * @param {Function} listener -  Listener function.
     * @returns {Object} emitter
     * @example
     * me.off('ready', listener);
     */
    off(type, callback) {

        const events = objectToEvents.get(this)[type];

        if (events) {
            if (callback === null) {
                events.length = 0;
            } else {
                events.splice(events.indexOf(callback), 1);
            }
        }


        /*let index = 0;

        function isFunction(obj) {
            return typeof obj === 'function' || false;
        }

        if (listeners && listeners.length) {

            index = listeners.reduce((lastIndex, listener, currentIndex) => {
                return isFunction(listener) && listener === callback ? lastIndex = currentIndex : lastIndex;
            }, -1);


            if (index > -1) {
                listeners.splice(index, 1);
                this.listeners.set(event, listeners);
            }
        }*/
        return this;
    }

    /**
     * Returns all listeners from the collection for a specified event.
     * @public
     * @function
     * @name Emitter#listeners
     * @param {String} event - Event name.
     * @returns {Array}
     * @example
     * me.listeners('ready');
     */
    listeners(type) {
        try {
            return objectToEvents.get(this)[type];
        } catch (error) {
            return null;
        }
    }

    /**
     * Execute each item in the listener collection in order with the specified data.
     * @name Emitter#emit
     * @public
     * @function
     * @param {String} event - The name of the event you want to emit.
     * @param {...args} [args] - Data to pass to the listeners.
     * @example
     * me.emit('ready', 'param1', {..}, [...]);
     */
    emit(type, ...args) {

        //const event, events;

        //events = (objectToEvents.get(this)[type] || []).slice();

        const events = objectToEvents.get(this)[type];

        if (events && events.length) {
            events.forEach((listener) => {
                listener({ type: type, target: this}, ...args);
            });
            return true;
        }

        return this;
    }

    emitAsync(type, ...args) {
        //const listeners = this.listeners.get(event),
        const events = objectToEvents.get(this)[type],
            promises = [];


        if (events && events.length) {
            events.forEach((listener) => {
                promises.push(listener({ type: type, target: this}, ...args));
            });
        }

        return Promise.all(promises);
    }

}

/**
 * Picture In Picture API Support util
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2023 Electroteque Media
 */

let _chromeSupport = false,
_webkitSupport = false;

class PictureInPictureUtil {

	/**
	 * Call supported to set different api support
	 */
	static get supported() {
		_chromeSupport = 'pictureInPictureEnabled' in document;
		_webkitSupport = 'webkitSupportsPresentationMode' in HTMLVideoElement.prototype;
		return _chromeSupport || _webkitSupport;
	}

	/**
	 * webkit support
	 */
	static get webkitSupport() {
		return _webkitSupport;
	}

	/**
	 * chrome support
	 */
	static get chromeSupport() {
		return _chromeSupport;
	} 
}

/**
 * Picture In Picture API Manager
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2023 Electroteque Media
 */

let _pipWindow;

class PictureInPictureManager extends EventEmitter {

	constructor() {
		super();
		this.pictureInPictureElement = false;
	}

	/**
	 * Check PIP enable state. Blocked on Android.
	 */
	initVideo() {
		const onPipReady = () => {
			this.emit("disabled", ((this.videoEl.readyState === 0) || this.videoEl.disablePictureInPicture));
		};

		onPipReady();

		this.videoEl.addEventListener('loadedmetadata', onPipReady);
		this.videoEl.addEventListener('emptied', onPipReady);

		
	}


	/**
	 * Set a new video element
	 */
	set video(value) {
		this.videoEl = value;
		this.initVideo();
	}

	/**
	 * init events
	 */
	init(video) {

		this.video = video;

		if (PictureInPictureUtil.webkitSupport) {
			this.initWebkitEvents();
		} else {
			this.initChromeEvents();
		}
	}

	/**
	 * init webkit events
	 */
	initWebkitEvents() {
		document.addEventListener('webkitpresentationmodechanged', (e) => this.onWebkitPresentationChanged(e),true);
	}

	/**
	 * init chrome events
	 */
	initChromeEvents() {
		this.videoEl.addEventListener('enterpictureinpicture', (event) => {
			  _pipWindow = event.pictureInPictureWindow;
			  this.emit("enterpictureinpicture", _pipWindow);
			   this.onPipWindowResizeRef = () => this.onPipWindowResize();
			  _pipWindow.addEventListener('resize', this.onPipWindowResizeRef);
		});

		this.videoEl.addEventListener('leavepictureinpicture', (event) => {
				this.emit("leavepictureinpicture");
				_pipWindow.removeEventListener('resize', this.onPipWindowResizeRef);
		});
	}

	/**
	 * Presentation change for webkit
	 * @param {*} e 
	 */
	onWebkitPresentationChanged(e) {
		const element = e.target;

	    if (element.webkitPresentationMode == "picture-in-picture") {
	      // Keep track of the PiP element.  This element just entered PiP mode.
	      //document.pictureInPictureElement = element;
	      this.emit("enterpictureinpicture", element);
	    } else {
	      if (document.pictureInPictureElement == element) {
	       // document.pictureInPictureElement = null;
			this.emit("leavepictureinpicture");
	      }
		}

	}

	/**
	 * Pip window resize
	 * @param {*} e 
	 */
	onPipWindowResize(e) {
		this.emit("resize", e);
	}

	/**
	 * Enter/exit Chrome pip 
	 */
	toggleChromePip() {
		if (!document.pictureInPictureElement) {
	      this.videoEl.requestPictureInPicture()
	      .catch(error => {
	        // Video failed to enter Picture-in-Picture mode.

			this.emit("failed", error);
	      });
	    } else {
	      document.exitPictureInPicture()
	      .catch(error => {
	        // Video failed to leave Picture-in-Picture mode.
			this.emit("failed", error);
	      });
	    }
	}

	/**
	 * Enter/exit Webkit pip
	 */
	toggleWebkitPip() {
		//extra supports check
		if (!document.pictureInPictureElement && this.videoEl.webkitSupportsPresentationMode("picture-in-picture")) {
	      this.videoEl.webkitSetPresentationMode("picture-in-picture");
	    } else {
		  //exit pip for webkit
	      this.videoEl.webkitSetPresentationMode("inline");
	    }		
	}

	/**
	 * Toggle picture in picture for both apis
	 */
	togglePictureInPicture() {
		if (PictureInPictureUtil.webkitSupport) {
    		this.toggleWebkitPip();
	    } else {
	    	this.toggleChromePip();
	    }
	}
}

/**
 * Canvas Picture In Picture API Manager
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2023 Electroteque Media
 */

class CanvasPictureInPicture extends EventEmitter$1 {

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

    /**
     * Init canvas video and normal video pip
     * @param {*} canvas 
     * @param {*} video 
     */
    init() {
        //const pipVRVideo = this.pipVRVideo = document.createElement("video"),
        const pipVRVideo = this.pipVRVideo = this._canvasVideo,
        vrPipManager = new PictureInPictureManager(pipVRVideo);
        //pipVRVideo.setAttribute("autoplay", true);
        //pipVRVideo.setAttribute("webkit-playsinline","");
        //pipVRVideo.setAttribute("playsinline","");
        

        this.onPipMetadata = () => {
            pipVRVideo.removeEventListener("loadedmetadata", this.onPipMetadata);
            if (this.pipEnabled) vrPipManager.togglePictureInPicture();
            this.pipVRVideo.play().catch((e) => { console.log(e);});
        };

        const eventCallback = (e, ...args) => {
            this.emit(e.type, args[0], args[1]);
        };
    
        vrPipManager.on("enterpictureinpicture", (e) => {
            eventCallback(e, true);
            //pipVRVideo.style.display = "block";
        }).on("leavepictureinpicture", (e) => {
            if (this.pipEnabled) {
                eventCallback(e, true);
                pipVRVideo.classList.remove("show");
                //pipVRVideo.style.display = "none";
                //stop the canvas stream tracks
                pipVRVideo.srcObject.getTracks().forEach(track => track.stop());
                this.pipEnabled = false;
            }
        }).on("failed", (e, error) => {
            eventCallback(e, true, error);
            this.pipEnabled = false;
        });/*.on("disabled", (e, disabled) => {
            eventCallback(e, true, disabled);
        });*/

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

     /**
     * Request VR picture in picture
     */
     requestVRPip() {
        this.pipEnabled = true;
        //this.pipVRVideo.style.display = "block";
        this.pipVRVideo.classList.add("show");
        this.pipVRVideo.addEventListener("loadedmetadata", this.onPipMetadata);
        //render video from the canvas stream
        this.pipVRVideo.srcObject = this._renderingCanvas.captureStream(30);
        this.pipVRVideo.play().catch((e) => { console.log(e);});
    }

    /**
     * Toggle canvas or video pip
     * @param {*} hasVR 
     */
    togglePictureInPicture(hasVR = true) {
        if (hasVR)
            this.requestVRPip();
        else if (this.pipManager)
            this.pipManager.togglePictureInPicture();
    }
}

/**
 * IPhone Canvas Native Fullscreeen API Support
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2023 Electroteque Media
 */

class CanvasFullscreen extends EventEmitter$1 {

    constructor(canvas, canvasVideo) {
        super();
        this.init(canvas, canvasVideo);
    }

    /**
     * Init canvas rendering video for fullscreen support
     * @param {*} canvas 
     */
    init(canvas, canvasVideo) {
        
        //const video = this._video = document.createElement("video");
        const video = this._video = canvasVideo;
        this._canvas = canvas;

        //video.setAttribute("autoplay", true);
        //video.setAttribute("webkit-playsinline","");
        //video.setAttribute("playsinline","");     
        //video.setAttribute("muted", true);

        //video.style.display = "none";

        
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
                //video.style.display = "block";
                video.classList.add("show");
                this.emit('webkitbeginfullscreen');
            }
            
        };

        this.onExitFullScreenRef = () => {
            if (this._legacyFullscreen) {
                //video.style.display = "none";
                video.classList.remove("show");

                //stop canvas stream tracks
                if (video.srcObject) video.srcObject.getTracks().forEach(track => track.stop());

                document.removeEventListener("webkitfullscreenchange", this.onFullscreenChangeRef);

                video.removeEventListener("play", this.onPlayRef);
                video.removeEventListener("pause", this.onPauseRef);

                video.removeEventListener('webkitbeginfullscreen', this.onEnterFullScreenRef);
                video.removeEventListener('webkitendfullscreen', this.onExitFullScreenRef);


                this.emit('webkitendfullscreen');

                this._legacyFullscreen = false;
            }
            
        };

        this.onFullscreenChangeRef = (event) => {
            //console.log("on webkitfullscreenchange", video.webkitDisplayingFullscreen);

            if (video.webkitDisplayingFullscreen) {
                this.onEnterFullScreenRef();
            } else {
                this.onExitFullScreenRef();
            }
           
        };


        this.onLoadedMetadataRef = () => {
            //video.style.display = "block";
            //video.classList.add("show");
            video.play().catch((e) => { console.log(e);});
            //enter fullscreen on metadata
            //bug in webkit requiring delay when changing visibility css state or it won't show video
            setTimeout(() => {
                video.webkitEnterFullScreen();
            }, 100);


            video.removeEventListener("loadedmetadata", this.onLoadedMetadataRef);

        };

        
    }

    /**
     * Request canvas fullscreen for iPhone within a check. 
     * Use requestFullscreen otherwise for html container.
     */
    requestFullscreen() {
        this._legacyFullscreen = true;
        document.addEventListener("webkitfullscreenchange", this.onFullscreenChangeRef);
        this._video.addEventListener("play", this.onPlayRef);
        this._video.addEventListener("pause", this.onPauseRef);
        this._video.addEventListener('webkitbeginfullscreen', this.onEnterFullScreenRef);
        this._video.addEventListener('webkitendfullscreen', this.onExitFullScreenRef);
        this._video.addEventListener("loadedmetadata", this.onLoadedMetadataRef);
        

        //video.style.display = "block";
        this._video.classList.add("show");

        this._video.srcObject = this._canvas.captureStream(30);

        this._video.play().catch((e) => { console.log(e);});
    }

    /**
     * Exit fullscreen
     */
    exitFullscreen() {
        this._video.webkitExitFullScreen();
    }

    /**
     * the current video to add to the dom or add css
     */
    /*get video() {
        return this._video;
    }*/
}

/**
 * @license
 * ios-detection-utils
 * @author danrossi / https://github.com/danrossi
 * Copyright (c) 2017 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * IOSUtils
 * IOS utils methods for IOS detection and requesting orientation permissions. 
 * @author danrossi / https://github.com/danrossi
 */

let visionOSWidth = 1306;

class IOSUtils {
    /**
     * Only way to detect visionOS is detect for MacIntel Ipad and screen width greater than 1306
     * xr detection for visionOS is only possible if the flag is enabled.
     */
    static get isVisionOS() {
        return this.isIpad && screen.availWidth >= visionOSWidth; 
    }

    /**
     * Modern Ipad detection
     */
    static get isIpad() {
        return (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    /**
     * Iphone and Ipad detection and filter for visionOS screens. 
     * We don't want to detect visionOS as iOS to prevent including mobile features like orientation controls.
     */
    static get isIOS() {
        return ((/iP(hone|ad)/i).test(navigator.platform) || this.isIpad && screen.availWidth < visionOSWidth);
    }

    static requireOrientationPermission() {
        return window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function';
    }

    static requestOrientationPermissions() {
        return window.DeviceOrientationEvent.requestPermission();
    }
}

class CanvasPipFullscreenUtil {

    static get fullScreenAvailable() {
        return document.fullscreenEnabled ||
            document.mozFullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.msFullscreenEnabled;
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
}

/**
 * Canvas Picture in Picture and Fullscreeen API Manager
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org>
 * Copyright (c) 2023 Electroteque Media
 */

class CanvasPipFullscreen extends EventEmitter$1 {

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
            const isIOS = CanvasPipFullscreenUtil.isIOS,
            _pipSupported = CanvasPipFullscreenUtil.pipSupported,
            _webkitSupported = CanvasPipFullscreenUtil.webkitSupported;

            if (_pipSupported) {
                this.initPip();
            }

            //require to add canvas video to dom for any Safari
            this._requiresDom = _webkitSupported;
        
            //if (isIOS && !CanvasPipFullscreenUtil.fullScreenAvailable) {
            if (isIOS && (!CanvasPipFullscreenUtil.fullScreenAvailable || this._forceFs)) {
                this._requiresDom = true;
                this._canvasVideo.setAttribute("webkit-playsinline","");
                this._canvasVideo.setAttribute("playsinline","");
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
        //canvasVideo.setAttribute("webkit-playsinline","");
        //canvasVideo.setAttribute("playsinline","");
    }

    /**
     * Init pip and fullscreen support
     * @param {*} canvas 
     * @param {*} video 
     */
    initPip() {
        this.canvasPip = new CanvasPictureInPicture(this._canvas, this._video, this._canvasVideo);

        const eventCallback = (e, ...args) => {
            this.emit(e.type, args[0], args[1]);
        };

        this.canvasPip.on("enterpictureinpicture", eventCallback)
        .on("leavepictureinpicture", eventCallback)
        .on("failed", eventCallback)
        .on("disabled", eventCallback);

        this.canvasPip.init();
    }

    initFullscreen() {
        const eventCallback = (e, ...args) => {
            this.emit(e.type, args[0], args[1]);
        };

        this.canvasFullScreen = new CanvasFullscreen(this._canvas, this._canvasVideo, this._video);
        this.canvasFullScreen.on('webkitbeginfullscreen', eventCallback)
        .on('webkitendfullscreen', eventCallback)
        .on('fsplay', eventCallback)
        .on('fspause', eventCallback);
    }

    /**
     * Update the video for the pip manager
     */
    set video(video) {
        if (this.canvasPip) this.canvasPip.video = video;
    }

    /**
     * Get the canvas rendering video to add to the dom
     */
    get canvasVideo() {
        return this._canvasVideo;
    }

    /**
     * Toggle
     * @param {*} hasVR in a canvas render state or use normal video pip.
     */
    togglePictureInPicture(hasVR = true) {
        this.canvasPip.togglePictureInPicture(hasVR);
    }

    /**
     * iPhone request fullscreen for canvas support
     */
    requestFullscreen() {
        this.canvasFullScreen && this.canvasFullScreen.requestFullscreen();
    }

    /**
     * Exit iPhone fullscreen
     */
    exitFullscreen() {
        this.canvasFullScreen && this.canvasFullScreen.exitFullscreen();
    }
}

const supportsFrameCallback = 'requestVideoFrameCallback' in HTMLVideoElement.prototype,
requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

let lastTime;

class VideoAnimation {
    constructor(callback, video) {
        this.callback = callback,
        this.video = video,
        this.animationID = null,
        this.running = false;
    }

    setCallback(callback) {
        this.callback = callback;
    }

    async animateLegacy() {
        const now = this.video.currentTime;
        if (now > lastTime){
            (1/(now-lastTime)).toFixed();
            await this.callback(now, { width: this.video.videoWidth, height: this.video.videoHeight });
        }

        lastTime = now;
        this.animationID = requestAnimationFrame(async() => await this.animateLegacy());
    }

    async animate(now, metadata) {
        await this.callback(now, metadata);
        this.video.requestVideoFrameCallback(this.animateRef);
    }

    initAnimate() {
        this.animateRef = async(now, metadata) => await this.animate(now, metadata);
        this.video.requestVideoFrameCallback(this.animateRef);
    }

    initLegacyAnimate() {
        this.animateLegacy();
    }

    start() {
        this.stop();

        if (supportsFrameCallback) {
            this.initAnimate();
        } else {
            lastTime = new Date();
            this.initLegacyAnimate();
        }
        
        this.running = true;
    }

    stop() {
        this.running = false;

        if (supportsFrameCallback) {
            this.animateRef = () => {};
        } else {
            cancelAnimationFrame(this.animationID && this.animationID.data && this.animationID.data.handleId || this.animationID);
        }
    }
}

export { CanvasFullscreen, CanvasPictureInPicture, CanvasPipFullscreen, CanvasPipFullscreenUtil, VideoAnimation };
