const mongoose = require('mongoose');
const exercise = require('./exercise');
/*
let exerciseSchema = new mongoose.Schema({
    date : String,
    description : String,
    duration : Number
});
*/
let userSchema = new mongoose.Schema({
    name : String,
    exerciseList : [exercise]
});


 

module.exports = mongoose.model('userList', userSchema);

