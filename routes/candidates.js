var express = require('express');
var router = express.Router();
var multer  =   require('multer');
var dateFormat = require('dateformat');

var SEPARATOR = "-";
var maxSize = 32 * 1000 * 1000;


var Candidate = require('../models/candidate');

function processName(file){
	var json = {};
	var fileOriginalName = file.originalname;
  	var fileExtension = fileOriginalName.substring(fileOriginalName.lastIndexOf('.'), fileOriginalName.length);
  	var fileNameNoExtension = fileOriginalName.substring(0, fileOriginalName.lastIndexOf('.'));
  	json.filenameLocation = fileNameNoExtension + '_' + dateFormat(Date.now(), "yyyy-mm-dd") + fileExtension;
  	var details = fileNameNoExtension.split(SEPARATOR);

  	json.filePath = file.path
  	// Name
  	if(details.length == 1) {
  		json.name = details[0];
  	} else if (details.length == 2) {
		json.name = details[0];
		json.college = details[1];
  	} else if (details.length == 3) { 
  		json.name = details[0];
  		json.college = details[1];
  		json.collegeResults = details[2];
  	} else {
  		json.name = fileOriginalName;
  	}

  	return json;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

function fileFilter (req, file, cb) {
  if (file.mimetype !== 'application/pdf' && file.mimetype !== 'application/msword' && file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
     cb(new Error('Invalid file type'))
  }
  cb(null, true);
}

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
  	var json = processName(file);
    callback(null, json.filenameLocation);
  }
});

var upload = multer({ 
	storage : storage,
	limits: { fileSize: 5 * 1024 * 1024}, // 5 mb
	fileFilter: fileFilter
}).array('candidateCVs',20);

function uploadData(req,res, next){
    upload(req,res,function(err) {
        //console.log(req.body);
        //console.log(req.files);

        var files = req.files;
        var candidates = [];
        for (var i = 0; i < files.length; i++) { 

        	var json = processName(files[i]);

        	var newUser = Candidate({
			  name: json.name,
			  phoneNumber: "",
			  email: "",
			  college: json.college,
			  collegeResults: json.collegeResults,
			  cvLocation: "http://" + req.headers.host + json.filePath.replace('public', ''),
			  status: "To be reviewed" //TODO define some enum for status to be reviwed -> schedule interview or regret -> interview scheduled -> propose to hire -> on site
			});

			newUser.save(function(err) {
  			  if (err) throw err;
  			  console.log('Candidate created!');
			});

			candidates.push(newUser);
        }

        if(err) {
        	console.log(err)
            return res.end("Error uploading file.");
        }

        res.redirect("/multiple")
        
    });
};

router.post('/api/cv', uploadData);

module.exports = router;
