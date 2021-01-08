import { types } from './mutation-types'
import {Conf} from './../../config'
import axios from 'axios'

export default {

    // getting latest history and store in state
    async storeHistory({ commit }, payload) {
        try {
            const {data} = await axios.get(Conf.serverURL + 'history/getLastHistory')
            if(data){
                commit(types.SAVE_LAST_HISTORY, data)
            }
        } catch (e) {
        }
    },
    insertHistory({commit}, payload){
        commit(types.SAVE_LAST_HISTORY, payload)
    },

    // getting missing dates from back-end and store in states
    async saveMissingDates({ commit }, payload) {
        try {
            const {data} = await axios.get(Conf.serverURL + 'data/getMissingDates')
            console.log("data",data)
            if(data.missinDateArray.length > 0){
                commit(types.SAVE_MISSING_DATES, data.missinDateArray)
            }
            commit(types.SAVE_CONTEXT_DATE, data.contextDate)

        } catch (e) {
        }
    },

    // update search parameters in states
    updateSearchParams({commit}, payload){
        commit(types.UDPATE_SEARCH_PARAMS, payload)
    },

    // save current search parameters from states and send to back-end
    async saveSearch({commit}, payload){
        try {
            const {data} = await axios.post(Conf.serverURL + 'search/saveSearch', payload)
            console.log("data",data)  
            commit(types.ADD_SAVED_SEARCH, {_id:data._id, searchName: data.searchName})
        } catch (e) {
        }

    },
    
    // getting all search names from back-end and store in states
    async getSearchNames({ commit }, payload) {
        try {
            const {data} = await axios.get(Conf.serverURL + 'search/getSearchNames')
            if(data){
                commit(types.SAVE_SAVED_SEARCHES, data)
            }
        } catch (e) {
        }
    },

    // get search details by search Id and save that as current search parameters
    getSearchById({ commit }, payload) {
        return axios.post(Conf.serverURL + 'search/getSearchById', payload).then(res=>{
            let data = res.data
            commit(types.UDPATE_SEARCH_PARAMS, data)
        }).then(err => {
            if(err){
                console.log(err);
            }
        });
    },

    // delete search by search ID 
    deleteSearchById({ commit }, payload) {
        return axios.post(Conf.serverURL + 'search/deleteSearchById', payload).then(res=>{
            commit(types.DELETE_SAVED_SEARCH, payload)
        }).then(err => {
            if(err){
                console.log(err);
            }
        });
    },

    // update search details by ID
    updateSearchById({ commit }, payload) {
        return axios.post(Conf.serverURL + 'search/updateSearchById', payload).then(res=>{
        }).then(err => {
            if(err){
                console.log(err);
            }
        });
    },
}