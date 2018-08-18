<template>
  <section class="configuration-wrapper">
    <div class="tool_title">
      <span>模板列表</span>
      <el-button class="device_toolbtn device_add" @click="getAdd"></el-button>
    </div>
    <div>
			<el-form :inline="true" ref="filters" class="demo-form-inline toolbar" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="名称"></el-input>
          </el-form-item>
				<el-form-item>
					<el-button class="device_toolbtn device_search" @click="getTemplateList"></el-button>
				</el-form-item>
			</el-form>
		</div>
    <div class="table_wrapper">
      <el-table 
        :data="tableData"
        stripe
        class="table_list">
        <el-table-column 
          prop="name"
          label="模板名称"
          align="center"
          width="340"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column 
          label="模板描述"
          prop="description"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column 
          label="操作"
          align="center"
          width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button size="small" class="table_list_btn table_edit" @click="getEdit(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="scope.row.disabled ? '禁用模板' : '启用模板'" placement="top-start">
              <el-switch class="table_list_btn" @change="changeHandle(scope.row)" style="vertical-align: top; margin-left: 10px;" v-model="scope.row.disabled"></el-switch>
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
    <ConfigurationDialog v-if="dialog_configuration" @updateTable="updateHandle" :configuration="configuration_id" :show.sync="dialog_configuration"></ConfigurationDialog>
  </section>
</template>

<script>

  import ConfigurationDialog from './ConfigurationDialog.vue'

  export default {
    name: 'configuration',
    components: {
      ConfigurationDialog
    },
    mounted () {
      this.getTemplateList ()
    },
    data () {
      return {
        filters: {
          name: ''
        },
        tableData: [],
        dialog_configuration: false,
        configuration_id: null,
        currentPage: 1,
        totalPage: null
      }
    },
    methods: {
      getAdd () {
        this.configuration_id = null
        this.dialog_configuration = true
      },

      getEdit (id) {
        this.configuration_id = id
        this.dialog_configuration = true
      },

      changeHandle (val) {
        const h = this.$createElement;
        this.$msgbox({
          title: `${val.disabled ? '启用' : '禁用'}模板${val.name}`,
          message: h('p', null, [
            h('span', null, `确定${val.disabled ? '启用' : '禁用'}该模板?`)
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = `${val.disabled ? '启用中...' : '禁用中...' }`;
              val.disabled = !val.disabled
              this.axio.put(`template/update`, val)
              .then((response) => {
                if(response.data.ret.code === 0) {
                  done();
                  instance.confirmButtonLoading = false;
                  this.getTemplateList ()
                }else {
                  instance.confirmButtonText = '确定';
                  instance.confirmButtonLoading = false;
                  this.$notify({
                    title: '错误',
                    message: `${val.disabled ? '启用' : '禁用' }失败: ${this.errLanguage(response)}`,
                    type: 'error'
                  });
                }
              })
            } else {
              done();
            }
          }
        }).then(action => {
          this.$notify({
            type: 'success',
            message: `${val.disabled ? '禁用成功' : '启用成功' }`
          })
        }).catch(() => {
          this.getTemplateList ()
        })
      },

      updateHandle () {
        this.getTemplateList ()
      },

      getTemplateList () {
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
          this.axio.post(`template/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              this.currentPage = 1
              this.totalPage = response.data.data.total
              this.tableData = response.data.data.res
              for (let key of this.tableData.keys()) {
                this.tableData[key].disabled = !this.tableData[key].disabled
              }
            }
          })
        }else {
          this.axio.post(`template/list`, params)
          .then((response) => {
            if(response.data.ret.code === 0) {
              this.totalPage = response.data.data.total
              this.tableData = response.data.data.res
              for (let key of this.tableData.keys()) {
                this.tableData[key].disabled = !this.tableData[key].disabled
              }
            }
          })
        }
      },

      handleCurrentChange (val) {
        this.currentPage = val
        this.getTemplateList ()
      }

    }
  }
</script>