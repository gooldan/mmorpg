var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Cell = new Schema({
   x: {type: Number, default: 0},
   y: {type: Number, default: 0},
   busy: {type: Boolean, default: false},
});

module.exports = mongoose.model('Cell', Cell);