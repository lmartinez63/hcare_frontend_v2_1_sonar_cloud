export default {
  setLoading (state, loadingValue) {
    console.log('generalStore - mutations - setLoading ' + loadingValue)
    state.loading = loadingValue
  },
  downloadAttachmentSuccess (state, content) {
    console.log('generalStore - mutations - downloadAttachmentSuccess ')
    state.loading = false
  },
  failureDetected (state, error) {
    state.loading = false
    console.log('generalStore - mutations - failureDetected - ' + error)
    state.error = error
  },
  loadPropertiesRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - loadPropertiesRequest')
    state.properties = {
      loading: true
    }
  },
  getLabelsRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getLabelsRequest')
    state.labels = {
      loading: true
    }
  },
  getMedicalAreasRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getMedicalAreasRequest')
    state.medicalAreas = {
      loading: true
    }
  },
  getSurgeryTypesRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getSurgeryTypesRequest')
    state.surgeryTypes = {
      loading: true
    }
  },
  getDoctorsRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getDoctorsRequest')
    state.doctors = {
      loading: true
    }
  },
  getNursesRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getNursesRequest')
    state.nurses = {
      loading: true
    }
  },
  getRolesRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getRolesRequest')
    state.roles = {
      loading: true
    }
  },
  getExamBundleListRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getExamBundleListRequest')
    state.examBundleList = {
      loading: true
    }
  },
  getMedicamentsRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getMedicamentsRequest')
    state.medicaments = {
      loading: true
    }
  },
  getAuxiliarExamsRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getAuxiliarExams')
    state.auxiliarExams = {
      loading: true
    }
  },
  getCIE10CodesRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getCIE10CodesRequest')
    state.cie10Codes = {
      loading: true
    }
  },
  getAllergiesRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getAllergiesRequest')
    state.allergies = {
      loading: true
    }
  },
  getPagesRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getPagesRequest')
    state.pages = {
      loading: true
    }
  },
  getSectionsRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getSectionsRequest')
    state.sections = {
      loading: true
    }
  },
  getFieldDefinitionsRequest (state) {
    state.loading = true
    console.log('generalStore - mutations - getFieldDefinitionsRequest')
    state.fieldDefinitions = {
      loading: true
    }
  },
  loadPropertiesSuccess (state, properties) {
    state.loading = false
    console.log('generalStore - mutations - loadPropertiesSuccess')
    state.properties = {
      items: properties
    }
  },
  getPagesSuccess (state, pages) {
    state.loading = false
    console.log('generalStore - mutations - getPagesSuccess')
    state.pages = {
      items: pages
    }
  },
  getSectionsSuccess (state, sections) {
    state.loading = false
    console.log('generalStore - mutations - getSectionsSuccess')
    state.sections = {
      items: sections
    }
  },
  getFieldDefinitionsSuccess (state, fieldDefinitions) {
    state.loading = false
    console.log('generalStore - mutations - getFieldDefinitionsSuccess')
    state.fieldDefinitions = {
      items: fieldDefinitions
    }
  },
  getLabelsSuccess (state, labels) {
    state.loading = false
    console.log('generalStore - mutations - getLabelsSuccess')
    state.labels = {
      items: labels
    }
  },
  getDoctorsSuccess (state, doctors) {
    state.loading = false
    console.log('generalStore - mutations - getDoctorsSuccess')
    state.doctors = {
      items: doctors
    }
  },
  getNursesSuccess (state, nurses) {
    state.loading = false
    console.log('generalStore - mutations - getNursesSuccess')
    state.nurses = {
      items: nurses
    }
  },
  getMedicalAreasSuccess (state, medicalAreas) {
    state.loading = false
    console.log('generalStore - mutations - getDoctorsSuccess')
    state.medicalAreas = {
      items: medicalAreas
    }
  },
  getMedicamentsSuccess (state, medicaments) {
    state.loading = false
    console.log('generalStore - mutations - getMedicamentsSuccess')
    state.medicaments = {
      items: medicaments
    }
  },
  getSurgeryTypesSuccess (state, surgeryTypes) {
    state.loading = false
    console.log('generalStore - mutations - getSurgeryTypesSuccess')
    state.surgeryTypes = {
      items: surgeryTypes
    }
  },
  getRolesSuccess (state, roles) {
    state.loading = false
    console.log('generalStore - mutations - getRolesSuccess')
    state.roles = {
      items: roles
    }
  },
  getExamBundleListSuccess (state, examBundleList) {
    state.loading = false
    console.log('generalStore - mutations - getExamBundleListSuccess')
    state.examBundleList = {
      items: examBundleList
    }
  },
  getAuxiliarExamsSuccess (state, auxiliarExams) {
    state.loading = false
    console.log('generalStore - mutations - getAuxiliarExamsSuccess')
    state.auxiliarExams = {
      items: auxiliarExams
    }
  },
  getCIE10CodesSuccess (state, cie10Codes) {
    state.loading = false
    console.log('generalStore - mutations - getCIE10CodesSuccess')
    state.cie10Codes = {
      items: cie10Codes
    }
  },
  getAllergiesSuccess (state, allergies) {
    state.loading = false
    console.log('generalStore - mutations - getAllergiesSuccess')
    state.allergies = {
      items: allergies
    }
  },
  loadPropertiesFailure (state, error) {
    state.loading = false
    console.log('generalStore - mutations - loadPropertiesFailure')
    state.properties = {
      error
    }
  },
  getDoctorsFailure (state, error) {
    state.loading = false
    console.log('generalStore - mutations - getDoctorsFailure')
    state.doctors = {
      error
    }
  },
  getMedicalAreasFailure (state, error) {
    state.loading = false
    console.log('generalStore - mutations - getMedicalAreasFailure')
    state.medicalAreas = {
      error
    }
  },
  getRolesFailure (state, error) {
    state.loading = false
    console.log('generalStore - mutations - getRolesFailure')
    state.roles = {
      error
    }
  }
}
