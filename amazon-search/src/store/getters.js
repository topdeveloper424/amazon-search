import axios from 'axios'
import {Conf} from './../../config'

export default {
    async getPageData(state) {
        try {
            const data = await axios.get(Conf.serverURL + 'data/getData')
            return data;
        } catch (e) {
            return null;
        }
    }

}