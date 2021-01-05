import { types } from './mutation-types'

export default {
    [types.SAVE_LAST_HISTORY](state, payload) {
        state.lastHistories.push(payload)
    },
    [types.SAVE_MISSING_DATES](state, payload) {
        state.missingDates = payload
    },
    [types.SAVE_CONTEXT_DATE](state, payload) {
        state.searchParams.contextDate = payload
    },
    [types.UDPATE_SEARCH_PARAMS](state, payload) {
        if(typeof payload._id === 'undefined'){
            state.searchParams = payload
        }else{
            console.log(payload)
            state.searchParams.searchTerm = payload.searchTerm
            state.searchParams.contextDate = payload.contextDate
                        
            state.searchParams.targets =JSON.parse(payload.targets)
            state.searchParams.trends = JSON.parse(payload.trends)
            state.searchParams.filters = JSON.parse(payload.filters)
        }
    },
    [types.SAVE_SAVED_SEARCHES](state, payload) {
        state.savedSearches = payload
    },
    [types.ADD_SAVED_SEARCH](state, payload) {
        state.savedSearches.push(payload)
    },
    [types.DELETE_SAVED_SEARCH](state, payload) {
        state.savedSearches = state.savedSearches.filter(function(ele){ 
            return ele._id != payload.id; 
        });

    },

}