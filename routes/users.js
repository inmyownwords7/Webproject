const express = require('express');
const router = express.Router();
const passport =require('passport');
const User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
