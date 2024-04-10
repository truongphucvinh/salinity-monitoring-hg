import axios from "axios";

const BASE_URL = "http://103.221.220.183:8026/"

export default {
    getSensorList: async function() {
        try {
            const response = await axios.get(BASE_URL+'sensors')
            return response.data;
        } catch(error) {
            throw error;
        }
    },

    
}