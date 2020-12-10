//= =======================================
// Model for data source
//= =======================================

import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const DataSource = new Schema({
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
