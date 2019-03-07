var express = require('express');
var router = express.Router();
var multer = require('multer');
const path = require('path');
var mongoose = require('mongoose');
var Teacher = require('../model/Teacher');
var Course = require('../model/Course');
// var upload = multer({ dest:'public/images/uploads'});
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');

const mongoURI = 'mongodb://yethuaung:zikimi95@ds163013.mlab.com:63013/techhousedb';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });
router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});
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
  if(req.file) course.imgUrl = req.file.filename;
  course.fee = req.body.fee;
  course.week = req.body.week;
  course.days = req.body.days;
  course.start = req.body.start;
  course.end = req.body.end;
  course.desc = req.body.desc;
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
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('index', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      Course.find({}).populate('teacher_id').exec((err,rtn)=>{
        if(err) throw err;
        res.render('course/course-list',{course:rtn,files:files});
  });
}
});
});

router.get('/update/:id',(req,res)=>{
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('index', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      Course.findById(req.params.id,(err,rtn)=>{
        if(err) throw err;
        Teacher.find({},(err2,rtn2)=>{
          if(err2) throw err2;
          res.render('course/course-update',{course:rtn,files:files, teacher: rtn2})
        });
  });
}
});
});
router.post('/update',upload.single('photo'),(req,res)=>{
  var update = {
    _id: req.body.id,
    name: req.body.name,
    teacher_id: req.body.teacher_id,
    fee: req.body.fee,
    week: req.body.week,
    days: req.body.days,
    start: req.body.start,
    seats: req.body.seats,
    end: req.body.end,
    status: req.body.status,
    desc: req.body.desc,
  }
  if(req.file) update.imgUrl= req.body.imgUrl,
  Course.findByIdAndUpdate(req.body.id,{
    $set: update
  },(err,rtn)=>{
    if(err) throw err;
    console.log(rtn._id, req.body.id);
    res.json({ status: true, msg: 'success'});
  });
});
module.exports = router;
