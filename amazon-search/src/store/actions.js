import { types } from './mutation-types'
import {Conf} from './../../config'
import axios from 'axios'

export default {

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

    updateSearchParams({commit}, payload){
        commit(types.UDPATE_SEARCH_PARAMS, payload)
    },

    async saveSearch({commit}, payload){
        try {
            const {data} = await axios.post(Conf.serverURL + 'search/saveSearch', payload)
            console.log("data",data)  
            commit(types.ADD_SAVED_SEARCH, {_id:data._id, searchName: data.searchName})
        } catch (e) {
        }

    },
    
    async getSearchNames({ commit }, payload) {
        try {
            const {data} = await axios.get(Conf.serverURL + 'search/getSearchNames')
            if(data){
                commit(types.SAVE_SAVED_SEARCHES, data)
            }
        } catch (e) {
        }
    },

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

    deleteSearchById({ commit }, payload) {
        return axios.post(Conf.serverURL + 'search/deleteSearchById', payload).then(res=>{
            commit(types.DELETE_SAVED_SEARCH, payload)
        }).then(err => {
            if(err){
                console.log(err);
            }
        });
    },

    updateSearchById({ commit }, payload) {

        return axios.post(Conf.serverURL + 'search/updateSearchById', payload).then(res=>{
        }).then(err => {
            if(err){
                console.log(err);
            }
        });
    },
}