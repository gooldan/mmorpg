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
    require('./initServer')((lMap) => {
    map = lMap;
})

let Servers = {host: 'localhost', port: '8081'};
const currentSpace = new Space(15,15)
const gameEngine = new GameEngine(currentSpace)
const objects = []
io.on('connection', function (socket) {
   let user = undefined;
   socket.on('login', (token) => {
      Profile.findOne({'local.token': token}, (err, u) => {
         if (u) {
            user = u;
            const position = user.hero.location.coordinates
            const newObject = new BaseObject(user.hero.id, position.x, position.y)
            objects.push(newObject)
            currentSpace.addObject(newObject)
            /*
            *
            * Отправить карту
            *
            * */
         } else {
         }
      });
   });

   socket.on('move', (objId, newPosition) => {
      currentSpace.onObjectPositionUpdated(newPosition,objId)
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

   socket.on('disconnect', function () {
        io.emit('user disconnected');
    });
});

function createToken() {
   return crypto.randomBytes(32).toString('hex');
}