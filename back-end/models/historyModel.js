//= =======================================
// Model for save search
//= =======================================

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    uploadedTime: {
        type: String,
        default: ''
    },
    recordNumber: {
        type: Number,
        default: 0
    }

});

module.exports = {
    HistorySchema : HistorySchema
}