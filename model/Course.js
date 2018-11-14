var mongoose = require('mongoose'); //mongodb module
var dateformat = require('dateformat');
//Define a schama
var Schema = mongoose.Schema;
var CourseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true //remove both-side with space
  },
  teacher_id:{
    type: Schema.Types.ObjectId,
    ref: 'Teachers',
  },
  imgUrl:{
    type: String,
    required: true
  },
  fee:{
    type: String,
    required:true,
  },
  week:{
    type: Number,
    required:true,
  },
  days:[],
  start:{
    type: String,
    required:true,
  },
  seats:{
    type: Number,
    required:true,
  },
  end:{
    type: String,
    required: true,
  },
  status:{
    type: String,
    default: '00', // 00 is Available,01 is Not Available
    required:true,
  },
  desc:{
    type: String,
    required: true,
  },
  coutline:[{
      course:{
        type: String,
        required: true
      },
      detail:{
          type: String,
          required: true,
      }
  }],
  updated:{
    type: Date,
    default:Date.now
  },
  instered:{
    type: Date,
    default:Date.now
  },
});

//hashing a password before saving it to the database
CourseSchema.virtual('updated_date').get(function () {
  return dateformat(this.updated, 'dd/mm/yyyy HH:MM');
});

CourseSchema.virtual('inserted_date').get(function () {
  return dateformat(this.inserted, 'dd/mm/yyyy HH:MM');
});

module.exports =mongoose.model('Courses',CourseSchema);
