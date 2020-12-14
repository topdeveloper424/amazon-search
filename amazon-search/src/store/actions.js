import { types } from './mutation-types'
import {Conf} from './../../config'
import axios from 'axios'

export default {

    async storeHistory({ commit }, payload) {
        try {
            const { data } = await axios.get(Conf.serverURL + 'history/getLastHistory')
            commit(types.SAVE_LAST_HISTORY, data)
        } catch (e) {
        }
    }

}