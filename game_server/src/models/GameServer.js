var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var GameServerScheme = new Schema({
   ip: {type: String},
   port: {type: Number},
   locations: [{type: ObjectId}]
});

export let GameServer = mongoose.model('GameServer', GameServerScheme);