<template>
  <section class="demand-wrapper">
    <div class="tool_title">
      <span>点播列表</span>
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
              <el-button size="small" class="table_list_btn table_edit" @click="playMove(scope.row)"></el-button>
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
    <!-- <PlayDialog v-if="play_dialog" :play="playUrl"  :types="`rtmp/mp4`"  :show.sync="play_dialog"></PlayDialog> -->
    </div>
  </section>
</template>

<script>
  import PlayDialog from './PlayDialog.vue'

export default {
  name: 'demand',
  mounted() {
    this.getDemandList ()
    let routeData = this.$route.params.id
    this.serial_number = routeData.serial_number
    this.carrier = routeData.carrier
    this.device_id = routeData.id
    console.log(routeData,this.carrier)
  },
  filters: {
    typeFormate: function (val) {
      switch (val) {
        case '0':
          return '电影'
        break;
        case '1':
          return '电视剧'
        break;
      }
    }
  },

  components:{
    PlayDialog
  },

  data () {
    return {
      filters: {
        programName: '',
        programType: ''
      },
      typeList: [
        {
          label: "全部",
          value: ''
        },
        {
          label: "电影",
          value: '0'
        },
        {
          label: "电视剧",
          value: '1'
        }
      ],
      tableData: [],
      currentPage: 1,
      totalPage: 1,
      play_dialog: false,
      carrier:'',
      serial_number:'',
      device_id:'',
    }
  },
  methods: {
    // 查询点播列表
    getDemandList () {
      let status = false, params = {
          current_page: this.currentPage
        }
        for(let value of Object.values(this.filters)) {
          if(value !== '') {
            status = true;
            break;
          }
        }
        if(status) {
          Object.assign(params, this.filters)
          params.current_page = 1
          params.carrier = this.carrier

          this.axio.post(`vod/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              this.currentPage = 1
              this.totalPage = response.data.data.total
              this.tableData = response.data.data.res
            }
          })
        }else {
          params.current_page = 1
          params.carrier = this.carrier
          this.axio.post(`vod/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              this.totalPage = response.data.data.total
              this.tableData = response.data.data.res
            }
          })
        }
    },

    handleCurrentChange (val) {
      this.currentPage = val
      this.getDemandList ()
    },

    async exchangeUrl(obj){
      let id = obj
      let rs =  await this.axio.post('/vod/play',id)
      console.log('提交地址返回数据',rs)
    }, 

    getDeviceInfo(){
      let params={}
      params.current_page = this.currentPage
      this.axio.post(`device/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              this.totalPage = response.data.data.total
              this.tableData = response.data.data.res
              console.log('*******',this.tableData)
            }
          })
    },

    playMove (item) {

      this.play_dialog = true

      let {contentId,programId,programType,breakPoint,id} = item;
      let obj = {contentId,programId,programType,breakPoint,carrier:this.carrier,id,device_id:this.device_id}

      this.exchangeUrl(obj)

      
      // console.log(obj)
      // if(programType === 0){
      //   console.log('电影')
      // }else if(programType === 1){
      //   console.log('电视剧')
      // }
    },
    io(){
      this.io = socketIo("ws://192.168.1.165:3000", {
        query: { token: `${this.serial_number}`, client_type: "web" }
      });
      this.io.on("error", data => {
        console.log("error------", data);
      });
      this.io.on("connect_error", data => {
        console.log("connect_error------", data);
      });
    }
  },



}
</script>