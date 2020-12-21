//= =======================================
// Model for data source
//= =======================================

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSourceSchema = new Schema({
    searchTerm: {
        type: String,
        default: ''
    },
    rank: {
        type: Number,
        default: ''
    },
    asin1: {
        type: String,
        default: ''
    },
    title1: {
        type: String,
        default: ''
    },
    share1: {
        type: Number,
        default: ''
    },
    conv1: {
        type: Number,
        default: ''
    },
    asin2: {
        type: String,
        default: ''
    },
    title2: {
        type: String,
        default: ''
    },
    share2: {
        type: Number,
        default: ''
    },
    conv2: {
        type: Number,
        default: ''
    },
    asin3: {
        type: String,
        default: ''
    },
    title3: {
        type: String,
        default: ''
    },
    share3: {
        type: Number,
        default: ''
    },
    conv3: {
        type: Number,
        default: ''
    },
    created_at: {
        type : Date,
        default: Date.now  
    }
});

module.exports = {
    DataSourceSchema : DataSourceSchema
}