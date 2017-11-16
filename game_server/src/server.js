const io = require('socket.io', { transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'] })(8081),
    mongoose = require('mongoose'),
    crypto = require('crypto');
import { Profile } from "./models/Profile"
import { LocationModel } from "./models/Location"
import { Location } from "./location/Location"
import { GameEngine } from "./engine/GameEngine"
import { Space } from "./engine/space"
import { BaseObject } from "./entity/BaseObject"
import { InitLocation } from "./initServer"
import { setTimeout } from 'timers';
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

for (let i in locationIDs) {
    Locations[locationIDs[i]] = new Location(locationIDs[i])
}

let Servers = { host: 'localhost', port: '8081' }
const moveSpeed = 200
let Users = {}

io.on('connection', function (socket) {
    let user = undefined
    let locationID = undefined
    let location = undefined
    let lastMove = undefined
    socket.on('login', (token) => {
        Profile.findOne({ 'local.token': token }, (err, u) => {
            if (u) {
                user = u;
                lastMove = Date.now()
                Users[user._id] = user
                locationID = user.hero.location.id
                if (Locations[locationID].objects[2][user._id] !== undefined)
                    return
                location = Locations[locationID]

                socket.join(locationID)

                console.log(user._id + " CONNECTED. token: " + token)

                const position = user.hero.location.coordinates
                user.hero.hp=15
                user.hero.level = 1
                const newObject = new BaseObject(user._id, position.x, position.y, 2, user.hero.hp, user.hero.level)

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
                    payload: { objID: user._id, position: newObject.position, objType: 2, hp: newObject.hp, level: newObject.level }
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
    let costyl = false
    socket.on('userObjMoved', (event) => {
        let timeNow = Date.now()
        if (timeNow - lastMove < moveSpeed)
            return
        lastMove = timeNow
        const receiveTime = new Date().getTime()
        const res = location.currentSpace.onObjectPositionUpdated(event.payload.delta, event.payload.objID)
        if (res.res) {
            if (res.portal === undefined) {
                user.hero.location.coordinates.x = res.position.x
                user.hero.location.coordinates.y = res.position.y
                io.to(locationID).emit("objMoved", { ret: "OK", type: "objMoved", payload: event.payload })
                console.log("obj move proc time:", (new Date().getTime()) - receiveTime)
            }
            else if (!costyl) {
                costyl = true
                io.to(locationID).emit("objMoved", { ret: "OK", type: "objMoved", payload: event.payload })
                let portal = location.objects[4][res.portal]
                LocationModel.findOne({
                    "entity": {
                        $elemMatch: {
                            _id: portal.states.to
                        }
                    }
                }, (err, loca) => {
                    if (loca) {
                        // DISCONNECT
                        socket.emit("leaveWorld", {
                            ret: "OK",
                            type: "leaveWorld",
                            payload: {
                            }
                        })

                        const obj = location.objects[2][user._id]
                        if (obj == undefined) {
                            return
                        }
                        location.currentSpace.removeObject(obj)
                        delete location.objects[2][user._id]
                        socket.broadcast.to(locationID).emit('objectLeave', {
                            ret: "OK",
                            type: "objectLeave",
                            payload: { objID: obj.id, position: obj.position, objType: 2 }
                        })
                        socket.leave(locationID)

                        const delayedEnter = () => {
                            // CONNECTi
                            locationID = loca._id
                            location = Locations[locationID]
                            socket.join(locationID)



                            let newPortal = location.objects[4][portal.states.to]

                            const position = newPortal.position
                            const newObject = new BaseObject(user._id, position.x, position.y, 2,user.hero.hp, user.hero.level)


                            location.currentSpace.addObject(newObject)
                            location.objects[2][newObject.id] = newObject
                            user.hero.location.id = locationID
                            user.hero.location.coordinates.x = newObject.position.x
                            user.hero.location.coordinates.y = newObject.position.y

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
                                payload: { objID: user._id, position: newObject.position, objType: 2, hp: user.hero.hp, level:  user.hero.level }
                            })
                            costyl = false
                        }
                        setTimeout(delayedEnter, 1000)
                    }
                })
            }
        }
    });

    socket.on('userHit', () => {
        let timeNow = Date.now()
        if (timeNow - lastMove < moveSpeed)
            return
        lastMove = timeNow
        console.log("userhit")
        const newPos = {x:user.hero.location.coordinates.x, y: user.hero.location.coordinates.y}
        const res = location.currentSpace.userHit(newPos)
        const dmg = user.hero.level
        for(let i in res)
        {   
            if(location.objects[2][res[i]].hp - dmg <= 1)
            {
                location.objects[2][user._id].level+=1
                Users[user._id].hero.level+=1   
                io.to(locationID).emit("playerLvlUp", {
                    ret: "OK",
                    type: "playerLvlUp",
                    payload: {
                        objId:user._id,
                        newLevel:user.hero.level
                    }
                })
                io.to(locationID).emit("playerDead", {
                    ret: "OK",
                    type: "playerDead",
                    payload: {
                        objId:res[i]
                    }
                })
                setTimeout((thisObjId)=>{
                    console.log(thisObjId)
                    location.objects[2][thisObjId].hp = location.objects[2][thisObjId].level*15
                    const newRealPos = location.currentSpace.findClosePlace(location.objects[2][thisObjId].position.x, 
                                                                            location.objects[2][thisObjId].position.y)
                    const newPos = {x:Math.floor(location.currentSpace.width/2) - newRealPos.x,
                                    y:Math.floor(location.currentSpace.height/2) - newRealPos.y} 
                    console.log("RESPAWNING PLAYER ", thisObjId, "ON delta",newPos)
                    const res = location.currentSpace.onObjectPositionUpdated(newPos, thisObjId)
                    io.to(locationID).emit("playerRespawn", {
                        ret: "OK",
                        type: "playerRespawn",
                        payload: {
                            objId:thisObjId,
                            newPos: newPos,
                            newHp: location.objects[2][thisObjId].hp
                        }
                    })
                },1500,res[i])
                res[i] = {id:res[i],dmg:0}     
            }
            else {
                location.objects[2][res[i]].hp -= dmg
                res[i] = {id:res[i],dmg:dmg}         
            }
        }
        if(res.length>0)
        {
            io.to(locationID).emit("playersDamaged", {
                ret: "OK",
                type: "playersDamaged",
                payload: {
                    playersInfo: res
                }
            })
        }

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
        user.save((err) => {
            if(!err) 
            {
                //console.log("USER " + user._id + " SAVED")
            }
        })
        if (Users[user._id] !== undefined)
            delete Users[user._id]
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

setTimeout(() => { GlobalSave() }, 5000)

function createToken() {
    return crypto.randomBytes(32).toString('hex');
}

function GlobalSave() {
    SaveUsers()
    SaveLocations()
    setTimeout(() => { GlobalSave() }, 5000)
}
function SaveUsers() {
    for (let id in Users) {
        Users[id].save((err) => {
            if(!err) 
                console.log("USER " + id + " SAVED")
        })
    }
}

function SaveLocations() {
    for (let iloc in Locations) {
        LocationModel.findOne({ _id: iloc }, (err, loca) => {
            for (let i in loca.entity) {
                let entity = loca.entity[i]
                if (Locations[iloc].objects[entity.type] !== undefined && Locations[iloc].objects[entity.type][entity._id] !== undefined && Locations[iloc].objects[entity.type][entity._id].states !== undefined) {

                    loca.entity[i].states = Locations[iloc].objects[entity.type][entity._id].states
                }
            }
            loca.save((err) => {
                if (!err) {
                    //console.log("LOCATION " + loca.name + " (" + iloc + ") SAVED")
                }
            })
        })
    }
}