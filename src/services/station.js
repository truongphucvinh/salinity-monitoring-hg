import axios from "axios";

const BASE_URL = "http://103.221.220.183:8088/"

export default {
    getStationList: async function() {
        try {
            const response = await axios.get(BASE_URL+'ctu/geo/things')
            return response.data;
        } catch(error) {
            throw error;
        }
    },

    createStation: async function(thingId, stationInfo) {
        try {
            const response = await axios.post(BASE_URL+`ctu/geo/stations/thing/${thingId}`, stationInfo);
            return response;
        } catch(error) {
            throw error;
        }
    },

    deleteStation: async function(stationId) {
        try {
            const response = await axios.delete(BASE_URL+`ctu/geo/stations/${stationId}`);
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
            console.log("response login: ", responseLogin);
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
    }
}