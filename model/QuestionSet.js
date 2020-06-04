var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QueSetSchema = new Schema({
  questions: Array //array of question ids form question collection
}, { collection: 'cl_que_set' });

mongoose.model('cl_que_set', QueSetSchema);

module.exports = mongoose.model('cl_que_set');