'use strict';

var _ = require('lodash');
// var Recipe = require('../recipe/recipe.model');
var User = require('../user/user.model');

// // Get list of recipes
// exports.index = function(req, res) {
//   Recipe.find(function (err, recipes) {
//     if(err) { return handleError(res, err); }
//     return res.json(200, recipes);
//   });
// };

// // Get a single recipe
// exports.show = function(req, res) {
//   Recipe.findById(req.params.id, function (err, recipe) {
//     if(err) { return handleError(res, err); }
//     if(!recipe) { return res.send(404); }
//     return res.json(recipe);
//   });
// };

// // Creates a new recipe in the DB.
// exports.create = function(req, res) {
//   var newRecipe = req.body;
//   var userId = req.user._id;
//   newRecipe.publisher = userId;

//   Recipe.create(newRecipe, function(err, recipe) {
//     if(err) { return handleError(res, err); }

//     User.findById(userId)
//     .exec()
//     .then(function(user) {
//       user.publisher.recipes.push(recipe._id);

//       user.save(function (err) {
//         if (err) { return handleError(res, err); }

//         return res.json(201, recipe);
//       });
//     });
//   });
// };

// // Updates an existing recipe in the DB.
// exports.update = function(req, res) {
//   if(req.body._id) { delete req.body._id; }
//   Recipe.findById(req.params.id, function (err, recipe) {
//     if (err) { return handleError(res, err); }
//     if(!recipe) { return res.send(404); }
//     var updated = _.merge(recipe, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.json(200, recipe);
//     });
//   });
// };

// // Deletes a recipe from the DB.
// exports.destroy = function(req, res) {
//   Recipe.findById(req.params.id, function (err, recipe) {
//     if(err) { return handleError(res, err); }
//     if(!recipe) { return res.send(404); }
//     recipe.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.send(204);
//     });
//   });
// };

function handleError(res, err) {
  return res.send(500, err);
}

// Get all recipes that were published by a specific pablisher
exports.getPublisherRecipes = function(req, res) {
  User.find()
  .where("_id").equals(req.params.publisherId)
  .populate("publisher.recipes")
  .exec(function(recipes, err) {
    if(err) { return handleError(res, err); }
    return res.json(200, recipes);
  });
};