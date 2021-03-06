'use strict'

import * as ACTIONS from '../constants/postsConstants'
import {AppSettings} from '../../../common/__'

// set pagination
export const setPostsPage = (page) => {
  return {
    type: ACTIONS.SET_POSTS_PAGE,
    page
  }
}

// list posts
const listPostsRequest = (params) => {
  return {
    type: ACTIONS.LIST_POSTS_REQUEST,
    params
  }
}

const listPostsSuccess = (list) => {
  return {
    type: ACTIONS.LIST_POSTS_SUCCESS,
    list
  }
}

const listPostsFailure = (message) => {
  return {
    type: ACTIONS.LIST_POSTS_FAILURE,
    message
  }
}

export const listPosts = (params) => {
  return (dispatch, getState) => {
    dispatch(listPostsRequest(params))

    let page = getState().posts.page,
      paging = (page > 0) ? 'page=' + page : ''

    return fetch(AppSettings.apiUri + 'posts/?' + params + paging)
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        if (response.error) {
          dispatch(listPostsFailure(response.error))
          return Promise.reject(response)
        } else {
         dispatch(listPostsSuccess(response))
        }
      })
      .catch((err) => {
        dispatch(listPostsFailure(err))
      })
  }
}

// reset home page post list
export const resetPostList = () => {
  listPosts()
}

// get one post
const getPostRequest = () => {
  return {
    type: ACTIONS.GET_POST_REQUEST
  }
}

const getPostSuccess = (post) => {
  return {
    type: ACTIONS.GET_POST_SUCCESS,
    post
  }
}

const getPostFailure = (message) => {
  return {
    type: ACTIONS.GET_POST_SUCCESS,
    message
  }
}

export const getPost = (id) => {
  return (dispatch) => {
    dispatch(getPostRequest())

    return fetch(AppSettings.apiUri + 'posts/' + id)
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        if (response.error) {
          dispatch(getPostFailure(response.error))
          return Promise.reject(response)
        } else {
          dispatch(getPostSuccess(response))
        }
      })
      .catch((err) => {
        dispatch(getPostFailure(err))
      })
  }
}