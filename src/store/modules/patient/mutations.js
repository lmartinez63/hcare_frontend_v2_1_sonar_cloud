import moment from 'moment'

export default {
  pendingRequest (state) {
    console.log('patientResponse - mutations - pendingRequest')
    state.loading = true
  },
  failureDetected (state, error) {
    state.loading = false
    console.log('patientResponse - mutations - failureDetected - ' + error)
    state.error = error
  },
  getByIdSuccess (state, content) {
    state.loading = false
    console.log('patientResponse - mutations  - getByIdSuccess')
    state.data = content.dataContent.dataMap.patient
    state.metadata = content.metadataContent
  },
  saveEntitySuccess (state, content) {
    state.loading = false
    console.log('patientResponse - mutations  - saveEntitySuccess')
      .toISOString().substr(0, 10)
    state.data = content.dataContent.dataMap.patient
    state.metadata = content.metadataContent
  }
}
