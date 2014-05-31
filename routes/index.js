var models = require('../models');

exports.professorView = function(req, res) {
  res.render('survey', {professor: 1});
};

exports.studentView = function(req, res) {
  res.render('survey', {student: 1});
};

exports.welcome = function(req, res) {
  res.render('welcome');
};
