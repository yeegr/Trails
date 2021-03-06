'use strict'

import * as ACTIONS from '../constants/ordersConstants'

const ordersReducer = (state = {
  isFetching: false,
  message: null,
  list: [],
  order: null
}, action) => {
  switch (action.type) {
    case ACTIONS.RESET_ORDER:
      return Object.assign({}, state, {
        message: null,
        order: null
      })

    case ACTIONS.SET_SIGN_UPS:
      return Object.assign({}, state, {
        order: Object.assign({}, state.order, {
          signUps: action.signUps
        })
      })

   case ACTIONS.CREATE_ORDER_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })

    case ACTIONS.CREATE_ORDER_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        order: action.order
      })

    case ACTIONS.CREATE_ORDER_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: action.message,
        order: null
      })

    case ACTIONS.UPDATE_ORDER_REQUEST:
      return Object.assign({}, state, {
        isFetching: true 
      })

    case ACTIONS.UPDATE_ORDER_SUCCESS:
      return Object.assign({}, state, {
        order: action.order
      })

    case ACTIONS.UPDATE_ORDER_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: action.message
      })

   case ACTIONS.LIST_ORDERS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })

    case ACTIONS.LIST_ORDERS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        message: null,
        list: action.list
      })

    case ACTIONS.LIST_ORDERS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: action.message,
        list: [],
      })

   case ACTIONS.GET_ORDER_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })

    case ACTIONS.GET_ORDER_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        message: null,
        order: action.order
      })

    case ACTIONS.GET_ORDER_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: action.message,
        order: null
      })

    default:
      return state
  }
}

export default ordersReducer