import axios from 'axios'
import station from './station'
const RYNAN_URL = "https://api-mekong.rynangate.com/api/v1/"

export default  {
    //Rynan
    getDataStation: async function(serialStation, startDate, endDate, page, limit) {
        try {
            const rynanToken = await station.returnRynanToken();
            const response = await axios.get(`${RYNAN_URL}get-data-stations?so_serial=${serialStation}&tu_ngay=${startDate}&den_ngay=${endDate}&limit=${limit}`,
                {
                    headers: {
                        "x-access-token" : rynanToken,
                        "x-api-key" : process.env.REACT_APP_RYNAN_X_API_KEY
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