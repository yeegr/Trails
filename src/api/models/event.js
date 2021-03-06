'use strict'

const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  CONST = require('../const'),
  UTIL = require('../util'),
  Log = require('./logging'),
  Agenda = require('./agenda'),
  Photo = require('./photo'),
  Point = require('./point'),
  User = require('./user'),
  eventSchema = new Schema({
    creator: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    },
    modified: {
      type: Number,
      required: true,
      default: UTIL.getTimestamp()
    },
    status: {
      type: String,
      enum: CONST.STATUSES.EVENT,
      default: CONST.STATUSES.EVENT[0],
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false,
      required: true
    },
    city: {
      type: String,
      required: true,
      default: '010'
    },
    title: {
      type: String,
      required: true,
      trim: true,
      min: 2
    },
    hero: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    excerpt: {
      type: String,
      required: false,
      max: 100
    },
    difficultyLevel: {
      type: Number, //1,1.5,2,2.5,-5
      required: true,
      min: 1,
      max: 5,
      default: 1
    },
    tags: [String],
    groups: [{
      startDate: {
        type: Number,
        required: true
      },
      deadline: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: CONST.STATUSES.GROUP,
        default: CONST.STATUSES.GROUP[0]
      },
      signUps: [{
        added: {
          type: Number,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        mobile: {
          type: Number,
          match: CONST.mobileRx,
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
        cost: {
          type: Number,
          match: CONST.currencyRx,
          required: true
        },
        status: {
          type: String,
          enum: CONST.STATUSES.SIGNUP,
          default: CONST.STATUSES.SIGNUP[0]
        },
        _id: false,
        default: []
      }],
      _id: false
    }],
    total: {
      type: Number,
      required: true,
      default: 0
    },
    gatherTime: {
      type: Number,
      required: false,
      min: 0,
      max: 1439
    },
    gatherLocation: {
      type: Point,
      required: false
    },
    contacts: [{
      title: {
        type: String
      },
      mobileNumber: {
        type: Number,
        match: CONST.mobileRx
      },
      _id: false
    }],
    maxAttendee: Number,
    minAttendee: Number,
    schedule: [Agenda],
    expenses: {
      deposit: {
        type: Number,
        default: 0
      },
      perHead: {
        type: Number,
        required: true
      },
      insurance: Boolean,
      detail: [String],
      includes: [String],
      excludes: [String]
    },
    destination: String,
    gears: {
      images: [Number],
      tags: [String],
      notes: [String]
    },
    reminders: [String],
    photos: [Photo],
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    ratingTotal: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    saves: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    shares: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  }, {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  })

eventSchema.virtual('likeCount').get(function() {
  return this.likes.length
})

eventSchema.virtual('saveCount').get(function() {
  return this.saves.length
})

eventSchema.virtual('shareCount').get(function() {
  return this.shares.length
})

eventSchema.virtual('commentCount').get(function() {
  return this.comments.length
})

eventSchema.virtual('ratingAverage').get(function() {
  return UTIL.getAverageRating(this)
})

eventSchema.methods.addToList = function(type, id) {
  UTIL.addToList(this, this[type], id)
}

eventSchema.methods.removeFromList = function(type, id) {
  UTIL.removeFromList(this, this[type], id)
}

eventSchema.methods.addSignUps = function(groupIndex, signUps, id, added) {
  let signUpList = this.groups[groupIndex].signUps

  signUps.map((each) => {
    let tmp = JSON.parse(JSON.stringify(each))
    tmp.order = id
    tmp.added = added
    signUpList.push(tmp)
  })

  this.save()
}

eventSchema.methods.addOrder = function(order) {
  this.total += order.subTotal

  let time = UTIL.getTimeFromId(order._id)

  if (order.subTotal < 0) {
    this.removeSignUps(order.group, order.signUps)
  } else {
    this.addSignUps(order.group, order.signUps, order.id, time)
  }

  User.findById(this.creator, function(err, user) {
    if (user) {
      user.addToBalance(order.subTotal)
    }
  })
}

eventSchema.methods.removeSignUps = function(groupIndex, signUps) {
  let signUpList = this.groups[groupIndex].signUps

  signUps.map(function(signUp) {
    signUpList.map(function(each, index) {
      if (signUp.mobile === each.mobile) {
        signUpList.splice(index, 1)
      }
    })
  })

  this.save()
}

eventSchema.methods.addComment = function(id, rating) {
  UTIL.addComment(this, id, rating)
}

eventSchema.methods.removeComment = function(id, rating) {
  UTIL.removeComment(this, id, rating)
}

eventSchema.pre('save', function(next) {
  UTIL.updateModified(this, ['title', 'content', 'excerpt', 'hero', 'tags'])
  this.wasNew = this.isNew

  next()
})

eventSchema.post('save', function(doc) {
  if (doc.wasNew) {
    User.findById(doc.creator, function(err, user) {
      if (user) {
        user.addToList('events', doc.id)
      }
    })
  }

  Log({
    creator: doc.creator,
    action: (doc.isNew) ? 'CREATE' : 'UPDATE',
    target: 'Event',
    ref: doc._id
  })
})

eventSchema.post('remove', function(doc) {
  User.findById(doc.creator, function(err, user) {
    if (user) {
      user.removeFromList('events', doc.id)
    }
  })

  Log({
    creator: doc.creator,
    action: 'DELETE',
    target: 'Event',
    ref: doc._id
  })
})

module.exports = mongoose.model('Event', eventSchema)