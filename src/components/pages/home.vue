<template>
  <div class="homeHeight">

    <!-- 初次加载中 -->
     <LoadTwo v-show='loadTwoShow' />
    
    <Load v-show='loadShow'/>
   

    <div v-show="!loadTwoShow">
        <div class="hello" v-show='!loadShow'> 
          <div class="videoHeight">
            <canvas id="canvas"  width="800" height="450" v-show="!this.play_url"></canvas>
            <Video  :play_url='play_url' @close='closed' v-if="this.play_url"  />
          </div>
          <div class="controlHeight">
            <Control class="controlPlce" :fristChange='control' :show='test' @close='closed' :pauseRecording='pauseRecording'  :play_url='play_url' :io="io"/>
          </div>
          <!-- <Control :play_url='play_url'/> -->
          <!-- <Control class="controlPlce" :fristChange='control' :show='test' @close='closed' :play_url='play_url'/> -->

          <!-- <button  @click="click1">切换</button>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <button @click='axios'>获取URL地址</button>
          <span @click="test1">测试</span> -->

        </div>
    </div>
      
  </div>
</template>
<script>
import Control from "./control";
import Video from "./video";
import Load from "./load";
import LoadTwo from "./loadTwo";
import socketIo from "socket.io-client";
export default {
  name: "HelloWorld",
  props: ["item"],
  data() {
    return {
      loadShow: false,
      test: false,
      play_url: "",
      play_name: "",
      cs: "1",
      loadTwoShow: true,
      //作用  返回时候 控制init() 里的thz.axios()不执行
      keng: true,
      //截获 播放时候 可以录制 传给Control 一个非空 做判断
      control: "",
      io: null,
      mediaCode: null,
      frequency:0,
      pauseRecording:null

    };
  },
  components: {
    Control,
    Video,
    Load,
    LoadTwo
  },
  watch: {
    play_url: {
      handler: function(val, oldVal) {
        if (val) {
          this.test = false;
        } else {
          this.test = true;
        }
      },
      immediate: true
    }
  },
  methods: {
    //初始化界面init
    init() {
      // this.$root.connect
      var BLANK_IMG =
        "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

      var canvas = document.getElementById("canvas"),
        g = canvas.getContext("2d");
      //获取点击位子
      canvas.onclick = function(e) {
        eventX = e.clientX;
        eventY = e.clientY;
        x = eventX - canvas.offsetLeft;
        y = eventY - canvas.offsetTop;
      };
      document.onclick = function(e) {};
      let thz = this;

      let cvs = document.getElementById("canvas");
      let img = new Image();

      // 监视 获取的图片 或者 single_media_play_url 是否有播放地址
      thz.io.on("img", message => {
        thz.loadTwoShow = false;
        img.src = `data:image/jpeg;base64,${message.value}`;

        let dat = message.date;
        img.onload = function() {
          var ctx = cvs.getContext("2d");
          ctx.drawImage(img, 0, 0, 800, 450);
          console.log("获取到显示->图片");
        };
        this.frequency = 0
        this.io.on("single_media_play_url", message => {
          sessionStorage.removeItem('channel_name');
          console.log('--******-进来了',message)
          let channel_id = message.channel_id;
          let channel_name = message.channel_name;

          let thz = this;
          let id = thz.item.id;
          let testFn = () => {
                  thz.axio
                    .post("/device/get_current_single_media_task", { device_id: id ,type:'vod'  })
                    .then(function(res) {
                      console.log('res---',res)
                      if (res.data.data && res.data.data.play_status) { 
                        sessionStorage.setItem("channel_name", channel_name);
                        sessionStorage.setItem("channel_id", channel_id);
                        sessionStorage.setItem("device_id", thz.item.id);
                        sessionStorage.setItem("input_url", message.play_url);
                        clearInterval(thz.time);
                        thz.loadTwoShow = true;
                        thz.loadShow = false;
                        thz.play_url = message.play_url;

                      } else {
                        clearInterval(thz.time);
                        thz.loadTwoShow = false;
                        thz.loadShow = true;
                        thz.time = setInterval(function() {
                          testFn();
                        },1000);
                      }
                    });
          };
          if(this.frequency === 0){
            testFn()
          }
          this.frequency = 1
        });
      });
      this.io.on("start_task_error", data => {
        console.log("不能播放的错误提示", data.msg);
      });
    },
    test1() {
      console.log("测试成功");
    },

    //找后端 查询 盒子的状态是啥
    mediaStatus() {
      let thz = this;
      let id = thz.item.id;
      // get_current_single_media_task
      // get_single_media_task_status
      thz.axio
        .post("/device/get_current_single_media_task", { device_id: id ,type:'vod' })
        .then(function(res) {
          let data = res.data;
          thz.mediaCode = data.ret.code;
          console.log("查询 盒子的状态", thz.mediaCode);
          if (data.data) {
            thz.play_url = data.data.play_url;
          }
          console.log('---->',thz.mediaCode,thz.play_url)
          //判断1、data.ret.code === 0 有任务
          if (thz.mediaCode === 0 && thz.play_url) {
            thz.recordStatus();
            //判断2、是否可以播放
            if (data.data.play_status) {
              console.log("可以播放---------------------");
              //本地临时存储 设备ID 和 播放地址
              sessionStorage.setItem("input_url", thz.play_url);
              sessionStorage.setItem("device_id", thz.item.id);

              thz.loadTwoShow = false;
              thz.loadShow = false;
              clearInterval(thz.time);
              thz.play_url = data.data.play_url;
            } else {
              //判断3、加载中
              clearInterval(thz.time);
              thz.loadTwoShow = false;
              thz.loadShow = true;
              thz.time = setInterval(function() {
                thz.mediaStatus();
              }, 1000);
            }
          } else {
            //否则没有任务,初始化页面
            thz.init();
          }
        });
    },
    recordStatus() {
      let thz = this;
      let obj = {
        play_url: thz.play_url
      };
      thz.axio
        .post("/channel/get_single_media_status", obj)
        .then(res => {
          // let oldRecord_id = sessionStorage.getItem('record_id')
          let record_id = res.data.record_id;
          let channel_id = res.data.channel_id;
          let channel_name = res.data.channel_name;
          sessionStorage.removeItem('channel_name');
          
          sessionStorage.setItem("channel_name", channel_name);
          sessionStorage.setItem("channel_id", channel_id);

          //record_id 为空  可以录制
          if (!record_id) {
            console.log("第2次录制的channel_id", channel_id);
          } else {
            sessionStorage.setItem("record_id", record_id);
            thz.control = "初始化";
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    //播放器 关闭的子传父
    closed() {
      this.loadTwoShow = true;
      this.keng = false;
      this.play_url = ""
    },
    initIo() {
      this.io = socketIo("ws://47.96.129.127:3000", {
        query: { token: `${this.item.serial_number}`, client_type: "web" }
      });
      this.io.on('error',data=>{
        console.log('error------',data)
      })
      this.io.on('connect_error',data=>{
        console.log('connect_error------',data)
      })
      this.io.on('record_stoped',(data)=>{
          this.pauseRecording = new Date().getTime()

            this.$message({
              message: '录制时间已到',
              type: 'warning'
            });
         })
    }
  },

  beforeDestroy() {
    this.io.close();
    //销毁定时器
    this.time2 = null;
    this.time3 = null;
  },
  mounted() {
    console.log('item++++++++++++++',this.item)
    //查询盒子状态
    this.mediaStatus();
    //canvans初始化
    if (!this.io) {
      this.initIo();
    }
  }
};
</script>


<style scoped>
.homeHeight {
  width: 1077px;
}
.hello {
  position: relative;
  width: 1077px;
  font-size: 0px;
}

.videoHeight {
  display: inline-block;
  width: 800px;
  height: 450px;
  font-size: 14px;
}
.controlHeight {
  display: inline-block;
  font-size: 14px;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
