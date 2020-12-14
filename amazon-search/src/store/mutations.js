import { types } from './mutation-types'

export default {
    [types.SAVE_LAST_HISTORY](state, payload) {
        state.lastHistories.push(payload)
    }
}