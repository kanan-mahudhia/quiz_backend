var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CandidateSchema = new Schema({
  name:  String,
  email:  String,
  password:  String
}, { collection: 'cl_candidate' });

mongoose.model('cl_candidate', CandidateSchema);

module.exports = mongoose.model('cl_candidate');