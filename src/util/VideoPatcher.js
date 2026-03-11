export default class VideoPatcher {

	static patchApi(api, video) {
      

        Object.defineProperty(video, 'duration', {
            get: () => {
                return  api.duration;
            }
        });

   

        Object.defineProperty(video, 'currentTime', {
            get: () => {
                return  api.currentTime;
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

        ['duration', 'currentTime'].forEach((desc) => {
            descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, desc);
            Object.defineProperty(video, desc, descriptor);
        });
    }
}
