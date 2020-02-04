<template>
    <div>
        <ConnectInfo :connect-info="getFtpInfo"></ConnectInfo>
        <div class="remote-header">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="openAddDeploy">新增部署计划</el-button>
        </div>
        <el-table
                :data="getDeployList | sortDeployList"
                border
                style="width: 100%">
            <el-table-column label="" width="120">
                <template slot-scope="scope">
                    <el-button icon="el-icon-document-copy"
                               size="mini" @click="handleDeploy(scope.$index, scope.row)">一键部署</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="taskId"
                    label="关联备份计划"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="mode"
                    label="备份模式"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="beforeHook"
                    label="部署前钩子"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="afterHook"
                    label="部署后钩子"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="siteDirectory"
                    label="网站目录">
            </el-table-column>
            <el-table-column
                    prop="ftpDirectory"
                    label="FTP 目录">
            </el-table-column>
            <el-table-column
                    prop="lastDeployTime"
                    :formatter="dateFormat"
                    label="最近部署日期"
                    width="130">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit"
                               size="mini"
                               @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-button icon="el-icon-delete"
                               size="mini"
                               @click="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="编辑部署计划" :visible.sync="addDeployVisible" width="500px">
            <el-form :model="addDeployForm" :rules="addDeployRules" ref="addDeployForm" size="mini" label-width="auto">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addDeployForm.name" :disabled="!isAdd" autocomplete="off" placeholder="名称添加后不能修改"></el-input>
                </el-form-item>
                <el-form-item label="备份模式">
                    <el-radio-group v-model="addDeployForm.mode">
                        <el-radio label="差异化"></el-radio>
                        <el-radio label="完整"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="网站目录" prop="siteDirectory">
                    <el-input v-model="addDeployForm.siteDirectory" autocomplete="off" placeholder="部署文件将拷贝到此目录下"></el-input>
                </el-form-item>
                <el-form-item label="FTP 目录">
                    <el-input v-model="addDeployForm.ftpDirectory" autocomplete="off" placeholder="请填写FTP的相对目录名称"></el-input>
                </el-form-item>
                <el-form-item label="关联备份计划" prop="taskId">
                    <el-input v-model="addDeployForm.taskId" autocomplete="off" placeholder="请输入备份计划编号"></el-input>
                </el-form-item>
                <el-form-item label="部署前钩子">
                    <el-input v-model="addDeployForm.beforeHook" autocomplete="off" placeholder="请填写部署前要执行的PowerShell脚本名，并放置到 shell 文件夹下"></el-input>
                </el-form-item>
                <el-form-item label="部署后钩子">
                    <el-input v-model="addDeployForm.afterHook" autocomplete="off" placeholder="请填写部署后要执行的PowerShell脚本名，并放置到 shell 文件夹下"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="addDeployVisible = false">取 消</el-button>
                <el-button type="primary" size="mini" @click="addDeploySub">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import ConnectInfo from '@/components/Remote/ConnectInfo'
  import deployStorage from '../../../main/deployStorage'
  import { mapGetters } from 'vuex'
  import RemoteService from './RemoteService'
  import logStorage from '../../../main/logStorage'

  export default {
    name: 'Index',
    data () {
      return {
        addDeployVisible: false,
        addDeployForm: {},
        isAdd: true,
        addDeployRules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          siteDirectory: [{ required: true, message: '请输入网站目录', trigger: 'blur' }],
          taskId: [{ required: true, message: '请输入关联备份计划', trigger: 'blur' }]
        }
      }
    },
    components: {
      ConnectInfo
    },
    mounted () {
      this.loadDeployInfo()
    },
    methods: {
      dateFormat (row, column) {
        if (!row.lastDeployTime) {
          return null
        }
        let t = new Date(row.lastDeployTime)
        return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes()
      },
      loadDeployInfo () {
        deployStorage.getDeployList().then(res => {
          this.$store.commit('setDeployInfo', res[0])
        }).catch(err => {
          logStorage.error(err.message)
        })
      },
      handleEdit (rowIndex, row) {
        this.addDeployVisible = true
        this.addDeployForm = row
        this.isAdd = false
        if (this.$refs['addDeployForm']) {
          this.$refs['addDeployForm'].clearValidate()
        }
      },
      handleDelete (rowIndex, row) {
        deployStorage.deleteDeployPlan(this.$store.state.Remote.deployInfo._id, row).then(res => {
          this.loadDeployInfo()
          this.$message.success('已删除！')
        }).catch((err) => {
          if (err !== 'cancel') {
            logStorage.error(err.message)
            this.$message.error('删除失败！')
          }
        })
      },
      openAddDeploy () {
        this.isAdd = true
        this.addDeployVisible = true
        this.addDeployForm = {mode: '差异化'}
      },
      addDeploySub () {
        this.$refs['addDeployForm'].validate().then(() => {
          if (this.isAdd) {
            if (this.getDeployList.findIndex(t => t.name === this.addDeployForm.name) > -1) {
              this.$message.error('已有同名的部署计划')
              return Promise.reject(new Error('已有同名的部署计划'))
            }
            return deployStorage.insertDeployPlan(this.$store.state.Remote.deployInfo._id, this.addDeployForm)
          } else {
            return deployStorage.updateDeployPlan(this.$store.state.Remote.deployInfo._id, this.addDeployForm)
          }
        }).then(res => {
          this.addDeployVisible = false
          this.loadDeployInfo()
          this.$message.success('添加完成')
        }).catch(err => {
          logStorage.error(err.message)
          console.log(err)
        })
      },
      handleDeploy (rowIndex, row) {
        const loading = this.$loading({
          lock: true,
          text: '部署中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        RemoteService.deploy(this.$store.state.Remote.deployInfo._id, this.getFtpInfo, row).then(res => {
          this.$message.success('部署完成')
          console.log('部署完成：' + res)
          this.loadDeployInfo()
        }).catch(err => {
          logStorage.error(err.message)
          this.$alert(err.message, '部署失败', {type: 'error'})
        }).finally(() => {
          loading.close()
        })
      }
    },
    computed: {
      ...mapGetters([
        'getFtpInfo',
        'getDeployList'
      ])
    },
    filters: {
      sortDeployList: function (value) {
        let data = JSON.parse(JSON.stringify(value))
        return data.sort((a, b) => {
          return a.sort > b.sort ? 1 : -1
        })
      }
    }
  }
</script>

<style scoped>
    .remote-header{
        padding: 10px 0px;
    }
</style>
