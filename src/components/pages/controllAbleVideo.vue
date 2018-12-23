<template>
    <div class="item">
        <section class="player">
            <videoPlayer
                class="vjs-custom-skin" 
                :options="playerOptions"
            >
            </videoPlayer>
         </section>    
    </div>
</template>

<script>
import '../../assets/css/custom-theme.css'
import "video.js/dist/video-js.css";
import "video.js";
import { videoPlayer } from "vue-video-player";
import "videojs-flash";

export default {
  props: {
    play_url: String,
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
        width: 800,
        language: "en",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        techOrder: ["flash"],
        dataSetup: "{}",
        sources: [
          {
            type: "rtmp/mp4",
            src: this.play_url
          }
        ]
      },
    channel_name:'',
    channel_id:0
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
    this.channel_name = sessionStorage.getItem("channel_name");
    this.channel_id = sessionStorage.getItem("channel_id");
    

    console.log("this.play_url", `"${this.play_url}"`);
  },
  components: {
    videoPlayer
  }
};
</script>
<style>
.vjs-control-bar{
  position: relative;
}
.vjs-control-bar .vjs-progress-control{
  visibility: hidden;
}
.vjs-control-bar .vjs-time-divider{
  visibility: hidden;
}
.vjs-control-bar .vjs-duration-display{
  visibility: hidden;  
}
.vjs-control-bar .vjs-current-time{
  position: absolute;
  right: 0.5rem;
}
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

