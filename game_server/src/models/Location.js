var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Location = new Schema({
   name: {type: String},
   width: {type: Number},
   height: {type: Number},
   entity: [{
      type: {type: Number},
      id: {type: Number},
      position: {
         x: {type: Number},
         y: {type: Number}
      }
   }],
   max_players: {type: Number, default: 4}
});

module.exports = mongoose.model('Location', Location);