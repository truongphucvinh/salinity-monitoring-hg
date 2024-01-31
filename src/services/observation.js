import axios from 'axios'

const BASE_URL = "http://103.221.220.183:8089/"

export default  {
    getAllValueByDataStreamId: async function(dataStreamId) {
        
        try {
            const response = await axios.get(BASE_URL+`ctu/geo/observations/dataStreamId/${dataStreamId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}