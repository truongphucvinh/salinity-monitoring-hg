import axios from "axios";

const BASE_URL = "http://103.221.220.183:8088/"

export default {
    getStationList: async function() {
        try {
            const response = await axios.get(BASE_URL+'ctu/geo/things')
            return response.data;
        } catch(error) {
            throw error;
        }
    },

    createStation: async function(thingId, stationInfo) {
        try {
            const response = await axios.post(BASE_URL+`ctu/geo/stations/thing/${thingId}`, stationInfo);
            return response;
        } catch(error) {
            throw error;
        }
    }
}