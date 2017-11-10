const _ = require("lodash");
import {Location} from "./models/Location"

export let InitLocation = async (locationID, callback) => {
  var fs = require('fs');
  fs.readFile('./' + locationID + '.txt', "utf8", (err, data) => {
    data = data.replace(/\r/g, '')
    var splitData = data.split('\n')
    var map = _.times(splitData[0].length, () => _.times(splitData.length, _.constant(null)))
    const entities = []
    const mountains = []
    for (var i = 0; i < splitData.length; i++) {
      var splitSplitData = splitData[i].split('')
      for (var j = 0; j < splitData[i].length; j++) {
        if (splitSplitData[j] === '1') {
          map[j][i] = {type: 3}
          mountains.push({
            type: 0, 
            _id: 1,
            position: {
              x: j,
              y: i
            }
          })
        }
        else {
          map[j][i] = {type: 0}
        }
      }
    }
    Location.findOne({ _id: locationID }, (err, location) => {

      if (location) {
        for (let i = 0; i < location.entity.length; i++) {
          entities.push(location.entity[i])
          map[location.entity[i].position.x][location.entity[i].position.y] = {
            type: location.entity[i].type,
            id: location.entity[i]._id
          }
        }
        callback(map, entities, mountains)

      }
    })
  })



}

