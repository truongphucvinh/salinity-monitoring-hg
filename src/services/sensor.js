import axios from "axios";

const BASE_URL = "http://103.221.220.183:8088/"

export default {
    getSensorList: async function() {
        try {
            const response = await axios.get(BASE_URL+'ctu/geo/sensors')
            return response.data;
        } catch(error) {
            throw error;
        }
    },
}