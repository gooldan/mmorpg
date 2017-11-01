var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Profile = new Schema({
   local: {
      username: {type: String, required: true},
      password: {type: String, required: true},
      token: String
   },
   registration_date: {type: Date, default: Date.now},
   hero: {
      hp: {type: Number, min: 0, max: 100, default: 100},
      mana: {type: Number, min: 0, max: 100, default: 100},
      exp: {type: Number, min: 0, max: 100, default: 0},
      level: {type: Number, min: 1, max: 5, default: 1},
      location: {
         id: ObjectId,
         coordinates: {
            x: Number,
            y: Number
         }
      },
      equipment: {
         weapon: {
            id: ObjectId
         }
      },
      bag: {
         max_items: {type: Number, default: 10},
         items: [{type: ObjectId}]
      },
      money: {type: Number, default: 0}
   }
});