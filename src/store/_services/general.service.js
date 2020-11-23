
import config from 'config'
import { authHeader } from '../_helpers'
import { userService } from '../_services'

export const generalService = {
  loadProperties,
  getDoctors,
  getNurses,
  getRoles,
  getMedicalAreas,
  getLabels,
  getPages,
  getCIE10Codes,
  getExamBundleList,
  getAuxiliarExams,
  getMedicaments,
  getAllergies,
  getSections,
  getFieldDefinitions,
  getSurgeryTypes
}

function loadProperties () {
  console.log('generalService - loadProperties')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/loadProperties`, requestOptions).then(handleResponse)
    .then(properties => {
      localStorage.setItem('properties', JSON.stringify(properties))
      return properties
    })
}
function getLabels () {
  console.log('generalService - getLabels')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getLabels`, requestOptions).then(handleResponse)
    .then(labels => {
      localStorage.setItem('labels', JSON.stringify(labels))
      return labels
    })
}
function getDoctors () {
  console.log('generalService - getDoctors')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getDoctors`, requestOptions).then(handleResponse)
    .then(doctors => {
      localStorage.setItem('doctors', JSON.stringify(doctors))
      return doctors
    })
}
function getNurses () {
  console.log('generalService - getNurses')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getNurses`, requestOptions).then(handleResponse)
    .then(nurses => {
      localStorage.setItem('nurses', JSON.stringify(nurses))
      return nurses
    })
}
function getPages () {
  console.log('generalService - getPages')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getPages`, requestOptions).then(handleResponse)
    .then(pages => {
      localStorage.setItem('pages', JSON.stringify(pages))
      return pages
    })
}
function getFieldDefinitions () {
  console.log('generalService - getFieldDefinitions')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getFieldDefinitions`, requestOptions).then(handleResponse)
    .then(fieldDefinitions => {
      localStorage.setItem('fieldDefinitions', JSON.stringify(fieldDefinitions))
      return fieldDefinitions
    })
}
function getSections () {
  console.log('generalService - getSections')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getSections`, requestOptions).then(handleResponse)
    .then(sections => {
      localStorage.setItem('sections', JSON.stringify(sections))
      return sections
    })
}
function getCIE10Codes () {
  console.log('generalService - getCIE10Codes')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getCIE10Codes`, requestOptions).then(handleResponse)
    .then(cie10Codes => {
      localStorage.setItem('cie10Codes', JSON.stringify(cie10Codes))
      return cie10Codes
    })
}
function getMedicaments () {
  console.log('generalService - getMedicaments')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getMedicaments`, requestOptions).then(handleResponse)
    .then(medicaments => {
      localStorage.setItem('medicaments', JSON.stringify(medicaments))
      return medicaments
    })
}
function getExamBundleList () {
  console.log('generalService - getExamBundleList')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getExamBundleList`, requestOptions).then(handleResponse)
    .then(examBundleList => {
      localStorage.setItem('examBundleList', JSON.stringify(examBundleList))
      return examBundleList
    })
}

function getAuxiliarExams () {
  console.log('generalService - getAuxiliarExams')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getAuxiliarExams`, requestOptions).then(handleResponse)
    .then(auxiliarExams => {
      localStorage.setItem('auxiliarExams', JSON.stringify(auxiliarExams))
      return auxiliarExams
    })
}

function getAllergies () {
  console.log('generalService - getAllergies')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getAllergies`, requestOptions).then(handleResponse)
    .then(allergies => {
      localStorage.setItem('allergies', JSON.stringify(allergies))
      return allergies
    })
}

function getRoles () {
  console.log('generalService - getRoles')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getRoles`, requestOptions).then(handleResponse)
    .then(roles => {
      localStorage.setItem('roles', JSON.stringify(roles))
      return roles
    })
}
function getMedicalAreas () {
  console.log('generalService - getMedicalAreas')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getMedicalAreas`, requestOptions).then(handleResponse)
    .then(medicalAreas => {
      localStorage.setItem('medicalAreas', JSON.stringify(medicalAreas))
      return medicalAreas
    })
}
function getSurgeryTypes () {
  console.log('generalService - getSurgeryTypes')
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(`${config.apiUrl}/getSurgeryTypes`, requestOptions).then(handleResponse)
    .then(surgeryTypes => {
      localStorage.setItem('surgeryTypes', JSON.stringify(surgeryTypes))
      return surgeryTypes
    })
}

function handleResponse (response) {
  return response.text().then(text => {
    try {
      const data = text && JSON.parse(text)
      if (!response.ok) {
        if (response.status === 401) {
          // auto logout if 401 response returned from api
          // TODO Pending test this feature
          userService.logout()
          location.reload(true)
        }

        const error = (data && data.message) || response.statusText
        return Promise.reject(error)
      }
      return data
    } catch (error) {
      return Promise.reject(response.statusText)
    }
  })
}
