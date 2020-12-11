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
        type: String,
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
        type: String,
        default: ''
    },
    conv1: {
        type: String,
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
        type: String,
        default: ''
    },
    conv2: {
        type: String,
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
        type: String,
        default: ''
    },
    conv3: {
        type: String,
        default: ''
    }
});

module.exports = {
    DataSourceSchema : DataSourceSchema
}