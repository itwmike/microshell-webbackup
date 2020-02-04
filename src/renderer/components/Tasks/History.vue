<template>
    <div class="history-container">
        <el-table
                :data="getHistorys"
                border
                style="width: 100%">
            <el-table-column label="">
                <template slot-scope="scope">
                    <el-button icon="iconfont microshell-iconhuanyuan"
                               size="mini"
                               @click="handleReduction(scope.$index, scope.row)">还原此版本</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    :formatter="dateFormat"
                    label="备份日期"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="size"
                    :formatter="bytesToSize"
                    label="大小"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="zipPath"
                    label="路径">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button icon="el-icon-delete"
                               size="mini"
                               @click="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  import taskStorage from '../../../main/taskStorage'
  import backUpService from './BackUpService'
  import logStorage from '../../../main/logStorage'

  export default {
    name: 'History',
    data () {
      return {
        taskData: {}
      }
    },
    mounted () {
      taskStorage.getTaskById(this.$route.params.id).then(res => {
        this.taskData = res || {}
      }).catch(err => {
        logStorage.error(err.message)
      })
    },
    methods: {
      dateFormat (row, column) {
        let t = new Date(row.createTime)
        return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes()
      },
      async handleReduction (rowIndex, row) {
        let result = await this.$confirm('确认要还原此版本?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return true
        }).catch(() => {
          return false
        })
        if (!result) return
        const loading = this.$loading({
          lock: true,
          text: '文件还原中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        backUpService.unPack(row.zipPath, this.taskData.source).then(() => {
          this.$message.success('还原完成！')
        }).catch((err) => {
          logStorage.error(err.message)
          this.$message.error('还原失败！')
        }).finally(() => {
          loading.close()
        })
      },
      bytesToSize (row, column) {
        let bytes = row.size
        if (bytes === 0) return '0 B'
        let k = 1024
        let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        let i = Math.floor(Math.log(bytes) / Math.log(k))
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
      },
      handleDelete (rowIndex, row) {
        this.$confirm('确认要从磁盘删除此备份文件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return taskStorage.deleteHistory(this.taskData._id, row)
        }).then(() => {
          this.taskData.historys.splice(rowIndex, 1)
          this.$message.success('已删除！')
        }).catch((err) => {
          if (err !== 'cancel') {
            logStorage.error(err.message)
            this.$message.error('删除失败！')
          }
        })
      }
    },
    computed: {
      getHistorys () {
        return (this.taskData.historys || []).reverse()
      }
    }
  }
</script>

<style scoped>

</style>
