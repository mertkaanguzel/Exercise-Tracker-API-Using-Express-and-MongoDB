const mongoose = require('mongoose');
/*
let exerciseSchema = function(_date,_description,_duration){
    this.date = _date;
    this.description = _description;
    this.duration = _duration;
};
*/

let exerciseSchema = new mongoose.Schema({
    date : String,
    description : String,
    duration : Number
});
module.exports = exerciseSchema;