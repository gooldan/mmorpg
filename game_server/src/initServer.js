const _ = require("lodash"),
Location = require('./models/Location');

module.exports = function(callback) {
    var fs = require('fs');
    fs.readFile('./map.txt', "utf8", function(err, data) {
        var splitData = data.split('\n');
        var map = _.times(splitData[0].length, () => _.times(splitData.length, _.constant(null)))
        for (var i = 0; i < splitData.length; i++)
        {
            var splitSplitData = splitData[i].split('')
            for (var j = 0; j < splitData[i].length; j++)
            {
                map[i][j] = splitSplitData[i]
            }
        }

        Location.findOne({name: "forest"}, (err, location) => {
            if (location) {
                for (let i = 0; i < location.entity.length; i++) {
                    map[location.entity[i].position.x][location.entity[i].position.y] = location.entity[i].id
                }

                callback(map)
            }
        })
    });
}

