import axios from 'axios'
import station from './station';

const BASE_URL = "http://103.221.220.183:8026/"

export default  {
    getAllValueByDataStreamId: async function(dataStreamId) {
        try {
            const response = await axios.get(BASE_URL+`observations/dataStreamId/${dataStreamId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getLatestValueByDataStreamId: async function(dataStreamId) {
        try {
            const response = await axios.get(BASE_URL+`observations/dataStreamId/${dataStreamId}/latest`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    //Rynan
    getDataStation: async function(serialStation, startDate, endDate, page, limit) { //serialStation: L2177R1M001F001, startDate: 2024%2F01%2F10, endDate: 2024%2F01%2F18, limit: 1000
        try {
            startDate = startDate.replace("/", "%");
            endDate = endDate.replace("/", "%");
            const responseLogin = await station.login();
            const response = await axios.get(`https://document.rynangate.com/api/v1/get-data-stations?so_serial=${serialStation}&tu_ngay=2024%2F01%2F10&den_ngay=2024%2F01%2F18&limit=${limit}`,
                {
                    headers: {
                        "x-access-token" : responseLogin.token,
                        "x-api-key" : "baK5nWEBD6ARJNU8uPSMTrfq"
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }

    }
}