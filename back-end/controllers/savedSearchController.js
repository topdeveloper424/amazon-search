//= =======================================
// saved search Route
//= =======================================

const mongoose = require('mongoose');
const SavedSearchSchema = require('./../models/savedSearchModel').SavedSearchSchema
const SavedSearch = mongoose.model('SavedSearch', SavedSearchSchema);

// save current search
exports.saveSearch = async function (req, res, next) {
    let data = req.body;

    let params = {
        searchTerm: data.searchTerm,
        contextDate : data.contextDate,
        targets : JSON.stringify(data.targets),
        trends : JSON.stringify(data.trends),
        filters: JSON.stringify(data.filters),
        searchName: data.searchName
    }
    let newSavedSearch = new SavedSearch(params);
    newSavedSearch.save();
    console.log(data)

    res.end(JSON.stringify(newSavedSearch))
};

// get all saved search names
exports.getSearchNames = async function (req, res, next) {
    SavedSearch.find({}).select('searchName').exec(function(err, result){
        if(err) res.end();
        console.log("result",result);
        res.end(JSON.stringify(result))
    });
};


// get search content by id
exports.getSearchById = async function (req, res, next) {
    const {id} = req.body;
    console.log("data",id)
    SavedSearch.findById(id).exec(function(err, result){
        if(err) res.end();
        res.end(JSON.stringify(result))
    });
};
// delete search content by id
exports.deleteSearchById = async function (req, res, next) {
    const {id} = req.body;
    console.log("data",id)
    SavedSearch.findByIdAndDelete(id).exec(function(err, result){
        if(err) res.end();
        res.end(JSON.stringify(result))
    });
};
// update search content by id
exports.updateSearchById = async function (req, res, next) {
    const params = req.body;
    console.log("data",params)
    SavedSearch.findByIdAndUpdate(params.id, {searchTerm:params.searchTerm, contextDate:params.contextDate, targets:JSON.stringify(params.targets), trends:JSON.stringify(params.trends), filters:JSON.stringify(params.filters)} ,function(err, docs){
        if (err){ 
            console.log(err) 
        } 
        else{ 
            res.end(JSON.stringify(docs))
        } 
    });
};
