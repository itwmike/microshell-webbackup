const state = {
  deployInfo: {}
}

const mutations = {
  setDeployInfo (state, payload) {
    state.deployInfo = payload
  },
  setFtpInfo (state, payload) {
    state.deployInfo.ftpInfo = payload
  }
}

const actions = {
}

const getters = {
  getFtpInfo (state) {
    return state.deployInfo.ftpInfo || {}
  },
  getDeployList (state) {
    return state.deployInfo.deploys || []
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
