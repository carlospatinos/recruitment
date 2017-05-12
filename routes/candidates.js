var express = require('express');
var router = express.Router();
var multer  =   require('multer');
var dateFormat = require('dateformat');

var SEPARATOR = "-";
var maxSize = 32 * 1000 * 1000;

function processName(file){
	var json = {};
	var fileOriginalName = file.originalname;
  	var fileExtension = fileOriginalName.substring(fileOriginalName.lastIndexOf('.'), fileOriginalName.length);
  	var fileNameNoExtension = fileOriginalName.substring(0, fileOriginalName.lastIndexOf('.'));
  	json.filenameLocation = fileNameNoExtension + '_' + dateFormat(Date.now(), "yyyy-mm-dd") + fileExtension;
  	var details = fileNameNoExtension.split(SEPARATOR);


  	// Name
  	if(details.length == 1) {
  		json.name = details[0];
  	} else if (details.length == 2) {
		json.name = details[0];
		json.college = details[1];
  	} else if (details.length == 3) { 
  		json.name = details[0];
  		json.college = details[1];
  		json.grade = details[2];
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

router.post('/api/cv',function(req,res){
    upload(req,res,function(err) {
        console.log(req.body);
        console.log(req.files);

        var obj = req.files;
        for (var i = 0; i < obj.length; i++) { 
        	console.log(obj[i].path)
        }

        if(err) {
        	console.log(err)
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

module.exports = router;
