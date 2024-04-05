import axios from 'axios'

const BASE_URL = "http://103.221.220.183:8026/"

export default  {
    getMultiDataStream: async function() {
        try {
            const response = await axios.get(BASE_URL+'multi-data-streams');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createDataStream: async function(thingId, sensorId, dataStreamInfo) {  //lien ket voi sensor
        try {
            const response = await axios.post(BASE_URL+`multi-data-streams/thing/${thingId}/sensor/${sensorId}`, dataStreamInfo);
            return response;
        } catch(error) {
            throw error;
        }
    },

    deleteMultiDataStream: async function(multiDataStreamId) {
        try {
            const response = await axios.delete(BASE_URL+`multi-data-streams/${multiDataStreamId}`);
            return response;
        } catch(error) {
            throw error;
        }
    }
}