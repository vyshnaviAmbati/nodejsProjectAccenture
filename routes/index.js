var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var width = Number(req.query.width) || 800;
  var height = Number(req.query.height) || 500;

  width = Math.min(Math.max(Math.round(width), 1), 5000);
  height = Math.min(Math.max(Math.round(height), 1), 5000);

  res.render('index', { title: 'Himalayas Image Resizer', width: width, height: height });
});

module.exports = router;
