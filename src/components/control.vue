<template>
    <div :class="$style.list"  ref="control">

        <article    ref="moveTwo" v-show="show">
                <section   :class="$style.left">
                    <ul :class="$style.ul">
                        <li  @mousedown.stop="onClick(19)">1</li>
                        <li  @mousedown.stop="onClick(20)">2</li>
                        <li  @mousedown.stop="onClick(23)">3</li>
                        <li  @mousedown.stop="onClick(21)">4</li>
                        <li  @mousedown.stop="onClick(22)">5</li>
                    </ul>
                </section >
                <section  :class="$style.right">
                    <ul :class="$style.ul">
                        <li @mousedown.stop="onClick(1)">菜单</li>
                        <li @mousedown.stop="onClick(4)">返回</li> 
                    </ul>
                </section>
        </article>


        <article    ref="moveTwo" v-show="!show">
                <section   :class="$style.left1">
                    <ul :class="$style.ul">
                        <li  >1</li>
                        <li  >2</li>
                        <li  >3</li>
                        <li  >4</li>
                        <li  >5</li>
                    </ul>
                </section >
                <section  :class="$style.right1">
                    <ul :class="$style.ul">
                        <li :class='$style.recording1'  @click.stop="handleRecording" v-if="!record_id">录制</li> 
                        <li :class='$style.recording2'  @click.stop="handleRecorded" v-if="record_id">停止</li>
                        <li :class='$style.pause' @click.stop="pause">停止<br/>播放</li> 
                    </ul>
                </section>
        </article>

        <!-- // <article :class="$style.moveTwo" ref="moveTwo2" v-show="!show" >
        //         <section  :class="$style.right">
        //             <ul :class="$style.ul2" >
        //                 <li :class='$style.recording1'  @click.stop="handleRecording" v-if="!record_id">录制</li> 
        //                 <li :class='$style.recording2'  @click.stop="handleRecorded" v-if="record_id">停止</li>
        //                 <li :class='$style.pause' @click.stop="pause">停止<br/>播放</li> 
        //             </ul>
        //         </section>
        // </article>  -->


    </div>
</template>

<script>
export default {
  props: ["show", "play_url",'fristChange'],
  name: "control",
  data(){
    return{
      channel_name:'',
      channel_id:0,
      isShow:true,
      input_url:'',
      device_id:0,
      record_id:'',
      dialogVisible: false
    }
  },
  watch:{
    // 'fristChange':{
    //     handler:function(a,b){
    //       console.log('1111111111新的',a)
    //       console.log('1111111111老的',b)
          
    //     },
    //     immediate: true
    //   }
    'fristChange':{
      handler:function(){
          console.log('******************************',this.fristChange)
              if(!this.record_id){
                  this.record_id = sessionStorage.getItem("record_id")
              }
              console.log('打开直接播放 录制没有停的情况',this.channel_name,this.channel_id,this.input_url,this.device_id,this.record_id)
          }
    }
  },
  methods: {

    handleRecorded(){
      this.$message({
              message:'录制已停止',
              type: 'success',
              center:true
            });
      this.recorded()
    },
    //ele 弹框
    handleRecording(done) {
        this.$confirm('确认录制？')
          .then(()=> {
            console.log('确认11111111111111录制')  
            this.$message({
              message:'录制已开启',
              type: 'success',
              center:true
            });
            this.recording()
          })
          .catch(() => {
            this.$message({
              message:'录制已取消',
              type: 'success',
              center:true
            });
            console.log('取消了')            
          });
    },
    onReset() {
      console.log("暂停");
    },
    onClick(key_code, e) {
      console.log("ss", key_code);
      //    this.send( key_code)
      this.$root.test_1()
      this.$root.send({ cmd: "key", code: key_code });
    },
   
    pause() {
      console.log('停止播放----------')
        let obj = {
          cmd: "stop_play",
          play_url: this.play_url
        };

        this.$confirm('请确认是否停止录制？')
          .then(()=> {
            //消除本地 存储
            sessionStorage.removeItem('channel_name');
            sessionStorage.removeItem('channel_id');
            sessionStorage.removeItem('input_url');
            sessionStorage.removeItem('device_id');
            this.record_id = ''

            this.$emit("close");
            this.$root.send(obj);
          })
          .catch(() => {
            this.$message({
              message:'取消停止播放',
              type: 'success',
              center:true
            });          
          });



    },

    //开启录制方法
    recording(){
      //获取本地 传递的录制信息
      this.channel_name = sessionStorage.getItem("channel_name");
      this.channel_id =Number(sessionStorage.getItem("channel_id"));
      this.input_url = sessionStorage.getItem("input_url")
      this.device_id = Number(sessionStorage.getItem("device_id"));
      this.record_id = sessionStorage.getItem("record_id")

        let  thz = this
        console.log('第4次录制的channel_id',this.channel_id)
        
        let obj={
                  "channel_id":this.channel_id,
                  "input_url":this.input_url ,
                  "device_id":this.device_id,
                  "channel_name":this.channel_name
                }
          //判断数据不能为空
        if(!this.channel_name&&!this.input_url&&!this.device_id&&!this.channel_name){
          console.log('播放录制 => 数据为空')
          return null
        }
          //调用开启录制接口
          this.axio.post('/channel/start_record',obj)
          .then(res=>{
            console.log('开启录制',res.data)
            if(res.data.ret.code === 0){
              console.log('开启录制成功',res.data.data.record_id)
              thz.record_id = res.data.data.record_id
            }else{
              console.log('开启录制失败',res.data.ret.cn)
            }
         
          })
          .catch(err=>{
            console.log('开启录制失败',err)
          })
        this.isShow = false
    },

    //停止录制
    recorded(){
      let thz = this
      this.channel_name = sessionStorage.getItem("channel_name");
     
      let obj =  {
                    "record_id":this.record_id,
                    "channel_name":this.channel_name
                  }

      console.log('停止录制',obj)
      //判断数据不能为空
      if(!this.record_id&&!this.record_id){
          console.log('停止录制=> 数据为空')
          return null
      }
      //调用停止录制接口
      this.axio.put('/channel/stop_record',obj)
      .then(res=>{
          if(res.data.ret.code === 0){
            console.log('停止录制成功',res.data.ret.cn)
            thz.record_id = ''

          }else{
            console.log('停止录制失败',res.data.ret.cn)            
          }
      })
      .catch(err=>{
        console.log('停止录制失败',err)
      })
    }
  },
 
  mounted() {
    //遥控器的移动
    // let clientX;
    // let clientY;
    // let dom = this.$refs.control;
    // let moveTwo = this.$refs.moveTwo;
    // let moveTwo2 = this.$refs.moveTwo2;
    // let control = this.$refs.control

    // dom.addEventListener("mousedown", function(e) {
    //   e.stopPropagation();
    //   //console.log("moveOne", moveOne);
    //   //console.log("moveTwo", moveTwo);

    //   clientX = e.clientX - dom.offsetLeft;
    //   clientY = e.clientY - dom.offsetTop;
    //   console.log("点击坐标", clientX, clientY);

    //   document.onmousemove = function(e) {
    //     dom.style.left = e.clientX - clientX + "px";
    //     dom.style.top = e.clientY - clientY + "px";
        
    //   };

    //   document.onmouseup = function(e) {
    //     document.onmousemove = null;
    //   };
    // });
  }
};
</script>


<style module>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */


.list {
    position: relative;
    background-image: url(../../assets/images/bg.png) ;
    background-size:contain;
    background-repeat:no-repeat;
    width: 2.8rem;
    height: 4.5rem;
}

.left li{
  position: absolute;
}
/* 上下左右方向 .left  */
.left li:nth-child(1) {
      background-image: url(../../assets/images/icon_up.png) ;
      background-size:contain;
      background-repeat:no-repeat;
      width: 1.1rem;
      height: 0.5rem;
      left: 0.82rem;
      top: 0.86rem;
}

.left li:nth-child(2) {
      background-image: url(../../assets/images/icon_down.png) ;
      background-size:contain;
      background-repeat:no-repeat;
      width: 1.1rem;
      height: 0.5rem;
      left: 0.84rem;
      top: 2.39rem;
      transform:rotate(1deg);
      
}
.left li:nth-child(3) {
      background-image: url(../../assets/images/icon_ok.png) ;
      background-size:contain;
      background-repeat:no-repeat;
      width: 1.1rem;
      height: 1.1rem;
      left: 0.82rem;
      top: 1.33rem;
}
.left li:nth-child(4) {
      background-image: url(../../assets/images/icon_left.png) ;
      background-size:contain;
      background-repeat:no-repeat;
      width: 0.5rem;
      height: 1.1rem;
      left: 0.35rem;
      top: 1.35rem;
      transform:rotate(-2deg);
}
.left li:nth-child(5) {
      background-image: url(../../assets/images/icon_right.png) ;
      background-size:contain;
      background-repeat:no-repeat;
      width: 1.1rem;
      height: 1.1rem;
      right: -0.2rem;
      top: 1.4rem;
      transform:rotate(5deg);
      
}


.right li{
  position: absolute;
}
.right .ul li:nth-child(1) {
      background-image: url(../../assets/images/icon_menu.png) ;
      background-size:contain;
      background-repeat:no-repeat;
      width: 1rem;
      height: 1rem;
      left: 0.35rem;
      bottom: 0rem;
}
.right .ul li:nth-child(2) {
      background-image: url(../../assets/images/icon_back.png) ;
      background-size:contain;
      background-repeat:no-repeat;
      width: 1rem;
      height: 1rem;
      left: 1.5rem;
      bottom: 0rem;
}







.left1 li{
  position: absolute;
}
/* 上下左右方向 .left  */
.left1 li:nth-child(1) {
      background-image: url(../../assets/images/icon_up_d.png) ;
      background-size:contain;
      background-repeat:no-repeat;
      width: 1.1rem;
      height: 0.5rem;
      left: 0.82rem;
      top: 0.86rem;
}

.left1 li:nth-child(2) {
      background-image: url(../../assets/images/icon_down_d.png) ;
      background-size:contain;
      background-repeat:no-repeat;
      width: 1.1rem;
      height: 0.5rem;
      left: 0.84rem;
      top: 2.39rem;
      transform:rotate(1deg);
      
}
.left1 li:nth-child(3) {
      background-image: url(../../assets/images/icon_ok_d.png) ;
      background-size:contain;
      background-repeat:no-repeat;
      width: 1.1rem;
      height: 1.1rem;
      left: 0.82rem;
      top: 1.33rem;
}
.left1 li:nth-child(4) {
      background-image: url(../../assets/images/icon_left_d.png) ;
      background-size:contain;
      background-repeat:no-repeat;
      width: 0.5rem;
      height: 1.1rem;
      left: 0.35rem;
      top: 1.35rem;
      transform:rotate(-2deg);
}
.left1 li:nth-child(5) {
      background-image: url(../../assets/images/icon_right_d.png) ;
      background-size:contain;
      background-repeat:no-repeat;
      width: 1.1rem;
      height: 1.1rem;
      right: -0.2rem;
      top: 1.4rem;
      transform:rotate(5deg);
      
}


.right1 li{
  position: absolute;
}
.right1 .ul2 li:nth-child(1) {
  color: green;
  left: 40px;
  top:  13px;
  padding: 15px;
}
.right1 .ul2 li:nth-child(2) {
    color: green;
    left: 40px;
    top: 84px;
    padding: 3px 15px;
}



</style>