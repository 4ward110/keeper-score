const express = require('express');
const bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser');
const shortid = require('shortid');
const pug = require('pug');
const mongoose = require('mongoose');
// var db = require('./db.js');
const fs = require('fs');
const port = 8080;

const app = express();

mongoose.connect('mongodb://localhost/keeper-score',
    { useNewUrlParser: true,
      useUnifiedTopology: true 
    },
    (err) => {
        if(err) console.log(err)
        else console.log('connect success!!')
    }
);

const gameModel = require('./models/model.games');

// gameModel.find({})
//     .then(data => {
//         console.log(data)
//     })
//     .catch(error => {
//         console.log(error)
//     })  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('views'));
app.use(cookieParser());

app.set('view engine','pug');
app.set('views','./views');

app.get('/:gameId', (req,res) => {
    var _id = req.params.gameId;

    // const fileData = fs.readFileSync("db.json", {encoding:"utf-8"});
    // const dataList = JSON.parse(fileData);
    // var currentGame = dataList['games'].find( ({id}) => id === id1 );
    gameModel.findById(_id)
        .then(currentGame => {
            if(!currentGame){
                res.send("Ko co ID nay");
                return;
            }
            res.cookie('gameid',_id);
            res.render('scoreboard.pug',{
                game: currentGame.players,
                score: currentGame.score,
                id: _id,
                totalScore: currentGame.total
            });
        })
        .catch(error => {
            res.send("loi cmnr")
        })    
})

app.get('/', (req,res) => {
    res.render('index');
})

app.post('/add-player', (req,res) => {
    // const player = req.body;
    var genrateId = shortid.generate();
    // req.body.id = genrateId;
    // req.body.score = [];
    // res.cookie('gameid',genrateId);
    // req.body.totalScore = [0,0,0,0];  
    const players = req.body.players;
    console.log(players)  
    // db.get("games").push(req.body).write();
    gameModel.create({
        players : players,
        _id: genrateId,
        score: []
    }).then( gameCreated => {
        res.send("success");
    }).catch( error => {
        console.log(error);
    })
    // const fileData = fs.readFileSync("db.json", {encoding:"utf-8"});
    // const dataList = JSON.parse(fileData);
    // dataList['games'].push(req.body)
    // fs.writeFileSync('db.json',JSON.stringify(dataList));
    res.redirect(`/${genrateId}`);
});
app.post('/updateScore', (req,res) => {
    var _id = req.cookies.gameid;
    
    // const fileData = fs.readFileSync("db.json", {encoding:"utf-8"});
    // const dataList = JSON.parse(fileData);
    // var currentGame = dataList['games'].find( ({id}) => id === gameId );
    // var score = db.get("games").find({ id: gameId}).get("score").value();
    gameModel.findByIdAndUpdate(_id, { $push : {score: [0,0,0,0]} })
        .then(currentGame => {
            console.log('done!')
            res.send({ score: currentGame.score });
        })
        .catch(error => {
            console.log(error);
        })

    // currentGame.score.push([0,0,0,0]);
    // fs.writeFileSync('db.json',JSON.stringify(dataList));
    // db.get("games").find({ id: gameId}).get("score").push([0,0,0,0]).write();
});

app.post('/changeScore', (req,res) => {
    var p1Score = 0;
    var p2Score = 0;
    var p3Score = 0;
    var p4Score = 0;
    var data = req.body.value;
    var number = req.body.name;
    var index = req.body.id;
    var _id = req.cookies.gameid;
    // const fileData = fs.readFileSync("db.json", {encoding:"utf-8"});
    // const dataList = JSON.parse(fileData);
    // var currentGame = dataList['games'].find( ({id}) => id === gameId );
    // var score = currentGame.score[number-1];
    // score[index] = parseInt(data);
    // console.log(data,number,index);
    // fs.writeFileSync('db.json',JSON.stringify(dataList));
    gameModel.findById(_id)
        .then(currentGame => {
            var score = currentGame.score[number-1];
            score[index] = parseInt(data);
            var saveScore = currentGame.total;
            currentGame.save();
            // var allScoreData = currentGame.score;
            // for (let i = 0; i< allScoreData.length; i++) {
            //     p1Score = p1Score + allScoreData[i][0];
            //     p2Score = p2Score + allScoreData[i][1];
            //     p3Score = p3Score + allScoreData[i][2];
            //     p4Score = p4Score + allScoreData[i][3];
            // }
            // saveScore[0] = p1Score;
            // saveScore[1] = p2Score;
            // saveScore[2] = p3Score;
            // saveScore[3] = p4Score;
            // currentGame.save();
            // fs.writeFileSync('db.json',JSON.stringify(dataList));
            res.send({ totalScore: saveScore });
        })
        .catch(error => {
            console.log(error);
        })
    // gameModel.findById(_id)
    //     .then(currentGame => {
    //         var allScoreData = currentGame.score;
    //         for (let i = 0; i< allScoreData.length; i++) {
    //             p1Score = p1Score + allScoreData[i][0];
    //             p2Score = p2Score + allScoreData[i][1];
    //             p3Score = p3Score + allScoreData[i][2];
    //             p4Score = p4Score + allScoreData[i][3];
    //         }
    //         var saveScore = currentGame.total;
    //         saveScore[0] = p1Score;
    //         saveScore[1] = p2Score;
    //         saveScore[2] = p3Score;
    //         saveScore[3] = p4Score;
    //         currentGame.save();
    //         // fs.writeFileSync('db.json',JSON.stringify(dataList));
    //         res.send({ totalScore: saveScore });
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     })
})
app.listen(port,() => {
    console.log('success!!');
})

