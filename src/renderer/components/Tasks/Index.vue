<template>
    <div class="taskList-container">
        <div class="taskList-header">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="openAddTask">新增</el-button>
        </div>
        <el-table
                :data="taskList"
                border
                @row-dblclick="handleRowDbClick"
                style="width: 100%">
            <el-table-column label="" width="120">
                <template slot-scope="scope">
                    <el-button icon="el-icon-document-copy"
                            size="mini"
                            @click="handleBack(scope.$index, scope.row)">一键备份</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="_id"
                    label="编号"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="source"
                    label="源目录"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="target"
                    label="目标目录">
            </el-table-column>
            <el-table-column
                    prop="lastBackTime"
                    :formatter="dateFormat"
                    label="最近备份日期"
                    width="150">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit"
                               size="mini"
                            @click="handleEdit(scope.$index, scope.row)"></el-button>
                    <el-button icon="el-icon-delete"
                               size="mini"
                            @click="handleDelete(scope.$index, scope.row)"></el-button>
                    <el-button icon="el-icon-setting"
                               size="mini"
                               @click="handleSetting(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="编辑备份计划" :visible.sync="addTaskVisible" width="450px">
            <el-form :model="addTaskForm" :rules="addTaskRules" ref="addTaskForm" size="mini" label-width="auto">
                <el-form-item label="名称" prop="name">
                    <el-input type="text" v-model="addTaskForm.name" autocomplete="off" placeholder="名称添加后不能修改"></el-input>
                </el-form-item>
                <el-form-item label="源目录" prop="source">
                    <el-input type="text" v-model="addTaskForm.source" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="目标目录" prop="target">
                    <el-input type="text" v-model="addTaskForm.target" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="addTaskVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="addTaskSub">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import taskStorage from '../../../main/taskStorage'
  import backUpService from './BackUpService'
  import logStorage from '../../../main/logStorage'

  export default {
    name: 'Tasks',
    data () {
      return {
        taskList: [],
        addTaskVisible: false,
        addTaskForm: {},
        addTaskRules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          source: [{ required: true, message: '请输入源目录', trigger: 'blur' }],
          target: [{ required: true, message: '请输入目标目录', trigger: 'blur' }]
        }
      }
    },
    mounted () {
      this.loadTaskList()
    },
    methods: {
      dateFormat (row, column) {
        if (!row.lastBackTime) {
          return null
        }
        let t = new Date(row.lastBackTime)
        return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes()
      },
      loadTaskList () {
        taskStorage.getTaskList().then(res => {
          this.taskList = res
        })
      },
      addTaskSub () {
        this.$refs['addTaskForm'].validate().then(() => {
          if (this.addTaskForm._id) {
            return taskStorage.updateTask(this.addTaskForm)
          } else {
            if (this.taskList.findIndex(t => t.name === this.addTaskForm.name) > -1) {
              this.$message.error('已经存在同名的备份计划')
              return Promise.reject(new Error('已经存在同名的备份计划'))
            }
            return taskStorage.insertTask(this.addTaskForm)
          }
        }).then(res => {
          this.addTaskVisible = false
          this.loadTaskList()
        }).catch((Err) => {
          console.log(Err)
        })
      },
      openAddTask () {
        this.addTaskForm = {}
        this.addTaskVisible = true
      },
      handleEdit (rowIndex, row) {
        this.addTaskForm = row
        this.addTaskVisible = true
        if (this.$refs['addTaskForm']) {
          this.$refs['addTaskForm'].clearValidate()
        }
      },
      handleDelete (rowIndex, row) {
        this.$confirm('确认要删除此备份计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return taskStorage.deleteTask(row._id)
        }).then(res => {
          this.$message.success('已删除！')
          this.loadTaskList()
        }).catch((err) => {
          if (err !== 'cancel') {
            logStorage.error(err.message)
            this.$message.error('删除失败！')
          }
        })
      },
      handleSetting (rowIndex, row) {
        this.$router.push({name: 'layout_rule', params: { id: row._id }})
      },
      handleBack (rowIndex, row) {
        const loading = this.$loading({
          lock: true,
          text: '备份中，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        backUpService.back(row).then(() => {
          this.$message.success('备份完成！')
        }).catch((err) => {
          logStorage.error(err.message)
          this.$alert(err.message, '备份失败', {type: 'error'})
        }).finally(() => {
          loading.close()
        })
      },
      handleRowDbClick (row, column, event) {
        this.$router.push({name: 'layout_history', params: { id: row._id }})
      }
    }
  }
</script>

<style scoped>
    .taskList-header{
       margin-bottom: 6px;
    }
</style>
