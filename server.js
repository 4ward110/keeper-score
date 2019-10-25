const express = require('express');
const bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser');
const shortid = require('shortid');
const pug = require('pug');
// var db = require('./db.js');
const fs = require('fs');
const port = 8080;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('views'));
app.use(cookieParser());

app.set('view engine','pug');
app.set('views','./views');

app.get('/:gameId', (req,res) => {
    var id1 = req.params.gameId;

    const fileData = fs.readFileSync("db.json", {encoding:"utf-8"});
    const dataList = JSON.parse(fileData);
    var currentGame = dataList['games'].find( ({id}) => id === id1 );
    if(!currentGame){
        res.send("Ko co ID nay");
        return;
    }
    res.cookie('gameid',id1);
    res.render('scoreboard.pug',{
        game: currentGame,
        score: currentGame.score,
        id: id1,
        totalScore: currentGame.totalScore
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
    req.body.totalScore = [0,0,0,0];    
    // db.get("games").push(req.body).write();

    const fileData = fs.readFileSync("db.json", {encoding:"utf-8"});
    const dataList = JSON.parse(fileData);
    dataList['games'].push(req.body)
    fs.writeFileSync('db.json',JSON.stringify(dataList));
    res.redirect(`/${genrateId}`);
});
app.post('/updateScore', (req,res) => {
    var gameId = req.cookies.gameid;
    const fileData = fs.readFileSync("db.json", {encoding:"utf-8"});
    const dataList = JSON.parse(fileData);
    var currentGame = dataList['games'].find( ({id}) => id === gameId );

    // var score = db.get("games").find({ id: gameId}).get("score").value();
    currentGame.score.push([0,0,0,0]);
    fs.writeFileSync('db.json',JSON.stringify(dataList));
    // db.get("games").find({ id: gameId}).get("score").push([0,0,0,0]).write();
    res.send({ score: currentGame.score });
});

app.post('/changeScore', (req,res) => {
    var p1Score = 0;
    var p2Score = 0;
    var p3Score = 0;
    var p4Score = 0;
    var data = req.body.value;
    var number = req.body.name;
    var index = req.body.id;
    var gameId = req.cookies.gameid;
    const fileData = fs.readFileSync("db.json", {encoding:"utf-8"});
    const dataList = JSON.parse(fileData);
    var currentGame = dataList['games'].find( ({id}) => id === gameId );
    var score = currentGame.score[number-1];
    score[index] = parseInt(data);
    // console.log(data,number,index);
    fs.writeFileSync('db.json',JSON.stringify(dataList));
    var allScoreData = currentGame.score;
    for (let i = 0; i< allScoreData.length; i++) {
        p1Score = p1Score + allScoreData[i][0];
        p2Score = p2Score + allScoreData[i][1];
        p3Score = p3Score + allScoreData[i][2];
        p4Score = p4Score + allScoreData[i][3];
    }
    var saveScore = currentGame.totalScore;
    saveScore[0] = p1Score;
    saveScore[1] = p2Score;
    saveScore[2] = p3Score;
    saveScore[3] = p4Score;
    fs.writeFileSync('db.json',JSON.stringify(dataList));
    res.send({ totalScore: saveScore });
})
app.listen(port,() => {
    console.log('success!!');
})

