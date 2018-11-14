var mongoose = require('mongoose'); //mongodb module
var dateformat = require('dateformat');
var bcrypt = require('bcrypt-nodejs');
//Define a schama
var Schema = mongoose.Schema;
var TeacherSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true //remove both-side with space
  },
  phone: {
    type: String,
    trim: true
  },
  imgUrl:{
    type: String
  },
  email:{
    type: String,
    required:true,
  },
  facebook:{
    type: String,
    required:true,
  },
  desc:{
    type: String,
    required:true,
  },
  job:{
    type: String,
    required:true,
  },
  password:{
    type: String,
    required: true,
    trim: true
  },
  updated:{
    type: Date,
    default:Date.now
  },
  instered:{
    type: Date,
    default:Date.now
  },
});

TeacherSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8),null);
  next();
});
//hashing a password before saving it to the database
TeacherSchema.virtual('updated_date').get(function () {
  return dateformat(this.updated, 'dd/mm/yyyy HH:MM');
});

TeacherSchema.virtual('inserted_date').get(function () {
  return dateformat(this.inserted, 'dd/mm/yyyy HH:MM');
});

TeacherSchema.statics.compare = function (cleartext,encrypted) {
  return bcrypt.compareSync(cleartext,encrypted);
};
module.exports =mongoose.model('Teachers',TeacherSchema);
