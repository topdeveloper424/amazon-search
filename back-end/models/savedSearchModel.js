//= =======================================
// Model for save search
//= =======================================

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SavedSearchSchema = new Schema({
    searchTerm: {
        type: String,
        default: ''
    },
    contextDate: {
        type: String,
        default: ''
    },
    targets:{
        type: String,
        default: ''
    },
    trends:{
        type: String,
        default: ''
    },
    filters:{
        type: String,
        default: ''
    },
    searchName:{
        type: String,
        default: ''
    },

});

module.exports = {
    SavedSearchSchema : SavedSearchSchema
}