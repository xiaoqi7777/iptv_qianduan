<template>
  <section class="demand-wrapper">
    <div class="tool_title">
      <span>点播列表</span>
      <el-button class="device_toolbtn tool_back" type="primary" round @click="goBack">返回</el-button>
    </div>
    <div>
			<el-form :inline="true" ref="filters" class="demo-form-inline toolbar" :model="filters">
        <el-form-item>
          <el-input v-model="filters.programName" placeholder="节目名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.programType">
            <el-option v-for="item in typeList" :key="item.value" 
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
        </el-form-item>
				<el-form-item>
					<el-button class="device_toolbtn device_search" @click="getDemandList"></el-button>
				</el-form-item>
			</el-form>
		</div>
    <div class="table_wrapper">
      <el-table 
        :data="tableData"
        stripe
        class="table_list">
        <el-table-column 
          prop="programName"
          label="节目名称"
          align="center"
          width="340"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column 
          prop="programType"
          label="节目类型"
          align="center"
          width="340"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.programType | typeFormate}}
          </template>
        </el-table-column>
        <el-table-column 
          label="最后更新时间"
          prop="updatedAt"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column 
          label="操作"
          align="center"
          width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="播放" placement="top-start">
              <el-button size="small" class="table_list_btn table_operation" @click="playMove(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        layout="prev, pager, next"
        :total="totalPage"
      >
      </el-pagination>
      <LiveLoad v-if="isLoad" :show.sync='isLoad'   />
      <el-dialog
        :title="playName+'---'+'连续剧：'"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-button  v-for="(item,index) in seriesData" :key="index" circle @click="selectedSeriesNum(item)">{{item.newProgramName}}</el-button>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="btnIsOk">确 定</el-button>
        </span>
      </el-dialog>
      <PlayDialog v-if="play_dialog" :play="playUrl" :name='playName' @stopPlay="stopPlayFn" :types="`rtmp/mp4`"  :show.sync="play_dialog"></PlayDialog>
    </div>
  </section>
</template>

<script>
import PlayDialog from "./PlayDialog.vue";
import LiveLoad from "./LiveLoad";
import socketIo from "socket.io-client";
export default {
  name: "demand",
  mounted() {
    //获取路由传递过来的参数
    let routeData = this.$route.params.id;
    this.io = this.$route.params.io;
    this.serial_number = routeData.serial_number;
    this.carrier = routeData.carrier;
    this.device_id = routeData.id;
    //查询点播列表
    this.getDemandList();
    //查询播放状态
    this.mediaStatus();
    //监视播放地址
    this.monitorPlayUrl();
  },
  filters: {
    typeFormate: function(val) {
      switch (val) {
        case "0":
          return "电影";
          break;
        case "1":
          return "电视剧";
          break;
      }
    }
  },

  components: {
    PlayDialog,
    LiveLoad
  },

  data() {
    return {
      filters: {
        programName: "",
        programType: ""
      },
      typeList: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "电影",
          value: "0"
        },
        {
          label: "电视剧",
          value: "1"
        }
      ],
      tableData: [],
      currentPage: 1,
      totalPage: 1,
      play_dialog: false,
      carrier: "",
      serial_number: "",
      device_id: "",
      mediaCode: null,
      play_url: null,
      time: null,
      isLoad: false,
      playUrl: null,
      io: null,
      playName: null,
      frequency: 0,
      dialogVisible: false,
      seriesNumData: [],
      seriesData: []
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    btnIsOk() {
      this.dialogVisible = false;
      let obj = {
        ...this.seriesNumData,
        programName: this.playName,
        id: this.seriesNumData.vodId
      };
      this.playMove(obj);
    },
    selectedSeriesNum(item) {
      this.seriesNumData = item;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    stopPlayFn() {
      let obj = { play_url: this.play_url };
      this.io.emit("stop_single_media", obj);
      this.count = 0;
      this.io.on("stop_single_media_reply", data => {
        this.play_url = null;
        this.playUrl = null;
        this.count++;
        if (this.count == 1) {
          this.io.emit("key_board", {
            value: "back"
          });
          this.$message({
            message: "取消播放",
            type: "success",
            center: true
          });
        }
      });
    },
    // 查询盒子状态
    async playStatus(data) {
      if (data.data && data.data.play_status) {
        this.isLoad = false;
        this.play_dialog = true;
        this.playUrl = this.play_url;
      } else {
        //再次查询
        clearInterval(this.time);
        this.time = setInterval(() => {
          this.mediaStatus();
        }, 1000);
      }
    },

    monitorPlayUrl() {
      if (this.io) {
        this.io.on("single_media_play_url", message => {
          this.play_url = message.play_url;
          this.playName = message.channel_name;
          this.mediaStatus();
        });
      }
    },

    async mediaStatus() {
      let obj = {
        device_id: this.device_id,
        type: "vod"
      };
      let getData = await this.axio.post(
        "/device/get_current_single_media_task",
        obj
      );
      let data = getData.data;
      this.mediaCode = data.ret.code;
      if (data.data) {
        clearInterval(this.time);
        this.play_url = data.data.play_url;
        this.playName = data.data.name;
      }
      //判断1、data.ret.code === 0 同时有播放地址 => 任务
      if (this.mediaCode === 0 && this.play_url) {
        this.playStatus(data);
      }
    },
    // 查询点播列表
    getDemandList() {
      let status = false,
        params = {
          current_page: this.currentPage
        };
      for (let value of Object.values(this.filters)) {
        if (value !== "") {
          status = true;
          break;
        }
      }
      if (status) {
        Object.assign(params, this.filters);
        params.current_page = 1;
        params.carrier = this.carrier;

        this.axio.post(`vod/list`, params).then(response => {
          if (response.data.ret.code === 0) {
            this.currentPage = 1;
            this.totalPage = response.data.data.total;
            this.tableData = response.data.data.res;
          }
        });
      } else {
        params.carrier = this.carrier;
        this.axio.post(`vod/list`, params).then(response => {
          if (response.data.ret.code === 0) {
            this.totalPage = response.data.data.total;
            this.tableData = response.data.data.res;
          }
        });
      }
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDemandList();
    },

    async exchangeUrl(obj) {
      let id = obj;
      await this.axio.post("/vod/play", id);
    },

    getDeviceInfo() {
      let params = {};
      params.current_page = this.currentPage;
      this.axio.post(`device/list`, params).then(response => {
        if (response.data.ret.code === 0) {
          this.totalPage = response.data.data.total;
          this.tableData = response.data.data.res;
        }
      });
    },
    sleep_wait(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    },
    async playMove(item) {
      if (item.programType == 1) {
        this.playName = item.programName;
        let getData = await this.axio.post("/vod/episodes", { id: item.id });
        this.seriesData = getData.data.data;
        if (!this.seriesData[0].seriesNum) {
          this.$message({
            message: "暂时没有播放数据",
            type: "warning",
            center: true
          });
          return;
        }

        this.dialogVisible = true;
        return;
      }
      if (this.play_url) {
        this.$message({
          message: "请先停止播放或者刷新页面",
          type: "warning",
          center: true
        });
        return;
      }
      this.isLoad = true;
      let {
        contentId,
        programId,
        programType,
        breakPoint,
        id,
        programName,
        columnId
      } = item;
      this.playName = programName;
      let obj = {
        contentId,
        programId,
        columnId,
        programType,
        breakPoint: "0",
        programName,
        carrier: this.carrier,
        id,
        device_id: this.device_id
      };
      this.exchangeUrl(obj);
    },

    beforeDestroy() {
      this.io = null;
      clearInterval(this.time);
    }
  }
};
</script>
<style>
.demand-wrapper .el-dialog__footer {
  padding: 10px 20px 20px !important;
}
.el-button.is-circle {
  margin-left: 10px;
}
</style>
