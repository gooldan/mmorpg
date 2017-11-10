var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var ItemScheme = new Schema({
   name: {type: String, require: true},
   item_type: {type: Number, default: 0},
   damage: {type: Number, default: 1},
   cost: {type: Number, default: 1}
});

export let Item = mongoose.model('Item', ItemScheme);