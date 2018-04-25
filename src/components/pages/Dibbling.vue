<template>
  <section class="dibbling-wrapper">
    <div class="tool_title">
      <span>点播列表</span>
      <el-button class="device_toolbtn tool_back" type="primary" round @click="goBack">返回</el-button>
    </div>
    <div>
			<el-form :inline="true" ref="filters" class="demo-form-inline toolbar" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="文件名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.user_name" placeholder="录制人"></el-input>
          </el-form-item>
				<el-form-item>
					<el-button class="device_toolbtn device_search" @click="getDibblingList"></el-button>
				</el-form-item>
			</el-form>
		</div>
    <div class="table_wrapper">
      <el-table 
        :data="tableData"
        stripe
        class="table_list">
        <el-table-column 
          prop="file_name"
          label="文件名称"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column 
          prop="user_name"
          label="录制人"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column 
          prop="start_time"
          label="启动时间"
          align="center"
          width="240"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.start_time}}
          </template>
        </el-table-column>
        <el-table-column 
          prop="end_time"
          label="停止时间"
          align="center"
          width="240"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{scope.row.end_time}}
          </template>
        </el-table-column>
        <el-table-column 
          label="操作"
          align="center"
          width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="预览" placement="top-start">
              <el-button size="small" class="table_list_btn channel_play"  @click="playChannel(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button size="small" class="table_list_btn table_delete"  @click="deleteDibbling(scope.row)"></el-button>
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
    <PlayDialog v-if="play_dialog" :play="play_value" :types="`video/mp4`" :show.sync="play_dialog"></PlayDialog>
  </section>
</template>

<script>

  import PlayDialog from './PlayDialog.vue'

  export default {
    name: 'dibbling',
    components: {
      PlayDialog
    },
    mounted () {
      this.getDibblingList ()
    },
    data () {
      return {
        filters: {
          name: '',
          user_name: ''
        },
        tableData: [],
        totalPage: null,
        currentPage: 1,
        play_value: null,
        play_dialog: false
      }
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },

      getDibblingList () {
        let status = false, params = {
          current_page: this.currentPage,
          device_id: this.$route.params.id
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
          this.axio.post(`record/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              this.currentPage = 1
              this.totalPage = response.data.data.total
              this.tableData = response.data.data.res
            }
          })
        }else {
          this.axio.post(`record/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              this.totalPage = response.data.data.total
              this.tableData = response.data.data.res
            }
          })
        }
      },

      //修改当前页
      handleCurrentChange(val) {
        this.currentPage = val
        this.getDibblingList ()
      },

      playChannel (value) {
        this.play_value = {
          play_url: value.play_url,
          name: value.file_name
        }
        this.play_dialog = true
      },

      deleteDibbling (scope) {
        const h = this.$createElement;
        this.$msgbox({
          title: '删除文件 ' + scope.file_name,
          message: h('p', null, [
            h('span', null, '确定删除该文件吗？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '删除中...';
              this.axio.post(`record/delete`, {
                device_id: scope.device_id,
                channel_name: scope.channel_name,
                file_name: scope.file_name
              })
              .then((response) => {
                if(response.data.ret.code === 0) {
                  done();
                  instance.confirmButtonLoading = false;
                  this.getDibblingList ()
                }else {
                  done();
                  instance.confirmButtonLoading = false;
                  this.$notify({
                    title: '错误',
                    message: `文件删除失败: ${this.errLanguage(response)}`,
                    type: 'error'
                  });
                }
              })
            } else {
              done();
              instance.confirmButtonLoading = false;
            }
          }
        }).then(action => {
          this.$notify({
            type: 'success',
            message: '删除成功'
          })
        }).catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>

<style scoped>
  .channel_play {
    background-image: url('../../assets/btn_view.png');
    background-color: #409EFF;
    background-size: .3rem;
  }
</style>