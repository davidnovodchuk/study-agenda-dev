"use strict";

var _ = require("lodash");
var Recipe = require("./recipe.model");
var User = require("../user/user.model");
var Category = require("../category/category.model");
var Q = require("q");

// Get list of recipes
exports.index = function(req, res) {
  return Q(
    Recipe.find()
    .exec()
  )
  .then(function (recipes) {
    
    return res.status(200).json(recipes);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Get a single recipe
exports.show = function(req, res) {

  return Q(
    Recipe.findOne()
    .where("urlName").equals(req.params.id)
    .exec()
  )
  .then(function(recipe) {
    if(!recipe) { 
      
      return Q(
        Recipe.findById(req.params.id)
        .exec()
      )
      .then(function(recipe) {
        if(!recipe) { 
          return res.send(404); 
        }

        return res.json(recipe);
      });
    }

    return res.json(recipe);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Creates a new recipe in the DB.
exports.create = function(req, res) {
  var newRecipe = req.body;
  var userId = req.user._id;
  newRecipe.publisher = userId;

  return Q(
    Recipe.create(newRecipe)
  )
  .then(function(recipe) {

    return Q.all([
      User.findById(userId)
      .exec(),
    
      Category.find()
      .where("_id").in(recipe.categories)
      .exec()
    ])
    .spread(function(user, categories) {

      user.publisher.recipes.push(recipe._id);

      function saveAllCategories(){
        _.each(categories, function(category) {
          category.recipes.push(recipe._id);

          return Q(
            category.save()
          )
        });
      }

      return Q.all([
        user.save(),
        saveAllCategories()
      ])
      .then(function () {

        return res.json(201, recipe);
      });
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

// Updates an existing recipe in the DB.
exports.update = function(req, res) {
  var recipeId = req.body._id;

  if(req.body._id) { 
    delete req.body._id; 
  }

  return Q(
    Recipe.findById(recipeId)
    .exec()
  )
  .then(function(recipe) {
    if(!recipe) { 
      return res.send(404); 
    }

    var updated = _.merge(recipe, req.body);

    return Q(
      updated.save()
    )
    .then(function() {

      return res.status(200).json(recipe);
    })
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

// Deletes a recipe from the DB.
exports.destroy = function(req, res) {
  var userId = req.user._id;
  var recipeId = req.params.id;

  return Q(
    Recipe.findById(recipeId)
    .exec()
  )
  .then(function(recipe) {
    if(!recipe) { 
      return res.send(404); 
    }

    return Q.all([
      User.findById(userId)
      .exec(),
    
      Category.find()
      .where("_id").in(recipe.categories)
      .exec()
    ])
    .spread(function(user, categories) {

      user.publisher.recipes.pull(recipe._id);

      function pullRecipeFromCategories(){
        _.each(categories, function(category) {
          category.recipes.pull(recipe._id);

          return Q(
            category.save()
          )
        });
      }

      return Q.all([
        user.save(),
        pullRecipeFromCategories()
      ])
      .then(function () {

        return Q(
          recipe.remove()
        )
        .then(function() {

          return res.send(204);
        })
      });
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}