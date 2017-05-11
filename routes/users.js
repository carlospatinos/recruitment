var express = require('express');
var router = express.Router();
var multer  =   require('multer');
var dateFormat = require('dateformat');

var SEPARATOR = "-";

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
  	//console.log(file);
  	var fileOriginalName = file.originalname;
  	var fileExtension = fileOriginalName.substring(fileOriginalName.lastIndexOf('.'), fileOriginalName.length);
  	var fileNameNoExtension = fileOriginalName.substring(0, fileOriginalName.lastIndexOf('.'));
  	var filenameLocation = fileNameNoExtension + '_' + dateFormat(Date.now(), "yyyy-mm-dd") + fileExtension;
  	var details = fileNameNoExtension.split(SEPARATOR);

  	var name = "";
  	var college = "";
  	var grade = "";

  	// Name
  	if(details.length == 1) {
  		name = details[0];
  	} else if (details.length == 2) {
		name = details[0];
		college = details[1];
  	} else if (details.length == 3) { 
  		name = details[0];
  		college = details[1];
  		grade = details[2];
  	} else {
  		name = file.originalname;
  	}
  	
  	console.log(name);

    callback(null, filenameLocation);
  }
});
var upload = multer({ storage : storage }).array('candidateCVs',20);
router.post('/api/cv',function(req,res){
    upload(req,res,function(err) {
        console.log(req.body);
        console.log(req.files);
        if(err) {
        	console.log(err)
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

module.exports = router;
