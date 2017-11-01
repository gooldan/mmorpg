const io = require('socket.io')(8081),
   mongoose = require('mongoose'),
   crypto = require('crypto'),
   Profile = require('./models/Profile');

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

let Servers = {host: 'localhost', port: '8081'};

io.on('connection', function (socket) {
   socket.on('login', (token) => {
      Profile.findOne({'local.token': token}, (err, user) => {
         if (user) {
            // USER 
         } else {
         }
      });
   });
});

function createToken() {
   return crypto.randomBytes(32).toString('hex');
}