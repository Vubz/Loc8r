var express = require('express');

module.exports.index=function (req,res) {
  res.render('index',{title: 'Express' });
};
