const env = process.env.NODE_ENV || 'development';

const config = require('./config/config')[env];
const app = require('express')();

require('./config/express')(app);
require('./config/routes')(app);


const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Cory:dbUser@breezycluster0.lcvf5.mongodb.net/Monday?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});
app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));