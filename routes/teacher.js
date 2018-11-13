var express = require('express');
var router = express.Router();
var multer = require('multer');
var Teacher = require('../model/Teacher');
var upload = multer({ dest:'public/images/uploads'});

/* GET users listing. */
router.get('/add', function(req, res, next) {
  res.render('teacher/teacher-add')
});

router.post('/add',upload.single('photo'), function(req, res, next) {
  var teacher  = new Teacher();
  teacher.name = req.body.tName;
  teacher.email = req.body.email;
  if(req.file) teacher.imgUrl = '/images/uploads/' + req.file.filename;
  teacher.phone = req.body.phone;
  teacher.facebook = req.body.facebook;
  teacher.job = req.body.job;
  teacher.password = req.body.password;
  teacher.save((err,rtn)=>{
    if(err) throw err;
    res.json({ status: true, msg: 'success'});
  });
});

router.get('/list',(req,res)=>{
  Teacher.find({},(err,rtn)=>{
    if(err) throw err;
    res.render('teacher/teacher-list',{tea:rtn});
  })

})

module.exports = router;
