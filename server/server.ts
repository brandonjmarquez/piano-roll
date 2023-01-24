const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'), Admin = mongoose.mongo.Admin;
require('dotenv').config({path:__dirname+'/../.env'});
const PORT = process.env.SERVER_PORT || 3001;

// var mongoose = require("./foo_db_connect.js");

app.use(cors());
app.use(express.json());

// const uri = `mongodb://${process.env.ME_CONFIG_MONGODB_ADMINUSERNAME}:${process.env.ME_CONFIG_MONGODB_ADMINPASSWORD}@localhost:27017/?maxPoolSize=20`;
const uri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo-piano:27017/${process.env.MONGO_INITDB_DATABASE}?authSource=admin&&retryWrites=true&w=majority`;
console.log(uri)
console.log()

mongoose.set('strictQuery', true);
mongoose.connect(uri, {useNewUrlParser: true});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Successfully connected to MongoDB!');
});

app.use('/api', require('./routes/login-register'))

app.use('/api', require('./routes/sound-file-count.js'));
app.use('/sounds', express.static(path.join(__dirname, '/sounds')));

//server 
app.listen(PORT, () => {
  console.log(`node server is running on port %s`, PORT);
});

