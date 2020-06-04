var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  question: String,
  answer_options: JSON // options of the question with true/false value of isCorrect key
}, { collection: 'cl_question' });

mongoose.model('cl_question', QuestionSchema);

module.exports = mongoose.model('cl_question');