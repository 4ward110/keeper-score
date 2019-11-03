const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameDetail = new Schema(
   {
      players:{
         type: Array,
         required: true
      },
      _id: {
         type: String,
         required: true
      },
      score: [Array],
      total: {
         type: Array,
         default: [0,0,0,0],
      }
   },
   {
      timestamps: true,
      _id: false
   }
);

const gameModel = mongoose.model('game', gameDetail);

module.exports = gameModel