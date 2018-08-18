<template>
  <section class="dialog-wrapper">
    <el-dialog 
      :title="`${play.name}`" 
      top="5vh"
      :before-close="configurationClose" 
      :visible="show" 
      :close-on-click-modal="false" 
      :close-on-press-escape="false">
      <video-player  class="video-player-box vjs-big-play-centered"
        ref="videoPlayer"
        :options="playerOptions"
        :playsinline="true"
        customEventName="customstatechangedeventname"

        @play="onPlayerPlay($event)"
        @pause="onPlayerPause($event)"
        @statechanged="playerStateChanged($event)"
        @ready="playerReadied">
      </video-player>
    </el-dialog>
  </section>
</template>

<script>

  import 'video.js/dist/video-js.css'
  import {videoPlayer} from 'vue-video-player'
  // import 'videojs-contrib-hls/dist/videojs-contrib-hls.js'
  import 'videojs-flash'

  export default {
    name: 'play',
    props: ['show', 'play', 'types'],
    components: {
      videoPlayer
    },
    mounted () {
      console.log(this.$refs.videoPlayer)
      Object.assign(this.playerOptions, {
        sources: [{
          type: this.types,
          src: this.play.play_url
        }]
      })
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    data () {
      return {
        dialog_title: '',
        playerOptions: {
          // videojs options
          muted: true,
          language: 'en',
          height: '500',
          width: '100%',
          autoplay: true,
          preload: true,
          techOrder: [ 'html5', 'flash'],
        }
      }
    },
    methods: {
      configurationClose () {
        this.$emit('update:show', false)
      },
      // listen event
      onPlayerPlay(player) {
        // console.log('player play!', player)
      },
      onPlayerPause(player) {
        // console.log('player pause!', player)
      },
      // ...player event

      // or listen state event
      playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },

      // player is ready
      playerReadied(player) {
        console.log('the player is readied', player)
        // you can use it to do something...
        // player.[methods]
      }
    }
  }
</script>

<style>
.dialog-wrapper .el-dialog__body{
    padding: 1px 32px 29px;
}
</style>