import axios from 'axios'
import station from './station';

const BASE_URL = "http://103.221.220.183:8026/"
const RYNAN_URL = "https://api-mekong.rynangate.com/api/v1/"

export default  {
    
    getAllValueByDataStreamId: async function(dataStreamId) {
        try {
            const response = await axios.get(`${BASE_URL}observations/dataStreamId/${dataStreamId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getLatestValueByDataStreamId: async function(dataStreamId) {
        try {
            const response = await axios.get(`${BASE_URL}observations/dataStreamId/${dataStreamId}/latest`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    //Rynan
    getDataStation: async function(serialStation, startDate, endDate, page, limit) {
        try {
            const rynanToken = await station.returnRynanToken();
            const response = await axios.get(`${RYNAN_URL}get-data-stations?so_serial=${serialStation}&tu_ngay=${startDate}&den_ngay=${endDate}&limit=${limit}`,
                {
                    headers: {
                        "x-access-token" : rynanToken,
                        "x-api-key" : "Qy1z8uyQoVC603KLov9vxC5J"
                    }
                }
            );
            return response.data;
        } catch (error) {
            if(error.response.data.errorCode === "002") {
                sessionStorage.clear("isRynanAuthentication");
                const reloadCount = sessionStorage.getItem('reloadCount');
                if(reloadCount < 2) {
                sessionStorage.setItem('reloadCount', String(reloadCount + 1));
                window.location.reload();
                } else {
                sessionStorage.removeItem('reloadCount');
                }
            }
            throw error;
        }

    }
}