'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: String,
  urlName: String,
  imgYouTubeKey: String,
  sidebarIcon: String,
  recipes: [{
    type: Schema.Types.ObjectId,
    ref: "Recipe"
  }]
});

module.exports = mongoose.model('Category', CategorySchema);
