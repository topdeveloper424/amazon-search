//= =======================================
// Model for save search
//= =======================================

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    uploadedTime: {
        type : Date,
        default: Date.now  
    },
    recordNumber: {
        type: Number,
        default: 0
    },
    collectionName: {
        type: String,
        default: ''
    }

});

module.exports = {
    HistorySchema : HistorySchema
}