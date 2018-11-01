<template>
  <div>
      <img :src='url' alt="" type="base64" width="">
      <canvas id="canvas">

      </canvas>
      <!-- <button @click="btn">刷新</button> -->
      <button @click="shang">上</button>
      <button @click="xia">下</button>
      <button @click="zuo">左</button>
      <button @click="you">右</button>
      <button @click="back">Back</button>
      <button @click="enter">Enter</button>

    {{data}}
  </div>
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';
export default {
  data(){
    return{
      url:'',
      io:'',
      data:"",
      n:1
    }
  },
  methods:{
    back(){
      this.get()
      this.io.emit('key_board',{value:'back'});
      console.log('发送事件',this.io)
    },
    shang(){
      this.io.emit('key_board',{value:'shang'})
      this.get()
    },
    xia(){
      this.get()
      this.io.emit('key_board',{value:'xia'})

    },
    zuo(){
      this.get()
      this.io.emit('key_board',{value:'zuo'})

    },
    you(){
      this.io.emit('key_board',{value:'you'})
      this.get()

    },
    enter(){
      this.io.emit('key_board',{value:'enter'})
      this.get()

    },
    
    initIo(){
      this.io =  io("ws://localhost:3002");
      // this.io =  io("ws://192.168.1.184:3002");
    },


    get(){
      this.io.on('img',(data)=>{
        // this.data = data.key
        // console.log(data)
        this.url = `data:image/jpeg;base64,${data.value}`
      })

    }
  },
  mounted() {
    this.initIo()
    this.get();
    // axios.get('http://localhost:9093/123').then((res)=>{
    //   console.log(res)
    // })
    // axios.get('localhost:3001',(res)=>{
    //   console.log('res',res)
    // })
  }
};
</script>

<style modules>

</style>