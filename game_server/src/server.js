const io = require('socket.io')(8081),
    mongoose = require('mongoose'),
    crypto = require('crypto');
import { Profile } from "./models/Profile"
import { Location } from "./models/Location"
import { GameEngine } from "./engine/GameEngine"
import { Space } from "./engine/space"
import { BaseObject } from "./entity/BaseObject"
import { InitLocation } from "./initServer"
mongoose.Promise = Promise;

mongoose.connect("mongodb://mmorpg:8fd5b96b4@ds123695.mlab.com:23695/mmorpg", {
    useMongoClient: true,
    promiseLibrary: global.Promise
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log(`Connected to Mongo at: ${new Date()}`)
});

const locationIDs = ["59fb0aef28e0065908e96705", "5a05dfa07b6c4117f8488834", "5a05e01cc698361eb8a94773"]


const Locations = {};

for (let id in locationIDs) {
    Locations[locationIDs[id]] = {
        map: undefined,
        loadMap: false,
        gameEngine: new GameEngine(),
        objects: [],
        currentSpace: undefined,
        mountains: []
    }
    InitLocation(locationIDs[id], (m, entities, mountains) => {
        Locations[locationIDs[id]].currentSpace = new Space(m[0].length, m.length)
        Locations[locationIDs[id]].map = m
        Locations[locationIDs[id]].currentSpace.loadMap(Locations[locationIDs[id]].map)
        Locations[locationIDs[id]].gameEngine.LoadSpace(Locations[locationIDs[id]].currentSpace)
        Locations[locationIDs[id]].loadMap = true
        Locations[locationIDs[id]].objects[0] = {}
        Locations[locationIDs[id]].objects[1] = {}
        Locations[locationIDs[id]].objects[2] = {}
        Locations[locationIDs[id]].objects[4] = {}
        for (let entity in entities) {
            Locations[locationIDs[id]].objects[entities[entity].type][entities[entity]._id] = entities[entity]
        }
        for (let im in mountains) {
            let mountain = mountains[im]
            Locations[locationIDs[id]].mountains.push(mountain)
        }

    })
}
let Servers = { host: 'localhost', port: '8081' }

io.on('connection', function (socket) {
    let user = undefined
    let locationID = undefined
    let location = undefined
    socket.on('login', (token) => {
        Profile.findOne({ 'local.token': token }, (err, u) => {
            if (u) {
                user = u;
                locationID = user.hero.location.id
                if (Locations[locationID].objects[2][user._id] !== undefined)
                    return
                location = Locations[locationID]

                socket.join(locationID)

                console.log(user._id + " CONNECTED. token: " + token)

                const position = user.hero.location.coordinates
                const newObject = new BaseObject(user._id, position.x, position.y, undefined, 2)

                location.currentSpace.addObject(newObject)
                location.objects[2][newObject.id] = newObject

                socket.emit("enterWorld", {
                    ret: "OK",
                    type: "enterWorld",
                    payload: {
                        objects: location.objects,
                        userObj: newObject,
                        mountains: location.mountains,
                        locationID: locationID
                    }
                })

                socket.broadcast.to(locationID).emit('objectEnter', {
                    ret: "OK",
                    type: "objectEnter",
                    payload: { objID: user._id, position: position, objType: 2 }
                })
                /*
                 *
                 * Отправить карту
                 *
                 * */
            } else {
            }
        });
    });

    socket.on('userObjMoved', (event) => {
        console.log(user._id + " (" + event.payload.objID + ") moved delta:(" + event.payload.delta.x + ", " + event.payload.delta.y + ")")
        const res = location.currentSpace.onObjectPositionUpdated(event.payload.delta, event.payload.objID)
        if (res.res) {
            if (res.portal === undefined)
                io.to(locationID).emit("objMoved", { ret: "OK", type: "objMoved", payload: event.payload })
            else {
                io.to(locationID).emit("objMoved", { ret: "OK", type: "objMoved", payload: event.payload })
                let portal = location.objects[4][res.portal]
                Location.findOne({
                    "entity": {
                        $elemMatch: {
                            _id: portal.states.to
                        }
                    }
                }, (err, loca) => {
                    if (loca) {
                        // DISCONNECT
                        const obj = location.objects[2][user._id]
                        location.currentSpace.removeObject(obj)
                        delete location.objects[2][user._id]
                        socket.broadcast.to(locationID).emit('objectLeave', {
                            ret: "OK",
                            type: "objectLeave",
                            payload: { objID: obj.id, position: obj.position, objType: 2 }
                        })
                        socket.leave(locationID)

                        // CONNECT
                        locationID = loca._id
                        location = Locations[locationID]
                        socket.join(locationID)

                        let newPortal = location.objects[4][portal.states.to]

                        const position = newPortal.position
                        const newObject = new BaseObject(user._id, position.x, position.y, undefined, 2)

                        location.currentSpace.addObject(newObject)
                        location.objects[2][newObject.id] = newObject

                        socket.emit("enterWorld", {
                            ret: "OK",
                            type: "enterWorld",
                            payload: {
                                objects: location.objects,
                                userObj: newObject,
                                mountains: location.mountains,
                                locationID: locationID
                            }
                        })

                        socket.broadcast.to(locationID).emit('objectEnter', {
                            ret: "OK",
                            type: "objectEnter",
                            payload: { objID: user._id, position: position, objType: 2 }
                        })
                    }
                })
            }
        }
    });

    socket.on('hit', () => {
        /*
         * Игровая логика
         * */

        // io.emit('update object', id, new_object);
    });

    socket.on('update map', () => {
        /*
         * Отправить всю карту заного
         * */

    });
    socket.on('disconnect', (reason) => {
        let objInd = -1
        if (location === undefined)
            return
        const obj = location.objects[2][user._id]
        if (obj !== undefined) {
            location.currentSpace.removeObject(obj)
            delete location.objects[2][user._id]
            console.log("disconnected")
            socket.broadcast.to(locationID).emit('objectLeave', {
                ret: "OK",
                type: "objectLeave",
                payload: { objID: obj.id, position: obj.position, objType: 2 }
            })
        }

    })
});

function createToken() {
    return crypto.randomBytes(32).toString('hex');
}