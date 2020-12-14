

//= =======================================
// History Route
//= =======================================
const mongoose = require('mongoose');
const HistorySchema = require('./../models/historyModel').HistorySchema
const History = mongoose.model('History', HistorySchema);

exports.getLastHistory = function (req, res, next) {
    console.log('connecting...');
    History.findOne({}, {}, { sort: { 'uploadedTime' : -1 } }, function(err, history) {
        if(err){
            console.log(err)
        }else{
            res.end(JSON.stringify(history))
        }
    });


};
