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
    },

    getLatestValueByDataStreamId: async function(dataStreamId) {
        try {
            const response = await axios.get(BASE_URL+`ctu/geo/observations/dataStreamId/${dataStreamId}/latest`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getDataStation: async function(serialStation, startDate, endDate, page, limit) { //serialStation: L2177R1M001F001, startDate: 2024%2F01%2F10, endDate: 2024%2F01%2F18, limit: 1000
        try {
            startDate = startDate.replace("/", "%");
            endDate = endDate.replace("/", "%");
            const response = await axios.get(`https://document.rynangate.com/api/v1/get-data-stations?so_serial=${serialStation}&tu_ngay=2024%2F01%2F10&den_ngay=2024%2F01%2F18&limit=${limit}`,
                {
                    headers: {
                        "x-access-token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDb2RlIjoiREVNT1BBUlRORVIiLCJEYXRlU2lnbiI6IjIwMjQtMDItMjJUMDM6NDE6MTQuNjk2WiIsImlhdCI6MTcwODU3MzI3NCwiZXhwIjoxNzA4NjU5Njc0fQ.TtX_WxLfQSfQrfP6ETUvxtSKEYqF48NAj3zkk5ok8kA",
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