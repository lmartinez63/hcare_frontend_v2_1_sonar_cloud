import { dataResponseService } from '../../_services'
import router from '../../../router'

export default {
  getBrowseData ({ dispatch, commit }, { requestPage, processName, dataContent, vueInstance }) {
    commit('pendingRequest')
    // TODO need to change  to get Content
    // dataResponseService.getContent( requestPage, processName, dataContent  )
    dataResponseService.getBrowseData(requestPage, processName, dataContent, vueInstance)
      .then(
        content => {
          commit('getBrowseDataSuccess', content, vueInstance)
        },
        error => {
          commit('failureDetected', error)
          dispatch('alert/error', error, { root: true })
        }
      )
  }
}
