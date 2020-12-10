//= =======================================
// Model for save search
//= =======================================

import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SavedSearch = new Schema({
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
