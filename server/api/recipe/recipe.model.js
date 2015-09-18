'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RecipeSchema = new Schema({
  name: String,
  ingredients: String,
  preparation: String,
  urlName: String,
  YouTubeKey: String,
  categories: [{
  	type: Schema.Types.ObjectId,
	ref: "Category"
  }],
  publisher: {
	type: Schema.Types.ObjectId,
	ref: "User"
  },
  components: [{
  	name: String,
  	ingredients: [String],
  	preparation: [String],
  }]
});

module.exports = mongoose.model('Recipe', RecipeSchema);
