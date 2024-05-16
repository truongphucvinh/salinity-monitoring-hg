import axios from "axios";

const BASE_URL = "http://103.221.220.183:8026/"
const RYNAN_URL = "https://api-mekong.rynangate.com/api/v1/"

export default {

    getStationList: async function() {
        try {
            const response = await axios.get(`${BASE_URL}things`)
            return response.data;
        } catch(error) {
            throw error;
        }
    },

    createStation: async function(thingId, stationInfo) {
        try {
            const response = await axios.post(`${BASE_URL}stations/thing/${thingId}`, stationInfo);
            return response;
        } catch(error) {
            throw error;
        }
    },

    deleteStation: async function(stationId) {
        try {
            const response = await axios.delete(`${BASE_URL}stations/${stationId}`);
            return response;
        } catch(error) {
            throw error;
        }
    },

    //Rynan
    login: async function() {
        try {
            const response = await axios.post(`${RYNAN_URL}auth`, {
                "user_name" : "myi.partner",
                "password" : "Myi@2024"
            }, {
                headers: {
                    "x-api-key" : "Qy1z8uyQoVC603KLov9vxC5J"
                }
            });
            sessionStorage.setItem("isRynanAuthentication", response.data.token);
            return response.data;
        } catch(error) {
            throw error
        }
    }, 

    getStationListByRyan: async function() { // inclding stations are gotten by Ryan api
        try {
            const ryaneToken = await this.returnRynanToken();
            const response = await axios.get(`${RYNAN_URL}get-list-stations`,
                {
                    headers: {
                        "x-access-token" : ryaneToken,
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
    },

    returnRynanToken: async function () {
        if(!sessionStorage.getItem('isRynanAuthentication')) {
            await this.login();
        }
        return sessionStorage.getItem('isRynanAuthentication');
    }
}