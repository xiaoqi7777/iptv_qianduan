<template>
  <section class="password-wrapper">
    <el-dialog
      title="修改密码"
      :visible="show"
      @close="closeHandle">
      <el-form :model="passwordForm" ref="passwordForm" :rules="passwordRules" label-width="1rem">
        <el-form-item label="原密码" prop="oldpassword">
          <el-input type="password" v-model="passwordForm.oldpassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword">
          <el-input type="password" v-model="passwordForm.newpassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="comfirmpassword">
          <el-input type="password" v-model="passwordForm.comfirmpassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveHandle">保存</el-button>
          <el-button @click="closeHandle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'password',
    props: ['show'],
    data () {
      var confirm_passwordValidator = ( rule, value, callback ) => {
          if (value !== this.passwordForm.newpassword) {
              callback(new Error('两次密码输入不一致'))
          }else {
              callback()
          }
      }
      return {
        passwordForm: {
          oldpassword: '',
          newpassword: '',
          comfirmpassword: ''
        },
        passwordRules: {
          oldpassword: [
            { required: true, message: '请填写原密码', trigger: 'blur' }
          ],
          newpassword: [
            { required: true, message: '请填写新密码', trigger: 'blur' }
          ],
          comfirmpassword: [
            { required: true, message: '请填写确认密码' },
            { validator: confirm_passwordValidator}
          ]
        }
      }
    },
    methods: {
      closeHandle () {
        this.$emit('update:show', false)
      },
      saveHandle () {
        this.$refs.passwordForm.validate((valid) => {
          if(valid) {

          }
        })
      }
    }
  }
</script>