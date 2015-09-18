"use strict";

var _ = require("lodash");
var Category = require("../category/category.model");
var Q = require("q");
var CONSANTS = require("../../lib/constants");
var USER_ROLES = CONSANTS.USER_ROLES;

// Get list of recipes
exports.index = function(req, res) {
  // return Q(
  //   Category.find()
  //   .exec()
  // )
  // .then(function(categories) {
  //   var sidebar = [
  //     {
  //       "text": "Categories",
  //       "heading": "true"
  //     }
  //   ];

  //   _.each(categories, function(category) {
  //     sidebar.push({
  //       "text": category.name,
  //       "sref": "mainCategory",
  //       "params": { "categoryId": category.urlName },
  //       "icon": category.sidebarIcon,
  //       "alert": category.recipes.length,
  //       "label": "label label-success"
  //     });
  //   });

  //   return res.status(200).json(sidebar);
  // })
  // .fail(function(err) {

  //   return handleError(res, err);
  // });
  // if (req.user && req.user.role === USER_ROLES.ADMIN) {
    var sidebar = [
      {
        "text": "Admin Sidebar",
        "heading": "true"
      },
      {
        "text": "Manage Schools",
        "sref": "adminManageSchools",
        // "params": { "categoryId": category.urlName },
        "icon": "icon-speedometer"
      }
    ];

    return res.status(200).json(sidebar);
  // }
};