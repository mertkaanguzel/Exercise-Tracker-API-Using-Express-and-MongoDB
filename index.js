const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./database');
const user = require('./models/user');

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : false}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async (req, res) => {
  let userList = await user.find();
  userList = listUserInfos(userList);
  res.json(userList);
});


app.post('/api/users', async (req, res) => {
  const userName = req.body.username;
  const userInstance = new user({
    name : userName
  });
  await userInstance.save();

  res.json({
    username : userName,
    _id : userInstance._id
  });
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const userId = req.params._id;
 
  try {
    let userInstance = await user.findByIdAndUpdate(userId,
      {'$push': {'exerciseList': {description : req.body.description,
        duration : req.body.duration,
        date : req.body.date
      }}},
      { "new": true, "upsert": true 
    });

      res.json({
        _id : userId,
        username : userInstance.name,
        date : new Date(req.body.date).toDateString(),
        duration : Number(req.body.duration),
        description : req.body.description,
      });
  }
  catch(error) {
    res.json(error);
  }
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const userId = req.params._id;

  try {
      let userInstance = await user.findByIdAndUpdate(userId);
      let exerciseList =  filterExercises(req.query.from, req.query.to, req.query.limit, userInstance.exerciseList);

      res.json({
        _id : userId,
        username : userInstance.name,
        count : exerciseList.length,
        log : exerciseList,
      });
  }

  catch(error) {
    res.json(error);
  }
  
});

let filterExercises = (from, to, limit, exerciseList) => {
  let filteredList = exerciseList;

  if (from !== undefined) filteredList = filteredList.filter(exercise => new Date(exercise.date) > new Date(from));
  if (to !== undefined) filteredList = filteredList.filter(exercise => new Date(exercise.date) < new Date(to));
  if (limit !== undefined) filteredList = filteredList.slice(0,limit);
 
  filteredList = filteredList.map((item) => {
    let date = (!item.date) ? new Date() : new Date(item.date);
    return {
    description: item.description,
    duration: item.duration,
    date: date.toDateString(),
  }});

  return filteredList;
}

let listUserInfos = (userList) => {

  userList = userList.map((user) => {
    return {
    username: user.name,
    _id: user._id,
  }});

  return userList;
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
