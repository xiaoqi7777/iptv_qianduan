<template>
    <div >
        <section >
            <videoPlayer
                :options="playerOptions"
            >
            </videoPlayer>
         </section>    
    </div>
</template>

<script>
import "video.js/dist/video-js.css";
import "video.js";
import { videoPlayer } from "vue-video-player";
import "videojs-flash";

export default {
  props: {
    play_url: String,
    text: String
  },
  data() {
    return {
      controls: true,
      preload: "metadata",
      reset: true,
      playerOptions: {
        autoplay:true,
        muted: true,
        height: 450,
        width: 600,
        language: "en",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        techOrder: ["flash"],
        poster: "/static/images/author.jpg",
        dataSetup: "{}",
        sources: [
          {
            type: "rtmp/mp4",
            src: this.play_url
          }
        ]
      }
    };
  },
  beforeDestroy(){
    console.log('播放器关闭了播放器关闭了播放器关闭了播放器关闭了播放器关闭了播放器关闭了播放器关闭了')
  },
  mounted() {
    // Object.assign(this.playerOptions, {
    //     sources: [{
    //     type: this.types,
    //     src: this.play.play_url
    //     }]
    // })

    console.log("video");
    console.log("this", this);
    console.log("this", `"${this.play_url}"`);
  },
  components: {
    videoPlayer
  }
};
</script>
<style>
.video-js .vjs-big-play-button {
  border-color: green;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
</style>


<style scoped>
.btn {
  width: 130px;
  height: 130px;
}
</style>