<template>
    <div class="footer-container">暗夜出品，必属精品！版权所有：<a @click="openSite('https://www.limitcode.com/')" href="javascript:;">极限编程网</a></div>
</template>

<script>
  export default {
    name: 'Footer',
    methods: {
      openSite (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style scoped>
    .footer-container{
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        color: #cccccc;
    }
    .footer-container a{
        text-decoration: none;
    }
</style>
