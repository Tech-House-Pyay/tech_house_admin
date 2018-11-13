var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // if(req.session.user){
    res.render('index', { title: 'Express' });
  // }else {
  //   res.render('common/signin')
  // }

});
router.get('/signin', function(req, res, next) {
  res.render('common/signin', { title: 'Express' });
});

router.post('/signin',function (req, res, next) {
  if(req.body.loginUsername == "TechHouse@admin" && req.body.loginPassword == "Tech@House!001"){
    res.cookie('admin', req.body.loginUsername);
    req.session.user = { name: req.body.loginUsername};
    res.redirect('/')
  }else {
    res.render('common/signin');
  }
})

module.exports = router;
