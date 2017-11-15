const _ = require("lodash");
import { LocationModel } from "./../models/Location"
import { GameEngine } from "./../engine/GameEngine"
import { Space } from "./../engine/space"

export class Location {
    constructor(locationID) {
        this.id = locationID
        this.map = undefined
        this.loadMap = false
        this.gameEngine = new GameEngine()
        this.objects = [{}, {}, {}, {}, {}]
        this.currentSpace = undefined
        this.mountains = []
        this.width = 0
        this.height = 0

        this.initMap(() => {
            this.width = this.map[0].length
            this.height = this.map.length
            this.currentSpace = new Space(this.width, this.height)
            this.currentSpace.loadMap(this.map)
            this.gameEngine.LoadSpace(this.currentSpace)
            this.loadMap = true
        })
    }

    initMap(callback) {
        this.readMapFile(() => {this.readDB(callback)})
    }


    readMapFile(callback) {
        var fs = require('fs');
        fs.readFile('./' + this.id + '.txt', "utf8", (err, data) => {
            data = data.replace(/\r/g, '')
            var splitData = data.split('\n')
            this.map = _.times(splitData[0].length, () => _.times(splitData.length, _.constant(null)))
            for (var i = 0; i < splitData.length; i++) {
                var splitSplitData = splitData[i].split('')
                for (var j = 0; j < splitData[i].length; j++) {
                    if (splitSplitData[j] === '1') {
                        this.map[j][i] = { type: 3 }
                        this.mountains.push({
                            type: 3,
                            position: {
                                x: j,
                                y: i
                            }
                        })
                    }
                    else {
                        this.map[j][i] = { type: 0 }
                    }
                }
            }
            callback()
        })
    }

    readDB(callback) {
        LocationModel.findOne({ _id: this.id }, (err, location) => {
            if (location) {
                for (let i = 0; i < location.entity.length; i++) {
                    this.objects[location.entity[i].type][location.entity[i]._id] = location.entity[i]
                    this.map[location.entity[i].position.x][location.entity[i].position.y] = {
                        type: location.entity[i].type,
                        id: location.entity[i]._id
                    }
                }
                callback()
            }
        })
    }




}
