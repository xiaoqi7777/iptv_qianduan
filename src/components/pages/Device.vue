<template>
  <section class="device-wrapper">
    <div class="tool_title">
        <span>设备列表</span>
        <el-button class="device_toolbtn device_add" @click="getAdd"></el-button>
    </div>
    <div>
			<el-form :inline="true" ref="filters" class="demo-form-inline toolbar" :model="filters">
        <el-form-item>
            <el-input v-model="filters.name" placeholder="设备名称"></el-input>
          </el-form-item>
				<el-form-item>
					<el-input v-model="filters.serial_number" placeholder="唯一串码"></el-input>
				</el-form-item>
        <el-form-item>
          <el-select v-model="filters.status" placeholder="设备状态">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
				<el-form-item>
					<el-button class="device_toolbtn device_search"  @click="getDeviceList"></el-button>
				</el-form-item>
			</el-form>
		</div>
    <div class="table_wrapper">
      <el-table
            :data="tableData"
            stripe
            class="table_list">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="top" v-if="scope.row.description" class="device-description">
                  <el-form-item label="设备描述">
                    <div class="description-wrapper">{{scope.row.description}}</div>
                  </el-form-item>
                </el-form>
                <div class="expand-empty" v-else>暂无更多信息</div>
              </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="设备名称"
            align="center"
            :resizable="false"
            width="200">
            </el-table-column>
            <el-table-column
            prop="serial_number"
            label="唯一码串号"
            align="center"
            :resizable="false"
            width="200">
            </el-table-column>
            <el-table-column
            prop="status"
            label="设备状态"
            align="center"
            :resizable="false"
            >
              <template slot-scope="scope">
                <div class="status_css" :class="{'status_css_red': scope.row.status == 'offline'}">
                </div>
              </template>
            </el-table-column>
            <el-table-column
            label="操作"
            align="right"
            header-align="center"
            :resizable="false"
            width="280">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="监看" placement="top-start" >
                  <el-button
                  size="small"
                  class="table_list_btn " :class="scope.row.status==='offline'?'control':'controlL'"
                  :disabled="scope.row.status==='offline'?'disabled':null"
                  @click="dialogVisibles(true,scope.row)"
                  ></el-button>
                </el-tooltip>
<!-- :class="scope.row.status==='offline'?'control':'controlL'" -->
                <el-tooltip class="item" effect="dark" content="录制列表" placement="top-start">
                  <el-button
                  size="small"
                  class="table_list_btn device_dibblingList"
                  @click="goDibblingList(scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="直播列表" placement="top-start">
                  <el-button
                  size="small"
                  :disabled="scope.row.status === 'offline'"
                  class="table_list_btn device_channelList"
                  @click="goChannelList(scope.row.id)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <el-button size="small" class="table_list_btn table_edit" @click="getEdit(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="远程ssh" placement="top-start">
                  <el-button size="small" class="table_list_btn device_ssh" :disabled="scope.row.status === 'offline'"  @click="goSSH(scope.row)"></el-button>
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

        <el-dialog
          :title="`终端设备：${nameId}`"
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          @close="close"          
          width="688px"
          :before-close="handleClose" >
          <section>
              <Home v-if='isShow' ref="play" :id='id'/>
          </section>
        </el-dialog>

    </div>
    <DeviceDialog :device="device_id" v-if="dialogStatus" @updateTable="updateHandle" :show.sync="dialogStatus"></DeviceDialog>
    <SSHDialog :device="device" v-if="sshDialog" :show.sync="sshDialog"></SSHDialog>
  </section>
</template>


<script>
  import DeviceDialog from './DeviceDialog.vue'
  import SSHDialog from './SSHDialog.vue'
  import Home from './home'
  export default {
    name: 'device',
    components: {
      DeviceDialog,
      SSHDialog,
      Home
    },
    mounted () {
      this.getDeviceList ()
    },
    data () {
      return {
        show: true,
        //设备ID
        id:'',
        isShow:false,
        nameId:'',
        dialogVisible:false,
        filters: {
          name: '',
          serial_number: '',
          status: ''
        },
        options: [
          {
            value: '',
            label: '全部'
          },
          {
            value: 'offline',
            label: '离线'
          },
          {
            value: 'online',
            label: '在线'
          }
        ],
        tableData: [],
        totalPage: null,
        currentPage: 1,
        dialogStatus: false,
        device_id: null,
        sshDialog: false,
        device: null,
      }
    },
    methods: {
      close(){
        // 用v-if 关闭 远程控制的设备： 的el-dialog  不然里面的东西还会存在 报错
        this.isShow = false
        //  console.log('ref*****************************ref',this.$refs.play.test1()) 
        console.log('close******************')
      },
      dialogVisibles(boolean,item){
        this.id = item.id
        console.log('打开播放器 打印id',this.id)
        this.isShow = true
        this.dialogVisible = boolean
        this.nameId = item.name
        
      },
      getAdd () {
        this.device_id = null
        this.dialogStatus = true
      },

      getDeviceList () {
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
          this.axio.post(`device/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              this.currentPage = 1
              this.totalPage = response.data.data.total
              this.tableData = response.data.data.res
            }
          })
        }else {
          this.axio.post(`device/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              this.totalPage = response.data.data.total
              this.tableData = response.data.data.res
              console.log('*******',this.tableData)
            }
          })
        }
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      goDibblingList (scope) {
        this.$router.push({
          name: `dibbling`,
          params: {
            id: scope.id,
            device_name: scope.name
          }
        })
      },

      goChannelList (id) {
        this.$router.push({
          path: `channel/${id}`,
        })
      },

      getEdit (id) {
        this.device_id = id
        this.dialogStatus = true
      },

      updateHandle () {
        this.getDeviceList ()
      },

      goSSH (deviceData) {
        this.device = deviceData
        this.sshDialog = true
      },
      //修改当前页
      handleCurrentChange(val) {
        this.currentPage = val
        this.getDeviceList ()
      },
    }
  }
</script>

<style>



/* 处理默认样式 */
  .el-dialog{
    min-width: 1140px !important;
    padding-bottom:0px
  }
  .el-dialog__body {
    padding: 1px 32px  17px;
  }
  .el-dialog__footer{
    padding: 7px;
  }
</style>

<style scoped>

  .description-wrapper {
    line-height: 1.5;
  }

  .device-description > .el-form-item {
    margin-bottom: 0;
  }

  .expand-empty {
    text-align: center;
  }

</style>