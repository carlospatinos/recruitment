var express = require('express');
var router = express.Router();

var Candidate = require('../models/candidate');

var statusOptions = [ 'to be reviewed', 'results needed', 'interview to be scheduled', 'regret', 'withdrew', 'interview to be schedule', 'acceped'];


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload', function(req, res, next) {
  res.render('uploadcv', { title: 'Upload CV', selected: 'upload' });
});

router.get('/master', function(req, res, next) {
  

  Candidate.find( { }, function(err, candidates) {
    if (err) throw err;
    res.render('multipleMasterView', { title: 'Master View', candidates: candidates, selected: 'master'  });
  });
});

router.get('/register', function(req, res, next) {
  var emptyCandidate = new Candidate({}).clear();
  var candidateId = req.query.id;
  if (candidateId) {
    Candidate.find({_id: candidateId}, function(err, candidates) {
      if (err) 
      	res.render('registerCandidate', { title: 'Candidate Registration', candidate: emptyCandidate, statusOptions: statusOptions, error: 'Unable to find candidate', selected: 'register' }); 
      else 
  	    res.render('registerCandidate', { title: 'Candidate Registration', candidate: candidates[0], statusOptions: statusOptions, selected: 'register'  } );  
    });
  } else {
  	res.render('registerCandidate', { title: 'Candidate Registration', candidate: emptyCandidate, statusOptions: statusOptions, selected: 'register'  });  
  }
  
});

router.post('/register', function(req, res, next) {
  var dataFromCandidate = new Candidate({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    college: req.body.college,
    collegeResults: req.body.collegeResults,
    address: req.body.address,
    cvLocation: req.body.cvLocation,
    status: req.body.status,
    interviewDater: req.body.interviewDa,
    javaTestResult: req.body.javaTestResult,
    javaTestComments: req.body.javaTestComments,
    javaTestInterviewer: req.body.javaTestInterviewer,
    javaTestHire: req.body.javaTestHire,
    interviewResults: req.body.interviewResults,
    interviewComments: req.body.interviewComments,
    interviewInterviewer: req.body.interviewInterviewer,
    interviewHire: req.body.interviewHire,
    teamExerciseResults: req.body.teamExerciseResults,
    teamExerciseComments: req.body.teamExerciseComments,
    teamExerciseInterviewer: req.body.teamExerciseInterviewer,
    teamExerciseHire: req.body.teamExerciseHire,
    aptitudeTest: req.body.aptitudeTest
  });


  var upsertData = dataFromCandidate.toObject();
  console.log(upsertData);

  var candidateId = req.body.candidateId;

  console.log("req.query.id" + candidateId);
  if (candidateId) {
    delete upsertData._id;
    
    Candidate.findOneAndUpdate({ _id: candidateId }, upsertData, {upsert:true}, function(err, doc){
      if (err) {
        console.log(err);
        res.render('registerCandidate', { title: 'Candidate Registration', candidate: dataFromCandidate, statusOptions: statusOptions, error: 'Unable to find candidate', selected: 'register' }); 
        //return res.send(500, { error: err });
      } else {
        res.render('registerCandidate', { title: 'Candidate Registration', candidate: '', error: 'Exito', statusOptions: statusOptions, selected: 'register' }); 
      }
    });
  } else {
    dataFromCandidate.save(function(err) {
      if (err) {
        res.render('registerCandidate', { title: 'Candidate Registration', candidate: dataFromCandidate, statusOptions: statusOptions, error: 'Unable to find candidate', selected: 'register' }); 
      } else {
        console.log('Candidate created!');
        res.render('registerCandidate', { title: 'Candidate Registration', candidate: '', error: 'Exito', statusOptions: statusOptions, selected: 'register' }); 
      }
    });
  }
  
});


router.get('/profile', function(req, res, next) {
  var emptyCandidate = new Candidate({}).clear();

  var data = [
    {
      className: 'germany', // optional can be used for styling
      axes: [
        {axis: "Java Test", value: 2 }, 
        {axis: "Team Excersise", value: 4 }, 
        {axis: "Interview", value: 3 },  
        {axis: "Standar test", value: 1 },  
        {axis: "School grades", value: 2 }
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
      if (err) { 
      	res.render('candidateProfile', { title: 'Candidate Registration', candidate: emptyCandidate, error: 'Unable to find candidate', data: data }); 
      } else {
  	    res.render('candidateProfile', { title: 'Candidate Registration', candidate: candidates[0], data: data });  
  	  }
    });
  } else {
  	res.render('candidateProfile', { title: 'Candidate Profile', candidate: emptyCandidate, error: 'Invalid candidate id' });  
  }
  
});



router.get('/multiple', function(req, res, next) {
  console.log(req.body);
  Candidate.find({status: "To be reviewed"}, function(err, candidates) {
    if (err) throw err;

    res.render('multipleCandidatesUploadedView', { title: 'Candidates to be reviewed', candidates: candidates, selected: 'multiple' });
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
