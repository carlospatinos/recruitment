var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload', function(req, res, next) {
  res.render('uploadcv', { title: 'Upload CV' });
});

router.get('/register', function(req, res, next) {
  res.render('registerCandidate', { title: 'Candidate Registration' });
});

router.get('/multiple', function(req, res, next) {
  res.render('multipleCandidatesView', { title: 'Multiple Candidate View' });
});


module.exports = router;
