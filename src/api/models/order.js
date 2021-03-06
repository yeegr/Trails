'use strict'

const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  CONST = require('../const'),
  UTIL = require('../util'),
  Log = require('./logging'),
  User = require('./user'),
  Event = require('./event'),
  orderSchema = new Schema({
    type: {
      type: String,
      enum: CONST.ORDER_TYPES,
      default: CONST.ORDER_TYPES[0],
      required: true
    },
    channel: {
      type: String,
      enum: CONST.ORDER_CHANNELS,
      default: CONST.ORDER_CHANNELS[0],
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    group: {
      type: Number,
      required: true,
      default: 0
    },
    title: {
      type: String,
      required: true
    },
    body: {
      type: String
    },
    hero: {
      type: String
    },
    startDate: {
      type: Number
    },
    daySpan: {
      type: Number
    },
    signUps: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      name: {
        type: String,
        required: true,
      },
      mobile: {
        type: Number,
        match: CONST.mobileRx,
        required: true
      },
      gender: {
        type: Number,
        match: CONST.genderRx,
        required: true
      },
      pid: {
        type: String,
        match: CONST.pidRx
      },
      level: {
        type: Number,
        match: CONST.levelRx
      },
      payment: {
        type: Object
      },
      cost: {
        type: Number,
        match: CONST.currencyRx
      },
      _id: false
    }],
    subTotal: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      enum: CONST.PAYMENT_MEDHODS,
      default: CONST.PAYMENT_MEDHODS[0],
      required: true
    },
    status: {
      type: String,
      enum: CONST.STATUSES.PAYMENT,
      default: CONST.STATUSES.PAYMENT[0],
      required: true
    }
  })

orderSchema.pre('save', function(next) {
  this.wasNew = this.isNew
  next()
})

orderSchema.post('save', function(doc) {
  User.findById(doc.creator, function(err, user) {
    if (user) {
      user.addOrder(doc._id)
    }
  })

  if (!this.isNew && doc.status === CONST.STATUSES.PAYMENT[1]) {
    Event.findById(doc.event, function(err, data) {
      if (data) {
        data.addOrder(doc)
      }
    })
  }

  Log({
    creator: doc.creator,
    action: (doc.isNew) ? 'CREATE' : 'UPDATE',
    target: 'Order',
    ref: doc._id
  })
})

orderSchema.post('remove', function(doc) {
  User.findById(doc.creator, function(err, user) {
    if (user) {
      user.removeFromList('orders', doc.id)
    }
  })

  Event.findById(doc.ref, function(err, data) {
    if (data) {
      data.addOrder(doc.total, doc.group, doc.signUps)
    }
  })

  Log({
    creator: this.creator,
    action: 'DELETE',
    target: 'Order',
    ref: this._id
  })
})

module.exports = mongoose.model('Order', orderSchema)
