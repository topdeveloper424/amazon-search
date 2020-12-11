//= =======================================
// Model for save search
//= =======================================

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SavedSearchSchema = new Schema({
    searchTerms: {
        type: Boolean,
        default: true
    },
    allTitles: {
        type: Boolean,
        default: true
    },
    title1: {
        type: Boolean,
        default: true
    },
    asins: {
        type: Boolean,
        default: true
    }

});

module.exports = {
    SavedSearchSchema : SavedSearchSchema
}