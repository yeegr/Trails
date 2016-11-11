'use strict'

import {AsyncStorage} from 'react-native'
import * as ACTIONS from '../constants/loginConstants'
import {
  CONSTANTS,
  FETCH,
  AppSettings,
  Lang
} from '../../settings'

export const isLoggedIn = () => {
  return AsyncStorage
    .multiGet([CONSTANTS.ACCESS_TOKEN, CONSTANTS.USER])
    .then((arr) => {
      if (arr[0][1] && arr[1][1]) {
        return {
          type: ACTIONS.IS_LOGGED_IN,
          token: arr[0][1],
          user: JSON.parse(arr[1][1])
        }
      }

      return {
        type: ACTIONS.IS_LOGGED_OUT
      }
    })
    .catch((err) => {
      return {
        type: ACTIONS.IS_LOGGED_OUT
      }
    })
}

// toggle login page
export const showLogin = () => {
  return {
    type: ACTIONS.SHOW_LOGIN
  }
}

export const hideLogin = () => {
  return {
    type: ACTIONS.HIDE_LOGIN
  }
}

// toggle mobile number input for validation
export const enableValidation = () => {
  return {
    type: ACTIONS.ENABLE_VERIFICATION
  }
}

export const disableValidation = () => {
  return {
    type: ACTIONS.DISABLE_VERIFICATION
  }
}

// send mobile number for validation
const requestMobileValidation = () => {
  return {
    type: ACTIONS.SEND_MOBILE_NUMBER_FOR_VALIDATION
  }
}

const mobileNumberSaved = () => {
  return {
    type: ACTIONS.MOBILE_NUMBER_SAVED
  }
}

const mobileValidationFailed = () => {
  return {
    type: ACTIONS.MOBILE_NUMBER_VALIDATION_FAILED
  }
}

export const validateMobileNumber = (mobile, action) => {
  let config = Object.assign({}, FETCH.POST, {
    body: JSON.stringify({
      mobile,
      action
    })
  })

  return dispatch => {
    dispatch(requestMobileValidation())

    return fetch(AppSettings.apiUri + 'validate', config)
      .then((res) => {
        if (res.status === 201) {
          dispatch(mobileNumberSaved())
        } else {
          dispatch(mobileValidationFailed(res.message))
          return Promise.reject(res)
        }
      })
      .catch(err => console.error(err))
  }
}

// toggle mobile number input for verification
export const showVerification = () => {
  return {
    type: ACTIONS.SHOW_VERIFICATION
  }
}

export const hideVerification = () => {
  return {
    type: ACTIONS.HIDE_VERIFICATION
  }
}

export const resetVerificationError = () => {
  return {
    type: ACTIONS.RESET_VERIFICATION_ERROR
  }
}

// send mobile number for verification
const requestMobileVerification = () => {
  return {
    type: ACTIONS.SEND_MOBILE_VERIFICATION_REQUEST
  }
}

const mobileVerified = (mobile) => {
  return {
    type: ACTIONS.MOBILE_VERIFICATION_SUCCESS,
    mobile
  }
}

const mobileVerificationFailed = (key) => {
  return {
    type: ACTIONS.MOBILE_VERIFICATION_FAILURE,
    error: Lang[key]
  }
}

export const verifyMobileNumber = (mobile, vcode) => {
  let config = Object.assign({}, FETCH.PUT, {
    body: JSON.stringify({
      mobile,
      vcode
    })
  })
  
  return dispatch => {
    dispatch(requestMobileVerification())

    return fetch(AppSettings.apiUri + 'validate', config)
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        if (res.verified) {
          dispatch(mobileVerified(mobile))
        } else {
          dispatch(mobileVerificationFailed(res.error))
          //return Promise.reject(res)
        }
      })
  }
}

// toggle login button for mobile number verification
export const enableLogin = () => {
  return {
    type: ACTIONS.ENABLE_LOGIN
  }
}

export const disableLogin = () => {
  return {
    type: ACTIONS.DISABLE_LOGIN
  }
}

// get WeChat authorization
const sendWechatAuthRequest = () => {
  return {
    type: ACTIONS.SEND_WECHAT_AUTH_REQUEST
  }
}

export const wechatAuthRequestSend = () => {
  return {
    type: ACTIONS.WECHAT_AUTH_REQUEST_SEND
  }
}

const receiveWechatUserInfo = (wechat) => {
  return {
    type: ACTIONS.WECHAT_USER_INFO_SUCCESS,
    wechat
  }
}

const wechatUserInfoError = (message) => {
  return {
    type: ACTIONS.WECHAT_USER_INFO_FAILURE,
    message
  }
}

export const requestWechatUserInfo = (wechat_token) => {
  return (dispatch) => {
    return fetch(AppSettings.assetUri + 'wechat/info/' + wechat_token)
      .then((res) => {
        return res.json()
      })
      .then((wechat) => {
        dispatch(receiveWechatUserInfo(wechat))
      })
      .catch((err) => dispatch(wechatUserInfoError(err)))
  }
}






const requestLogin = (creds) => {
  return {
    type: ACTIONS.REQUEST_LOGIN,
    creds
  }
}

const receiveLogin = (user) => {
  return {
    type: ACTIONS.LOGIN_SUCCESS,
    token: user.token,
    user
  }
}

const loginError = (message) => {
  return {
    type: ACTIONS.LOGIN_FAILURE,
    message
  }
}



export const showMobileLoginForm = () => {
  return {
    type: ACTIONS.SHOW_MOBILE_LOGIN_FORM
  }
}

const completeSignup = (creds) => {
  let action = null

  if (creds.mobile) {
    action = sendWechatAuthRequest()
  }

  if (creds.wechat) {
    action = showMobileLoginForm()
  }

  return (dispatch) => {
    dispatch(action)
  }
}

export const loginUser = (creds) => {
  let config = Object.assign({}, FETCH.POST, {
    body: JSON.stringify(creds)
  })

  return (dispatch) => {
    dispatch(requestLogin(creds))

    return fetch(AppSettings.apiUri + 'login', config)
      .then((res) => {
        if (res.status === 404) {
          dispatch(completeSignup(creds))
        } else {
          return res.json()
        }
      })
      .then((res) => {
        if (res.token && res._id) {
          AsyncStorage.multiSet([
            [CONSTANTS.ACCESS_TOKEN, res.token],
            [CONSTANTS.USER, JSON.stringify(res)]
          ]).then(() => {
            dispatch(receiveLogin(res))
          })
        } else {
          dispatch(loginError(res.message))
          return Promise.reject(res)
        }
      })
      .catch((err) => dispatch(loginError(err)))
  }
}


const receiveUser = (user) => {
  return {
    type: ACTIONS.GET_SUCCESS,
    token: user.token,
    user
  }
}

const getUserError = (message) => {
  return {
    type: ACTIONS.GET_FAILURE,
    message
  }
}

export const getUpdatedUser = (user_id) => {
  return (dispatch) => {
    return fetch(AppSettings.apiUri + 'users/' + user_id, FETCH.GET)
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        if (res.id) {
          AsyncStorage
          .setItem(CONSTANTS.USER, JSON.stringify(res))
          .then(() => {
            dispatch(receiveUser(res))
          })
        } else {
          dispatch(getUserError(res.message))
          return Promise.reject(res)
        }
      })
      .catch((err) => dispatch(getUserError(err)))
  }
}

const requestLogout = () => {
  return {
    type: ACTIONS.LOGOUT_REQUEST
  }
}

const receiveLogout = () => {
  return {
    type: ACTIONS.LOGOUT_SUCCESS
  }
}

export const logoutUser = () => {
  return dispatch => {
    dispatch(requestLogout())
    AsyncStorage.multiRemove([CONSTANTS.ACCESS_TOKEN, CONSTANTS.USER], () => {
      dispatch(receiveLogout())
    })
  }
}

const requestUserUpdate = () => {
  return {
    type: ACTIONS.REQUEST_USER_UPDATE
  }
}

const receiveUpdatedUser = (user) => {
  return {
    type: ACTIONS.USER_UPDATE_SUCCESS,
    user
  }
}

const userUpdateError = (key) => {
  return {
    type: ACTIONS.USER_UPDATE_FAILURE,
    updateError: Lang[key]
  }
}

export const updateAvatarUri = (uri) => {
  return {
    type: ACTIONS.UPDATE_AVATAR_URI,
    uri
  }
}

export const updateUserAvatar = (user_id, uri) => {
  let formData = new FormData()

  formData.append('file', {
    type: 'image/jpg',
    name: 'avatar.jpg',
    uri
  })

  let config = Object.assign({}, FETCH.UPLOAD, {
    body: formData
  })

  return (dispatch) => {
    dispatch(requestUserUpdate())

    return fetch(AppSettings.apiUri + 'users/' + user_id + '/avatar', config)
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        AsyncStorage
        .setItem(CONSTANTS.USER, JSON.stringify(res))
        .then(() => {
          dispatch(receiveUpdatedUser(res))
        })
      })
      .catch((err) => dispatch(userUpdateError(err)))
  }
}

export const updateUser = (user_id, data) => {
  let config = Object.assign({}, FETCH.PUT, {
    body: JSON.stringify(data)
  })

  return (dispatch) => {
    dispatch(requestUserUpdate())

    return fetch(AppSettings.apiUri + 'users/' + user_id, config)
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        AsyncStorage
        .setItem(CONSTANTS.USER, JSON.stringify(res))
        .then(() => {
          dispatch(receiveUpdatedUser(res))
        })
      })
      .catch((err) => dispatch(userUpdateError(err)))
  }
}

export const updateUserMobile = (user_id, mobile, vcode) => {
  let config = Object.assign({}, FETCH.PUT, {
    body: JSON.stringify({
      mobile,
      vcode
    })
  })

  return (dispatch) => {
    dispatch(requestUserUpdate())

    return fetch(AppSettings.apiUri + 'users/' + user_id + '/mobile', config)
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        if (res.error) {
          return Promise.reject(res)
        } else {
          AsyncStorage
          .setItem(CONSTANTS.USER, JSON.stringify(res))
          .then(() => {
            dispatch(receiveUpdatedUser(res))
          })
        }
      })
      .catch((err) => dispatch(userUpdateError(err.error)))
  }
}

export const clearUpdateError = () => {
  return {
    type: ACTIONS.CLEAR_UPDATE_ERROR
  }
}