<template>
  <section class="channel-wrapper">
    <div class="tool_title">
      <span>频道列表</span>
      <el-button class="device_toolbtn tool_back" type="primary" round @click="goBack">返回</el-button>
    </div>
    <div>
			<el-form :inline="true" ref="filters" class="demo-form-inline toolbar" :model="filters">
          <el-form-item>
            <el-input v-model="filters.channel_name" placeholder="频道名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.u_channel_id" placeholder="频道号"></el-input>
          </el-form-item>
          <el-form-item class="jiemu">
            {{channelName?`正在播放节目:${channelName}`:'暂无播放节目'}} --
            {{channelTotal?`节目总数:${channelTotal}`:'0'}}
          </el-form-item>
          
				<el-form-item>
					<el-button class="device_toolbtn device_search" @click="getChannelList"></el-button>
				</el-form-item>
			</el-form>
		</div>
    <div class="table_wrapper">
        <ul class="channel">
          <li  v-for="(item,index) in tableData" :key="index">
            <ChannelList :item='item' @showStatus='showStatus' @changPuase ='puaseStatus' @startPlay='startPlay' :shuaixin='shuaixin' :aloneShow='aloneShow' :pauseRecording='pauseRecording' />
          </li>
        </ul>
      <el-table 
        :data="tableData"
        stripe 
        class="table_list">
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        layout="prev, pager, next"
        :page-size = '65'
        :total="totalPage"
        >
      </el-pagination>

    </div>
    <PlayDialog v-if="play_dialog" :play="play_value"  :types="`rtmp/mp4`"  :show.sync="play_dialog"></PlayDialog>
  </section>
</template>

<script>
import PlayDialog from "./PlayDialog.vue";
import ChannelList from "./ChannelList.vue";
import socketIo from "socket.io-client";
export default {
  name: "channel",
  destroyed() {
    clearTimeout(this.timeoutInterval);
  },
  mounted() {
    this.serial_number = this.$route.params.serial_number;
    let self = this;
    self.getChannelList();
    self.filters.status = "";
    self.getChannelList();
    this.initIo();
  },
  components: {
    PlayDialog,
    ChannelList
  },
  filters: {
    timeR: function(value) {
      if (!value) return "";
      value = parseInt(value);
      let minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60));
      let second = parseInt((value % (1000 * 60)) / 1000);
      return `${minutes} 分钟 ${second} 秒`;
    }
  },
  data() {
    return {
      isShow: true,
      shuaixin: null,
      filters: {
        channel_name: "",
        u_channel_id: "",
        status: ""
      },
      channelName: "",
      channelTotal: null,
      tableData: [],
      limit: 65,
      currentPage: 1,
      totalPage: null,
      play_dialog: false,
      play_value: {},
      aloneShow: "",
      pauseRecording: null,
      serial_number: null
    };
  },
  beforeDestroy() {
    this.io.close();
  },
  methods: {
    initIo() {
      this.io = socketIo("ws://47.96.129.127:3000", {
        query: { token: `${this.serial_number}`, client_type: "web" }
      });
      this.io.on("error", data => {
        console.log("error------", data);
      });
      this.io.on("connect_error", data => {
        console.log("connect_error------", data);
      });
      this.io.on("record_stoped", data => {
        this.pauseRecording = data.record_id;
        this.$message({
          message: "录制时间已到",
          type: "warning"
        });
      });
    },
    startPlay(data1, data2) {
      if (data2 && data1) {
        this.channelName = data2 + "--" + data1;
      } else {
        this.channelName = "暂无播放";
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    showStatus(data) {
      this.aloneShow = data;
    },
    puaseStatus() {
      this.aloneShow = "";
    },
    // 获取当前的节目列表
    getChannelList() {
      let self = this;
      let params = {
        current_page: this.currentPage,
        device_id: parseInt(this.$route.params.id),
        limit: this.limit
      };
      if (this.filters.channel_name || this.filters.u_channel_id) {
        Object.assign(params, this.filters);
        params.current_page = 1;
      }

      this.axio.post(`channel/list`, params).then(response => {
        if (response.data.ret.code === 0) {
          this.channelTotal = response.data.data && response.data.data.total;
          let a = response.data.data.res;
          let resposneData = response.data.data;
          this.totalPage = resposneData.total;
          this.tableData = resposneData.res;
          this.tableData.forEach((item, index) => {
            let data = "00" + (index + 1 + (this.currentPage - 1) * this.limit);
            this.tableData[index]["index"] = data.slice(
              data.length - 3,
              data.length
            );
          });
        }
      });
    },

    stopChannel(scope) {
      if (scope.record_id !== null) {
        this.$alert("请先停止录制后，再停止频道", "", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return false;
      }
      const h = this.$createElement;
      this.$msgbox({
        title: "停止频道",
        message: h("p", null, [
          h("span", null, `确定停止频道${scope.name}吗？`)
        ]),
        showCancelButton: true,
        confirmButtonText: "停止",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "停止中...";
            this.axio
              .put(`channel/stop`, {
                channel_url: scope.channel_url,
                device_id: parseInt(scope.device_id),
                channel_name: scope.name
              })
              .then(response => {
                done();
                instance.confirmButtonLoading = false;
                if (response.data.ret.code === 0) {
                  this.getChannelList();
                  this.$notify({
                    type: "success",
                    message: "频道已关闭"
                  });
                } else {
                  this.$notify({
                    type: "error",
                    message: `频道关闭失败: ${this.errLanguage(response)}`
                  });
                }
              })
              .catch(err => {
                done();
                instance.confirmButtonLoading = false;
              });
          } else {
            done();
          }
        }
      }).then(action => {});
    },

    playChannel(value) {
      this.play_value = value;
      this.play_dialog = true;
    },

    goDibbling(value) {
      this.$router.push({
        name: `dibbling`,
        params: {
          id: value.device_id,
          channel_name: value.name,
          device_name: value.device_name || ""
        }
      });
    },

    startChannel(scope) {
      const h = this.$createElement;
      this.$msgbox({
        title: "启动频道",
        message: h("p", null, [
          h("span", null, `确定启动频道${scope.name}吗？`)
        ]),
        showCancelButton: true,
        confirmButtonText: "启动",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "启动中...";
            this.axio
              .post(`channel/start`, {
                channel_url: scope.channel_url,
                device_id: parseInt(scope.device_id),
                channel_name: scope.name
              })
              .then(response => {
                done();
                instance.confirmButtonLoading = false;
                if (response.data.ret.code === 0) {
                  this.getChannelList();
                  this.$notify({
                    type: "success",
                    message: "频道已启动"
                  });
                } else {
                  this.$notify({
                    type: "error",
                    message: `频道启动失败: ${this.errLanguage(response)}`
                  });
                }
              })
              .catch(err => {
                done();
                instance.confirmButtonLoading = false;
              });
          } else {
            done();
          }
        }
      }).then(action => {});
    },

    startRecord(scope) {
      const h = this.$createElement;
      this.$msgbox({
        title: "启动录制",
        message: h("p", null, [
          h("p", null, `目前单个录制时长是20分钟,`),
          h("span", null, `确定启动录制频道${scope.name}吗？`)
        ]),
        showCancelButton: true,
        confirmButtonText: "启动",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "启动中...";
            this.axio
              .post(`channel/start_record`, {
                input_url: scope.play_url,
                device_id: parseInt(scope.device_id),
                channel_name: scope.name
              })
              .then(response => {
                done();
                instance.confirmButtonLoading = false;
                if (response.data.ret.code === 0) {
                  this.getChannelList();
                  this.$notify({
                    type: "success",
                    message: "频道录制已启动"
                  });
                } else {
                  this.$notify({
                    type: "error",
                    message: `频道录制启动失败: ${this.errLanguage(response)}`
                  });
                }
              })
              .catch(err => {
                done();
                instance.confirmButtonLoading = false;
              });
          } else {
            done();
          }
        }
      }).then(action => {});
    },

    stopRecord(scope) {
      const h = this.$createElement;
      this.$msgbox({
        title: "停止录制",
        message: h("p", null, [
          h("span", null, `确定停止录制频道${scope.name}吗？`)
        ]),
        showCancelButton: true,
        confirmButtonText: "停止",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "停止中...";
            this.axio
              .put(`channel/stop_record`, {
                record_id: scope.record_id,
                channel_name: scope.name
              })
              .then(response => {
                done();
                instance.confirmButtonLoading = false;
                if (response.data.ret.code === 0) {
                  this.getChannelList();
                  this.$notify({
                    type: "success",
                    message: "频道录制已停止"
                  });
                } else {
                  this.$notify({
                    type: "error",
                    message: `频道录制停止失败: ${this.errLanguage(response)}`
                  });
                }
              })
              .catch(err => {
                done();
                instance.confirmButtonLoading = false;
              });
          } else {
            done();
          }
        }
      }).then(action => {});
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.filters.status = "";
      this.getChannelList();
    }
  }
};
</script>

<style scoped>
.channel {
  font-size: 14px;
  background-color: white;
  /* height: 7rem; */
  height: 70vh;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  overflow: auto;
}

.channel_stop {
  background-image: url("../../assets/btn_stop_a.png");
}

.channel_play {
  background-image: url("../../assets/btn_view.png");
  background-color: #409eff !important;
  background-size: 0.3rem;
}

.channel_start {
  background-image: url("../../assets/btn_play_a.png");
}

.record_start {
  background-image: url("../../assets/btn_rc.png");
}

.record_stop {
  background-image: url("../../assets/btn_rc_stop.png");
}
.el-form-item__content {
  font-size: 18px;
  color: #dcdfe6;
}
</style>