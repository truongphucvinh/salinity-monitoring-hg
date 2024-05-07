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
    getDataStation: async function(serialStation, startDate, endDate, page, limit) {
        try {
            // const responseLogin = await station.login();
            var rynanToken = sessionStorage.getItem("rynanToken");
            const response = await axios.get(`https://api-mekong.rynangate.com/api/v1/get-data-stations?so_serial=${serialStation}&tu_ngay=${startDate}&den_ngay=${endDate}&limit=${limit}`,
                {
                    headers: {
                        "x-access-token" : rynanToken,
                        "x-api-key" : "Qy1z8uyQoVC603KLov9vxC5J"
                    }
                }
            );
            console.log("sensor value: ", response.data);
            return response.data;
        } catch (error) {
            throw error;
        }

    }
}