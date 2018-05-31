<template>
    <div :class="$style.list"  ref="control">
        <section  :class="$style.moveOne" ref="moveOne">
                遥控器
        </section>

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
                <section   :class="$style.left">
                    <ul :class="$style.ul">
                        <li :class="$style.disabled" >上</li>
                        <li :class="$style.disabled" >下</li>
                        <li :class="$style.disabled" >确定</li>
                        <li :class="$style.disabled" >左</li>
                        <li :class="$style.disabled" >右</li>
                    </ul>
                </section >
                <section  :class="$style.right">
                    <ul :class="$style.ul2" >
                        <li :class="$style.disabled">菜单</li>
                        <li :class="$style.disabled">返回</li>
                        <transition name="slide-fade">
                          <li :class='$style.recording'  @mousedown.stop="recording">录制</li> 
                        </transition>
                        <li :class='$style.pause' @mousedown.stop="pause">停止<br/>播放</li> 
                        <!-- <li @click="add(4)">测试</li>     connect           -->
                    </ul>
                </section>
        </article>
        <div >

        </div>
    </div>
</template>

<script>
export default {
  props: ["show", "play_url"],
  name: "control",
  methods: {
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
      this.$emit("close");
      this.$root.send(obj);
    },
    recording(){
      console.log('开启录制')
    }
  },
  mounted() {
    let clientX;
    let clientY;
    let dom = this.$refs.control;
    let moveOne = this.$refs.moveOne;
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


        control.style.height = 41+'px'
        control.style.width = 56+'px'
        control.style.margin = 20+'px'
        
        moveOne.style.visibility = "visible";
        moveTwo.style.visibility = "hidden";
        moveTwo2.style.visibility = "hidden";
      };

      document.onmouseup = function(e) {
        document.onmousemove = null;
        moveOne.style.visibility = "hidden";
        moveTwo.style.visibility = "visible";
        moveTwo2.style.visibility = "visible";
      };
    });
  }
};
</script>

<style module>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}



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
  left: 10px;
  top:  13px;
  padding: 15px;
}
.right .ul2 li:nth-child(2) {
  color: green;
  left: 10px;
  top: 81px;
  padding: 15px;
}

.right .ul2 li:nth-child(3) {
  left: 79px;
  color: green;
  top: 17px;
  
  width: 55px;
  height: 55px;
  text-align: center;
  line-height: 55px;
  border-radius: 50%;
  /* padding: 1px 15px; */
}
.right .ul2 li:nth-child(4) {
  left: 75px;
  color: green;
  top: 83px;
  padding: 1px 15px;
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