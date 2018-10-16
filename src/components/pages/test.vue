<template>
  <div class="channelList">
      <span class="listTitle">
       {{item.index}} {{item.name}} 
      </span>
      <section class="sec">
 
        <!-- 开启 显示 -->
        <span v-show="!isShow" @click="playShow"><img src="../../assets/disabledPlay.png" alt=""> </span>
        
        <!-- 停止 关闭 -->
        <span v-show="isShow" @click="pause"><img src="../../assets/2.png" alt=""></span> 
        <span v-show="isShow" class="span">
            <span v-show="true" @click="play"><img src="../../assets/play.png" alt=""></span>  
            <img v-show="isRecording" @click="StopRecording" src="../../assets/btn_rc_stop.png" alt="">
            <img v-show="!isRecording" @click="starRecording" src="../../assets/btn_rc.png" alt="">
          </span>  
      </section>
      <load v-if="isLoad" :show.sync='isLoad' />
      <PlayDialog v-if="isPlay" :play="playUrl" :types="`rtmp/mp4`" :show.sync="isPlay" :name='item.name'></PlayDialog>
  </div>
</template>

<script>
  import Load from './load1.vue'
  import PlayDialog from './PlayDialog.vue'
  export default {
    props:['item','aloneShow','shuaixin','pauseRecording'],
    data(){
      return{
        isShow:false,
        isRecording:false,
        device_id:this.item.device_id,
        channelUrl:this.item.channel_url,
        channel_name:this.item.name,
        channel_id:this.item.id,
        //开启录制获取的ID
        record_id:this.item.record_id,
        playUrl:this.item.play_url,
        taskId:this.item.task_id,
        isPlay:false,
        setTime:'',
        isLoad:false,
      }
    },
    components:{
      Load,
      PlayDialog
    },
    watch:{
      'item.name'(){
        console.log('this.aloneShow',this.item)
        this.device_id=this.item.device_id
        this.channelUrl=this.item.channel_url
        this.channel_name=this.item.name
        this.channel_id=this.item.id
        //开启录制获取的ID
        this.record_id=this.item.record_id
        this.playUrl=this.item.play_url
        this.taskId=this.item.task_id
        if(this.aloneShow ==this.item.name){
          this.playUrl = this.item.play_url
          this.record_id = this.item.record_id
          console.log('jin...',this.item.task_id)
          if(this.record_id){
            this.isRecording = true
          }else{
            this.isRecording = false
          }
          this.isShow = true
        }else{
          this.isShow = false
        }
      },
      'pauseRecording'(){
        if(this.pauseRecording === this.record_id){
          console.log('开启录制++++++++++++++++++++++++++',this.pauseRecording)
          this.isRecording = false
        }
      },
      'shuaixin'(){
        
        console.log('---111--s',this.aloneShow)
          // this.isShow = false

        if(!this.playUrl){
          console.log('走上',this.item.name)
          this.isShow = false
                   this.$emit('showStatus',this.item.name)
          this.$emit('changPuase')
        }else{  
          console.log('走下',this.item.name)
         this.$emit('showStatus',this.item.name)
        }
        // if(!this.playUrl){
        //     console.log('jige',aloneShow)
        // }
      },
    },
    update(){
      console.log('updata')
    },
    mounted(){
      if(this.taskId){
        console.log('taskId------------',this.taskId)
        this.isShow = true
        this.$emit('showStatus',this.item.name)
        this.$emit('startPlay',this.channel_name,this.item.index)
        if(this.record_id){
          console.log('kaiqi------------------')
          this.isRecording = true
        } 
      }
    },
    methods:{
      guanbi(){
        console.log('guanbi')
      },
      playShow(){
        console.log('-----s',this.aloneShow)

        //判断只能显示一个
        if(this.aloneShow){
          this.$message({
              message: '只支持一路播放',
              type: 'warning'
            });
          return
        }
        this.isShow = true
        this.$emit('showStatus',this.item.name)
        //父组件变换组件单独显示,通过this.item.name 识别==》aloneShow
      },
      play(){

        let thz = this
        console.log('record_id',this.record_id)

        if(thz.playUrl){
          if(!thz.isPlay){
                  thz.isPlay = true
              }
          return
        }
        this.isLoad = true
        this.startChannel().then((data)=>{
          if(data.data.ret.code === 0){
           this.getAxios().then(data=>{
             this.isLoad = false
             this.$emit('startPlay',this.channel_name,this.item.index)
             console.log('成功----',data)
                if(!thz.isPlay){
                    thz.isPlay = true
                  }
           },data=>{
             console.log(data)
           })
          }
        }).then(err=>{
          console.log('err',err)
        })
      },
      pause(){
        if(this.isRecording){
          this.$notify({
            title: '警告',
            message: '请先停止录制',
            type: 'warning'
          });
          return
        }

        if(this.playUrl){
          this.isShow = !this.isShow
          this.$emit('changPuase')
          this.$emit('startPlay',null,null)
          this.stopChannel()
        }else{
          this.$emit('startPlay',null,null)
          this.$emit('changPuase')
          this.isShow = !this.isShow
        }
      },
      starRecording(){
        console.log('录制的名字',this.channel_name)
        //切换停止录制
        if(!this.playUrl){
          this.$notify({
            title: '警告',
            message: '节目暂未播放,录制失败',
            type: 'warning'
          });
          return;
        }
        
        let thz = this
        const h = this.$createElement;
        this.$msgbox({
          title: '启动录制',
          message: h('p', null, [
            h('p', null,  `目前单个录制时长是20分钟,`),
            h('span', null,  `确定启动录制频道吗？`),
          ]),
          showCancelButton: true,
          confirmButtonText: '启动',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '启动中...';
              let data = {
                input_url: thz.playUrl,
                device_id: thz.device_id,
                channel_name: thz.channel_name,
                channel_id:this.channel_id
              }

              thz.axio.post(`channel/start_record`, data).then((response) => {
                done();
                instance.confirmButtonLoading = false;
                if(response.data.ret.code === 0) {
                  this.$notify({
                    type: 'success',
                    message: '频道录制已启动' 
                  })

                  this.record_id = response.data.data.record_id
                  this.isRecording = true
                  thz.isPlay = true
                  console.log('开启录制，，，，，，，，，，，，，，，，，，，，，')
                
                }else {
                  this.$notify({
                    type: 'error',
                    message: `频道录制启动失败: ${this.errLanguage(response)}`
                  })
                thz.isPlay = true
                thz.isTrue = false
                }
              }).catch((err) => {
                done();
              })
            } else {
              done();
            }
          }
        }).then(action => {
          
        });
        console.log('starRecording--',this.playUrl)
      },
      StopRecording(){
        //切换开始录制
        console.log('停止的名字',this.channel_name)

        
        let thz = this
        const h = this.$createElement;
        this.$msgbox({
          title: '停止录制',
          message: h('p', null, [
            h('span', null,  `确定停止录制频道吗？`),
          ]),
          showCancelButton: true,
          confirmButtonText: '停止',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '停止中...';
              console.log(thz.record_id,thz.channel_name)
              this.axio.put(`channel/stop_record`, {
                record_id: thz.record_id,
                channel_name: thz.channel_name
              }).then((response) => {
                done();
                instance.confirmButtonLoading = false;
                if(response.data.ret.code === 0) {
                  console.log('thz.isTrue',thz.isTrue)
                  this.isRecording = false
                  this.$notify({
                    type: 'success',
                    message: '频道录制已停止'
                  })
                }else {
                  this.$notify({
                    type: 'error',
                    message: `频道录制停止失败: ${this.errLanguage(response)}`
                  })
                }
              }).catch((err) => {
                done();
                instance.confirmButtonLoading = false;
              })
            } else {
              done();
            }
          }
        }).then(action => {
          
        });
      },

      startChannel(){
        console.log('startChannel--')
      },
      getAxios(){
        console.log('getAxios')
        let thz= this
        let data={
          device_id : this.device_id,
          type : 'live',
          play_url:this.playUrl
        }
        return new Promise((resolve,reject)=>{
          
          let fn = function(){
            thz.axio
              .post("/device/get_current_single_media_task", data)
              .then(function(res) {
                  console.log('res',res)
                if(res.data.data.play_status){
                  console.log('da-------',res.data.data.play_url)
                    clearInterval(thz.setTime)
                    
                    resolve(res.data.data.play_url)
                }else{
                clearInterval(thz.setTime)
                thz.setTime=setInterval(()=>{
                      fn()
                  },1000)
                } 
              })
              .catch(err=>{
                  console.log(err)
              })
          }
          fn()
        })
      },
      startChannel(){
        let data={
          device_id : this.device_id,
          channel_url :this.channelUrl,
          channel_name:this.channel_name
        }
        return new Promise((resolve,reject)=>{
          this.axio.post(`channel/start`, data).then((response) => {
            if(response.data.ret.code ===0){
              this.playUrl = response.data.data.play_url
                console.log('节目开启成功')
               resolve(response)
            }else{
                console.log('节目开启失败')
              reject('失败')
            }
          })
        })
      } ,
      stopChannel(){
        let thz = this
        let data = {
                play_url:this.playUrl,
                channel_url: this.channelUrl,
                device_id: this.device_id,
                channel_name: this.channel_name,
              }
        this.axio.put(`channel/stop`, data).then((response) => {
                // console.log(response)
              thz.playUrl = ''

              })
      },
    }
  }
</script>

<style scoped>
  .channelList{
    width: 250px;
    height: 0.5rem;
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    margin-left: 10px;    
  }
  .listTitle{
    width: 150px;
  }
  .sec{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 150px;
  }
  .span{
    display: flex;
  }
  .listPlay{
    margin-right: 10px;
  }
</style>