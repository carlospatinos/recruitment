// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var candidateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  college: String,
  collegeResults: String,
  address: String,
  cvLocation: String,
  status: String,
  interviewDate: Date,
  companyScore: String,
  created_at: Date,
  updated_at: Date
});


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