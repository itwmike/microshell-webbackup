const state = {
  selectedMenu: '', // 默认选中的菜单,
  navData: [] // 导航地图
}

const mutations = {
  setSelectedMenu (state, payload) {
    state.selectedMenu = payload
  },
  setNavData (state, payload) {
    state.navData = payload
  }
}

const actions = {
}

const getters = {
  getSelectedMenu (state) {
    return state.selectedMenu
  },
  getNavData (state) {
    return state.navData
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
