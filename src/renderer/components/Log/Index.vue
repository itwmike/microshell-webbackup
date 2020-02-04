<template>
    <div class="log-container">
        <div class="log-header">
            <el-form :inline="true" size="mini" class="demo-form-inline">
                <el-form-item label="日期范围">
                    <el-date-picker
                            v-model="startTime"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm"
                            placeholder="选择日期时间"
                            default-time="00:00:00">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="日志级别">
                    <el-select v-model="level" placeholder="请选择">
                        <el-option
                                v-for="item in levels"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="loadLogs">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table
                :data="logList"
                border
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <p v-text="props.row.data[0]"></p>
                </template>
            </el-table-column>
            <el-table-column
                    prop="startTime"
                    :formatter="dateFormat"
                    label="时间"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="level.levelStr"
                    label="级别"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="data[0]"
                    label="内容">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  import LogService from './LogService'

  export default {
    name: 'Index',
    data () {
      return {
        logList: [],
        startTime: new Date(new Date().toDateString()),
        level: null,
        levels: [{
          value: '',
          label: '全部'
        }, {
          value: 'WARN',
          label: 'WARN'
        }, {
          value: 'ERROR',
          label: 'ERROR'
        }, {
          value: 'INFO',
          label: 'INFO'
        }, {
          value: 'DEBUG',
          label: 'DEBUG'
        }]
      }
    },
    mounted () {
      this.loadLogs()
    },
    methods: {
      dateFormat (row, column) {
        if (!row.startTime) {
          return null
        }
        let t = new Date(row.startTime)
        return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes()
      },
      loadLogs () {
        LogService.getLog(this.startTime, this.level).then(res => {
          this.logList = res
        })
      }
    }
  }
</script>

<style scoped>
    .log-header{
        margin-bottom: 6px;
    }
</style>
