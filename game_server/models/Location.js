var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Location = new Schema({
   name: {type: String},
   weather: {type: Number},
   max_players: {type: Number, default: 4}
});

module.exports = mongoose.model('Location', Location);