const express = require('express');
const bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser');
const shortid = require('shortid');
const pug = require('pug');
var db = require('./db.js');
const port = 8080;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('views'));
app.use(cookieParser());

app.set('view engine','pug');
app.set('views','./views');

app.get('/:gameId', (req,res) => {
    var id = req.params.gameId;
    var game = db.get("games").find({ id: id}).value();
    console.log(game);
    console.log(game.score);
    res.render('scoreboard.pug',{
        game: game,
        score: game.score,
        id: id
    });
})

app.get('/', (req,res) => {
    res.render('index');
})

app.post('/add-player', (req,res) => {
    // const player = req.body;
    var genrateId = shortid.generate();
    req.body.id = genrateId;
    req.body.score = [];
    res.cookie('gameid',genrateId);    
    db.get("games").push(req.body).write();
    res.redirect(`/${genrateId}`);
})

app.listen(port,() => {
    console.log('success!!');
})

