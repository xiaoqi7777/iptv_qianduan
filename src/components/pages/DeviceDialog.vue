<template>
  <section class="dialog-wrapper">
    <el-dialog :title="device_title" :visible="show" @close="hangleClose">
      <el-form ref="deviceForm" :model="deviceForm" label-width="1rem" :rules="deviceRules">
        <el-form-item prop="name" label="设备名称">
          <el-input v-model="deviceForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="serial_number" label="唯一码串号">
          <el-input v-model="deviceForm.serial_number"></el-input>
        </el-form-item>
        <el-form-item prop="serial_type" label="唯一设备号">
          <el-input v-model="deviceForm.serial_type"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="设备描述">
          <el-input type="textarea" :rows="4" v-model="deviceForm.description"></el-input>
        </el-form-item>
        <el-form-item prop="disabled" label="是否禁用">
          <el-switch v-model="deviceForm.disabled"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveHandle">保存</el-button>
          <el-button v-if="device !== null" type="danger" @click="deleteHandle">删除</el-button>
          <el-button @click="hangleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'device_dialog',
    props: ['show', 'device'],
    mounted () {
      if(this.device !== null) {
        this.device_title = '编辑设备'
        this.axio.post(`device/show`, {
          id: this.device
        }).then((response) => {
          if(response.data.ret.code === 0) {
            let responseData = response.data.data[0]
            for(let key of Object.keys(this.deviceForm)) {
              this.deviceForm[key] = responseData[key]
            }
            this.deviceForm.id = responseData.id
          }
        })
      }else {
        this.device_title = '添加设备'
      }
    },
    data () {
      return {
        device_title: '',
        deviceForm: {
          name: '',
          serial_number: '',
          serial_type:'',
          description: '',
          disabled: false
        },
        deviceRules: {
          name: [
            { required: true, message: '请填写设备名称', trigger: 'blur' }
          ],
          serial_number: [
            { required: true, message: '请填写唯一码串号', trigger: 'blur' }
          ]
        },
        fastClick: true
      }
    },
    methods: {
      hangleClose () {
        this.$emit('updateTable')
        this.$emit('update:show', false)
      },

      deleteHandle () {
        const h = this.$createElement;
        this.$msgbox({
          title: '删除设备 ' + this.deviceForm.name,
          message: h('p', null, [
            h('span', null, '此操作会删除该设备下的所有频道，确定删除该设备吗？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '删除中...';
              this.axio.delete(`device/${this.deviceForm.id}`)
              .then((response) => {
                if(response.data.ret.code === 0) {
                  done();
                  instance.confirmButtonLoading = false;
                  this.hangleClose ()
                }else {
                  this.$notify({
                    title: '错误',
                    message: `频道删除失败: ${this.errLanguage(response)}`,
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
          this.$refs.deviceForm.validate((valid) => {
            if(valid) {
              if(this.device !== null) {
                this.axio.put(`device/update`, this.deviceForm).then((response) => {
                  if(response.data.ret.code === 0) {
                    this.$notify({
                      title: '成功',
                      message: '编辑设备成功',
                      type: 'success'
                    });
                    this.hangleClose ()
                  }else {
                    this.$notify({
                      title: '错误',
                      message: `设备编辑成功: ${this.errLanguage(response)}`,
                      type: 'error'
                    });
                  }
                })
              }else {
                this.axio.post(`device/create`, this.deviceForm).then((response) => {
                  if(response.data.ret.code === 0) {
                    this.$notify({
                      title: '成功',
                      message: '添加设备成功',
                      type: 'success'
                    });
                    this.hangleClose ()
                  }else {
                    this.$notify({
                      title: '错误',
                      message: `设备添加失败: ${this.errLanguage(response)}`,
                      type: 'error'
                    });
                  }
                })
              }
            }
          })
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