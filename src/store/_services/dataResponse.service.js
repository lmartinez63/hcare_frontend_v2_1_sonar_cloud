import config from 'config'
import {
  authHeader,
  getTokenAuthHeader
} from '../_helpers'
import {
  userService,
  generalService
} from '../_services'

export const dataResponseService = {
  getContent,
  getBrowseData,
  uploadAttachment,
  downloadAttachment
}

function getContent (requestPage, processName, dataContent) {
  console.log('dataResponseService - getContent')
  var requestData = {
    'requestPage': requestPage,
    'processName': processName,
    'data': dataContent
  }
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': authHeader().Authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  }
  return fetch(`${config.apiUrl}/getContent/`, requestOptions).then(handleResponse)
}

function uploadAttachment (dataContent) {
  console.log('dataResponseService - uploadAttachment')
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': authHeader().Authorization
    },
    body: dataContent
  }
  return fetch(`${config.apiUrl}/uploadAttachment`, requestOptions).then(handleResponse)
}

function downloadAttachment (dataContent) {
  console.log('dataResponseService - downloadAttachment')
  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': authHeader().Authorization
    }
  }
  return fetch(`${config.apiUrl}/downloadAttachment/` + dataContent.attachment.id, requestOptions).then(handleResponse)
}

function getBrowseData (requestPage, processName, dataContent) {
  console.log('dataResponseService - getBrowseData')
  var requestData = {
    'requestPage': requestPage,
    'processName': processName,
    'data': dataContent
  }
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': authHeader().Authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  }
  return fetch(`${config.apiUrl}/getBrowseContent/`, requestOptions).then(handleResponse)
}

function handleResponse (response) {
  if (response.headers.get('content-type').indexOf('application/json') === 0) {
    return response.text().then(text => {
      var data
      try {
        if (!response.ok) {
          data = text && JSON.parse(text)
          if (response.status === 401) {
            // auto logout if 401 response returned from api
            // TODO Pending test this feature
            console.log('dataResponseService - handleResponse - logout')
            userService.logout()
            location.reload(true)
          } else if (response.status === 500) {
            return Promise.reject(data)
          }

          const error = (data && data.message) || response.status
          return Promise.reject(error)
        } else {
          data = text && JSON.parse(text)
        }
        return data
      } catch (error) {
        return Promise.reject(response.status)
      }
    })
  } else if (response.headers.get('content-type').indexOf('image/png') === 0) {
    return response.blob().then(blob => {
      var data
      try {
        if (!response.ok) {
          if (response.status === 401) {
            // auto logout if 401 response returned from api
            // TODO Pending test this feature
            console.log('dataResponseService - handleResponse - logout')
            userService.logout()
            location.reload(true)
          } else if (response.status === 500) {
            return Promise.reject(data)
          }
          const error = response.body
          return Promise.reject(error)
        } else {
          data = blob
        }
        return data
      } catch (error) {
        return Promise.reject(response.status)
      }
    })
  }
}
