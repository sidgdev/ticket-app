var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Respond with a resource.');
});

router.get('/cool', function(req, res, next) {
  res.send('very cool');
});

module.exports = router;
