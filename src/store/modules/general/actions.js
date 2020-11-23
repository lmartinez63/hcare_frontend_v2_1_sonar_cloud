import {
  generalService,
  dataResponseService
} from '../../_services'
import router from '../../../router'

export default {
  loadProperties ({ dispatch, commit }) {
    commit('loadPropertiesRequest')
    generalService.loadProperties()
      .then(
        properties => commit('loadPropertiesSuccess', properties),
        error => commit('loadPropertiesFailure', error)
      )
  },
  getAllergies ({ dispatch, commit }) {
    commit('getAllergiesRequest')
    generalService.getAllergies()
      .then(
        allergies => commit('getAllergiesSuccess', allergies),
        error => commit('failureDetected', error)
      )
  },
  getCIE10Codes ({ dispatch, commit }) {
    commit('getCIE10CodesRequest')
    generalService.getCIE10Codes()
      .then(
        cie10Codes => commit('getCIE10CodesSuccess', cie10Codes),
        error => commit('failureDetected', error)
      )
  },
  getMedicaments ({ dispatch, commit }) {
    commit('getMedicamentsRequest')
    generalService.getMedicaments()
      .then(
        medicaments => commit('getMedicamentsSuccess', medicaments),
        error => commit('failureDetected', error)
      )
  },
  getExamBundleList ({ dispatch, commit }) {
    commit('getExamBundleListRequest')
    generalService.getExamBundleList()
      .then(
        examBundleList => commit('getExamBundleListSuccess', examBundleList),
        error => commit('failureDetected', error)
      )
  },
  getAuxiliarExams ({ dispatch, commit }) {
    commit('getAuxiliarExamsRequest')
    generalService.getAuxiliarExams()
      .then(
        auxiliarExams => commit('getAuxiliarExamsSuccess', auxiliarExams),
        error => commit('failureDetected', error)
      )
  },
  uploadAttachment ({ dispatch, commit }, { vm, dataContent }) {
    return new Promise((resolve, reject) => {
      commit('setLoading', true)
      dataResponseService.uploadAttachment(dataContent)
        .then(
          content => {
            commit('uploadAttachmentSuccess', content)
            commit('setLoading', false)
            // TODO sucess message should come from a label
            // translated from backend
            dispatch('alert/success', { vm: vm, message: 'Documento ha sido guardado exitosamente' }, { root: true })
            router.go(-1)
            resolve({ status: 200 })
          },
          error => {
            commit('failureDetected', error)
            dispatch('alert/error', error, { root: true })
          }
        )
    })
  },
  downloadAttachment ({ dispatch, commit }, { vm, dataContent }) {
    return new Promise((resolve, reject) => {
      commit('setLoading', true)
      dataResponseService.downloadAttachment(dataContent)
        .then(
          content => {
            commit('downloadAttachmentSuccess', content)
            // Download File directly

            const url = window.URL.createObjectURL(new Blob([content], {
              type: dataContent.attachment.contentType
            }))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('target', '_blank')
            link.setAttribute('download', dataContent.attachment.fileName)
            document.body.appendChild(link)
            link.click()

            // TODO sucess message should come from a label
            // translated from backend
            dispatch('alert/success', { vm: vm, message: 'Documento ha sido descargado exitosamente ' }, { root: true })
            resolve({ status: 200 })
          },
          error => {
            commit('failureDetected', error)
            dispatch('alert/error', error, { root: true })
          }
        )
    })
  },
  getLabels ({ dispatch, commit }) {
    commit('getLabelsRequest')
    generalService.getLabels()
      .then(
        labels => commit('getLabelsSuccess', labels),
        error => commit('failureDetected', error)
      )
  },
  getNurses ({
    dispatch,
    commit
  }) {
    commit('getNursesRequest')
    generalService.getNurses()
      .then(
        nurses => commit('getNursesSuccess', nurses),
        error => commit('failureDetected', error)
      )
  },
  getDoctors ({
    dispatch,
    commit
  }) {
    commit('getDoctorsRequest')
    generalService.getDoctors()
      .then(
        doctors => commit('getDoctorsSuccess', doctors),
        error => commit('failureDetected', error)
      )
  },
  getRoles ({
    dispatch,
    commit
  }) {
    commit('getRolesRequest')
    generalService.getRoles()
      .then(
        roles => commit('getRolesSuccess', roles),
        error => commit('failureDetected', error)
      )
  },
  getPages ({
    dispatch,
    commit
  }) {
    commit('getPagesRequest')
    generalService.getPages()
      .then(
        pages => commit('getPagesSuccess', pages),
        error => commit('failureDetected', error)
      )
  },
  getSections ({
    dispatch,
    commit
  }) {
    commit('getSectionsRequest')
    generalService.getSections()
      .then(
        sections => commit('getSectionsSuccess', sections),
        error => commit('failureDetected', error)
      )
  },
  getFieldDefinitions ({
    dispatch,
    commit
  }) {
    commit('getFieldDefinitionsRequest')
    generalService.getFieldDefinitions()
      .then(
        fieldDefinitions => commit('getFieldDefinitionsSuccess', fieldDefinitions),
        error => commit('failureDetected', error)
      )
  },
  getMedicalAreas ({
    dispatch,
    commit
  }) {
    commit('getMedicalAreasRequest')
    generalService.getMedicalAreas()
      .then(
        medicalAreas => commit('getMedicalAreasSuccess', medicalAreas),
        error => commit('failureDetected', error)
      )
  },
  getSurgeryTypes ({
    dispatch,
    commit
  }) {
    commit('getSurgeryTypesRequest')
    generalService.getSurgeryTypes()
      .then(
        surgeryTypes => commit('getSurgeryTypesSuccess', surgeryTypes),
        error => commit('failureDetected', error)
      )
  }
}
