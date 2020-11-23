const properties = JSON.parse(localStorage.getItem('properties'))
const medicaments = JSON.parse(localStorage.getItem('medicaments'))
const cie10Codes = JSON.parse(localStorage.getItem('cie10Codes'))
const examBundleList = JSON.parse(localStorage.getItem('examBundleList'))
const auxiliarExams = JSON.parse(localStorage.getItem('auxiliarExams'))
const allergies = JSON.parse(localStorage.getItem('allergies'))
const labels = JSON.parse(localStorage.getItem('labels'))
const doctors = JSON.parse(localStorage.getItem('doctors'))
const nurses = JSON.parse(localStorage.getItem('nurses'))
const medicalAreas = JSON.parse(localStorage.getItem('medicalAreas'))
const surgeryTypes = JSON.parse(localStorage.getItem('surgeryTypes'))
const roles = JSON.parse(localStorage.getItem('roles'))
const pages = JSON.parse(localStorage.getItem('pages'))
const sections = JSON.parse(localStorage.getItem('sections'))
const fieldDefinitions = JSON.parse(localStorage.getItem('fieldDefinitions'))

const initialStateProperties = properties ? {
  properties
} : {
  properties: null
}
const initialStateMedicaments = medicaments ? {
  medicaments
} : {
  medicaments: null
}
const initialStateCIE10Codes = cie10Codes ? {
  cie10Codes
} : {
  cie10Codes: null
}
const initialStateExamBundleList = examBundleList ? {
  examBundleList
} : {
  examBundleList: null
}

const initialStateAuxiliarExams = auxiliarExams ? {
  auxiliarExams
} : {
  auxiliarExams: null
}

const initialStateAllergies = allergies ? {
  allergies
} : {
  allergies: null
}

const initialStateDoctors = doctors ? {
  doctors
} : {
  doctors: null
}
const initialStateNurses = nurses ? {
  nurses
} : {
  nurses: null
}
const initialStateMedicalAreas = medicalAreas ? {
  medicalAreas
} : {
  medicalAreas: null
}
const initialStateSurgeryTypes = surgeryTypes ? {
  surgeryTypes
} : {
  surgeryTypes: null
}
const initialStateRoles = roles ? {
  roles
} : {
  roles: null
}
const initialStatePages = pages ? {
  pages
} : {
  pages: null
}
const initialStateSections = sections ? {
  sections
} : {
  sections: null
}
const initialStateFieldDefinitions = fieldDefinitions ? {
  fieldDefinitions
} : {
  fieldDefinitions: null
}
const initialStateLabels = labels ? {
  labels
} : {
  labels: null
}

export default {
  properties: initialStateProperties,
  cie10Codes: initialStateCIE10Codes,
  examBundleList: initialStateExamBundleList,
  auxiliarExams: initialStateAuxiliarExams,
  allergies: initialStateAllergies,
  doctors: initialStateDoctors,
  nurses: initialStateNurses,
  medicalAreas: initialStateMedicalAreas,
  surgeryTypes: initialStateSurgeryTypes,
  roles: initialStateRoles,
  pages: initialStatePages,
  sections: initialStateSections,
  fieldDefinitions: initialStateFieldDefinitions,
  labels: initialStateLabels,
  loading: false
}
