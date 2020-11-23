import moment from 'moment'

export default {
  pendingRequest (state) {
    console.log('dataResponse - mutations - pendingRequest')
    state.loading = true
    state.oldDataMap = state.dataMap
    state.oldMetadata = state.metadata
    state.dataMap = {}
    state.metadata = {}
  },
  restoreDataMap (state) {
    console.log('dataResponse - mutations - reloadDataMap')
    state.loading = true
    state.dataMap = state.oldDataMap
  },
  restoreMetadata (state) {
    console.log('dataResponse - mutations - reloadDataMap')
    state.loading = true
    state.metadata = state.oldMetadata
  },
  pendingDialogRequest (state) {
    console.log('dataResponse - mutations - pendingDialogRequest')
    state.loading = true
    state.dialogDataMap = {}
    state.dialogMetadata = {}
  },
  failureDetected (state, error) {
    state.loading = false
    console.log('dataResponse - mutations - failureDetected - ' + error)
    state.error = error
  },
  getDialogDataSuccess (state, content) {
    state.loading = false
    console.log('dataResponse - mutations  - getDialogDataSuccess')
    state.dialogDataMap = content.dataContent.dataMap
    state.dialogMetadata = content.metadataContent
  },
  getDataSuccess (state, content) {
    state.loading = false
    console.log('dataResponse - mutations  - getDataSuccess')
    // state.dataMap = Object.assign(state.dataMap, content.dataContent.dataMap)
    // state.metadata = Object.assign(state.metadata, content.metadataContent)
    state.dataMap = content.dataContent.dataMap
    state.metadata = content.metadataContent
  },
  getSurgeryAreaListByRequiredDateSuccess (state, content) {
    state.loading = false
    console.log('dataResponse - mutations - getSurgeryAreaListByRequiredDateSuccess')
    if (content && content != null && content.dataContent.dataMap.surgeryAreaList && content.dataContent.dataMap.surgeryAreaList.length > 0) {
      state.dataMap.surgeryAreaList = content.dataContent.dataMap.surgeryAreaList
    } else {
      state.dataAlert = { message: 'No hay salas disponibles, porfavor seleccione otro dia', type: 'info', display: true }
    }
  },
  getAvailableDatesOnSurgeryAreaSuccess (state, content) {
    state.loading = false
    console.log('dataResponse - mutations - getAvailableDatesOnSurgeryAreaSuccess')
    if (content && content != null && content.dataContent.dataMap.eventGroupList && content.dataContent.dataMap.eventGroupList.length > 0) {
      state.dataMap.eventGroupList = content.dataContent.dataMap.eventGroupList
    } else {
      state.dataAlert = { message: 'No hay horarios disponibles, porfavor seleccione otro dia', type: 'info', display: true }
    }
  },
  getPatientInfoByDocumentNumberOnMedAppointmentSuccess (state, content) {
    state.loading = false
    console.log('dataResponse - mutations - getPatientInfoByDocumentNumberOnMedAppointmentSuccess')
    if (content && content != null && content.dataContent.dataMap.patient) {
      state.dataMap.medicalAppointment.patient = content.dataContent.dataMap.patient
    } else {
      state.dataAlert = { message: 'Numero de Documento no encontrado, el paciente sera registrado', type: 'info', display: true }
    }
  },
  saveDialogEntitySuccess (state, content) {
    state.loading = false
    console.log('processResponse - mutations  - saveDialogEntitySuccess')
    state.dialogDataMap = content.dataContent.dataMap
    if (content.dataContent.parentDataMap) {
      Object.keys(content.dataContent.parentDataMap).forEach(function (key, index) {
        // key: the name of the object key
        // index: the ordinal position of the key within the object
        state.dataMap[key] = content.dataContent.parentDataMap[key]
      })
    }
  },
  saveEntitySuccess (state, content) {
    state.loading = false
    console.log('processResponse - mutations  - saveEntitySuccess')
    state.dataMap = content.dataContent.dataMap
  },
  uploadFileSuccess (state, content) {
    console.log('processResponse - mutations  - uploadFileSuccess - start')
    state.loading = false
    console.log('processResponse - mutations  - uploadFileSuccess - end')
  }
}
