// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var candidateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  phoneNumber: String,
  email: String,
  college: String,
  collegeResults: String,
  address: String,
  cvLocation: String,
  status: String,
  interviewDate: Date,
  javaTestResult: String,
  javaTestComments: String,
  javaTestInterviewer: String,
  javaTestHire: String,
  interviewResults: String,
  interviewComments: String,
  interviewInterviewer: String,
  interviewHire: String,
  teamExerciseResults: String,
  teamExerciseComments: String,
  teamExerciseInterviewer: String,
  teamExerciseHire: String,
  aptitudeTest: String,
  created_at: Date,
  updated_at: Date
});

candidateSchema.methods.clear = function() {
  this.name= '';
  this.phoneNumber= '';
  this.email= '';
  this.college= '';
  this.collegeResults= '';
  this.address= '';
  this.cvLocation= '';
  this.status= '';
  this.javaTestResult= '';
  this.javaTestComments= '';
  this.interviewResults= '';
  this.interviewComments= '';
  this.teamExerciseResults= '';
  this.teamExerciseComments= '';
  this.javaTestInterviewer = '';
  this.interviewInterviewer='';
  this.teamExerciseInterviewer='';
  this.javaTestHire='';
  this.interviewHire='';
  this.teamExerciseHire='';
  this.aptitudeTest='';
  return this;
}

// on every save, add the date
candidateSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});


// the schema is useless so far
// we need to create a model using it
var Candidate = mongoose.model('Candidate', candidateSchema);

// make this available to our users in our Node applications
module.exports = Candidate;