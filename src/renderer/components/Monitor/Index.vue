<template>
    <div class="monitor-container">
        <el-row>
            <el-col :span="8"><div class="grid-content bg-purple card-panel card-panel-backCounter">
                <div class="card-panel-icon-wrapper">
                    <i class="iconfont microshell-iconcishu"></i>
                </div>
                <div class="card-panel-description">
                    <p class="card-panel-text">备份次数</p>
                    <p class="card-panel-num" v-text="getBackCounter"></p>
                </div>
            </div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple-light card-panel card-panel-space">
                <div class="card-panel-icon-wrapper">
                    <i class="iconfont microshell-iconrongliang"></i>
                </div>
                <div class="card-panel-description">
                    <p class="card-panel-text">占用空间</p>
                    <p class="card-panel-num" v-text="getSizeCounter"></p>
                </div>
            </div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple-light card-panel card-panel-deploy">
                <div class="card-panel-icon-wrapper">
                    <i class="iconfont microshell-iconfabu"></i>
                </div>
                <div class="card-panel-description">
                    <p class="card-panel-text">部署次数</p>
                    <p class="card-panel-num" v-text="deployCounter"></p>
                </div>
            </div></el-col>
        </el-row>
    </div>
</template>

<script>
  import taskStorage from '../../../main/taskStorage'
  import deployStorage from '../../../main/deployStorage'

  export default {
    name: 'Monitor',
    data () {
      return {
        taskList: [],
        deployCounter: 0
      }
    },
    mounted () {
      this.loadTaskList()
      this.loadDeployList()
    },
    methods: {
      loadTaskList () {
        taskStorage.getTaskList().then(res => {
          this.taskList = res
        })
      },
      loadDeployList () {
        deployStorage.getDeployList().then(res => {
          (res[0].deploys || []).forEach(item => {
            this.deployCounter += item.counter
          })
        })
      },
      bytesToSize (bytes) {
        if (bytes === 0) return '0 B'
        let k = 1024
        let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        let i = Math.floor(Math.log(bytes) / Math.log(k))
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
      }
    },
    computed: {
      getBackCounter () {
        let historys = 0
        this.taskList.forEach(task => {
          historys += (task.historys || []).length
        })
        return historys
      },
      getSizeCounter () {
        let size = 0
        this.taskList.forEach(task => {
          (task.historys || []).forEach(history => {
            size += history.size
          })
        })
        return this.bytesToSize(size)
      }
    }
  }
</script>

<style lang="scss" scoped>
    .card-panel{
        box-sizing: border-box;
        height: 108px;
        margin: 16px 6px;
        padding: 10px 16px;
        cursor: pointer;
    }
    .card-panel-icon-wrapper{
        float: left;
        margin: 12px 0 0 14px;
    }
    .card-panel-icon-wrapper i{
        color: #FFF;
        font-size: 48px;
    }
    .card-panel-description{
        float: right;
        text-align: center;
        font-weight: 700;
    }
    .card-panel-text{
        color: #eae8e8;
        font-size: 16px;
        margin-bottom: 0px;
    }
    .card-panel-num{
        margin-top: 8px;
        font-size: 20px;
        color: #FFF;
    }
    .card-panel-backCounter {
        background: #40c9c6;
    }
    .card-panel-space {
        background: #36a3f7;
    }
    .card-panel-deploy{
        background: #34bfa3;
    }
</style>
