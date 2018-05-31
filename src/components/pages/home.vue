<template>
  <div>
    <!-- 初次加载中 -->
     <LoadTwo v-show='loadTwoShow' />

    <Load v-show='loadShow'/>
   

    <div v-show="!loadTwoShow">
        <div class="hello" v-show='!loadShow'> 
          <canvas id="canvas" style="border: 1px solid red;" v-show="!this.play_url"></canvas>
          <!-- <Control :play_url='play_url'/> -->
          <Video  :play_url='play_url' @close='closed' v-if="this.play_url"  />
          <br/>
          <Control class="controlPlce" :show='test' @close='closed' :play_url='play_url'/>
          <!-- <button  @click="click1">切换</button>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <button @click='axios'>获取URL地址</button>
          <span @click="test1">测试</span> -->
          <br/><br/><br/><br/><br/>
        </div>
    </div>
      
  </div>
</template>
<script>
import Control from "./control";
import Video from "./video";
import Load from './load';
import LoadTwo from './loadTwo';
export default {
  name: "HelloWorld",
  props:['id'],
  data() {
    return {
      loadShow:false,
      test: false,
      play_url: "",
      cs: "1",
      loadTwoShow:true,
      //作用  返回时候 控制init() 里的thz.axios()不执行
      keng:true,
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
      this.$root.connect
      console.log('页面初始化')
      var BLANK_IMG ="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

      var canvas = document.getElementById("canvas"),
      g = canvas.getContext("2d");
      //获取点击位子
      canvas.onclick = function(e) {
        eventX = e.clientX;
        eventY = e.clientY;
        x = eventX - canvas.offsetLeft;
        y = eventY - canvas.offsetTop;
        console.log("x:" + x + " y:" + y);
      };
      document.onclick = function(e) {
        //console.log('cs',e)
      };
      let thz = this;
      
      this.$root.connect.onmessage = function(message) {
        //websock接收数据
       thz.loadTwoShow = false
        // Object.prototype.toString.call 判断类型
        // console.log('this.keng1号',thz.keng)

        console.log(
          "onmessage111",
          Object.prototype.toString.call(message.data)
        );
        if(Object.prototype.toString.call(message.data).indexOf("String")>0){
          console.log('有数据 String进来了')
            let cmd = JSON.parse(message.data);
            if(cmd.cmd === "stop_play_replay"){
              this.keng = false
              this.play_url = "", 
              console.log('进来了',this.play_url)
              return;            
            }
            console.log('mes**********************sage',cmd)
        }
        
        
        // console.log('mes+++++++++++++++++++sage',cmd)
        // 判断传进来的是否是流或者别的
        if (Object.prototype.toString.call(message.data).indexOf("Blob") > 0) {
          //console.log('Blob') //是流
          thz.keng = true
        // console.log('this.keng2号',thz.keng)
          
          let blob = new Blob([message.data], { type: "image/jpeg" });
          let URL = window.URL || window.webkitURL;
          let img = new Image();
          img.onload = function() {
            // console.log("onload222");
            //console.log(img.width, img.height)
            canvas.width = img.width;
            canvas.height = img.height;
            g.drawImage(img, 0, 0);
            img.onload = null;
            img.src = BLANK_IMG;
            img = null;
            u = null;
            blob = null;
          };
          let u = URL.createObjectURL(blob);
          img.src = u;
        } else {
          // console.log("获取的东西", message);
          // let obj = JSON.parse(message.data);
          // if (obj.cmd == "single_media") {            
          //   console.log("play_url---obj", message.data);
          //   console.log("play_url", obj.play_url);
          //   console.log("play_url", typeof obj.play_url);
          //   switch (obj.cmd) {
          //     case "single_media":
          //       thz.play_url = obj.play_url;
          //       break;
          //     default:
          //       break;
          //   }
          // }
        // console.log('this.keng3号',thz.keng)
          if(thz.keng){
          thz.axios()
          }
        }
      };
    },
    test1(){
      console.log('测试成功')
    },
    //点击时候触发播放 在进行判断 是播放  还是初始化canvans
    axios() {
      let thz = this;
      let id = this.id;
      //找后端 查询 盒子的状态是啥
      this.axio
        .post("/device/get_single_media_task_status", { device_id: id })
        .then(function(res) {
          let data = res.data;
          console.log("res-onmessage", data);
          console.log("URL-onmessage", data.data);
          console.log("data.ret.code-onmessage", data.ret.code);
          //判断1、data.ret.code === 0 有任务
          if (data.ret.code === 0) {
            //判断2、是否可以播放
            if (data.data.play_status) {
              console.log("加载 定时间是什么  true----------onmessage", thz.time);
              thz.loadTwoShow = false
              thz.loadShow = false
              clearInterval(thz.time);
              thz.play_url = data.data.play_url;
            } else {
              //判断3、加载中
              clearInterval(thz.time);
              console.log("加载");
              thz.loadTwoShow = false              
              thz.loadShow = true
              thz.time = setInterval(function() {
                thz.axios();
              }, 1000);
              console.log("加载 定时间是什么 false----------onmessage", thz.time);
            }
          } else {
            //判断4、没有任务
            console.log("正常播放主页面");
            
            thz.init();
            
          }
      //  console.log('页面初次加载 没有定时器',thz.play_url) 
        
        })
        .catch(err => {
          console.log("err", err);
        });

    },
    //测试用
    click1() {
      this.test = !this.test;
      console.log("this.test", this.test);
    },
    //播放器 关闭的子传父 
    closed() {
      console.log("closed触发");
      this.loadTwoShow = true
      this.keng = false
      this.play_url = "", 
      this.init()
      this.$root.send({ cmd: "key", code: 4 });
    }
  },
  created(){

        this.$root.connect = (function(){
          var ws = new WebSocket("ws://192.168.1.192:3002",'minicap');
          ws.binaryType = 'blob'
          console.log('第一次连接*********')
          ws.onopen = function()
          {
            // Web Socket 已连接上，使用 send() 方法发送数据
            ws.send( JSON.stringify({"cmd":"login","type":"web","device_id":6}));
            console.log("数据发送中1...");
          };
          ws.onclose = function() {
            console.log('onclose', arguments)
          }
          ws.onerror = function() {
            console.log('onerror', arguments)
          }
          return ws
        })()

        this.$root.send = function(num){
          let thz =  this.$root.connect
          console.log('num',num)
          thz.send( JSON.stringify(num));       
          console.log("数据发送中2...");
        }
  },
  beforeDestroy(){
    this.time=null
    this.time1=null
    this.time2=null
    this.time3=null
  },
  mounted() {
    //canvans初始化
    //  this.init();
     this.$root.test_1 = this.init
     this.axios()
      //页面初次加载
   
      if(!this.play_url){
            console.log('页面初次加载 有定时器')
              // this.time=setTimeout(() => {
              // this.$root.send({ cmd: "key", code: 22 })
              // }, 10);

              // this.time1=setTimeout(() => {
              // this.$root.send({ cmd: "key", code: 21 })
              // }, 20);

              this.time2=setTimeout(() => {
              this.$root.send({ cmd: "key", code: 20 })
              }, 30);

              this.time3=setTimeout(() => {
              this.$root.send({ cmd: "key", code: 19 })
              }, 40);
          }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.controlPlce{
  bottom: 130px;
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
