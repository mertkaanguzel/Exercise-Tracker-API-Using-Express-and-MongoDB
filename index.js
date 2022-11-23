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
  res.json({username : userName});
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
    await user.findByIdAndUpdate(userId,
      {'$push': {'exerciseList': {description : req.body.description,
        duration : req.body.duration,
        date : req.body.date,}}},
      { "new": true, "upsert": true });

      let userInstance = await user.findByIdAndUpdate(userId);
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
  res.json({test: req.query.limit});
  console.log(req.query.limit);
  console.log(typeof req.query.limit);
  
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
