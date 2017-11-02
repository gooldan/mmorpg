const io = require('socket.io')(8080),
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
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
io.on('connection', function (socket) {
   socket.on('login', (username, pass) => {
      Profile.findOne({'local.username': username, 'local.password': pass}, (err, user) => {
         if (user) {
            let token = createToken();
            user.token = token;
            socket.emit('token', token, Servers.host, Servers.port);
         } else {
            let newUser = new Profile();
            let token = createToken();
            newUser.local.username = username;
            newUser.local.password = pass;
            newUser.local.token = token;
            newUser.hero.id = getRandomInt(0,100000)
            newUser.save((err) => {
               if (err) {}
               else {
                  socket.emit('token', token, Servers.host, Servers.port);
               }
            });
         }
      });
   });
});

function createToken() {
   return crypto.randomBytes(32).toString('hex');
}