<template>
    <el-container class="layout-container">
        <!--<el-header class="layout-header">-->
            <!--<Header></Header>-->
        <!--</el-header>-->
        <el-container>
            <el-aside width="220px" class="layout-aside">
                <Aside></Aside>
            </el-aside>
            <el-container>
                <el-main>
                    <Navigation></Navigation>
                    <router-view></router-view>
                </el-main>
                <el-footer height="30" class="layout-footer">
                    <Footer></Footer>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
  import Aside from '@/components/Layout/Aside'
  import Header from '@/components/Layout/Header'
  import Footer from '@/components/Layout/Footer'
  import Navigation from '@/components/Layout/Navigation'

  export default {
    name: 'Index',
    data: function () {
      return {}
    },
    components: {
      Navigation,
      Footer,
      Header,
      Aside
    },
    methods: {
    }
  }
</script>

<style scoped>
    .layout-container{
        height: 100%;
    }
    .layout-header{
        background-color: #437534;
    }
    .layout-aside{
        background-color: rgb(84, 92, 100);
    }
    .layout-footer{
        border-top: 1px solid #cccccc;
    }
</style>
