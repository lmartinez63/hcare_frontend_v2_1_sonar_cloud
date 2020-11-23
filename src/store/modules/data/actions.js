import { dataResponseService } from '../../_services'
import router from '../../../router'
import config from 'config'

export default {
  getDialogData ({ dispatch, commit }, { vm, requestPage, processName, dataContent }) {
    commit('general/setLoading', true, { root: true })
    commit('pendingDialogRequest')
    dataResponseService.getContent(requestPage, processName, dataContent)
      .then(
        content => {
          commit('getDialogDataSuccess', content)
          commit('general/setLoading', false, { root: true })
        },
        error => {
          commit('general/setLoading', false, { root: true })
          commit('failureDetected', error)
          dispatch('alert/error', error.message, { root: true })
        }
      )
  },
  getData ({ dispatch, commit }, { vm, requestPage, processName, dataContent, returnRoute }) {
    console.log('data-actions-getData')
    commit('general/setLoading', true, { root: true })
    commit('pendingRequest')
    dataResponseService.getContent(requestPage, processName, dataContent)
      .then(
        content => {
          let selfVm = vm
          commit('general/setLoading', false, { root: true })
          if (returnRoute && returnRoute !== '') {
            if (returnRoute === 'back') {
              router.go(-1)
            } else if (returnRoute === 'reloadPage') {
              router.go()
            } else if (returnRoute === 'goToResultUrl') {
              commit('restoreDataMap')
              commit('restoreMetadata')
              window.open(`${config.backendUrl}${content.dataContent.dataMap.resultUrl}`, '_blank')
            } else {
              setTimeout(() => {
                router.push(returnRoute)
              }, 5000)
            }
          } else {
            commit('getDataSuccess', content)
          }
        },
        error => {
          commit('general/setLoading', false, { root: true })
          commit('failureDetected', error)
          dispatch('alert/error', error.message, { root: true })
        }
      )
  },
  saveDialogEntity ({ dispatch, commit }, { vm, requestPage, processName, dataContent, returnRoute, additionalActions }) {
    return new Promise((resolve, reject) => {
      console.log('data-actions-saveDialogEntity')
      commit('general/setLoading', true, { root: true })
      commit('pendingDialogRequest')
      dataResponseService.getContent(requestPage, processName, dataContent, returnRoute, additionalActions)
        .then(
          content => {
            let selfVm = vm
            commit('general/setLoading', false, { root: true })
            commit('saveDialogEntitySuccess', content)
            dispatch('alert/success', 'Los datos fueron guardados satisfactoriamente', { root: true })
            if (additionalActions && Array.isArray(additionalActions)) {
              for (var i = 0; i < additionalActions.length; i++) {
                console.log('executingAdditionalActions: ' + additionalActions[i])
                eval(additionalActions[i])
              }
            }
            if (returnRoute && returnRoute !== '') {
              if (returnRoute === 'back') {
                router.go(-1)
              } else if (returnRoute === 'reloadPage') {
                router.go()
              } else {
                setTimeout(() => {
                  router.push(returnRoute)
                }, 5000)
              }
            }
            resolve({ status: 200 })
          },
          error => {
            commit('general/setLoading', false, { root: true })
            commit('failureDetected', error)
            dispatch('alert/error', error.message, { root: true })
          }
        )
    })
  },
  saveEntity ({ dispatch, commit }, { vm, requestPage, processName, dataContent, returnRoute, additionalActions }) {
    return new Promise((resolve, reject) => {
      console.log('data-actions-saveEntity')
      commit('general/setLoading', true, { root: true })
      commit('pendingRequest')
      dataResponseService.getContent(requestPage, processName, dataContent, returnRoute, additionalActions)
        .then(
          content => {
            commit('general/setLoading', false, { root: true })
            commit('saveEntitySuccess', content)
            dispatch('alert/success', 'Los datos fueron guardados satisfactoriamente', { root: true })
            if (additionalActions && Array.isArray(additionalActions)) {
              for (var i = 0; i < additionalActions.length; i++) {
                console.log('executingAdditionalActions: ' + additionalActions[i])
                eval(additionalActions[i])
              }
            }
            if (returnRoute && returnRoute !== '') {
              if (returnRoute === 'back') {
                router.go(-1)
              } else if (returnRoute === 'reloadPage') {
                router.go()
              } else {
                setTimeout(() => {
                  router.push(returnRoute)
                }, 5000)
              }
            }

            resolve({ status: 200 })
          },
          error => {
            commit('general/setLoading', false, { root: true })
            commit('failureDetected', error)
            dispatch('alert/error', error.message, { root: true })
          }
        )
    })
  },
  getPatientInfoByDocumentNumberOnMedAppointment ({ dispatch, commit }, { requestPage, processName, dataContent }) {
    commit('general/setLoading', true, { root: true })
    dataResponseService.getContent(requestPage, processName, dataContent)
      .then(
        content => {
          commit('getPatientInfoByDocumentNumberOnMedAppointmentSuccess', content)
          commit('general/setLoading', false, { root: true })
        },
        error => {
          commit('general/setLoading', false, { root: true })
          commit('failureDetected', error)
          dispatch('alert/error', error.message, { root: true })
        }
      )
  },
  getSurgeryAreaListByRequiredDate ({ dispatch, commit }, { requestPage, processName, dataContent }) {
    commit('general/setLoading', true, { root: true })
    dataResponseService.getContent(requestPage, processName, dataContent)
      .then(
        content => {
          commit('getSurgeryAreaListByRequiredDateSuccess', content)
          commit('general/setLoading', false, { root: true })
        },
        error => {
          commit('general/setLoading', false, { root: true })
          commit('failureDetected', error)
          dispatch('alert/error', error.message, { root: true })
        }
      )
  },
  getAvailableDatesOnSurgeryArea ({ dispatch, commit }, { vm, calendarRef, requestPage, processName, dataContent }) {
    commit('general/setLoading', true, { root: true })
    dataResponseService.getContent(requestPage, processName, dataContent)
      .then(
        content => {
          let selfVm = vm
          commit('getAvailableDatesOnSurgeryAreaSuccess', content)
          if (content && content != null && content.dataContent.dataMap.eventGroupList && content.dataContent.dataMap.eventGroupList.length > 0) {
            content.dataContent.dataMap.eventGroupList.forEach(function (event) {
              vm.$refs[calendarRef][0].$emit('render-event', event)
            })
          }
          // vm.$refs[calendarRef][0].$emit('refetch-events',)
          // vm.$refs[calendarRef][0].$emit('rerender-events')
          commit('general/setLoading', false, { root: true })
        },
        error => {
          commit('general/setLoading', false, { root: true })
          commit('failureDetected', error)
          dispatch('alert/error', error.message, { root: true })
        }
      )
  },
  uploadFile ({ dispatch, commit }, { vm, formData }) {
    return new Promise((resolve, reject) => {
      commit('general/setLoading', true, { root: true })
      commit('pendingRequest')
      dataResponseService.uploadAttachment(formData)
        .then(
          content => {
            commit('uploadFileSuccess', content)
            commit('general/setLoading', false, { root: true })
            router.go()
          },
          error => {
            commit('general/setLoading', false, { root: true })
            commit('failureDetected', error)
            dispatch('alert/error', error.message, { root: true })
          }
        )
    })
  }
}
