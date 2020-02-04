<template>
    <div class="rule-container">
        <div class="rule-header">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="openAddRule">新增</el-button>
        </div>
        <el-table
                :data="taskData.rules || []"
                border
                style="width: 100%">
            <el-table-column
                    prop="path"
                    label="被忽略目录/文件"
                    >
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button icon="el-icon-delete"
                               size="mini"
                               @click="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="编辑忽略文件" :visible.sync="addRuleVisible" width="450px">
            <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm" size="mini" label-width="auto">
                <el-form-item label="目录/文件" prop="path">
                    <el-input v-model="addRuleForm.path" autocomplete="off" placeholder="请填写被忽略的目录/文件路径【相对路径】"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="addRuleVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="addRuleSub">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import taskStorage from '../../../main/taskStorage'
  import logStorage from '../../../main/logStorage'

  export default {
    name: 'Rule',
    data () {
      return {
        taskData: {},
        addRuleVisible: false,
        addRuleForm: {},
        addRules: {
          path: [{ required: true, message: '请输入被忽略的目录/文件路径', trigger: 'blur' }]
        }
      }
    },
    mounted () {
      this.loadTask()
    },
    methods: {
      loadTask () {
        taskStorage.getTaskById(this.$route.params.id).then(res => {
          this.taskData = res || {}
        }).catch(err => {
          logStorage.error(err.message)
        })
      },
      openAddRule () {
        this.addRuleVisible = true
        this.addRuleForm = {}
      },
      addRuleSub () {
        this.$refs['addRuleForm'].validate().then(() => {
          this.addRuleVisible = false
          return taskStorage.addTaskRule(this.taskData._id, this.addRuleForm)
        }).then(res => {
          this.loadTask()
        }).catch(err => {
          logStorage.error(err.message)
          console.log(err)
        })
      },
      handleDelete (rowIndex, row) {
        taskStorage.deleteRule(this.taskData._id, row).then(res => {
          this.taskData.rules.splice(rowIndex, 1)
          this.$message.success('已删除！')
        }).catch((err) => {
          logStorage.error(err.message)
          this.$message.error('删除失败！')
        })
      }
    }
  }
</script>

<style scoped>
    .rule-header{
        margin-bottom: 6px;
    }
</style>
