var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CandidateQueAnsSchema = new Schema({
  candidate_id: Schema.Types.ObjectId,
  que_set_id: Schema.Types.ObjectId,
  questionAnswers: Array,
  time_taken: String,
  attempted: Number,
  obtained_marks: Number
}, { collection: 'cl_candidate_que_ans' });

mongoose.model('cl_candidate_que_ans', CandidateQueAnsSchema);

module.exports = mongoose.model('cl_candidate_que_ans');