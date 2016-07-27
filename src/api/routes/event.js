var mongoose = require('mongoose'),
  CONST = require('../const'),
  User = require('../models/user'),
  Event = require('../models/event')

mongoose.Promise = global.Promise

module.exports = function(app) {
  function getOneById(id, res, statusCode) {
    Event
    .findById(id)
    .populate('creator', CONST.USER_LIST_FIELDS)
    .exec()
    .then(function(data) {
      if (data) {
        res.status(statusCode).json(data)
      } else {
        res.status(404).send()
      }
    })
    .catch(function(err) {
      res.status(500).send({error: err})
    })
  }

  /* Create */
  app.post('/events', function(req, res) {
    var tmp = new Event(req.body)

    User
    .findById(tmp.creator)
    .exec()
    .then(function(user) {
      if (user) {
        return tmp.save()
      } else {
        res.status(404).send()
      }
    })
    .then(function(data) {
      if (data) {
        getOneById(data._id, res, 201)
      }
    })
    .catch(function(err) {
      res.status(500).send({error: err})
    })
  })

  /* List */
  app.get('/events', function(req, res) {
    var query = {}

    Event
    .find(query)
    .limit(CONST.DEFAULT_PAGINATION)
    .sort({_id: -1})
    .populate('creator', CONST.USER_LIST_FIELDS)
    .exec()
    .then(function(data) {
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).send()
      }
    })
    .catch(function(err) {
      res.status(500).send({error: err})
    })
  })

  /* Read */
  app.get('/events/:id', function(req, res) {
    getOneById(req.params.id, res, 200)
  })

  /* Update */
  app.put('/events/:id', function(req, res) {
    Event
    .findById(req.params.id)
    .exec()
    .then(function(event) {
      event
      .set(req.body)
      .save()
      .then(function(data) {
        if (data) {
          getOneById(data._id, res, 200)
        }
      })
      .catch(function(err) {
        res.status(500).send({error: err})
      })
    })
  })

  /* Delete */
  app.delete('/events/:id', function(req, res, next) {
    Event
    .findById(req.params.id)
    .exec()
    .then(function(event) {
      if (event) {
        event
        .remove()
        .then(function(data) {
          if (data) {
            res.status(200).send()
          }
        })
        .catch(function(err) {
          res.status(500).send({error: err})
        })
      } else {
        res.status(404).send()
      }
    })
  })
}