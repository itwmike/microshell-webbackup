<template>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="aside-map">
        <template v-for="item in getNavData">
            <el-breadcrumb-item v-if="item.to" :to="{ path: item.to }">{{item.name}}</el-breadcrumb-item>
            <el-breadcrumb-item v-else>{{item.name}}</el-breadcrumb-item>
        </template>
    </el-breadcrumb>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Navigation',
    computed: {
      ...mapGetters([
        'getNavData'
      ])
    }
  }
</script>

<style scoped>
    .aside-map{
        border-bottom: 1px solid #cccccc;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }
</style>
