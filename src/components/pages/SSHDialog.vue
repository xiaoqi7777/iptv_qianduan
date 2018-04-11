<template>
  <section class="dialog-wrapper">
    <el-dialog 
      :title="'远程SSH ' + '  设备名称: ' + device.name + '  设备串号: ' + device.serial_number" 
      custom-class="device_control_transcode devide_ssh" 
      top="5vh"
      :before-close="sshClose" 
      :visible="show" 
      :close-on-click-modal="false" 
      :close-on-press-escape="false">
      <div id="terminal"></div>
    </el-dialog>
  </section>
</template>

<script>
  export default {
    name: 'ssh',
    props: ['show', 'device'],
    mounted () {
      if (process.env.NODE_ENV == 'development') {
        this.Rsh = run_rsh('terminal', 'http://192.168.1.170:3000', 'localhost', 22, 'root', this.device.serial_number, this.device.id);
      }else {
        this.Rsh = run_rsh('terminal', window.location.protocol + '//' + window.location.host, 'localhost', 22, 'root', this.device.serial_number, this.device.id);
      }
    },
    data () {
      return {
        Rsh: null
      }
    },
    methods: {
      sshClose () {
        if (this.Rsh) {
          this.Rsh.close()
        }
        this.$emit('update:show', false)
      }
    }

  }
</script> 

<style scoped>
  #terminal {
    position: relative;
    height: 663px;
  }
</style>