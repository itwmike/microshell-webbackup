<template>
    <div class="connectInfo-container">
        <el-collapse value="1" accordion>
            <el-collapse-item title="FTP 连接配置" name="1">
                <el-form :inline="true" :model="connectInfoForm" class="demo-form-inline" size="mini">
                    <el-form-item label="地址" >
                        <el-input v-model="connectInfoForm.host" placeholder="FTP地址"></el-input>
                    </el-form-item>
                    <el-form-item label="帐号">
                        <el-input v-model="connectInfoForm.name" placeholder="帐号"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="connectInfoForm.password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item label="端口">
                        <el-input v-model="connectInfoForm.port" placeholder="端口"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSave">保存</el-button>
                        <el-button type="primary" @click="onTest">测试连接</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
  import deployStorage from '../../../main/deployStorage'
  import RemoteService from './RemoteService'
  import logStorage from '../../../main/logStorage'

  export default {
    name: 'ConnectInfo',
    data () {
      return {
        connectInfoForm: this.connectInfo
      }
    },
    props: {
      connectInfo: Object
    },
    methods: {
      onSave () {
        deployStorage.updateFtpInfo(this.$store.state.Remote.deployInfo._id, this.connectInfoForm).then(res => {
          this.$store.commit('setFtpInfo', this.connectInfoForm)
          this.$message.success('更新完成')
        }).catch(err => {
          logStorage.error(err.message)
        })
      },
      onTest () {
        RemoteService.testConnect(this.connectInfoForm).then(res => {
          this.$message.success('连接成功')
        }).catch((err) => {
          logStorage.error(err.message)
          this.$message.error('连接失败：' + err.message)
        })
      }
    }
  }
</script>

<style scoped>

</style>
