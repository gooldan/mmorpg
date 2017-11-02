var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var GameServer = new Schema({
   ip: {type: String},
   port: {type: Number},
   locations: [{type: ObjectId}]
});

module.exports = mongoose.model('GameServer', GameServer);