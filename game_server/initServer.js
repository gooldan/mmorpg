import _ from "lodash"

module.exports = function() {
    var fs = require('fs');
    fs.readFile('./map.txt', "utf8", function(err, data) {
        var splitData = data.split('\r\n');
        var map = _.times(splitData[0].length, () => _.times(splitData.length, _.constant(null)))
        for (var i = 0; i < splitData.length; i++)
        {
            //map.Add
        }
    });
}

