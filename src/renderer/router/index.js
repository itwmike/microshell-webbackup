import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/layout',
      name: 'layout',
      meta: {
        showName: '首页',
        menuName: '控制台'
      },
      component: require('@/components/Layout/Index').default,
      children: [
        {
          path: '',
          name: 'layout_monitor',
          meta: {
            showName: '控制台',
            menuName: '控制台'
          },
          component: require('@/components/Monitor/Index').default
        },
        {
          path: 'tasks',
          name: 'layout_tasks',
          meta: {
            showName: '备份计划',
            menuName: '备份计划'
          },
          component: require('@/components/Tasks/Index').default
        },
        {
          path: 'rule',
          name: 'layout_rule',
          meta: {
            showName: '备份规则',
            menuName: '备份计划'
          },
          component: require('@/components/Tasks/Rule').default
        },
        {
          path: 'history',
          name: 'layout_history',
          meta: {
            showName: '备份历史',
            menuName: '备份计划'
          },
          component: require('@/components/Tasks/History').default
        },
        {
          path: 'remote',
          name: 'layout_remote',
          meta: {
            showName: '远程部署',
            menuName: '远程部署'
          },
          component: require('@/components/Remote/Index').default
        },
        {
          path: 'log',
          name: 'layout_log',
          meta: {
            showName: '系统日志',
            menuName: '系统日志'
          },
          component: require('@/components/Log/Index').default
        }
      ]
    },
    {
      path: '/systemInformation',
      name: 'systemInformation',
      component: require('@/components/LandingPage/SystemInformation').default
    },
    {
      path: '/',
      redirect: '/layout'
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.afterEach((to, from) => {
  console.log(to)
  let navData = []
  store.commit('setSelectedMenu', to.meta.menuName)
  to.matched.forEach(item => {
    navData.push({name: item.meta.showName, to: item.path})
  })
  store.commit('setNavData', navData)
})

export default router
