var express = require('express');
var router = express.Router();

var Candidate = require('../models/candidate');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload', function(req, res, next) {
  res.render('uploadcv', { title: 'Upload CV' });
});

router.get('/register', function(req, res, next) {
  Candidate.find({_id: req.query.id}, function(err, candidates) {
    if (err) throw err;

	res.render('registerCandidate', { title: 'Candidate Registration', candidates: candidates});  });
});

router.get('/multiple', function(req, res, next) {
  Candidate.find({status: "To be reviewed"}, function(err, candidates) {
    if (err) throw err;
  
    // object of all the users
    console.log(candidates);

    res.render('multipleCandidatesUploadedView', { title: 'Candidates to be reviewed', candidates: candidates });
  });
  
});


module.exports = router;
