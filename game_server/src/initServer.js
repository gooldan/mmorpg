const _ = require("lodash"),
  Location = require('./models/Location');

module.exports = async (callback) => {
  var fs = require('fs');
  fs.readFile('./map.txt', "utf8", (err, data) => {
    var splitData = data.split('\n')
    var map = _.times(splitData[0].length, () => _.times(splitData.length, _.constant(null)))
    for (var i = 0; i < splitData.length; i++) {
      var splitSplitData = splitData[i].split('')
      for (var j = 0; j < splitData[i].length; j++) {
        map[i][j] = { type: 0, id: splitSplitData[j] == '0' ? 0 : 1 }
      }
    }
    Location.findOne({ name: "forest" }, (err, location) => {

      if (location) {
        const entities = []
        for (let i = 0; i < location.entity.length; i++) {
          entities.push({
            id: location.entity[i]._id,
            type: location.entity[i].type,
            position: location.entity[i].position
          })
          map[location.entity[i].position.x][location.entity[i].position.y] = {
            type: location.entity[i].type,
            id: location.entity[i]._id
          }
        }
        callback(map, entities)

      }
    })
  })



}

