import axios from 'axios'

const BASE_URL = "http://103.221.220.183:8088/"

export default  {
    getMultiDataStream: async function() {
        try {
            const response = await axios.get(BASE_URL+'ctu/geo/multi-data-streams');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createDataStream: async function(thingId, sensorId, dataStreamInfo) {  //lien ket voi sensor
        try {
            const response = await axios.post(BASE_URL+`ctu/geo/multi-data-streams/thing/${thingId}/sensor/${sensorId}`, dataStreamInfo);
            return response;
        } catch(error) {
            throw error;
        }
    }
}