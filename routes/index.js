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


router.get('/profile', function(req, res, next) {
  var emptyCandidate = new Candidate({}).clear();

  var data = [
    {
      className: 'germany', // optional can be used for styling
      axes: [
        {axis: "Java Test", value: 13, yOffset: 10}, 
        {axis: "Team Excersise", value: 6}, 
        {axis: "Interview", value: 5},  
        {axis: "Standar test", value: 9},  
        {axis: "School grades", value: 2, xOffset: -20}
      ]
    }
    /*,
    {
      className: 'argentina',
      axes: [
        {axis: "strength", value: 6}, 
        {axis: "intelligence", value: 7}, 
        {axis: "charisma", value: 10},  
        {axis: "dexterity", value: 13},  
        {axis: "luck", value: 9}
      ]
    }*/
  ];

  if (req.query.id) {
    Candidate.find({_id: req.query.id}, function(err, candidates) {
      if (err) 
      	res.render('candidateProfile', { title: 'Candidate Registration', candidate: emptyCandidate, error: 'Unable to find candidate', data: data }); 
      else 
  	    res.render('candidateProfile', { title: 'Candidate Registration', candidate: candidates[0], data: data });  
    });
  } else {
  	res.render('candidateProfile', { title: 'Candidate Registration', candidate: emptyCandidate, data: data });  
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
