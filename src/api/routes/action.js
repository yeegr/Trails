const mongoose = require('mongoose'),
  User = require('../models/user'),
  Action = require('../models/action'),
  Area = require('../models/area'),
  Trail = require('../models/trail'),
  Event = require('../models/event'),
  Post = require('../models/post')

mongoose.Promise = global.Promise

module.exports = (app) => {
  /* Create */
  app.post('/logs', (req, res, next) => {
    let tmp = new Action(req.body)

    User
    .findById(tmp.creator)
    .exec()
    .then((user) => {
      if (user) {
        return tmp.save()
      } else {
        res.status(404).send()
      }
    })
    .then((data) => {
      if (data) {
        let Target, counter

        switch (data.target) {
          case 'Area':
            Target = Area
            break

          case 'Trail':
            Target = Trail
            break

          case 'Event':
            Target = Event
            break

          case 'Post':
            Target = Post
          break

          case 'User':
            Target = User
          break

          default:
            Target = null
            break
        }

        switch (data.action) {
          case 'FOLLOW':
          case 'UNFOLLOW':
            counter = 'totalFollowers'
            break

          case 'LIKE':
          case 'UNLIKE':
            counter = 'likeCount'
            break

          case 'SAVE':
          case 'UNSAVE':
            counter = 'saveCount'
            break
          
          case 'SHARE':
            counter = 'shareCount'
            break
          
          default: 
            counter = ''
            break
        }

        setTimeout(() => {
          Target
          .findOne({
            _id: data.ref
          })
          .exec()
          .then((result) => {
            let obj = {
              action: tmp.action,
              target: tmp.target,
              ref: tmp.ref,
            }
            obj[counter] = result[counter]
            res.status(201).json(obj)
          })
        }, 100)
      }
    })
    .catch((err) => {
      res.status(500).json({error: err})
    })
  })
}