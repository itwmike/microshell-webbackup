<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'Main'
  }
</script>

<style>
  html,body{
    padding: 0px;
    margin: 0px;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    font-family: '微软雅黑','Microsoft YaHei',Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  }
  #app{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
