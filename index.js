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

app.post('/api/users', async (req, res) => {
  const userName = req.body.username;
  const userInstance = new user({
    name : userName
  });
  await userInstance.save();
  res.json({username : userName,
    _id : userInstance._id
  });
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const userId = req.params._id;
  let exerciseObject = {
    _id : userId,
    description : req.body.description,
    duration : req.body.duration,
    date : req.body.date,
  };
  try {
    let userInstance = await user.findByIdAndUpdate(userId,
      {'$push': {'exerciseList': {description : req.body.description,
        duration : req.body.duration,
        date : req.body.date
      }}},
      { "new": true, "upsert": true 
    });

      //let userInstance = await user.findByIdAndUpdate(userId);
      //res.json(userInstance.exerciseList.length);
      //res.json(userInstance);
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
  //res.json({test: req.query.limit});
  const userId = req.params._id;
  console.log(req.query.limit);
  console.log(typeof req.query.limit);
  try {

      let userInstance = await user.findByIdAndUpdate(userId);
      let exerciseList =  filterExercises(req.query.from, req.query.to, req.query.limit, userInstance.exerciseList);
      console.log(exerciseList);
      res.json({
        _id : userId,
        username : userInstance.name,
        count : exerciseList.length,
        log : exerciseList,
        //log : exerciseList,
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
  //console.log(filteredList);
  filteredList = filteredList.map((item) => {
    return {
    description: item.description,
    duration: item.duration,
    date: new Date(item.date).toDateString()
  }});
/*
  for (let item of filteredList){
    exercise = {
      description: item.description,
      duration: item.duration,
      date: item.date
    };
  }
  */
  return filteredList;
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
