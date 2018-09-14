<template>
  <div class="div1">
    <section class="layout">
      <div id="mse"></div>
      <button @click="handleClose">关闭</button>
    </section>
  </div>
</template>

<script>
import Player from 'xgplayer';
import FlvJsPlayer from 'xgplayer-flv';
export default {
    props:['playUrl'],
    data() {
      return {
        dialogVisible: false
      };
    },
     
    mounted(){
      console.log('播放地址',this.playUrl,document.querySelector('#mse'))
        const player = new FlvJsPlayer({
            id:'mse',
              url: this.playUrl,
            isLive: true,
            preloadTime: 1,
            minCachedTime: 1,
            cors: true
        })

    },
    methods: {
      handleClose() {
        this.$emit('guanbi')
      },
      btn(){
      
      }
    }
  };
</script>

<style scoped>
.div1{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0; 
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.layout{
  width: 800px;
  height: 600px;
  background: white;
}
</style>