//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisisourlittlesecret."
userSchema.plugin(encrypt, {secret:secret, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
    res.render('home');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    const newUser= new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
    if(err){    
        console.log(err);
    } else{
        res.render('secrets');
    }
});
});

app.post('/login', function(req, res){
    const emailCheck = req.body.username;
    const passwordCheck = req.body.password;
    User.findOne({email:emailCheck}, function(err, result){
        if(result){
            if(result.password === passwordCheck){
                res.render('secrets');
            }
        }else{
            console.log(err);
        }
    });
});


app.listen('3000', function(err, res){
    console.log('server on 3000')
});