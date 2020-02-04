<template>
    <el-menu
            :default-active="getSelectedMenu"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true">
        <el-menu-item index="控制台" :route="{path: '/layout'}">
            <i class="el-icon-menu"></i>
            <span slot="title">控制台</span>
        </el-menu-item>
        <el-menu-item index="备份计划" :route="{path: '/layout/tasks'}">
            <i class="iconfont microshell-icongroup23copy"></i>
            <span slot="title">备份计划</span>
        </el-menu-item>
        <el-menu-item index="远程部署" :route="{path: '/layout/remote'}">
            <i class="iconfont microshell-iconicon-test"></i>
            <span slot="title">远程部署</span>
        </el-menu-item>
        <el-menu-item index="系统日志" :route="{path: '/layout/log'}">
            <i class="iconfont microshell-iconccgl-kucunrizhi-4"></i>
            <span slot="title">系统日志</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Aside',
    computed: {
      ...mapGetters([
        'getSelectedMenu'
      ])
    }
  }
</script>

<style scoped>
    .el-menu{
        border-right: 0px;
    }
    .el-menu-item.is-active{
        border-right: 1px solid #ff0000;
    }
</style>
