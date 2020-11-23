import config from 'config'
import {
  authHeader,
  getTokenAuthHeader
} from '../_helpers'

export const userService = {
  login,
  logout
}

function login (username, password) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  }

  // return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
  return fetch(`${config.apiUrl}/generate-token`, requestOptions)
    .then(handleResponse)
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user))
      }

      return user
    })
    .catch((error) => {
      // TO handle ERROR CONNECTION
      console.log(error)
      // TODO improve messages that comes from database
      return Promise.reject(new Error(error.message))
    })
}

function logout () {
  // remove user from local storage to log user out
  // localStorage.removeItem('user');
  // remove all data related
  localStorage.clear()
}

function handleResponse (response) {
  return response.text().then(text => {
    try {
      console.log('userService - handleResponse')
      const data = text && JSON.parse(text)
      if (!response.ok) {
        if (response.status === 401) {
          // auto logout if 401 response returned from api
          if (data.message === '1') {
            return Promise.reject(new Error('Usuario y/o Password incorrectos'))
          }
          logout()
          location.reload(true)
        }

        const error = (data && data.message) || response.statusText
        return Promise.reject(new Error({ code: 0, message: error }))
      }
      return data
    } catch (error) {
      return Promise.reject(new Error({ code: 2, message: response.statusText }))
    }
  })
}
