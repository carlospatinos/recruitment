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

router.get('/master', function(req, res, next) {
  

  Candidate.find({status: "To be reviewed"}, function(err, candidates) {
    if (err) throw err;
    res.render('multipleMasterView', { title: 'Master View', candidates: candidates  });
  });
});

router.get('/register', function(req, res, next) {
  var emptyCandidate = new Candidate({}).clear();

  if (req.query.id) {
    Candidate.find({_id: req.query.id}, function(err, candidates) {
      if (err) 
      	res.render('registerCandidate', { title: 'Candidate Registration', candidate: emptyCandidate, error: 'Unable to find candidate' }); 
      else 
  	    res.render('registerCandidate', { title: 'Candidate Registration', candidate: candidates[0]});  
    });
  } else {
  	res.render('registerCandidate', { title: 'Candidate Registration', candidate: emptyCandidate });  
  }
  
});

router.get('/multiple', function(req, res, next) {
  Candidate.find({status: "To be reviewed"}, function(err, candidates) {
    if (err) throw err;

    res.render('multipleCandidatesUploadedView', { title: 'Candidates to be reviewed', candidates: candidates });
  });
  
});

router.get('/score', function(req, res, next) {

  Candidate.find({_id: req.query.id}, function(err, candidates) {
      if (err) { 
      	res.render('registerCandidate', { title: 'Candidate Registration', candidate: emptyCandidate, error: 'Unable to find candidate' }); 
      } else {
       if (req.query.type=='java') {
         res.render('feedbackToCandidate', { title: 'Java Test Results', testName: 'Java', candidate: candidates[0] });
       } else if (req.query.type=='interview') {
         res.render('feedbackToCandidate', { title: 'Interview Results', testName: 'Interview', candidate: candidates[0] });
       } else if (req.query.type=='team') {
         res.render('feedbackToCandidate', { title: 'Team excersise', testName: 'Team excersise', candidate: candidates[0] });
       } 
     }
  });

});


module.exports = router;
