var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var LocationScheme = new Schema({
    name: { type: String },
    width: { type: Number },
    height: { type: Number },
    entity: [{
        type: { type: Number },
        id: { type: Number },
        position: {
            x: { type: Number },
            y: { type: Number }
        },
        states: {
        }
    }],

    max_players: { type: Number, default: 4 }
});

export let LocationModel = mongoose.model('Location', LocationScheme);