<template>
    <div :class="$style.list"  ref="control">

        <article  :class="$style.moveTwo" ref="moveTwo" v-show="show">
                <section   :class="$style.left">
                    <ul :class="$style.ul">
                        <li  @mousedown.stop="onClick(19)">上</li>
                        <li  @mousedown.stop="onClick(20)">下</li>
                        <li  @mousedown.stop="onClick(23)">确定</li>
                        <li  @mousedown.stop="onClick(21)">左</li>
                        <li  @mousedown.stop="onClick(22)">右</li>
                    </ul>
                </section >
                <section  :class="$style.right">
                    <ul :class="$style.ul">
                        <li @mousedown.stop="onClick(1)">菜单</li>
                        <li @mousedown.stop="onClick(4)">返回</li> 
                        <!-- <li @click="add(4)">测试</li>     connect           -->
                    </ul>
                </section>
        </article>

        <article :class="$style.moveTwo" ref="moveTwo2" v-show="!show" >
                <section  :class="$style.right">
                    <ul :class="$style.ul2" >
                        <!-- <li :class='$style.recording1'  @click.stop="recording" v-if="!record_id">录制</li> 
                        <li :class='$style.recording2'  @click.stop="recorded" v-if="record_id">停止</li>                          -->
                        <li :class='$style.recording1'  @click.stop="handleRecording" v-if="!record_id">录制</li> 
                        <li :class='$style.recording2'  @click.stop="handleRecorded" v-if="record_id">停止</li>
                        <li :class='$style.pause' @click.stop="pause">停止<br/>播放</li> 
                        <!-- <li @click="add(4)">测试</li>     connect           -->
                    </ul>
                </section>
        </article>

        <!-- <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog> -->

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
    let clientX;
    let clientY;
    let dom = this.$refs.control;
    let moveTwo = this.$refs.moveTwo;
    let moveTwo2 = this.$refs.moveTwo2;
    let control = this.$refs.control

    dom.addEventListener("mousedown", function(e) {
      e.stopPropagation();
      //console.log("moveOne", moveOne);
      //console.log("moveTwo", moveTwo);

      clientX = e.clientX - dom.offsetLeft;
      clientY = e.clientY - dom.offsetTop;
      console.log("点击坐标", clientX, clientY);

      document.onmousemove = function(e) {
        dom.style.left = e.clientX - clientX + "px";
        dom.style.top = e.clientY - clientY + "px";
        
      };

      document.onmouseup = function(e) {
        document.onmousemove = null;
      };
    });
  }
};
</script>


<style module>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */



.disabled {
  background-color: gray;
  border-color: gray;
  cursor: wait;
}
.moveOne {
  border: 1px solid green;
  height: 41px;
  width: 56px;
  border-radius: 20px;
  padding: 5px;
  visibility: hidden;
}
.moveTwo {
  box-sizing: border-box;
  border: 1px solid green;
  border-radius: 20px;
  display: flex;
  position: absolute;
  background-color: floralwhite;
}
.list {
  display: flex;
  position: absolute;
  background-color: floralwhite;
}

.list:hover {
  cursor: pointer;
}
.right {
  width: 150px;
  height: 150px;
}
.left {
  width: 150px;
  height: 150px;
}
.ul2{
  position: relative;
  
}
.ul2 li{
  list-style: none;
  position: absolute;
  border: 1px solid springgreen;
  border-radius: 30%;
}
.ul {
  position: relative;
}
.ul li {
  list-style: none;
  position: absolute;
  font-size: 12px;
  border: 1px solid springgreen;
  border-radius: 30%;
}
/* 未播放的遥控器 .right.ul */
.right .ul li:nth-child(1) {
  color: green;
  left: 39px;
  top:  13px;
  padding: 15px;
}
.right .ul li:nth-child(2) {
  color: green;
  left: 39px;
  top: 81px;
  padding: 15px;
}
/* 播放的遥控器 .right .ul2 */
.right .ul2 li:nth-child(1) {
  color: green;
  left: 40px;
  top:  13px;
  padding: 15px;
}
.right .ul2 li:nth-child(2) {
    color: green;
    left: 40px;
    top: 84px;
    padding: 3px 15px;
}
.recording2{
  background-color: red;
}
/* 上下左右方向 .left  */
.left li:nth-child(1) {
  color: green;
  left: 50px;
  top: 10px;
  padding: 5px 20px;
}
.left li:nth-child(2) {
  color: green;
  left: 50px;
  top: 104px;
  padding: 5px 20px;
}
.left li:nth-child(3) {
  color: green;
  left: 55px;
  top: 55px;
  padding: 5px;
}
.left li:nth-child(4) {
  color: green;
  left: 15px;
  top: 40px;
  padding: 20px 5px;
}
.left li:nth-child(5) {
  color: green;
  left: 110px;
  top: 40px;
  padding: 20px 5px;
}
</style>