import axios from "axios";

const BASE_URL = "http://103.221.220.183:8026/"

export default {
    getStationList: async function() {
        try {
            const response = await axios.get(BASE_URL+'things')
            return response.data;
        } catch(error) {
            throw error;
        }
    },

    createStation: async function(thingId, stationInfo) {
        try {
            const response = await axios.post(BASE_URL+`stations/thing/${thingId}`, stationInfo);
            return response;
        } catch(error) {
            throw error;
        }
    },

    deleteStation: async function(stationId) {
        try {
            const response = await axios.delete(BASE_URL+`stations/${stationId}`);
            return response;
        } catch(error) {
            throw error;
        }
    },

    //Rynan
    login: async function() {
        try {
            const response = await axios.post("https://document.rynangate.com/api/v1/auth", {
                "user_name" : "demo.partner",
                "password" : "DemoPartner@123"
            }, {
                headers: {
                    "x-api-key" : "baK5nWEBD6ARJNU8uPSMTrfq"
                }
            });
            return response.data;
        } catch(error) {
            throw error
        }
    }, 

    getStationListByRyan: async function() { // inclding stations are gotten by Ryan api
        try {
            const responseLogin = await this.login();
            const response = await axios.get("https://document.rynangate.com/api/v1/get-list-stations",
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
    },

    loginNewVersion: async function() {
        const username = process.env.REACT_APP_RYNAN_USERNAME
        const password = process.env.REACT_APP_RYNAN_PASSWORD
        const xApiKey = process.env.REACT_APP_RYNAN_X_API_KEY
        try {
            const response = await axios.post("https://api-mekong.rynangate.com/api/v1/auth", {
                "user_name" : username,
                "password" : password
            }, {
                headers: {
                    "x-api-key" : xApiKey
                }
            });
            return response.data;
        } catch(error) {
            throw error
        }
    }, 

    getStationListByRynanNewVersion: async function() {
        try {
            const xApiKey = process.env.REACT_APP_RYNAN_X_API_KEY
            const responseLogin = await this.loginNewVersion();
            const response = await axios.get("https://api-mekong.rynangate.com/api/v1/get-list-stations",
                {
                    headers: {
                        "x-access-token" : responseLogin.token,
                        "x-api-key" : xApiKey
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}