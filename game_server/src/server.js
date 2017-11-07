const io = require('socket.io')(8081),
   mongoose = require('mongoose'),
   crypto = require('crypto'),
   Profile = require('./models/Profile');
import {GameEngine} from "./engine/GameEngine"
import {Space} from "./engine/space"
import {BaseObject} from "./entity/BaseObject"
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

let map = undefined;
const currentSpace = new Space(15,15)
require('./initServer')((lMap) => {
map = lMap;
currentSpace.loadMap(map)
})

let Servers = {host: 'localhost', port: '8081'};
const gameEngine = new GameEngine(currentSpace)
const objects = []
io.on('connection', function (socket) {
   let user = undefined;
   socket.on('login', (token) => {
      Profile.findOne({'local.token': token}, (err, u) => {
         if (u) {
            user = u;
            if(objects.length > 0 && objects.find((elem) =>{ return elem.id === user.hero.id})!==undefined) {
                return
            }
            const position = user.hero.location.coordinates
            const newObject = new BaseObject(user.hero.id, position.x, position.y)
            currentSpace.addObject(newObject)            
            objects.push(newObject)
            socket.emit("enterWorld",{ret:"OK", type:"enterWorld", payload:{objects:objects, userObj:newObject}})
            socket.broadcast.emit('objectEnter', {ret:"OK", type:"objectEnter", payload:{objID:user.hero.id, position:position}})
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
      const res = currentSpace.onObjectPositionUpdated(event.payload.delta, event.payload.objID)
      if(res)
      {
          io.emit("objMoved", {ret:"OK", type:"objMoved", payload:event.payload})
      }
      /*
      * Сделать что-то с персом
      * */
      // io.emit('update object', id, new_object);
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
        const obj = objects.find((elem, index) =>{ if(elem.id === user.hero.id) {
            objInd = index
            return elem.id === user.hero.id}})
        if(obj!==undefined)
        {
            currentSpace.removeObject( obj)
            objects.splice(objInd,1);        
            console.log("disconnected")
            socket.broadcast.emit('objectLeave', {ret:"OK", type:"objectLeave", payload:{objID:obj.id, position:obj.position}})
        }
       
   })
});

function createToken() {
   return crypto.randomBytes(32).toString('hex');
}