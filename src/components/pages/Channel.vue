<template>
  <section class="channel-wrapper">
    <div class="tool_title">
      <span>频道列表</span>
    </div>
    <div>
			<el-form :inline="true" ref="filters" class="demo-form-inline toolbar" :model="filters">
          <el-form-item>
            <el-input v-model="filters.channel_name" placeholder="频道名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.status" placeholder="频道状态">
              <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
				<el-form-item>
					<el-button class="device_toolbtn device_search" @click="getChannelList(true)"></el-button>
				</el-form-item>
			</el-form>
		</div>
    <div class="table_wrapper">
      <el-table 
        :data="tableData"
        stripe
        class="table_list">
        <el-table-column 
          label="频道名称"
          align="center"
          width="120"
          :show-overflow-tooltip="true"
          prop="name">
        </el-table-column>
        <el-table-column 
          label="频道地址"
          align="center"
          prop="channel_url">
        </el-table-column>
        <el-table-column 
          label="频道状态"
          width="100"
          align="center"
          prop="name">
          <template slot-scope="scope">
            <div class="status_css" :class="{'status_css_red': scope.row.play_url === null}">
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          label="操作"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.play_url !== null" class="item" effect="dark" content="播放" placement="top-start">
              <el-button size="small" class="table_list_btn channel_play"  @click="playChannel(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.play_url !== null" class="item" effect="dark" content="停止频道" placement="top-start">
              <el-button size="small" class="table_list_btn channel_stop"  @click="stopChannel(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.play_url === null" class="item" effect="dark" content="启动频道" placement="top-start">
              <el-button size="small" class="table_list_btn channel_start"  @click="startChannel(scope.row)"></el-button>
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
    </div>
    <PlayDialog v-if="play_dialog" :play="play_value" :show.sync="play_dialog"></PlayDialog>
  </section>
</template>

<script>

  import PlayDialog from './PlayDialog.vue'

  export default {
    name: 'channel',
    mounted () {
      this.getChannelList ()
    },
    components: {
      PlayDialog
    },
    data () {
      return {
        filters: {
          channel_name: '',
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
        currentPage: 1,
        totalPage: null,
        play_dialog: false,
        play_value: {}
      }
    },
    methods: {
      getChannelList (status) {
        let self = this, params = {
          current_page: this.currentPage,
          device_id: parseInt(this.$route.params.id)
        }
        if(status) {
          Object.assign(params, this.filters)
          params.current_page = 1
          this.axio.post(`channel/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              let resposneData = response.data.data
              this.currentPage = 1
              this.totalPage = resposneData.total
              this.tableData = resposneData.res
            }
          })
        }else {
          this.axio.post(`channel/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              let resposneData = response.data.data
              this.totalPage = resposneData.total
              this.tableData = resposneData.res
            }
          })
        }
      },

      stopChannel (scope) {
        const h = this.$createElement;
        this.$msgbox({
          title: '停止频道',
          message: h('p', null, [
            h('span', null,  `确定停止频道${scope.name}吗？`),
          ]),
          showCancelButton: true,
          confirmButtonText: '停止',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '停止中...';
              this.axio.put(`channel/stop`, {
                channel_url: scope.channel_url,
                device_id: parseInt(this.$route.params.id),
                channel_name: scope.name
              }).then((response) => {
                done();
                instance.confirmButtonLoading = false;
                if(response.data.ret.code === 0) {
                  this.getChannelList ()
                  this.$notify({
                    type: 'success',
                    message: '频道已关闭'
                  })
                }else {
                  this.$notify({
                    type: 'error',
                    message: `频道关闭失败: ${this.errLanguage(response)}`
                  })
                }
              }).catch((err) => {
                done();
                instance.confirmButtonLoading = false;
              })
            } else {
              done();
            }
          }
        }).then(action => {
          
        });
      },

      playChannel (value) {
        this.play_value = value
        this.play_dialog = true
      },

      startChannel (scope) {
        const h = this.$createElement;
        this.$msgbox({
          title: '启动频道',
          message: h('p', null, [
            h('span', null,  `确定启动频道${scope.name}吗？`),
          ]),
          showCancelButton: true,
          confirmButtonText: '启动',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '启动中...';
              this.axio.post(`channel/start`, {
                channel_url: scope.channel_url,
                device_id: parseInt(this.$route.params.id),
                channel_name: scope.name
              }).then((response) => {
                done();
                instance.confirmButtonLoading = false;
                if(response.data.ret.code === 0) {
                  this.getChannelList ()
                  this.$notify({
                    type: 'success',
                    message: '频道已启动'
                  })
                }else {
                  this.$notify({
                    type: 'error',
                    message: `频道启动失败: ${this.errLanguage(response)}`
                  })
                }
              }).catch((err) => {
                done();
                instance.confirmButtonLoading = false;
              })
            } else {
              done();
            }
          }
        }).then(action => {
          
        });
      },
      
      handleCurrentChange (val) {
        this.currentPage = val
        this.getChannelList ()
      }
    }
  }
</script>

<style scoped>
  .channel_stop {
    background-image: url('../../assets/btn_stop_a.png');
  }

  .channel_play {
    background-image: url('../../assets/btn_play_a.png');
  }

  .channel_start {
    background-image: url('../../assets/btn_play_a.png');
  }
</style>