<template>
  <section class="dialog-wrapper">
    <el-dialog 
      :title="dialog_title" 
      top="5vh"
      :before-close="configurationClose" 
      :visible="show" 
      :close-on-click-modal="false" 
      :close-on-press-escape="false">
      <el-form ref="cofigurationForm" 
        :model="cofigurationForm" 
        :rules="cofigurationRules" 
        label-width="1rem">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="cofigurationForm.name"></el-input>
        </el-form-item>
        <el-form-item label="模板内容" prop="params">
          <el-input type="textarea" :rows="8" v-model="cofigurationForm.params"></el-input>
        </el-form-item>
        <el-form-item label="模板描述" prop="description">
          <el-input type="textarea" :rows="4" v-model="cofigurationForm.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveHandle">保存</el-button>
          <el-button type="danger"  @click="deleteHandle">删除</el-button>
          <el-button @click="configurationClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'configurationDialog',
    mounted () {
      if(this.configuration !== null) {
        this.dialog_title = '编辑模板'
        this.axio.post(`template/show`, {
          id: this.configuration
        }).then((response) => {
          if(response.data.ret.code === 0) {
            let responseData = response.data.data[0]
            for(let key of Object.keys(this.cofigurationForm)) {
              this.cofigurationForm[key] = responseData[key]
            }
            this.cofigurationForm.id = responseData.id
          }
        })
      }else {
        this.dialog_title = '添加模板'
      }
    },
    props: ['show', 'configuration'],
    data () {
      return {
        dialog_title: '',
        cofigurationForm: {
          name: '',
          params: '',
          description: ''
        },
        cofigurationRules: {
          name: [
            { required: true, message: '请填写模板名称', trigger: 'blur' }
          ],
          params: [
            { required: true, message: '请填写模板名称', trigger: 'blur' }
          ]
        },
        fastClick: true
      }
    },
    methods: {
      configurationClose () {
        this.$emit('updateTable')
        this.$emit('update:show', false)
      },

      deleteHandle () {
        const h = this.$createElement;
        this.$msgbox({
          title: '删除模板 ' + this.cofigurationForm.name,
          message: h('p', null, [
            h('span', null, '确定删除该模板吗？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '删除中...';
              this.axio.delete(`template/${this.cofigurationForm.id}`)
              .then((response) => {
                if(response.data.ret.code === 0) {
                  done();
                  instance.confirmButtonLoading = false;
                  this.configurationClose ()
                }else {
                  this.$notify({
                    title: '错误',
                    message: `模板删除失败: ${this.errLanguage(response)}`,
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
            message: '删除成功'
          })
        }).catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      saveHandle () {
        if(this.fastClick) {
          this.fastClick = false
          setTimeout(() => {
            this.fastClick = true
          }, 2000)
          if(this.configuration !== null) {
            this.axio.put(`template/update`, this.cofigurationForm)
            .then((response) => {
              if(response.data.ret.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '编辑模板成功',
                  type: 'success'
                });
                this.configurationClose ()
              }else {
                this.$notify({
                  title: '错误',
                  message: `模板编辑失败: ${this.errLanguage(response)}`,
                  type: 'error'
                });
              }
            })
          }else {
            this.axio.post(`template/create`, this.cofigurationForm)
            .then((response) => {
              if(response.data.ret.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '添加模板成功',
                  type: 'success'
                });
                this.configurationClose ()
              }else {
                this.$notify({
                  title: '错误',
                  message: `添加模板失败: ${this.errLanguage(response)}`,
                  type: 'error'
                });
              }
            })
          }
        }
      }
    }
  }
</script>

<style scoped>
  .dialog-wrapper {
    text-align: left;
  }
</style>
