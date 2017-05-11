var express = require('express');
var router = express.Router();
var multer  =   require('multer');
var dateFormat = require('dateformat');

var SEPARATOR = "-";
var maxSize = 32 * 1000 * 1000;

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
var upload = multer({ 
	storage : storage, 
	limits: { fileSize: 5 * 1024 * 1024}, // 5 mb
	fileFilter: fileFilter
}).array('candidateCVs',20);

router.post('/api/cv',function(req,res){
    upload(req,res,function(err) {
        //console.log(req.body);
        console.log(req.files);
        if(err) {
        	console.log(err)
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

module.exports = router;
