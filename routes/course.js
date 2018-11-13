var express = require('express');
var router = express.Router();
var multer = require('multer');
var Teacher = require('../model/Teacher');
var Course = require('../model/Course');
var upload = multer({ dest:'public/images/uploads'});

router.get('/add', function(req, res, next) {
  Teacher.find({},(err,rtn)=>{
    if(err) throw err;
    console.log(rtn);
    res.render('course/course-add', { teacher: rtn });
  })

});
router.post('/add', upload.single('photo'), function(req, res, next) {
  console.log('call');
  var course = new Course();
  course.name = req.body.cName;
  course.teacher_id = req.body.tName;
  if(req.file) course.imgUrl = '/images/uploads/' + req.file.filename;
  course.fee = req.body.fee;
  course.week = req.body.week;
  course.days = req.body.days;
  course.start = req.body.start;
  course.end = req.body.end;
  course.seats = req.body.seats;
  console.log('call2');
  var count = Number(req.body.czContainer_czMore_txtCount);
  console.log(count);
  var c = course;
  for (var i = 1; i <= count; i++) {
    console.log('loop',i);
    var ctemp = "course_"+i+"_name";
    var vtemp = "detail_"+i+"_name";
    console.log(ctemp,vtemp);
    course.coutline.push({
      course : req.body[ctemp],
      detail : req.body[vtemp]
    });
  }
  console.log('call3');
  course.save((err,rtn)=>{
    if(err) throw err;
    console.log(rtn);
    res.json({ status: true, msg: 'success'});
  });
});

router.get('/list',(req,res)=>{
  Course.find({}).populate('teacher_id').exec((err,rtn)=>{
    if(err) throw err;
    res.render('course/course-list',{course:rtn});
  });
});
module.exports = router;
