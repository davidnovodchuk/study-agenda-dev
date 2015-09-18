"use strict";

var _ = require("lodash");
var Category = require("./category.model");
var Q = require("q");

// Get list of categories
exports.index = function(req, res) {
  return Q(
    Category.find()
    .exec()
  )
  .then(function (categories) {
    
    return res.status(200).json(categories);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Get a single category
exports.show = function(req, res) {
  return Q(
    Category.findOne()
    .where("urlName").equals(req.params.id)
    .populate("recipes")
    .exec()
  )
  .then(function(category) {
    if(!category) { 
      
      return Q(
        Category.findById(req.params.id)
        .populate("recipes")
        .exec()
      )
      .then(function(category) {
        if(!category) { 
          return res.send(404); 
        }

        return res.json(category);
      });
    }

    return res.json(category);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Creates a new category in the DB.
exports.create = function(req, res) {
  var newCategory = req.body;

  return Q(
    Category.create(newCategory)
  )
  .then(function(category) {

    return res.status(201).json(category);
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

// Updates an existing category in the DB.
exports.update = function(req, res) {
  var categoryId = req.params.id;

  if(req.body._id) { 
    delete req.body._id; 
  }

  return Q(
    Category.findById(categoryId)
    .exec()
  )
  .then(function(category) {
    if(!category) { 
      return res.send(404); 
    }

    var updated = _.merge(category, req.body);

    return Q(
      updated.save()
    )
    .then(function() {

      return res.status(200).json(category);
    })
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

// Deletes a category from the DB.
exports.destroy = function(req, res) {
  var categoryId = req.params.id;

  return Q(
    Category.findById(categoryId)
    .exec()
  )
  .then(function(category) {
    if(!category) { 
      return res.send(404); 
    }

    function deleteRelatedCampuses() {
      _.each(category.recipes, function(recipe) {

        return Q(
          recipe.remove()
        )
      });
    }

    return Q.all([
      category.remove(),
      deleteRelatedCampuses()
    ])
    .then(function() {

      return res.sendStatus(204);
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}