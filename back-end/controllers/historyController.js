

//= =======================================
// History Route
//= =======================================
const mongoose = require('mongoose');
const HistorySchema = require('./../models/historyModel').HistorySchema
const History = mongoose.model('History', HistorySchema);

// get last uploaded history
exports.getLastHistory = function (req, res, next) {
    console.log('connecting...');
    History.findOne({}, {}, { sort: { 'uploadedTime' : -1 } }, function(err, history) {
        if(err){
            console.log(err)
        }else{
            let result = history
            let date = new Date(history.uploadedTime);
            // making formatted date string
            let dateStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate() +" "+date.getHours() + ":"+date.getMinutes() + ":"+date.getSeconds()
            result.lastDate  =dateStr;

            res.end(dateStr)
        }
    });


};
