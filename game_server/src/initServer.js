const _ = require("lodash")

module.exports = function() {
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
    });
}

