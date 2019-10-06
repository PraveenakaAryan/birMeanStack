const express = require('express');
const router = express.Router();
const User = require('../models/user');
const View = require('../models/views');
const Comment = require('../models/comment');
const passport = require('passport');
const mongoose = require('mongoose');

router.post('/register', function(req, res, next) {
  addToDB(req, res);
});

async function addToDB(req, res) {

  var user = new User({
    name: req.body.name,
    email: req.body.email,
    password: User.hashPassword(req.body.password),
    creation_dt: Date.now()
  });

  try{
    doc = await user.save();
    return res.json(doc);
  }
  catch(err) {
    return res.json(err);
  }
}

router.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
      console.log("user",user, info)
      if (err) { return res.json(err); }
      if (!user) { return res.json(info); }
      req.logIn(user, function(err) {
        if (err) { return res.json(err); }
        return res.json({ message: 'Logged in Successfully', user: user});
      });
    })(req, res, next);
  });


  router.get('/welcome', function(req, res, next){
    View.find().then(documents => {
      res.status(200).json({
        message: 'Restaurants Fetched Successfully',
        views: documents
      });
    });
});
    

  router.get('/dashboard', function(req,res, next) { 
     return res.json(req.user);
  });

  router.get('/logout', function(req, res, next) {
    req.logout();
    return res.json({ message: 'Logout Success'});
  });

  router.post('/input-forms', function(req, res, next) {
    console.log('annu', req.body);   
    var restaurantUser = new View({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      openHours: req.body.openHours,
      closeHours: req.body.closeHours,
      phoneNo: req.body.phoneNo,
      cuisine: req.body.cuisine,
      goodFor:req.body.goodFor
    });
    console.log(restaurantUser);
    restaurantUser.save();
    res.json({
      message: 'Restaurant added successfully'
    });
  });

router.post('/addComments', function(req, res, next){
  console.log("dfdvd",req.body);
  var restData = {"_id": mongoose.Types.ObjectId(req.body.id)}
  var data = { $push: {comments:{comment: req.body.comment, username:req.body.name }}}
    View.findOneAndUpdate(restData, data, function (err, restaurant){
       if(err){
         console.log(err);
       }
      else{
        console.log(restaurant)
        res.json({message: 'Comment added successfully'});
      }




      });
  });
  
  router.post('/moreInfo',(req,res,next)=>{
    console.log("req",req.body);
    var restData = {"_id": mongoose.Types.ObjectId(req.body.id)}
    View.findById(restData,(err, foundRestaurant)=>{
      console.log('baby', foundRestaurant);
      if(err){
          console.log(err)
      } else {
        res.json(foundRestaurant);
      } 
    });
  });

  router.get('/restaurant-info', function(req, res, next){
    View.find().then(documents => {
      res.status(200).json({
        message: 'Welcome to Restaurant',
        views: documents
      });
   });
});

  function isValidUser(req, res, next) {
    if(req.isAuthenticated()) next();
    else return res.json({ message: 'Unauthorized Request'});
  }

module.exports = router;
